import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardLayout } from '../modules/dashboard/DashboardLayout';
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

export default function Dashboard() {
  const { user, activeRole } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user_id) {
      const fetchData = async () => {
        try {
          if (activeRole?.role_name === 'super_admin') {
            // Super Admin specific data fetching
            const responses = await Promise.all([
              fetch('/api/admin/users'),
              fetch('/api/tournaments'),
              fetch('/api/admin/audit-logs'),
            ]);

            const [usersRes, tournamentsRes, logsRes] = responses;
            const users = await usersRes.json();
            const tournaments = await tournamentsRes.json();
            const logs = await logsRes.json();

            const pendingApprovals = users.reduce((acc: number, u: any) => 
              acc + u.roles.filter((r: any) => r.status === 'pending').length, 0
            );

            setStats([
              { label: 'Total Active Users', value: users.filter((u: any) => u.status === 'active').length.toString(), icon: <Users className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
              { label: 'Active Tournaments', value: tournaments.filter((t: any) => t.status === 'ongoing').length.toString(), icon: <Trophy className="text-emerald-600" />, trend: 'Live', color: 'bg-emerald-50' },
              { label: 'Pending Approvals', value: pendingApprovals.toString(), icon: <ShieldCheck className="text-amber-600" />, trend: 'Action Required', color: 'bg-amber-50' },
              { label: 'System Health', value: '99.9%', icon: <HeartPulse className="text-indigo-600" />, trend: 'Stable', color: 'bg-indigo-50' },
              { label: 'Compliance', value: '94%', icon: <ShieldCheck className="text-emerald-600" />, trend: 'Good', color: 'bg-emerald-50' },
              { label: 'Revenue (MTD)', value: 'KES 1.2M', icon: <DollarSign className="text-emerald-600" />, trend: '+8%', color: 'bg-emerald-50' },
            ]);

            setActivities(logs.slice(0, 5).map((l: any) => ({
              id: l.id,
              title: l.action,
              description: `${l.full_name}: ${l.details}`,
              timestamp: new Date(l.created_at).toLocaleTimeString(),
              status: 'logged'
            })));
          } else {
            // Regular user data fetching
            const responses = await Promise.all([
              fetch(`/api/players?user_id=${user.user_id}`),
              fetch(`/api/tournaments`),
              fetch(`/api/matches?user_id=${user.user_id}`),
              fetch(`/api/clubs?user_id=${user.user_id}`)
            ]);

            const [playersRes, tournamentsRes, matchesRes, clubsRes] = responses;

          const checkResponse = async (res: Response, name: string) => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`Failed to fetch ${name}: ${res.status} ${res.statusText} - ${text.substring(0, 100)}`);
            }
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await res.text();
              throw new Error(`Invalid content type for ${name}: ${contentType} - ${text.substring(0, 100)}`);
            }
            return res.json();
          };

          const players = await checkResponse(playersRes, 'players');
          const tournaments = await checkResponse(tournamentsRes, 'tournaments');
          const matches = await checkResponse(matchesRes, 'matches');
          const clubs = await checkResponse(clubsRes, 'clubs');

          setStats([
            { label: 'Total Players', value: Array.isArray(players) ? players.length.toString() : '0', icon: <Users className="text-blue-600" />, trend: 'Registered', color: 'bg-blue-50' },
            { label: 'Active Tournaments', value: Array.isArray(tournaments) ? tournaments.length.toString() : '0', icon: <Trophy className="text-emerald-600" />, trend: 'Upcoming', color: 'bg-emerald-50' },
            { label: 'Matches', value: Array.isArray(matches) ? matches.length.toString() : '0', icon: <Activity className="text-amber-600" />, trend: 'Total', color: 'bg-amber-50' },
            { label: 'Clubs', value: Array.isArray(clubs) ? clubs.length.toString() : '0', icon: <TrendingUp className="text-indigo-600" />, trend: 'Affiliated', color: 'bg-indigo-50' },
          ]);
          
            if (Array.isArray(matches)) {
              setActivities(matches.slice(0, 5).map((m: any) => ({
                id: m.id,
                title: `${m.player1_name} vs ${m.player2_name}`,
                description: m.tournament_name || 'Unknown Tournament',
                timestamp: 'Just now', // Ideally fetch real timestamp
                status: m.status
              })));
            }
          }
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  return <DashboardLayout stats={stats} activities={activities} />;
}
