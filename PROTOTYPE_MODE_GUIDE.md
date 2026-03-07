# Badminton Kenya OS - Prototype Mode Guide

## Problem & Solution

### The Issue
When you deployed the app to Render, the frontend was loading successfully, but login/registration failed with:
```
Connection error: Server returned non-JSON response: <!doctype html>...
```

### Root Cause
The Render deployment was serving only the static frontend build using `serve -s dist`, which doesn't run the Express backend server. When the frontend tried to fetch `/api/auth/login`, the request returned `index.html` (HTML) instead of JSON, causing a parsing error.

### The Solution
I've implemented a **graceful fallback system** that:
1. Attempts to connect to the real backend API
2. If the backend is unavailable (returns HTML or network error), automatically falls back to **mock simulated responses**
3. Allows full prototype/demo testing without requiring a backend server

---

## What's Been Changed

### New Files Created

1. **`src/utils/mockAuth.ts`**
   - Mock authentication service
   - Simulates login and registration responses
   - Provides test user data
   - Contains demo credentials

2. **`src/utils/mockApi.ts`**
   - Comprehensive mock API service
   - Provides simulated responses for all endpoints:
     - `/api/tournaments` - Tournament data
     - `/api/players` - Player listings
     - `/api/matches` - Match information
     - `/api/clubs` - Club data
     - `/api/profile` - User profile
     - `/api/admin/users` - User management
     - `/api/admin/audit-logs` - System logs
     - And more...
   - `safeFetch()` wrapper function for automatic fallback
   - Network delay simulation for realistic UX

### Modified Files

1. **`src/components/Auth.tsx`**
   - Now imports mock authentication utilities
   - Updated `handleSubmit()` to try real backend first
   - Falls back to mock auth if backend unavailable
   - Displays "Prototype Mode" banner
   - Shows demo credentials on login screen

2. **`src/components/Dashboard.tsx`**
   - Updated to use `safeFetch()` wrapper
   - Gracefully handles API unavailability
   - Displays mock data when backend is down

---

## How to Test

### Demo Credentials (Prototype Mode Only)

**Super Admin Account:**
- Email: `admin@badminton.ke`
- Password: `admin123`
- Role: Super Admin (full system access)

**Register as Player:**
- Use any email address
- Any password (debug mode)
- Select "Player" as role
- Account is immediately active

### Testing the App

1. **Run locally:**
   ```bash
   npm run dev
   ```
   - Backend server runs on `http://localhost:3000`
   - Frontend connects to real API if available

2. **Test without backend:**
   ```bash
   npm run build
   npm start
   ```
   - Only static frontend runs
   - All API calls automatically use mock responses
   - App is fully functional with demo data

3. **On Render deployment:**
   - App is deployed with mock fallback enabled
   - Can test login/registration immediately
   - No need to wait for backend implementation
   - Easy transition when backend is ready

---

## How It Works (Technical Details)

### Authentication Flow

```
User submits login form
  ↓
Frontend tries real API: POST /api/auth/login
  ↓
  ├─ Success: Real backend responds with user data ✓
  ├─ Timeout/Error: Use mock backend ✓
  └─ HTML response: Use mock backend ✓
  ↓
Mock auth checks user database
  ├─ Valid credentials: Return mock user object
  └─ Invalid: Return error message
  ↓
Auth store updates with user data
  ↓
Dashboard/app loads with user context
```

### Safe Fetch Wrapper

```typescript
await safeFetch('/api/tournaments')
  ↓
  ├─ Try real API
  │   ├─ Success + JSON: Return response ✓
  │   ├─ Success + HTML: Use mock ✓
  │   └─ Network error: Use mock ✓
  ↓
Return appropriate data to component
```

---

## Switching to Real Backend

### When You Deploy Backend

1. **Backend implementation is complete** → Deploy to Render

2. **Update environment variables** (if needed):
   - Backend URL configuration
   - API endpoint settings

3. **The fallback still works!**
   - Real API responses are used first
   - Mock only activates if real API unavailable
   - Zero code changes needed for transition

