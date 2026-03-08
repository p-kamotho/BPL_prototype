import React, { useState, useEffect } from 'react';
import { safeFetch } from '../utils/mockApi';
import { Trophy, Users } from 'lucide-react';

interface BracketMatch {
  id: number;
  round: number;
  match_number: number;
  player1_id: number | null;
  player2_id: number | null;
  player1_name?: string;
  player2_name?: string;
  winner_id?: number | null;
  status: 'pending' | 'completed';
  score1?: number;
  score2?: number;
}

interface BracketData {
  id: number;
  type: 'single_elim' | 'rr_knockout';
  matches: BracketMatch[];
}

export default function TournamentBracketGenerator() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await safeFetch('/api/tournaments');
        const data = await res.json();
        setTournaments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchBracket();
    }
  }, [selectedTournament]);

  const fetchBracket = async () => {
    if (!selectedTournament) return;
    
    setLoading(true);
    try {
      const res = await safeFetch(`/api/tournaments/${selectedTournament}/bracket`);
      if (res.ok) {
        const data = await res.json();
        setBracket(data);
      } else {
        // Bracket doesn't exist, create one
        await generateBracket();
      }
    } catch (error) {
      console.error('Failed to fetch bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBracket = async () => {
    if (!selectedTournament) return;

    setLoading(true);
    try {
      const res = await safeFetch(`/api/tournaments/${selectedTournament}/generate-bracket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'single_elim' })
      });

      if (res.ok) {
        await fetchBracket();
      }
    } catch (error) {
      console.error('Failed to generate bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches = bracket?.matches.reduce((acc: any, match: BracketMatch) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {}) || {};

  const roundNames: Record<number, string> = {
    1: 'Round of 32',
    2: 'Round of 16',
    3: 'Quarterfinals',
    4: 'Semifinals',
    5: 'Finals'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Tournament Brackets</h2>

      {/* Tournament Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Select Tournament
        </label>
        <select
          value={selectedTournament || ''}
          onChange={(e) => setSelectedTournament(Number(e.target.value))}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="">Choose a tournament...</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name} ({tournament.level})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">Loading bracket...</p>
        </div>
      )}

      {bracket && !loading && (
        <div className="overflow-x-auto">
          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([round, matches]: [string, any]) => (
              <div key={round}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {roundNames[Number(round)] || `Round ${round}`}
                </h3>
                <div className="space-y-3">
                  {(matches as BracketMatch[]).map((match) => (
                    <div
                      key={match.id}
                      className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                    >
                      <div className="space-y-2">
                        {/* Player 1 */}
                        <div className={`flex items-center justify-between px-4 py-2 rounded ${
                          match.winner_id === match.player1_id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : 'bg-white dark:bg-slate-800'
                        }`}>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {match.player1_name || 'TBD'}
                          </span>
                          {match.score1 !== undefined && (
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {match.score1}
                            </span>
                          )}
                        </div>

                        {/* Player 2 */}
                        <div className={`flex items-center justify-between px-4 py-2 rounded ${
                          match.winner_id === match.player2_id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : 'bg-white dark:bg-slate-800'
                        }`}>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {match.player2_name || 'TBD'}
                          </span>
                          {match.score2 !== undefined && (
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {match.score2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Status */}
                      {match.status === 'completed' ? (
                        <div className="mt-3 text-center">
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 text-center">
                          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-semibold">
                            Pending
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!bracket && selectedTournament && !loading && (
        <div className="text-center py-8">
          <button
            onClick={generateBracket}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
          >
            {loading ? 'Generating...' : 'Generate Bracket'}
          </button>
        </div>
      )}

      {!selectedTournament && (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          Select a tournament to view or generate brackets
        </div>
      )}
    </div>
  );
}

// Sample Tournament Data Generator for Demo
export function generateSampleTournaments() {
  const singlePlayerTournaments = [
    {
      id: 101,
      name: 'Kenya National Championship 2025 - MS',
      level: 'national',
      format: 'single',
      categories: ['MS'],
      brackets: [
        {
          round: 1,
          name: 'Round of 32',
          participants: 32,
          format: 'single_elim'
        }
      ]
    },
    {
      id: 102,
      name: 'Kenya National Championship 2025 - WS',
      level: 'national',
      format: 'single',
      categories: ['WS'],
      brackets: [
        {
          round: 1,
          name: 'Round of 32',
          participants: 32,
          format: 'single_elim'
        }
      ]
    }
  ];

  const teamTournaments = [
    {
      id: 201,
      name: 'Badminton Campus Series - Central Kenya',
      level: 'regional',
      format: 'team',
      regions: ['Central Kenya'],
      teams: ['University of Nairobi', 'Kenyatta University', 'Moi University', 'Kenya Methodist University', 'Mount Kenya University', 'Murang\'a University of Technology', 'DeKUT'],
      brackets: [
        {
          round: 1,
          name: 'Round Robin',
          format: 'round_robin'
        },
        {
          round: 2,
          name: 'Quarterfinals',
          format: 'single_elim'
        },
        {
          round: 3,
          name: 'Semifinals',
          format: 'single_elim'
        },
        {
          round: 4,
          name: 'Finals',
          format: 'single_elim'
        }
      ]
    },
    {
      id: 202,
      name: 'Battle of Sevens - Nairobi Region',
      level: 'regional',
      format: 'team',
      regions: ['Nairobi'],
      teams: ['Riverside Club', 'Elite Sports', 'Champions Club', 'Victory Club', 'Pinnacle Club', 'Kings Club', 'Warriors Club'],
      brackets: [
        {
          round: 1,
          name: 'Round Robin',
          format: 'round_robin'
        },
        {
          round: 2,
          name: 'Quarterfinals',
          format: 'single_elim'
        },
        {
          round: 3,
          name: 'Semifinals',
          format: 'single_elim'
        },
        {
          round: 4,
          name: 'Finals',
          format: 'single_elim'
        }
      ]
    }
  ];

  return { singlePlayerTournaments, teamTournaments };
}
