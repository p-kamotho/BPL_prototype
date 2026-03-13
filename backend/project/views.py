from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from django.core.paginator import Paginator
from datetime import datetime, timedelta
import json
import logging
from functools import wraps

from .models import (
    User, County, Role, UserRole, Club, ClubMember, Player, Ranking,
    Referee, Tournament, TournamentCategory, TournamentRegistration, Draw,
    TournamentBracket, Match, MatchReport, Payment, FinancialTransaction,
    Sanction, Appeal, DisciplinaryRecord, AuditLog, Notification, Message,
    Communication, SystemReport, SystemSetting, ActivityFeed
)

logger = logging.getLogger(__name__)

# ============= CUSTOM DECORATORS =============

def api_login_required(view_func):
    """Custom decorator that returns JSON instead of redirecting for API endpoints"""
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapped_view

# ============= AUTHENTICATION VIEWS =============

@csrf_exempt
@require_http_methods(["POST"])
def auth_login(request):
    """Handle user login"""
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            AuditLog.objects.create(
                user=user,
                action='LOGIN',
                ip_address=get_client_ip(request)
            )
            
            # Get user's roles
            user_roles = UserRole.objects.filter(user=user, is_active=True).select_related('role')
            roles_list = []
            for ur in user_roles:
                roles_list.append({
                    'id': ur.id,
                    'role_name': ur.role.role_name,
                    'role_id': ur.role.id,
                    'description': ur.role.description,
                    'scope_type': ur.role.scope_type,
                    'permissions': ur.role.permissions,
                    'status': ur.role.status
                })
            
            return JsonResponse({
                'status': 'success',
                'user': {
                    'user_id': user.id,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'phone': user.phone,
                    'role': user.role,
                    'is_staff': user.is_staff,
                    'roles': roles_list
                }
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def auth_register(request):
    """Handle user registration"""
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        phone = data.get('phone', '')
        role_name = data.get('role', 'player')  # Changed from 'system_user' to 'player'
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'Email already registered'}, status=400)
        
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name.split()[0] if full_name else '',
            last_name=' '.join(full_name.split()[1:]) if full_name else '',
            phone=phone,
            role=role_name
        )
        
        AuditLog.objects.create(
            user=user,
            action='USER_REGISTERED'
        )
        
        # Assign default role to new user
        try:
            role = Role.objects.get(role_name=role_name)
            UserRole.objects.create(
                user=user,
                role=role,
                is_active=True
            )
        except Role.DoesNotExist:
            logger.warning(f"Role '{role_name}' not found. Run 'python manage.py setup_roles' to create default roles.")
        
        login(request, user)
        
        # Get user's roles
        user_roles = UserRole.objects.filter(user=user, is_active=True).select_related('role')
        roles_list = []
        for ur in user_roles:
            roles_list.append({
                'id': ur.id,
                'role_name': ur.role.role_name,
                'role_id': ur.role.id,
                'description': ur.role.description,
                'scope_type': ur.role.scope_type,
                'permissions': ur.role.permissions,
                'status': ur.role.status
            })
        
        return JsonResponse({
            'status': 'success',
            'message': 'Registration successful',
            'user': {
                'user_id': user.id,
                'email': user.email,
                'full_name': user.get_full_name(),
                'role': user.role,
                'roles': roles_list
            }
        })
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def auth_logout(request):
    """Handle user logout"""
    try:
        if request.user.is_authenticated:
            AuditLog.objects.create(
                user=request.user,
                action='LOGOUT'
            )
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= PROFILE VIEWS =============

@require_http_methods(["GET", "PUT"])
@api_login_required
def profile_view(request):
    """Get or update user profile"""
    try:
        if request.method == 'GET':
            user = request.user
            profile_data = {}
            
            if hasattr(user, 'player_profile'):
                player = user.player_profile
                profile_data = {
                    'type': 'player',
                    'full_name': player.full_name,
                    'club_name': player.club.name if player.club else None,
                    'ranking_points': player.ranking_points,
                    'matches_played': player.matches_played,
                    'matches_won': player.matches_won,
                    'win_ratio': player.win_ratio
                }
            elif hasattr(user, 'referee_profile'):
                referee = user.referee_profile
                profile_data = {
                    'type': 'referee',
                    'full_name': referee.full_name,
                    'certification_level': referee.certification_level,
                    'county': referee.county.name if referee.county else None,
                    'matches_assigned': referee.matches_assigned
                }
            
            # Get user's roles
            user_roles = UserRole.objects.filter(user=user, is_active=True).select_related('role')
            roles_list = []
            for ur in user_roles:
                roles_list.append({
                    'id': ur.id,
                    'role_name': ur.role.role_name,
                    'role_id': ur.role.id,
                    'description': ur.role.description,
                    'scope_type': ur.role.scope_type,
                    'permissions': ur.role.permissions,
                    'status': ur.role.status
                })
            
            return JsonResponse({
                'status': 'success',
                'user': {
                    'user_id': user.id,
                    'full_name': user.get_full_name(),
                    'email': user.email,
                    'phone': user.phone,
                    'role': user.role,
                    'roles': roles_list,
                    'profile_data': profile_data
                }
            })
        
        elif request.method == 'PUT':
            user = request.user
            data = json.loads(request.body)
            
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.phone = data.get('phone', user.phone)
            user.save()
            
            AuditLog.objects.create(
                user=user,
                action='USER_UPDATED'
            )
            
            return JsonResponse({'status': 'success', 'message': 'Profile updated'})
    
    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= TOURNAMENT VIEWS =============

