import React, { useState } from 'react';
import { AlertTriangle, FileText, Send, Check, Clock, XCircle, Plus, MessageCircle } from 'lucide-react';

export default function ClubDisputes() {
  const [activeTab, setActiveTab] = useState('disputes');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [disputes, setDisputes] = useState([
    {
      id: 1,
      date: '2024-03-02',
      involvedParties: 'John Doe vs Management',
      type: 'playing-time',
      description: 'Player contesting limited playing time allocation in recent matches',
      status: 'under-review',
      severity: 'medium',
      resolution: null
    },
    {
      id: 2,
      date: '2024-02-25',
      involvedParties: 'Coach David & Player Sarah',
      type: 'conduct',
      description: 'Disagreement regarding coaching feedback and player performance evaluation',
      status: 'resolved',
      severity: 'low',
      resolution: 'Mediation conducted. Both parties agreed to communication plan.'
    },
    {
      id: 3,
      date: '2024-02-18',
      involvedParties: 'Jane Smith vs Club',
      type: 'eligibility',
      description: 'Query regarding tournament eligibility and participation requirements',
      status: 'pending-response',
      severity: 'low',
      resolution: null
    }
  ]);

  const [appeals, setAppeals] = useState([
    {
      id: 1,
      date: '2024-02-28',
      claimant: 'Peter Mwangi',
      reason: 'Non-selection to tournament squad',
      status: 'approved',
      appealedAt: '2024-02-28T10:30:00',
      resolution: 'Appeal approved. Player added to alternative tournament squad.'
    },
    {
      id: 2,
      date: '2024-02-20',
      claimant: 'Rachel Karori',
      reason: 'Objection to club fee increase',
      status: 'pending',
      appealedAt: '2024-02-20T14:15:00',
      resolution: null
    },
    {
      id: 3,
      date: '2024-02-15',
      claimant: 'Team Leadership',
      reason: 'Dispute resolution escalation',
      status: 'rejected',
      appealedAt: '2024-02-15T09:00:00',
      resolution: 'Appeal rejected. Club decision upheld after review.'
    }
  ]);

  const handleMarkResolved = (disputeId: number) => {
    const resolution = prompt('Enter resolution details:');
    if (resolution) {
      setDisputes(disputes.map(d => 
        d.id === disputeId 
          ? { ...d, status: 'resolved', resolution }
          : d
      ));
      setMessage({ type: 'success', text: 'Dispute marked as resolved!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleApproveAppeal = (appealId: number) => {
    const resolution = prompt('Enter approval decision:');
    if (resolution) {
      setAppeals(appeals.map(a => 
        a.id === appealId 
          ? { ...a, status: 'approved', resolution }
          : a
      ));
      setMessage({ type: 'success', text: 'Appeal approved!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRejectAppeal = (appealId: number) => {
    const resolution = prompt('Enter rejection reason:');
    if (resolution) {
      setAppeals(appeals.map(a => 
        a.id === appealId 
          ? { ...a, status: 'rejected', resolution }
          : a
      ));
      setMessage({ type: 'success', text: 'Appeal rejected!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownloadReport = (type: string, date: string) => {
    const reportData = {
      type,
      date,
      generatedAt: new Date().toLocaleString(),
      items: type === 'disputes' ? disputes : appeals
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_report_${date}.json`;
    link.click();
    setMessage({ type: 'success', text: `${type} report downloaded!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredDisputes = disputes.filter(d => filterStatus === 'all' || d.status === filterStatus);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending-response': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved':
      case 'approved':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'under-review':
      case 'pending':
      case 'pending-response':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-600" />;
    }
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
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Disputes & Appeals</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'disputes', label: 'Member Disputes' },
          { id: 'appeals', label: 'Appeals Review' }
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

      {/* Member Disputes */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'under-review', 'pending-response', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>

          {filteredDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-lg text-slate-900">{dispute.involvedParties}</h3>
                  </div>
                  <p className="text-sm text-slate-600 capitalize">{dispute.type.replace('-', ' ')}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getSeverityColor(dispute.severity)}`}>
                    {dispute.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(dispute.status)}`}>
                    {dispute.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4 p-4 bg-slate-50 rounded-lg">{dispute.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <p className="text-slate-600 mb-1">Date Reported</p>
                  <p className="font-semibold text-slate-900">{dispute.date}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-600 mb-1">Current Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(dispute.status)}
                    <span className="font-semibold capitalize">{dispute.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {dispute.resolution && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm text-green-800"><strong>Resolution:</strong> {dispute.resolution}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Add Comment
                </button>
                {dispute.status !== 'resolved' && (
                  <button onClick={() => handleMarkResolved(dispute.id)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredDisputes.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No disputes found</p>
            </div>
          )}
        </div>
      )}

      {/* Appeals Review */}
      {activeTab === 'appeals' && (
        <div className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-1">Total Appeals</p>
              <p className="text-2xl font-bold text-slate-900">{appeals.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600">{appeals.filter(a => a.status === 'approved').length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{appeals.filter(a => a.status === 'pending').length}</p>
            </div>
          </div>

          {appeals.map(appeal => (
            <div key={appeal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{appeal.claimant}</h3>
                  <p className="text-sm text-slate-600">{appeal.reason}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(appeal.status)}`}>
                  {appeal.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Appeal Date</p>
                  <p className="font-semibold text-slate-900">{appeal.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Submitted</p>
                  <p className="font-semibold text-slate-900">{appeal.appealedAt}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appeal.status)}
                    <span className="font-semibold capitalize">{appeal.status}</span>
                  </div>
                </div>
              </div>

              {appeal.resolution && (
                <div className={`p-4 rounded-lg mb-4 ${
                  appeal.status === 'approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={appeal.status === 'approved' ? 'text-green-800' : 'text-red-800'}>
                    <strong>Decision:</strong> {appeal.resolution}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Details
                </button>
                {appeal.status === 'pending' && (
                  <>
                    <button onClick={() => handleApproveAppeal(appeal.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Approve Appeal
                    </button>
                    <button onClick={() => handleRejectAppeal(appeal.id)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                      Reject Appeal
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
