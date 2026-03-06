import React, { useState } from 'react';
import { Download, TrendingUp, User, Trophy, BarChart3, PieChart, Calendar, Filter, CheckCircle, AlertCircle } from 'lucide-react';

export default function ClubReports() {
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [reportType, setReportType] = useState<string>('performance');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');

  const handleGenerateReport = () => {
    const reportData = {
      type: reportType,
      period: selectedPeriod,
      generated: new Date().toISOString(),
      data: performanceMetrics
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage({ type: 'success', text: `${reportType} report generated successfully!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDownloadReport = (report: any) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage({ type: 'success', text: 'Report downloaded!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const reportTypes = [
    {
      id: 'performance',
      label: 'Performance Report',
      description: 'Track club performance metrics, player rankings, and tournament results'
    },
    {
      id: 'membership',
      label: 'Membership Report',
      description: 'Member statistics, demographics, activity levels, and retention rates'
    },
    {
      id: 'financial',
      label: 'Financial Report',
      description: 'Revenue, expenses, membership fees, and financial projections'
    },
    {
      id: 'participation',
      label: 'Participation Report',
      description: 'Tournament participation, event attendance, and engagement metrics'
    }
  ];

  const performanceMetrics = {
    totalMatches: 28,
    wins: 18,
    losses: 10,
    winRate: '64.3%',
    avgPlayerRating: 4.2,
    topPlayer: 'John Doe',
    topPlayerRating: 4.8,
    tournamentTitles: 3
  };

  const membershipMetrics = {
    totalMembers: 28,
    activeMembers: 24,
    newMembers: 3,
    churnRate: '2.1%',
    ageAverage: 27,
    renewalRate: '92%',
    membersByCategory: {
      Players: 18,
      Coaches: 4,
      Managers: 3,
      Staff: 3
    }
  };

  const recentReports = [
    {
      id: 1,
      title: 'March 2024 Performance Summary',
      type: 'performance',
      generatedDate: '2024-03-04',
      period: 'Monthly',
      size: '2.3 MB'
    },
    {
      id: 2,
      title: 'Q1 2024 Financial Report',
      type: 'financial',
      generatedDate: '2024-02-29',
      period: 'Quarterly',
      size: '3.1 MB'
    },
    {
      id: 3,
      title: 'February Tournament Participation',
      type: 'participation',
      generatedDate: '2024-02-28',
      period: 'Monthly',
      size: '1.5 MB'
    },
    {
      id: 4,
      title: 'Annual Membership Analysis 2024',
      type: 'membership',
      generatedDate: '2024-02-15',
      period: 'Annual',
      size: '4.2 MB'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Club Reports</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </span>
        </div>
      )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {reportTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-600 mt-1">
              {reportTypes.find(rt => rt.id === reportType)?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerateReport}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          Generate Report
        </button>

      {/* Metrics Overview */}
      {reportType === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Total Matches</p>
                <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{performanceMetrics.totalMatches}</p>
            <p className="text-xs text-slate-500 mt-1">{performanceMetrics.wins}W - {performanceMetrics.losses}L</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Avg Player Rating</p>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{performanceMetrics.avgPlayerRating}</p>
            <p className="text-xs text-slate-500 mt-1">Out of 5.0</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Tournament Titles</p>
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{performanceMetrics.tournamentTitles}</p>
            <p className="text-xs text-slate-500 mt-1">{performanceMetrics.topPlayer}</p>
          </div>
        </div>
      )}

      {reportType === 'membership' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Total Members</p>
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{membershipMetrics.totalMembers}</p>
            <p className="text-xs text-slate-500 mt-1">{membershipMetrics.activeMembers} active</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">New Members</p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{membershipMetrics.newMembers}</p>
            <p className="text-xs text-slate-500 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Renewal Rate</p>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{membershipMetrics.renewalRate}</p>
            <p className="text-xs text-slate-500 mt-1">Annual renewals</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Churn Rate</p>
              <PieChart className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{membershipMetrics.churnRate}</p>
            <p className="text-xs text-slate-500 mt-1">Member attrition</p>
          </div>
        </div>
      )}

      {/* Member Breakdown by Category */}
      {reportType === 'membership' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4">Members by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(membershipMetrics.membersByCategory).map(([category, count]) => (
              <div key={category} className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">{category}</p>
                <p className="text-3xl font-bold text-slate-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {recentReports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-slate-600" />
                  <h4 className="font-semibold text-slate-900">{report.title}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>Generated: {report.generatedDate}</span>
                  <span>•</span>
                  <span>{report.period}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadReport(report)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-2">Reporting Insights</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Consider scheduling monthly performance reviews to track progress trends</li>
          <li>• Quarterly financial reports help identify budget patterns and opportunities</li>
          <li>• Member engagement metrics show retention opportunities in Q2</li>
          <li>• Top performer recognition can boost team morale and recruiting</li>
        </ul>
      </div>
    </div>
  );
}
