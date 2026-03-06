import React, { useState } from 'react';
import { TrendingUp, Trophy, Target, Filter } from 'lucide-react';

export default function PlayerRankings() {
  const [selectedDivision, setSelectedDivision] = useState('all');

  const divisions = ['all', "Men's Singles", "Women's Singles", "Mixed Doubles", "Men's Doubles", "Women's Doubles"];

  const rankings = [
    { rank: 1, name: 'John Doe', division: "Men's Singles", points: 4850, wins: 28, losses: 5, winRate: '84.8%', ratingChange: '+120' },
    { rank: 2, name: 'Moses Kipchoge', division: "Men's Singles", points: 4620, wins: 26, losses: 8, winRate: '76.5%', ratingChange: '+85' },
    { rank: 3, name: 'Rachel Karori', division: "Men's Singles", points: 4310, wins: 24, losses: 10, winRate: '70.6%', ratingChange: '+150' },
    { rank: 4, name: 'Jane Smith', division: "Women's Singles", points: 4150, wins: 22, losses: 9, winRate: '71.0%', ratingChange: '-40' },
    { rank: 5, name: 'Sarah Wilson', division: "Women's Singles", points: 3980, wins: 20, losses: 12, winRate: '62.5%', ratingChange: '+200' },
    { rank: 6, name: 'Peter Mwangi', division: "Mixed Doubles", points: 3890, wins: 19, losses: 13, winRate: '59.4%', ratingChange: '+75' },
  ];

  const filteredRankings = selectedDivision === 'all' 
    ? rankings 
    : rankings.filter(r => r.division === selectedDivision);

  const topPlayers = rankings.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Rankings</h1>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPlayers.map((player, idx) => {
          const podiumColors = ['gold', 'silver', '#CD7F32'];
          const medalIcons = ['🥇', '🥈', '🥉'];
          
          return (
            <div key={player.rank} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-center">
                <div className="text-3xl mb-2">{medalIcons[idx]}</div>
                <h3 className="font-bold text-lg text-slate-900">{player.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{player.division}</p>
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-500 mb-1">Rating Points</p>
                  <p className="text-2xl font-bold text-slate-900">{player.points.toLocaleString()}</p>
                </div>
                <div className={`text-sm font-semibold ${player.ratingChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {player.ratingChange} this month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Top Scorer</p>
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">John Doe</p>
          <p className="text-xs text-slate-500">4,850 points</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Most Improved</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">Sarah Wilson</p>
          <p className="text-xs text-slate-500">+200 points this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Your Rank</p>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">#1</p>
          <p className="text-xs text-slate-500">Men's Singles</p>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-600" />
        <span className="text-sm text-slate-600">Division:</span>
        {divisions.map(division => (
          <button
            key={division}
            onClick={() => setSelectedDivision(division)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
              selectedDivision === division 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {division}
          </button>
        ))}
      </div>

      {/* Rankings Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Player</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Division</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Points</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">W-L</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Win Rate</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((player, idx) => (
                <tr key={player.rank} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{player.rank}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{player.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{player.division}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{player.points.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{player.wins}-{player.losses}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 text-center">{player.winRate}</td>
                  <td className={`px-6 py-4 text-sm font-semibold text-center ${player.ratingChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {player.ratingChange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
