import React, { useState } from 'react';
import { Download, BarChart3, Calendar, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PlayerMatchHistory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const categories = ['all', 'singles', 'doubles', 'mixed'];

  const matchHistory = [
    {
      id: 1,
      date: '2024-02-18',
      opponent: 'Nairobi Junior Club',
      category: 'singles',
      result: 'Win',
      score: '21-15',
      duration: '35 min',
      performance: 85,
      accuracy: '92%',
      serviceAces: 8
    },
    {
      id: 2,
      date: '2024-02-12',
      opponent: 'Mombasa District',
      category: 'doubles',
      result: 'Loss',
      score: '18-21',
      duration: '42 min',
      performance: 72,
      accuracy: '88%',
      serviceAces: 5
    },
    {
      id: 3,
      date: '2024-02-05',
      opponent: 'Kisumu Sports Club',
      category: 'mixed',
      result: 'Win',
      score: '21-17',
      duration: '38 min',
      performance: 88,
      accuracy: '94%',
      serviceAces: 10
    },
    {
      id: 4,
      date: '2024-01-28',
      opponent: 'Nakuru Region',
      category: 'singles',
      result: 'Win',
      score: '21-12',
      duration: '31 min',
      performance: 91,
      accuracy: '96%',
      serviceAces: 12
    },
  ];

  const filteredMatches = selectedCategory === 'all' 
    ? matchHistory 
    : matchHistory.filter(m => m.category === selectedCategory);

  // Performance stats for analytics
  const stats = {
    totalMatches: matchHistory.length,
    wins: matchHistory.filter(m => m.result === 'Win').length,
    losses: matchHistory.filter(m => m.result === 'Loss').length,
    winRate: ((matchHistory.filter(m => m.result === 'Win').length / matchHistory.length) * 100).toFixed(1),
    avgPerformance: (matchHistory.reduce((sum, m) => sum + m.performance, 0) / matchHistory.length).toFixed(1),
    recentRating: '4.8/5.0'
  };

  const handleViewAnalysis = (matchId: number) => {
    setMessage({type: 'success', text: 'Analysis view not implemented yet.'});
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDownloadReport = (matchId: number) => {
    const match = filteredMatches.find(m => m.id === matchId);
    if (match) {
      const dataStr = JSON.stringify(match, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `match-${match.id}.json`;
      link.click();
      setMessage({type:'success', text:'Report downloaded!'});
      setTimeout(() => setMessage(null),3000);
    }
  };

  const handleExportReport = () => {
    const dataStr = JSON.stringify(filteredMatches, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `match-history.json`;
    link.click();
    setMessage({type:'success', text:'Exported all matches!'});
    setTimeout(() => setMessage(null),3000);
  };

  return (
    <div className="space-y-6">      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Match History</h1>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Total Matches</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalMatches}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-green-600">{stats.winRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Avg Performance</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.avgPerformance}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Player Rating</p>
          <p className="text-2xl font-bold text-slate-900">{stats.recentRating}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-600">Filter by Category:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Match History Cards */}
      <div className="space-y-4">
        {filteredMatches.map(match => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{match.opponent}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    match.result === 'Win' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {match.result}
                  </span>
                </div>
                <p className="text-sm text-slate-600 capitalize mb-3">{match.category}</p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {match.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {match.duration}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-600 mb-1">Final Score</p>
                  <p className="text-3xl font-bold text-slate-900">{match.score}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Performance</p>
                <div className="relative inline-flex items-center justify-center w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="font-bold text-emerald-700">{match.performance}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Accuracy</p>
                <p className="text-lg font-bold text-slate-900">{match.accuracy}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Service Aces</p>
                <p className="text-lg font-bold text-slate-900">{match.serviceAces}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button onClick={() => handleViewAnalysis(match.id)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                View Analysis
              </button>
              <button onClick={() => handleDownloadReport(match.id)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Match Report Generation */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">Generate Performance Report</h3>
            <p className="text-sm text-slate-600">Download a comprehensive PDF report of your match statistics and performance trends</p>
          </div>
          <button onClick={handleExportReport} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
