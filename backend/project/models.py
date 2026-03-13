from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.utils import timezone
from datetime import timedelta
import json

# ====== USER & AUTHENTICATION MODELS ======

class County(models.Model):
    """County/Region model for Kenya"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    
    class Meta:
        verbose_name_plural = "Counties"
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    """Extended user model with role and profile fields"""
    ROLE_CHOICES = (
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('player', 'Player'),
        ('referee', 'Referee'),
        ('club_manager', 'Club Manager'),
        ('county_admin', 'County Admin'),
        ('system_user', 'System User'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='system_user')
    phone = models.CharField(max_length=20, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class Role(models.Model):
    """Define different roles in the system"""
    SCOPE_CHOICES = (
        ('national', 'National'),
        ('county', 'County'),
        ('club', 'Club'),
    )
    
    role_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    scope_type = models.CharField(max_length=20, choices=SCOPE_CHOICES, default='national')
    permissions = models.JSONField(default=list, help_text="List of permission names")
    status = models.CharField(max_length=20, default='approved')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.role_name


class UserRole(models.Model):
    """Map users to roles"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'role')
    
    def __str__(self):
        return f"{self.user.email} - {self.role.role_name}"


# ====== CLUB MANAGEMENT MODELS ======

class Club(models.Model):
    """Club/Organization model"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('suspended', 'Suspended'),
        ('rejected', 'Rejected'),
    )
    
    name = models.CharField(max_length=255, unique=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True)
    registration_number = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='clubs_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class ClubMember(models.Model):
    """Club membership model"""
    MEMBER_ROLE_CHOICES = (
        ('manager', 'Manager'),
        ('coach', 'Coach'),
        ('player', 'Player'),
        ('staff', 'Staff'),
    )
    
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_memberships')
    role = models.CharField(max_length=20, choices=MEMBER_ROLE_CHOICES)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('club', 'user')
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.club.name} ({self.role})"


# ====== PLAYER & RANKING MODELS ======

class Player(models.Model):
    """Player profile model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player_profile')
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')], blank=True)
    id_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    ranking_points = models.IntegerField(default=0)
    career_points = models.IntegerField(default=0)
    matches_played = models.IntegerField(default=0)
    matches_won = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.full_name
    
    @property
    def win_ratio(self):
        if self.matches_played == 0:
            return 0
        return round((self.matches_won / self.matches_played) * 100, 2)


class Ranking(models.Model):
    """Player ranking snapshot by period"""
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='rankings')
    rank_position = models.IntegerField()
    points = models.IntegerField()
    category = models.CharField(max_length=50, blank=True)  # Singles/Doubles/Mixed
    period_start = models.DateField()
    period_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['rank_position']
    
    def __str__(self):
        return f"{self.player.full_name} - Rank #{self.rank_position}"


# ====== REFEREE MODELS ======

