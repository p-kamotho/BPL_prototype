import React, { useState } from 'react';

interface Match {
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

export default function BracketSimulator() {
  const [tournamentId, setTournamentId] = useState('1');
  const [bracket, setBracket] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const generate = async () => {
    const resp = await fetch(`/api/tournaments/${tournamentId}/generate-bracket`, { method: 'POST' });
    const data = await resp.json();
    if (resp.ok) {
      setMessage('Bracket generated');
      fetchBracket();
    } else {
      setMessage(data.error);
    }
  };

  const fetchBracket = async () => {
    const resp = await fetch(`/api/tournaments/${tournamentId}/bracket`);
    const data = await resp.json();
    if (resp.ok) {
      setBracket(data.bracket);
      setMatches(data.matches);
      setMessage(null);
    } else {
      setMessage(data.error);
    }
  };

  const completeMatch = async (match: Match, winnerId: number) => {
    const resp = await fetch(`/api/bracket-matches/${match.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner_id: winnerId, score1: 21, score2: 18 })
    });
    const data = await resp.json();
    if (resp.ok) {
      fetchBracket();
    } else {
      setMessage(data.error);
    }
  };

  const renderRounds = () => {
    const byRound: Record<number, Match[]> = {};
    matches.forEach(m => {
      byRound[m.round] = byRound[m.round] || [];
      byRound[m.round].push(m);
    });
    const rounds = Object.keys(byRound).map(r => parseInt(r)).sort((a,b)=>a-b);
    return (
      <div className="space-y-6">
        {rounds.map(r => (
          <div key={r} className="">
            <h3 className="font-bold">Round {r}</h3>
            <div className="space-y-2">
              {byRound[r].map(m => (
                <div key={m.id} className="flex items-center gap-4">
                  <span>Match {m.match_number} :</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">
                    {m.player1_id || 'TBD'}
                  </span>
                  vs
                  <span className="px-2 py-1 bg-slate-100 rounded">
                    {m.player2_id || 'TBD'}
                  </span>
                  {m.status === 'pending' && m.player1_id && m.player2_id && (
                    <>
                      <button
                        onClick={() => completeMatch(m, m.player1_id!)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-xs"
                      >
                        {m.player1_id} wins
                      </button>
                      <button
                        onClick={() => completeMatch(m, m.player2_id!)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-xs"
                      >
                        {m.player2_id} wins
                      </button>
                    </>
                  )}
                  {m.status === 'completed' && (
                    <span className="text-green-600 font-bold">Winner: {m.winner_id}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold">Bracket Simulator</h2>
      {message && <p className="text-sm text-slate-700">{message}</p>}
      <div className="flex items-center gap-2">
        <label>Tournament ID:</label>
        <input
          className="px-2 py-1 border rounded w-16"
          value={tournamentId}
          onChange={e => setTournamentId(e.target.value)}
        />
        <button
          onClick={generate}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Generate Bracket
        </button>
        <button
          onClick={fetchBracket}
          className="px-3 py-1 bg-slate-200 rounded text-sm"
        >
          Refresh
        </button>
      </div>
      {bracket && renderRounds()}
    </div>
  );
}
