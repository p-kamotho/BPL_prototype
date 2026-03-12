/**
 * Real API Service - Direct backend connection
 * No mocking, no fallbacks - connects directly to Django backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export class ApiClient {
  private static baseUrl = API_BASE_URL;

  /**
   * Make authenticated API request
   */
  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Include cookies for session auth
      });

      // Handle response
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          status: 'error',
          message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
          data: data,
        };
      }

      return {
        status: 'success',
        data: data?.data || data,
        message: data?.message,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.message || 'Network error',
      };
    }
  }

  // ===== AUTHENTICATION =====

  static async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(email: string, password: string, fullName: string, phone: string, role: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        phone,
        role,
      }),
    });
  }

  static async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // ===== PROFILE =====

  static async getProfile() {
    return this.request('/api/profile', { method: 'GET' });
  }

  static async updateProfile(data: any) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteAccount() {
    return this.request('/api/auth/delete-account', {
      method: 'DELETE',
    });
  }

  // ===== TOURNAMENTS =====

  static async getTournaments(filters?: { status?: string; level?: string }) {
    const params = new URLSearchParams(filters || {});
    return this.request(`/api/tournaments?${params.toString()}`, { method: 'GET' });
  }

  static async getTournamentDetail(id: number) {
    return this.request(`/api/tournaments/${id}`, { method: 'GET' });
  }

  static async createTournament(data: any) {
    return this.request('/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateTournament(id: number, data: any) {
    return this.request(`/api/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ===== PLAYERS =====

  static async getPlayers(filters?: { club_id?: number }) {
    const params = new URLSearchParams(filters ? { club_id: filters.club_id?.toString() || '' } : {});
    return this.request(`/api/players?${params.toString()}`, { method: 'GET' });
  }

  static async getPlayerDetail(id: number) {
    return this.request(`/api/players/${id}`, { method: 'GET' });
  }

  static async getPlayerRankings(filters?: { category?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    return this.request(`/api/rankings?${params.toString()}`, { method: 'GET' });
  }

  // ===== MATCHES =====

  static async getMatches(filters?: { tournament_id?: number; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.tournament_id) params.append('tournament_id', filters.tournament_id.toString());
    if (filters?.status) params.append('status', filters.status);
    return this.request(`/api/matches?${params.toString()}`, { method: 'GET' });
  }

  static async getMatchDetail(id: number) {
    return this.request(`/api/matches/${id}`, { method: 'GET' });
  }

  static async updateMatchScore(matchId: number, scoreData: any) {
    return this.request(`/api/matches/${matchId}/score`, {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  // ===== CLUBS =====

  static async getClubs(filters?: { status?: string }) {
    const params = new URLSearchParams(filters || {});
    return this.request(`/api/clubs?${params.toString()}`, { method: 'GET' });
  }

  static async getClubDetail(id: number) {
    return this.request(`/api/clubs/${id}`, { method: 'GET' });
  }

  static async getUserClubs() {
    return this.request('/api/user/clubs', { method: 'GET' });
  }

  // ===== REGISTRATIONS =====

  static async registerForTournament(tournamentId: number, categoryId: number, partnerId?: number) {
    return this.request('/api/tournaments/register', {
      method: 'POST',
      body: JSON.stringify({
        tournament_id: tournamentId,
        category_id: categoryId,
        partner_player_id: partnerId,
      }),
    });
  }

  static async getTournamentRegistrations(tournamentId?: number) {
    const params = tournamentId ? `?tournament_id=${tournamentId}` : '';
    return this.request(`/api/user/registrations${params}`, { method: 'GET' });
  }

  // ===== PAYMENTS =====

  static async processPayment(registrationId: number, paymentMethod: string, providerRef?: string) {
    return this.request('/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        registration_id: registrationId,
        payment_method: paymentMethod,
        provider_ref: providerRef,
      }),
    });
  }

  static async getPaymentStatus(paymentId: number) {
    return this.request(`/api/payments/${paymentId}`, { method: 'GET' });
  }

  // ===== ADMIN =====

  static async getAdminUsers() {
    return this.request('/api/admin/users', { method: 'GET' });
  }

  static async getAuditLogs(filters?: { action?: string; days?: number }) {
    const params = new URLSearchParams();
    if (filters?.action) params.append('action', filters.action);
    if (filters?.days) params.append('days', filters.days.toString());
    return this.request(`/api/admin/audit-logs?${params.toString()}`, { method: 'GET' });
  }

  static async getDashboardStats() {
    return this.request('/api/admin/dashboard', { method: 'GET' });
  }

  // ===== NOTIFICATIONS =====

  static async getNotifications(unreadOnly?: boolean) {
    const params = unreadOnly ? `?unread=true` : '';
    return this.request(`/api/notifications${params}`, { method: 'GET' });
  }

  // ===== DISCIPLINARY =====

  static async getSanctions(filters?: { status?: string }) {
    const params = new URLSearchParams(filters || {});
    return this.request(`/api/sanctions?${params.toString()}`, { method: 'GET' });
  }

  static async getSanctionDetail(id: number) {
    return this.request(`/api/sanctions/${id}`, { method: 'GET' });
  }

  static async fileAppeal(sanctionId: number, reason: string) {
    return this.request(`/api/sanctions/${sanctionId}/appeal`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ===== SYSTEM =====

  static async getSystemHealth() {
    return this.request('/api/health', { method: 'GET' });
  }

  // ===== USER-SPECIFIC ENDPOINTS =====

  static async getUserMatches() {
    return this.request('/api/user/matches', { method: 'GET' });
  }

  static async getUserTournaments() {
    return this.request('/api/user/tournaments', { method: 'GET' });
  }

  static async getUserDashboard() {
    return this.request('/api/user/dashboard', { method: 'GET' });
  }

  // ===== CALENDAR & EVENTS =====

  static async getTournamentCalendar() {
    return this.request('/api/calendar', { method: 'GET' });
  }

  static async searchTournaments(query: string, level?: string, status?: string) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (level) params.append('level', level);
    if (status) params.append('status', status);
    return this.request(`/api/search/tournaments?${params}`, { method: 'GET' });
  }

  // ===== EXPORT & REPORTING =====

  static async exportPlayerData(format: string = 'json') {
    return this.request(`/api/export/player?format=${format}`, { method: 'GET' });
  }

  static async exportClubReport(clubId?: number) {
    const url = clubId ? `/api/export/club?club_id=${clubId}` : '/api/export/club';
    return this.request(url, { method: 'GET' });
  }

  static async exportTournamentReport(tournamentId: number) {
    return this.request(`/api/export/tournament?tournament_id=${tournamentId}`, { method: 'GET' });
  }
}

export default ApiClient;
