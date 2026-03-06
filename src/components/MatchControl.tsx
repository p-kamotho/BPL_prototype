import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  AlertTriangle, 
  Edit3,
  CheckCircle2,
  Clock,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ActiveMatch {
  id: string;
  category: string;
  court: string;
  player1: string;
  player2: string;
  score: string;
  status: 'Live' | 'Paused' | 'Warm-up' | 'Review';
  duration: string;
}

const MOCK_MATCHES: ActiveMatch[] = [
  { id: '1', category: "Men's Singles Elite", court: 'Court 1', player1: 'Victor Axelsen', player2: 'Kento Momota', score: '21-18, 14-12', status: 'Live', duration: '42m' },
  { id: '2', category: "Women's Singles Elite", court: 'Court 2', player1: 'Tai Tzu-ying', player2: 'Akane Yamaguchi', score: '21-19, 21-21', status: 'Live', duration: '38m' },
  { id: '3', category: "Men's Doubles Open", court: 'Court 3', player1: 'Gideon/Sukamuljo', player2: 'Lee/Wang', score: '0-0', status: 'Warm-up', duration: '5m' },
  { id: '4', category: "Mixed Doubles U19", court: 'Court 4', player1: 'Tan/Lai', player2: 'Jordan/Oktavianti', score: '21-15, 18-21, 5-2', status: 'Paused', duration: '55m' },
];

export default function MatchControl() {
  const [matches, setMatches] = useState<ActiveMatch[]>(MOCK_MATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleUpdateMatchStatus = (id: string, newStatus: 'Live' | 'Paused' | 'Warm-up' | 'Review') => {
    setMatches(matches.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setMessage({ type: 'success', text: `Match status updated to ${newStatus}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEndMatch = (id: string) => {
    setMatches(matches.filter(m => m.id !== id));
    setMessage({ type: 'success', text: 'Match ended and recorded' });
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

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Match Control Center</h2>
          <p className="text-slate-500">Real-time oversight and intervention for active tournament matches</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <RefreshCw size={18} />
            Sync Scores
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search active matches or players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={18} />
          Filter by Court
        </button>
      </div>

      {/* Active Matches Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {matches.map((match) => (
          <motion.div 
            key={match.id}
            layoutId={match.id}
            className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${match.status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{match.court}</span>
                <span className="text-xs text-slate-400 font-medium">• {match.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-600">{match.duration}</span>
                <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="p-8 flex-1">
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl font-bold text-slate-600">
                    {match.player1.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate">{match.player1}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {match.score}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    match.status === 'Live' ? 'bg-emerald-50 text-emerald-600' :
                    match.status === 'Paused' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {match.status}
                  </span>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl font-bold text-slate-600">
                    {match.player2.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate">{match.player2}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-3">
              <button onClick={() => handleUpdateMatchStatus(match.id, 'Live')} className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all group">
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">Resume</span>
              </button>
              <button onClick={() => handleUpdateMatchStatus(match.id, 'Paused')} className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all group">
                <Pause size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">Pause</span>
              </button>
              <button onClick={() => handleEndMatch(match.id)} className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group">
                <Square size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">End</span>
              </button>
              <button onClick={() => handleUpdateMatchStatus(match.id, 'Review')} className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all group">
                <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">Review</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Intervention Log */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Interventions</h3>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View Full Audit Trail</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { time: '10:45 AM', action: 'Score Override', match: 'Court 1: Axelsen vs Momota', details: 'Corrected Set 2 score from 14-11 to 14-12 after referee error.', admin: 'Super Admin' },
            { time: '10:12 AM', action: 'Match Paused', match: 'Court 4: Tan/Lai vs Jordan/Oktavianti', details: 'Medical timeout requested by Player B.', admin: 'Tournament Admin' },
          ].map((log, i) => (
            <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                <Activity size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-900">{log.action}</p>
                  <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{log.match}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">"{log.details}" — {log.admin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
