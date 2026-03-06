import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, Award, Calendar, Mail, Phone, CheckCircle, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface Coach {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  certification: string;
  experience: string;
  status: 'active' | 'inactive';
}

export default function ClubCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([
    {
      id: 1,
      name: "Coach David Kim",
      email: "david@nairobibc.com",
      phone: "+254 700 123 460",
      specialization: "Singles & Doubles",
      certification: "Level 3 Coach",
      experience: "8 years",
      status: "active"
    },
    {
      id: 2,
      name: "Coach Mary Wanjiku",
      email: "mary@nairobibc.com",
      phone: "+254 700 123 461",
      specialization: "Junior Development",
      certification: "Level 2 Coach",
      experience: "5 years",
      status: "active"
    },
    {
      id: 3,
      name: "Coach Peter Oduya",
      email: "peter@nairobibc.com",
      phone: "+254 700 123 462",
      specialization: "Fitness & Conditioning",
      certification: "Level 1 Coach",
      experience: "3 years",
      status: "inactive"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', specialization: '', certification: '', experience: '', status: 'active' as const });

  const handleAddCoach = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.specialization.trim() || !formData.certification.trim() || !formData.experience.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setCoaches([...coaches, { id: Date.now(), ...formData, status: formData.status }]);
    setFormData({ name: '', email: '', phone: '', specialization: '', certification: '', experience: '', status: 'active' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Coach added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditCoach = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setCoaches(coaches.map(c => c.id === editingId ? { ...c, ...formData } : c));
    setFormData({ name: '', email: '', phone: '', specialization: '', certification: '', experience: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
    setMessage({ type: 'success', text: 'Coach updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteCoach = (id: number) => {
    if (confirm('Delete this coach?')) {
      setCoaches(coaches.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Coach deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleStatus = (id: number) => {
    setCoaches(coaches.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    const coach = coaches.find(c => c.id === id);
    const newStatus = coach?.status === 'active' ? 'inactive' : 'active';
    setMessage({ type: 'success', text: `Coach ${newStatus}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditClick = (coach: Coach) => {
    setFormData(coach);
    setEditingId(coach.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', specialization: '', certification: '', experience: '', status: 'active' });
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
        <h1 className="text-2xl font-bold text-slate-900">Club Coaches</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Coach
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">{editingId ? 'Edit Coach' : 'Add New Coach'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Specialization" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Certification" value={formData.certification} onChange={(e) => setFormData({...formData, certification: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <input type="text" placeholder="Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={editingId ? handleEditCoach : handleAddCoach} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{editingId ? 'Update' : 'Add'}</button>
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
              placeholder="Search coaches..."
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

      {/* Coaches List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Coaches</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {(() => {
            const filteredCoaches = coaches.filter(coach => {
              const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   coach.specialization.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = filterStatus === 'all' || coach.status === filterStatus;
              return matchesSearch && matchesStatus;
            });
            return filteredCoaches.length === 0 ? (
              <div className="p-12 text-center">
                <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No coaches found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredCoaches.map(coach => (
                <div key={coach.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{coach.name}</h4>
                        <p className="text-sm text-slate-500">{coach.specialization} • {coach.experience} experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{coach.certification}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{coach.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{coach.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleStatus(coach.id)} className={`inline-flex items-center gap-1 px-2 py-1 ${coach.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'} text-xs font-medium rounded-full cursor-pointer`}>
                          <UserCheck className="w-3 h-3" />
                          {coach.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <button onClick={() => handleEditClick(coach)} className="px-3 py-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded flex items-center gap-1 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCoach(coach.id)} className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded flex items-center gap-1 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            );
          })()}
        </div>
      </div>
    </div>
  );
}