@require_http_methods(["GET", "POST"])
def tournaments_list(request):
    """List all tournaments or create new"""
    try:
        if request.method == 'GET':
            status = request.GET.get('status')
            level = request.GET.get('level')
            
            tournaments = Tournament.objects.all()
            
            if status:
                tournaments = tournaments.filter(status=status)
            if level:
                tournaments = tournaments.filter(level=level)
            
            tournaments = tournaments.order_by('-start_date')
            
            data = [
                {
                    'id': t.id,
                    'name': t.name,
                    'level': t.level,
                    'start_date': t.start_date.isoformat(),
                    'end_date': t.end_date.isoformat(),
                    'status': t.status,
                    'sanction_status': t.sanction_status,
                    'total_players': t.total_players,
                    'total_matches': t.total_matches,
                    'prize_pool': float(t.prize_pool),
                    'admin_id': t.admin_id
                }
                for t in tournaments
            ]
            
            return JsonResponse({'status': 'success', 'data': data})
        
        elif request.method == 'POST' and request.user.is_authenticated:
            data = json.loads(request.body)
            
            tournament = Tournament.objects.create(
                name=data.get('name'),
                description=data.get('description', ''),
                level=data.get('level'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                venue=data.get('venue', ''),
                admin=request.user,
                status=data.get('status', 'planning'),
                prize_pool=data.get('prize_pool', 0),
                registration_fee=data.get('registration_fee', 0)
            )
            
            AuditLog.objects.create(
                user=request.user,
                action='TOURNAMENT_CREATED',
                target_type='Tournament',
                target_id=tournament.id
            )
            
            return JsonResponse({'status': 'success', 'id': tournament.id}, status=201)
    
    except Exception as e:
        logger.error(f"Tournaments list error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET", "PUT"])
