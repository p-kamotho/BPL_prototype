import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Calendar, Trophy, Users, Download, Eye, CheckCircle, AlertTriangle, Trash2, Edit2 } from 'lucide-react';

interface MatchReport {
  id: number;
  tournament: string;
  date: string;
  player1: string;
  player2: string;
  category: string;
  score: string;
  winner: string;
  status: 'completed' | 'disputed' | 'pending_review';
  submittedBy: string;
  submittedDate: string;
}

export default function ClubMatchReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'disputed' | 'pending_review'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ tournament: '', player1: '', player2: '', score: '', winner: '', category: '' });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [matchReports, setMatchReports] = useState<MatchReport[]>([
    {
      id: 1,
      tournament: "Nairobi Open Championship 2024",
      date: "2024-01-15",
      player1: "John Doe",
      player2: "Jane Smith",
      category: "Men's Singles",
      score: "21-19, 18-21, 21-15",
      winner: "John Doe",
      status: "completed",
      submittedBy: "Referee Mike",
      submittedDate: "2024-01-15"
    },
    {
      id: 2,
      tournament: "Club Championship",
      date: "2024-01-12",
      player1: "Sarah Wilson",
      player2: "Mary Johnson",
      category: "Women's Singles",
      score: "21-15, 21-18",
      winner: "Sarah Wilson",
      status: "disputed",
      submittedBy: "Referee Peter",
      submittedDate: "2024-01-12"
    },
    {
      id: 3,
      tournament: "Junior Tournament",
      date: "2024-01-10",
      player1: "Alex Brown",
      player2: "Chris Davis",
      category: "U19 Boys",
      score: "21-17, 19-21, 21-16",
      winner: "Alex Brown",
      status: "pending_review",
      submittedBy: "Referee Lisa",
      submittedDate: "2024-01-10"
    }
  ]);

  const handleAddReport = () => {
    if (!formData.tournament || !formData.player1 || !formData.player2 || !formData.score || !formData.winner) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newReport: MatchReport = {
      id: Date.now(),
      tournament: formData.tournament,
      player1: formData.player1,
      player2: formData.player2,
      score: formData.score,
      winner: formData.winner,
      category: formData.category,
      date: new Date().toISOString().split('T')[0],
      submittedBy: 'Current User',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending_review'
    };
    setMatchReports([...matchReports, newReport]);
    setFormData({ tournament: '', player1: '', player2: '', score: '', winner: '', category: '' });
    setShowForm(false);
    setMessage({type: 'success', text: 'Match report submitted!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditClick = (report: MatchReport) => {
    setEditingId(report.id);
    setFormData({ tournament: report.tournament, player1: report.player1, player2: report.player2, score: report.score, winner: report.winner, category: report.category });
    setShowForm(true);
  };

  const handleEditSubmit = () => {
    if (!formData.tournament || !formData.player1 || !formData.player2 || !formData.score || !formData.winner) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setMatchReports(matchReports.map(r => r.id === editingId ? {
      ...r,
      tournament: formData.tournament,
      player1: formData.player1,
      player2: formData.player2,
      score: formData.score,
      winner: formData.winner,
      category: formData.category
    } : r));
    setFormData({ tournament: '', player1: '', player2: '', score: '', winner: '', category: '' });
    setShowForm(false);
    setEditingId(null);
    setMessage({type: 'success', text: 'Report updated!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ tournament: '', player1: '', player2: '', score: '', winner: '', category: '' });
  };

  const handleDeleteReport = (id: number) => {
    if (confirm('Delete this report?')) {
      setMatchReports(matchReports.filter(r => r.id !== id));
      setMessage({type: 'success', text: 'Report deleted!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadReport = (id: number) => {
    const report = matchReports.find(r => r.id === id);
    if (report) {
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `match-report-${report.id}.json`;
      link.click();
      setMessage({type: 'success', text: 'Report downloaded!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleApplyStatus = (id: number, newStatus: 'completed' | 'disputed' | 'pending_review') => {
    setMatchReports(matchReports.map(r => r.id === id ? {...r, status: newStatus} : r));
    setMessage({type: 'success', text: 'Status updated!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredReports = matchReports.filter(report => {
    const matchesSearch = report.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.player2.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
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

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Match Report' : 'Submit Match Report'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tournament *</label>
                <input type="text" placeholder="Tournament name" value={formData.tournament} onChange={(e) => setFormData({...formData, tournament: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" placeholder="e.g., Men's Singles" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Player 1 *</label>
                <input type="text" placeholder="Player name" value={formData.player1} onChange={(e) => setFormData({...formData, player1: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Player 2 *</label>
                <input type="text" placeholder="Player name" value={formData.player2} onChange={(e) => setFormData({...formData, player2: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Score *</label>
                <input type="text" placeholder="21-19, 18-21, 21-15" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Winner *</label>
                <input type="text" placeholder="Winner name" value={formData.winner} onChange={(e) => setFormData({...formData, winner: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={editingId ? handleEditSubmit : handleAddReport} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">{editingId ? 'Update' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Match Reports</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ tournament: '', player1: '', player2: '', score: '', winner: '', category: '' }); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Submit Report
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'disputed' | 'pending_review')}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
              <option value="pending_review">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Match Reports ({filteredReports.length})</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredReports.map(report => (
            <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{report.tournament}</h4>
                    <p className="text-sm text-slate-500">{report.category} • {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Players</p>
                  <p className="font-medium text-slate-900">{report.player1} vs {report.player2}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Winner</p>
                  <p className="font-medium text-emerald-600 flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {report.winner}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Score</p>
                  <p className="font-medium text-slate-900">{report.score}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Submitted By</p>
                  <p className="font-medium text-slate-900">{report.submittedBy}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Submitted on {report.submittedDate}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDownloadReport(report.id)} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button onClick={() => handleEditClick(report)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button onClick={() => handleDeleteReport(report.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No match reports found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">{matchReports.length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {matchReports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Disputed</p>
              <p className="text-2xl font-bold text-red-600">
                {matchReports.filter(r => r.status === 'disputed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {matchReports.filter(r => r.status === 'pending_review').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}