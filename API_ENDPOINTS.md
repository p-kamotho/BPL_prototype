# Badminton Kenya OS - Complete API Endpoint Documentation

## Base URL
```
http://127.0.0.1:8000
```

---

## Table of Contents
1. [Authentication](#authentication)
2. [Profile](#profile)
3. [Tournaments](#tournaments)
4. [Players](#players)
5. [Matches](#matches)
6. [Clubs](#clubs)
7. [Registrations](#registrations)
8. [Payments](#payments)
9. [Admin](#admin)
10. [Notifications](#notifications)
11. [Disciplinary](#disciplinary)
12. [System](#system)

---

## Authentication

### Login
**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**CSRF Protection:** Disabled for mobile/frontend compatibility

**Request Body:**
```json
{
    "email": "admin@badminton.ke",
    "password": "admin123"
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "user": {
        "user_id": 1,
        "email": "admin@badminton.ke",
        "full_name": "Admin User",
        "phone": "+254712345678",
        "role": "super_admin",
        "is_staff": true
    }
}
```

**Error Response (401):**
```json
{
    "status": "error",
    "message": "Invalid credentials"
}
```

---

### Register
**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
    "email": "newuser@badminton.ke",
    "password": "securepass123",
    "full_name": "New User",
    "phone": "+254712345678",
    "role": "player"
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "message": "Registration successful",
    "user": {
        "user_id": 5,
        "email": "newuser@badminton.ke",
        "full_name": "New User",
        "role": "player"
    }
}
```

---

### Logout
**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```

---

## Profile

### Get Profile
**Endpoint:** `GET /api/profile`  
**Auth Required:** Yes  
**Method:** GET

**Success Response (200):**
```json
{
    "status": "success",
    "user": {
        "user_id": 1,
        "full_name": "Admin User",
        "email": "admin@badminton.ke",
        "phone": "+254712345678",
        "role": "super_admin",
        "profile_data": {
            "type": "admin",
            "permissions": [...]
        }
    }
}
```

---

### Update Profile
**Endpoint:** `PUT /api/profile`  
**Auth Required:** Yes

**Request Body:**
```json
{
    "first_name": "Updated",
    "last_name": "Name",
    "phone": "+254713456789"
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Profile updated"
}
```

---

## Tournaments

### List Tournaments
**Endpoint:** `GET /api/tournaments`  
**Auth Required:** No  
**Query Parameters:**
- `status` - Filter by status (planning, registration_open, in_progress, completed, cancelled)
- `level` - Filter by level (grassroots, county, regional, national, international)

**Example:** `GET /api/tournaments?status=in_progress&level=national`

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Kenya National Championship 2025",
            "level": "national",
            "start_date": "2025-06-01",
            "end_date": "2025-06-15",
            "status": "upcoming",
            "sanction_status": "approved",
            "total_players": 150,
            "total_matches": 45,
            "prize_pool": 100000.00,
            "admin_id": 1
        }
    ]
}
```

---

### Get Tournament Detail
**Endpoint:** `GET /api/tournaments/{tournament_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Kenya National Championship 2025",
        "description": "National badminton championship",
        "level": "national",
        "start_date": "2025-06-01",
        "end_date": "2025-06-15",
        "venue": "Nairobi Sports Complex",
        "status": "planning",
        "sanction_status": "approved",
        "total_players": 0,
        "total_matches": 0,
        "prize_pool": 100000.00,
        "registration_fee": 5000.00,
        "admin_id": 1,
        "created_at": "2025-03-12T10:30:00Z"
    }
}
```

---

### Create Tournament
**Endpoint:** `POST /api/tournaments`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
    "name": "New Tournament",
    "description": "Tournament description",
    "level": "national",
    "start_date": "2025-07-01",
    "end_date": "2025-07-15",
    "venue": "Venue Name",
    "status": "planning",
    "prize_pool": 150000,
    "registration_fee": 5000
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "id": 5
}
```

---

### Update Tournament
**Endpoint:** `PUT /api/tournaments/{tournament_id}`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
    "name": "Updated Tournament Name",
    "status": "registration_open",
    "sanction_status": "approved"
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Tournament updated"
}
```

---

## Players

### List Players
**Endpoint:** `GET /api/players`  
**Auth Required:** No  
**Query Parameters:**
- `club_id` - Filter by club

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "user_id": 2,
            "full_name": "John Omondi",
            "email": "john@badminton.ke",
            "club_name": "Riverside Badminton Club",
            "ranking_points": 1250,
            "matches_played": 10,
            "matches_won": 7,
            "gender": "M",
            "is_active": true
        }
    ]
}
```

---

### Get Player Detail
**Endpoint:** `GET /api/players/{player_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "user_id": 2,
        "full_name": "John Omondi",
        "email": "john@badminton.ke",
        "club_name": "Riverside Badminton Club",
        "ranking_points": 1250,
        "career_points": 2500,
        "matches_played": 10,
        "matches_won": 7,
        "win_ratio": 70.0,
        "gender": "M",
        "date_of_birth": "1995-05-15",
        "is_active": true,
        "sanctions_count": 0,
        "recent_sanctions": []
    }
}
```

---

### Get Player Rankings
**Endpoint:** `GET /api/rankings`  
**Auth Required:** No  
**Query Parameters:**
- `category` - Filter by category (singles, doubles, mixed)
- `limit` - Number of results (default: 100)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "rank_position": 1,
            "player_id": 1,
            "player_name": "John Omondi",
            "club_name": "Riverside Badminton Club",
            "points": 1250,
            "category": "singles",
            "email": "john@badminton.ke"
        }
    ]
}
```

---

## Matches

### List Matches
**Endpoint:** `GET /api/matches`  
**Auth Required:** No  
**Query Parameters:**
- `tournament_id` - Filter by tournament
- `status` - Filter by status (pending, scheduled, in_progress, completed, cancelled, postponed)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "tournament_id": 1,
            "tournament_name": "Kenya National Championship 2025",
            "player1_id": 1,
            "player1_name": "John Omondi",
            "player2_id": 2,
            "player2_name": "Sarah Kipchoge",
            "referee_id": 1,
            "referee_name": "Samuel Kipchoge",
            "status": "pending",
            "score1": 0,
            "score2": 0,
            "scheduled_time": null,
            "winner_id": null
        }
    ]
}
```

---

### Get Match Detail
**Endpoint:** `GET /api/matches/{match_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "tournament_id": 1,
        "tournament_name": "Kenya National Championship 2025",
        "player1_id": 1,
        "player1_name": "John Omondi",
        "player2_id": 2,
        "player2_name": "Sarah Kipchoge",
        "scores": {
            "set1": {"player1": 21, "player2": 19},
            "set2": {"player1": 18, "player2": 21},
            "set3": {"player1": 21, "player2": 15}
        },
        "referee_id": 1,
        "referee_name": "Samuel Kipchoge",
        "status": "completed",
        "venue": "Court A",
        "court_number": 1,
        "scheduled_time": "2025-06-01T14:00:00Z",
        "start_time": "2025-06-01T14:00:00Z",
        "end_time": "2025-06-01T14:45:00Z",
        "winner_id": 1,
        "notes": "Good match",
        "created_at": "2025-06-01T10:00:00Z"
    }
}
```

---

### Update Match Score
**Endpoint:** `POST /api/matches/{match_id}/score`  
**Auth Required:** Yes (Referee only)

**Request Body:**
```json
{
    "score1_set1": 21,
    "score2_set1": 19,
    "score1_set2": 18,
    "score2_set2": 21,
    "score1_set3": 21,
    "score2_set3": 15,
    "status": "completed",
    "winner_id": 1
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Match updated"
}
```

---

## Clubs

### List Clubs
**Endpoint:** `GET /api/clubs`  
**Auth Required:** No  
**Query Parameters:**
- `status` - Filter by status (pending, approved, suspended, rejected)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Riverside Badminton Club",
            "county": "Nairobi",
            "registration_number": "REG-001",
            "status": "approved",
            "contact_person": "John Doe",
            "contact_phone": "+254712345678",
            "contact_email": "contact@riverside.ke",
            "created_at": "2025-01-15T10:00:00Z"
        }
    ]
}
```

---

### Get Club Detail
**Endpoint:** `GET /api/clubs/{club_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Riverside Badminton Club",
        "county": "Nairobi",
        "registration_number": "REG-001",
        "description": "Premier badminton club in Nairobi",
        "status": "approved",
        "contact_person": "John Doe",
        "contact_phone": "+254712345678",
        "contact_email": "contact@riverside.ke",
        "members_count": 45,
        "players_count": 30,
        "members": [
            {
                "id": 1,
                "user_id": 2,
                "name": "John Omondi",
                "email": "john@badminton.ke",
                "role": "manager",
                "joined_at": "2025-01-15T10:00:00Z"
            }
        ],
        "created_at": "2025-01-15T10:00:00Z"
    }
}
```

---

## Registrations

### Register for Tournament
**Endpoint:** `POST /api/tournaments/register`  
**Auth Required:** Yes

**Request Body:**
```json
{
    "tournament_id": 1,
    "category_id": 1,
    "partner_player_id": null
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "registration_id": 5
}
```

---

## Payments

### Process Payment
**Endpoint:** `POST /api/payments`  
**Auth Required:** Yes

**Request Body:**
```json
{
    "registration_id": 5,
    "payment_method": "mpesa",
    "provider_ref": "MPG3D5UL34"
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "payment_id": 3,
    "message": "Payment processed"
}
```

---

### Check Payment Status
**Endpoint:** `GET /api/payments/{payment_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 3,
        "amount": 5000.00,
        "status": "pending",
        "payment_method": "mpesa",
        "provider_ref": "MPG3D5UL34",
        "transaction_id": null,
        "created_at": "2025-03-12T10:30:00Z"
    }
}
```

---

## Admin

### List Users
**Endpoint:** `GET /api/admin/users`  
**Auth Required:** Yes (Admin only)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "full_name": "Admin User",
            "email": "admin@badminton.ke",
            "status": "active",
            "roles": [
                {
                    "id": 1,
                    "role_name": "super_admin",
                    "status": "approved",
                    "scope_type": "national"
                }
            ],
            "phone": "+254712345678",
            "created_at": "2025-01-01T00:00:00Z"
        }
    ]
}
```

