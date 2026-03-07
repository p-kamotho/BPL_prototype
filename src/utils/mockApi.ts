/**
 * Mock API Service
 * Provides simulated responses for all API endpoints
 * Used as fallback when real backend is unavailable
 */

export async function mockApiCall(
  endpoint: string, 
  options?: RequestInit
): Promise<Response> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = options?.method || 'GET';
  const body = options?.body ? JSON.parse(options.body as string) : null;

  // Mock responses for different endpoints
  if (method === 'GET') {
    if (endpoint.includes('/api/tournaments')) {
      const mockTournaments = [
        {
          id: 1,
          name: 'Kenya National Championship 2025',
          level: 'national',
          start_date: '2025-06-01',
          end_date: '2025-06-15',
          admin_id: 1,
          status: 'upcoming',
          sanction_status: 'approved'
        },
        {
          id: 2,
          name: 'Nairobi Regional Open',
          level: 'regional',
          start_date: '2025-05-10',
          end_date: '2025-05-12',
          admin_id: 1,
          status: 'upcoming',
          sanction_status: 'approved'
        }
      ];
      return new Response(JSON.stringify(mockTournaments), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/players')) {
      const mockPlayers = [
        {
          id: 1,
          user_id: 2,
          full_name: 'John Omondi',
          email: 'john@badminton.ke',
          club_name: 'Riverside Badminton Club',
          ranking_points: 1250
        },
        {
          id: 2,
          user_id: 3,
          full_name: 'Sarah Kipchoge',
          email: 'sarah@badminton.ke',
          club_name: 'Elite Sports Club',
          ranking_points: 980
        }
      ];
      return new Response(JSON.stringify(mockPlayers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/profile')) {
      const mockProfile = {
        user: {
          user_id: 1,
          full_name: 'Super Admin',
          email: 'admin@badminton.ke',
          phone: '+254712345678',
          profile_data: {}
        }
      };
      return new Response(JSON.stringify(mockProfile), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/matches')) {
      const mockMatches = [
        {
          id: 1,
          tournament_id: 1,
          tournament_name: 'Kenya National Championship 2025',
          player1_id: 1,
          player1_name: 'John Omondi',
          player2_id: 2,
          player2_name: 'Sarah Kipchoge',
          referee_id: null,
          referee_name: null,
          status: 'pending',
          score1: 0,
          score2: 0
        }
      ];
      return new Response(JSON.stringify(mockMatches), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/clubs')) {
      const mockClubs = [
        {
          id: 1,
          name: 'Riverside Badminton Club',
          county_id: 1,
          registration_number: 'RBC-2024-001',
          status: 'approved',
          created_by: 1
        },
        {
          id: 2,
          name: 'Elite Sports Club',
          county_id: 1,
          registration_number: 'ESC-2024-002',
          status: 'approved',
          created_by: 1
        }
      ];
      return new Response(JSON.stringify(mockClubs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/admin/users')) {
      const mockUsers = [
        {
          id: 1,
          user_id: 1,
          full_name: 'Super Admin',
          email: 'admin@badminton.ke',
          status: 'active',
          roles: [
            {
              id: 1,
              role_name: 'super_admin',
              status: 'approved',
              scope_type: 'national'
            }
          ]
        }
      ];
      return new Response(JSON.stringify(mockUsers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/admin/audit-logs')) {
      const mockLogs = [
        {
          id: 1,
          user_id: 1,
          full_name: 'Super Admin',
          action: 'USER_REGISTERED',
          details: 'New user registered',
          created_at: new Date().toISOString()
        }
      ];
      return new Response(JSON.stringify(mockLogs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/payments/')) {
      const mockPayment = {
        id: 1,
        registration_id: 1,
        amount: 5000,
        status: 'pending',
        provider_ref: null,
        created_at: new Date().toISOString()
      };
      return new Response(JSON.stringify(mockPayment), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/tournaments/') && endpoint.includes('/bracket')) {
      const mockBracket = {
        bracket: {
          id: 1,
          tournament_id: 1,
          type: 'single_elim',
          created_at: new Date().toISOString()
        },
        matches: []
      };
      return new Response(JSON.stringify(mockBracket), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // POST requests
  if (method === 'POST') {
    if (endpoint.includes('/api/tournaments') && endpoint.includes('register')) {
      const mockRegistration = {
        registration_id: Math.floor(Math.random() * 1000),
        payment_id: Math.floor(Math.random() * 1000),
        message: 'Registration created, payment pending'
      };
      return new Response(JSON.stringify(mockRegistration), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/payments') && endpoint.includes('simulate-success')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/tournaments') && endpoint.includes('generate-bracket')) {
      return new Response(JSON.stringify({ bracket_id: 1 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (endpoint.includes('/api/bracket-matches') && endpoint.includes('complete')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default success response for other POST requests
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // PUT requests
  if (method === 'PUT') {
    if (endpoint.includes('/api/profile')) {
      return new Response(JSON.stringify({ success: true, profile_data: body?.profile_data || {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fallback error response
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Safe fetch wrapper that automatically falls back to mock API
 * when the real backend is unavailable
 */
export async function safeFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(endpoint, options);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      // Backend returned HTML (not running), use mock
      console.log(`Backend unavailable for ${endpoint}, using mock data`);
      return mockApiCall(endpoint, options);
    }
    
    return response;
  } catch (error) {
    // Network error, use mock
    console.log(`Network error for ${endpoint}, using mock data:`, error);
    return mockApiCall(endpoint, options);
  }
}
