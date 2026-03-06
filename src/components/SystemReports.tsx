import React, { useState } from 'react';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  Trophy, 
  DollarSign,
  ChevronRight,
  Eye,
  FileText,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface Report {
  id: string;
  title: string;
  category: 'Financial' | 'Operations' | 'Governance' | 'Performance';
  generatedBy: string;
  date: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

const MOCK_REPORTS: Report[] = [
  { id: '1', title: 'Q1 Financial Summary', category: 'Financial', generatedBy: 'System Auto', date: '2026-02-01', format: 'PDF' },
  { id: '2', title: 'Tournament Participation Audit', category: 'Operations', generatedBy: 'Super Admin', date: '2026-02-15', format: 'Excel' },
  { id: '3', title: 'Referee Compliance Report', category: 'Governance', generatedBy: 'Federation Admin', date: '2026-02-20', format: 'PDF' },
  { id: '4', title: 'National Ranking Distribution', category: 'Performance', generatedBy: 'System Auto', date: '2026-02-24', format: 'CSV' },
];

export default function SystemReports() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [activeTab, setActiveTab] = useState<'all' | 'financial' | 'operations' | 'governance'>('all');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleDownloadReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      const dataStr = JSON.stringify(report, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title}.json`;
      a.click();
      setMessage({ type: 'success', text: 'Report downloaded!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Report deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGenerateReport = () => {
    const newReport: Report = { 
      id: Date.now().toString(), 
      title: 'New System Report', 
      category: 'Financial', 
      generatedBy: 'User', 
      date: new Date().toISOString().split('T')[0], 
      format: 'PDF' 
    };
    setReports([newReport, ...reports]);
    setMessage({ type: 'success', text: 'Report generated!' });
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
          <h2 className="text-2xl font-bold text-slate-900">System Reports</h2>
          <p className="text-slate-500">Generate and manage federation-wide data exports and analytics</p>
        </div>
        <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
          <Plus size={18} />
          Generate New Report
        </button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Financial Health', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Player Growth', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tournament ROI', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'System Performance', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-900">{item.label}</h3>
            <p className="text-xs text-slate-500 mt-1">Generate instant summary</p>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            {['all', 'financial', 'operations', 'governance'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600">
              <Filter size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600">
              <Calendar size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Report Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Generated By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.filter(r => activeTab === 'all' || r.category.toLowerCase() === activeTab).map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                          <FileText size={18} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">{report.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        report.category === 'Financial' ? 'bg-emerald-50 text-emerald-600' :
                        report.category === 'Operations' ? 'bg-blue-50 text-blue-600' :
                        report.category === 'Governance' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600">{report.generatedBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{report.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase">{report.format}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDownloadReport(report.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Download size={18} />
                        </button>
                        <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full py-4 bg-slate-50 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
            View All Archived Reports
          </button>
        </div>
      </div>
    </div>
  );
}