---

### List Audit Logs
**Endpoint:** `GET /api/admin/audit-logs`  
**Auth Required:** Yes (Admin only)  
**Query Parameters:**
- `action` - Filter by action
- `days` - Number of days to look back (default: 30)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "full_name": "Admin User",
            "action": "USER_REGISTERED",
            "details": "New user registered",
            "created_at": "2025-03-12T10:30:00Z",
            "target_type": "User",
            "target_id": 2
        }
    ]
}
```

---

### Get Dashboard Statistics
**Endpoint:** `GET /api/admin/dashboard`  
**Auth Required:** Yes (Admin only)

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "total_users": 50,
        "total_players": 35,
        "total_tournaments": 5,
        "total_matches": 45,
        "total_clubs": 8,
        "active_tournaments": 2,
        "pending_payments": 12,
        "active_sanctions": 3,
        "total_revenue": 125000.00
    }
}
```

---

## Notifications

### Get User Notifications
**Endpoint:** `GET /api/notifications`  
**Auth Required:** Yes  
**Query Parameters:**
- `unread` - Filter unread only (true/false)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "title": "Match Scheduled",
            "message": "Your match is scheduled for tomorrow at 2 PM",
            "notification_type": "match_scheduled",
            "is_read": false,
            "action_url": "/matches/1",
            "created_at": "2025-03-12T10:30:00Z"
        }
    ]
}
```

---

## Disciplinary

### List Sanctions
**Endpoint:** `GET /api/sanctions`  
**Auth Required:** No  
**Query Parameters:**
- `status` - Filter by status (active, expired, appealed, overturned)

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "player_id": 1,
            "player_name": "John Omondi",
            "sanction_type": "warning",
            "reason": "Unsporting conduct",
            "start_date": "2025-03-10",
            "end_date": "2025-04-10",
            "status": "active",
            "issued_date": "2025-03-10"
        }
    ]
}
```

