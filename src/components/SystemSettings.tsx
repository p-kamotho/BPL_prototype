import React, { useState } from 'react';
import { 
  Settings, 
  TrendingUp, 
  ShieldAlert, 
  Bell, 
  Save, 
  Lock, 
  Globe, 
  Mail,
  Clock,
  CheckCircle2,
  Wrench,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('platform');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [settings, setSettings] = useState({
    platformName: 'Badminton Kenya OS',
    supportEmail: 'support@badmintonkenya.org',
    scoreLockWindow: 30,
    timezone: 'Africa/Nairobi',
    minRankingMatches: 10,
    rankingDecayFactor: 0.95,
    suspensionDays: 7,
    appealWindow: 14,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maintenanceMessage: 'System under maintenance'
  });

  const handleInputChange = (field: string, value: any) => {
    setSettings({...settings, [field]: value});
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setMessage({type: 'success', text: 'System settings saved successfully!'});
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'platform', label: 'Platform Settings', icon: Globe },
    { id: 'ranking', label: 'Ranking Algorithm', icon: TrendingUp },
    { id: 'sanctions', label: 'Sanction Rules', icon: ShieldAlert },
    { id: 'notifications', label: 'Notification Rules', icon: Bell },
    { id: 'maintenance', label: 'Maintenance Mode', icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
          <p className="text-slate-500">Manage global platform settings and business logic</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 border rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="text-sm font-semibold">{message.text}</span>
        </motion.div>
      )}

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700"
        >
          <CheckCircle2 size={20} />
          <span className="text-sm font-semibold">System settings updated successfully!</span>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {activeTab === 'platform' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">General Platform Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Platform Name</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          value={settings.platformName}
                          onChange={(e) => handleInputChange('platformName', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Support Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input 
                          type="email" 
                          value={settings.supportEmail}
                          onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Operational Constraints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Score Lock Window (Minutes)</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input 
                          type="number" 
                          value={settings.scoreLockWindow}
                          onChange={(e) => handleInputChange('scoreLockWindow', parseInt(e.target.value))}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1">Time allowed for referees to edit scores after submission.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Default Timezone</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <select value={settings.timezone} onChange={(e) => handleInputChange('timezone', e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all appearance-none">
                          <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ranking' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Ranking Point Multipliers</h3>
                  <div className="space-y-4">
                    {[
                      { level: 'National Level', multiplier: '1.0', color: 'text-emerald-600' },
                      { level: 'County Level', multiplier: '0.6', color: 'text-blue-600' },
                      { level: 'Club Level', multiplier: '0.3', color: 'text-slate-600' },
                      { level: 'Invitational', multiplier: '0.4', color: 'text-indigo-600' },
                    ].map((item) => (
                      <div key={item.level} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="font-semibold text-slate-700">{item.level}</span>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-bold ${item.color}`}>x{item.multiplier}</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="2" 
                            step="0.1" 
                            defaultValue={item.multiplier}
                            className="w-32 accent-emerald-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Win/Loss Base Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Base Win Points</label>
                      <input 
                        type="number" 
                        defaultValue="100"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Participation Points</label>
                      <input 
                        type="number" 
                        defaultValue="10"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sanctions' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Tournament Sanction Rules</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Auto-Sanction Club Level</p>
                        <p className="text-xs text-slate-500">Automatically approve club-level tournaments if criteria met.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Require Federation Review for County+</p>
                        <p className="text-xs text-slate-500">All county and national events must be manually reviewed.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Compliance Thresholds</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min. Certified Referees per Court</label>
                      <input 
                        type="number" 
                        defaultValue="1"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Global Notification Rules</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Push Notifications for Results</p>
                        <p className="text-xs text-slate-500">Send instant updates to players when matches conclude.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Email Digest Frequency</p>
                        <p className="text-xs text-slate-500">How often to send activity summaries to users.</p>
                      </div>
                      <select className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Escalation Rules</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <p className="text-sm font-semibold text-amber-800">Unresolved Match Dispute</p>
                      <p className="text-xs text-amber-600 mt-1">Notify Federation Admin if a match remains in 'disputed' status for more than 24 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Maintenance Mode Control</h3>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Enable Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Redirect all non-admin users to a maintenance page.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Custom Maintenance Banner</label>
                      <textarea 
                        value={settings.maintenanceMessage}
                        onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                        placeholder="e.g. We are performing scheduled maintenance. We'll be back at 2 PM EAT."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Module Locking</h3>
                  <p className="text-sm text-slate-500 mb-4">Selectively disable specific modules without full platform maintenance.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Tournament Registration', 'Match Scoring', 'Financial Payments', 'User Onboarding'].map((module) => (
                      <div key={module} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <span className="text-sm font-medium text-slate-700">{module}</span>
                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
