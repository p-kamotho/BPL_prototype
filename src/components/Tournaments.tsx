import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Trophy, Users, Trash2, Edit2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  level: 'club' | 'regional' | 'national' | 'international';
  start_date: string;
  end_date: string;
  status: 'draft' | 'published' | 'started' | 'completed';
  sanction_status: 'pending' | 'approved' | 'rejected';
  location?: string;
  teams_registered?: number;
  max_teams?: number;
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: 'Kenya National Badminton Championship 2024',
      level: 'national',
      start_date: '2024-06-15',
      end_date: '2024-06-22',
      status: 'published',
      sanction_status: 'approved',
      location: 'Nairobi Sports Club',
      teams_registered: 24,
      max_teams: 32
    },
    {
      id: 2,
      name: 'Coast Region Youth Tournament',
      level: 'regional',
      start_date: '2024-07-01',
      end_date: '2024-07-05',
      status: 'published',
      sanction_status: 'pending',
      location: 'Mombasa',
      teams_registered: 16,
      max_teams: 20
    },
    {
      id: 3,
      name: 'Nairobi Club Championship',
      level: 'club',
      start_date: '2024-05-20',
      end_date: '2024-05-25',
      status: 'completed',
      sanction_status: 'approved',
      location: 'Nairobi',
      teams_registered: 12,
      max_teams: 16
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'club' as const,
    start_date: '',
    end_date: '',
    location: '',
    max_teams: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleAddTournament = () => {
    if (!formData.name.trim() || !formData.start_date || !formData.end_date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newTournament: Tournament = {
      id: Math.max(...tournaments.map(t => t.id), 0) + 1,
      name: formData.name,
      level: formData.level,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location,
      max_teams: formData.max_teams ? parseInt(formData.max_teams) : 16,
      status: 'draft',
      sanction_status: 'pending',
      teams_registered: 0
    };

    setTournaments([...tournaments, newTournament]);
    setFormData({ name: '', level: 'club', start_date: '', end_date: '', location: '', max_teams: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Tournament created successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditTournament = () => {
    if (!formData.name.trim() || !formData.start_date || !formData.end_date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setTournaments(tournaments.map(t =>
      t.id === editingId
        ? {
            ...t,
            name: formData.name,
            level: formData.level,
            start_date: formData.start_date,
            end_date: formData.end_date,
            location: formData.location,
            max_teams: formData.max_teams ? parseInt(formData.max_teams) : t.max_teams
          }
        : t
    ));

    setEditingId(null);
    setFormData({ name: '', level: 'club', start_date: '', end_date: '', location: '', max_teams: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Tournament updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePublish = (id: number) => {
    setTournaments(tournaments.map(t =>
      t.id === id ? { ...t, status: 'published' as const } : t
    ));
    setMessage({ type: 'success', text: 'Tournament published!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleApproveSanction = (id: number) => {
    setTournaments(tournaments.map(t =>
      t.id === id ? { ...t, sanction_status: 'approved' as const } : t
    ));
    setMessage({ type: 'success', text: 'Sanction approved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteTournament = (id: number) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      setTournaments(tournaments.filter(t => t.id !== id));
      setMessage({ type: 'success', text: 'Tournament deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEditClick = (tournament: Tournament) => {
    setEditingId(tournament.id);
    setFormData({
      name: tournament.name,
      level: tournament.level,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      location: tournament.location || '',
      max_teams: tournament.max_teams?.toString() || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', level: 'club', start_date: '', end_date: '', location: '', max_teams: '' });
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
          <h2 className="text-2xl font-bold text-slate-900">Tournaments</h2>
          <p className="text-slate-500 mt-1">Manage and organize badminton tournaments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">{editingId ? 'Edit Tournament' : 'Create New Tournament'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tournament Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="club">Club</option>
                  <option value="regional">Regional</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Teams</label>
                <input
                  type="number"
                  value={formData.max_teams}
                  onChange={(e) => setFormData({ ...formData, max_teams: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleEditTournament : handleAddTournament}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Update' : 'Create'} Tournament
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{tournament.name}</h3>
                  <p className="text-sm text-slate-600 capitalize">{tournament.level} Level</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  tournament.status === 'published' ? 'bg-blue-100 text-blue-800' :
                  tournament.status === 'draft' ? 'bg-slate-100 text-slate-800' :
                  tournament.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {tournament.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-600 mb-1">Dates</p>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {tournament.start_date} - {tournament.end_date}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Location</p>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tournament.location || 'TBA'}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Teams</p>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {tournament.teams_registered}/{tournament.max_teams}
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm">
              <p className="font-semibold text-amber-800">Sanction Status: <span className="capitalize">{tournament.sanction_status}</span></p>
            </div>

            <div className="flex gap-2">
              {tournament.status === 'draft' && (
                <button onClick={() => handlePublish(tournament.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                  Publish
                </button>
              )}
              {tournament.sanction_status === 'pending' && (
                <button onClick={() => handleApproveSanction(tournament.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Approve Sanction
                </button>
              )}
              <button onClick={() => handleEditClick(tournament)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button onClick={() => handleDeleteTournament(tournament.id)} className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
