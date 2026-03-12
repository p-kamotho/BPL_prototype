# Quick Start - Django Backend

## 🚀 Get Started in 5 Minutes

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Run Setup (Choose One)

**Automatic (Recommended):**
```bash
# Linux/Mac
chmod +x setup.sh
./setup.sh

# Windows (PowerShell)
python setup.py

# Or Python (All platforms)
python setup.py
```

**Manual:**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
```

### 3. Start Server
```bash
python manage.py runserver
```

### 4. Access Application
- **API:** http://127.0.0.1:8000
- **Admin:** http://127.0.0.1:8000/admin
- **Default Login:** admin@badminton.ke / admin123

---

## 📚 Quick Reference

### Test Login Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@badminton.ke","password":"admin123"}'
```

### Test Tournament List
```bash
curl http://127.0.0.1:8000/api/tournaments
```

### Test Player Rankings
```bash
curl http://127.0.0.1:8000/api/rankings
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `manage.py` | Django CLI entry point |
| `config/settings.py` | Main configuration |
| `config/urls.py` | URL routing |
| `project/models.py` | Database models (40+) |
| `project/views.py` | API endpoints (60+) |
| `project/urls.py` | App URL patterns |
| `project/admin.py` | Admin interface |

---

## 🔧 Common Commands

```bash
# Activate environment
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Seed demo data
python manage.py seed_data

# Access Django shell
python manage.py shell

# Django admin
python manage.py createsuperuser
```

---

## 📖 Documentation

- **Full Setup Guide:** [DJANGO_BACKEND_SETUP.md](DJANGO_BACKEND_SETUP.md)
- **API Documentation:** [API_ENDPOINTS.md](API_ENDPOINTS.md)
- **Implementation Details:** [BACKEND_IMPLEMENTATION_COMPLETE.md](BACKEND_IMPLEMENTATION_COMPLETE.md)

---

## ✅ What's Included

- ✅ 40+ Database Models
- ✅ 60+ API Endpoints
- ✅ User Authentication
- ✅ Tournament Management
- ✅ Player Ranking System
- ✅ Match Management
- ✅ Financial Tracking
- ✅ Disciplinary System
- ✅ Audit Logging
- ✅ Admin Dashboard
- ✅ Demo Data
- ✅ Production-Ready Code

---

## 🆘 Common Issues

**Port 8000 in use?**
```bash
python manage.py runserver 8001
```

**Database error?**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```

**Import errors?**
```bash
pip install -r requirements.txt --force-reinstall
```

---

## 🎯 Next Steps

1. ✅ Run setup script
2. ✅ Start development server
3. ✅ Test endpoints with curl/Postman
4. ✅ Access admin panel
5. ✅ Connect React frontend
6. ✅ Deploy to production

---

**Happy Coding! 🚀**
