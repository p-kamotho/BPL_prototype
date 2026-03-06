import React from 'react';
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

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

interface KPIRowProps {
  stats: Stat[];
}

export const KPIRow: React.FC<KPIRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              {stat.trend}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};
