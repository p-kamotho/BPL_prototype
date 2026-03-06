import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Pencil, Save, User } from 'lucide-react';

interface UserData {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  profile_data?: Record<string, any>;
}

export default function PlayerProfile() {
  const { user, activeRole } = useAuthStore();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({
    full_name: '',
    phone: '',
    nickname: '',
    dob: '',
    nationality: '',
    picture_url: '',
    social_media: '',
    height: '',
    weight: '',
    primary_position: '',
    secondary_position: '',
    dominant_hand: '',
    jersey_number: '',
    personal_statement: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    allergies: '',
    medications: '',
    insurance_provider: '',
    insurance_policy: '',
    showcase_media: '',
    achievements: '',
    goals: ''
  });
  const [msg, setMsg] = useState<string>('');

  const canEdit = activeRole?.permissions.includes('edit_profile');

  useEffect(() => {
    if (!user) return;
    fetch(`/api/profile?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user);
          const base = { full_name: data.user.full_name, phone: data.user.phone || '' };
          const pd = data.user.profile_data || {};
          setForm({ ...base, ...pd });
        }
      })
      .catch(console.error);
  }, [user]);

  const handleSave = async () => {
    setMsg('');
    try {
      // build profile_data object excluding base fields
      const {
        full_name,
        phone,
        nickname,
        dob,
        nationality,
        picture_url,
        social_media,
        height,
        weight,
        primary_position,
        secondary_position,
        dominant_hand,
        jersey_number,
        personal_statement,
        emergency_contact_name,
        emergency_contact_phone,
        medical_conditions,
        allergies,
        medications,
        insurance_provider,
        insurance_policy,
        showcase_media,
        achievements,
        goals
      } = form;
      const profile_data = {
        nickname,
        dob,
        nationality,
        picture_url,
        social_media,
        height,
        weight,
        primary_position,
        secondary_position,
        dominant_hand,
        jersey_number,
        personal_statement,
        emergency_contact_name,
        emergency_contact_phone,
        medical_conditions,
        allergies,
        medications,
        insurance_provider,
        insurance_policy,
        showcase_media,
        achievements,
        goals
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.user_id, full_name, phone, profile_data })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Profile updated successfully');
        setProfile(prev => prev ? { ...prev, full_name: form.full_name, phone: form.phone, profile_data } : prev);
        setEditing(false);
      } else {
        setMsg(data.error || 'Unable to update');
      }
    } catch (e) {
      console.error(e);
      setMsg('Network error');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        {canEdit && (
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Core Identity & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Core Identity & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{profile.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <p className="mt-1 text-slate-900">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              {editing ? (
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{profile.phone || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Nickname</label>
              {editing ? (
                <input
                  type="text"
                  value={form.nickname}
                  onChange={e => setForm({ ...form, nickname: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.nickname || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
              {editing ? (
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.dob || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Nationality</label>
              {editing ? (
                <input
                  type="text"
                  value={form.nationality}
                  onChange={e => setForm({ ...form, nationality: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.nationality || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Profile Picture URL</label>
              {editing ? (
                <input
                  type="text"
                  value={form.picture_url}
                  onChange={e => setForm({ ...form, picture_url: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                form.picture_url ? <img src={form.picture_url} alt="profile" className="w-24 h-24 rounded-full"/> : <p className="mt-1 text-slate-900">-</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Social Media / Contacts</label>
              {editing ? (
                <input
                  type="text"
                  placeholder="e.g. @instagram, twitter"
                  value={form.social_media}
                  onChange={e => setForm({ ...form, social_media: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.social_media || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Physical & Athletic */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Physical & Athletic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Height</label>
              {editing ? (
                <input
                  type="text"
                  value={form.height}
                  onChange={e => setForm({ ...form, height: e.target.value })}
                  placeholder="e.g. 180 cm"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.height || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Weight</label>
              {editing ? (
                <input
                  type="text"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value })}
                  placeholder="e.g. 75 kg"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.weight || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary Position</label>
              {editing ? (
                <input
                  type="text"
                  value={form.primary_position}
                  onChange={e => setForm({ ...form, primary_position: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.primary_position || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Secondary Position</label>
              {editing ? (
                <input
                  type="text"
                  value={form.secondary_position}
                  onChange={e => setForm({ ...form, secondary_position: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.secondary_position || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Dominant Hand/Foot</label>
              {editing ? (
                <input
                  type="text"
                  value={form.dominant_hand}
                  onChange={e => setForm({ ...form, dominant_hand: e.target.value })}
                  placeholder="e.g. Right-handed"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.dominant_hand || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Jersey Number</label>
              {editing ? (
                <input
                  type="text"
                  value={form.jersey_number}
                  onChange={e => setForm({ ...form, jersey_number: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.jersey_number || '-'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Personal Statement</label>
              {editing ? (
                <textarea
                  value={form.personal_statement}
                  onChange={e => setForm({ ...form, personal_statement: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.personal_statement || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Safety & Medical */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Safety & Medical</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Emergency Contact Name</label>
              {editing ? (
                <input
                  type="text"
                  value={form.emergency_contact_name}
                  onChange={e => setForm({ ...form, emergency_contact_name: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.emergency_contact_name || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Emergency Contact Phone</label>
              {editing ? (
                <input
                  type="text"
                  value={form.emergency_contact_phone}
                  onChange={e => setForm({ ...form, emergency_contact_phone: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.emergency_contact_phone || '-'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Medical Conditions / Allergies / Medications</label>
              {editing ? (
                <textarea
                  value={form.medical_conditions}
                  onChange={e => setForm({ ...form, medical_conditions: e.target.value })}
                  rows={2}
                  placeholder="use commas to separate"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.medical_conditions || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Allergies</label>
              {editing ? (
                <input
                  type="text"
                  value={form.allergies}
                  onChange={e => setForm({ ...form, allergies: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.allergies || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Current Medications</label>
              {editing ? (
                <input
                  type="text"
                  value={form.medications}
                  onChange={e => setForm({ ...form, medications: e.target.value })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.medications || '-'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Insurance Provider / Policy</label>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.insurance_provider}
                    onChange={e => setForm({ ...form, insurance_provider: e.target.value })}
                    placeholder="Provider"
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={form.insurance_policy}
                    onChange={e => setForm({ ...form, insurance_policy: e.target.value })}
                    placeholder="Policy #"
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              ) : (
                <p className="mt-1 text-slate-900">{form.insurance_provider || '-'} {form.insurance_policy ? `/ ${form.insurance_policy}` : ''}</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance & Media */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance & Media</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Showcase Media URLs</label>
              {editing ? (
                <textarea
                  value={form.showcase_media}
                  onChange={e => setForm({ ...form, showcase_media: e.target.value })}
                  rows={2}
                  placeholder="separate with commas"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.showcase_media || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Achievements</label>
              {editing ? (
                <textarea
                  value={form.achievements}
                  onChange={e => setForm({ ...form, achievements: e.target.value })}
                  rows={2}
                  placeholder="Awards, scholarships, GPA, etc."
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.achievements || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Goals</label>
              {editing ? (
                <textarea
                  value={form.goals}
                  onChange={e => setForm({ ...form, goals: e.target.value })}
                  rows={2}
                  placeholder="Season-long improvement goals"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ) : (
                <p className="mt-1 text-slate-900">{form.goals || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
        {msg && <p className="mt-4 text-sm text-emerald-600">{msg}</p>}
      </div>
    </div>
  );
}