import React, { useState, useEffect } from 'react';
import { Users, DollarSign, CheckCircle, AlertTriangle, Loader, CreditCard, Eye } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  level: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Registration {
  registration_id: number;
  payment_id: number;
  message: string;
}

interface Payment {
  id: number;
  registration_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export default function TournamentRegistration() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [playerId, setPlayerId] = useState<number>(1);
  const [registrationAmount, setRegistrationAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState<'register'|'status'>('register');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setTournaments(data);
    } catch (e) {
      setMessage({type: 'error', text: 'Failed to load tournaments'});
    }
  };

  const handleRegister = async () => {
    if (!selectedTournament) {
      setMessage({type: 'error', text: 'Please select a tournament'});
      return;
    }
    if (!playerId || playerId <= 0) {
      setMessage({type: 'error', text: 'Please enter a valid player ID'});
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${selectedTournament.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, amount: registrationAmount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setRegistrations([...registrations, data]);
      // Also add to payments for tracking
      setPayments([...payments, { id: data.payment_id, registration_id: data.registration_id, amount: registrationAmount, status: 'pending', created_at: new Date().toISOString() }]);
      setMessage({type: 'success', text: `Registration created! Payment ID: ${data.payment_id}`});
      
      // Reset form
      setPlayerId(1);
      setRegistrationAmount(500);
      setSelectedTournament(null);
    } catch (e: any) {
      setMessage({type: 'error', text: e.message});
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (paymentId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/simulate-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Update payment status
      setPayments(payments.map(p => p.id === paymentId ? {...p, status: 'success'} : p));
      setMessage({type: 'success', text: 'Payment simulated successfully! Registration confirmed.'});
    } catch (e: any) {
      setMessage({type: 'error', text: e.message});
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatus = async (paymentId: number) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}`);
      const data = await res.json();
      if (res.ok) {
        setPayments(payments.map(p => p.id === paymentId ? data : p));
      }
    } catch (e) {
      console.error('Failed to fetch payment status');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'success': return 'bg-green-50 text-green-800 border-green-200';
      case 'failed': return 'bg-red-50 text-red-800 border-red-200';
      case 'initiated': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} />;
      case 'pending': return <AlertTriangle size={20} />;
      case 'failed': return <AlertTriangle size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">Tournament Registration & Payments</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Register for Tournament
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Status ({payments.length})
          </button>
        </div>

        {/* Registration Tab */}
        {activeTab === 'register' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Tournament</label>
              <select
                value={selectedTournament?.id || ''}
                onChange={(e) => {
                  const t = tournaments.find(t => t.id === parseInt(e.target.value));
                  setSelectedTournament(t || null);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">-- Select a tournament --</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.level}) - {t.status}
                  </option>
                ))}
              </select>
              {selectedTournament && (
                <p className="text-sm text-slate-600 mt-2">
                  📅 {selectedTournament.start_date} to {selectedTournament.end_date}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Player ID</label>
                <input
                  type="number"
                  min="1"
                  value={playerId}
                  onChange={(e) => setPlayerId(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Registration Fee (KES)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={registrationAmount}
                  onChange={(e) => setRegistrationAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-700 font-medium">Total Amount Due:</span>
                <span className="text-2xl font-bold text-emerald-600">KES {registrationAmount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600">This fee will be processed via simulated payment gateway for development.</p>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading || !selectedTournament}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Users size={20} />}
              {loading ? 'Registering...' : 'Register & Create Payment'}
            </button>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <p className="mb-2">No payments yet.</p>
                <p className="text-sm">Register for a tournament to create a payment record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className={`border rounded-lg p-4 ${statusColor(payment.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {statusIcon(payment.status)}
                        <div>
                          <p className="font-semibold">Payment #{payment.id}</p>
                          <p className="text-sm">Registration #{payment.registration_id} • KES {payment.amount}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-white bg-opacity-50 rounded text-xs font-semibold uppercase">
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 mb-3">{new Date(payment.created_at).toLocaleString()}</p>
                    
                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSimulatePayment(payment.id)}
                          disabled={loading}
                          className="flex-1 py-2 bg-white bg-opacity-30 hover:bg-opacity-50 disabled:opacity-50 rounded font-medium text-sm transition-all"
                        >
                          {loading ? 'Processing...' : 'Simulate M-Pesa Payment'}
                        </button>
                        <button
                          onClick={() => fetchPaymentStatus(payment.id)}
                          className="px-4 py-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded text-sm transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    )}
                    {payment.status === 'success' && (
                      <p className="text-sm font-semibold">✅ Payment confirmed! Your registration is active.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {payments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm font-medium text-blue-900 mb-2">💡 How it works:</p>
                <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                  <li>Register for a tournament above</li>
                  <li>A payment record is created with "pending" status</li>
                  <li>Click "Simulate M-Pesa Payment" to simulate successful payment</li>
                  <li>Payment status changes to "success" → Registration confirmed</li>
                  <li>You can now be added to the tournament bracket!</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Flow Diagram */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Payment Flow Diagram</h3>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
            <p className="text-sm font-medium">Register</p>
          </div>
          <div className="text-2xl text-slate-400">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
            <p className="text-sm font-medium">Pending</p>
          </div>
          <div className="text-2xl text-slate-400">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
            <p className="text-sm font-medium">Processing</p>
          </div>
          <div className="text-2xl text-slate-400">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
            <p className="text-sm font-medium">Confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
