#!/bin/bash
# Build script that fetches Canvas data before building the site

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Fetching Canvas Staff Data ==="
cd "$PROJECT_ROOT"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 is required but not found"
    exit 1
fi

# Run the Python script to fetch Canvas data
python3 "$SCRIPT_DIR/fetch-canvas-staff.py"

if [ $? -ne 0 ]; then
    echo "WARNING: Failed to fetch Canvas data. Building with existing data or fallback."
    # Continue with build even if fetch fails
fi

echo ""
echo "=== Building Site ==="
npm run build:only

echo ""
echo "=== Build Complete ==="

