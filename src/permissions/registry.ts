import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  ShieldCheck, 
  ClipboardList, 
  UserCircle, 
  Settings,
  History,
  Activity,
  FileText,
  AlertTriangle,
  Briefcase,
  Gavel,
  Flag,
  TrendingUp,
  Shield,
  Landmark,
  Database,
  ToggleLeft,
  Bell,
  Wrench,
  FileBarChart,
  Scale,
  Calendar,
  DollarSign,
  AlertCircle,
  BarChart3,
  UserCheck,
  Award
} from 'lucide-react';
import React from 'react';

export interface ModuleConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  permission: string;
  path: string;
  component?: React.ComponentType;
  section?: string;
  isCollapsed?: boolean;
}

export const moduleRegistry: ModuleConfig[] = [
  // Common
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard', path: '/dashboard' },
  
  // Player Portal
  { id: 'profile', label: 'My Profile', icon: UserCircle, permission: 'view_profile', path: '/profile', section: 'General' },
  { id: 'my-club', label: 'My Club', icon: ShieldCheck, permission: 'view_club', path: '/my-club' },
  { id: 'my-tournaments', label: 'My Tournaments', icon: Trophy, permission: 'view_tournaments', path: '/my-tournaments' },
  { id: 'matches', label: 'My Matches', icon: Activity, permission: 'view_matches', path: '/matches' },
  { id: 'rankings', label: 'Rankings', icon: TrendingUp, permission: 'view_rankings', path: '/rankings' },
  { id: 'match-history', label: 'Match History', icon: History, permission: 'view_match_history', path: '/match-history' },
  { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'view_notifications', path: '/notifications' },
  { id: 'appeals', label: 'Appeals / Reports', icon: Flag, permission: 'file_appeals', path: '/appeals' },
  { id: 'settings', label: 'Settings', icon: Settings, permission: 'view_settings', path: '/settings' },

  // Referee Portal
  { id: 'certification', label: 'My Certification', icon: Award, permission: 'view_certification', path: '/certification' },
  { id: 'assigned-matches', label: 'Assigned Matches', icon: Gavel, permission: 'view_assigned_matches', path: '/assigned-matches' },
  { id: 'match-scoring', label: 'Match Scoring', icon: ClipboardList, permission: 'score_matches', path: '/match-scoring' },
  { id: 'tournament-assignments', label: 'Tournament Assignments', icon: Calendar, permission: 'view_tournament_assignments', path: '/tournament-assignments' },
  { id: 'performance-reviews', label: 'Performance Reviews', icon: BarChart3, permission: 'view_performance_reviews', path: '/performance-reviews' },
  { id: 'compliance-status', label: 'Compliance Status', icon: ShieldCheck, permission: 'view_compliance', path: '/compliance-status' },
  { id: 'reports', label: 'Reports', icon: FileText, permission: 'file_reports', path: '/reports' },
  
  // Club Manager Portal
  { id: 'club-profile', label: 'Club Profile', icon: Shield, permission: 'view_club_profile', path: '/club-profile', section: 'Club Management' },
  { id: 'club-players', label: 'Players', icon: Users, permission: 'manage_club_players', path: '/club-players', section: 'Club Management' },
  { id: 'club-coaches', label: 'Coaches', icon: UserCheck, permission: 'manage_club_coaches', path: '/club-coaches', section: 'Club Management' },
  { id: 'tournament-registrations', label: 'Tournament Registrations', icon: Trophy, permission: 'register_tournaments', path: '/tournament-registrations', section: 'Tournaments' },
  { id: 'financial-overview', label: 'Financial Overview', icon: DollarSign, permission: 'view_financials', path: '/financial-overview', section: 'Financial & Reporting' },
  { id: 'sanctions-compliance', label: 'Sanctions & Compliance', icon: AlertCircle, permission: 'view_sanctions', path: '/sanctions-compliance', section: 'Compliance' },
  { id: 'match-reports', label: 'Match Reports', icon: FileText, permission: 'view_match_reports', path: '/match-reports', section: 'Reports & Analytics' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'view_analytics', path: '/analytics', section: 'Reports & Analytics' },

  // Tournament Admin Portal
  { id: 'tournament-details', label: 'Tournament Details', icon: FileText, permission: 'manage_tournament_details', path: '/tournament-details' },
  { id: 'categories-draws', label: 'Categories & Draws', icon: ClipboardList, permission: 'manage_draws', path: '/categories-draws' },
  { id: 'registered-players', label: 'Registered Players', icon: Users, permission: 'view_registered_players', path: '/registered-players' },
  { id: 'referee-assignment', label: 'Referee Assignment', icon: UserCheck, permission: 'assign_referees', path: '/referee-assignment' },
  { id: 'match-control', label: 'Match Control', icon: Activity, permission: 'control_matches', path: '/match-control' },
  { id: 'live-results', label: 'Live Results', icon: TrendingUp, permission: 'view_live_results', path: '/live-results' },
  { id: 'disciplinary-actions', label: 'Disciplinary Actions', icon: Scale, permission: 'manage_disciplinary', path: '/disciplinary-actions' },
  { id: 'financials', label: 'Financials', icon: DollarSign, permission: 'view_financials', path: '/financials' },
  { id: 'ta-reports', label: 'Reports', icon: FileText, permission: 'view_reports', path: '/ta-reports' },
  { id: 'audit-log', label: 'Audit Log', icon: History, permission: 'view_audit_log', path: '/audit-log' },

  // Federation Admin Portal
  { id: 'governance', label: 'Governance', icon: ShieldCheck, permission: 'manage_governance', path: '/governance' },
  { id: 'national-rankings', label: 'National Rankings', icon: TrendingUp, permission: 'manage_national_rankings', path: '/national-rankings' },
  { id: 'sanctions', label: 'Sanctions', icon: AlertTriangle, permission: 'oversee_sanctions', path: '/sanctions' },

  // Super Admin
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard', path: '/dashboard', section: 'Overview' },
  { id: 'users', label: 'User Management', icon: Users, permission: 'manage_users', path: '/users', section: 'Governance Control' },
  { id: 'roles-permissions', label: 'Role & Permission Manager', icon: Shield, permission: 'manage_roles_permissions', path: '/roles-permissions', section: 'Governance Control' },
  { id: 'governance-structure', label: 'Governance Structure', icon: Landmark, permission: 'manage_governance_structure', path: '/governance-structure', section: 'Governance Control' },
  { id: 'disciplinary-oversight', label: 'Disciplinary Oversight', icon: Scale, permission: 'manage_disciplinary', path: '/disciplinary-oversight', section: 'Governance Control' },
  
  { id: 'financial-overview', label: 'Financial Overview', icon: DollarSign, permission: 'view_financials', path: '/financial-overview', section: 'Financial & Reporting' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, permission: 'view_reports', path: '/reports', section: 'Financial & Reporting' },

  { id: 'tournament-details', label: 'Tournament Details', icon: FileText, permission: 'manage_tournament_details', path: '/tournament-details', section: 'Operations', isCollapsed: true },
  { id: 'categories-draws', label: 'Categories & Draws', icon: ClipboardList, permission: 'manage_draws', path: '/categories-draws', section: 'Operations', isCollapsed: true },
  { id: 'registered-players', label: 'Registered Players', icon: Users, permission: 'view_registered_players', path: '/registered-players', section: 'Operations', isCollapsed: true },
  { id: 'referee-assignment', label: 'Referee Assignment', icon: UserCheck, permission: 'assign_referees', path: '/referee-assignment', section: 'Operations', isCollapsed: true },
  { id: 'match-control', label: 'Match Control', icon: Activity, permission: 'control_matches', path: '/match-control', section: 'Operations', isCollapsed: true },
  { id: 'live-results', label: 'Live Results', icon: TrendingUp, permission: 'view_live_results', path: '/live-results', section: 'Operations', isCollapsed: true },

  { id: 'system-config', label: 'System Config', icon: Settings, permission: 'manage_system_config', path: '/system-config', section: 'System Infrastructure', isCollapsed: true },
  { id: 'logs', label: 'Logs', icon: History, permission: 'view_system_logs', path: '/logs', section: 'System Infrastructure', isCollapsed: true },
  { id: 'audit-log', label: 'Audit Log', icon: History, permission: 'view_audit_log', path: '/audit-log', section: 'System Infrastructure', isCollapsed: true },
  { id: 'backups', label: 'Backup & Export', icon: Database, permission: 'manage_backups', path: '/backups', section: 'System Infrastructure', isCollapsed: true },
  { id: 'feature-flags', label: 'Feature Flags', icon: ToggleLeft, permission: 'manage_feature_flags', path: '/feature-flags', section: 'System Infrastructure', isCollapsed: true },
  { id: 'notifications-engine', label: 'Notifications Engine', icon: Bell, permission: 'manage_notifications', path: '/notifications-engine', section: 'System Infrastructure', isCollapsed: true },
  { id: 'maintenance', label: 'Maintenance Mode', icon: Wrench, permission: 'manage_maintenance', path: '/maintenance', section: 'System Infrastructure', isCollapsed: true },
];
