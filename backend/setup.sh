#!/bin/bash
# Automated Django Backend Setup Script for Badminton Kenya OS

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════"
echo "  Badminton Kenya OS - Django Backend Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python installation
echo -e "${YELLOW}[1/7] Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 is not installed${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓ Python ${PYTHON_VERSION} found${NC}"
echo ""

# Navigate to backend directory
echo -e "${YELLOW}[2/7] Setting up project directory...${NC}"
cd "$(dirname "$0")/backend" || exit 1
echo -e "${GREEN}✓ Working directory: $(pwd)${NC}"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}[3/7] Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi
echo ""

# Activate virtual environment
echo -e "${YELLOW}[4/7] Activating virtual environment...${NC}"
# Determine the activation script based on OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}[5/7] Installing dependencies...${NC}"
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Run migrations
echo -e "${YELLOW}[6/7] Setting up database...${NC}"
python manage.py migrate --noinput
echo -e "${GREEN}✓ Database migrations applied${NC}"
echo ""

# Seed initial data
echo -e "${YELLOW}[7/7] Seeding initial data...${NC}"
python manage.py seed_data
echo -e "${GREEN}✓ Initial data seeded${NC}"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "To start the development server, run:"
echo -e "${YELLOW}cd backend${NC}"
echo -e "${YELLOW}source venv/bin/activate  # On Windows: venv\\Scripts\\activate${NC}"
echo -e "${YELLOW}python manage.py runserver${NC}"
echo ""
echo "Admin Panel: http://127.0.0.1:8000/admin/"
echo "Default Admin Email: admin@badminton.ke"
echo "Default Admin Password: admin123"
echo ""
echo "API Documentation: See DJANGO_BACKEND_SETUP.md"
echo ""
