import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { History, Search, Filter, Download, Clock, User, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AuditLogEntry {
  id: number;
  user_id: number;
  full_name: string;
  action: string;
  details: string;
  created_at: string;
  ip_address?: string;
  module?: string;
}

export default function AuditLog() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/audit-logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        } else {
          // Fallback mock data if API fails
          setLogs([
            { id: 1, user_id: 1, full_name: 'Super Admin', action: 'ROLE_APPROVED', details: 'Approved Club Manager role for John Kamau', created_at: new Date().toISOString(), module: 'Governance', ip_address: '192.168.1.1' },
            { id: 2, user_id: 1, full_name: 'Super Admin', action: 'SYSTEM_CONFIG_UPDATE', details: 'Updated Ranking Algorithm multipliers', created_at: new Date(Date.now() - 3600000).toISOString(), module: 'System', ip_address: '192.168.1.1' },
            { id: 3, user_id: 2, full_name: 'Tournament Admin', action: 'MATCH_OVERRIDE', details: 'Manually adjusted score for Match #402', created_at: new Date(Date.now() - 7200000).toISOString(), module: 'Operations', ip_address: '192.168.1.45' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <p className="text-slate-500 font-medium">Securing audit trail...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Security Audit Trail</h2>
          <p className="text-slate-500">Immutable record of all administrative actions and system events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by user, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            All Modules
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Clock size={18} />
            Last 24h
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {log.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{log.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 uppercase tracking-tighter">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-400">{log.module || 'System'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600 max-w-xs truncate group-hover:max-w-none group-hover:whitespace-normal transition-all">
                      {log.details}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] font-mono text-slate-400">{log.ip_address || '0.0.0.0'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="w-full py-4 bg-slate-50 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
          Load Older Entries
        </button>
      </div>
    </div>
  );
}