---

### Get Sanction Detail
**Endpoint:** `GET /api/sanctions/{sanction_id}`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "player_id": 1,
        "player_name": "John Omondi",
        "sanction_type": "warning",
        "reason": "Unsporting conduct",
        "start_date": "2025-03-10",
        "end_date": "2025-04-10",
        "status": "active",
        "issued_by": "Admin User",
        "issued_date": "2025-03-10",
        "has_appeal": true,
        "appeal": {
            "id": 1,
            "status": "pending",
            "reason": "Appeal reason"
        }
    }
}
```

---

### File Appeal
**Endpoint:** `POST /api/sanctions/{sanction_id}/appeal`  
**Auth Required:** Yes

**Request Body:**
```json
{
    "reason": "I think the sanction was unfair because..."
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "appeal_id": 1
}
```

---

## System

### System Health Check
**Endpoint:** `GET /api/health`  
**Auth Required:** No

**Success Response (200):**
```json
{
    "status": "healthy",
    "timestamp": "2025-03-12T10:30:00Z",
    "database": "connected",
    "users": 50,
    "tournaments": 5
}
```

---

## Error Handling

All errors follow this format:

**Error Response:**
```json
{
    "status": "error",
    "message": "Descriptive error message"
}
```

**HTTP Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Note

Most endpoints requiring authentication use Django session cookies. Ensure cookies are enabled in your client.

For requests from frontend:
1. Make login request to `/api/auth/login`
2. Subsequent authenticated requests will automatically include session cookie
3. Session persists until `/api/auth/logout` is called

---

## Rate Limiting

Currently no rate limiting is enforced. In production, implement:
- Per-user request limits
- IP-based rate limiting  
- Exponential backoff for failed attempts

---

## CORS

Currently allows requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Update in `config/settings.py` for production.
