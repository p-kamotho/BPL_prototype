/**
 * Mock Authentication Service
 * Simulates backend responses for prototype testing
 * Replace with real API calls once backend is deployed
 */

import type { User, RoleName } from '../store/authStore';

export type MockUser = User;

// Mock database of users
const mockUsers: { [key: string]: MockUser } = {
  'admin@badminton.ke': {
    user_id: 1,
    full_name: 'Super Admin',
    email: 'admin@badminton.ke',
    phone: '+254712345678',
    status: 'active',
    roles: [
      {
        id: 1,
        role_name: 'super_admin',
        status: 'approved',
        scope_type: 'national',
        scope_id: null,
        permissions: [
          'view_system_dashboard', 'manage_users', 'manage_roles_permissions',
          'manage_governance_structure', 'manage_system_config', 'view_system_logs',
          'manage_backups', 'manage_feature_flags', 'manage_notifications',
          'manage_maintenance', 'view_settings', 'view_dashboard', 'manage_tournament_details',
          'manage_draws', 'view_registered_players', 'assign_referees', 'control_matches',
          'view_live_results', 'manage_disciplinary', 'view_financials', 'view_reports',
          'view_audit_log'
        ]
      }
    ]
  }
};

// Simulate a delay for more realistic behavior
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function mockLogin(email: string, password: string): Promise<{ user: MockUser } | { error: string }> {
  await delay(800);

  // Check mock database
  const user = mockUsers[email];
  
  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // Mock password check (in production, verify against hash)
  if (password !== 'admin123' && email === 'admin@badminton.ke') {
    return { error: 'Invalid credentials' };
  }

  // Allow any password for demo purposes
  return { user };
}

export async function mockRegister(
  full_name: string,
  email: string,
  password: string,
  role: string,
  phone: string
): Promise<{ success: boolean; message?: string } | { error: string }> {
  await delay(600);

  // Check if user already exists
  if (mockUsers[email]) {
    return { error: 'Email already registered' };
  }

  // Validate inputs
  if (!full_name || !email || !password) {
    return { error: 'All fields are required' };
  }

  // Create new mock user
  const userId = Object.keys(mockUsers).length + 1;
  const newUser: MockUser = {
    user_id: userId,
    full_name,
    email,
    phone,
    status: role === 'player' ? 'active' : 'pending',
    roles: [
      {
        id: userId,
        role_name: role as RoleName,
        status: role === 'player' ? 'approved' : 'pending',
        scope_type: 'national',
        scope_id: null,
        permissions: getPermissionsForRole(role)
      }
    ]
  };

  // Store in mock database
  mockUsers[email] = newUser;

  if (role === 'player') {
    return { success: true, message: 'Registration successful! You can now log in.' };
  } else {
    return { success: true, message: 'Registration successful! Please wait for admin approval.' };
  }
}

function getPermissionsForRole(role: string): string[] {
  const permissions: { [key: string]: string[] } = {
    player: [
      'view_dashboard', 'view_profile', 'edit_profile', 'view_club', 'view_tournaments',
      'view_matches', 'view_rankings', 'view_match_history', 'view_notifications',
      'file_appeals', 'view_settings'
    ],
    referee: [
      'view_dashboard', 'view_certification', 'view_assigned_matches', 'score_matches',
      'view_tournament_assignments', 'view_performance_reviews', 'view_compliance',
      'file_reports', 'view_notifications', 'view_settings'
    ],
    club_manager: [
      'view_dashboard', 'view_club_profile', 'manage_club_players', 'manage_club_coaches',
      'register_tournaments', 'view_financials', 'view_sanctions', 'view_match_reports',
      'view_analytics', 'view_notifications', 'view_settings'
    ],
    coach: [
      'view_dashboard', 'view_club_profile', 'view_club_players', 'view_match_reports',
      'view_notifications', 'view_settings'
    ],
    tournament_admin: [
      'view_dashboard', 'manage_tournament_details', 'manage_draws', 'view_registered_players',
      'assign_referees', 'control_matches', 'view_live_results', 'manage_disciplinary',
      'view_financials', 'view_reports', 'view_audit_log', 'view_settings'
    ]
  };

  return permissions[role] || permissions.player;
}

// Test data generator for demo purposes
export function generateMockTestUser(email: string, role: string = 'player'): void {
  const userId = Object.keys(mockUsers).length + 1;
  const newUser: MockUser = {
    user_id: userId,
    full_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    email,
    phone: '+254712345678',
    status: role === 'player' ? 'active' : 'pending',
    roles: [
      {
        id: userId,
        role_name: role as RoleName,
        status: role === 'player' ? 'approved' : 'pending',
        scope_type: 'national',
        scope_id: null,
        permissions: getPermissionsForRole(role)
      }
    ]
  };

  mockUsers[email] = newUser;
}
