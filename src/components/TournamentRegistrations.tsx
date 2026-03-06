import React, { useState } from 'react';
import { Trophy, Plus, Search, Filter, Calendar, MapPin, Users, CheckCircle, Clock, XCircle, AlertTriangle, Trash2, Edit2 } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  status: 'registered' | 'pending' | 'cancelled';
  registeredPlayers: number;
  maxPlayers: number;
  fee: number;
  categories: string[];
}

export default function TournamentRegistrations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'pending' | 'cancelled'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', date: '', location: '', fee: '', categories: '', maxPlayers: '' });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "Nairobi Open Championship 2024",
      date: "2024-06-15",
      location: "Nairobi Sports Club",
      status: "registered",
      registeredPlayers: 8,
      maxPlayers: 16,
      fee: 5000,
      categories: ["Men's Singles", "Women's Singles", "Men's Doubles"]
    },
    {
      id: 2,
      name: "Kenya National Junior Tournament",
      date: "2024-07-20",
      location: "Kenyatta International Conference Centre",
      status: "pending",
      registeredPlayers: 5,
      maxPlayers: 12,
      fee: 3000,
      categories: ["U19 Boys", "U19 Girls", "U17 Mixed"]
    },
    {
      id: 3,
      name: "Coast Region Badminton Cup",
      date: "2024-08-10",
      location: "Mombasa Sports Complex",
      status: "cancelled",
      registeredPlayers: 0,
      maxPlayers: 20,
      fee: 4000,
      categories: ["Senior Mixed", "Veterans"]
    }
  ]);

  const handleAddRegistration = () => {
    if (!formData.name || !formData.date || !formData.location || !formData.fee) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newTournament: Tournament = {
      id: Date.now(),
      name: formData.name,
      date: formData.date,
      location: formData.location,
      fee: parseInt(formData.fee),
      maxPlayers: parseInt(formData.maxPlayers) || 16,
      registeredPlayers: 0,
      categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : [],
      status: 'pending'
    };
    setTournaments([...tournaments, newTournament]);
    setFormData({ name: '', date: '', location: '', fee: '', categories: '', maxPlayers: '' });
    setShowForm(false);
    setMessage({type: 'success', text: 'Tournament registration added!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCompleteRegistration = (id: number) => {
    setTournaments(tournaments.map(t => t.id === id ? {...t, status: 'registered'} : t));
    setMessage({type: 'success', text: 'Registration completed!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelRegistration = (id: number) => {
    if (confirm('Cancel this registration?')) {
      setTournaments(tournaments.filter(t => t.id !== id));
      setMessage({type: 'success', text: 'Registration cancelled!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEditClick = (tournament: Tournament) => {
    setEditingId(tournament.id);
    setFormData({
      name: tournament.name,
      date: tournament.date,
      location: tournament.location,
      fee: tournament.fee.toString(),
      categories: tournament.categories.join(', '),
      maxPlayers: tournament.maxPlayers.toString()
    });
    setShowForm(true);
  };

  const handleEditSubmit = () => {
    if (!formData.name || !formData.date || !formData.location || !formData.fee) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setTournaments(tournaments.map(t => t.id === editingId ? {
      ...t,
      name: formData.name,
      date: formData.date,
      location: formData.location,
      fee: parseInt(formData.fee),
      maxPlayers: parseInt(formData.maxPlayers) || 16,
      categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : []
    } : t));
    setFormData({ name: '', date: '', location: '', fee: '', categories: '', maxPlayers: '' });
    setShowForm(false);
    setEditingId(null);
    setMessage({type: 'success', text: 'Tournament updated!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', date: '', location: '', fee: '', categories: '', maxPlayers: '' });
  };

  const handleDeleteRegistration = (id: number) => {
    if (confirm('Delete this tournament registration?')) {
      setTournaments(tournaments.filter(t => t.id !== id));
      setMessage({type: 'success', text: 'Tournament deleted!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
        <h1 className="text-2xl font-bold text-slate-900">Tournament Registrations</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', date: '', location: '', fee: '', categories: '', maxPlayers: '' }); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Register for Tournament
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Registration' : 'New Tournament Registration'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tournament Name *</label>
              <input type="text" placeholder="Enter tournament name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input type="text" placeholder="Enter location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Fee (KES) *</label>
                <input type="number" placeholder="0" value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Players</label>
                <input type="number" placeholder="16" value={formData.maxPlayers} onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categories (comma-separated)</label>
              <input type="text" placeholder="Men's Singles, Women's Singles" value={formData.categories} onChange={(e) => setFormData({...formData, categories: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={editingId ? handleEditSubmit : handleAddRegistration} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">{editingId ? 'Update' : 'Register'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'registered' | 'pending' | 'cancelled')}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="grid gap-6">
        {filteredTournaments.map(tournament => (
          <div key={tournament.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{tournament.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(tournament.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tournament.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(tournament.status)}
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  {tournament.registeredPlayers}/{tournament.maxPlayers} players registered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Fee: KES {tournament.fee.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                Categories: {tournament.categories.join(', ')}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tournament.categories.map(category => (
                  <span key={category} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                    {category}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {tournament.status === 'registered' && (
                  <button onClick={() => handleCancelRegistration(tournament.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                    Cancel Registration
                  </button>
                )}
                {tournament.status === 'pending' && (
                  <button onClick={() => handleCompleteRegistration(tournament.id)} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors">
                    Complete Registration
                  </button>
                )}
                <button onClick={() => handleEditClick(tournament)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                  <Edit2 size={14} className="inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDeleteRegistration(tournament.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={14} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No tournaments found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}