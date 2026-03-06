import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle, Plus, Edit2, Trash2, Save } from 'lucide-react';

export default function ClubMatches() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [matches, setMatches] = useState([
    {
      id: 1,
      opponent: 'Coastal Region Club',
      date: '2024-03-10',
      time: '10:00 AM',
      venue: 'Nairobi Sports Complex - Court A',
      category: "Men's Singles",
      status: 'scheduled' as const,
      teamSize: 4,
      confirmedPlayers: 3,
      resources: { courts: 2, balls: 10, coaching: true },
      notes: 'Friendly match'
    },
    {
      id: 2,
      opponent: 'Kisumu Regional',
      date: '2024-03-05',
      time: '02:30 PM',
      venue: 'Central Stadium - Indoor Hall',
      category: "Women's Doubles",
      status: 'in-progress' as const,
      teamSize: 6,
      confirmedPlayers: 6,
      resources: { courts: 3, balls: 15, coaching: true },
      notes: 'League match - Tournament qualifier'
    },
    {
      id: 3,
      opponent: 'Nakuru Sports Club',
      date: '2024-02-28',
      time: '11:00 AM',
      venue: 'Nakuru Stadium - Court C',
      category: "Mixed Doubles",
      status: 'completed' as const,
      teamSize: 8,
      confirmedPlayers: 8,
      resources: { courts: 4, balls: 20, coaching: true },
      notes: 'Championship qualifier'
    }
  ]);

  const [newMatch, setNewMatch] = useState({ opponent: '', date: '', time: '', venue: '', category: "Men's Singles", status: 'scheduled' });

  const handleAddMatch = () => {
    if (!newMatch.opponent || !newMatch.date || !newMatch.time) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    const newId = Math.max(...matches.map(m => m.id), 0) + 1;
    setMatches([...matches, { 
      ...newMatch, 
      id: newId, 
      teamSize: 4, 
      confirmedPlayers: 0,
      resources: { courts: 2, balls: 10, coaching: false },
      notes: ''
    } as any]);
    setNewMatch({ opponent: '', date: '', time: '', venue: '', category: "Men's Singles", status: 'scheduled' });
    setShowAddForm(false);
    setMessage({ type: 'success', text: 'Match scheduled successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteMatch = (id: number) => {
    if (confirm('Are you sure you want to delete this match?')) {
      setMatches(matches.filter(m => m.id !== id));
      setMessage({ type: 'success', text: 'Match deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setMessage({ type: 'success', text: 'Match status updated!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleConfirmPlayer = (id: number) => {
    setMatches(matches.map(m => 
      m.id === id ? { ...m, confirmedPlayers: Math.min(m.confirmedPlayers + 1, m.teamSize) } : m
    ));
    setMessage({ type: 'success', text: 'Player confirmed!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDownload = () => {
    const data = JSON.stringify(matches, null, 2);
    const element = document.createElement('a');
    const file = new Blob([data], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `matches_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setMessage({ type: 'success', text: 'Export successful!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const filteredMatches = matches.filter(m => filterStatus === 'all' || m.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getProgressPercentage = (confirmed, total) => {
    return Math.round((confirmed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Match Management</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Match
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</span>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold text-lg">Schedule New Match</h2>
          <input type="text" placeholder="Opponent" value={newMatch.opponent} onChange={(e) => setNewMatch({...newMatch, opponent: e.target.value})} className="w-full px-3 py-2 border rounded" />
          <input type="date" value={newMatch.date} onChange={(e) => setNewMatch({...newMatch, date: e.target.value})} className="w-full px-3 py-2 border rounded" />
          <input type="time" value={newMatch.time} onChange={(e) => setNewMatch({...newMatch, time: e.target.value})} className="w-full px-3 py-2 border rounded" />
          <input type="text" placeholder="Venue" value={newMatch.venue} onChange={(e) => setNewMatch({...newMatch, venue: e.target.value})} className="w-full px-3 py-2 border rounded" />
          <div className="flex gap-2">
            <button onClick={handleAddMatch} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded">Add Match</button>
            <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
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

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Total Matches</p>
          <p className="text-2xl font-bold text-slate-900">{matches.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{matches.filter(m => m.status === 'scheduled').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-emerald-600">{matches.filter(m => m.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-slate-600">{matches.filter(m => m.status === 'completed').length}</p>
        </div>
      </div>

      {/* Match Cards */}
      <div className="grid gap-4">
        {filteredMatches.map(match => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{match.opponent}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(match.status)}`}>
                    {match.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{match.category}</p>
              </div>
              <button onClick={() => handleDeleteMatch(match.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>{match.date} at {match.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{match.venue}</span>
              </div>
            </div>

            {/* Player Confirmation */}
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-900">Player Confirmation</p>
                <span className="text-xs text-slate-600">{match.confirmedPlayers}/{match.teamSize}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(match.confirmedPlayers, match.teamSize)}%` }}
                />
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Courts Allocated</p>
                <p className="text-lg font-bold text-blue-600">{match.resources.courts}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Match Balls</p>
                <p className="text-lg font-bold text-amber-600">{match.resources.balls}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">Coaching Staff</p>
                <p className="text-lg font-bold text-purple-600">{match.resources.coaching ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-4 p-3 bg-slate-50 rounded-lg italic">"{match.notes}"</p>

            <div className="flex gap-2 flex-wrap">
              {match.status === 'scheduled' && (
                <>
                  <button onClick={() => handleUpdateStatus(match.id, 'in-progress')} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">Start Match</button>
                  <button onClick={() => handleConfirmPlayer(match.id)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm">Confirm Player</button>
                  <button onClick={() => handleDownload()} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm">Export</button>
                  <button onClick={() => handleDeleteMatch(match.id)} className="px-4 py-2 border border-red-300 text-red-700 rounded text-sm">Cancel</button>
                </>
              )}
              {match.status === 'in-progress' && (
                <>
                  <button onClick={() => handleUpdateStatus(match.id, 'completed')} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">End Match</button>
                  <button onClick={() => handleDownload()} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm">Export</button>
                </>
              )}
              {match.status === 'completed' && (
                <button onClick={() => handleDownload()} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm">Export Report</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
