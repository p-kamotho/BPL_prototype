from django.contrib import admin
from .models import (
    County, User, Role, UserRole, Club, ClubMember, Player, Ranking,
    Referee, Tournament, TournamentCategory, TournamentRegistration, Draw,
    TournamentBracket, Match, MatchReport, Payment, FinancialTransaction,
    Sanction, Appeal, DisciplinaryRecord, AuditLog, Notification, Message,
    Communication, SystemReport, SystemSetting, ActivityFeed
)


@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'get_full_name', 'role', 'is_active', 'is_staff', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role_name', 'scope_type', 'status')
    list_filter = ('scope_type', 'status')
    search_fields = ('role_name',)


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_active', 'assigned_at')
    list_filter = ('role', 'is_active')
    search_fields = ('user__email',)


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'county', 'registration_number', 'status', 'created_at')
    list_filter = ('status', 'county', 'created_at')
    search_fields = ('name', 'registration_number')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ClubMember)
class ClubMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'club', 'role', 'is_active', 'joined_at')
    list_filter = ('role', 'is_active', 'club')
    search_fields = ('user__email', 'club__name')


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'club', 'ranking_points', 'matches_played', 'is_active')
    list_filter = ('is_active', 'club', 'gender')
    search_fields = ('full_name', 'user__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Ranking)
class RankingAdmin(admin.ModelAdmin):
    list_display = ('player', 'rank_position', 'points', 'category')
    list_filter = ('category',)
    search_fields = ('player__full_name',)


@admin.register(Referee)
class RefereeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'certification_level', 'county', 'is_active', 'matches_assigned')
    list_filter = ('certification_level', 'is_active')
    search_fields = ('full_name', 'user__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'start_date', 'status', 'sanction_status', 'total_players')
    list_filter = ('level', 'status', 'sanction_status', 'start_date')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TournamentCategory)
class TournamentCategoryAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'category_name', 'max_participants', 'current_participants')
    list_filter = ('category_name',)
    search_fields = ('tournament__name',)


@admin.register(TournamentRegistration)
class TournamentRegistrationAdmin(admin.ModelAdmin):
    list_display = ('player', 'tournament', 'status', 'payment_status', 'registered_at')
    list_filter = ('status', 'payment_status', 'tournament')
    search_fields = ('player__full_name', 'tournament__name')


@admin.register(Draw)
class DrawAdmin(admin.ModelAdmin):
    list_display = ('draw_name', 'tournament', 'category', 'draw_type')
    list_filter = ('draw_type',)
    search_fields = ('tournament__name', 'draw_name')


@admin.register(TournamentBracket)
class TournamentBracketAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'category', 'bracket_type')
    list_filter = ('bracket_type',)
    search_fields = ('tournament__name',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('get_match_display', 'tournament', 'status', 'scheduled_time')
    list_filter = ('status', 'tournament', 'scheduled_time')
    search_fields = ('player1__full_name', 'player2__full_name', 'tournament__name')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_match_display(self, obj):
        p1 = obj.player1.full_name if obj.player1 else 'TBD'
        p2 = obj.player2.full_name if obj.player2 else 'TBD'
        return f"{p1} vs {p2}"
    get_match_display.short_description = 'Match'


@admin.register(MatchReport)
class MatchReportAdmin(admin.ModelAdmin):
    list_display = ('match', 'duration_minutes', 'created_at')
    search_fields = ('match__tournament__name',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('registration', 'amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('registration__player__full_name', 'transaction_id')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(FinancialTransaction)
class FinancialTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_type', 'amount', 'tournament', 'created_at')
    list_filter = ('transaction_type', 'tournament')
    search_fields = ('description',)
    readonly_fields = ('created_at',)


@admin.register(Sanction)
class SanctionAdmin(admin.ModelAdmin):
    list_display = ('player', 'sanction_type', 'status', 'start_date', 'end_date')
    list_filter = ('sanction_type', 'status')
    search_fields = ('player__full_name',)


@admin.register(Appeal)
class AppealAdmin(admin.ModelAdmin):
    list_display = ('player', 'sanction', 'status', 'submitted_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('player__full_name',)


@admin.register(DisciplinaryRecord)
class DisciplinaryRecordAdmin(admin.ModelAdmin):
    list_display = ('player', 'total_sanctions', 'active_bans', 'appeals_filed')
    search_fields = ('player__full_name',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'target_type', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('user__email', 'details')
    readonly_fields = ('created_at', 'user', 'action', 'details')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'title')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__email', 'recipient__email', 'subject')


@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'communication_type', 'created_by', 'is_archived')
    list_filter = ('communication_type', 'is_archived', 'created_at')
    search_fields = ('title',)


@admin.register(SystemReport)
class SystemReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'report_type', 'generated_by', 'generated_at')
    list_filter = ('report_type', 'generated_at')
    search_fields = ('title',)


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'setting_type', 'updated_at')
    list_filter = ('setting_type',)
    search_fields = ('key',)
    readonly_fields = ('updated_at',)


@admin.register(ActivityFeed)
class ActivityFeedAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'activity_type', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__email', 'title')
