# CSE 140 Course Website

A modern, responsive course website for CSE 140 - Introduction to Artificial Intelligence at UC Santa Cruz. This website integrates with Canvas LMS to automatically fetch teaching staff information and provides a comprehensive course information hub.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Canvas Integration](#canvas-integration)
  - [Creating a Canvas API Token](#creating-a-canvas-api-token)
  - [Fetching Canvas Details](#fetching-canvas-details)
  - [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Updating Course Content](#updating-course-content)
  - [Updating Links and Due Dates](#updating-links-and-due-dates)
  - [Updating Syllabus](#updating-syllabus)
  - [Updating Instructor Bios](#updating-instructor-bios)
- [Building and Deployment](#building-and-deployment)
- [Project Structure](#project-structure)
- [Acknowledgments](#acknowledgments)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and **npm** or **bun**
- **Python 3** (v3.8 or higher)
- **Git**

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:rajatmaheshwari17/CSE-140-Website.git
   cd CSE-140-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section for details).

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   # or
   bun run build
   ```

## Canvas Integration

This website uses the [LMS Toolkit](https://github.com/edulinq/lms-toolkit) to fetch teaching staff information from Canvas. The integration automatically retrieves instructor, TA, and tutor information at build time.

### Creating a Canvas API Token

To fetch data from Canvas, you need to create an API token:

1. **Log in to Canvas:**
   - Navigate to your Canvas instance (e.g., `https://canvas.ucsc.edu`)

2. **Access Account Settings:**
   - Click on your profile picture/avatar in the top-left corner
   - Select **"Account"** from the dropdown menu
   - Click **"Settings"** in the left sidebar

3. **Generate New Access Token:**
   - Scroll down to the **"Approved Integrations"** section
   - Click **"+ New Access Token"**
   - Enter a **Purpose** (e.g., "CSE 140 Website")
   - Optionally set an expiration date (or leave blank for no expiration)
   - Click **"Generate Token"**

4. **Copy the Token:**
   - **Important:** Copy the token immediately - it will only be shown once!
   - Store it securely (you'll need it for configuration)

5. **Token Permissions:**
   - The token will have the same permissions as your Canvas account
   - Ensure your account has access to the course you want to fetch data from

### Fetching Canvas Details

The website automatically fetches Canvas staff data during the build process. Here's how it works:

1. **Automatic Fetching:**
   - The build script (`scripts/build-with-canvas.sh`) automatically runs `scripts/fetch-canvas-staff.py` before building


      ```bash
      npm run build
      ```
   - This script uses the LMS Toolkit to connect to Canvas and fetch course staff

2. **Manual Fetching:**
   You can manually fetch Canvas staff data at any time:
   ```bash
   npm run fetch-canvas
   # or
   python3 scripts/fetch-canvas-staff.py
   ```

3. **What Gets Fetched:**
   - Course name
   - Instructor information (name, email)
   - Teaching Assistants (TAs) with their sections
   - Tutors/Readers with their contact information
   - All data is saved to `src/data/canvas-staff.json`

4. **Automatic Instructor Bio Updates:**
   - The script automatically updates `src/data/instructor-bio.json` when fetching Canvas data
   - Any new instructors found in Canvas that don't already exist in `instructor-bio.json` are automatically added
   - New instructor entries are created with:
     - The instructor's name (matching Canvas)
     - No `title` field (so title won't be displayed)
     - A fallback bio message: "Bio not available for this instructor."
   - Existing instructor entries in `instructor-bio.json` are **never modified** - your custom bios and titles are preserved
   - You can then manually edit `instructor-bio.json` to add custom bios and titles for any instructors

5. **Troubleshooting:**

6. **Troubleshooting:**
   - If fetching fails, the build will continue with existing data or fallback values
   - Check that your Canvas token has proper permissions
   - Verify the course ID is correct
   - Ensure the `lms-toolkit` directory exists and is properly set up

### Configuration

Configure Canvas integration using environment variables. Set these values in your `.env.local` file:

```bash
CANVAS_SERVER=canvas.ucsc.edu
CANVAS_TOKEN=YOUR_CANVAS_API_TOKEN
CANVAS_COURSE_ID=YOUR_COURSE_ID
```

**Fields:**
- `CANVAS_SERVER`: Your Canvas instance URL (without `https://`)
- `CANVAS_TOKEN`: Your Canvas API token (from the steps above)
- `CANVAS_COURSE_ID`: Your Canvas course ID (can be the numeric ID or course name)

**Note:** You can also set these as system environment variables, but using `.env.local` is recommended for local development.

#### Finding Your Course ID

1. **Method 1: From Canvas URL**
   - Navigate to your course in Canvas
   - Look at the URL: `https://canvas.ucsc.edu/courses/123456`
   - The number after `/courses/` is your course ID (e.g., `123456`)

2. **Method 2: From Course Settings**
   - Go to your course in Canvas
   - Click **"Settings"** in the left sidebar
   - Scroll down to find the **"Course ID"** (numeric value)

3. **Method 3: Using Course Name**
   - You can also use the course name (e.g., "CSE 140 - Fall 2024")
   - The LMS Toolkit will resolve it automatically

## Environment Variables

Create a `.env.local` file in the root directory to configure various aspects of the website. Here's a sample template:
```bash
# Canvas Fetch
VITE_CANVAS_API_BASE_URL=https://canvas.ucsc.edu
VITE_CANVAS_COURSE_ID=1234
VITE_CANVAS_API_TOKEN=canvas_api_token

# Google Docs URLs for embedded iframes
VITE_CALENDAR_URL=https://docs.google.com/document/d/1L1iCRayCBm1d1k2B9QrTdymtCrEicXc2li1hXPdKYL0/edit?tab=t.0
VITE_OFFICE_HOURS_URL=https://docs.google.com/document/d/1qlxvJ-XVo97HnBuxywVqQFlHlZlN4aj01F6ecovUPvM/edit?tab=t.0

# Discussion & Forms URLs
VITE_ED_DISCUSSION_URL=https://edstem.org/us/courses/87555/discussion
VITE_PROGRAMMING_ASSIGNMENT_FEEDBACK_URL=https://docs.google.com/document/d/1dv4JcX2gDdzDs0zQih538W2e7_9PWSjfHXkOX-XPbpQ/edit?tab=t.0
VITE_STUDY_GROUP_FORM_URL=https://docs.google.com/spreadsheets/d/1Zp8oONdAD9V-KqNKsvSe4CbqrF9v43dFGaby9vJ1k0U/edit?gid=1671569792#gid=1671569792

# Tournament URL
VITE_TOURNAMENT_URL=http://seacliff.soe.ucsc.edu/cse140-f25/tournaments/

# Due Dates
# VITE_PROJECT_0_DUE_DATE=January 15, 2024 @ 11:59 pm
# VITE_PROJECT_1_DUE_DATE=February 1, 2024
# VITE_PROJECT_2_DUE_DATE=February 15, 2024
# VITE_PROJECT_3_DUE_DATE=March 1, 2024
# VITE_PROJECT_4_DUE_DATE=March 15, 2024
   ```


### Environment Variable Reference

| Variable | Description | Required | Default | File |
|----------|-------------|----------|---------|------|
| `VITE_PROJECT_0_DUE_DATE` | Due date for Project 0 | No | "TBD" | `src/pages/Projects.tsx` |
| `VITE_PROJECT_1_DUE_DATE` | Due date for Project 1 | No | "TBD" | `src/pages/Projects.tsx` |
| `VITE_PROJECT_2_DUE_DATE` | Due date for Project 2 | No | "TBD" | `src/pages/Projects.tsx` |
| `VITE_PROJECT_3_DUE_DATE` | Due date for Project 3 | No | "TBD" | `src/pages/Projects.tsx` |
| `VITE_PROJECT_4_DUE_DATE` | Due date for Project 4 | No | "TBD" | `src/pages/Projects.tsx` |
| `VITE_ED_DISCUSSION_URL` | Ed Discussion forum URL | No | Hardcoded fallback | `src/pages/Home.tsx`, `src/pages/HomeHardcoded.tsx` |
| `VITE_PROGRAMMING_ASSIGNMENT_FEEDBACK_URL` | Programming assignment feedback document URL | No | Hardcoded fallback | `src/pages/Home.tsx`, `src/pages/HomeHardcoded.tsx` |
| `VITE_TOURNAMENT_URL` | Tournament/competition URL | No | Hidden if not set | `src/pages/Home.tsx`, `src/pages/HomeHardcoded.tsx` |
| `VITE_STUDY_GROUP_FORM_URL` | Study group signup form URL | No | Hardcoded fallback | `src/pages/Home.tsx`, `src/pages/HomeHardcoded.tsx` |
| `VITE_CALENDAR_URL` | Course calendar Google Doc URL | No | Hardcoded fallback | `src/hooks/use-iframe-preloader.tsx`, `src/pages/CourseCalendar.tsx` |
| `VITE_OFFICE_HOURS_URL` | Office hours Google Doc URL | No | Hardcoded fallback | `src/hooks/use-iframe-preloader.tsx`, `src/pages/TeachingStaff.tsx` |
| `CANVAS_SERVER` | Canvas instance URL (without https://) | Yes (for Canvas) | None | `scripts/fetch-canvas-staff.py` |
| `CANVAS_TOKEN` | Canvas API token | Yes (for Canvas) | None | `scripts/fetch-canvas-staff.py` |
| `CANVAS_COURSE_ID` | Canvas course ID or name | Yes (for Canvas) | None | `scripts/fetch-canvas-staff.py` |
| `SKIP_EMAIL_FETCH` | Skip email fetching (set to "1") | No | "0" | `scripts/fetch-canvas-staff.py` |

**Note:** All `VITE_` prefixed variables are exposed to the client-side code. Do not put sensitive information in these variables.

## Updating Course Content

### Updating Links and Due Dates

#### Project Due Dates

Project due dates can be updated in two ways:

1. **Using Environment Variables (Recommended):**
   - Update the `VITE_PROJECT_X_DUE_DATE` variables in `.env.local`
   - Rebuild the site: `npm run build`

2. **Direct Code Edit:**
   - Edit `src/pages/Projects.tsx`
   - Modify the `getDueDate()` function or the project data array

#### External Links

External links (Ed Discussion, Google Docs, etc.) can be updated:

1. **Using Environment Variables:**
   - Update the corresponding `VITE_*_URL` variables in `.env.local`
   - Rebuild the site

2. **Direct Code Edit:**
   - Edit `src/pages/Home.tsx` or `src/pages/HomeHardcoded.tsx`
   - Update the hardcoded URLs or environment variable references

#### GitHub Repository Links

Project GitHub links are hardcoded in `src/pages/Projects.tsx`. To update:

1. Open `src/pages/Projects.tsx`
2. Find the `projects` array (around line 35)
3. Update the `link` field for each project:
   ```typescript
   {
     title: 'Project 0: Unix/Python Tutorial',
     description: '...',
     link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p0',
     dueDate: getDueDate(0),
   }
   ```

### Updating Syllabus

The syllabus content is stored in `src/data/course-content.json`. This JSON file contains all the course information displayed on the home page.

#### Structure

The `course-content.json` file has the following main sections:

- `courseDescription`: Course overview, topics, textbook, prerequisites
- `communicationChannels`: Announcements, Ed Discussion info, guidelines
- `qaEtiquette`: Q&A platform etiquette rules
- `grading`: Grade components and grade scale
- `learningOutcomes`: Course learning objectives
- `classParticipationAndAbsences`: Participation requirements and absence policies
- `assignmentsAndAssessment`: Worksheets, quizzes, programming assignments details
- `importantPolicies`: Re-grading, academic integrity, excused absences, support resources

#### How to Update

1. **Open the file:**
   ```bash
   code src/data/course-content.json
   # or use your preferred editor
   ```

2. **Edit the relevant section:**
   - Each section is clearly labeled
   - Maintain the JSON structure (proper quotes, commas, brackets)
   - You can use HTML in text fields (e.g., `<strong>`, `<a href="...">`)

3. **Example: Updating Grade Components**
   ```json
   "gradeComponents": {
     "title": "Grade Components",
     "items": [
       {
         "item": "Class Participation + In-Class Exercise",
         "weight": "5%"
       },
       {
         "item": "Worksheets",
         "weight": "25%"
       }
       // ... more items
     ]
   }
   ```

4. **Example: Updating Course Description**
   ```json
   "courseDescription": {
     "title": "Course Description",
     "icon": "BookOpen",
     "iconColor": "green",
     "description": "Your updated course description here...",
     "topicsCovered": {
       "title": "Topics Covered",
       "content": "Updated topics list..."
     }
   }
   ```

5. **Validate JSON:**
   - Use a JSON validator to ensure your changes are valid
   - Most editors have built-in JSON validation
   - Or use online tools like [JSONLint](https://jsonlint.com/)

6. **Test your changes:**
   ```bash
   npm run dev
   ```
   - Navigate to the home page to see your changes
   - Check that all sections render correctly

#### Tips

- **HTML Support:** You can use HTML tags in text fields for formatting:
  - `<strong>text</strong>` for bold
  - `<a href="url">link text</a>` for links
  - `<em>text</em>` for italic

- **Links:** When adding links, use the full URL and include `target="_blank" rel="noopener noreferrer"` in the HTML:
  ```html
  <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link Text</a>
  ```

- **Arrays:** When updating arrays (like grade components or learning outcomes), ensure each item follows the same structure

- **Backup:** Always backup `course-content.json` before making major changes

#### Fetching Syllabus from Canvas

The LMS Toolkit supports fetching syllabus directly from Canvas. However, this website currently uses a JSON file for more control over formatting. If you want to fetch from Canvas:

1. **Using LMS Toolkit CLI:**
   ```bash
   cd lms-toolkit
   python3 -m lms.cli.courses.syllabus.get --course "YOUR_COURSE_ID"
   ```

2. **Integration:**
   - You could modify `scripts/fetch-canvas-staff.py` to also fetch the syllabus
   - Save it to a JSON file or parse it for use in the website

### Updating Instructor Bios

Instructor bios and titles are stored in `src/data/instructor-bio.json`. This file allows you to provide personalized bios for each instructor, which are matched to Canvas data by name.

**Important:** The `instructor-bio.json` file is automatically updated when you fetch Canvas staff data. New instructors from Canvas are automatically added with a fallback bio, but your existing entries are never modified - you can safely customize bios and titles without them being overwritten.

#### Structure

The `instructor-bio.json` file has the following structure:

```json
{
  "instructor_bios": [
    {
      "name": "Instructor Full Name",
      "title": "Instructor Title (optional)",
      "bio": "Instructor bio text here..."
    }
  ]
}
```

#### Automatic Entry Creation

When you fetch Canvas staff data (via `npm run build` or manually), the script automatically:

1. **Checks existing entries** in `instructor-bio.json`
2. **Adds new instructors** from Canvas that aren't already in the file
3. **Creates entries** with:
   - Instructor name (from Canvas)
   - No `title` field (so title won't be displayed)
   - Fallback bio: "Bio not available for this instructor."
4. **Preserves existing entries** - your custom bios and titles are never modified

This means you don't need to manually create entries for new instructors - they're added automatically, and you can then edit the file to customize their bios and titles.

#### How to Update

1. **Automatic Method (Recommended):**
   - Run `npm run build` or `python3 scripts/fetch-canvas-staff.py`
   - The script will automatically add any new instructors
   - Then edit `instructor-bio.json` to customize bios and titles

2. **Manual Method:**
   - Open the file:
     ```bash
     code src/data/instructor-bio.json
     # or use your preferred editor
     ```
   - Add or update instructor entries manually
   - Each instructor should have a `name`, `bio`, and optionally a `title`
   - The `name` field must match exactly (case-insensitive, whitespace-trimmed) with the instructor's name from Canvas
   - Entries can be in any order - the system will match them by name

3. **Example: Adding a New Instructor Bio**
   ```json
   {
     "instructor_bios": [
       {
         "name": "Niloofar Montazeri",
         "title": "Assistant Teaching Professor",
         "bio": "My name is Niloofar Montazeri, and I am your instructor for CSE 140. I am an Assistant Teaching Professor at UC Santa Cruz..."
       },
       {
         "name": "Another Instructor",
         "title": "Professor",
         "bio": "Another instructor's bio here..."
       }
     ]
   }
   ```

4. **Example: Instructor Without Title**
   ```json
   {
     "name": "Instructor Name",
     "bio": "Instructor bio text here..."
   }
   ```
   - If `title` is omitted, the title field won't be displayed
   - The bio and email will remain in their normal positions

5. **Matching Rules:**
   - The system matches instructors by name (case-insensitive)
   - Whitespace is trimmed from both the JSON name and Canvas name before matching
   - If no matching bio is found, a fallback message will be displayed: "Bio not available for this instructor."
   - If no matching title is found, the title field will be hidden (space preserved)

6. **Multiple Instructors:**
   - The system supports multiple instructors automatically
   - Each instructor from Canvas will get their own card
   - Add separate entries in the JSON file for each instructor
   - The first instructor appears in a large card, additional instructors appear below in the same format

7. **Validate JSON:**
   - Use a JSON validator to ensure your changes are valid
   - Most editors have built-in JSON validation
   - Or use online tools like [JSONLint](https://jsonlint.com/)

8. **Test your changes:**
   ```bash
   npm run dev
   ```
   - Navigate to the Teaching Staff page to see your changes
   - Verify that bios match correctly to the right instructors
   - Check that titles appear or are hidden as expected

#### Tips

- **Automatic Entry Creation:** New instructors from Canvas are automatically added to `instructor-bio.json` when you fetch Canvas data. You don't need to manually create entries - just fetch the data and then customize the bios and titles.
- **Existing Entries Are Safe:** Your existing custom bios and titles are never modified by the automatic update process. Only new instructors are added.
- **Name Matching:** The system matches instructors by name (case-insensitive, whitespace-trimmed). Ensure the name in the JSON exactly matches the name from Canvas.
- **Title is Optional:** You can omit the `title` field entirely if you don't want to display a title for an instructor. The layout will preserve the space.
- **Bio Fallback:** If a bio is missing, a fallback message will be shown. New instructors are automatically added with the fallback bio, which you can then customize.
- **Order Doesn't Matter:** The entries in `instructor_bios` can be in any order - they're matched by name, not position.
- **Multiple Instructors:** When you have multiple instructors, each will get their own card. The automatic update process handles multiple instructors automatically.
- **Backup:** Always backup `instructor-bio.json` before making major changes

#### How It Works

1. **Canvas Data Fetching:**
   - The Canvas staff data is fetched and includes instructor names and emails
   - This data is saved to `canvas-staff.json`
   - **Automatically:** Any new instructors found in Canvas are added to `instructor-bio.json` with a fallback bio and no title

2. **Display Logic:**
   - The `TeachingStaff.tsx` component loads both `canvas-staff.json` and `instructor-bio.json`
   - For each instructor from Canvas, it searches for a matching entry in `instructor-bio.json` by name (case-insensitive)
   - If found, it uses the bio and title from the JSON file
   - If not found, it uses fallback values (no title, default bio message)

3. **Automatic Updates:**
   - When fetching Canvas data, the script checks `instructor-bio.json` for existing entries
   - New instructors from Canvas are automatically added with a fallback bio
   - Existing entries are **never modified** - your custom bios and titles are preserved
   - This ensures all instructors have entries in `instructor-bio.json`, making it easy to customize them

This allows you to manage instructor bios separately from Canvas data, making it easy to customize bios without modifying the automatically-generated Canvas data. The automatic entry creation means you don't need to manually create entries for new instructors - they're added automatically, and you can then customize their bios and titles.

## Building and Deployment

### Development Build

```bash
npm run dev
```

This starts a development server with hot-reloading at `http://localhost:5173` (or the next available port).

### Production Build

```bash
npm run build
```

This command:
1. Fetches Canvas staff data (if configured)
2. Builds the React application
3. Outputs optimized files to the `dist/` directory

### Build Without Canvas Fetch

If you want to skip Canvas data fetching:

```bash
npm run build:only
```

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Deployment

The `dist/` directory contains all static files ready for deployment. You can deploy to:

- **GitHub Pages:** Use GitHub Actions or manual deployment
- **Netlify:** Connect your repository and set build command to `npm run build`
- **Vercel:** Connect your repository and set build command to `npm run build`
- **Any static hosting:** Upload the `dist/` directory contents

**Important:** Make sure to set environment variables in your hosting platform's settings if you're using them.

## Project Structure

```
CSE-140-Website/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # UI component library (shadcn/ui)
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Footer.tsx      # Footer component
│   │   └── HeroSection.tsx # Hero section component
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Home page (main syllabus)
│   │   ├── CourseCalendar.tsx
│   │   ├── CourseMaterial.tsx
│   │   ├── TeachingStaff.tsx
│   │   └── Projects.tsx
│   ├── data/               # Data files
│   │   ├── canvas-staff.json      # Canvas staff data (auto-generated)
│   │   ├── course-content.json    # Syllabus content (manual edit)
│   │   └── instructor-bio.json    # Instructor bios and titles (manual edit)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── main.tsx            # Application entry point
├── scripts/
│   ├── build-with-canvas.sh    # Build script with Canvas fetch
│   └── fetch-canvas-staff.py   # Canvas data fetching script
├── lms-toolkit/            # LMS Toolkit submodule
├── .env.local              # Environment variables (create this)
├── package.json
└── vite.config.ts
```

## Acknowledgments

This project would not have been possible without the following contributions and tools:

### LMS Toolkit

This website uses the **[LMS Toolkit](https://github.com/edulinq/lms-toolkit)** - a comprehensive Python library and CLI tool suite for interacting with Learning Management Systems (LMSs) like Canvas. The LMS Toolkit provides:

- Robust Canvas API integration
- User-friendly CLI tools for course management
- Support for fetching courses, assignments, users, groups, and more
- Well-documented API and extensive test coverage

**Repository:** [https://github.com/edulinq/lms-toolkit](https://github.com/edulinq/lms-toolkit)

**Documentation:** [https://edulinq.github.io/lms-toolkit](https://edulinq.github.io/lms-toolkit)

### Edulinq

Special thanks to **[Edulinq](https://github.com/edulinq)** for developing and maintaining the LMS Toolkit. Edulinq's commitment to creating open-source educational tools has made Canvas integration seamless and reliable for this project.

### Eriq Augustine

We extend our sincere gratitude to **Eriq Augustine** for his invaluable help and contributions throughout the development of this website. His expertise, guidance, and support have been instrumental in:

- Canvas integration implementation
- LMS Toolkit integration and troubleshooting
- Code review and best practices
- Technical guidance and mentorship

Eriq's contributions have significantly improved the quality and functionality of this project.

### Professor Niloofar Montazeri

We are deeply grateful to **Professor Niloofar Montazeri** for her guidance, mentorship, and for providing us with the opportunity to work on this project. Her support and encouragement have been essential in bringing this course website to life. Professor Montazeri's dedication to education and her students has been a constant source of inspiration throughout this development process.

### Additional Credits

- **UC Santa Cruz** - For providing the course infrastructure and Canvas LMS
- **React** and **Vite** - For the excellent development experience
- **shadcn/ui** - For the beautiful UI component library
- **Framer Motion** - For smooth animations and interactions
- **Spline** - For the 3D hero section
