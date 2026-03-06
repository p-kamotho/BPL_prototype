import React, { useState } from 'react';
import { Trophy, Calendar, Users, Zap, DollarSign, Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  status: 'upcoming' | 'registered' | 'completed';
  startDate: string;
  endDate: string;
  format: string;
  teams: number;
  entryFee: number;
  sponsorLogos?: string[];
}

export default function PlayerMyTournaments() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: 'Nairobi Open Championship 2024',
      status: 'registered',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      format: 'Single Elimination',
      teams: 16,
      entryFee: 5000
    },
    {
      id: 2,
      name: 'Kenya National Junior Tournament',
      status: 'upcoming',
      startDate: '2024-07-20',
      endDate: '2024-07-25',
      format: 'Round Robin',
      teams: 12,
      entryFee: 3000
    },
    {
      id: 3,
      name: 'Coast Region Badminton Cup',
      status: 'completed',
      startDate: '2024-05-10',
      endDate: '2024-05-15',
      format: 'Double Elimination',
      teams: 20,
      entryFee: 4000
    }
  ]);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleRegister = (tournamentId: number) => {
    setTournaments(tournaments.map(t =>
      t.id === tournamentId && t.status === 'upcoming'
        ? { ...t, status: 'registered' as const }
        : t
    ));
    setMessage({ type: 'success', text: 'Successfully registered for tournament!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleWithdraw = (tournamentId: number) => {
    if (confirm('Are you sure you want to withdraw from this tournament?')) {
      setTournaments(tournaments.map(t =>
        t.id === tournamentId && t.status === 'registered'
          ? { ...t, status: 'upcoming' as const }
          : t
      ));
      setMessage({ type: 'success', text: 'Withdrawn from tournament!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadSchedule = (tournamentName: string) => {
    const scheduleData = { tournament: tournamentName, generatedAt: new Date().toLocaleString() };
    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tournamentName}_schedule.json`;
    link.click();
    setMessage({ type: 'success', text: 'Schedule downloaded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Tournaments</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'upcoming', 'registered', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium capitalize ${
              filterStatus === status 
                ? 'border-b-2 border-emerald-600 text-emerald-600' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tournament Cards */}
      <div className="grid gap-6">
        {(() => {
          const filteredTournaments = tournaments.filter(t => filterStatus === 'all' || t.status === filterStatus);
          return filteredTournaments.map(tournament => (
            <div key={tournament.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{tournament.name}</h3>
                  <div className="flex gap-3 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{tournament.startDate}</span>
                    <span className="flex items-center gap-1"><Zap className="w-4 h-4" />{tournament.format}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  tournament.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                  tournament.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {tournament.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Teams</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1"><Users className="w-4 h-4" />{tournament.teams}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Entry Fee</p>
                  <p className="font-bold text-slate-900 flex items-center gap-1"><DollarSign className="w-4 h-4" />KES {tournament.entryFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-bold text-slate-900">{tournament.startDate} to {tournament.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bracket Type</p>
                  <p className="font-bold text-slate-900">{tournament.format}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleDownloadSchedule(tournament.name)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                  View Schedule
                </button>
                {tournament.status === 'upcoming' && (
                  <button onClick={() => handleRegister(tournament.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    Register
                  </button>
                )}
                {tournament.status === 'registered' && (
                  <button onClick={() => handleWithdraw(tournament.id)} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
