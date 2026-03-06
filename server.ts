import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('badminton.db');
// ensure profile_data column exists for player portal
try {
  db.prepare("ALTER TABLE Users ADD COLUMN profile_data TEXT DEFAULT '{}'").run();
} catch (e) {
  // column probably already exists
}


// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    profile_data TEXT DEFAULT '{}',
    status TEXT CHECK(status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS UserRoles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    scope_type TEXT CHECK(scope_type IN ('national', 'county', 'club', 'tournament')) DEFAULT 'national',
    scope_id INTEGER,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'revoked')) DEFAULT 'pending',
    approved_by INTEGER,
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(role_id) REFERENCES Roles(id),
    FOREIGN KEY(approved_by) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    county_id INTEGER,
    registration_number TEXT,
    status TEXT CHECK(status IN ('pending', 'approved', 'suspended')) DEFAULT 'pending',
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    club_id INTEGER,
    date_of_birth DATE,
    gender TEXT,
    national_id TEXT,
    ranking_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(club_id) REFERENCES Clubs(id)
  );

  CREATE TABLE IF NOT EXISTS Referees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    certification_level TEXT,
    license_number TEXT,
    experience_years INTEGER,
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS ClubStaff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_type TEXT CHECK(role_type IN ('manager', 'coach')) NOT NULL,
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    FOREIGN KEY(club_id) REFERENCES Clubs(id),
    FOREIGN KEY(user_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    admin_id INTEGER NOT NULL,
    status TEXT DEFAULT 'upcoming',
    sanction_status TEXT CHECK(sanction_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    FOREIGN KEY(admin_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    referee_id INTEGER,
    status TEXT DEFAULT 'pending',
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    FOREIGN KEY(tournament_id) REFERENCES Tournaments(id),
    FOREIGN KEY(player1_id) REFERENCES Players(id),
    FOREIGN KEY(player2_id) REFERENCES Players(id),
    FOREIGN KEY(referee_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS AuditLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS SystemEvents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    triggered_by INTEGER NOT NULL,
    payload TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(triggered_by) REFERENCES Users(id)
  );

  CREATE TABLE IF NOT EXISTS Permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS RolePermissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY(role_id) REFERENCES Roles(id),
    FOREIGN KEY(permission_id) REFERENCES Permissions(id)
  );

  -- registration & payment prototype tables
  CREATE TABLE IF NOT EXISTS Registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    player_id INTEGER,
    team_id INTEGER,
    status TEXT CHECK(status IN ('pending','confirmed','cancelled')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tournament_id) REFERENCES Tournaments(id),
    FOREIGN KEY(player_id) REFERENCES Players(id)
  );

  CREATE TABLE IF NOT EXISTS Payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT CHECK(status IN ('pending','initiated','success','failed')) DEFAULT 'pending',
    provider_ref TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(registration_id) REFERENCES Registrations(id)
  );

  -- bracket structure for tournaments
  CREATE TABLE IF NOT EXISTS Brackets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('single_elim','rr_knockout')) DEFAULT 'single_elim',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tournament_id) REFERENCES Tournaments(id)
  );

  CREATE TABLE IF NOT EXISTS BracketMatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bracket_id INTEGER NOT NULL,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    player1_id INTEGER,
    player2_id INTEGER,
    winner_id INTEGER,
    status TEXT CHECK(status IN ('pending','completed')) DEFAULT 'pending',
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    FOREIGN KEY(bracket_id) REFERENCES Brackets(id),
    FOREIGN KEY(player1_id) REFERENCES Players(id),
    FOREIGN KEY(player2_id) REFERENCES Players(id),
    FOREIGN KEY(winner_id) REFERENCES Players(id)
  );