class Referee(models.Model):
    """Referee profile model"""
    CERTIFICATION_CHOICES = (
        ('international', 'International'),
        ('national', 'National'),
        ('county', 'County'),
        ('provisional', 'Provisional'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referee_profile')
    full_name = models.CharField(max_length=255)
    certification_level = models.CharField(max_length=20, choices=CERTIFICATION_CHOICES, default='provisional')
    certification_date = models.DateField(null=True, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    matches_assigned = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.full_name} ({self.certification_level})"


# ====== TOURNAMENT MODELS ======

class Tournament(models.Model):
    """Tournament model"""
    LEVEL_CHOICES = (
        ('grassroots', 'Grassroots'),
        ('county', 'County'),
        ('regional', 'Regional'),
        ('national', 'National'),
        ('international', 'International'),
    )
    
    STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('registration_open', 'Registration Open'),
        ('registration_closed', 'Registration Closed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    SANCTION_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    venue = models.CharField(max_length=255, blank=True)
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tournaments_admin')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='planning')
    sanction_status = models.CharField(max_length=20, choices=SANCTION_CHOICES, default='pending')
    total_players = models.IntegerField(default=0)
    total_matches = models.IntegerField(default=0)
    prize_pool = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class TournamentCategory(models.Model):
    """Tournament category/event model"""
    CATEGORY_CHOICES = (
        ('singles_mens', "Men's Singles"),
        ('singles_womens', "Women's Singles"),
        ('doubles_mens', "Men's Doubles"),
        ('doubles_womens', "Women's Doubles"),
        ('mixed_doubles', 'Mixed Doubles'),
        ('youth_u13', 'Youth U-13'),
        ('youth_u17', 'Youth U-17'),
        ('junior', 'Junior'),
        ('senior', 'Senior'),
    )
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='categories')
    category_name = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    max_participants = models.IntegerField(default=64)
    current_participants = models.IntegerField(default=0)
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('tournament', 'category_name')
        verbose_name_plural = "Tournament Categories"
    
    def __str__(self):
        return f"{self.tournament.name} - {self.get_category_name_display()}"


class TournamentRegistration(models.Model):
    """Player registration for tournament"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='registrations')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='tournament_registrations')
    category = models.ForeignKey(TournamentCategory, on_delete=models.SET_NULL, null=True)
    partner_player = models.ForeignKey(
        Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='partner_registrations'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, default='unpaid')
    registered_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('tournament', 'player', 'category')
    
    def __str__(self):
        return f"{self.player.full_name} - {self.tournament.name}"


class Draw(models.Model):
    """Tournament draw/seeding"""
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='draws')
    category = models.ForeignKey(TournamentCategory, on_delete=models.CASCADE)
    draw_name = models.CharField(max_length=255)
    draw_type = models.CharField(
        max_length=20, 
        choices=[('seeded', 'Seeded'), ('unseeded', 'Unseeded')],
        default='seeded'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.draw_name} - {self.category}"


class TournamentBracket(models.Model):
    """Tournament bracket/fixture"""
    BRACKET_TYPES = (
        ('single_elim', 'Single Elimination'),
        ('double_elim', 'Double Elimination'),
        ('round_robin', 'Round Robin'),
    )
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='brackets')
    category = models.ForeignKey(TournamentCategory, on_delete=models.CASCADE)
    bracket_type = models.CharField(max_length=20, choices=BRACKET_TYPES, default='single_elim')
    bracket_data = models.JSONField(default=dict)  # Store bracket structure
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.tournament.name} - {self.category} Bracket"


# ====== MATCH MODELS ======

class Match(models.Model):
    """Match/Game model"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('postponed', 'Postponed'),
    )
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    category = models.ForeignKey(TournamentCategory, on_delete=models.CASCADE, null=True, blank=True)
    bracket = models.ForeignKey(TournamentBracket, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Players
    player1 = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='matches_as_player1')
    player2 = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='matches_as_player2')
    partner1 = models.ForeignKey(
        Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_partner1'
    )
    partner2 = models.ForeignKey(
        Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_as_partner2'
    )
    
    # Referee
    referee = models.ForeignKey(Referee, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Scores
    score_player1_set1 = models.IntegerField(default=0)
    score_player2_set1 = models.IntegerField(default=0)
    score_player1_set2 = models.IntegerField(default=0)
    score_player2_set2 = models.IntegerField(default=0)
    score_player1_set3 = models.IntegerField(default=0, null=True, blank=True)
    score_player2_set3 = models.IntegerField(default=0, null=True, blank=True)
    
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    
    # Match details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_time = models.DateTimeField(null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    court_number = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        p1 = self.player1.full_name if self.player1 else "TBD"
        p2 = self.player2.full_name if self.player2 else "TBD"
        return f"{p1} vs {p2} - {self.tournament.name}"


class MatchReport(models.Model):
    """Match report and statistics"""
    match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name='report')
    rally_count = models.IntegerField(default=0)
    duration_minutes = models.IntegerField(default=0)
    player1_faults = models.IntegerField(default=0)
    player2_faults = models.IntegerField(default=0)
    player1_challenges = models.IntegerField(default=0)
    player2_challenges = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Report - {self.match}"


# ====== PAYMENT MODELS ======

class Payment(models.Model):
    """Payment model"""
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHOD = (
        ('mpesa', 'M-Pesa'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
    )
    
    registration = models.ForeignKey(
        TournamentRegistration, on_delete=models.CASCADE, related_name='payments'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD, default='mpesa')
    provider_ref = models.CharField(max_length=100, blank=True)
    transaction_id = models.CharField(max_length=100, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment - {self.registration.player.full_name} - {self.amount}"


class FinancialTransaction(models.Model):
    """General financial transactions"""
    TRANSACTION_TYPE = (
        ('tournament_revenue', 'Tournament Revenue'),
        ('player_refund', 'Player Refund'),
        ('prize_payout', 'Prize Payout'),
        ('system_fee', 'System Fee'),
        ('other', 'Other'),
    )
    
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True)
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.amount}"


# ====== COMPLIANCE MODELS ======

