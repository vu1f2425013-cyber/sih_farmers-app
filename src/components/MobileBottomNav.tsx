import React, { useState } from 'react';
import {
  Home,
  MapPin,
  ScanLine,
  Sparkles,
  Menu,
  X,
  Droplets,
  CloudSun,
  TrendingUp,
  HelpCircle,
  Bell,
  Settings,
  Lightbulb,
  Database,
  History,
  FolderArchive,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenScanModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDownloadZipModal: () => void;
  language: Language;
  unreadAlertsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenScanModal,
  onOpenSettingsModal,
  onOpenDownloadZipModal,
  language,
  unreadAlertsCount,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSelectTab = (tab: string) => {
    setIsMoreOpen(false);
    onTabChange(tab);
  };

  // Language-aware labels for bottom bar
  const nav = {
    home: language === 'mr' ? 'मुख्यपृष्ठ' : language === 'hi' ? 'होम' : 'Home',
    fields: language === 'mr' ? 'शेते' : language === 'hi' ? 'खेत' : 'Fields',
    scan: language === 'mr' ? 'स्कॅन' : language === 'hi' ? 'स्कैन' : 'Scan',
    advisor: language === 'mr' ? 'सल्ला' : language === 'hi' ? 'सलाह' : 'Advisor',
    more: language === 'mr' ? 'अधिक' : language === 'hi' ? 'और' : 'More',
  };

  return (
    <>
      {/* Fixed Mobile Bottom Navigation Bar — taller, easier to tap */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t-2 border-stone-200 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-5 h-20 items-center px-2 max-w-md mx-auto">

          {/* 1. Home */}
          <button
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer transition-colors rounded-2xl mx-0.5 ${
              activeTab === 'home' && !isMoreOpen ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {activeTab === 'home' && !isMoreOpen ? (
              <span className="text-2xl">🏠</span>
            ) : (
              <Home className="w-6 h-6" />
            )}
            <span className={`text-[11px] font-bold leading-none ${activeTab === 'home' && !isMoreOpen ? 'text-emerald-800' : ''}`}>
              {nav.home}
            </span>
          </button>

          {/* 2. Fields */}
          <button
            onClick={() => handleSelectTab('fields')}
            className={`flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer transition-colors rounded-2xl mx-0.5 ${
              activeTab === 'fields' && !isMoreOpen ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {activeTab === 'fields' && !isMoreOpen ? (
              <span className="text-2xl">🗺️</span>
            ) : (
              <MapPin className="w-6 h-6" />
            )}
            <span className={`text-[11px] font-bold leading-none ${activeTab === 'fields' && !isMoreOpen ? 'text-emerald-800' : ''}`}>
              {nav.fields}
            </span>
          </button>

          {/* 3. SCAN — Big central camera button */}
          <button
            onClick={() => {
              setIsMoreOpen(false);
              onOpenScanModal();
            }}
            className="flex flex-col items-center justify-center h-full cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white flex items-center justify-center shadow-xl group-active:scale-90 transition-all -mt-6 border-4 border-white">
              <span className="text-3xl">📷</span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-900 mt-1 leading-none">{nav.scan}</span>
          </button>

          {/* 4. Advisor */}
          <button
            onClick={() => handleSelectTab('advisor')}
            className={`flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer transition-colors rounded-2xl mx-0.5 ${
              activeTab === 'advisor' && !isMoreOpen ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {activeTab === 'advisor' && !isMoreOpen ? (
              <span className="text-2xl">🧑‍🔬</span>
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            <span className={`text-[11px] font-bold leading-none ${activeTab === 'advisor' && !isMoreOpen ? 'text-emerald-800' : ''}`}>
              {nav.advisor}
            </span>
          </button>

          {/* 5. More */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer transition-colors rounded-2xl mx-0.5 ${
              isMoreOpen ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {isMoreOpen ? (
              <X className="w-6 h-6 text-emerald-700" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            <span className={`text-[11px] font-bold leading-none ${isMoreOpen ? 'text-emerald-800' : ''}`}>
              {nav.more}
            </span>
          </button>
        </div>
      </div>

      {/* Slide-up Bottom Sheet Drawer for "More" — farmer-friendly large grid */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex flex-col justify-end md:hidden"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto border-t-2 border-stone-200 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-stone-200" />
            </div>

            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xl">
                    {language === 'mr' ? 'सर्व सेवा' : language === 'hi' ? 'सभी सेवाएं' : 'All Services'}
                  </h3>
                  <p className="text-sm text-stone-400 font-medium mt-0.5">
                    {language === 'mr' ? 'शेतकऱ्यांचा मित्र' : language === 'hi' ? 'किसान का दोस्त' : "Farmer's Friend"}
                  </p>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MY FARM GROUP */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                  {language === 'mr' ? '🌾 माझे शेत' : language === 'hi' ? '🌾 मेरा खेत' : '🌾 My Farm'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectTab('memory')}
                    className="p-4 bg-stone-50 hover:bg-emerald-50 rounded-2xl border-2 border-stone-200 hover:border-emerald-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">📋</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'शेत इतिहास' : language === 'hi' ? 'खेत इतिहास' : 'Farm History'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('farm_data')}
                    className="p-4 bg-stone-50 hover:bg-emerald-50 rounded-2xl border-2 border-stone-200 hover:border-emerald-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">📊</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'शेत माहिती' : language === 'hi' ? 'खेत जानकारी' : 'Farm Data'}
                    </span>
                  </button>
                </div>
              </div>

              {/* CONDITIONS & SERVICES GROUP */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                  {language === 'mr' ? '🌦️ सेवा' : language === 'hi' ? '🌦️ सेवाएं' : '🌦️ Services'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectTab('weather')}
                    className="p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl border-2 border-amber-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">⛅</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'हवामान' : language === 'hi' ? 'मौसम' : 'Weather Risk'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('water')}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border-2 border-blue-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">💧</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'सिंचन सल्ला' : language === 'hi' ? 'सिंचाई सलाह' : 'Water Advisor'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('market')}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-2xl border-2 border-green-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">📈</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'मंडी भाव' : language === 'hi' ? 'मंडी भाव' : 'Market Prices'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('hotspots')}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl border-2 border-purple-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">🗺️</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'रोगाचे नकाशे' : language === 'hi' ? 'बीमारी नक्शा' : 'Hotspot Map'}
                    </span>
                  </button>
                </div>
              </div>

              {/* SUPPORT & APPLICATION */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                  {language === 'mr' ? '🤝 मदत' : language === 'hi' ? '🤝 मदद' : '🤝 Support'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectTab('help')}
                    className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border-2 border-emerald-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">👨‍🌾</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'तज्ञ कनेक्ट' : language === 'hi' ? 'विशेषज्ञ' : 'Expert Connect'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('alerts')}
                    className="p-4 bg-red-50 hover:bg-red-100 rounded-2xl border-2 border-red-200 flex flex-col gap-2 text-left cursor-pointer transition-colors relative"
                  >
                    <span className="text-3xl">🔔</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'सूचना' : language === 'hi' ? 'सूचनाएं' : 'Alerts'}
                    </span>
                    {unreadAlertsCount > 0 && (
                      <span className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center">
                        {unreadAlertsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelectTab('innovations')}
                    className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-2xl border-2 border-yellow-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">💡</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'नवकल्पना' : language === 'hi' ? 'नवाचार' : 'Innovations'}
                    </span>
                  </button>
                  <button
                    onClick={() => { setIsMoreOpen(false); onOpenSettingsModal(); }}
                    className="p-4 bg-stone-100 hover:bg-stone-200 rounded-2xl border-2 border-stone-200 flex flex-col gap-2 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-3xl">⚙️</span>
                    <span className="font-extrabold text-stone-900 text-sm leading-tight">
                      {language === 'mr' ? 'सेटिंग्ज' : language === 'hi' ? 'सेटिंग' : 'Settings'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Download Source CTA */}
              <button
                onClick={() => { setIsMoreOpen(false); onOpenDownloadZipModal(); }}
                className="w-full py-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 rounded-2xl font-extrabold flex items-center justify-center gap-3 cursor-pointer transition-colors"
              >
                <FolderArchive className="w-5 h-5 text-amber-700" />
                <span>{language === 'mr' ? 'स्त्रोत डाउनलोड (.ZIP) — 154 KB' : language === 'hi' ? 'सोर्स डाउनलोड (.ZIP) — 154 KB' : 'Download Codebase (.ZIP) — 154 KB'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