`);

// Helper to trigger events
function triggerEvent(eventType: string, entityType: string, entityId: number, triggeredBy: number, payload: any = {}) {
  try {
    db.prepare('INSERT INTO SystemEvents (event_type, entity_type, entity_id, triggered_by, payload) VALUES (?, ?, ?, ?, ?)')
      .run(eventType, entityType, entityId, triggeredBy, JSON.stringify(payload));
    console.log(`Event Triggered: ${eventType} on ${entityType} ${entityId}`);
  } catch (e) {
    console.error('Failed to trigger event:', e);
  }
}

// Seed Roles and Permissions
const roles = [
  { 
    name: 'player', 
    description: 'Standard player role', 
    permissions: [
      'view_dashboard', 'view_profile', 'view_club', 'view_tournaments', 'view_matches', 
      'view_rankings', 'view_match_history', 'view_notifications', 'file_appeals', 'view_settings'
    ] 
  },
  { 
    name: 'referee', 
    description: 'Match official', 
    permissions: [
      'view_dashboard', 'view_certification', 'view_assigned_matches', 'score_matches', 
      'view_tournament_assignments', 'view_performance_reviews', 'view_compliance', 'file_reports', 
      'view_notifications', 'view_settings'
    ] 
  },
  { 
    name: 'club_manager', 
    description: 'Manages club operations', 
    permissions: [
      'view_dashboard', 'view_club_profile', 'manage_club_players', 'manage_club_coaches', 
      'register_tournaments', 'view_financials', 'view_sanctions', 'view_match_reports', 
      'view_analytics', 'view_notifications', 'view_settings'
    ] 
  },
  { 
    name: 'coach', 
    description: 'Club coach', 
    permissions: [
      'view_dashboard', 'view_club_profile', 'view_club_players', 'view_match_reports', 
      'view_notifications', 'view_settings'
    ] 
  },
  { 
    name: 'player', 
    description: 'Standard player role', 
    permissions: [
      'view_dashboard', 'view_profile', 'edit_profile', 'view_club', 'view_tournaments', 'view_matches', 
      'view_rankings', 'view_match_history', 'view_notifications', 'file_appeals', 'view_settings'
    ] 
  },
  { 
    name: 'tournament_admin', 
    description: 'Manages specific tournaments', 
    permissions: [
      'view_dashboard', 'manage_tournament_details', 'manage_draws', 'view_registered_players', 
      'assign_referees', 'control_matches', 'view_live_results', 'manage_disciplinary', 
      'view_financials', 'view_reports', 'view_audit_log', 'view_settings'
    ] 
  },
  { 
    name: 'federation_admin', 
    description: 'National level administrator', 
    permissions: [
      'view_dashboard', 'manage_governance', 'manage_counties', 'manage_national_rankings', 
      'oversee_sanctions', 'accredit_referees', 'manage_disciplinary_tribunal', 'manage_policy', 
      'view_system_audit', 'view_financial_oversight', 'view_settings'
    ] 
  },
  { 
    name: 'super_admin', 
    description: 'System-wide administrator', 
    permissions: [
      'view_system_dashboard', 'manage_users', 'manage_roles_permissions', 'manage_governance_structure', 
      'manage_system_config', 'view_system_logs', 'manage_backups', 'manage_feature_flags', 
      'manage_notifications', 'manage_maintenance', 'view_settings',
      // Tournament Admin Permissions
      'view_dashboard', 'manage_tournament_details', 'manage_draws', 'view_registered_players', 
      'assign_referees', 'control_matches', 'view_live_results', 'manage_disciplinary', 
      'view_financials', 'view_reports', 'view_audit_log'
    ] 
  }
];

const insertRole = db.prepare('INSERT OR IGNORE INTO Roles (name, description) VALUES (?, ?)');
const insertPermission = db.prepare('INSERT OR IGNORE INTO Permissions (slug, description) VALUES (?, ?)');
const insertRolePermission = db.prepare('INSERT OR IGNORE INTO RolePermissions (role_id, permission_id) VALUES (?, ?)');

roles.forEach(role => {
  insertRole.run(role.name, role.description);
  const roleId = db.prepare('SELECT id FROM Roles WHERE name = ?').get(role.name).id;
  
  role.permissions.forEach(perm => {
    insertPermission.run(perm, `Permission to ${perm.replace(/_/g, ' ')}`);
    const permId = db.prepare('SELECT id FROM Permissions WHERE slug = ?').get(perm).id;
    insertRolePermission.run(roleId, permId);
  });
});

// Seed Super Admin if not exists
const seedAdmin = db.prepare('SELECT * FROM Users WHERE email = ?').get('admin@badminton.ke');
if (!seedAdmin) {
  db.transaction(() => {
    const result = db.prepare('INSERT INTO Users (full_name, email, password_hash, status) VALUES (?, ?, ?, ?)').run(
      'Super Admin',
      'admin@badminton.ke',
      'admin123',
      'active'
    );
    const userId = result.lastInsertRowid;
    const superAdminRole = db.prepare('SELECT id FROM Roles WHERE name = ?').get('super_admin') as { id: number } | undefined;
    if (superAdminRole) {
      db.prepare('INSERT INTO UserRoles (user_id, role_id, scope_type, status, approved_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)')
        .run(userId, superAdminRole.id, 'national', 'approved');
    }
  })();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`${req.method} ${req.path} query=${JSON.stringify(req.query)}`);
    }
    next();
  });

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare('SELECT * FROM Users WHERE email = ? AND password_hash = ?').get(email, password);
      if (user) {
        if (user.status === 'suspended') {
          return res.status(403).json({ error: 'Account suspended' });
        }
        
        // Fetch all approved roles for the user
        const userRoles = db.prepare(`
          SELECT ur.*, r.name as role_name 
          FROM UserRoles ur 
          JOIN Roles r ON ur.role_id = r.id 
          WHERE ur.user_id = ? AND ur.status = 'approved'
        `).all(user.id);

        // Attach permissions to each role
        const rolesWithPermissions = userRoles.map((ur: any) => {
          const permissions = db.prepare(`
            SELECT p.slug 
            FROM Permissions p
            JOIN RolePermissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ?
          `).all(ur.role_id).map((p: any) => p.slug);
          return { ...ur, permissions };
        });
        
        res.json({ user: { ...user, roles: rolesWithPermissions, user_id: user.id } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (e: any) {
      console.error('Login error:', e);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { full_name, email, password, role, phone } = req.body;
    try {
      db.transaction(() => {
        const initialStatus = role === 'player' ? 'active' : 'pending';
        const insertUser = db.prepare('INSERT INTO Users (full_name, email, password_hash, phone, status) VALUES (?, ?, ?, ?, ?)');
        const result = insertUser.run(full_name, email, password, phone, initialStatus);
        const userId = result.lastInsertRowid;

        const roleRecord = db.prepare('SELECT id FROM Roles WHERE name = ?').get(role);
        if (!roleRecord) throw new Error('Invalid role selected');

        const roleStatus = role === 'player' ? 'approved' : 'pending';
        // Create initial role application
        db.prepare('INSERT INTO UserRoles (user_id, role_id, scope_type, status) VALUES (?, ?, ?, ?)')
          .run(userId, roleRecord.id, 'national', roleStatus);

        // if player, create player profile row immediately
        if (role === 'player') {
          db.prepare('INSERT OR IGNORE INTO Players (user_id, ranking_points) VALUES (?, 0)').run(userId);
        }

        triggerEvent('USER_REGISTERED', 'User', Number(userId), Number(userId), { role });
      })();

      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/players', (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id || user_id === 'undefined') return res.status(400).json({ error: 'User ID required' });

      const userIdInt = parseInt(user_id as string);
      const userRoles = db.prepare("SELECT * FROM UserRoles WHERE user_id = ? AND status = 'approved'").all(userIdInt) as any[];
      const isNational = userRoles.some((r: any) => ['super_admin', 'federation_admin'].includes(db.prepare('SELECT name FROM Roles WHERE id = ?').get(r.role_id).name));
      
      let query = 'SELECT p.*, u.full_name, u.email, c.name as club_name FROM Players p JOIN Users u ON p.user_id = u.id LEFT JOIN Clubs c ON p.club_id = c.id';
      const params: any[] = [];

      if (!isNational) {
          const clubScopeIds = userRoles
              .filter((r: any) => r.scope_type === 'club')
              .map((r: any) => r.scope_id);
              
          if (clubScopeIds.length > 0) {
              query += ` WHERE p.club_id IN (${clubScopeIds.join(',')})`;
          } else {
              // If no relevant role, return empty
              return res.json([]);
          }
      }

      const players = db.prepare(query).all();
      res.json(players);
    } catch (e: any) {
      console.error('Error in /api/players:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Return current user's profile information
  app.get('/api/profile', (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id || user_id === 'undefined') return res.status(400).json({ error: 'User ID required' });
      const userIdInt = parseInt(user_id as string);
      const row = db.prepare('SELECT id as user_id, full_name, email, phone, profile_data FROM Users WHERE id = ?').get(userIdInt);
      if (!row) return res.status(404).json({ error: 'User not found' });
      let profileData: any = {};
      try { profileData = JSON.parse(row.profile_data || '{}'); } catch {}
      const user = { user_id: row.user_id, full_name: row.full_name, email: row.email, phone: row.phone, profile_data: profileData };
      res.json({ user });
    } catch (e: any) {
      console.error('Error in /api/profile GET:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/profile', (req, res) => {
    try {
      const { user_id, full_name, phone, profile_data } = req.body;
      if (!user_id) return res.status(400).json({ error: 'User ID required' });
      const userIdInt = parseInt(user_id as string);

      const existing = db.prepare('SELECT profile_data FROM Users WHERE id = ?').get(userIdInt);
      if (!existing) return res.status(404).json({ error: 'User not found' });
      let currentData: any = {};
      try { currentData = JSON.parse(existing.profile_data || '{}'); } catch {}
      const merged = { ...currentData, ...(profile_data || {}) };

      const result = db.prepare('UPDATE Users SET full_name = ?, phone = ?, profile_data = ? WHERE id = ?')
        .run(full_name, phone, JSON.stringify(merged), userIdInt);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'User not found or no changes' });
      }
      res.json({ success: true, profile_data: merged });
    } catch (e: any) {
      console.error('Error in /api/profile PUT:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/tournaments/:id/sanction', (req, res) => {
    const { id } = req.params;
    const { status, user_id } = req.body;
    
    try {
      db.prepare('UPDATE Tournaments SET sanction_status = ? WHERE id = ?').run(status, id);
      triggerEvent('TOURNAMENT_SANCTION_UPDATED', 'Tournament', parseInt(id), user_id, { status });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/tournaments', (req, res) => {
    const tournaments = db.prepare('SELECT * FROM Tournaments').all();
    res.json(tournaments);
  });

  app.post('/api/tournaments', (req, res) => {
    const { name, level, start_date, end_date, admin_id } = req.body;
    const result = db.prepare('INSERT INTO Tournaments (name, level, start_date, end_date, admin_id) VALUES (?, ?, ?, ?, ?)')
      .run(name, level, start_date, end_date, admin_id);
    res.json({ id: result.lastInsertRowid });
  });

  // ---- registration & payment prototype routes ----

  app.post('/api/tournaments/:id/register', (req, res) => {
    const { id } = req.params;
    const { player_id, team_id, amount } = req.body;
    try {
      const { registration_id, payment_id } = db.transaction(() => {
        const regResult = db.prepare('INSERT INTO Registrations (tournament_id, player_id, team_id) VALUES (?, ?, ?)')
          .run(id, player_id || null, team_id || null);
        const regId = regResult.lastInsertRowid;
        // create associated payment
        const payResult = db.prepare('INSERT INTO Payments (registration_id, amount, status) VALUES (?, ?, ?)')
          .run(regId, amount || 0, 'pending');
        const payId = payResult.lastInsertRowid;
        return { registration_id: regId, payment_id: payId };
      })();
      res.json({ registration_id, payment_id, message: 'Registration created, payment pending' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/payments/create', (req, res) => {
    const { registration_id, amount } = req.body;
    try {
      const result = db.prepare('INSERT INTO Payments (registration_id, amount, status) VALUES (?, ?, ?)')
        .run(registration_id, amount, 'pending');
      res.json({ payment_id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  function confirmRegistration(registrationId: number) {
    const reg = db.prepare('SELECT * FROM Registrations WHERE id = ?').get(registrationId);
    if (!reg) return;
    db.prepare('UPDATE Registrations SET status = ? WHERE id = ?').run('confirmed', registrationId);
    // optionally update team status or trigger event
    triggerEvent('REGISTRATION_CONFIRMED', 'Registration', registrationId, 0, reg);
  }

  app.post('/api/payments/:id/simulate-success', (req, res) => {
    const { id } = req.params;
    try {
      const payment = db.prepare('SELECT * FROM Payments WHERE id = ?').get(id);
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      db.transaction(() => {
        db.prepare("UPDATE Payments SET status = 'success' WHERE id = ?").run(id);
        confirmRegistration(payment.registration_id);
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/payments/:id', (req, res) => {
    const { id } = req.params;
    const payment = db.prepare('SELECT * FROM Payments WHERE id = ?').get(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  });

  app.post('/api/tournaments/:id/close-registrations', (req, res) => {
    const { id } = req.params;
    try {
      // change tournament status for tracking
      db.prepare("UPDATE Tournaments SET status = 'registration_closed' WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/tournaments/:id/generate-bracket', (req, res) => {
    const { id } = req.params;
    try {
      const regs = db.prepare('SELECT id, player_id, team_id FROM Registrations WHERE tournament_id = ? AND status = "confirmed"').all(id);
      const participants = regs.map((r: any) => r.player_id || r.team_id).filter((p: any) => p != null);
      if (participants.length < 2) return res.status(400).json({ error: 'Not enough confirmed participants' });

      const bracketObj = db.transaction(() => {
        const br = db.prepare('INSERT INTO Brackets (tournament_id, type) VALUES (?, ?)').run(id, req.body.type || 'single_elim');
        const bracket_id = br.lastInsertRowid as number;

        let round = 1;
        let current = [...participants];
        let matchNumberCounter = 1;

        while (current.length > 1) {
          const next = [];
          for (let i = 0; i < current.length; i += 2) {
            const p1 = current[i];
            const p2 = current[i + 1] || null;
            db.prepare('INSERT INTO BracketMatches (bracket_id, round, match_number, player1_id, player2_id) VALUES (?, ?, ?, ?, ?)')
              .run(bracket_id, round, matchNumberCounter, p1, p2);
            matchNumberCounter += 1;
            next.push(null); // placeholder for winner of this match
          }
          current = next;
          round += 1;
          matchNumberCounter = 1;
        }
        return bracket_id;
      })();
      res.json({ bracket_id: bracketObj });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/tournaments/:id/bracket', (req, res) => {
    const { id } = req.params;
    const bracket = db.prepare('SELECT * FROM Brackets WHERE tournament_id = ?').get(id);
    if (!bracket) return res.status(404).json({ error: 'No bracket found' });
    const matches = db.prepare('SELECT * FROM BracketMatches WHERE bracket_id = ? ORDER BY round, match_number').all(bracket.id);
    res.json({ bracket, matches });
  });

  app.post('/api/bracket-matches/:id/complete', (req, res) => {
    const { id } = req.params;
    const { winner_id, score1, score2 } = req.body;
    try {
      const match = db.prepare('SELECT * FROM BracketMatches WHERE id = ?').get(id);
      if (!match) return res.status(404).json({ error: 'Match not found' });
      db.transaction(() => {
        db.prepare('UPDATE BracketMatches SET winner_id = ?, status = ?, score1 = ?, score2 = ? WHERE id = ?')
          .run(winner_id, 'completed', score1 || 0, score2 || 0, id);

        // propagate to next round
        const nextRound = match.round + 1;
        const nextMatchNumber = Math.ceil(match.match_number / 2);
        const nextMatch = db.prepare('SELECT * FROM BracketMatches WHERE bracket_id = ? AND round = ? AND match_number = ?')
          .get(match.bracket_id, nextRound, nextMatchNumber);
        if (nextMatch) {
          if (match.match_number % 2 === 1) {
            db.prepare('UPDATE BracketMatches SET player1_id = ? WHERE id = ?').run(winner_id, nextMatch.id);
          } else {
            db.prepare('UPDATE BracketMatches SET player2_id = ? WHERE id = ?').run(winner_id, nextMatch.id);
          }
        }
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // end registration/payment/bracket routes

  app.get('/api/matches', (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id || user_id === 'undefined') return res.status(400).json({ error: 'User ID required' });

      const userIdInt = parseInt(user_id as string);
      const userRoles = db.prepare("SELECT * FROM UserRoles WHERE user_id = ? AND status = 'approved'").all(userIdInt) as any[];
      const isNational = userRoles.some((r: any) => ['super_admin', 'federation_admin'].includes(db.prepare('SELECT name FROM Roles WHERE id = ?').get(r.role_id).name));

      let query = `
        SELECT m.*, 
               t.name as tournament_name, 
               p1u.full_name as player1_name, 
               p2u.full_name as player2_name,
               ru.full_name as referee_name
        FROM Matches m
        JOIN Tournaments t ON m.tournament_id = t.id
        JOIN Players p1 ON m.player1_id = p1.id
        JOIN Users p1u ON p1.user_id = p1u.id
        JOIN Players p2 ON m.player2_id = p2.id
        JOIN Users p2u ON p2.user_id = p2u.id
        LEFT JOIN Users ru ON m.referee_id = ru.id
      `;

      if (!isNational) {
        const tournamentScopeIds = userRoles
          .filter((r: any) => r.scope_type === 'tournament')
          .map((r: any) => r.scope_id);
        
        const refereeIds = userRoles
          .filter((r: any) => db.prepare('SELECT name FROM Roles WHERE id = ?').get(r.role_id).name === 'referee')
          .map((r: any) => userIdInt); // Referee sees matches they are assigned to? Or all matches? Let's assume assigned.
          
        // If tournament admin, filter by tournament_id
        if (tournamentScopeIds.length > 0) {
          query += ` WHERE m.tournament_id IN (${tournamentScopeIds.join(',')})`;
        } else if (refereeIds.length > 0) {
          query += ` WHERE m.referee_id = ${userIdInt}`;
        } else {
          // Players see their own matches
          const playerIds = db.prepare('SELECT id FROM Players WHERE user_id = ?').all(userIdInt).map((p: any) => p.id);
          if (playerIds.length > 0) {
             query += ` WHERE (m.player1_id IN (${playerIds.join(',')}) OR m.player2_id IN (${playerIds.join(',')}))`;
          } else {
             return res.json([]);
          }
        }
      }

      const matches = db.prepare(query).all();
      res.json(matches);
    } catch (e: any) {
      console.error('Error in /api/matches:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/clubs', (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id || user_id === 'undefined') return res.status(400).json({ error: 'User ID required' });

      const userIdInt = parseInt(user_id as string);
      const userRoles = db.prepare("SELECT * FROM UserRoles WHERE user_id = ? AND status = 'approved'").all(userIdInt) as any[];
      const isNational = userRoles.some((r: any) => ['super_admin', 'federation_admin'].includes(db.prepare('SELECT name FROM Roles WHERE id = ?').get(r.role_id).name));

      let query = 'SELECT * FROM Clubs';

      if (!isNational) {
        const clubScopeIds = userRoles
          .filter((r: any) => r.scope_type === 'club')
          .map((r: any) => r.scope_id);

        if (clubScopeIds.length > 0) {
          query += ` WHERE id IN (${clubScopeIds.join(',')})`;
        } else {
          // Maybe public list? But prompt implies strict visibility.
          // Let's return empty for now if no role.
          return res.json([]);
        }
      }

      const clubs = db.prepare(query).all();
      res.json(clubs);
    } catch (e: any) {
      console.error('Error in /api/clubs:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/players', (req, res) => {
    const { full_name, email, club_id, gender, date_of_birth, created_by } = req.body;
    
    // Permission check (simplified)
    // In a real app, verify created_by has club_manager role for club_id or is admin
    
    try {
      db.transaction(() => {
        // 1. Create User (if not exists) or find existing
        let userId;
        const existingUser = db.prepare('SELECT id FROM Users WHERE email = ?').get(email);
        
        if (existingUser) {
          userId = existingUser.id;
        } else {
          // Create placeholder user
          const result = db.prepare('INSERT INTO Users (full_name, email, password_hash, status) VALUES (?, ?, ?, ?)')
            .run(full_name, email, 'changeme', 'active');
          userId = result.lastInsertRowid;
        }

        // 2. Insert into Players
        const playerResult = db.prepare('INSERT INTO Players (user_id, date_of_birth, gender) VALUES (?, ?, ?)')
          .run(userId, date_of_birth, gender);
        const playerId = playerResult.lastInsertRowid;

        // 3. Assign Player Role
        const playerRole = db.prepare('SELECT id FROM Roles WHERE name = "player"').get();
        db.prepare('INSERT INTO UserRoles (user_id, role_id, scope_type, scope_id, status, approved_at, approved_by) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)')
          .run(userId, playerRole.id, 'club', club_id, 'approved', created_by);

        // 4. Trigger Event
        triggerEvent('PLAYER_REGISTERED', 'Player', Number(playerId), created_by, { club_id });
      })();
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/matches/:id/score', (req, res) => {
    const { id } = req.params;
    const { score1, score2, referee_id } = req.body;

    try {
      db.transaction(() => {
        // Update Match
        db.prepare("UPDATE Matches SET score1 = ?, score2 = ?, status = 'completed', referee_id = ? WHERE id = ?")
          .run(score1, score2, referee_id, id);

        // Trigger Event
        triggerEvent('MATCH_COMPLETED', 'Match', Number(id), referee_id, { score1, score2 });
        
        // (Simulated) Recalculate Rankings would happen here or via an event listener
      })();
      
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/clubs/:id/suspend', (req, res) => {
    const { id } = req.params;
    const { admin_id, reason } = req.body;

    try {
      db.transaction(() => {
        db.prepare("UPDATE Clubs SET status = 'suspended' WHERE id = ?").run(id);
        triggerEvent('CLUB_SUSPENDED', 'Club', Number(id), admin_id, { reason });
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/admin/users', (req, res) => {
    const users = db.prepare(`
      SELECT u.*, 
             (SELECT json_group_array(json_object(
               'id', ur.id,
               'role_name', r.name,
               'status', ur.status,
               'scope_type', ur.scope_type,
               'scope_id', ur.scope_id
             )) FROM UserRoles ur JOIN Roles r ON ur.role_id = r.id WHERE ur.user_id = u.id) as roles_json
      FROM Users u
    `).all();
    
    res.json(users.map((u: any) => ({ 
      ...u, 
      user_id: u.id,
      roles: JSON.parse(u.roles_json)
    })));
  });

  app.post('/api/admin/user-roles/:id/approve', (req, res) => {
    const { id } = req.params; // UserRole id
    const { admin_id } = req.body;

    const userRole = db.prepare('SELECT * FROM UserRoles WHERE id = ?').get(id);
    if (!userRole) return res.status(404).json({ error: 'Role application not found' });

    const role = db.prepare('SELECT name FROM Roles WHERE id = ?').get(userRole.role_id);

    db.transaction(() => {
      // Update UserRole status
      db.prepare("UPDATE UserRoles SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(admin_id, id);

      // Update user status to active if it was pending
      db.prepare("UPDATE Users SET status = 'active' WHERE id = ? AND status = 'pending'").run(userRole.user_id);

      // Create profile record if needed
      if (role.name === 'player') {
        const exists = db.prepare('SELECT id FROM Players WHERE user_id = ?').get(userRole.user_id);
        if (!exists) db.prepare('INSERT INTO Players (user_id, ranking_points) VALUES (?, 0)').run(userRole.user_id);
      } else if (role.name === 'referee') {
        const exists = db.prepare('SELECT id FROM Referees WHERE user_id = ?').get(userRole.user_id);
        if (!exists) db.prepare("INSERT INTO Referees (user_id, status) VALUES (?, 'active')").run(userRole.user_id);
      }
    })();

    res.json({ success: true });
  });

  app.post('/api/admin/user-roles/:id/revoke', (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE UserRoles SET status = 'revoked' WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.post('/api/admin/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE Users SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    try {
      const logs = db.prepare(`
        SELECT al.*, u.full_name 
        FROM AuditLogs al 
        JOIN Users u ON al.user_id = u.id 
        ORDER BY al.created_at DESC
      `).all();
      res.json(logs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
