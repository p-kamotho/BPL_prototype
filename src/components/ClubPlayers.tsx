import React, { useState } from 'react';
import { Users, Plus, Search, Filter, UserCheck, UserX, Mail, Phone, Edit2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  category: string;
}

export default function ClubPlayers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+254 700 123 456", status: "active", joinDate: "2023-01-15", category: "Senior" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+254 700 123 457", status: "active", joinDate: "2023-02-20", category: "Junior" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+254 700 123 458", status: "inactive", joinDate: "2022-11-10", category: "Senior" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+254 700 123 459", status: "active", joinDate: "2023-03-05", category: "Veteran" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: '', joinDate: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleAddPlayer = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.category.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newPlayer: Player = {
      id: Math.max(...players.map(p => p.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      status: 'active',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
    };

    setPlayers([...players, newPlayer]);
    setFormData({ name: '', email: '', phone: '', category: '', joinDate: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Player added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditPlayer = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setPlayers(players.map(p =>
      p.id === editingId
        ? { ...p, name: formData.name, email: formData.email, phone: formData.phone, category: formData.category }
        : p
    ));

    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', category: '', joinDate: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Player updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeletePlayer = (id: number) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(players.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Player deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleStatus = (id: number) => {
    setPlayers(players.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const handleEditClick = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      email: player.email,
      phone: player.phone,
      category: player.category,
      joinDate: player.joinDate
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', category: '', joinDate: '' });
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
        <h1 className="text-2xl font-bold text-slate-900">Club Players</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Player
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-lg">{editingId ? 'Edit Player' : 'Add New Player'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">Select Category</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Veteran">Veteran</option>
              </select>
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
              onClick={editingId ? handleEditPlayer : handleAddPlayer}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Update' : 'Add'} Player
            </button>
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
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {(() => {
        const filteredPlayers = players.filter(player => {
          const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               player.email.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = filterStatus === 'all' || player.status === filterStatus;
          return matchesSearch && matchesStatus;
        });

        return (
          <>
            {/* Players List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Players ({filteredPlayers.length})</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {filteredPlayers.map(player => (
                  <div key={player.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{player.name}</h4>
                          <p className="text-sm text-slate-500">{player.category} • Joined {player.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{player.email}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{player.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(player.id)}
                            className="cursor-pointer"
                          >
                            {player.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200">
                                <UserCheck className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full hover:bg-slate-200">
                                <UserX className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                          </button>
                        </div>
                        <button onClick={() => handleEditClick(player)} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button onClick={() => handleDeletePlayer(player.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center gap-1">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredPlayers.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No players found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}