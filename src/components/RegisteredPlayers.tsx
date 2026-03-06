import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Trophy,
  ShieldCheck,
  FileText,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegisteredPlayer {
  id: string;
  name: string;
  email: string;
  phone: string;
  club: string;
  county: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  categories: string[];
  registrationDate: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  ranking: number;
}

const MOCK_PLAYERS: RegisteredPlayer[] = [
  { 
    id: '1', 
    name: 'Alice Wambui', 
    email: 'alice.w@gmail.com', 
    phone: '+254 712 345 678', 
    club: 'Nairobi Smashers', 
    county: 'Nairobi', 
    status: 'Verified', 
    categories: ["Men's Singles - Elite", "Mixed Doubles"], 
    registrationDate: '2026-02-20', 
    paymentStatus: 'Paid',
    ranking: 12
  },
  { 
    id: '2', 
    name: 'Brian Kipchumba', 
    email: 'brian.k@outlook.com', 
    phone: '+254 722 987 654', 
    club: 'Mombasa Shuttle', 
    county: 'Mombasa', 
    status: 'Pending', 
    categories: ["Men's Singles - Elite"], 
    registrationDate: '2026-02-22', 
    paymentStatus: 'Unpaid',
    ranking: 45
  },
  { 
    id: '3', 
    name: 'Catherine Njeri', 
    email: 'njeri.cat@yahoo.com', 
    phone: '+254 733 111 222', 
    club: 'Kisumu Aces', 
    county: 'Kisumu', 
    status: 'Verified', 
    categories: ["Women's Singles - Elite", "Women's Doubles"], 
    registrationDate: '2026-02-18', 
    paymentStatus: 'Paid',
    ranking: 5
  },
  { 
    id: '4', 
    name: 'David Omondi', 
    email: 'david.o@gmail.com', 
    phone: '+254 700 555 444', 
    club: 'Nakuru Birds', 
    county: 'Nakuru', 
    status: 'Rejected', 
    categories: ["Men's Doubles - Open"], 
    registrationDate: '2026-02-24', 
    paymentStatus: 'Unpaid',
    ranking: 120
  },
];

export default function RegisteredPlayers() {
  const [players, setPlayers] = useState<RegisteredPlayer[]>(MOCK_PLAYERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<RegisteredPlayer | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleApprovePlayer = (id: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
    setMessage({ type: 'success', text: 'Player approved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRejectPlayer = (id: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    setMessage({ type: 'success', text: 'Player rejected!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeletePlayer = (id: string) => {
    if (confirm('Delete this player registration?')) {
      setPlayers(players.filter(p => p.id !== id));
      setSelectedPlayer(null);
      setMessage({ type: 'success', text: 'Player deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadPlayers = () => {
    const dataStr = JSON.stringify(players, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registered_players.json`;
    a.click();
    setMessage({ type: 'success', text: 'Players data downloaded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredPlayers = players.filter(p => 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'All' || p.status === filterStatus)
  );

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
          <h2 className="text-2xl font-bold text-slate-900">Registered Players</h2>
          <p className="text-slate-500">Manage tournament entries and player verification</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownloadPlayers} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Mail size={18} />
            Message All
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Verified', 'Pending', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterStatus === status 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Club / County</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{player.name}</p>
                        <p className="text-[10px] text-slate-500">{player.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700">{player.club}</p>
                    <p className="text-[10px] text-slate-400">{player.county}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {player.categories.map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      player.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                      player.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {player.status === 'Verified' && <CheckCircle2 size={12} />}
                      {player.status === 'Pending' && <Clock size={12} />}
                      {player.status === 'Rejected' && <XCircle size={12} />}
                      {player.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${
                      player.paymentStatus === 'Paid' ? 'text-emerald-600' :
                      player.paymentStatus === 'Partial' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {player.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPlayer(player)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Detail Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedPlayer.name}</h3>
                    <p className="text-slate-400 text-sm">Player ID: #{selectedPlayer.id.padStart(4, '0')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Info */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-600">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-sm">{selectedPlayer.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                            <Phone size={16} className="text-slate-400" />
                            <span className="text-sm">{selectedPlayer.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                            <MapPin size={16} className="text-slate-400" />
                            <span className="text-sm">{selectedPlayer.county}, Kenya</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Affiliation</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-600">
                            <ShieldCheck size={16} className="text-slate-400" />
                            <span className="text-sm font-semibold">{selectedPlayer.club}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600">
                            <Trophy size={16} className="text-slate-400" />
                            <span className="text-sm">National Ranking: #{selectedPlayer.ranking}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tournament Categories</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPlayer.categories.map((cat, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="text-sm font-bold text-slate-700">{cat}</span>
                            <CheckCircle2 size={16} className="text-emerald-600" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400 group-hover:text-emerald-600" />
                            <span className="text-sm font-medium">National ID / Passport</span>
                          </div>
                          <Eye size={16} className="text-slate-300 group-hover:text-emerald-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400 group-hover:text-emerald-600" />
                            <span className="text-sm font-medium">Medical Certificate</span>
                          </div>
                          <Eye size={16} className="text-slate-300 group-hover:text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4">Registration Status</h4>
                      <div className="space-y-3">
                        {selectedPlayer?.status === 'Pending' && (
                          <>
                            <button onClick={() => { handleApprovePlayer(selectedPlayer.id); setSelectedPlayer({...selectedPlayer, status: 'Verified'}); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                              Verify Player
                            </button>
                            <button onClick={() => { handleRejectPlayer(selectedPlayer.id); setSelectedPlayer({...selectedPlayer, status: 'Rejected'}); }} className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all">
                              Reject Entry
                            </button>
                          </>
                        )}
                        {selectedPlayer?.status === 'Verified' && (
                          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold text-center">
                            ✓ Verified
                          </div>
                        )}
                        {selectedPlayer?.status === 'Rejected' && (
                          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold text-center">
                            ✗ Rejected
                          </div>
                        )}
                        <button onClick={() => handleDeletePlayer(selectedPlayer?.id || '')} className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                          <Trash2 size={16} />
                          Delete Registration
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Payment Details</h4>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-blue-700">Total Due</span>
                        <span className="text-lg font-bold text-blue-900">KES 3,500</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-blue-600 uppercase">
                          <span>Status</span>
                          <span>{selectedPlayer.paymentStatus}</span>
                        </div>
                        <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all" 
                            style={{ width: selectedPlayer.paymentStatus === 'Paid' ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Internal Notes</p>
                      <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 h-24 resize-none"
                        placeholder="Add a note about this player..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
