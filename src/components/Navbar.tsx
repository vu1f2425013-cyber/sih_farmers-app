import React from 'react';
import {
  Sprout,
  ScanLine,
  Layers,
  MapPin,
  ShieldCheck,
  Building2,
  Microscope,
  Languages,
  User as UserIcon,
  Lightbulb,
  Bell,
  CheckCircle,
  Settings,
  LogOut,
  Database,
  FolderArchive,
} from 'lucide-react';
import { User, UserRole, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentUser?: User | null;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenScanModal: () => void;
  onOpenSettingsModal: () => void;
  onLogout: () => void;
  unreadAlertsCount: number;
  lastSyncTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenScanModal,
  onOpenSettingsModal,
  onLogout,
  unreadAlertsCount,
  lastSyncTime,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => onTabChange('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-[0_12px_20px_rgba(16,185,129,0.2)]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-base lg:text-lg text-stone-900 tracking-tight">
                  {t.appName}
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Actions & User Controls */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Primary Action Button: Scan Crop */}
            <button
              onClick={onOpenScanModal}
              aria-label={t.scan_crop}
              className="inline-flex items-center gap-2 px-2.5 py-2 sm:px-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span className="hidden sm:inline">{t.scan_crop}</span>
            </button>

            {/* Language Selector */}
            <div className="hidden md:flex relative items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिं
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  language === 'mr'
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                मरा
              </button>
            </div>

            <select
              value={language}
              aria-label="Select language"
              onChange={(event) => onLanguageChange(event.target.value as Language)}
              className="md:hidden h-9 max-w-14 rounded-lg border border-stone-200 bg-white px-1 text-xs text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="mr">मरा</option>
            </select>

            {/* User Profile / Role Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-bold text-stone-800 block text-xs leading-none">
                  {currentUser?.name || 'Demo User'}
                </span>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">
                  {currentRole}
                </span>
              </div>

              {/* Role Dropdown */}
              <select
                value={currentRole}
                aria-label="Select User Role"
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-emerald-950 focus:outline-hidden cursor-pointer"
              >
                <option value="farmer">👨‍🌾 {t.role_farmer}</option>
                <option value="extension">🧑‍🔬 {t.role_extension}</option>
                <option value="official">🏛️ {t.role_official}</option>
                <option value="expert">🔬 {t.role_expert}</option>
              </select>
            </div>

            {/* Alert Bell */}
            <button
              onClick={() => onTabChange('alerts')}
              aria-label="View Alerts"
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>

            {/* Account Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              title="Account & Settings"
              className="hidden sm:inline-flex p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="hidden sm:inline-flex p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className={currentRole === 'farmer' ? 'hidden' : 'border-t border-stone-100 bg-stone-50/70 overflow-x-auto scrollbar-none'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {currentRole === 'farmer' && (
              <>
                <button
                  onClick={() => onTabChange('home')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'home'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.crop_health_today}
                </button>
                <button
                  onClick={() => onTabChange('fields')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'fields'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.my_fields}
                </button>
                <button
                  onClick={() => onTabChange('farm_data')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'farm_data'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Farm Data Core</span>
                </button>
                <button
                  onClick={() => onTabChange('memory')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'memory'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.field_health_memory}
                </button>
                <button
                  onClick={() => onTabChange('weather')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'weather'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.weather_conditions}
                </button>
                <button
                  onClick={() => onTabChange('hotspots')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'hotspots'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.hotspots}
                </button>
              </>
            )}

            {currentRole === 'extension' && (
              <>
                <button
                  onClick={() => onTabChange('home')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'home'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Extension Dashboard
                </button>
                <button
                  onClick={() => onTabChange('cases')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'cases'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.cases_queue}
                </button>
                <button
                  onClick={() => onTabChange('hotspots')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'hotspots'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.hotspots}
                </button>
                <button
                  onClick={() => onTabChange('fields')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'fields'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  All Monitored Fields
                </button>
              </>
            )}

            {currentRole === 'official' && (
              <>
                <button
                  onClick={() => onTabChange('home')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'home'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.surveillance}
                </button>
                <button
                  onClick={() => onTabChange('hotspots')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'hotspots'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {t.hotspots}
                </button>
                <button
                  onClick={() => onTabChange('cases')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'cases'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Regional Cases
                </button>
              </>
            )}

            {currentRole === 'expert' && (
              <>
                <button
                  onClick={() => onTabChange('home')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'home'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Referred Cases Queue
                </button>
                <button
                  onClick={() => onTabChange('cases')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'cases'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Lab Validations
                </button>
                <button
                  onClick={() => onTabChange('hotspots')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'hotspots'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  Pathogen Hotspots
                </button>
              </>
            )}

            {/* Innovation Pillar Tab */}
            <button
              onClick={() => onTabChange('innovations')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'innovations'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.why_different}</span>
            </button>
          </nav>

          {/* Sync status */}
          <div className="hidden lg:flex items-center gap-1.5 text-stone-500 text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.last_sync}: {lastSyncTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
