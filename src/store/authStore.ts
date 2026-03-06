import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoleName = 'super_admin' | 'tournament_admin' | 'referee' | 'club_manager' | 'player' | 'coach' | 'federation_admin';
export type Status = 'pending' | 'active' | 'suspended';
export type RoleStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export interface UserRole {
  id: number;
  role_name: RoleName;
  status: RoleStatus;
  scope_type: 'national' | 'county' | 'club' | 'tournament';
  scope_id: number | null;
  permissions: string[];
}

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  status: Status;
  phone?: string;
  roles: UserRole[];
}

// Default permissions for each role
const rolePermissions: Record<RoleName, string[]> = {
  super_admin: [
    'view_dashboard', 'manage_users', 'manage_roles_permissions', 'manage_governance_structure',
    'manage_tournament_details', 'manage_draws', 'view_registered_players', 'assign_referees',
    'control_matches', 'view_live_results', 'manage_disciplinary', 'view_financials',
    'view_reports', 'view_audit_log', 'manage_system_config', 'view_system_logs',
    'manage_backups', 'manage_feature_flags', 'manage_notifications', 'manage_maintenance'
  ],
  tournament_admin: [
    'manage_tournament_details', 'manage_draws', 'view_registered_players', 'assign_referees',
    'control_matches', 'view_live_results', 'manage_disciplinary', 'view_financials', 'view_reports'
  ],
  referee: [
    'view_certification', 'view_assigned_matches', 'score_matches', 'view_tournament_assignments',
    'view_performance_reviews', 'view_compliance', 'file_reports'
  ],
  club_manager: [
    'view_club_profile', 'manage_club_players', 'manage_club_coaches', 'register_tournaments',
    'view_financials', 'view_sanctions', 'view_match_reports', 'view_analytics'
  ],
  player: [
    'view_profile', 'edit_profile', 'view_club', 'view_tournaments', 'view_matches', 'view_rankings',
    'view_match_history', 'view_notifications', 'file_appeals', 'view_settings'
  ],
  coach: [
    'view_profile', 'view_club', 'view_tournaments', 'view_matches', 'view_rankings',
    'view_match_history', 'view_notifications', 'file_appeals', 'view_settings'
  ],
  federation_admin: [
    'manage_governance', 'manage_national_rankings', 'oversee_sanctions'
  ]
};

interface AuthState {
  user: User | null;
  activeRole: UserRole | null;
  setUser: (user: User | null) => void;
  setActiveRole: (role: UserRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activeRole: null,
      setUser: (user) => {
        if (user) {
          // Populate permissions for each role based on role_name
          const updatedRoles = user.roles.map(role => ({
            ...role,
            permissions: role.permissions.length > 0 ? role.permissions : rolePermissions[role.role_name] || []
          }));
          const updatedUser = { ...user, roles: updatedRoles };
          const activeRole = updatedUser.roles.find(r => r.status === 'approved') || null;
          set({ user: updatedUser, activeRole });
        } else {
          set({ user: null, activeRole: null });
        }
      },
      setActiveRole: (activeRole) => set({ activeRole }),
      logout: () => set({ user: null, activeRole: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
