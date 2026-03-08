import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { safeFetch } from '../utils/mockApi';
import { 
  Trophy, 
  Megaphone,
  Edit2,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function PlayerPortal() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    ranking_points: 0
  });

  useEffect(() => {
    // Mock announcements for demo
    setAnnouncements([
      {
        id: 1,
        title: 'Kenya National Championship 2025 Registrations Open',
        content: 'Registrations for the Kenya National Championship are now open. Deadline: May 31st, 2025.',
        date: new Date().toLocaleDateString(),
        category: 'Tournament'
      },
      {
        id: 2,
        title: 'New Ranking System Implemented',
        content: 'We have updated our ranking system for better accuracy and fairness.',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        category: 'System'
      },
      {
        id: 3,
        title: 'Upcoming Referee Training',
        content: 'Elite refereeing workshop scheduled for April 15-17, 2025.',
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        category: 'Training'
      }
    ]);
  }, []);

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
      const response = await safeFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.user_id,
          full_name: formData.full_name,
          phone: formData.phone,
          profile_data: { photo: profilePhoto }
        })
      });

      if (response.ok) {
        setEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <Trophy className="text-amber-600 mb-2" size={24} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Ranking Points</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,250</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <Megaphone className="text-emerald-600 mb-2" size={24} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Tournaments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
              </div>
            </div>

            {/* Announcements Section */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Megaphone size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h2>
              </div>

              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{announcement.title}</h3>
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                            {announcement.category}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{announcement.content}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.full_name}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.phone || 'Not set'}</p>
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