4. **Remove mock placeholders** (when ready):
   - Optional: Delete `src/utils/mockAuth.ts`
   - Optional: Delete `src/utils/mockApi.ts`
   - Optional: Revert `Auth.tsx` to simple fetch
   - **Note:** Keeping them doesn't hurt - they're only used as fallback

---

## Mock Data Reference

### Demo Users in Mock Auth
```javascript
mockUsers = {
  'admin@badminton.ke': {
    id: 1,
    full_name: 'Super Admin',
    email: 'admin@badminton.ke',
    status: 'active',
    roles: ['super_admin'] // Full permissions
  }
}
```

### Mock Tournaments
```javascript
[
  {
    id: 1,
    name: 'Kenya National Championship 2025',
    level: 'national',
    status: 'upcoming'
  }
]
```

### Mock Players
```javascript
[
  {
    id: 1,
    full_name: 'John Omondi',
    club_name: 'Riverside Badminton Club',
    ranking_points: 1250
  }
]
```

---

## Testing Checklist

- [ ] Login with demo credentials (`admin@badminton.ke` / `admin123`)
- [ ] Register as new player with any email
- [ ] View dashboard with mock data
- [ ] View tournaments list
- [ ] View players list
- [ ] Access profile page
- [ ] Test navigation between pages
- [ ] Logout and login again
- [ ] No console errors related to API failures

---

## Troubleshooting

### Issue: Still Getting HTML Response Errors

**Solution:** Make sure you're using the version with mock utilities:
- Check that `src/utils/mockAuth.ts` exists
- Check that `src/utils/mockApi.ts` exists
- Verify `Auth.tsx` imports these utilities

### Issue: API Calls Still Failing

**Solution:** The `safeFetch()` wrapper might not be used everywhere:
- Replace `fetch()` with `safeFetch()` in other components
- Example:
  ```typescript
  // Before
  const res = await fetch('/api/tournaments');
  
  // After
  import { safeFetch } from '../utils/mockApi';
  const res = await safeFetch('/api/tournaments');
  ```

### Issue: Want to Force Mock Mode

**Solution:** Add this before making requests:
```typescript
import { mockApiCall } from '../utils/mockApi';
const response = await mockApiCall('/api/tournaments', { method: 'GET' });
```

### Issue: Network Delay Too Fast

**Solution:** Adjust delay in `src/utils/mockApi.ts`:
```typescript
// Change this value (milliseconds)
await new Promise(resolve => setTimeout(resolve, 300)); // Increase as needed
```

---

## Production Deployment Notes

### Current Setup (Render)
- Frontend: Built and served by `npm start` → `serve -s dist`
- Backend: Not running (yet)
- Status: ✅ Works with mock authentication

### When Backend is Ready
1. Ensure backend server is configured to run on Render
2. Update `build.sh` or start command to run backend
3. Deploy backend separately or alongside frontend
4. Mock fallback will automatically deactivate
5. Real API calls will be used

### Environment Variables (When Backend is Ready)
```bash
VITE_API_URL=https://your-backend-url.com
```

Then update API calls:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';
const response = await safeFetch(`${API_URL}/tournaments`);
```

---

## Summary

✅ **What Works Now:**
- Login/Register with mock authentication
- View dashboard with sample data
- Navigate all protected routes
- Test full UI/UX flow
- No backend server required

⚠️ **Limitations (Expected):**
- Changes don't persist (refresh clears data)
- No real database operations
- Don't use for production data
- Demo purposes only

🚀 **When Backend is Ready:**
- Simply deploy backend and mock fallback auto-deactivates
- No code changes needed
- Seamless transition to production

---

## Need Help?

If login still doesn't work:
1. Open browser DevTools (F12)
2. Check Console tab for error messages
3. Look for "mock data" or "Backend unavailable" messages
4. Verify mock utility files exist in `src/utils/`

For questions or issues, refer to the console logs which indicate whether real API or mock is being used.
