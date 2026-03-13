from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from project.models import (
    County, User, Role, UserRole, Club, Player, Referee, 
    Tournament, TournamentCategory, Match, Ranking, SystemSetting
)


class Command(BaseCommand):
    help = 'Seed the database with initial demo data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data seeding...'))
        
        # Create Counties
        counties = {}
        county_names = [
            ('Nairobi', 'NA'),
            ('Mombasa', 'MB'),
            ('Kisumu', 'KS'),
            ('Nakuru', 'NK'),
            ('Eldoret', 'ED'),
        ]
        
        for name, code in county_names:
            county, created = County.objects.get_or_create(
                name=name,
                code=code
            )
            counties[name] = county
            if created:
                self.stdout.write(f'Created county: {name}')
        
        # Create Roles
        roles = {}
        role_data = [
            ('super_admin', 'Super Administrator', 'national', ['all']),
            ('admin', 'System Administrator', 'national', ['tournaments', 'users', 'reports']),
            ('county_admin', 'County Administrator', 'county', ['county_tournaments', 'county_users']),
            ('club_manager', 'Club Manager', 'club', ['club_tournaments', 'club_members']),
            ('player', 'Player', 'club', ['view_tournaments', 'register']),
            ('referee', 'Referee', 'national', ['view_matches', 'submit_results']),
        ]
        
        for role_name, description, scope, perms in role_data:
            role, created = Role.objects.get_or_create(
                role_name=role_name,
                defaults={
                    'description': description,
                    'scope_type': scope,
                    'permissions': perms,
                    'status': 'approved'
                }
            )
            roles[role_name] = role
            if created:
                self.stdout.write(f'Created role: {role_name}')
        
        # Create Admin User
        admin_user, created = User.objects.get_or_create(
            username='admin@badminton.ke',
            defaults={
                'email': 'admin@badminton.ke',
                'first_name': 'Admin',
                'last_name': 'User',
                'phone': '+254712345678',
                'role': 'super_admin',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(f'Created admin user: admin@badminton.ke')
        else:
            # Update password if exists but might be wrong
            admin_user.set_password('admin123')
            admin_user.save()
        
        # Assign admin role
        UserRole.objects.get_or_create(
            user=admin_user,
            role=roles['super_admin']
        )
        
        # Create test players
        players_data = [
            ('John Omondi', 'john@badminton.ke', 'Riverside Badminton Club', 1250),
            ('Sarah Kipchoge', 'sarah@badminton.ke', 'Elite Sports Club', 980),
            ('David Kariuki', 'david@badminton.ke', 'Mountain View Sports', 890),
            ('Mary Wanjiru', 'mary@badminton.ke', 'Coastal Badminton Club', 750),
        ]
        
        clubs_created = {}
        for club_name in ['Riverside Badminton Club', 'Elite Sports Club', 'Mountain View Sports', 'Coastal Badminton Club']:
            club, _ = Club.objects.get_or_create(
                name=club_name,
                defaults={
                    'county': counties['Nairobi'],
                    'registration_number': f'REG-{club_name.replace(" ", "-").upper()}',
                    'status': 'approved',
                    'created_by': admin_user
                }
            )
            clubs_created[club_name] = club
        
        for full_name, email, club_name, ranking_points in players_data:
            user, _ = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': full_name.split()[0],
                    'last_name': ' '.join(full_name.split()[1:]),
                    'role': 'player',
                    'is_active': True,
                }
            )
            if _ and not user.has_usable_password():
                user.set_password('player123')
                user.save()
            
            player, created = Player.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': full_name,
                    'club': clubs_created.get(club_name),
                    'ranking_points': ranking_points,
                    'career_points': ranking_points,
                    'matches_played': 10,
                    'matches_won': 7,
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'Created player: {full_name}')
                
                # Create ranking entry
                Ranking.objects.get_or_create(
                    player=player,
                    rank_position=1,
                    defaults={
                        'points': ranking_points,
                        'category': 'singles',
                        'period_start': date.today(),
                        'period_end': date.today() + timedelta(days=365),
                    }
                )
        
        # Create test referees
        referee_data = [
            ('Samuel Kipchoge', 'samuel.ref@badminton.ke', 'national'),
            ('Grace Mwangi', 'grace.ref@badminton.ke', 'county'),
        ]
        
        for full_name, email, cert_level in referee_data:
            user, _ = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': full_name.split()[0],
                    'last_name': ' '.join(full_name.split()[1:]),
                    'role': 'referee',
                    'is_active': True,
                }
            )
            if _ and not user.has_usable_password():
                user.set_password('referee123')
                user.save()
            
            referee, created = Referee.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': full_name,
                    'certification_level': cert_level,
                    'county': counties['Nairobi'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'Created referee: {full_name}')
        
        # Create test tournaments
        tournament_data = [
            ('Kenya National Championship 2025', 'national', date(2025, 6, 1), date(2025, 6, 15)),
            ('Nairobi Regional Open', 'regional', date(2025, 5, 10), date(2025, 5, 12)),
            ('District Level Tournament', 'county', date(2025, 4, 15), date(2025, 4, 20)),
        ]
        
        for name, level, start_date, end_date in tournament_data:
            tournament, created = Tournament.objects.get_or_create(
                name=name,
                defaults={
                    'description': f'{name} for all badminton enthusiasts',
                    'level': level,
                    'start_date': start_date,
                    'end_date': end_date,
                    'admin': admin_user,
                    'status': 'upcoming',
                    'sanction_status': 'approved',
                    'prize_pool': 100000,
                    'registration_fee': 5000,
                }
            )
            if created:
                self.stdout.write(f'Created tournament: {name}')
                
                # Create categories
                categories = [
                    ('singles_mens', "Men's Singles"),
                    ('singles_womens', "Women's Singles"),
                    ('mixed_doubles', 'Mixed Doubles'),
                ]
                
                for cat_key, cat_display in categories:
                    TournamentCategory.objects.get_or_create(
                        tournament=tournament,
                        category_name=cat_key,
                        defaults={
                            'max_participants': 64,
                            'entry_fee': 5000,
                        }
                    )
        
        # Create system settings
        settings_data = [
            ('tournament_registration_deadline', '7', 'Days before tournament', 'number'),
            ('payment_timeout', '3600', 'Seconds', 'number'),
            ('system_maintenance_mode', 'false', 'Maintenance mode', 'boolean'),
            ('max_sanctions_per_player', '5', 'Maximum sanctions', 'number'),
        ]
        
        for key, value, description, setting_type in settings_data:
            SystemSetting.objects.get_or_create(
                key=key,
                defaults={
                    'value': value,
                    'description': description,
                    'setting_type': setting_type,
                }
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Data seeding completed successfully!'))
