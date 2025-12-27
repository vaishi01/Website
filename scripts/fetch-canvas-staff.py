#!/usr/bin/env python3
"""
Fetch course staff (instructors, TAs, tutors) from Canvas using lms-toolkit.
This script runs at build time to fetch and save staff data to a JSON file.
"""

import json
import os
import sys
import signal
from pathlib import Path

# Load environment variables from .env.local if it exists
def load_env_local():
    """Load environment variables from .env.local file."""
    env_local_path = Path(__file__).parent.parent / '.env.local'
    if env_local_path.exists():
        with open(env_local_path, 'r') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue
                # Parse KEY=VALUE format
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    # Only set if not already in environment
                    if key not in os.environ:
                        os.environ[key] = value

# Load .env.local before loading config
load_env_local()

# Add lms-toolkit to path
lms_toolkit_path = Path(__file__).parent.parent / 'lms-toolkit'
if not lms_toolkit_path.exists():
    print("WARNING: lms-toolkit not found. Canvas data fetching will be skipped.")
    print("The site will build with existing data or fallback values.")
    sys.exit(0)

sys.path.insert(0, str(lms_toolkit_path))

try:
    import lms.backend.instance
    import lms.model.users
except ImportError as e:
    print(f"WARNING: Failed to import lms-toolkit modules: {e}")
    print("Canvas data fetching will be skipped. The site will build with existing data.")
    sys.exit(0)

# Try to import requests, but make it optional
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("WARNING: requests library not found. Email fetching will be skipped.")


def load_config():
    """Load Canvas configuration from environment variables."""
    # Try standard environment variable names first, then VITE_ prefixed ones as fallback
    config = {
        'server': os.getenv('CANVAS_SERVER') or os.getenv('VITE_CANVAS_API_BASE_URL', '').replace('https://', '').replace('http://', '') or 'canvas.ucsc.edu',
        'token': os.getenv('CANVAS_TOKEN') or os.getenv('VITE_CANVAS_API_TOKEN'),
        'course': os.getenv('CANVAS_COURSE_ID') or os.getenv('VITE_CANVAS_COURSE_ID')
    }
    
    if not config['token']:
        print('ERROR: Canvas token not found. Set CANVAS_TOKEN or VITE_CANVAS_API_TOKEN environment variable')
        sys.exit(1)
    
    if not config['course']:
        print('ERROR: Canvas course ID not found. Set CANVAS_COURSE_ID or VITE_CANVAS_COURSE_ID environment variable')
        sys.exit(1)
    
    return config


