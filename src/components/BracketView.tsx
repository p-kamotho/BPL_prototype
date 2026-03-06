import React, { useState, useEffect } from 'react';
import { Trophy, ChevronDown, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

interface BracketMatch {
  id: number;
  bracket_id: number;
  round: number;
  match_number: number;
  player1_id: number | null;
  player2_id: number | null;
  winner_id: number | null;
  status: string;
  score1: number;
  score2: number;
}

interface Bracket {
  id: number;
  tournament_id: number;
  type: string;
  created_at: string;
}

interface BracketData {
  bracket: Bracket;
  matches: BracketMatch[];
}

interface Props {
  tournamentId?: number;
}

export default function BracketView({ tournamentId = 1 }: Props) {
  const [bracketData, setBracketData] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [expandedRound, setExpandedRound] = useState<number | null>(1);
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    fetchBracket();
  }, [tournamentId]);

  const fetchBracket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/bracket`);
      if (res.status === 404) {
        setMessage({type: 'error', text: 'No bracket generated yet. Close registrations and generate bracket first.'});
        setBracketData(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBracketData(data);
    } catch (e: any) {
      setMessage({type: 'error', text: e.message});
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMatch = async () => {
    if (!selectedMatch || !winner) {
      setMessage({type: 'error', text: 'Please select a winner'});
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/bracket-matches/${selectedMatch.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner_id: winner, score1, score2 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Refresh bracket
      await fetchBracket();
      setMessage({type: 'success', text: 'Match result recorded! Winner moved to next round.'});
      setSelectedMatch(null);
      setWinner(null);
      setScore1(0);
      setScore2(0);
    } catch (e: any) {
      setMessage({type: 'error', text: e.message});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (!bracketData) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
        <Trophy size={48} className="mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600 font-medium mb-2">No Bracket Generated</p>
        <p className="text-sm text-slate-500">
          Bracket will be automatically created when tournament registrations close.
        </p>
      </div>
    );
  }

  const rounds = [...new Set(bracketData.matches.map(m => m.round))].sort((a: number, b: number) => a - b);
  const finalRound = Math.max(...(rounds as number[]));

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-amber-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tournament Bracket</h2>
            <p className="text-sm text-slate-600">Type: {bracketData.bracket.type}</p>
          </div>
        </div>

        {/* Bracket Display */}
        <div className="space-y-4">
          {rounds.map((round) => {
            const roundMatches = bracketData.matches.filter(m => m.round === round);
            const roundName = round === finalRound ? 'Final' : round === finalRound - 1 ? 'Semi-Final' : `Round ${round}`;

            return (
              <div key={round} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedRound(expandedRound === round ? null : round)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-slate-900">{roundName}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${expandedRound === round ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedRound === round && (
                  <div className="divide-y divide-slate-100 p-4 space-y-4">
                    {roundMatches.map((match) => {
                      const isCompleted = match.status === 'completed';
                      const isPending = match.status === 'pending';

                      return (
                        <div
                          key={match.id}
                          onClick={() => {
                            if (isPending) {
                              setSelectedMatch(match);
                              setWinner(match.player1_id || null);
                              setScore1(match.score1);
                              setScore2(match.score2);
                            }
                          }}
                          className={`rounded-lg p-4 border-2 transition-all cursor-pointer ${
                            selectedMatch?.id === match.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : isPending
                              ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                              : 'border-green-300 bg-green-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-white rounded">
                              Match {match.match_number}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
                              isCompleted
                                ? 'bg-green-200 text-green-800'
                                : isPending
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}>
                              {isCompleted ? '✓ Completed' : 'Pending'}
                            </span>
                          </div>

                          {/* Player 1 */}
                          <div className={`flex items-center mb-2 p-2 rounded ${
                            match.winner_id === match.player1_id ? 'bg-yellow-100' : ''
                          }`}>
                            <span className="flex-1">
                              {match.player1_id ? `Player ${match.player1_id}` : '-- TBD --'}
                            </span>
                            {isCompleted && (
                              <span className="font-bold text-lg">{match.score1}</span>
                            )}
                          </div>

                          {/* Player 2 */}
                          <div className={`flex items-center p-2 rounded ${
                            match.winner_id === match.player2_id ? 'bg-yellow-100' : ''
                          }`}>
                            <span className="flex-1">
                              {match.player2_id ? `Player ${match.player2_id}` : '-- TBD --'}
                            </span>
                            {isCompleted && (
                              <span className="font-bold text-lg">{match.score2}</span>
                            )}
                          </div>

                          {isCompleted && match.winner_id && (
                            <div className="mt-2 text-sm font-semibold text-green-700 flex items-center gap-1">
                              🏆 Winner: Player {match.winner_id}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Detail Editor */}
      {selectedMatch && selectedMatch.status === 'pending' && (
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Record Match Result</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Winner</label>
              <div className="space-y-2">
                {selectedMatch.player1_id && (
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="winner"
                      value={selectedMatch.player1_id}
                      checked={winner === selectedMatch.player1_id}
                      onChange={(e) => setWinner(parseInt(e.target.value))}
                      className="mr-3"
                    />
                    <span className="font-medium">Player {selectedMatch.player1_id}</span>
                  </label>
                )}
                {selectedMatch.player2_id && (
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="winner"
                      value={selectedMatch.player2_id}
                      checked={winner === selectedMatch.player2_id}
                      onChange={(e) => setWinner(parseInt(e.target.value))}
                      className="mr-3"
                    />
                    <span className="font-medium">Player {selectedMatch.player2_id}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Score - Player {selectedMatch.player1_id}
                </label>
                <input
                  type="number"
                  min="0"
                  max="21"
                  value={score1}
                  onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Score - Player {selectedMatch.player2_id}
                </label>
                <input
                  type="number"
                  min="0"
                  max="21"
                  value={score2}
                  onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCompleteMatch}
                disabled={loading || !winner}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <Trophy size={20} />}
                {loading ? 'Recording...' : 'Record Match Result'}
              </button>
              <button
                onClick={() => {
                  setSelectedMatch(null);
                  setWinner(null);
                  setScore1(0);
                  setScore2(0);
                }}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bracket Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
        <p className="text-sm font-medium text-amber-900">
          📊 Total Matches: {bracketData.matches.length} • Completed: {bracketData.matches.filter(m => m.status === 'completed').length}
        </p>
      </div>
    </div>
  );
}
