import React from 'react';
import {
  Home,
  MapPin,
  ScanLine,
  Sparkles,
  CloudSun,
  Droplets,
  TrendingUp,
  HelpCircle,
  Bell,
  Settings,
  Lightbulb,
  Database,
  History,
  FolderArchive,
  Sprout,
  LucideIcon,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FarmerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenScanModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDownloadZipModal: () => void;
  language: Language;
  unreadAlertsCount: number;
}

interface NavItem {
  id: string;
  label: string;
  subLabel?: string;   // native language sub-label
  emoji?: string;
  icon: LucideIcon;
  isAction?: boolean;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const FarmerSidebar: React.FC<FarmerSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenScanModal,
  onOpenSettingsModal,
  onOpenDownloadZipModal,
  language,
  unreadAlertsCount,
}) => {
  const t = TRANSLATIONS[language];

  const sub = (mr: string, hi: string) =>
    language === 'mr' ? mr : language === 'hi' ? hi : '';

  const navGroups: NavGroup[] = [
    {
      group: language === 'mr' ? '🌾 माझे शेत' : language === 'hi' ? '🌾 मेरा खेत' : '🌾 MY FARM',
      items: [
        {
          id: 'home',
          label: language === 'mr' ? 'मुख्यपृष्ठ' : language === 'hi' ? 'होम' : 'Home',
          subLabel: sub('आजचे आरोग्य', 'आज की सेहत'),
          emoji: '🏠',
          icon: Home,
        },
        {
          id: 'fields',
          label: language === 'mr' ? 'माझी शेते' : language === 'hi' ? 'मेरे खेत' : 'My Fields',
          subLabel: sub('शेत यादी', 'खेत सूची'),
          emoji: '🗺️',
          icon: MapPin,
        },
        {
          id: 'memory',
          label: language === 'mr' ? 'शेत इतिहास' : language === 'hi' ? 'खेत इतिहास' : 'Farm History',
          subLabel: sub('जुन्या नोंदी', 'पुराने रिकॉर्ड'),
          emoji: '📋',
          icon: History,
        },
        {
          id: 'farm_data',
          label: language === 'mr' ? 'शेत माहिती' : language === 'hi' ? 'खेत जानकारी' : 'Farm Data',
          subLabel: sub('डेटा केंद्र', 'डेटा केंद्र'),
          emoji: '📊',
          icon: Database,
        },
      ],
    },
    {
      group: language === 'mr' ? '🤖 पीक बुद्धिमत्ता' : language === 'hi' ? '🤖 फसल AI' : '🤖 CROP AI',
      items: [
        {
          id: 'scan',
          label: language === 'mr' ? 'पीक स्कॅन करा' : language === 'hi' ? 'फसल स्कैन करें' : 'Scan Crop',
          subLabel: sub('फोटो घ्या', 'फोटो लें'),
          emoji: '📷',
          icon: ScanLine,
          isAction: true,
        },
        {
          id: 'advisor',
          label: language === 'mr' ? 'सल्लागार' : language === 'hi' ? 'सलाहकार' : 'Advisor & IPM',
          subLabel: sub('कीड व्यवस्थापन', 'कीट प्रबंधन'),
          emoji: '🧑‍🔬',
          icon: Sparkles,
        },
      ],
    },
    {
      group: language === 'mr' ? '🌦️ हवामान व पाणी' : language === 'hi' ? '🌦️ मौसम व पानी' : '🌦️ CONDITIONS',
      items: [
        {
          id: 'weather',
          label: language === 'mr' ? 'हवामान' : language === 'hi' ? 'मौसम' : 'Weather & Risk',
          subLabel: sub('जोखीम अंदाज', 'जोखिम अनुमान'),
          emoji: '⛅',
          icon: CloudSun,
        },
        {
          id: 'water',
          label: language === 'mr' ? 'सिंचन सल्ला' : language === 'hi' ? 'सिंचाई सलाह' : 'Water Advisor',
          subLabel: sub('पाणी वेळापत्रक', 'पानी शेड्यूल'),
          emoji: '💧',
          icon: Droplets,
        },
      ],
    },
    {
      group: language === 'mr' ? '💰 बाजार' : language === 'hi' ? '💰 बाजार' : '💰 MARKET',
      items: [
        {
          id: 'market',
          label: language === 'mr' ? 'मंडी भाव' : language === 'hi' ? 'मंडी भाव' : 'Market Prices',
          subLabel: sub('APMC दर', 'APMC दर'),
          emoji: '📈',
          icon: TrendingUp,
        },
      ],
    },
    {
      group: language === 'mr' ? '🤝 मदत' : language === 'hi' ? '🤝 मदद' : '🤝 SUPPORT',
      items: [
        {
          id: 'help',
          label: language === 'mr' ? 'तज्ञ कनेक्ट' : language === 'hi' ? 'विशेषज्ञ' : 'Expert Connect',
          subLabel: sub('मदत घ्या', 'मदद लें'),
          emoji: '👨‍🌾',
          icon: HelpCircle,
        },
      ],
    },
    {
      group: language === 'mr' ? '⚙️ इतर' : language === 'hi' ? '⚙️ अन्य' : '⚙️ APP',
      items: [
        {
          id: 'alerts',
          label: language === 'mr' ? 'सूचना' : language === 'hi' ? 'सूचनाएं' : 'Notifications',
          subLabel: sub('अलर्ट पहा', 'अलर्ट देखें'),
          emoji: '🔔',
          icon: Bell,
          badge: unreadAlertsCount,
        },
        {
          id: 'innovations',
          label: language === 'mr' ? 'नवकल्पना' : language === 'hi' ? 'नवाचार' : 'Innovations',
          subLabel: sub('नवीन तंत्रज्ञान', 'नई तकनीक'),
          emoji: '💡',
          icon: Lightbulb,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(243,249,245,0.98))] border-r border-emerald-100 hidden md:flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none shadow-[8px_0_30px_rgba(15,23,42,0.04)]">
      <div className="p-4 space-y-5 overflow-y-auto scrollbar-none">

        {/* Brand Header */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer py-2.5 px-2.5 rounded-2xl bg-white/80 border border-emerald-100 shadow-[0_8px_20px_rgba(16,185,129,0.08)] hover:bg-emerald-50 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center shadow-[0_12px_24px_rgba(16,185,129,0.28)] shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-stone-900 tracking-tight block leading-tight">
              FARMER'S FRIEND
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              {language === 'mr' ? 'शेतकऱ्यांचा मित्र' : language === 'hi' ? 'किसान का दोस्त' : 'Crop Health Intelligence'}
            </span>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="space-y-4">
          {navGroups.map((g, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider block px-3 mb-1.5">
                {g.group}
              </span>
              <div className="space-y-1">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  if (item.isAction) {
                    return (
                      <button
                        key={item.id}
                        onClick={onOpenScanModal}
                        className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer"
                      >
                        <span className="text-2xl shrink-0">{item.emoji}</span>
                        <div className="flex-1 text-left">
                          <span className="block text-sm leading-tight">{item.label}</span>
                          {item.subLabel && (
                            <span className="block text-[11px] text-emerald-200 font-medium mt-0.5">{item.subLabel}</span>
                          )}
                        </div>
                        <span className="text-[10px] bg-emerald-600 px-2 py-1 rounded-lg text-emerald-100 font-bold shrink-0">
                          AI
                        </span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-white text-emerald-900 font-bold border border-emerald-200 shadow-[0_8px_18px_rgba(16,185,129,0.08)]'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-transparent'
                      }`}
                    >
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div className="flex-1 text-left min-w-0">
                        <span className={`block text-sm leading-tight ${isActive ? 'text-emerald-900' : 'text-stone-800'}`}>
                          {item.label}
                        </span>
                        {item.subLabel && (
                          <span className={`block text-[11px] font-medium mt-0.5 truncate ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                            {item.subLabel}
                          </span>
                        )}
                      </div>
                      {item.badge !== undefined && item.badge > 0 ? (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-extrabold rounded-full shrink-0">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-emerald-100 bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(237,248,243,0.95))] space-y-2">
        <button
          onClick={onOpenSettingsModal}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold cursor-pointer transition-colors border border-transparent hover:border-emerald-100"
        >
          <Settings className="w-5 h-5 text-stone-400 shrink-0" />
          <span className="text-sm">{language === 'mr' ? 'सेटिंग्ज' : language === 'hi' ? 'सेटिंग' : 'Account Settings'}</span>
        </button>

        <button
          onClick={onOpenDownloadZipModal}
          className="w-full flex items-center justify-between px-3 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200 font-semibold cursor-pointer transition-colors shadow-[0_8px_20px_rgba(251,191,36,0.08)]"
        >
          <div className="flex items-center gap-3">
            <FolderArchive className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="text-sm">{language === 'mr' ? 'स्त्रोत डाउनलोड' : language === 'hi' ? 'सोर्स डाउनलोड' : 'Download Source'}</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
            154 KB
          </span>
        </button>
      </div>
    </aside>
  );
};
