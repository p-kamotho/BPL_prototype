import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface Referee {
  id: string;
  name: string;
  level: 'National' | 'Continental' | 'International';
  status: 'Available' | 'Assigned' | 'On Break';
  assignedCourt?: string;
  assignedMatch?: string;
  experience: string;
}

const MOCK_REFEREES: Referee[] = [
  { id: '1', name: 'James Mwangi', level: 'International', status: 'Assigned', assignedCourt: 'Court 1', assignedMatch: 'MS Elite - Final', experience: '12 Years' },
  { id: '2', name: 'Sarah Otieno', level: 'National', status: 'Available', experience: '4 Years' },
  { id: '3', name: 'Robert Korir', level: 'Continental', status: 'Assigned', assignedCourt: 'Court 3', assignedMatch: 'WS Elite - Semis', experience: '8 Years' },
  { id: '4', name: 'Lucy Wanjiku', level: 'National', status: 'On Break', experience: '3 Years' },
];

export default function RefereeAssignment() {
  const [referees, setReferees] = useState<Referee[]>(MOCK_REFEREES);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', level: 'National' as const, status: 'Available' as const, experience: '', assignedMatch: '' });

  const handleAssignReferee = (id: string, match: string) => {
    setReferees(referees.map(r => r.id === id ? { ...r, status: 'Assigned', assignedMatch: match, assignedCourt: `Court ${Math.floor(Math.random() * 5) + 1}` } : r));
    setMessage({ type: 'success', text: 'Referee assigned!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUnassignReferee = (id: string) => {
    setReferees(referees.map(r => r.id === id ? { ...r, status: 'Available', assignedMatch: undefined, assignedCourt: undefined } : r));
    setMessage({ type: 'success', text: 'Assignment removed!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteReferee = (id: string) => {
    if (confirm('Delete this referee?')) {
      setReferees(referees.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Referee deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddReferee = () => {
    if (!formData.name.trim() || !formData.experience.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setReferees([...referees, { id: Date.now().toString(), ...formData }]);
    setFormData({ name: '', level: 'National', status: 'Available', experience: '', assignedMatch: '' });
    setShowForm(false);
    setMessage({ type: 'success', text: 'Referee added!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredReferees = referees.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-2xl font-bold text-slate-900">Referee Assignment</h2>
          <p className="text-slate-500">Manage official assignments across tournament courts</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Plus size={18} />
            Add Referee
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold">Add New Referee</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value as any})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
              <option value="National">National</option>
              <option value="Continental">Continental</option>
              <option value="International">International</option>
            </select>
            <input type="text" placeholder="Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={handleAddReferee} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referee List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search referees..."
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Referee</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferees.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                          {ref.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{ref.name}</p>
                          <p className="text-[10px] text-slate-500">{ref.experience} Exp.</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        ref.level === 'International' ? 'bg-indigo-50 text-indigo-600' :
                        ref.level === 'Continental' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {ref.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        ref.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                        ref.status === 'Assigned' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {ref.status === 'Available' && <CheckCircle2 size={12} />}
                        {ref.status === 'Assigned' && <Clock size={12} />}
                        {ref.status === 'On Break' && <AlertCircle size={12} />}
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ref.assignedCourt ? (
                        <div>
                          <p className="text-xs font-bold text-slate-900">{ref.assignedCourt}</p>
                          <p className="text-[10px] text-slate-500">{ref.assignedMatch}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No assignment</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {ref.status === 'Available' && (
                          <button onClick={() => handleAssignReferee(ref.id, 'Sample Match')} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">Assign</button>
                        )}
                        {ref.status === 'Assigned' && (
                          <button onClick={() => handleUnassignReferee(ref.id)} className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded text-sm">Unassign</button>
                        )}
                        <button onClick={() => handleDeleteReferee(ref.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Court Overview Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              Court Status
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((court) => (
                <div key={court} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Court {court}</p>
                    <p className="text-[10px] text-slate-500">
                      {court % 2 === 0 ? 'Match in Progress' : 'Waiting for Players'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${court % 2 === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
            <div className="flex items-center gap-2 mb-3 text-indigo-700">
              <ShieldCheck size={20} />
              <h4 className="font-bold">Compliance Check</h4>
            </div>
            <p className="text-xs text-indigo-600 leading-relaxed mb-4">
              All active courts currently have at least one certified referee assigned. 2 International referees are on standby.
            </p>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              View Compliance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
