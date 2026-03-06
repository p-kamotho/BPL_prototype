import React, { useState } from 'react';
import { AlertTriangle, FileText, Send, Download, CheckCircle, Clock, XCircle, Plus, Trash2, Edit2 } from 'lucide-react';

export default function PlayerAppealsReports() {
  const [activeTab, setActiveTab] = useState('disciplinary');
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [showInjuryForm, setShowInjuryForm] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [appealFormData, setAppealFormData] = useState({ referenceCase: '', appeal: '' });
  const [injuryFormData, setInjuryFormData] = useState({ injury: '', severity: 'minor', description: '' });

  const [disciplinaryRecords, setDisciplinaryRecords] = useState([
    {
      id: 1,
      date: '2024-02-15',
      offense: 'Unsporting Conduct',
      details: 'Excessive celebration after winning point',
      status: 'resolved',
      severity: 'yellow',
      suspension: '0',
      notes: 'Warning issued, no suspension'
    },
    {
      id: 2,
      date: '2024-01-20',
      offense: 'Late Arrival',
      details: 'Arrived 15 minutes late to scheduled match',
      status: 'resolved',
      severity: 'yellow',
      suspension: '0',
      notes: 'Formal warning recorded'
    }
  ]);

  const [appeals, setAppeals] = useState([
    {
      id: 1,
      date: '2024-02-16',
      referenceCase: 'Unsporting Conduct - 2024-02-15',
      status: 'under-review',
      appeal: 'I believe the offense was mis-interpreted. My celebration was within acceptable sports norms.',
      submittedAt: '2024-02-16T09:30:00',
      decision: null
    },
    {
      id: 2,
      date: '2024-01-25',
      referenceCase: 'Late Arrival - 2024-01-20',
      status: 'approved',
      appeal: 'I had a legitimate emergency. Requested reschedule was approved.',
      submittedAt: '2024-01-25T14:15:00',
      decision: 'Appeal approved. Case dismissed.'
    }
  ]);

  const [injuryReports, setInjuryReports] = useState([
    {
      id: 1,
      date: '2024-02-20',
      injury: 'Wrist Sprain',
      severity: 'moderate',
      status: 'active',
      description: 'Sprained right wrist during practice session',
      medicalClearance: 'Pending',
      matchesAffected: 2
    },
    {
      id: 2,
      date: '2024-01-10',
      injury: 'Ankle Strain',
      severity: 'minor',
      status: 'resolved',
      description: 'Minor ankle strain during warm-up',
      medicalClearance: 'Approved',
      matchesAffected: 0
    }
  ]);

  const [adminReports, setAdminReports] = useState([
    {
      id: 1,
      title: 'League Performance Summary - Q1 2024',
      generatedDate: '2024-02-25',
      type: 'performance',
      description: 'Your comprehensive performance metrics, ranking progression, and match statistics for Q1'
    },
    {
      id: 2,
      title: 'Disciplinary History Report',
      generatedDate: '2024-02-24',
      type: 'disciplinary',
      description: 'Complete disciplinary record including offenses, warnings, and appeals history'
    },
    {
      id: 3,
      title: 'Tournament Participation Report',
      generatedDate: '2024-02-23',
      type: 'participation',
      description: 'Overview of your tournament registrations, attendance, and performance across all events'
    }
  ]);

  const handleSubmitAppeal = () => {
    if (!appealFormData.referenceCase || !appealFormData.appeal) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newAppeal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      referenceCase: appealFormData.referenceCase,
      status: 'under-review' as const,
      appeal: appealFormData.appeal,
      submittedAt: new Date().toISOString(),
      decision: null
    };
    setAppeals([...appeals, newAppeal]);
    setAppealFormData({ referenceCase: '', appeal: '' });
    setShowAppealForm(false);
    setMessage({type: 'success', text: 'Appeal submitted successfully!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmitInjury = () => {
    if (!injuryFormData.injury || !injuryFormData.description) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newInjury = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      injury: injuryFormData.injury,
      severity: injuryFormData.severity as any,
      status: 'active' as const,
      description: injuryFormData.description,
      medicalClearance: 'Pending',
      matchesAffected: 0
    };
    setInjuryReports([...injuryReports, newInjury]);
    setInjuryFormData({ injury: '', severity: 'minor', description: '' });
    setShowInjuryForm(false);
    setMessage({type: 'success', text: 'Injury report submitted!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAppeal = (id: number) => {
    if (confirm('Delete this appeal?')) {
      setAppeals(appeals.filter(a => a.id !== id));
      setMessage({type: 'success', text: 'Appeal deleted!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteInjury = (id: number) => {
    if (confirm('Delete this injury report?')) {
      setInjuryReports(injuryReports.filter(i => i.id !== id));
      setMessage({type: 'success', text: 'Injury report deleted!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadReport = (id: number) => {
    const report = adminReports.find(r => r.id === id);
    if (report) {
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${report.id}.json`;
      link.click();
      setMessage({type: 'success', text: 'Report downloaded!'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'white': return 'bg-slate-100 text-slate-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'under-review':
      case 'active':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-600" />;
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
        <h1 className="text-2xl font-bold text-slate-900">Appeals & Reports</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'disciplinary', label: 'Disciplinary' },
          { id: 'appeals', label: 'Appeals' },
          { id: 'injuries', label: 'Injury Reports' },
          { id: 'reports', label: 'Admin Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Disciplinary Records */}
      {activeTab === 'disciplinary' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Disciplinary records and any violations are maintained for transparency. You have the right to appeal any decision.
            </p>
          </div>

          {disciplinaryRecords.length > 0 ? (
            disciplinaryRecords.map(record => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{record.offense}</h3>
                    <p className="text-sm text-slate-600">{record.details}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(record.severity)}`}>
                    {record.severity} card
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Date</p>
                    <p className="font-semibold text-slate-900">{record.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className="capitalize font-semibold">{record.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Suspension</p>
                    <p className="font-semibold text-slate-900">{record.suspension} matches</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-4 p-3 bg-slate-50 rounded-lg">{record.notes}</p>

                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  Appeal This Decision
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No disciplinary records</p>
            </div>
          )}
        </div>
      )}

      {/* Appeals */}
      {activeTab === 'appeals' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAppealForm(!showAppealForm)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit New Appeal
            </button>
          </div>

          {showAppealForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-lg">Submit New Appeal</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reference Case</label>
                <select value={appealFormData.referenceCase} onChange={(e) => setAppealFormData({...appealFormData, referenceCase: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="">Select disciplinary case to appeal</option>
                  {disciplinaryRecords.map(r => (
                    <option key={r.id}>{r.offense} - {r.date}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Appeal Statement</label>
                <textarea
                  rows={4}
                  value={appealFormData.appeal}
                  onChange={(e) => setAppealFormData({...appealFormData, appeal: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Explain why you believe the decision should be overturned..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowAppealForm(false); setAppealFormData({ referenceCase: '', appeal: '' }); }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button onClick={handleSubmitAppeal} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Appeal
                </button>
              </div>
            </div>
          )}

          {appeals.map(appeal => (
            <div key={appeal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Appeal: {appeal.referenceCase}</h3>
                  <p className="text-sm text-slate-600">Submitted {appeal.submittedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(appeal.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appeal.status === 'approved' ? 'bg-green-100 text-green-800' :
                    appeal.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appeal.status.replace('-', ' ')}
                  </span>
                  <button onClick={() => handleDeleteAppeal(appeal.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4 p-4 bg-slate-50 rounded-lg italic">"{appeal.appeal}"</p>

              {appeal.decision && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800"><strong>Decision:</strong> {appeal.decision}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Injury Reports */}
      {activeTab === 'injuries' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowInjuryForm(!showInjuryForm)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Report New Injury
            </button>
          </div>

          {showInjuryForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-lg">Report Injury</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Injury Type</label>
                  <input
                    type="text"
                    value={injuryFormData.injury}
                    onChange={(e) => setInjuryFormData({...injuryFormData, injury: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="e.g., Wrist Sprain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                  <select value={injuryFormData.severity} onChange={(e) => setInjuryFormData({...injuryFormData, severity: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={injuryFormData.description}
                  onChange={(e) => setInjuryFormData({...injuryFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Describe the injury and how it occurred..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowInjuryForm(false); setInjuryFormData({ injury: '', severity: 'minor', description: '' }); }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button onClick={handleSubmitInjury} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Report
                </button>
              </div>
            </div>
          )}

          {injuryReports.map(injury => (
            <div key={injury.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{injury.injury}</h3>
                  <p className="text-sm text-slate-600">{injury.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(injury.severity)}`}>
                    {injury.severity}
                  </span>
                  <button onClick={() => handleDeleteInjury(injury.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Date Reported</p>
                  <p className="font-semibold text-slate-900">{injury.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(injury.status)}
                    <span className="capitalize font-semibold">{injury.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Medical Clearance</p>
                  <p className="font-semibold text-slate-900">{injury.medicalClearance}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">Matches Temporarily Unavailble: <strong>{injury.matchesAffected}</strong></p>
            </div>
          ))}
        </div>
      )}

      {/* Admin Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {adminReports.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-lg text-slate-900">{report.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{report.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Generated: {report.generatedDate}</p>
                </div>
                <button onClick={() => handleDownloadReport(report.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
