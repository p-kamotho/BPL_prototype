import React, { useState } from 'react';
import { Users, Mail, DollarSign, Bell, Trophy, Edit2, Plus, Trash2, X, Save, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function PlayerMyClub() {
  const [tab, setTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const clubData = {
    name: 'Nairobi Badminton Club',
    established: '2015',
    location: 'Nairobi, Kenya',
    totalMembers: 45,
    coaches: 3,
    managers: 2,
    annualFee: 5000,
    renewalDate: '2026-12-31'
  };

  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', role: 'Player', joinDate: '2023-01-15', status: 'Active' as const },
    { id: 2, name: 'Jane Smith', role: 'Player', joinDate: '2023-02-20', status: 'Active' as const },
    { id: 3, name: 'Coach David', role: 'Coach', joinDate: '2022-06-10', status: 'Active' as const },
    { id: 4, name: 'Mary Manager', role: 'Manager', joinDate: '2022-01-01', status: 'Active' as const },
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: 'Coach David Kim', role: 'Head Coach', permissions: ['manage_training', 'view_players', 'edit_lineup'] },
    { id: 2, name: 'Mary Wanjiku', role: 'Club Manager', permissions: ['manage_members', 'manage_finances', 'approve_payments'] },
  ]);

  const [financials, setFinancials] = useState([
    { id: 1, type: 'Registration Fee', amount: 15000, date: '2024-01-15', status: 'Paid' as const },
    { id: 2, type: 'Court Rental', amount: 8000, date: '2024-02-01', status: 'Pending' as const },
    { id: 3, type: 'Equipment Maintenance', amount: 5000, date: '2024-02-15', status: 'Paid' as const },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Training Schedule Updated', date: '2024-02-20', content: 'New training sessions start Monday' },
    { id: 2, title: 'Tournament Registration Open', date: '2024-02-18', content: 'Annual championship registration is now open!' },
    { id: 3, title: 'Fundraiser Event', date: '2024-02-15', content: 'Join us for our annual fundraiser next weekend' },
  ]);

  const [newMember, setNewMember] = useState({ name: '', role: 'Player', joinDate: '', status: 'Active' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.joinDate) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers([...members, { ...newMember, id: newId, status: 'Active' }]);
    setNewMember({ name: '', role: 'Player', joinDate: '', status: 'Active' });
    setShowAddForm(false);
    setMessage({ type: 'success', text: 'Member added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditMember = (id: number, field: string, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
      setMessage({ type: 'success', text: 'Member removed successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteFinancial = (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setFinancials(financials.filter(f => f.id !== id));
      setMessage({ type: 'success', text: 'Transaction deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    const newId = Math.max(...announcements.map(a => a.id), 0) + 1;
    setAnnouncements([...announcements, { ...newAnnouncement, id: newId, date: new Date().toISOString().split('T')[0] }]);
    setNewAnnouncement({ title: '', content: '' });
    setMessage({ type: 'success', text: 'Announcement posted!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm('Delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
      setMessage({ type: 'success', text: 'Announcement deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownload = (type: string) => {
    const data = {
      members: JSON.stringify(members, null, 2),
      financials: JSON.stringify(financials, null, 2)
    } as any;
    
    if (data[type]) {
      const element = document.createElement('a');
      const file = new Blob([data[type]], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `club_${type}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setMessage({ type: 'success', text: `${type} downloaded successfully!` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdateFinancialStatus = (id: number, status: 'Paid' | 'Pending') => {
    setFinancials(financials.map(f => f.id === id ? { ...f, status } : f));
    setMessage({ type: 'success', text: 'Status updated!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Club</h1>
        <button 
          onClick={() => handleDownload('members')}
          className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </span>
        </div>
      )}

      {/* Club Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{clubData.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-500">Established</p>
            <p className="font-bold text-slate-900">{clubData.established}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Members</p>
            <p className="font-bold text-slate-900">{clubData.totalMembers}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Coaches</p>
            <p className="font-bold text-slate-900">{clubData.coaches}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-bold text-slate-900 text-sm">{clubData.location}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('overview')}
          className={`px-4 py-3 font-medium ${tab === 'overview' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Members
        </button>
        <button
          onClick={() => setTab('staff')}
          className={`px-4 py-3 font-medium ${tab === 'staff' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Edit2 className="w-4 h-4 inline mr-2" />
          Staff & Roles
        </button>
        <button
          onClick={() => setTab('financial')}
          className={`px-4 py-3 font-medium ${tab === 'financial' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Financial
        </button>
        <button
          onClick={() => setTab('announcements')}
          className={`px-4 py-3 font-medium ${tab === 'announcements' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Announcements
        </button>
      </div>

      {/* Members Tab */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
              <input
                type="text"
                placeholder="Member Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option>Player</option>
                <option>Coach</option>
                <option>Manager</option>
              </select>
              <input
                type="date"
                value={newMember.joinDate}
                onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex-1">
                  {editingId === member.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleEditMember(member.id, 'name', e.target.value)}
                        className="w-full px-3 py-1 border border-slate-300 rounded"
                      />
                      <select
                        value={member.role}
                        onChange={(e) => handleEditMember(member.id, 'role', e.target.value)}
                        className="w-full px-3 py-1 border border-slate-300 rounded"
                      >
                        <option>Player</option>
                        <option>Coach</option>
                        <option>Manager</option>
                      </select>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role} • Joined {member.joinDate}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(editingId === member.id ? null : member.id)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {tab === 'staff' && (
        <div className="space-y-3">
          {staff.map(s => (
            <div key={s.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="text-sm text-slate-600">{s.role}</p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded">
                  <Edit2 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.permissions.map((perm, idx) => (
                  <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Tab */}
      {tab === 'financial' && (
        <div className="space-y-3">
          {financials.map(f => (
            <div key={f.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{f.type}</p>
                <p className="text-sm text-slate-600">Ksh {f.amount.toLocaleString()} • {f.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={f.status}
                  onChange={(e) => handleUpdateFinancialStatus(f.id, e.target.value as 'Paid' | 'Pending')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    f.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <option>Paid</option>
                  <option>Pending</option>
                </select>
                <button
                  onClick={() => handleDeleteFinancial(f.id)}
                  className="p-2 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => handleDownload('financials')}
            className="w-full px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Financials
          </button>
        </div>
      )}

      {/* Announcements Tab */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h3 className="font-semibold">Post Announcement</h3>
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <textarea
              placeholder="Content"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              rows={3}
            />
            <button
              onClick={handleAddAnnouncement}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Post
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{ann.title}</p>
                    <p className="text-xs text-slate-500">{ann.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <p className="text-slate-700">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
