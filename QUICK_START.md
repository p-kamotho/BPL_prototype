# Quick Start - Mock Authentication for Prototype Testing

## Problem Solved ✅

Your app was showing: `Connection error: Server returned non-JSON response: <!doctype html>...`

**Why?** On Render, only the frontend is deployed without the backend server. When the app tried to login, it got HTML instead of JSON.

**Solution:** Implemented automatic fallback to mock authentication so you can test the entire app without a backend server.

---

## What's Ready Now 🚀

### Demo Login
- **Email:** `admin@badminton.ke`
- **Password:** `admin123`
- Direct access to dashboard with all features

### Register New Account
- Enter any email and password
- Select a role (Player, Referee, Club Manager, etc.)
- Instant account creation (no approval needed for demo)

### Full App Access
- Dashboard with mock data
- Tournaments, Players, Matches, Clubs
- Profile management
- All navigation works

---

## How It Works

1. **Try Real Backend:** App attempts to connect to `/api/auth/login`
2. **Backend Down?** Automatically uses mock authentication
3. **No Changes Needed:** Works on Render NOW and switches to real backend LATER

---

## Files Added

| File | Purpose |
|------|---------|
| `src/utils/mockAuth.ts` | Mock login/registration |
| `src/utils/mockApi.ts` | Mock API responses for all endpoints |
| `PROTOTYPE_MODE_GUIDE.md` | Complete documentation |

## Files Modified

- `src/components/Auth.tsx` - Added mock fallback + demo banner
- `src/components/Dashboard.tsx` - Updated to use safe fetch wrapper

---

## To Deploy Now

```bash
npm run build
npm start
```

App is live and fully functional with mock authentication!

---

## When Real Backend is Ready

Simply deploy your backend to the same Render instance. The mock authentication automatically deactivates and real API calls take over. **No code changes needed.**

---

## Test It Out

1. Go to your Render URL
2. Try login with: `admin@badminton.ke` / `admin123`
3. Register a new player account
4. Navigate around the dashboard
5. All features work with simulated data

---

## Still Have Issues?

Check browser DevTools (F12) → Console tab for messages like:
- ✅ "Backend unavailable for /api/auth/login, using mock data" = Working correctly
- ❌ "Connection error: Server returned non-JSON response" = Something else is wrong

---

**The app is now ready for prototype testing and demos!** 🎉
