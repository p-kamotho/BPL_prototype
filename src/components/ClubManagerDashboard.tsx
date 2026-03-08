import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardLayout } from '../modules/dashboard/DashboardLayout';
import { safeFetch } from '../utils/mockApi';
import { 
  Users, 
  Trophy, 
  Activity, 
  TrendingUp,
  AlertCircle,
  DollarSign,
  BarChart3
} from 'lucide-react';

export default function ClubManagerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user_id) {
      const fetchData = async () => {
        try {
          const responses = await Promise.all([
            safeFetch(`/api/clubs?user_id=${user.user_id}`),
            safeFetch(`/api/players?user_id=${user.user_id}`),
            safeFetch(`/api/matches?user_id=${user.user_id}`),
            safeFetch(`/api/tournaments`)
          ]);

          const [clubsRes, playersRes, matchesRes, tournamentsRes] = responses;
          const clubs = await clubsRes.json();
          const players = await playersRes.json();
          const matches = await matchesRes.json();
          const tournaments = await tournamentsRes.json();

          setStats([
            { 
              label: 'Club Members', 
              value: Array.isArray(players) ? players.length.toString() : '0',
              icon: <Users className="text-blue-600" />, 
              trend: 'Active', 
              color: 'bg-blue-50' 
            },
            { 
              label: 'Upcoming Tournaments', 
              value: Array.isArray(tournaments) ? tournaments.filter((t: any) => t.status === 'upcoming').length.toString() : '0',
              icon: <Trophy className="text-emerald-600" />, 
              trend: 'Registered', 
              color: 'bg-emerald-50' 
            },
            { 
              label: 'Club Matches', 
              value: Array.isArray(matches) ? matches.length.toString() : '0',
              icon: <Activity className="text-amber-600" />, 
              trend: 'Total', 
              color: 'bg-amber-50' 
            },
            { 
              label: 'Financial Overview', 
              value: 'KES 450K',
              icon: <DollarSign className="text-indigo-600" />, 
              trend: '+12%', 
              color: 'bg-indigo-50' 
            },
          ]);

          if (Array.isArray(matches)) {
            setActivities(matches.slice(0, 5).map((m: any) => ({
              id: m.id,
              title: `${m.player1_name} vs ${m.player2_name}`,
              description: m.tournament_name || 'Club Match',
              timestamp: 'Soon',
              status: m.status
            })));
          }
        } catch (error) {
          console.error('Failed to fetch club dashboard data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  return <DashboardLayout stats={stats} activities={activities} />;
}
