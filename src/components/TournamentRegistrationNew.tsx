import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { safeFetch } from '../utils/mockApi';
import { Trophy, Users, DollarSign, AlertCircle, Check } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  level: string;
  start_date: string;
  end_date: string;
  status: string;
  type?: 'friendly' | 'paid';
  format?: 'single' | 'team';
  entry_fee?: number;
  categories?: string[];
}

export default function TournamentRegistration() {
  const { user, activeRole } = useAuthStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registrationStep, setRegistrationStep] = useState<'list' | 'details' | 'payment' | 'success'>('list');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await safeFetch('/api/tournaments');
        const data = await res.json();
        // Mock tournament types for demo
        const enhancedTournaments = (Array.isArray(data) ? data : []).map((t: any, idx: number) => ({
          ...t,
          type: idx % 2 === 0 ? 'friendly' : 'paid',
          format: idx % 3 === 0 ? 'team' : 'single',
          entry_fee: idx % 2 === 0 ? 0 : 1000,
          categories: ['MS', 'WS', 'MD', 'WD', 'XD']
        }));
        setTournaments(enhancedTournaments);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRegistrationStep('details');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRegisterClick = async () => {
    const isTeamEvent = selectedTournament?.format === 'team';
    const isPaidEvent = selectedTournament?.type === 'paid';

    if (isTeamEvent && activeRole?.role_name !== 'club_manager') {
      alert('Only Club Managers can register teams for tournaments');
      return;
    }

    if (isPaidEvent) {
      // Proceed to payment
      setRegistrationData({
        tournament_id: selectedTournament?.id,
        category: selectedCategory,
        format: selectedTournament?.format,
        amount: selectedTournament?.entry_fee
      });
      setRegistrationStep('payment');
    } else {
      // Friendly tournament - no payment needed
      handleConfirmRegistration();
    }
  };

  const handleConfirmRegistration = async () => {
    try {
      const response = await safeFetch(`/api/tournaments/${selectedTournament?.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: user?.user_id,
          category: selectedCategory
        })
      });

      if (response.ok) {
        setRegistrationStep('success');
        setTimeout(() => {
          setRegistrationStep('list');
          setSelectedTournament(null);
          setSelectedCategory('');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handlePayment = async () => {
    // Mock payment process
    handleConfirmRegistration();
  };

  // List View
  if (registrationStep === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournament Registration</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Browse and register for upcoming tournaments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div 
                key={tournament.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleTournamentSelect(tournament)}
              >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white">
                  <h3 className="text-xl font-bold">{tournament.name}</h3>
                  <p className="text-emerald-100 text-sm mt-2">{tournament.level}</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {tournament.status}
                    </span>
                  </div>

                  {tournament.format === 'team' ? (
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Team Event</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Individual Event</span>
                    </div>
                  )}

                  {tournament.type === 'paid' && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        KES {tournament.entry_fee}
                      </span>
                    </div>
                  )}

                  {tournament.type === 'friendly' && (
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold inline-block">
                      Free Entry
                    </div>
                  )}

                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Details View
  if (registrationStep === 'details' && selectedTournament) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setRegistrationStep('list')}
            className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedTournament.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Select your category</p>

            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Available Categories</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedTournament.categories?.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament Info */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-8 space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Dates</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedTournament.start_date} to {selectedTournament.end_date}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Format</p>
                <p className="font-semibold text-slate-900 dark:text-white capitalize">
                  {selectedTournament.format === 'team' ? 'Team Event' : 'Individual Event'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Entry Fee</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedTournament.type === 'friendly' ? 'Free' : `KES ${selectedTournament.entry_fee}`}
                </p>
              </div>
            </div>

            {selectedTournament.format === 'team' && activeRole?.role_name !== 'club_manager' && (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-300">Team Event</p>
                  <p className="text-sm text-amber-800 dark:text-amber-400">Only Club Managers can register teams. Please contact your club manager.</p>
                </div>
              </div>
            )}

            <button
              onClick={handleRegisterClick}
              disabled={!selectedCategory || (selectedTournament.format === 'team' && activeRole?.role_name !== 'club_manager')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
            >
              {selectedTournament.type === 'paid' && selectedTournament.format === 'team' && activeRole?.role_name === 'club_manager'
                ? `Proceed to Payment - KES ${selectedTournament.entry_fee}`
                : selectedTournament.type === 'paid'
                ? `Proceed to Payment - KES ${selectedTournament.entry_fee}`
                : 'Confirm Registration'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment View
  if (registrationStep === 'payment' && registrationData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Complete your tournament registration</p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-6 space-y-3">
              <div className="flex justify-between">
                <p className="text-slate-600 dark:text-slate-400">Tournament</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedTournament?.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-slate-600 dark:text-slate-400">Category</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedCategory}</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-3 flex justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">Total</p>
                <p className="text-xl font-bold text-emerald-600">KES {registrationData.amount}</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success View
  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration Successful!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You have successfully registered for {selectedTournament?.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Redirecting to tournament page...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
