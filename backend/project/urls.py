from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('api/auth/login', views.auth_login, name='auth_login'),
    path('api/auth/register', views.auth_register, name='auth_register'),
    path('api/auth/logout', views.auth_logout, name='auth_logout'),
    path('api/auth/delete-account', views.delete_account, name='delete_account'),
    
    # Profile endpoints
    path('api/profile', views.profile_view, name='profile'),
    
    # Tournament endpoints
    path('api/tournaments', views.tournaments_list, name='tournaments_list'),
    path('api/tournaments/<int:tournament_id>', views.tournament_detail, name='tournament_detail'),
    
    # Player endpoints
    path('api/players', views.players_list, name='players_list'),
    path('api/players/<int:player_id>', views.player_detail, name='player_detail'),
    path('api/rankings', views.player_rankings, name='player_rankings'),
    
    # Match endpoints
    path('api/matches', views.matches_list, name='matches_list'),
    path('api/matches/<int:match_id>', views.match_detail, name='match_detail'),
    path('api/matches/<int:match_id>/score', views.match_update_score, name='match_update_score'),
    
    # Club endpoints
    path('api/clubs', views.clubs_list, name='clubs_list'),
    path('api/clubs/<int:club_id>', views.club_detail, name='club_detail'),
    
    # Tournament registration
    path('api/tournaments/register', views.register_tournament, name='register_tournament'),
    
    # Payment endpoints
    path('api/payments', views.process_payment, name='process_payment'),
    path('api/payments/<int:payment_id>', views.payment_status, name='payment_status'),
    
    # User-specific endpoints
    path('api/user/clubs', views.user_clubs, name='user_clubs'),
    path('api/user/matches', views.user_matches, name='user_matches'),
    path('api/user/tournaments', views.user_tournaments, name='user_tournaments'),
    path('api/user/registrations', views.user_registrations, name='user_registrations'),
    path('api/user/dashboard', views.user_dashboard, name='user_dashboard'),
    
    # Admin endpoints
    path('api/admin/users', views.admin_users, name='admin_users'),
    path('api/admin/audit-logs', views.admin_audit_logs, name='admin_audit_logs'),
    path('api/admin/dashboard', views.admin_dashboard_stats, name='admin_dashboard'),
    
    # Notification endpoints
    path('api/notifications', views.user_notifications, name='user_notifications'),
    
    # Disciplinary endpoints
    path('api/sanctions', views.sanctions_list, name='sanctions_list'),
    path('api/sanctions/<int:sanction_id>', views.sanction_detail, name='sanction_detail'),
    path('api/sanctions/<int:sanction_id>/appeal', views.file_appeal, name='file_appeal'),
    
    # Approval endpoints
    path('api/admin/approve-club-manager', views.approve_club_manager, name='approve_club_manager'),
    path('api/admin/approve-player', views.approve_player_registration, name='approve_player'),
    
    # Calendar and Events
    path('api/calendar', views.tournament_calendar, name='tournament_calendar'),
    path('api/search/tournaments', views.search_tournaments, name='search_tournaments'),
    
    # Export and Reporting
    path('api/export/player', views.export_player_data, name='export_player'),
    path('api/export/club', views.export_club_report, name='export_club'),
    path('api/export/tournament', views.export_tournament_report, name='export_tournament'),
    
    # System endpoints
    path('api/health', views.system_health, name='system_health'),
]
