import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, Calendar, UserCheck, Plus, Trash2, Edit2 } from 'lucide-react';

interface ComplianceItem {
  id: number;
  title: string;
  description: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastChecked: string;
  nextDue: string;
  category: string;
}

export default function ClubSanctionsCompliance() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: 1,
      title: "Player Registration Compliance",
      description: "All club players must be registered with the national federation",
      status: "compliant",
      lastChecked: "2024-01-15",
      nextDue: "2024-06-15",
      category: "Registration"
    },
    {
      id: 2,
      title: "Coach Certification",
      description: "All coaches must hold valid certification from accredited bodies",
      status: "warning",
      lastChecked: "2024-01-10",
      nextDue: "2024-03-10",
      category: "Certification"
    },
    {
      id: 3,
      title: "Anti-Doping Policy",
      description: "Club must have anti-doping policy and education program",
      status: "compliant",
      lastChecked: "2024-01-08",
      nextDue: "2024-07-08",
      category: "Safety"
    },
    {
      id: 4,
      title: "Insurance Coverage",
      description: "Valid insurance coverage for all club activities and members",
      status: "non-compliant",
      lastChecked: "2023-12-20",
      nextDue: "2024-02-20",
      category: "Insurance"
    },
    {
      id: 5,
      title: "Facility Safety Standards",
      description: "Club facilities must meet national safety standards",
      status: "compliant",
      lastChecked: "2024-01-05",
      nextDue: "2024-12-05",
      category: "Safety"
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', status: 'compliant' as const });
  
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleAddCompliance = () => {
    if (!formData.title || !formData.description) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const newItem: ComplianceItem = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      lastChecked: new Date().toISOString().split('T')[0],
      nextDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setComplianceItems([...complianceItems, newItem]);
    setFormData({ title: '', description: '', category: '', status: 'compliant' });
    setShowForm(false);
    setMessage({type: 'success', text: 'Compliance item added!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditClick = (item: ComplianceItem) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description, category: item.category, status: item.status });
    setShowForm(true);
  };

  const handleEditSubmit = () => {
    if (!formData.title || !formData.description) {
      setMessage({type: 'error', text: 'Please fill all required fields'});
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setComplianceItems(complianceItems.map(item => item.id === editingId ? {
      ...item,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status
    } : item));
    setFormData({ title: '', description: '', category: '', status: 'compliant' });
    setShowForm(false);
    setEditingId(null);
    setMessage({type: 'success', text: 'Item updated!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', category: '', status: 'compliant' });
  };

  const handleUpdateStatus = (id: number) => {
    const newStatus = prompt('Enter new status (compliant/warning/non-compliant):');
    if (newStatus && ['compliant', 'warning', 'non-compliant'].includes(newStatus)) {
      setComplianceItems(complianceItems.map(item => 
        item.id === id ? {...item, status: newStatus as 'compliant' | 'warning' | 'non-compliant', lastChecked: new Date().toISOString().split('T')[0]} : item
      ));
      setMessage({type: 'success', text: 'Compliance status updated!'});
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({type: 'error', text: 'Invalid status'});
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRequestAudit = () => {
    setMessage({type: 'success', text: 'Audit request submitted. You will receive a confirmation email.'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmitReport = () => {
    setMessage({type: 'success', text: 'Compliance report submitted successfully!'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRequestInspection = () => {
    setMessage({type: 'success', text: 'Inspection request submitted. Awaiting scheduling.'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAppealDecision = () => {
    setMessage({type: 'success', text: 'Appeal submission received. Review process started.'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleScheduleReview = () => {
    setMessage({type: 'success', text: 'Review scheduled. Confirmation sent to your email.'});
    setTimeout(() => setMessage(null), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-compliant':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const compliantCount = complianceItems.filter(item => item.status === 'compliant').length;
  const warningCount = complianceItems.filter(item => item.status === 'warning').length;
  const nonCompliantCount = complianceItems.filter(item => item.status === 'non-compliant').length;

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
          <h2 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Compliance Item' : 'Add Compliance Item'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" placeholder="Enter title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 h-20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" placeholder="e.g., Registration" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="non-compliant">Non-Compliant</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={editingId ? handleEditSubmit : handleAddCompliance} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">{editingId ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sanctions & Compliance</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', description: '', category: '', status: 'compliant' }); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Item
          </button>
          <button onClick={handleRequestAudit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Request Audit
          </button>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Overall Status</p>
              <p className="text-2xl font-bold text-emerald-600">Good</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{compliantCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Non-Compliant</p>
              <p className="text-2xl font-bold text-red-600">{nonCompliantCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Compliance Checklist</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {complianceItems.map(item => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last checked: {item.lastChecked}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Next due: {item.nextDue}
                      </div>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { if (!confirm('Delete this item?')) return; setComplianceItems(complianceItems.filter(i => i.id !== item.id)); setMessage({type: 'success', text: 'Item deleted!'}); setTimeout(() => setMessage(null), 3000); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {item.status !== 'compliant' && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleUpdateStatus(item.id)} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors">
                    Update Status
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sanctions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Sanctions & Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-slate-900">Warning Issued - Coach Certification</p>
              <p className="text-sm text-slate-600">One coach certification expires in 30 days. Please renew immediately.</p>
              <p className="text-xs text-slate-500 mt-1">Issued: January 10, 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-slate-900">Non-Compliance Notice - Insurance</p>
              <p className="text-sm text-slate-600">Insurance coverage has expired. Club activities may be suspended until renewed.</p>
              <p className="text-xs text-slate-500 mt-1">Issued: December 20, 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleSubmitReport} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Submit Report</p>
          </button>
          <button onClick={handleRequestInspection} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Request Inspection</p>
          </button>
          <button onClick={handleAppealDecision} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Appeal Decision</p>
          </button>
          <button onClick={handleScheduleReview} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Schedule Review</p>
          </button>
        </div>
      </div>
    </div>
  );
}