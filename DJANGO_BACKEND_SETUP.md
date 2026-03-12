# Badminton Kenya OS - Django Backend Setup Guide

## Overview

This is a complete Django backend for the Badminton Kenya OS application. It serves as the API layer for the React frontend and provides comprehensive tournament management, player ranking, match control, and compliance tracking features.

## Project Structure

```
backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── config/                   # Main Django configuration
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI application
├── project/                  # Main Django app
│   ├── models.py            # All database models
│   ├── views.py             # API views/endpoints
│   ├── urls.py              # App URL routing
│   ├── admin.py             # Django admin configuration
│   ├── apps.py              # App configuration
│   ├── management/
│   │   └── commands/
│   │       └── seed_data.py  # Database seeding command
│   └── migrations/           # Database migrations
└── db.sqlite3               # SQLite database (development)
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

### 2. Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Optional - if not using seed data)

```bash
python manage.py createsuperuser
```

### 6. Seed Initial Data

```bash
python manage.py seed_data
```

This will create:
- Demo counties
- Test users (admin, players, referees)
- Sample clubs
- Test tournaments with categories
- System settings

**Default Admin Credentials:**
- Email: `admin@badminton.ke`
- Password: `admin123`

### 7. Run Development Server

```bash
python manage.py runserver
```

Server will be available at: `http://127.0.0.1:8000`

### 8. Access Admin Panel

Navigate to: `http://127.0.0.1:8000/admin/`

## API Endpoints Overview

### Authentication (No Auth Required)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Profile (Auth Required)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Tournaments
- `GET /api/tournaments` - List tournaments (no auth)
- `POST /api/tournaments` - Create tournament (admin only)
- `GET /api/tournaments/<id>` - Get tournament details
- `PUT /api/tournaments/<id>` - Update tournament (admin)

### Players
- `GET /api/players` - List all players
- `GET /api/players/<id>` - Get player details
- `GET /api/rankings` - Get player rankings

### Matches
- `GET /api/matches` - List matches
- `GET /api/matches/<id>` - Get match details
- `POST /api/matches/<id>/score` - Update match score (referee)

### Clubs
- `GET /api/clubs` - List clubs
- `GET /api/clubs/<id>` - Get club details

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/<id>` - Check payment status

### Admin
- `GET /api/admin/users` - List users (admin only)
- `GET /api/admin/audit-logs` - View audit logs (admin only)
- `GET /api/admin/dashboard` - Dashboard statistics (admin only)

### Disciplinary
- `GET /api/sanctions` - List sanctions
- `GET /api/sanctions/<id>` - Get sanction details
- `POST /api/sanctions/<id>/appeal` - File appeal

### Notifications
- `GET /api/notifications` - Get user notifications

### System
- `GET /api/health` - System health check

## Database Models

The backend includes comprehensive models for:

1. **User Management**
   - User (custom extended)
   - County
   - Role
   - UserRole

2. **Organizations**
   - Club
   - ClubMember

3. **People**
   - Player
   - Referee
   - Ranking

4. **Tournaments**
   - Tournament
   - TournamentCategory
   - TournamentRegistration
   - Draw
   - TournamentBracket

5. **Matches**
   - Match
   - MatchReport

6. **Financial**
   - Payment
   - FinancialTransaction

7. **Compliance**
   - Sanction
   - Appeal
   - DisciplinaryRecord

8. **System**
   - AuditLog
   - Notification
   - Message
   - Communication
   - SystemReport
   - SystemSetting
   - ActivityFeed

## Key Features

### ✅ User Management
- Multi-role user system (Admin, Player, Referee, Club Manager, etc.)
- Custom User model extending Django's AbstractUser
- Role-based access control
- User verification tracking

### ✅ Tournament Management
- Support for multiple tournament levels (grassroots to international)
- Tournament categories (singles, doubles, mixed doubles, youth, etc.)
- Tournament registration with payment integration
- Bracket generation and management
- Draw/seeding management

### ✅ Match Management
- Match scheduling and tracking
- Referee assignment
- Score recording (set by set)
- Match status tracking
- Match reporting

### ✅ Player Ranking
- Dynamic ranking calculation
- Career statistics tracking
- Win/loss ratios
- Category-based rankings
- Ranking history

### ✅ Financial Management
- Payment tracking and status
- Multiple payment methods (M-Pesa, card, bank transfer, cash)
- Financial transaction logging
- Revenue reporting

### ✅ Compliance & Discipline
- Sanction management (warnings, suspensions, bans, fines)
- Appeal system
- Disciplinary history tracking

### ✅ Auditing & Logging
- Comprehensive audit trail
- User action logging
- Activity feed
- System notifications

### ✅ Admin Dashboard
- User management
- System-wide statistics
- Audit log viewing
- Settings management

## Configuration

### Database
Default: SQLite3 (development)

To use PostgreSQL (production):
1. Update `DATABASES` in `config/settings.py`
2. Install `psycopg2-binary`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'badminton_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS Headers
Update `CORS_ALLOWED_ORIGINS` in `settings.py` for your frontend URL.

### Static Files
- Development: Auto-served by Django
- Production: Run `python manage.py collectstatic`

## Django Admin Panel Features

The admin panel provides full CRUD operations for:
- All user types and roles
- Tournaments and categories
- Players and rankings
- Matches and results
- Clubs and memberships
- Payments and transactions
- Sanctions and appeals
- System settings

Access at: `/admin/`

## Common Management Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed demo data
python manage.py seed_data

# Database shell
python manage.py dbshell

# Run shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

## Production Deployment

### 1. Update Settings
- Set `DEBUG = False`
- Update `ALLOWED_HOSTS`
- Use environment variables for secrets
- Use PostgreSQL instead of SQLite

### 2. Install Production Server
```bash
pip install gunicorn
```

### 3. Run with Gunicorn
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### 4. Configure Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Migration Issues
```bash
# Reset migrations (development only!)
python manage.py migrate project zero
python manage.py migrate
```

### Database Issues
```bash
# Delete and recreate database
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## API Response Format

All endpoints return JSON in this format:

### Success Response
```json
{
    "status": "success",
    "data": { /* response data */ }
}
```

### Error Response
```json
{
    "status": "error",
    "message": "Error description"
}
```

## Testing

To test an endpoint:

```bash
# Using curl
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@badminton.ke","password":"admin123"}'

# Using Python requests
import requests
response = requests.post('http://127.0.0.1:8000/api/auth/login',
    json={'email': 'admin@badminton.ke', 'password': 'admin123'})
print(response.json())
```

## Support & Documentation

- Django Documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/

## License

All rights reserved - Badminton Kenya OS
