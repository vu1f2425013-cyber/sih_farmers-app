import React, { useState } from 'react';
import { User, Language } from '../types';
import { api } from '../services/api';
import {
  X,
  User as UserIcon,
  Shield,
  Globe,
  Bell,
  LogOut,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'notifications' | 'privacy'>('profile');
  const [name, setName] = useState(user.name);
  const [language, setLanguage] = useState<Language>(user.language || 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const updated = await api.updateOnboarding(user.id, {
        profileData: {
          name,
          language,
        },
      });
      onUpdateUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Account & Settings</h3>
              <p className="text-[11px] text-stone-500">
                Logged in as <span className="font-semibold text-emerald-700">{user.name}</span> ({user.role.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'language' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
            }`}
          >
            Language
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'notifications' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'privacy' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
            }`}
          >
            Privacy
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs min-h-[160px]">
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    disabled
                    value={user.mobile}
                    className="w-full px-3 py-2 border border-stone-200 bg-stone-50 rounded-xl text-stone-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Active Role</label>
                  <input
                    type="text"
                    disabled
                    value={user.role.toUpperCase()}
                    className="w-full px-3 py-2 border border-stone-200 bg-stone-50 rounded-xl text-stone-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Location Jurisdiction</label>
                <input
                  type="text"
                  disabled
                  value={`${user.district || 'Wardha'}, ${user.state || 'Maharashtra'}`}
                  className="w-full px-3 py-2 border border-stone-200 bg-stone-50 rounded-xl text-stone-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-3">
              <span className="font-semibold text-stone-700 block">Preferred Interface Language</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en', label: 'English', desc: 'Standard' },
                  { code: 'hi', label: 'हिंदी', desc: 'Hindi' },
                  { code: 'mr', label: 'मराठी', desc: 'Marathi' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      language === l.code
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <span className="block text-sm font-bold">{l.label}</span>
                    <span className="text-[10px] opacity-70">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <span className="font-semibold text-stone-700 block">SMS & In-App Surveillance Advisories</span>
              <label className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div>
                  <span className="font-bold text-stone-900 block">Local Outbreak & Spore Alerts</span>
                  <span className="text-[11px] text-stone-500">
                    Receive immediate notifications when 3+ farms in your 10km radius confirm pathogen symptoms.
                  </span>
                </div>
              </label>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-2.5 p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Agricultural Data Privacy Policy</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Farmer holdings, yield records, and farm geo-coordinates are strictly private. Outbreak surveillance maps aggregate telemetry at the village / taluka cluster level to protect individual farmer identity.
              </p>
            </div>
          )}
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3.5 py-2 text-red-600 hover:bg-red-50 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-stone-500 hover:text-stone-700 font-semibold cursor-pointer text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer text-xs shadow-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountSettingsModal;
