"""
Django management command to set up default roles with proper permissions
"""
from django.core.management.base import BaseCommand
from project.models import Role

class Command(BaseCommand):
    help = 'Set up default roles with proper permissions'

    def handle(self, *args, **options):
        # Define roles with their permissions
        roles_config = {
            'super_admin': {
                'description': 'Super Administrator - Full system access',
                'scope_type': 'national',
                'permissions': [
                    'view_dashboard', 'manage_users', 'manage_roles_permissions', 'manage_governance_structure',
                    'manage_tournament_details', 'manage_draws', 'view_registered_players', 'assign_referees',
                    'control_matches', 'view_live_results', 'manage_disciplinary', 'view_financials',
                    'view_reports', 'view_audit_log', 'manage_system_config', 'view_system_logs',
                    'manage_backups', 'manage_feature_flags', 'manage_notifications', 'manage_maintenance'
                ]
            },
            'tournament_admin': {
                'description': 'Tournament Administrator',
                'scope_type': 'national',
                'permissions': [
                    'view_dashboard', 'manage_tournament_details', 'manage_draws', 'view_registered_players',
                    'assign_referees', 'control_matches', 'view_live_results', 'manage_disciplinary',
                    'view_financials', 'view_reports'
                ]
            },
            'federation_admin': {
                'description': 'Federation Administrator',
                'scope_type': 'national',
                'permissions': [
                    'manage_governance', 'manage_national_rankings', 'oversee_sanctions', 'view_dashboard'
                ]
            },
            'club_manager': {
                'description': 'Club Manager - Manage club operations',
                'scope_type': 'club',
                'permissions': [
                    'view_dashboard', 'view_club_profile', 'manage_club_players', 'manage_club_coaches',
                    'register_tournaments', 'view_financials', 'view_sanctions', 'view_match_reports', 'view_analytics'
                ]
            },
            'player': {
                'description': 'Player - Access player portal',
                'scope_type': 'national',
                'permissions': [
                    'view_profile', 'edit_profile', 'view_club', 'view_tournaments', 'view_matches',
                    'view_rankings', 'view_match_history', 'view_notifications', 'file_appeals', 'view_settings',
                    'register_tournaments'
                ]
            },
            'referee': {
                'description': 'Referee - Access referee portal',
                'scope_type': 'national',
                'permissions': [
                    'view_dashboard', 'view_certification', 'view_assigned_matches', 'score_matches',
                    'view_tournament_assignments', 'view_performance_reviews', 'view_compliance', 'file_reports'
                ]
            },
            'coach': {
                'description': 'Coach - Access coach portal',
                'scope_type': 'club',
                'permissions': [
                    'view_profile', 'view_club', 'view_tournaments', 'view_matches', 'view_rankings',
                    'view_match_history', 'view_notifications', 'file_appeals', 'view_settings'
                ]
            },
        }

        for role_name, config in roles_config.items():
            role, created = Role.objects.update_or_create(
                role_name=role_name,
                defaults={
                    'description': config['description'],
                    'scope_type': config['scope_type'],
                    'permissions': config['permissions'],
                    'status': 'approved'
                }
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(
                self.style.SUCCESS(f'{status} role: {role_name}')
            )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully set up default roles with permissions!')
        )
