#!/usr/bin/env python3
"""
Automated Django Backend Setup Script for Badminton Kenya OS
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path


class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    NC = '\033[0m'


def print_header():
    print("═" * 63)
    print("  Badminton Kenya OS - Django Backend Setup")
    print("═" * 63)
    print()


def print_step(number, message):
    print(f"{Colors.YELLOW}[{number}/7] {message}...{Colors.NC}")


def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.NC}")
    print()


def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.NC}")
    print()


def run_command(command, description=""):
    """Run a shell command"""
    try:
        if isinstance(command, str):
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
        else:
            result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode != 0:
            print_error(f"{description}\n{result.stderr}")
            return False
        return True
    except Exception as e:
        print_error(f"{description}: {str(e)}")
        return False


def check_python():
    """Check Python installation"""
    print_step(1, "Checking Python installation")
    
    if sys.version_info < (3, 8):
        print_error(f"Python 3.8+ required, found {sys.version}")
        sys.exit(1)
    
    print_success(f"Python {sys.version.split()[0]} found")


def setup_directories():
    """Setup project directory"""
    print_step(2, "Setting up project directory")
    
    backend_dir = Path(__file__).parent.resolve()
    os.chdir(backend_dir)
    
    print_success(f"Working directory: {os.getcwd()}")


def create_venv():
    """Create virtual environment"""
    print_step(3, "Creating virtual environment")
    
    venv_path = Path("venv")
    
    if venv_path.exists():
        print_success("Virtual environment already exists")
        return venv_path
    
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print_success("Virtual environment created")
        return venv_path
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to create virtual environment: {str(e)}")
        sys.exit(1)


def get_pip_executable():
    """Get the pip executable for the current platform"""
    if platform.system() == "Windows":
        return "venv\\Scripts\\pip.exe"
    else:
        return "venv/bin/pip"


def get_python_executable():
    """Get the Python executable for the current platform"""
    if platform.system() == "Windows":
        return "venv\\Scripts\\python.exe"
    else:
        return "venv/bin/python"


def install_dependencies():
    """Install Python dependencies"""
    print_step(4, "Installing dependencies")
    
    pip_exec = get_pip_executable()
    
    # Upgrade pip
    print("  Upgrading pip...")
    subprocess.run([pip_exec, "install", "--upgrade", "pip", "setuptools", "wheel"],
                   capture_output=True)
    
    # Install requirements
    print("  Installing packages...")
    if not run_command([pip_exec, "install", "-r", "requirements.txt"],
                       "Failed to install dependencies"):
        sys.exit(1)
    
    print_success("Dependencies installed")


def run_migrations():
    """Run database migrations"""
    print_step(5, "Setting up database")
    
    python_exec = get_python_executable()
    
    if not run_command([python_exec, "manage.py", "migrate", "--noinput"],
                       "Failed to run migrations"):
        sys.exit(1)
    
    print_success("Database migrations applied")


def seed_data():
    """Seed initial data"""
    print_step(6, "Seeding initial data")
    
    python_exec = get_python_executable()
    
    if not run_command([python_exec, "manage.py", "seed_data"],
                       "Failed to seed data"):
        sys.exit(1)
    
    print_success("Initial data seeded")


def create_logs_dir():
    """Create logs directory"""
    print_step(7, "Creating logs directory")
    
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    print_success("Logs directory ready")


def print_completion_message():
    """Print completion message"""
    print("═" * 63)
    print(f"{Colors.GREEN}✓ Setup Complete!{Colors.NC}")
    print("═" * 63)
    print()
    print("To start the development server, run:")
    print()
    
    if platform.system() == "Windows":
        print(f"{Colors.YELLOW}cd backend{Colors.NC}")
        print(f"{Colors.YELLOW}venv\\Scripts\\activate{Colors.NC}")
        print(f"{Colors.YELLOW}python manage.py runserver{Colors.NC}")
    else:
        print(f"{Colors.YELLOW}cd backend{Colors.NC}")
        print(f"{Colors.YELLOW}source venv/bin/activate{Colors.NC}")
        print(f"{Colors.YELLOW}python manage.py runserver{Colors.NC}")
    
    print()
    print("Admin Panel:          http://127.0.0.1:8000/admin/")
    print("Default Admin Email:  admin@badminton.ke")
    print("Default Admin Pass:   admin123")
    print()
    print("API Documentation:    See DJANGO_BACKEND_SETUP.md")
    print()


def main():
    """Main setup function"""
    try:
        print_header()
        check_python()
        setup_directories()
        create_venv()
        install_dependencies()
        run_migrations()
        seed_data()
        create_logs_dir()
        print_completion_message()
    except KeyboardInterrupt:
        print_error("\nSetup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"\nUnexpected error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