def fetch_course_staff(config):
    """Fetch course staff from Canvas and organize by role."""
    print(f"Connecting to Canvas server: {config['server']}")
    print(f"Fetching users for course: {config['course']}")
    
    # Get backend instance
    backend = lms.backend.instance.get_backend(
        server=config['server'],
        token=config['token']
    )
    
    # Parse course query
    course_query = backend.parse_course_query(str(config['course']))
    if course_query is None:
        print(f"ERROR: Invalid course query: {config['course']}")
        sys.exit(1)
    
    # Resolve course query to get actual course
    resolved_course = backend.resolve_course_query(course_query)
    course_id = resolved_course.get_id()
    course_name = resolved_course.name or 'CSE 140'
    
    print(f"Course: {course_name}")
    
    # Fetch all course users
    print("Fetching all course users...")
    users = backend.courses_users_resolve_and_list(course_query)
    print(f"  Fetched {len(users)} total users")
    
    # Debug: Print all users with their roles
    print("\n  DEBUG: All users and their roles:")
    user_roles_summary = {}
    for user in users:
        raw_role = getattr(user, 'raw_role', 'Unknown')
        role = getattr(user, 'role', None)
        role_value = role.value if role else 'None'
        role_key = f"{raw_role} ({role_value})"
        user_roles_summary[role_key] = user_roles_summary.get(role_key, 0) + 1
        print(f"    - {user.name} (ID: {user.id}): {raw_role} / {role_value}")
    
    print(f"\n  DEBUG: Role summary:")
    for role_key, count in sorted(user_roles_summary.items()):
        print(f"    - {role_key}: {count}")
    
    # Create a set of user IDs we already have
    existing_user_ids = {user.id for user in users}
    # Helper function to fetch user email from Canvas API
    def fetch_user_email(user_id: str, user_name: str) -> str:
        """Fetch user email by making a direct API call to Canvas."""
        if not HAS_REQUESTS:
            return ''
        try:
            # Ensure server URL has proper protocol
            server_url = backend.server
            if not server_url.startswith('http'):
                server_url = 'https://' + server_url
            
            # Try the users endpoint first (more complete user data)
            url = f"{server_url}/api/v1/users/{user_id}"
            headers = backend.get_standard_headers()
            
            # Use shorter timeout to avoid hanging (3 seconds)
            response = requests.get(url, headers=headers, timeout=3)
            if response.status_code == 200:
                user_data = response.json()
                # Try multiple fields where email might be stored
                email = (
                    user_data.get('email') or 
                    user_data.get('login_id') or 
                    user_data.get('primary_email') or
                    ''
                )
                if email:
                    return email
            
            # Fallback to profile endpoint (skip if we got 403 on users endpoint)
            if response.status_code != 403:
                url = f"{server_url}/api/v1/users/{user_id}/profile"
                response = requests.get(url, headers=headers, timeout=3)
                if response.status_code == 200:
                    profile_data = response.json()
                    email = (
                        profile_data.get('email') or 
                        profile_data.get('login_id') or 
                        profile_data.get('primary_email') or
                        ''
                    )
                    if email:
                        return email
        except requests.exceptions.Timeout:
            # Timeout - skip this user
            return ''
        except requests.exceptions.RequestException:
            # Network error - skip this user
            return ''
        except Exception:
            # Any other error - skip this user
            return ''
        return ''
    
    # Organize users by role and fetch emails
    instructors = []
    tas = []
    tutors = []
    
    print("\nOrganizing users by role...")
    
    # First pass: organize users by role (without fetching emails yet)
    # We'll organize them in order: instructor, TAs, tutors/readers
    instructor_users = []
    ta_users = []
    tutor_users = []
    
    for user in users:
        # Map Canvas enrollment types to our roles
        raw_role = getattr(user, 'raw_role', '')
        role = getattr(user, 'role', None)
        role_value = role.value if role else None
        
        user_data = {
            'name': user.name or 'Unknown',
            'email': user.email or '',  # Use email from initial fetch if available
            'id': user.id
        }
        
        # Canvas enrollment types: TeacherEnrollment, TaEnrollment, StudentEnrollment, 
        # TutorEnrollment, ReaderEnrollment, DesignerEnrollment, etc.
        # Check for instructor/teacher/professor roles
        if raw_role == 'TeacherEnrollment' or role_value == 'owner':
            instructors.append(user_data)
            instructor_users.append((user, 'instructor'))
        # Check for TA roles
        elif raw_role == 'TaEnrollment' or role_value == 'grader':
            user_data['sections'] = ''  # Can be filled from groups or manually
            tas.append(user_data)
            ta_users.append((user, 'ta'))
        # Check for Tutor and Reader roles (both displayed as tutors)
        # Canvas may use "Tutor", "Reader", "TutorEnrollment", or "ReaderEnrollment"
        elif raw_role in ['TutorEnrollment', 'ReaderEnrollment', 'Tutor', 'Reader']:
            tutors.append(user_data)
            tutor_users.append((user, 'tutor'))
    
    # Print in organized order: instructor, TAs, tutors/readers
    for user, role_type in instructor_users:
        raw_role = getattr(user, 'raw_role', '')
        print(f"  → Instructor: {user.name} ({raw_role})")
    
    for user, role_type in ta_users:
        raw_role = getattr(user, 'raw_role', '')
        print(f"  → TA: {user.name} ({raw_role})")
    
    for user, role_type in tutor_users:
        raw_role = getattr(user, 'raw_role', '')
        print(f"  → Tutor/Reader: {user.name} ({raw_role})")
    
    # If no instructor found but we have users, check for other admin roles
    if not instructors and users:
        # Look for any user with admin/owner role or DesignerEnrollment
        for user in users:
            raw_role = getattr(user, 'raw_role', '')
            role = getattr(user, 'role', None)
            if (raw_role == 'DesignerEnrollment' or 
                (role and role.value in ['owner', 'admin'])):
                instructor_data = {
                    'name': user.name or 'Unknown',
                    'email': user.email or '',
                    'id': user.id
                }
                instructors.append(instructor_data)
                instructor_users.append((user, 'instructor'))
                print(f"  → Instructor: {user.name} ({raw_role})")
                break
    
    # Combine all staff users in order for email fetching: instructor, TAs, tutors/readers
    staff_users = instructor_users + ta_users + tutor_users
    
    # Second pass: fetch emails only for staff members who don't have them
    if staff_users and HAS_REQUESTS:
        staff_needing_emails = [(u, rt) for u, rt in staff_users if not (u.email or '').strip()]
        if staff_needing_emails:
            print(f"Fetching email addresses for {len(staff_needing_emails)} staff members...")
            print("(This may take a moment. If it hangs, you can skip email fetching by setting SKIP_EMAIL_FETCH=1)")
            
            # Check if we should skip email fetching
            if os.getenv('SKIP_EMAIL_FETCH') == '1':
                print("Skipping email fetch (SKIP_EMAIL_FETCH=1)")
            else:
                fetched_count = 0
                for user, role_type in staff_needing_emails:
                    print(f"  [{fetched_count + 1}/{len(staff_needing_emails)}] {user.name}...", end=' ', flush=True)
                    try:
                        email = fetch_user_email(user.id, user.name)
                        if email:
                            print(f"✓ {email}")
                            # Update the appropriate list
                            if role_type == 'instructor':
                                for instructor in instructors:
                                    if instructor['id'] == user.id:
                                        instructor['email'] = email
                                        break
                            elif role_type == 'ta':
                                for ta in tas:
                                    if ta['id'] == user.id:
                                        ta['email'] = email
                                        break
                            elif role_type == 'tutor':
                                for tutor in tutors:
                                    if tutor['id'] == user.id:
                                        tutor['email'] = email
                                        break
                        else:
                            print("✗")
                    except KeyboardInterrupt:
                        print("\nEmail fetching interrupted. Continuing with available data...")
                        break
                    except Exception as e:
                        print(f"✗ ({type(e).__name__})")
                    fetched_count += 1
                print(f"Completed email fetching for {fetched_count} staff members.")
        else:
            print("All staff members already have email addresses.")
    elif staff_users and not HAS_REQUESTS:
        print("Skipping email fetching (requests library not available).")
    
    
    return {
        'course_name': course_name,
        'instructors': instructors,
        'tas': tas,
        'tutors': tutors,
        'fetched_at': str(Path(__file__).parent.parent / 'src' / 'data' / 'canvas-staff.json')
    }


