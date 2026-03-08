import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardLayout } from '../modules/dashboard/DashboardLayout';
import { safeFetch } from '../utils/mockApi';
import { 
  Award, 
  Trophy, 
  Check,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function RefereePortal() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [assignedMatches, setAssignedMatches] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user_id) {
      const fetchData = async () => {
        try {
          const responses = await Promise.all([
            safeFetch(`/api/matches?user_id=${user.user_id}`),
            safeFetch(`/api/tournaments`)
          ]);

          const [matchesRes, tournamentsRes] = responses;
          const matches = await matchesRes.json();
          const tournaments = await tournamentsRes.json();

          setStats([
            { 
              label: 'Assigned Matches', 
              value: Array.isArray(matches) ? matches.length.toString() : '0',
              icon: <Trophy className="text-emerald-600" />, 
              trend: 'Pending', 
              color: 'bg-emerald-50' 
            },
            { 
              label: 'Matches Completed', 
              value: Array.isArray(matches) ? matches.filter((m: any) => m.status === 'completed').length.toString() : '0',
              icon: <Check className="text-blue-600" />, 
              trend: 'Done', 
              color: 'bg-blue-50' 
            },
            { 
              label: 'Certification Level', 
              value: 'Senior',
              icon: <Award className="text-amber-600" />, 
              trend: 'Active', 
              color: 'bg-amber-50' 
            },
            { 
              label: 'Performance Rating', 
              value: '4.8/5',
              icon: <TrendingUp className="text-indigo-600" />, 
              trend: 'Excellent', 
              color: 'bg-indigo-50' 
            },
          ]);

          if (Array.isArray(matches)) {
            setAssignedMatches(matches.slice(0, 5));
            setActivities(matches.slice(0, 5).map((m: any) => ({
              id: m.id,
              title: `${m.player1_name} vs ${m.player2_name}`,
              description: m.tournament_name || 'Tournament Match',
              timestamp: 'Ready to score',
              status: m.status
            })));
          }
        } catch (error) {
          console.error('Failed to fetch referee data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Referee Portal</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your assignments and match scoring</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.color} dark:${stat.color.replace('bg-', 'dark:bg-')} rounded-2xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">{stat.trend}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Matches */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Assigned Matches</h2>
          
          <div className="space-y-4">
            {assignedMatches.length > 0 ? (
              assignedMatches.map((match: any) => (
                <div key={match.id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {match.player1_name} vs {match.player2_name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{match.tournament_name}</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold">
                    Score Match
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-center py-8">No assigned matches</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