def tournament_detail(request, tournament_id):
    """Get or update tournament details"""
    try:
        tournament = get_object_or_404(Tournament, id=tournament_id)
        
        if request.method == 'GET':
            data = {
                'id': tournament.id,
                'name': tournament.name,
                'description': tournament.description,
                'level': tournament.level,
                'start_date': tournament.start_date.isoformat(),
                'end_date': tournament.end_date.isoformat(),
                'venue': tournament.venue,
                'status': tournament.status,
                'sanction_status': tournament.sanction_status,
                'total_players': tournament.total_players,
                'total_matches': tournament.total_matches,
                'prize_pool': float(tournament.prize_pool),
                'registration_fee': float(tournament.registration_fee),
                'admin_id': tournament.admin_id,
                'created_at': tournament.created_at.isoformat()
            }
            return JsonResponse({'status': 'success', 'data': data})
        
        elif request.method == 'PUT' and request.user.is_authenticated:
            data = json.loads(request.body)
            tournament.name = data.get('name', tournament.name)
            tournament.description = data.get('description', tournament.description)
            tournament.status = data.get('status', tournament.status)
            tournament.sanction_status = data.get('sanction_status', tournament.sanction_status)
            tournament.save()
            
            AuditLog.objects.create(
                user=request.user,
                action='TOURNAMENT_UPDATED',
                target_type='Tournament',
                target_id=tournament.id
            )
            
            return JsonResponse({'status': 'success', 'message': 'Tournament updated'})
    
    except Exception as e:
        logger.error(f"Tournament detail error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= PLAYER VIEWS =============

@require_http_methods(["GET"])
def players_list(request):
    """List all players"""
    try:
        club_id = request.GET.get('club_id')
        
        players = Player.objects.all().select_related('club', 'user')
        
        if club_id:
            players = players.filter(club_id=club_id)
        
        players = players.order_by('-ranking_points')
        
        data = [
            {
                'id': p.id,
                'user_id': p.user_id,
                'full_name': p.full_name,
                'email': p.user.email,
                'club_name': p.club.name if p.club else None,
                'ranking_points': p.ranking_points,
                'matches_played': p.matches_played,
                'matches_won': p.matches_won,
                'gender': p.gender,
                'is_active': p.is_active
            }
            for p in players
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Players list error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def player_detail(request, player_id):
    """Get player details"""
    try:
        player = get_object_or_404(Player, id=player_id)
        
        sanctions = Sanction.objects.filter(player=player, status='active')
        
        data = {
            'id': player.id,
            'user_id': player.user_id,
            'full_name': player.full_name,
            'email': player.user.email,
            'club_name': player.club.name if player.club else None,
            'ranking_points': player.ranking_points,
            'career_points': player.career_points,
            'matches_played': player.matches_played,
            'matches_won': player.matches_won,
            'win_ratio': player.win_ratio,
            'gender': player.gender,
            'date_of_birth': player.date_of_birth.isoformat() if player.date_of_birth else None,
            'is_active': player.is_active,
            'sanctions_count': sanctions.count(),
            'recent_sanctions': [
                {
                    'id': s.id,
                    'type': s.sanction_type,
                    'reason': s.reason,
                    'start_date': s.start_date.isoformat(),
                    'end_date': s.end_date.isoformat() if s.end_date else None,
                    'status': s.status
                }
                for s in sanctions[:5]
            ]
        }
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Player detail error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def player_rankings(request):
    """Get player rankings"""
    try:
        category = request.GET.get('category', '')
        limit = int(request.GET.get('limit', 100))
        
        rankings = Ranking.objects.all().select_related('player').order_by('rank_position')
        
        if category:
            rankings = rankings.filter(category=category)
        
        data = [
            {
                'rank_position': r.rank_position,
                'player_id': r.player_id,
                'player_name': r.player.full_name,
                'club_name': r.player.club.name if r.player.club else None,
                'points': r.points,
                'category': r.category,
                'email': r.player.user.email
            }
            for r in rankings[:limit]
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Rankings error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= MATCH VIEWS =============

@require_http_methods(["GET"])
def matches_list(request):
    """List matches"""
    try:
        tournament_id = request.GET.get('tournament_id')
        status = request.GET.get('status')
        
        matches = Match.objects.all().select_related(
            'tournament', 'player1', 'player2', 'referee'
        )
        
        if tournament_id:
            matches = matches.filter(tournament_id=tournament_id)
        if status:
            matches = matches.filter(status=status)
        
        matches = matches.order_by('-created_at')
        
        data = [
            {
                'id': m.id,
                'tournament_id': m.tournament_id,
                'tournament_name': m.tournament.name,
                'player1_id': m.player1_id,
                'player1_name': m.player1.full_name if m.player1 else 'TBD',
                'player2_id': m.player2_id,
                'player2_name': m.player2.full_name if m.player2 else 'TBD',
                'referee_id': m.referee_id,
                'referee_name': m.referee.full_name if m.referee else None,
                'status': m.status,
                'score1': m.score_player1_set1,
                'score2': m.score_player2_set1,
                'scheduled_time': m.scheduled_time.isoformat() if m.scheduled_time else None,
                'winner_id': m.winner_id
            }
            for m in matches
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Matches list error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def match_detail(request, match_id):
    """Get match details"""
    try:
        match = get_object_or_404(Match, id=match_id)
        
        data = {
            'id': match.id,
            'tournament_id': match.tournament_id,
            'tournament_name': match.tournament.name,
            'player1_id': match.player1_id,
            'player1_name': match.player1.full_name if match.player1 else 'TBD',
            'player2_id': match.player2_id,
            'player2_name': match.player2.full_name if match.player2 else 'TBD',
            'scores': {
                'set1': {'player1': match.score_player1_set1, 'player2': match.score_player2_set1},
                'set2': {'player1': match.score_player1_set2, 'player2': match.score_player2_set2},
                'set3': {'player1': match.score_player1_set3, 'player2': match.score_player2_set3}
            },
            'referee_id': match.referee_id,
            'referee_name': match.referee.full_name if match.referee else None,
            'status': match.status,
            'venue': match.venue,
            'court_number': match.court_number,
            'scheduled_time': match.scheduled_time.isoformat() if match.scheduled_time else None,
            'start_time': match.start_time.isoformat() if match.start_time else None,
            'end_time': match.end_time.isoformat() if match.end_time else None,
            'winner_id': match.winner_id,
            'notes': match.notes,
            'created_at': match.created_at.isoformat()
        }
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Match detail error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST", "PUT"])
def match_update_score(request, match_id):
    """Update match score"""
    try:
        match = get_object_or_404(Match, id=match_id)
        data = json.loads(request.body)
        
        if request.method == 'POST':
            match.score_player1_set1 = data.get('score1_set1', 0)
            match.score_player2_set1 = data.get('score2_set1', 0)
            match.score_player1_set2 = data.get('score1_set2', 0)
            match.score_player2_set2 = data.get('score2_set2', 0)
            
            if 'score1_set3' in data:
                match.score_player1_set3 = data.get('score1_set3')
                match.score_player2_set3 = data.get('score2_set3')
            
            match.status = data.get('status', 'in_progress')
            
            if data.get('winner_id'):
                match.winner_id = data.get('winner_id')
                match.status = 'completed'
            
            match.save()
            
            AuditLog.objects.create(
                user=request.user,
                action='MATCH_UPDATED',
                target_type='Match',
                target_id=match.id
            )
        
        return JsonResponse({'status': 'success', 'message': 'Match updated'})
    
    except Exception as e:
        logger.error(f"Match update error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= CLUB VIEWS =============

@require_http_methods(["GET"])
def clubs_list(request):
    """List all clubs"""
    try:
        status = request.GET.get('status')
        
        clubs = Club.objects.all().select_related('county')
        
        if status:
            clubs = clubs.filter(status=status)
        
        data = [
            {
                'id': c.id,
                'name': c.name,
                'county': c.county.name if c.county else None,
                'registration_number': c.registration_number,
                'status': c.status,
                'contact_person': c.contact_person,
                'contact_phone': c.contact_phone,
                'contact_email': c.contact_email,
                'created_at': c.created_at.isoformat()
            }
            for c in clubs
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Clubs list error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def club_detail(request, club_id):
    """Get club details"""
    try:
        club = get_object_or_404(Club, id=club_id)
        
        members = ClubMember.objects.filter(club=club).select_related('user')
        players = Player.objects.filter(club=club)
        
        data = {
            'id': club.id,
            'name': club.name,
            'county': club.county.name if club.county else None,
            'registration_number': club.registration_number,
            'description': club.description,
            'status': club.status,
            'contact_person': club.contact_person,
            'contact_phone': club.contact_phone,
            'contact_email': club.contact_email,
            'members_count': members.count(),
            'players_count': players.count(),
            'members': [
                {
                    'id': m.id,
                    'user_id': m.user_id,
                    'name': m.user.get_full_name(),
                    'email': m.user.email,
                    'role': m.role,
                    'joined_at': m.joined_at.isoformat()
                }
                for m in members
            ],
            'created_at': club.created_at.isoformat()
        }
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Club detail error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= REGISTRATION VIEWS =============

@csrf_exempt
@require_http_methods(["POST"])
def register_tournament(request):
    """Register player for tournament"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        data = json.loads(request.body)
        
        player = get_object_or_404(Player, user=request.user)
        tournament = get_object_or_404(Tournament, id=data.get('tournament_id'))
        category = get_object_or_404(TournamentCategory, id=data.get('category_id'))
        
        registration = TournamentRegistration.objects.create(
            tournament=tournament,
            player=player,
            category=category,
            partner_player_id=data.get('partner_player_id'),
            status='pending',
            payment_status='unpaid'
        )
        
        return JsonResponse({'status': 'success', 'registration_id': registration.id}, status=201)
    
    except Exception as e:
        logger.error(f"Tournament registration error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= PAYMENT VIEWS =============

@csrf_exempt
@require_http_methods(["GET"])
def payment_status(request, payment_id):
    """Check payment status"""
    try:
        payment = get_object_or_404(Payment, id=payment_id)
        
        data = {
            'id': payment.id,
            'amount': float(payment.amount),
            'status': payment.status,
            'payment_method': payment.payment_method,
            'provider_ref': payment.provider_ref,
            'transaction_id': payment.transaction_id,
            'created_at': payment.created_at.isoformat()
        }
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Payment status error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def process_payment(request):
    """Process tournament registration payment"""
    try:
        data = json.loads(request.body)
        
        registration = get_object_or_404(TournamentRegistration, id=data.get('registration_id'))
        
        payment = Payment.objects.create(
            registration=registration,
            amount=registration.category.entry_fee,
            status='pending',
            payment_method=data.get('payment_method', 'mpesa'),
            provider_ref=data.get('provider_ref', '')
        )
        
        return JsonResponse({
            'status': 'success',
            'payment_id': payment.id,
            'message': 'Payment processed'
        }, status=201)
    
    except Exception as e:
        logger.error(f"Payment processing error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= ADMIN VIEWS =============

@require_http_methods(["GET"])
@api_login_required
def admin_users(request):
    """List all users (admin only)"""
    try:
        if not request.user.is_staff:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        users = User.objects.all().order_by('-created_at')
        
        data = [
            {
                'id': u.id,
                'user_id': u.id,
                'full_name': u.get_full_name(),
                'email': u.email,
                'status': 'active' if u.is_active else 'inactive',
                'roles': [
                    {
                        'id': ur.role.id,
                        'role_name': ur.role.role_name,
                        'status': ur.role.status,
                        'scope_type': ur.role.scope_type
                    }
                    for ur in u.user_roles.all()
                ],
                'phone': u.phone,
                'created_at': u.created_at.isoformat()
            }
            for u in users
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Admin users error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
@api_login_required
def admin_audit_logs(request):
    """List audit logs (admin only)"""
    try:
        if not request.user.is_staff:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        action = request.GET.get('action')
        days = int(request.GET.get('days', 30))
        
        since = timezone.now() - timedelta(days=days)
        
        logs = AuditLog.objects.filter(created_at__gte=since).select_related('user').order_by('-created_at')
        
        if action:
            logs = logs.filter(action=action)
        
        data = [
            {
                'id': l.id,
                'user_id': l.user_id,
                'full_name': l.user.get_full_name() if l.user else None,
                'action': l.action,
                'details': l.details,
                'created_at': l.created_at.isoformat(),
                'target_type': l.target_type,
                'target_id': l.target_id
            }
            for l in logs
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Audit logs error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
@api_login_required
def admin_dashboard_stats(request):
    """Get admin dashboard statistics"""
    try:
        if not request.user.is_staff:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)
        
        stats = {
            'total_users': User.objects.count(),
            'total_players': Player.objects.count(),
            'total_tournaments': Tournament.objects.count(),
            'total_matches': Match.objects.count(),
            'total_clubs': Club.objects.count(),
            'active_tournaments': Tournament.objects.filter(status='in_progress').count(),
            'pending_payments': Payment.objects.filter(status='pending').count(),
            'active_sanctions': Sanction.objects.filter(status='active').count(),
            'total_revenue': float(Payment.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0)
        }
        
        return JsonResponse({'status': 'success', 'data': stats})
    
    except Exception as e:
        logger.error(f"Dashboard stats error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= NOTIFICATION VIEWS =============

@require_http_methods(["GET"])
@api_login_required
def user_notifications(request):
    """Get user notifications"""
    try:
        unread = request.GET.get('unread', 'false').lower() == 'true'
        
        notifications = Notification.objects.filter(user=request.user)
        
        if unread:
            notifications = notifications.filter(is_read=False)
        
        notifications = notifications.order_by('-created_at')[:50]
        
        data = [
            {
                'id': n.id,
                'title': n.title,
                'message': n.message,
                'notification_type': n.notification_type,
                'is_read': n.is_read,
                'action_url': n.action_url,
                'created_at': n.created_at.isoformat()
            }
            for n in notifications
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Notifications error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= DISCIPLINARY VIEWS =============

@require_http_methods(["GET"])
def sanctions_list(request):
    """List sanctions"""
    try:
        status = request.GET.get('status')
        
        sanctions = Sanction.objects.all().select_related('player')
        
        if status:
            sanctions = sanctions.filter(status=status)
        
        data = [
            {
                'id': s.id,
                'player_id': s.player_id,
                'player_name': s.player.full_name,
                'sanction_type': s.sanction_type,
                'reason': s.reason,
                'start_date': s.start_date.isoformat(),
                'end_date': s.end_date.isoformat() if s.end_date else None,
                'status': s.status,
                'issued_date': s.issued_date.isoformat()
            }
            for s in sanctions
        ]
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Sanctions list error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def sanction_detail(request, sanction_id):
    """Get sanction details"""
    try:
        sanction = get_object_or_404(Sanction, id=sanction_id)
        
        data = {
            'id': sanction.id,
            'player_id': sanction.player_id,
            'player_name': sanction.player.full_name,
            'sanction_type': sanction.sanction_type,
            'reason': sanction.reason,
            'start_date': sanction.start_date.isoformat(),
            'end_date': sanction.end_date.isoformat() if sanction.end_date else None,
            'status': sanction.status,
            'issued_by': sanction.issued_by.get_full_name() if sanction.issued_by else None,
            'issued_date': sanction.issued_date.isoformat(),
            'has_appeal': hasattr(sanction, 'appeal'),
            'appeal': {
                'id': sanction.appeal.id,
                'status': sanction.appeal.status,
                'reason': sanction.appeal.reason
            } if hasattr(sanction, 'appeal') else None
        }
        
        return JsonResponse({'status': 'success', 'data': data})
    
    except Exception as e:
        logger.error(f"Sanction detail error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def file_appeal(request, sanction_id):
    """File an appeal against a sanction"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        sanction = get_object_or_404(Sanction, id=sanction_id)
        data = json.loads(request.body)
        
        appeal = Appeal.objects.create(
            sanction=sanction,
            player=sanction.player,
            reason=data.get('reason', ''),
            status='pending'
        )
        
        return JsonResponse({'status': 'success', 'appeal_id': appeal.id}, status=201)
    
    except Exception as e:
        logger.error(f"File appeal error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= USER-SPECIFIC VIEWS =============

@csrf_exempt
@require_http_methods(["DELETE"])
@api_login_required
def delete_account(request):
    """Delete user account"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        user_id = request.user.id
        email = request.user.email
        
        # Log the deletion
        AuditLog.objects.create(
            user=request.user,
            action='ACCOUNT_DELETED',
            ip_address=get_client_ip(request)
        )
        
        # Delete the user
        request.user.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Account deleted successfully'
        })
    
    except Exception as e:
        logger.error(f"Delete account error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@api_login_required
def user_clubs(request):
    """Get clubs for current user"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        clubs = Club.objects.filter(
            clubmember__user=request.user
        ).distinct()
        
        data = [{
            'id': club.id,
            'name': club.name,
            'county': club.county.name if club.county else '',
            'status': club.status,
            'members_count': club.clubmember_set.count(),
            'created_date': club.created_date.isoformat() if club.created_date else None
        } for club in clubs]
        
        return JsonResponse({
            'status': 'success',
            'data': data
        })
    
    except Exception as e:
        logger.error(f"User clubs error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def user_matches(request):
    """Get matches for current user"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        # Get matches where user is a player
        matches = Match.objects.filter(
            Q(player1__user=request.user) | Q(player2__user=request.user)
        ).distinct()
        
        data = [{
            'id': match.id,
            'tournament': match.tournament.name if match.tournament else '',
            'player1': {
                'id': match.player1.id if match.player1 else None,
                'name': match.player1.user.get_full_name() if match.player1 and match.player1.user else ''
            } if match.player1 else None,
            'player2': {
                'id': match.player2.id if match.player2 else None,
                'name': match.player2.user.get_full_name() if match.player2 and match.player2.user else ''
            } if match.player2 else None,
            'status': match.status,
            'score1': match.score_player1,
            'score2': match.score_player2,
            'scheduled_date': match.scheduled_date.isoformat() if match.scheduled_date else None,
            'winner': {
                'id': match.winner.id if match.winner else None,
                'name': match.winner.user.get_full_name() if match.winner and match.winner.user else ''
            } if match.winner else None
        } for match in matches]
        
        return JsonResponse({
            'status': 'success',
            'data': data
        })
    
    except Exception as e:
        logger.error(f"User matches error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def user_tournaments(request):
    """Get tournaments for current user (those they're registered for)"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        registrations = TournamentRegistration.objects.filter(
            player__user=request.user
        )
        
        tournaments = set()
        for reg in registrations:
            if reg.tournament:
                tournaments.add(reg.tournament)
        
        data = [{
            'id': t.id,
            'name': t.name,
            'level': t.level,
            'status': t.status,
            'start_date': t.start_date.isoformat() if t.start_date else None,
            'end_date': t.end_date.isoformat() if t.end_date else None,
            'location': t.location or '',
            'categories': t.tournamentcategory_set.count()
        } for t in tournaments]
        
        return JsonResponse({
            'status': 'success',
            'data': data
        })
    
    except Exception as e:
        logger.error(f"User tournaments error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def user_registrations(request):
    """Get tournament registrations for current user"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        registrations = TournamentRegistration.objects.filter(
            player__user=request.user
        ).select_related('tournament', 'tournament__category')
        
        data = [{
            'id': reg.id,
            'tournament_id': reg.tournament.id if reg.tournament else None,
            'tournament_name': reg.tournament.name if reg.tournament else '',
            'category_id': reg.tournament.id if reg.tournament else None,
            'category_name': reg.category.name if hasattr(reg, 'category') else '',
            'status': reg.status,
            'registration_date': reg.registration_date.isoformat() if reg.registration_date else None,
            'payment_status': reg.payment_status,
            'payment_amount': float(reg.payment_amount) if reg.payment_amount else 0
        } for reg in registrations]
        
        return JsonResponse({
            'status': 'success',
            'data': data
        })
    
    except Exception as e:
        logger.error(f"User registrations error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def user_dashboard(request):
    """Get user dashboard data"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
        
        # Get user statistics
        player_profile = Player.objects.filter(user=request.user).first()
        
        stats = {
            'user_id': request.user.id,
            'full_name': request.user.get_full_name(),
            'email': request.user.email,
            'phone': request.user.phone,
            'role': request.user.role,
            'clubs_count': Club.objects.filter(members__user=request.user).count(),
            'tournaments_registered': TournamentRegistration.objects.filter(
                player__user=request.user
            ).count(),
            'matches_played': Match.objects.filter(
                Q(player1__user=request.user) | Q(player2__user=request.user)
            ).count(),
            'ranking': {
                'position': player_profile.ranking if player_profile else None,
                'wins': player_profile.matches_won if player_profile else 0,
                'losses': player_profile.matches_lost if player_profile else 0
            } if player_profile else {'position': None, 'wins': 0, 'losses': 0}
        }
        
        return JsonResponse({
            'status': 'success',
            'data': stats
        })
    
    except Exception as e:
        logger.error(f"User dashboard error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)



# ============= HELPER FUNCTIONS =============

def send_approval_email(user_email, user_name, approval_type, portal_url):
    """Send approval notification email"""
    try:
        from django.core.mail import send_mail
        
        subject = f"Your {approval_type} Registration Has Been Approved - Badminton Kenya OS"
        
        message = f"""
Dear {user_name},

Congratulations! Your {approval_type} registration for Badminton Kenya OS has been approved.

You can now access your {approval_type} portal by logging in at: {portal_url}

If you have any questions or issues, please contact the Badminton Kenya support team.

Best regards,
Badminton Kenya OS Team
        """
        
        html_message = f"""
<html>
    <body>
        <h2>Registration Approved!</h2>
        <p>Dear {user_name},</p>
        <p>Congratulations! Your <strong>{approval_type}</strong> registration for <strong>Badminton Kenya OS</strong> has been approved.</p>
        <p>You can now access your {approval_type} portal by <a href="{portal_url}">logging in here</a></p>
        <p>If you have any questions or issues, please contact the Badminton Kenya support team.</p>
        <p>Best regards,<br/>Badminton Kenya OS Team</p>
    </body>
</html>
        """
        
        send_mail(
            subject,
            message,
            'badminton.kenya.os@example.com',
            [user_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Approval email sent to {user_email} for {approval_type}")
        return True
    except Exception as e:
        logger.error(f"Failed to send approval email: {str(e)}")
        return False


# ============= APPROVAL VIEWS =============

@csrf_exempt
@require_http_methods(["POST"])
@api_login_required
def approve_club_manager(request):
    """Super admin approves club manager registration"""
    try:
        # Check if user is super admin
        admin_role = UserRole.objects.filter(user=request.user, role__role_name='super_admin').first()
        if not admin_role:
            return JsonResponse({'status': 'error', 'message': 'Only super admin can approve club managers'}, status=403)
        
        data = json.loads(request.body)
        user_id = data.get('user_id')
        club_name = data.get('club_name')
        club_location = data.get('club_location')
        
        # Get the user to approve
        user = User.objects.get(id=user_id)
        
        # Get or create club manager role
        club_manager_role = Role.objects.get(role_name='club_manager')
        
        # Create or update user role
        user_role, created = UserRole.objects.update_or_create(
            user=user,
            role=club_manager_role,
            defaults={'is_active': True}
        )
        
        # Create club with provided details
        club, _ = Club.objects.update_or_create(
            contact_email=user.email,
            defaults={
                'name': club_name,
                'county_id': 1,  # Default county, should be selectable
                'registration_number': f"CLUB-{user_id}-{club_name.replace(' ', '-')}",
                'contact_person': user.get_full_name(),
                'contact_phone': user.phone,
                'status': 'approved',
                'created_by': request.user
            }
        )
        
        # Create club member relationship
        ClubMember.objects.update_or_create(
            user=user,
            club=club,
            defaults={'role': 'manager', 'joined_date': timezone.now()}
        )
        
        AuditLog.objects.create(
            user=request.user,
            action='CLUB_MANAGER_APPROVED',
            description=f"Approved club manager {user.email} for club {club_name}",
            ip_address=get_client_ip(request)
        )
        
        # Send approval email
        send_approval_email(
            user.email,
            user.get_full_name(),
            'Club Manager',
            'http://localhost:3000'
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Club manager approved successfully',
            'club': {
                'id': club.id,
                'name': club.name,
                'status': club.status
            }
        })
    except Exception as e:
        logger.error(f"Approve club manager error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@api_login_required
def approve_player_registration(request):
    """Club manager approves player registration to club"""
    try:
        data = json.loads(request.body)
        player_user_id = data.get('player_user_id')
        club_id = data.get('club_id')
        
        # Check if user is club manager for this club
        club_member = ClubMember.objects.filter(
            user=request.user,
            club_id=club_id,
            role='manager'
        ).first()
        
        if not club_member:
            return JsonResponse({'status': 'error', 'message': 'You are not a manager of this club'}, status=403)
        
        # Get player user
        player_user = User.objects.get(id=player_user_id)
        
        # Add player to club
        club_member, created = ClubMember.objects.update_or_create(
            user=player_user,
            club_id=club_id,
            defaults={'role': 'player', 'joined_date': timezone.now()}
        )
        
        # Ensure player has player role
        player_role = Role.objects.get(role_name='player')
        UserRole.objects.update_or_create(
            user=player_user,
            role=player_role,
            defaults={'is_active': True}
        )
        
        AuditLog.objects.create(
            user=request.user,
            action='PLAYER_APPROVED',
            description=f"Approved player {player_user.email} for club {club_member.club.name}",
            ip_address=get_client_ip(request)
        )
        
        # Send approval email
        club = club_member.club
        send_approval_email(
            player_user.email,
            player_user.get_full_name(),
            f'Player ({club.name})',
            'http://localhost:3000'
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Player approved successfully',
            'message_sent': True
        })
    except Exception as e:
        logger.error(f"Approve player error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= CALENDAR & EVENTS VIEWS =============

@require_http_methods(["GET"])
def tournament_calendar(request):
    """Get tournament calendar events"""
    try:
        tournaments = Tournament.objects.all().order_by('start_date')
        events = []
        
        for tournament in tournaments:
            events.append({
                'id': tournament.id,
                'title': tournament.name,
                'start': tournament.start_date.isoformat(),
                'end': tournament.end_date.isoformat() if tournament.end_date else tournament.start_date.isoformat(),
                'level': tournament.level,
                'status': tournament.status,
                'location': tournament.location if hasattr(tournament, 'location') else 'TBD',
                'registrations': TournamentRegistration.objects.filter(tournament=tournament).count()
            })
        
        return JsonResponse({
            'status': 'success',
            'events': events,
            'total': len(events)
        })
    except Exception as e:
        logger.error(f"Calendar error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
def search_tournaments(request):
    """Search and filter tournaments"""
    try:
        search_term = request.GET.get('q', '')
        level = request.GET.get('level')
        status = request.GET.get('status')
        
        tournaments = Tournament.objects.all()
        
        if search_term:
            tournaments = tournaments.filter(Q(name__icontains=search_term) | Q(location__icontains=search_term))
        if level:
            tournaments = tournaments.filter(level=level)
        if status:
            tournaments = tournaments.filter(status=status)
        
        tournaments = tournaments.order_by('-start_date')[:50]
        
        data = [{
            'id': t.id,
            'name': t.name,
            'level': t.level,
            'status': t.status,
            'start_date': t.start_date.isoformat(),
            'registrations': TournamentRegistration.objects.filter(tournament=t).count()
        } for t in tournaments]
        
        return JsonResponse({'status': 'success', 'results': data})
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= REPORTING & EXPORT VIEWS =============

@require_http_methods(["GET"])
@api_login_required
def export_player_data(request):
    """Export player data as JSON"""
    try:
        format_type = request.GET.get('format', 'json')  # json, csv, etc.
        
        players = Player.objects.filter(user=request.user).select_related('user', 'club')
        
        data = {
            'format': format_type,
            'exported_at': timezone.now().isoformat(),
            'player': {
                'full_name': players.first().full_name if players.exists() else request.user.get_full_name(),
                'email': request.user.email,
                'club': players.first().club.name if players.exists() and players.first().club else 'N/A',
                'ranking_points': players.first().ranking_points if players.exists() else 0,
                'matches_played': players.first().matches_played if players.exists() else 0,
                'matches_won': players.first().matches_won if players.exists() else 0,
                'win_ratio': players.first().win_ratio if players.exists() else 0,
            }
        }
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Export generated successfully'
        })
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
@api_login_required
def export_club_report(request):
    """Export club report"""
    try:
        club_id = request.GET.get('club_id')
        
        if not club_id:
            # Get club where user is manager
            club_member = ClubMember.objects.filter(user=request.user, role='manager').first()
            if not club_member:
                return JsonResponse({'status': 'error', 'message': 'Not a club manager'}, status=403)
            club = club_member.club
        else:
            club = Club.objects.get(id=club_id)
        
        members = ClubMember.objects.filter(club=club).count()
        matches = Match.objects.filter(tournament__clubs=club).count() if hasattr(club, 'tournament_set') else 0
        
        report = {
            'club_name': club.name,
            'location': club.location if hasattr(club, 'location') else 'N/A',
            'members_count': members,
            'matches_played': matches,
            'status': club.status,
            'created_at': club.created_at.isoformat() if hasattr(club, 'created_at') else 'N/A',
            'generated_at': timezone.now().isoformat()
        }
        
        return JsonResponse({
            'status': 'success',
            'report': report
        })
    except Exception as e:
        logger.error(f"Club report error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@require_http_methods(["GET"])
@api_login_required
def export_tournament_report(request):
    """Export tournament report"""
    try:
        tournament_id = request.GET.get('tournament_id')
        
        if not tournament_id:
            return JsonResponse({'status': 'error', 'message': 'Tournament ID required'}, status=400)
        
        tournament = Tournament.objects.get(id=tournament_id)
        registrations = TournamentRegistration.objects.filter(tournament=tournament).count()
        matches = Match.objects.filter(tournament=tournament).count()
        
        report = {
            'tournament_name': tournament.name,
            'level': tournament.level,
            'status': tournament.status,
            'start_date': tournament.start_date.isoformat(),
            'end_date': tournament.end_date.isoformat() if tournament.end_date else None,
            'registrations': registrations,
            'matches_played': matches,
            'generated_at': timezone.now().isoformat()
        }
        
        return JsonResponse({
            'status': 'success',
            'report': report
        })
    except Exception as e:
        logger.error(f"Tournament report error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ============= UTILITY VIEWS =============

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@require_http_methods(["GET"])
def system_health(request):
    """Check system health"""
    try:
        status = {
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'database': 'connected',
            'users': User.objects.count(),
            'tournaments': Tournament.objects.count()
        }
        return JsonResponse(status)
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return JsonResponse({'status': 'error'}, status=500)
