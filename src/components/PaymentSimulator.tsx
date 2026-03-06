import React, { useState } from 'react';

export default function PaymentSimulator() {
  const [tournamentId, setTournamentId] = useState('1');
  const [playerId, setPlayerId] = useState('');
  const [amount, setAmount] = useState('100');

  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!playerId) return;
    try {
      const resp = await fetch(`/api/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, amount: parseFloat(amount) })
      });
      const data = await resp.json();
      if (resp.ok) {
        setRegistrationId(data.registration_id);
        setPaymentId(data.payment_id);
        setPaymentStatus('pending');
        setMessage('Registration created. Payment is pending.');
      } else {
        setMessage(data.error || 'Failed to register');
      }
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const fetchPayment = async () => {
    if (!paymentId) return;
    const resp = await fetch(`/api/payments/${paymentId}`);
    const data = await resp.json();
    if (resp.ok) {
      setPaymentStatus(data.status);
    }
  };

  const simulateSuccess = async () => {
    if (!paymentId) return;
    const resp = await fetch(`/api/payments/${paymentId}/simulate-success`, { method: 'POST' });
    if (resp.ok) {
      setPaymentStatus('success');
      setMessage('Payment marked as success; registration confirmed');
    } else {
      const data = await resp.json();
      setMessage(data.error || 'Failed to simulate');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold">Registration / Payment Simulator</h2>
      {message && <p className="text-sm text-slate-700">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Tournament ID</label>
          <input
            type="text"
            value={tournamentId}
            onChange={e => setTournamentId(e.target.value)}
            className="mt-1 px-3 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Player ID</label>
          <input
            type="text"
            value={playerId}
            onChange={e => setPlayerId(e.target.value)}
            className="mt-1 px-3 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-1 px-3 py-2 border rounded w-full"
          />
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Create Registration
      </button>

      {registrationId && (
        <div className="mt-4 space-y-2">
          <p>Registration ID: {registrationId}</p>
          <p>Payment ID: {paymentId}</p>
          <p>Status: {paymentStatus}</p>
          <button
            onClick={fetchPayment}
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300 text-sm"
          >Refresh Payment</button>
          {paymentStatus !== 'success' && (
            <button
              onClick={simulateSuccess}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >Simulate Success</button>
          )}
        </div>
      )}
    </div>
  );
}
