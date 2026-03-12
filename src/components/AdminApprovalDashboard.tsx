import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Mail, User, Shield, AlertCircle } from 'lucide-react';
import ApiClient from '../utils/api';

interface PendingApproval {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  approval_type: 'club_manager' | 'player';
  club_name?: string;
  club_location?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminApprovalDashboard() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'club_manager' | 'player'>('all');
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      // Mock data for now - in production this would call a real endpoint
      const mockApprovals: PendingApproval[] = [
        {
          id: 1,
          user_id: 5,
          email: 'manager@club.ke',
          full_name: 'John Kipchoge',
          approval_type: 'club_manager',
          club_name: 'Nairobi Badminton Club',
          club_location: 'Nairobi, Kenya',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          user_id: 6,
          email: 'player@club.ke',
          full_name: 'Alice Ochieng',
          approval_type: 'player',
          status: 'pending',
          created_at: new Date(Date.now() - 43200000).toISOString(),
        },
      ];
      setApprovals(mockApprovals);
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approval: PendingApproval) => {
    try {
      setApproving(true);
      
      if (approval.approval_type === 'club_manager') {
        await ApiClient.request('/api/admin/approve-club-manager', {
          method: 'POST',
          body: JSON.stringify({
            user_id: approval.user_id,
            club_name: approval.club_name,
            club_location: approval.club_location,
          }),
        });
      } else {
        await ApiClient.request('/api/admin/approve-player', {
          method: 'POST',
          body: JSON.stringify({
            player_user_id: approval.user_id,
          }),
        });
      }

      // Update local state
      setApprovals(prev =>
        prev.map(a =>
          a.id === approval.id ? { ...a, status: 'approved' } : a
        )
      );
      
      setSelectedApproval(null);
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Failed to approve. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (approval: PendingApproval) => {
    try {
      setApproving(true);
      // In production, this would call an endpoint to reject
      setApprovals(prev =>
        prev.map(a =>
          a.id === approval.id ? { ...a, status: 'rejected' } : a
        )
      );
      setSelectedApproval(null);
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setApproving(false);
    }
  };

  const filteredApprovals = approvals.filter(a =>
    filter === 'all' ? true : a.approval_type === filter
  );

  const pendingCount = filteredApprovals.filter(a => a.status === 'pending').length;
  const approvedCount = filteredApprovals.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Approval Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage club manager and player registrations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{pendingCount}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-emerald-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{filteredApprovals.length}</p>
            </div>
            <Shield className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {['all', 'club_manager', 'player'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'club_manager' ? 'Club Managers' : 'Players'}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading approvals...</p>
        </div>
      ) : filteredApprovals.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p className="text-slate-700 dark:text-slate-300 font-medium">No registrations to review</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">All pending requests have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map(approval => (
            <div
              key={approval.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border p-4 transition-all ${
                approval.status === 'pending'
                  ? 'border-yellow-200 dark:border-yellow-900'
                  : approval.status === 'approved'
                  ? 'border-emerald-200 dark:border-emerald-900'
                  : 'border-red-200 dark:border-red-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      {approval.approval_type === 'club_manager' ? (
                        <Shield className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {approval.full_name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {approval.approval_type === 'club_manager' ? 'Club Manager' : 'Player'} Registration
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{approval.email}</span>
                    </div>
                    {approval.club_name && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{approval.club_name}</span>
                      </div>
                    )}
                    {approval.club_location && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 dark:text-slate-400">📍 {approval.club_location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {new Date(approval.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  {approval.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                      <Clock size={12} />
                      Pending
                    </span>
                  )}
                  {approval.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                      <CheckCircle size={12} />
                      Approved
                    </span>
                  )}
                  {approval.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                      <XCircle size={12} />
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {approval.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleApprove(approval)}
                    disabled={approving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(approval)}
                    disabled={approving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
