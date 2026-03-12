import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardLayout } from '../modules/dashboard/DashboardLayout';
import ApiClient from '../utils/api';
import { 
  Users, 
  Trophy, 
  Activity, 
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  HeartPulse
} from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export default function Dashboard() {
  const { user, activeRole } = useAuthStore();
  const [stats, setStats] = useState<Stat[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.user_id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError('');

          if (activeRole?.role_name === 'super_admin') {
            // Super Admin dashboard
            const [usersRes, tournamentsRes, logsRes] = await Promise.all([
              ApiClient.getAdminUsers(),
              ApiClient.getTournaments(),
              ApiClient.getAuditLogs(),
            ]);

            let usersCount = 0;
            let activeTournaments = 0;
            let pendingApprovals = 0;

            if (usersRes.status === 'success' && Array.isArray(usersRes.data)) {
              usersCount = usersRes.data.filter((u: any) => u.status === 'active').length;
            }

            if (tournamentsRes.status === 'success' && Array.isArray(tournamentsRes.data)) {
              activeTournaments = tournamentsRes.data.filter((t: any) => t.status === 'ongoing').length;
            }

            if (logsRes.status === 'success' && Array.isArray(logsRes.data)) {
              const logs = logsRes.data;
              setActivities(logs.slice(0, 5).map((l: any) => ({
                id: l.id,
                title: l.action,
                description: l.details || 'System activity',
                timestamp: new Date(l.created_at || Date.now()).toLocaleTimeString(),
                status: 'logged'
              })));
            }

            setStats([
              { label: 'Total Active Users', value: usersCount.toString(), icon: <Users className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
              { label: 'Active Tournaments', value: activeTournaments.toString(), icon: <Trophy className="text-emerald-600" />, trend: 'Live', color: 'bg-emerald-50' },
              { label: 'Pending Approvals', value: pendingApprovals.toString(), icon: <ShieldCheck className="text-amber-600" />, trend: 'Action Required', color: 'bg-amber-50' },
              { label: 'System Health', value: '99.9%', icon: <HeartPulse className="text-indigo-600" />, trend: 'Stable', color: 'bg-indigo-50' },
              { label: 'Compliance', value: '94%', icon: <ShieldCheck className="text-emerald-600" />, trend: 'Good', color: 'bg-emerald-50' },
              { label: 'Revenue (MTD)', value: 'KES 1.2M', icon: <DollarSign className="text-emerald-600" />, trend: '+8%', color: 'bg-emerald-50' },
            ]);
          } else {
            // Regular user dashboard - fetch user-specific data
            const dashResponse = await ApiClient.getUserDashboard();
            let dashStats = dashResponse.data || {};

            if (dashResponse.status === 'success') {
              setStats([
                { 
                  label: 'Clubs', 
                  value: dashStats.clubs_count?.toString() || '0',
                  icon: <Users className="text-blue-600" />, 
                  trend: 'Affiliated', 
                  color: 'bg-blue-50' 
                },
                { 
                  label: 'Active Tournaments', 
                  value: dashStats.tournaments_registered?.toString() || '0',
                  icon: <Trophy className="text-emerald-600" />, 
                  trend: 'Registered', 
                  color: 'bg-emerald-50' 
                },
                { 
                  label: 'Matches Played', 
                  value: dashStats.matches_played?.toString() || '0',
                  icon: <Activity className="text-amber-600" />, 
                  trend: 'Total', 
                  color: 'bg-amber-50' 
                },
                { 
                  label: 'Ranking', 
                  value: dashStats.ranking?.position?.toString() || 'N/A',
                  icon: <TrendingUp className="text-indigo-600" />, 
                  trend: 'Position', 
                  color: 'bg-indigo-50' 
                },
                {
                  label: 'Wins',
                  value: dashStats.ranking?.wins?.toString() || '0',
                  icon: <Trophy className="text-amber-500" />,
                  trend: 'Success',
                  color: 'bg-amber-50'
                },
                {
                  label: 'Losses',
                  value: dashStats.ranking?.losses?.toString() || '0',
                  icon: <AlertCircle className="text-red-600" />,
                  trend: 'Record',
                  color: 'bg-red-50'
                }
              ]);
            }

            // Fetch user matches for activity feed
            const matchesRes = await ApiClient.getUserMatches();
            if (matchesRes.status === 'success' && Array.isArray(matchesRes.data)) {
              setActivities(matchesRes.data.slice(0, 5).map((m: any) => ({
                id: m.id,
                title: `${m.player1?.name || 'Player 1'} vs ${m.player2?.name || 'Player 2'}`,
                description: m.tournament || 'Tournament',
                timestamp: m.scheduled_date ? new Date(m.scheduled_date).toLocaleTimeString() : 'Scheduled',
                status: m.status
              })));
            }
          }
        } catch (err: any) {
          console.error('Failed to fetch dashboard data:', err);
          setError(err.message || 'Failed to load dashboard data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user, activeRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout stats={stats} activities={activities} />;
}