def update_instructor_bios(instructors):
    """Update instructor-bio.json with any new instructors found from Canvas."""
    instructor_bio_path = Path(__file__).parent.parent / 'src' / 'data' / 'instructor-bio.json'
    
    # Load existing instructor bios if file exists
    existing_bios = []
    if instructor_bio_path.exists():
        try:
            with open(instructor_bio_path, 'r') as f:
                existing_data = json.load(f)
                existing_bios = existing_data.get('instructor_bios', [])
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not read existing instructor-bio.json: {e}")
            existing_bios = []
    
    # Create a set of existing instructor names (case-insensitive, trimmed)
    existing_names = {
        bio_entry.get('name', '').lower().strip() 
        for bio_entry in existing_bios
    }
    
    # Fallback bio message (matches the one used in TeachingStaff.tsx)
    fallback_bio = 'Bio not available for this instructor.'
    
    # Check each instructor from Canvas and add if not already present
    new_instructors_added = 0
    for instructor in instructors:
        instructor_name = instructor.get('name', '').lower().strip()
        
        # Skip if instructor already exists
        if instructor_name in existing_names:
            continue
        
        # Add new instructor entry with empty title and fallback bio
        new_entry = {
            'name': instructor.get('name', 'Unknown'),
            'bio': fallback_bio
        }
        # Note: We intentionally don't include 'title' field so it won't be displayed
        existing_bios.append(new_entry)
        existing_names.add(instructor_name)
        new_instructors_added += 1
        print(f"  Added new instructor bio entry: {instructor.get('name', 'Unknown')}")
    
    # Save updated instructor bios if any were added
    if new_instructors_added > 0:
        instructor_bio_path.parent.mkdir(parents=True, exist_ok=True)
        data_to_save = {
            'instructor_bios': existing_bios
        }
        
        with open(instructor_bio_path, 'w') as f:
            json.dump(data_to_save, f, indent=2)
        
        print(f"Updated instructor-bio.json: Added {new_instructors_added} new instructor(s)")
    else:
        print(f"instructor-bio.json: All instructors already have entries")


def save_staff_data(staff_data, output_path):
    """Save staff data to JSON file."""
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Remove the fetched_at path before saving
    data_to_save = {
        'course_name': staff_data.get('course_name', 'CSE 140'),
        'instructors': staff_data['instructors'],
        'tas': staff_data['tas'],
        'tutors': staff_data['tutors']
    }
    
    with open(output_path, 'w') as f:
        json.dump(data_to_save, f, indent=2)
    
    print(f"Staff data saved to: {output_path}")
    print(f"  - Instructors: {len(staff_data['instructors'])}")
    print(f"  - TAs: {len(staff_data['tas'])}")
    print(f"  - Tutors: {len(staff_data['tutors'])}")


def main():
    """Main function."""
    config = load_config()
    
    try:
        staff_data = fetch_course_staff(config)
        
        # Save to src/data/canvas-staff.json
        output_path = Path(__file__).parent.parent / 'src' / 'data' / 'canvas-staff.json'
        save_staff_data(staff_data, output_path)
        
        # Update instructor-bio.json with any new instructors
        if staff_data.get('instructors'):
            print("\n=== Updating Instructor Bios ===")
            update_instructor_bios(staff_data['instructors'])
        
        print("\n=== Successfully fetched Canvas staff data ===")
        return 0
    except Exception as e:
        print(f"ERROR: Failed to fetch Canvas staff data: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())

