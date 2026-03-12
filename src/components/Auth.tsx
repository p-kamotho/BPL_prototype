import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Trophy, LogIn, UserPlus, AlertCircle, Loader } from 'lucide-react';
import ApiClient from '../utils/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('player');
  const [phone, setPhone] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubLocation, setClubLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await ApiClient.login(email, password);
        
        if (response.status === 'success' && response.data) {
          setUser(response.data.user || response.data);
          setSuccess('Login successful!');
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        // Register
        const response = await ApiClient.register(email, password, fullName, phone, role);
        
        if (response.status === 'success') {
          setSuccess('Registration successful! You can now log in.');
          setIsLogin(true);
          // Clear form
          setEmail('');
          setPassword('');
          setFullName('');
          setPhone('');
        } else {
          setError(response.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(`Error: ${err.message || 'Failed to process request'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 text-center bg-emerald-600 text-white">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm">
            <Trophy size={28} className="sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Badminton Kenya OS</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">The official tournament management platform</p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm">
              <AlertCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Role to Apply For</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                  >
                    <option value="player">Player</option>
                    <option value="referee">Referee</option>
                    <option value="club_manager">Club Manager</option>
                    <option value="coach">Coach</option>
                  </select>
                </div>
                {role === 'club_manager' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Club Name</label>
                      <input
                        type="text"
                        required
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                        placeholder="Your Club Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Club Location</label>
                      <input
                        type="text"
                        required
                        value={clubLocation}
                        onChange={(e) => setClubLocation(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                        placeholder="City/County"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                    placeholder="+254..."
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-600 font-semibold mb-2">📝 Demo Credentials:</p>
              <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs text-slate-700">
                <div>
                  <span className="font-semibold">Email:</span> admin@badminton.ke
                </div>
                <div>
                  <span className="font-semibold">Password:</span> admin123
                </div>
                <div className="mt-2 text-slate-600 italic">
                  Or create a new account with any email to register as a player
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
