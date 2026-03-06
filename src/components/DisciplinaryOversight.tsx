import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  ShieldAlert, 
  UserX, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Gavel,
  History,
  Plus,
  CheckCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DisciplinaryCase {
  id: string;
  subject: string;
  type: 'Player' | 'Official' | 'Club';
  violation: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Review' | 'Resolved' | 'Appealed';
  date: string;
  sanction?: string;
}

const MOCK_CASES: DisciplinaryCase[] = [
  { id: '1', subject: 'John Doe', type: 'Player', violation: 'Unsportsmanlike Conduct', severity: 'Medium', status: 'Under Review', date: '2026-02-20' },
  { id: '2', subject: 'Nairobi Smashers', type: 'Club', violation: 'Ineligible Player Fielded', severity: 'High', status: 'Open', date: '2026-02-22' },
  { id: '3', subject: 'James Mwangi', type: 'Official', violation: 'Bias Allegation', severity: 'High', status: 'Appealed', date: '2026-02-15', sanction: '30-day Suspension' },
  { id: '4', subject: 'Alice Wambui', type: 'Player', violation: 'Equipment Violation', severity: 'Low', status: 'Resolved', date: '2026-02-10', sanction: 'Warning' },
];

export default function DisciplinaryOversight() {
  const [cases, setCases] = useState<DisciplinaryCase[]>(MOCK_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleResolveCase = (id: string) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    setMessage({ type: 'success', text: 'Case resolved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAppealCase = (id: string) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: 'Appealed' } : c));
    setMessage({ type: 'success', text: 'Appeal recorded!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('Delete this case?')) {
      setCases(cases.filter(c => c.id !== id));
      setSelectedCase(null);
      setMessage({ type: 'success', text: 'Case deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredCases = cases.filter(c => 
    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.violation.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-2xl font-bold text-slate-900">Disciplinary Oversight</h2>
          <p className="text-slate-500">Monitor and manage federation-wide disciplinary cases and sanctions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <History size={18} />
            Sanction History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            <ShieldAlert size={18} />
            Open New Case
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Cases', value: '12', icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Appeals', value: '3', icon: Gavel, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Critical Violations', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Resolved (MTD)', value: '24', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by subject or violation..."
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

      {/* Cases Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Violation</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                        {c.subject.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{c.subject}</p>
                        <p className="text-[10px] text-slate-500">{c.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{c.violation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      c.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      c.severity === 'High' ? 'bg-red-50 text-red-600' :
                      c.severity === 'Medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                      c.status === 'Appealed' ? 'bg-indigo-50 text-indigo-600' :
                      c.status === 'Under Review' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">{c.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedCase(c)}
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

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Scale size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Case #{selectedCase.id.padStart(4, '0')}</h3>
                    <p className="text-slate-400 text-sm">{selectedCase.subject} • {selectedCase.violation}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Description</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Formal complaint filed regarding an incident during the Nairobi Open 2026. The subject is alleged to have violated the federation's code of conduct during the semi-final match.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Evidence & Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400 group-hover:text-emerald-600" />
                            <span className="text-sm font-medium">Referee Report.pdf</span>
                          </div>
                          <Eye size={16} className="text-slate-300 group-hover:text-emerald-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400 group-hover:text-emerald-600" />
                            <span className="text-sm font-medium">Match Video Clip.mp4</span>
                          </div>
                          <Eye size={16} className="text-slate-300 group-hover:text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Timeline</h4>
                      <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {[
                          { date: 'Feb 20', event: 'Case Opened', detail: 'Initial report filed by Match Referee.' },
                          { date: 'Feb 21', event: 'Evidence Collected', detail: 'Video footage and witness statements added.' },
                          { date: 'Feb 22', event: 'Under Review', detail: 'Assigned to Disciplinary Committee.' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                              <div className="w-2 h-2 rounded-full bg-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.event}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase">{item.date}</p>
                              <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4">Case Actions</h4>
                      <div className="space-y-3">
                        <button onClick={() => { selectedCase && handleResolveCase(selectedCase.id); setSelectedCase(null); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
                          Resolve Case
                        </button>
                        <button onClick={() => { selectedCase && handleAppealCase(selectedCase.id); setSelectedCase(null); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                          Mark Appeal
                        </button>
                        <button onClick={() => { selectedCase && handleDeleteCase(selectedCase.id); }} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
                          Delete Case
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-[32px] border border-red-100">
                      <h4 className="font-bold text-red-900 mb-2">Sanction Level</h4>
                      <p className="text-xs text-red-600 mb-4">Recommended based on severity and history.</p>
                      <div className="p-3 bg-white rounded-xl border border-red-100 text-center">
                        <p className="text-xs font-bold text-red-700 uppercase">Suspension</p>
                        <p className="text-lg font-bold text-red-900">30 Days</p>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Committee Notes</p>
                      <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 h-24 resize-none"
                        placeholder="Confidential notes for the committee..."
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
