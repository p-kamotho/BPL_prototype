import React from 'react';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
      </div>
      <div className="divide-y divide-slate-50">
        {activities.length > 0 ? activities.map((item) => (
          <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
              <p className="text-xs text-slate-500 truncate">{item.description}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-[10px] sm:text-xs text-slate-400">{item.timestamp}</p>
              <p className="text-xs text-emerald-600 font-medium capitalize">{item.status}</p>
            </div>
          </div>
        )) : (
          <div className="p-6 text-center text-slate-500 text-sm">No recent activity found.</div>
        )}
      </div>
    </div>
  );
};
