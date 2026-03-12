import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import ApiClient from '../utils/api';
import { 
  Trophy, 
  Megaphone,
  Edit2,
  Upload,
  AlertCircle,
  Loader
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  category?: string;
}

interface DashboardStats {
  clubs_count: number;
  tournaments_registered: number;
  matches_played: number;
  ranking: {
    position: number | null;
    wins: number;
    losses: number;
  };
}

export default function PlayerPortal() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });

  // Fetch dashboard data and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch notifications
        const notifResponse = await ApiClient.getNotifications();
        if (notifResponse.status === 'success') {
          const notifs = Array.isArray(notifResponse.data) ? notifResponse.data : [];
          setNotifications(notifs.slice(0, 10)); // Limit to 10 recent
        }

        // Fetch dashboard stats
        const dashResponse = await ApiClient.getUserDashboard();
        if (dashResponse.status === 'success') {
          setDashboardStats(dashResponse.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiClient.updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });

      if (response.status === 'success') {
        setEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Announcements */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Player Portal</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Stay updated with the latest news and manage your profile</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-2">
                <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <Trophy className="text-amber-600 mb-2" size={24} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Ranking Position</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats?.ranking?.position || 'N/A'}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <Megaphone className="text-emerald-600 mb-2" size={24} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Tournaments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardStats?.tournaments_registered || 0}
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="text-emerald-600 font-bold text-lg mb-1">{dashboardStats?.ranking?.wins || 0}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Wins</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="text-red-600 font-bold text-lg mb-1">{dashboardStats?.ranking?.losses || 0}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Losses</p>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Megaphone size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>

              {notifications.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No notifications yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            {notification.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Profile</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <Edit2 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {/* Photo Upload */}
                  <div className="mb-6">
                    {profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-2xl object-cover mx-auto"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 hover:opacity-100 transition cursor-pointer">
                          <Upload size={24} className="text-white" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block">
                        <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-auto flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition">
                          <Upload size={24} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {profilePhoto && (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-2xl object-cover mx-auto"
                    />
                  )}
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Name</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.full_name || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white break-all">{user?.email || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.phone || 'Not set'}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Clubs</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{dashboardStats?.clubs_count || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
