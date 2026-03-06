import React from 'react';
import { KPIRow } from './KPIRow';
import { ActivityFeed } from './ActivityFeed';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 
  Trophy, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardLayoutProps {
  stats: any[];
  activities: any[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ stats, activities }) => {
  const { user, activeRole } = useAuthStore();

  if (user?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6">
          <Clock size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
        <p className="text-slate-500">
          Your registration is currently being reviewed by our administrators. 
          You'll receive an email notification once your account is activated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Welcome back, {user?.full_name.split(' ')[0]}!</h1>
          <p className="text-sm lg:text-base text-slate-500 mt-1">Here's what's happening in the badminton community today.</p>
        </div>
        <div className="self-start sm:self-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-100">
          Status: Active
        </div>
      </div>

      <KPIRow stats={stats} />

      {activeRole?.role_name === 'super_admin' && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-600" size={24} />
            <h3 className="font-bold text-red-900">Critical System Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
              <p className="text-xs font-bold text-red-600 uppercase mb-1">Security</p>
              <p className="text-sm font-semibold text-slate-900">3 Failed Login Attempts</p>
              <p className="text-xs text-slate-500 mt-1">Detected from IP 192.168.1.45</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
              <p className="text-xs font-bold text-red-600 uppercase mb-1">Governance</p>
              <p className="text-sm font-semibold text-slate-900">Pending Sanction Review</p>
              <p className="text-xs text-slate-500 mt-1">Nairobi Open requires federation approval</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
              <p className="text-xs font-bold text-red-600 uppercase mb-1">System</p>
              <p className="text-sm font-semibold text-slate-900">Backup Status: Warning</p>
              <p className="text-xs text-slate-500 mt-1">Last automated backup failed 2h ago</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>

        {/* Notifications/Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Announcements</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 text-emerald-600"><CheckCircle2 size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">New Ranking System</p>
                  <p className="text-xs text-slate-500">The 2026 points calculation logic is now live.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-amber-600"><AlertCircle size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tournament Deadline</p>
                  <p className="text-xs text-slate-500">Registration for Coast Open closes in 2 days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
            <h3 className="font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-emerald-100 text-xs mb-4">Get advanced analytics, historical match data, and personalized coaching tips.</p>
            <button className="w-full py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
