import React, { useState } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye,
  ChevronRight,
  Medal,
  Activity,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface Result {
  id: string;
  category: string;
  round: string;
  winner: string;
  loser: string;
  score: string;
  time: string;
}

const MOCK_RESULTS: Result[] = [
  { id: '1', category: "Men's Singles Elite", round: 'Final', winner: 'Victor Axelsen', loser: 'Kento Momota', score: '21-18, 21-15', time: '10m ago' },
  { id: '2', category: "Women's Singles Elite", round: 'Semi-Final', winner: 'Tai Tzu-ying', loser: 'Akane Yamaguchi', score: '21-19, 18-21, 21-17', time: '1h ago' },
  { id: '3', category: "Men's Doubles Open", round: 'Quarter-Final', winner: 'Gideon/Sukamuljo', loser: 'Lee/Wang', score: '21-12, 21-14', time: '2h ago' },
  { id: '4', category: "Mixed Doubles U19", round: 'Round of 16', winner: 'Tan/Lai', loser: 'Jordan/Oktavianti', score: '21-15, 21-18', time: '3h ago' },
];

export default function LiveResults() {
  const [results, setResults] = useState<Result[]>(MOCK_RESULTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: '', round: '', winner: '', loser: '', score: '' });

  const handleAddResult = () => {
    if (!formData.category.trim() || !formData.winner.trim() || !formData.loser.trim() || !formData.score.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setResults([...results, { id: Date.now().toString(), ...formData, time: 'now' }]);
    setFormData({ category: '', round: '', winner: '', loser: '', score: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Result recorded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteResult = (id: string) => {
    if (confirm('Delete this result?')) {
      setResults(results.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Result deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live_results.json`;
    a.click();
    setMessage({ type: 'success', text: 'Results downloaded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
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
          <h2 className="text-2xl font-bold text-slate-900">Live Results Dashboard</h2>
          <p className="text-slate-500">Real-time tournament progress and finalized match scores</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownloadResults} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export Results
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Plus size={18} />
            Add Result
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">Record Match Result</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Round (Final, Semi, etc)" value={formData.round} onChange={(e) => setFormData({...formData, round: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Score (21-18, 21-15)" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Winner Name" value={formData.winner} onChange={(e) => setFormData({...formData, winner: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Loser Name" value={formData.loser} onChange={(e) => setFormData({...formData, loser: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleAddResult} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add</button>
          </div>
        </div>
      )}

      {/* Live Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Completed Matches', value: '142', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ongoing Matches', value: '8', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Categories', value: '12', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Average Match Time', value: '45m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Results Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search results by player or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Recent Match Results</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {results.map((result) => (
                <div key={result.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{result.category}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{result.round}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{result.winner}</p>
                            <Medal size={14} className="text-amber-500" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Defeated {result.loser}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">{result.score}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{result.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDeleteResult(result.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-slate-50 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
              Load More Results
            </button>
          </div>
        </div>

        {/* Tournament Progress Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Tournament Progress</h3>
            <div className="space-y-6">
              {[
                { label: "Men's Singles Elite", progress: 85, color: 'bg-emerald-500' },
                { label: "Women's Singles Elite", progress: 70, color: 'bg-blue-500' },
                { label: "Men's Doubles Open", progress: 45, color: 'bg-indigo-500' },
                { label: "Mixed Doubles U19", progress: 20, color: 'bg-amber-500' },
              ].map((cat) => (
                <div key={cat.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                    <span className="text-xs font-bold text-slate-400">{cat.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl shadow-slate-200">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-amber-400" />
              Upcoming Finals
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today @ 4:00 PM</p>
                <p className="text-sm font-bold">MS Elite Final</p>
                <p className="text-xs text-slate-400 mt-1">Court 1 • Main Arena</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today @ 5:30 PM</p>
                <p className="text-sm font-bold">WS Elite Final</p>
                <p className="text-xs text-slate-400 mt-1">Court 1 • Main Arena</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
              View Full Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
