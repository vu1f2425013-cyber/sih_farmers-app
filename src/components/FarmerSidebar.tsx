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
  Sprout,
  LucideIcon,
} from 'lucide-react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FarmerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenScanModal: () => void;
  onOpenSettingsModal: () => void;
  language: Language;
  unreadAlertsCount: number;
  user: User;
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
  language,
  unreadAlertsCount,
  user,
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
    <aside className="hidden lg:flex w-60 bg-[#153d2a] border-r border-[#28543b] flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-30 shrink-0 select-none text-white">
      <div className="p-4 space-y-5 overflow-y-auto scrollbar-none">

        {/* Brand Header */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer py-2.5 px-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#2f7046] text-white flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block leading-tight">
              FARMER'S FRIEND
            </span>
            <span className="text-[11px] text-emerald-100">
              {language === 'mr' ? 'शेतकऱ्यांचा मित्र' : language === 'hi' ? 'किसान का दोस्त' : 'Farm companion'}
            </span>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="space-y-4">
          {navGroups.map((g, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-semibold text-emerald-100/70 uppercase tracking-wide block px-3 mb-1.5">
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
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-semibold bg-[#2f7046] hover:bg-[#3a8052] text-white transition-colors cursor-pointer"
                      >
                        <span className="text-2xl shrink-0">{item.emoji}</span>
                        <div className="flex-1 text-left">
                          <span className="block text-sm leading-tight">{item.label}</span>
                          {item.subLabel && (
                            <span className="block text-[11px] text-emerald-100/75 font-medium mt-0.5">{item.subLabel}</span>
                          )}
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#356e46] text-white font-semibold border border-white/10'
                            : 'text-emerald-50/85 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div className="flex-1 text-left min-w-0">
                        <span className="block text-sm leading-tight">
                          {item.label}
                        </span>
                        {item.subLabel && (
                          <span className="block text-[11px] font-medium mt-0.5 truncate text-emerald-100/65">
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
      <div className="p-3 border-t border-white/10 bg-[#113522] space-y-2">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcebdc] text-sm font-bold text-[#153d2a]">{user.name.charAt(0)}</div>
          <div className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{user.name}</span><span className="block text-xs text-emerald-100/70">{language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'Farmer'}</span></div>
        </div>
        <button
          onClick={onOpenSettingsModal}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-50/85 hover:bg-white/10 hover:text-white font-medium cursor-pointer transition-colors"
        >
          <Settings className="w-5 h-5 text-emerald-100/75 shrink-0" />
          <span className="text-sm">{language === 'mr' ? 'सेटिंग्ज' : language === 'hi' ? 'सेटिंग' : 'Account Settings'}</span>
        </button>
      </div>
    </aside>
  );
};
