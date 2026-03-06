import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Trophy, Calendar, Target, Award, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ClubAnalytics() {
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleExportData = () => {
    setMessage({type:'success', text:'Data exported!'});
    setTimeout(() => setMessage(null),3000);
  };

  const handleGenerateReport = () => {
    setMessage({type:'success', text:'Report generated!'});
    setTimeout(() => setMessage(null),3000);
  };

  // Mock data - in real app, this would come from API
  const analyticsData = {
    playerStats: {
      totalPlayers: 45,
      activePlayers: 38,
      newPlayersThisMonth: 5,
      categories: {
        senior: 20,
        junior: 15,
        veteran: 10
      }
    },
    tournamentStats: {
      totalTournaments: 12,
      wins: 8,
      participationRate: 85,
      averagePlacement: 3.2
    },
    performanceMetrics: {
      winRate: 67,
      improvementRate: 12,
      attendanceRate: 78,
      trainingCompletion: 92
    },
    monthlyTrends: [
      { month: 'Jan', players: 42, tournaments: 2, wins: 1 },
      { month: 'Feb', players: 43, tournaments: 3, wins: 2 },
      { month: 'Mar', players: 44, tournaments: 2, wins: 2 },
      { month: 'Apr', players: 45, tournaments: 3, wins: 2 },
      { month: 'May', players: 45, tournaments: 2, wins: 1 },
    ]
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
        <h1 className="text-2xl font-bold text-slate-900">Club Analytics</h1>
        <div className="flex gap-2">
          <button onClick={handleExportData} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Export Data
          </button>
          <button onClick={handleGenerateReport} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Players</p>
              <p className="text-2xl font-bold text-slate-900">{analyticsData.playerStats.totalPlayers}</p>
              <p className="text-sm text-emerald-600">+{analyticsData.playerStats.newPlayersThisMonth} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tournament Wins</p>
              <p className="text-2xl font-bold text-emerald-600">{analyticsData.tournamentStats.wins}</p>
              <p className="text-sm text-slate-500">of {analyticsData.tournamentStats.totalTournaments} tournaments</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Win Rate</p>
              <p className="text-2xl font-bold text-purple-600">{analyticsData.performanceMetrics.winRate}%</p>
              <p className="text-sm text-slate-500">Overall performance</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Placement</p>
              <p className="text-2xl font-bold text-orange-600">{analyticsData.tournamentStats.averagePlacement}</p>
              <p className="text-sm text-slate-500">Across tournaments</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Player Distribution by Category</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-slate-700">Senior Players</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{analyticsData.playerStats.categories.senior}</span>
                <span className="text-sm text-slate-500">({Math.round(analyticsData.playerStats.categories.senior/analyticsData.playerStats.totalPlayers*100)}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-slate-700">Junior Players</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{analyticsData.playerStats.categories.junior}</span>
                <span className="text-sm text-slate-500">({Math.round(analyticsData.playerStats.categories.junior/analyticsData.playerStats.totalPlayers*100)}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-slate-700">Veteran Players</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{analyticsData.playerStats.categories.veteran}</span>
                <span className="text-sm text-slate-500">({Math.round(analyticsData.playerStats.categories.veteran/analyticsData.playerStats.totalPlayers*100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Improvement Rate</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-600">+{analyticsData.performanceMetrics.improvementRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Attendance Rate</span>
              <span className="font-semibold text-slate-900">{analyticsData.performanceMetrics.attendanceRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Training Completion</span>
              <span className="font-semibold text-slate-900">{analyticsData.performanceMetrics.trainingCompletion}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Participation Rate</span>
              <span className="font-semibold text-slate-900">{analyticsData.tournamentStats.participationRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Trends</h3>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">Chart visualization would be implemented here</p>
            <p className="text-sm text-slate-400 mt-1">Players, Tournaments, and Wins over time</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performers This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-slate-200 rounded-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">John Doe</h4>
            <p className="text-sm text-slate-500">Most Wins</p>
            <p className="text-lg font-bold text-emerald-600">8 wins</p>
          </div>
          <div className="text-center p-4 border border-slate-200 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Sarah Wilson</h4>
            <p className="text-sm text-slate-500">Most Improved</p>
            <p className="text-lg font-bold text-blue-600">+25 points</p>
          </div>
          <div className="text-center p-4 border border-slate-200 rounded-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Mike Johnson</h4>
            <p className="text-sm text-slate-500">Best Attendance</p>
            <p className="text-lg font-bold text-purple-600">95%</p>
          </div>
        </div>
      </div>
    </div>
  );
}