class Sanction(models.Model):
    """Sanctions/Disciplinary actions"""
    SANCTION_TYPE = (
        ('warning', 'Warning'),
        ('suspension', 'Suspension'),
        ('ban', 'Ban'),
        ('fine', 'Fine'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('appealed', 'Appealed'),
        ('overturned', 'Overturned'),
    )
    
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sanctions')
    sanction_type = models.CharField(max_length=20, choices=SANCTION_TYPE)
    reason = models.TextField()
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sanctions_issued')
    issued_date = models.DateField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    match = models.ForeignKey(Match, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.player.full_name} - {self.get_sanction_type_display()}"


class Appeal(models.Model):
    """Appeals against sanctions"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )
    
    sanction = models.OneToOneField(Sanction, on_delete=models.CASCADE, related_name='appeal')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='appeals')
    reason = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    decided_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    decision_date = models.DateTimeField(null=True, blank=True)
    decision_reason = models.TextField(blank=True)
    
    def __str__(self):
        return f"Appeal - {self.player.full_name} ({self.status})"


class DisciplinaryRecord(models.Model):
    """Overall disciplinary history"""
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='disciplinary_record')
    total_sanctions = models.IntegerField(default=0)
    total_warnings = models.IntegerField(default=0)
    total_suspensions = models.IntegerField(default=0)
    active_bans = models.IntegerField(default=0)
    appeals_filed = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Disciplinary Record - {self.player.full_name}"


# ====== AUDIT & LOGGING MODELS ======

class AuditLog(models.Model):
    """Audit trail for all system actions"""
    ACTION_CHOICES = (
        ('USER_REGISTERED', 'User Registered'),
        ('USER_UPDATED', 'User Updated'),
        ('USER_DELETED', 'User Deleted'),
        ('TOURNAMENT_CREATED', 'Tournament Created'),
        ('TOURNAMENT_UPDATED', 'Tournament Updated'),
        ('MATCH_CREATED', 'Match Created'),
        ('MATCH_UPDATED', 'Match Updated'),
        ('PLAYER_REGISTERED', 'Player Registered'),
        ('SANCTION_ISSUED', 'Sanction Issued'),
        ('PAYMENT_PROCESSED', 'Payment Processed'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('DATA_EXPORT', 'Data Export'),
        ('REPORT_GENERATED', 'Report Generated'),
        ('SETTINGS_CHANGED', 'Settings Changed'),
        ('OTHER', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    target_type = models.CharField(max_length=50, blank=True)  # e.g., 'Tournament', 'Player'
    target_id = models.IntegerField(null=True, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.created_at}"


# ====== NOTIFICATION & COMMUNICATION MODELS ======

class Notification(models.Model):
    """System notifications"""
    NOTIFICATION_TYPE = (
        ('match_scheduled', 'Match Scheduled'),
        ('match_result', 'Match Result'),
        ('tournament_update', 'Tournament Update'),
        ('payment_reminder', 'Payment Reminder'),
        ('sanction_issued', 'Sanction Issued'),
        ('message', 'Message'),
        ('system_alert', 'System Alert'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"


class Message(models.Model):
    """Direct messages between users"""
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_sent')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_received')
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender.email} -> {self.recipient.email}"


class Communication(models.Model):
    """General communication hub"""
    COMMUNICATION_TYPE = (
        ('announcement', 'Announcement'),
        ('broadcast', 'Broadcast'),
        ('urgent', 'Urgent'),
        ('info', 'Information'),
    )
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    recipients = models.ManyToManyField(User, related_name='communications_received', blank=True)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class SystemReport(models.Model):
    """System reports"""
    REPORT_TYPE = (
        ('tournament_summary', 'Tournament Summary'),
        ('player_ranking', 'Player Ranking'),
        ('financial_summary', 'Financial Summary'),
        ('disciplinary_summary', 'Disciplinary Summary'),
        ('activity_report', 'Activity Report'),
        ('match_statistics', 'Match Statistics'),
    )
    
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE)
    description = models.TextField(blank=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    report_data = models.JSONField(default=dict)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-generated_at']
    
    def __str__(self):
        return self.title


# ====== SETTINGS MODELS ======

class SystemSetting(models.Model):
    """System configuration settings"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    setting_type = models.CharField(
        max_length=20, 
        choices=[('string', 'String'), ('number', 'Number'), ('boolean', 'Boolean'), ('json', 'JSON')],
        default='string'
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "System Settings"
    
    def __str__(self):
        return self.key


class ActivityFeed(models.Model):
    """Activity feed for dashboard"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_feed')
    activity_type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    related_object = models.CharField(max_length=100, blank=True)
    related_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Activity Feeds"
    
    def __str__(self):
        return f"{self.title} - {self.created_at}"
