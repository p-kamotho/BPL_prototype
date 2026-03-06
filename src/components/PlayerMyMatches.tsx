import React, { useState } from 'react';
import { Activity, Clock, MapPin, Users, Trophy, CheckCircle, XCircle, AlertTriangle, Trash2, Download } from 'lucide-react';

export default function PlayerMyMatches() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [matches, setMatches] = useState([
    {
      id: 1,
      opponent: 'Mombasa Badminton Club',
      date: '2024-02-25',
      time: '10:00 AM',
      venue: 'Nairobi Sports Club - Court 1',
      status: 'upcoming',
      category: "Men's Singles",
      lineup: ['John Doe', 'Jane Smith'],
      attendance: 'Confirmed',
      score: null,
      fouls: 0
    },
    {
      id: 2,
      opponent: 'Kisumu District Club',
      date: '2024-02-20',
      time: '02:30 PM',
      venue: 'Nairobi Sports Club - Court 2',
      status: 'in-progress',
      category: "Women's Doubles",
      lineup: ['Jane Smith', 'Sarah Wilson'],
      attendance: 'Present',
      score: '15-18',
      fouls: 2
    },
    {
      id: 3,
      opponent: 'Nairobi Junior Club',
      date: '2024-02-18',
      time: '03:00 PM',
      venue: 'Nairobi Sports Club - Court 3',
      status: 'completed',
      category: "Mixed Doubles",
      lineup: ['John Doe', 'Jane Smith'],
      attendance: 'Present',
      score: '21-15',
      fouls: 1
    }
  ]);

  const handleConfirmAttendance = (id: number) => {
    setMatches(matches.map(m => m.id === id ? {...m, attendance: 'Confirmed'} : m));
    setMessage({type: 'success', text: 'Attendance confirmed!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRequestSubstitution = (id: number) => {
    setMessage({type: 'success', text: 'Substitution request submitted for review!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateScore = (id: number) => {
    const score = prompt('Enter current score:');
    if (score) {
      setMatches(matches.map(m => m.id === id ? {...m, score} : m));
      setMessage({type: 'success', text: 'Score updated!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleWithdrawMatch = (id: number) => {
    if (confirm('Withdraw from this match?')) {
      setMatches(matches.filter(m => m.id !== id));
      setMessage({type: 'success', text: 'Match withdrawn!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadSchedule = () => {
    const dataStr = JSON.stringify(matches, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-matches.json';
    link.click();
    setMessage({type: 'success', text: 'Schedule downloaded!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredMatches = matches.filter(m => filterStatus === 'all' || m.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Matches</h1>
        <button onClick={handleDownloadSchedule} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Download size={18} /> Download Schedule
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['all', 'upcoming', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
              filterStatus === status 
                ? 'border-b-2 border-emerald-600 text-emerald-600' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="grid gap-4">
        {filteredMatches.map(match => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{match.opponent}</h3>
                <p className="text-sm text-slate-500">{match.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(match.status)}`}>
                {match.status.replace('-', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span>{match.date} at {match.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{match.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span>Players: {match.lineup.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                {match.attendance === 'Confirmed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={match.attendance === 'Confirmed' ? 'text-green-600' : 'text-red-600'}>
                  {match.attendance}
                </span>
              </div>
            </div>

            {/* Score & Live Updates */}
            {(match.status === 'in-progress' || match.status === 'completed') && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Score</p>
                    <p className="text-2xl font-bold text-slate-900">{match.score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Fouls/Cards</p>
                    <p className="text-2xl font-bold text-slate-900">{match.fouls}</p>
                  </div>
                </div>
              </div>
            )}

            {match.status === 'upcoming' && (
              <div className="flex gap-2">
                <button onClick={() => handleConfirmAttendance(match.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                  Confirm Attendance
                </button>
                <button onClick={() => handleRequestSubstitution(match.id)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  Request Substitution
                </button>
                <button onClick={() => handleWithdrawMatch(match.id)} className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm flex items-center gap-1">
                  <Trash2 size={16} /> Withdraw
                </button>
              </div>
            )}

            {match.status === 'in-progress' && (
              <div className="flex gap-2">
                <button onClick={() => handleUpdateScore(match.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Update Score
                </button>
                <button onClick={() => handleWithdrawMatch(match.id)} className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm">
                  Forfeit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
