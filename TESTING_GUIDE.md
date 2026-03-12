# Quick Testing Guide - Badminton Kenya OS

## Starting the Application

### Terminal 1 - Backend (Django)
```bash
cd /home/l0n3rf1l3/Desktop/bpl_prototype/backend
source venv/bin/activate
python manage.py runserver
```
Visit: http://127.0.0.1:8000

### Terminal 2 - Frontend (React/Vite)
```bash
cd /home/l0n3rf1l3/Desktop/bpl_prototype
npm run dev
```
Visit: http://localhost:3000

---

## Test Scenarios

### Scenario 1: Dark Mode Toggle
1. Go to landing page
2. Click sun/moon icon in navbar
3. Verify entire app changes theme
4. Reload page - theme should persist
5. Try again with opposite theme

### Scenario 2: Mobile Navigation (Use DevTools)
1. Open browser DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Navigate to landing page
4. Verify hamburger menu appears
5. Click hamburger to open/close menu
6. Test links in mobile menu

### Scenario 3: Delete Account
1. **Login** with credentials:
   - Email: `admin@badminton.ke`
   - Password: `admin123`
2. Click "Delete Account" in sidebar
3. Read confirmation modal
4. Click "Delete" button
5. **Verify Response**:
   - Logs show account deletion
   - Redirected to home page
   - Cannot login with deleted account

### Scenario 4: Club Manager Registration & Approval
1. **Register New Club Manager**:
   - Click "Register" tab in Auth form
   - Email: `clubmgr@example.com`
   - Password: `TestPass123`
   - Full Name: `Club Manager Test`
   - Role: **Club Manager** (select this)
   - Club Name: `Silver Rackets Club`
   - Club Location: `Nairobi, Kenya`
   - Phone: `+254712345678`
   - Click "Create Account"

2. **Check Backend**:
   - User created but no roles assigned yet
   - User status: pending

3. **Admin Approval**:
   - Login with admin credentials
   - Call endpoint (via curl or API client):
   ```bash
   curl -X POST http://127.0.0.1:8000/api/admin/approve-club-manager \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": 2,
       "club_name": "Silver Rackets Club",
       "club_location": "Nairobi"
     }'
   ```

4. **Verify**:
   - Check backend logs for email send
   - Club manager can now login
   - Club dashboard appears in sidebar

### Scenario 5: Player Approval Workflow
1. **Register as Player**:
   - Click Register tab
   - Email: `player@example.com`
   - Password: `TestPass123`
   - Full Name: `John Player`
   - Role: **Player**
   - Click "Create Account"

2. **Club Manager Approves Player**:
   - Login as club manager
   - Navigate to Player Approvals
   - List shows pending player review
   - Click Approve
   - Backend saves player to club

3. **Verify**:
   - Player gets approval email
   - Player can login and access club data
   - Player appears in club roster

---

## Admin Credentials (Default)
- Email: `admin@badminton.ke`
- Password: `admin123`

---

## API Endpoints to Test

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
DELETE /api/auth/delete-account
```

### Approvals
```
POST /api/admin/approve-club-manager
POST /api/admin/approve-player
```

### User Data
```
GET /api/profile
GET /api/user/clubs
GET /api/user/matches
GET /api/user/tournaments
GET /api/user/dashboard
```

---

## Checking Email Notifications (Development)
Since we're using console email backend in development:

1. Watch backend terminal logs
2. Look for output like:
   ```
   Content-Type: text/plain; charset="utf-8"
   MIME-Version: 1.0
   Content-Transfer-Encoding: 7bit
   Subject: Your Club Manager Registration Has Been Approved - Badminton Kenya OS
   From: badminton.kenya.os@example.com
   To: clubmgr@example.com
   
   Dear Club Manager Test,
   
   Congratulations! Your Club Manager registration...
   ```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'corsheaders'"
**Solution**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Dark mode not applying
**Solution**:
- Clear browser localStorage
- Check that `dark` class is added to `<html>` tag
- Inspect console for errors

### Delete account redirect not working
**Solution**:
- Check browser console for CORS errors
- Verify backend CORS configuration
- Check network tab for 200 response

### Emails not showing in logs
**Solution**:
- Verify Django email backend is set to console
- Check that `send_approval_email()` function completes
- Look at Django application logs in backend terminal

---

## Success Indicators

✅ Dark mode persists across app
✅ Mobile navbar responsive
✅ Delete account shows confirmation
✅ Club manager registration shows club fields
✅ Admin can approve club managers
✅ Emails appear in console (development)
✅ Sidebar shows proper role permissions
✅ No 405 Method Not Allowed errors
✅ No CORS errors in console

---

## Performance Notes

- Build size: ~1.16 MB (production)
- Development server: ~3 seconds startup
- Django migrations: All up to date
- Database: SQLite (development)

---

Enjoy testing! 🎾
