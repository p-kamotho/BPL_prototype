import React from 'react';
import { Shield, MapPin, Phone, Mail, Users, Trophy, Calendar } from 'lucide-react';

export default function ClubProfile() {
  // Mock data - in real app, this would come from API based on user's club
  const clubData = {
    name: "Nairobi Badminton Club",
    location: "Nairobi, Kenya",
    founded: "2015",
    members: 45,
    tournaments: 12,
    contact: {
      email: "info@nairobibc.com",
      phone: "+254 700 123 456"
    },
    description: "Premier badminton club in Nairobi, fostering excellence in badminton through training, competitions, and community engagement."
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Club Profile</h1>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Club Info Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{clubData.name}</h2>
              <p className="text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {clubData.location}
              </p>
            </div>
          </div>

          <p className="text-slate-600 mb-6">{clubData.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Founded</p>
                <p className="font-semibold text-slate-900">{clubData.founded}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Members</p>
                <p className="font-semibold text-slate-900">{clubData.members}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Tournaments</p>
                <p className="font-semibold text-slate-900">{clubData.tournaments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{clubData.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{clubData.contact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Manage Players</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Register Tournament</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Schedule Practice</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
            <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">View Compliance</p>
          </button>
        </div>
      </div>
    </div>
  );
}