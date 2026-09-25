import React from 'react';
import {
  ShieldAlert,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  Sparkles,
  CloudSun,
  ChevronRight,
  Bell,
  Phone,
  Camera,
  TrendingUp,
} from 'lucide-react';
import { Field, HealthCase, AlertNotification, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FarmerDashboardProps {
  fields: Field[];
  cases: HealthCase[];
  alerts: AlertNotification[];
  language: Language;
  onOpenScanModal: (fieldId?: string) => void;
  onViewFieldHealth: (fieldId: string) => void;
  onViewAllFields: () => void;
  onOpenFollowUpModal: (caseId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  fields,
  cases,
  alerts,
  language,
  onOpenScanModal,
  onViewFieldHealth,
  onViewAllFields,
  onOpenFollowUpModal,
  onNavigateTab,
}) => {
  const t = TRANSLATIONS[language];

  const activeCasesCount = cases.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  ).length;

  const urgentAlert = alerts.find((a) => a.priority === 'high' || !a.read) || alerts[0];

  // Language-aware labels
  const labels = {
    greeting: language === 'mr' ? 'नमस्कार, शेतकरी 👋' : language === 'hi' ? 'नमस्ते, किसान 👋' : 'Good morning, Farmer 👋',
    subGreeting: language === 'mr' ? 'आज काय लक्ष द्यायचे ते पहा.' : language === 'hi' ? 'आज क्या ध्यान देना है देखें.' : "Here's what needs your attention today.",
    todayAdvice: language === 'mr' ? 'आजचा सल्ला' : language === 'hi' ? 'आज की सलाह' : "Today's Advice",
    cropHealth: language === 'mr' ? 'पिकाचे आरोग्य' : language === 'hi' ? 'फसल की सेहत' : 'Crop Health',
    water: language === 'mr' ? 'पाणी' : language === 'hi' ? 'पानी' : 'Water',
    weather: language === 'mr' ? 'हवामान' : language === 'hi' ? 'मौसम' : 'Weather',
    alerts: language === 'mr' ? 'सूचना' : language === 'hi' ? 'अलर्ट' : 'Alerts',
    scanCrop: language === 'mr' ? 'पीक स्कॅन करा' : language === 'hi' ? 'फसल स्कैन करें' : 'Scan Crop',
    scanSub: language === 'mr' ? 'फोटो घ्या' : language === 'hi' ? 'फोटो लें' : 'Take photo for AI check',
    waterAction: language === 'mr' ? 'सिंचन' : language === 'hi' ? 'सिंचाई' : 'Irrigation',
    waterSub: language === 'mr' ? 'पाणी वेळापत्रक' : language === 'hi' ? 'पानी शेड्यूल' : 'Irrigation schedule',
    weatherAction: language === 'mr' ? 'हवामान' : language === 'hi' ? 'मौसम' : 'Weather',
    weatherSub: language === 'mr' ? 'जोखीम अंदाज' : language === 'hi' ? 'जोखिम अनुमान' : 'Risk forecast',
    helpAction: language === 'mr' ? 'मदत' : language === 'hi' ? 'मदद' : 'Help',
    helpSub: language === 'mr' ? 'तज्ञांशी बोला' : language === 'hi' ? 'विशेषज्ञ से बात करें' : 'Talk to an expert',
    quickActions: language === 'mr' ? 'त्वरित क्रिया' : language === 'hi' ? 'त्वरित क्रिया' : 'Quick Actions',
    viewFields: language === 'mr' ? 'शेते पहा' : language === 'hi' ? 'खेत देखें' : 'View Fields',
    myFields: language === 'mr' ? 'माझी शेते' : language === 'hi' ? 'मेरे खेत' : 'My Fields',
    importantAlert: language === 'mr' ? '⚠️ महत्त्वाची सूचना' : language === 'hi' ? '⚠️ ज़रूरी सूचना' : '⚠️ Important Alert',
    view: language === 'mr' ? 'पहा' : language === 'hi' ? 'देखें' : 'View',
    viewAdvice: language === 'mr' ? 'सल्ला पहा' : language === 'hi' ? 'सलाह देखें' : 'View Advice',
    active: language === 'mr' ? 'सक्रिय' : language === 'hi' ? 'सक्रिय' : 'Active',
    good: language === 'mr' ? 'चांगले' : language === 'hi' ? 'अच्छा' : 'Good',
    optimal: language === 'mr' ? 'योग्य' : language === 'hi' ? 'ठीक' : 'Optimal',
    rainExpected: language === 'mr' ? 'पाऊस येणार' : language === 'hi' ? 'बारिश होगी' : 'Rain Expected',
    fieldsMonitored: language === 'mr' ? 'शेते निगराणीत' : language === 'hi' ? 'खेत निगरानी में' : 'Fields Monitored',
    totalAcres: language === 'mr' ? 'एकूण एकर' : language === 'hi' ? 'कुल एकड़' : 'Total Acres',
    highPriority: language === 'mr' ? 'जास्त महत्त्व' : language === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority',
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-24 px-1 md:px-2">

      {/* 1. GREETING HEADER — Large, friendly, bilingual */}
      <div className="bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(239,253,245,0.96))] rounded-[28px] p-5 sm:p-6 border border-emerald-100 shadow-[0_18px_40px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Farm Pulse
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {labels.greeting}
          </h1>
          <p className="text-sm text-stone-600 mt-1 font-medium">
            {labels.subGreeting}
          </p>
        </div>
        {/* BIG weather pill */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('weather')}
          className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-200 px-4 py-3 rounded-2xl cursor-pointer hover:shadow-[0_10px_20px_rgba(251,191,36,0.12)] transition-all self-start sm:self-auto"
        >
          <span className="text-3xl leading-none">☀️</span>
          <div>
            <div className="font-extrabold text-amber-950 text-xl leading-none">28°C</div>
            <span className="text-xs text-amber-800 font-bold block mt-1">
              {labels.rainExpected}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S ADVICE — VERY prominent, large font */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white p-5 sm:p-6 rounded-[30px] shadow-[0_22px_40px_rgba(6,78,59,0.22)] border border-emerald-700/60 relative overflow-hidden">
        {/* decorative circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-700/30 rounded-full pointer-events-none" />
        <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-emerald-600/20 rounded-full pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700/80 text-emerald-200 rounded-full font-bold text-xs border border-emerald-600 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {labels.todayAdvice}
            <span className="ml-1 bg-emerald-600 px-1.5 py-0.5 rounded text-emerald-100 text-[10px] font-mono">AI 87%</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            💧 {language === 'mr' ? 'पुढील २४ तास पाणी देऊ नका' : language === 'hi' ? 'अगले 24 घंटे सिंचाई न करें' : 'Delay Irrigation for Next 24 Hours'}
          </h2>
          <p className="text-sm text-emerald-100 leading-relaxed mt-3 max-w-lg">
            {language === 'mr'
              ? 'उद्या दुपारी पाऊस अपेक्षित आहे आणि जमिनीतील ओलावा ६१% आहे. पाणी वाचवा, मुळे सुरक्षित ठेवा.'
              : language === 'hi'
              ? 'कल दोपहर बारिश की संभावना है और मिट्टी में नमी 61% है। पानी बचाएं, जड़ें सुरक्षित रखें।'
              : 'Rain is forecasted tomorrow afternoon and current soil moisture is sufficient at 61%. Holding irrigation protects crop roots and saves pumping costs.'}
          </p>

          <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-emerald-200 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <Droplets className="w-5 h-5 text-blue-300" />
                {language === 'mr' ? '६१% ओलावा' : language === 'hi' ? '61% नमी' : '61% Soil Moisture'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CloudSun className="w-5 h-5 text-yellow-300" />
                {labels.rainExpected}
              </span>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab('advisor')}
              className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>{labels.viewAdvice}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. FARM STATUS — Big card grid, big numbers, easy colors */}
      <div className="grid grid-cols-2 gap-3">
        {/* Status 1: Crop Health */}
        <div className="bg-white border border-emerald-100 rounded-[24px] p-4 shadow-[0_12px_22px_rgba(15,23,42,0.04)] flex flex-col gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{labels.cropHealth}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-lg font-extrabold text-emerald-800">{labels.good}</span>
          </div>
          <span className="text-xs text-stone-500">{fields.length} {labels.fieldsMonitored}</span>
        </div>

        {/* Status 2: Water */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('water')}
          className="bg-white border border-blue-100 rounded-[24px] p-4 shadow-[0_12px_22px_rgba(15,23,42,0.04)] flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition-all"
        >
          <span className="text-2xl">💧</span>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{labels.water}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <span className="text-lg font-extrabold text-blue-800">{labels.optimal}</span>
          </div>
          <span className="text-xs text-stone-500">{language === 'mr' ? '६१% ओलावा' : '61% Soil Moisture'}</span>
        </div>

        {/* Status 3: Weather */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('weather')}
          className="bg-white border border-amber-100 rounded-[24px] p-4 shadow-[0_12px_22px_rgba(15,23,42,0.04)] flex flex-col gap-2 cursor-pointer hover:bg-amber-50 transition-all"
        >
          <span className="text-2xl">🌦️</span>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{labels.weather}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-lg font-extrabold text-amber-900 leading-tight">{labels.rainExpected}</span>
          </div>
          <span className="text-xs text-stone-500">82% {language === 'mr' ? 'पाऊस शक्यता' : language === 'hi' ? 'बारिश संभावना' : 'Rain Chance'}</span>
        </div>

        {/* Status 4: Alerts */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('alerts')}
          className="bg-white border border-red-100 rounded-[24px] p-4 shadow-[0_12px_22px_rgba(15,23,42,0.04)] flex flex-col gap-2 cursor-pointer hover:bg-red-50 transition-all"
        >
          <span className="text-2xl">🔔</span>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{labels.alerts}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span className="text-lg font-extrabold text-red-800">{alerts.length} {labels.active}</span>
          </div>
          <span className="text-xs text-stone-500">1 {labels.highPriority}</span>
        </div>
      </div>

      {/* 4. URGENT ALERT BANNER — Big, red, unmissable */}
      {urgentAlert && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-[26px] p-5 shadow-[0_14px_26px_rgba(239,68,68,0.08)] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-red-700 uppercase tracking-wide block">
                {labels.importantAlert}
              </span>
              <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mt-1 leading-snug">
                {urgentAlert.title}
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed mt-1">
                {urgentAlert.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('alerts')}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-[0_12px_20px_rgba(239,68,68,0.2)] shrink-0 cursor-pointer transition-all"
          >
            {labels.view}
          </button>
        </div>
      )}

      {/* 5. QUICK ACTIONS — Large, thumb-friendly, emoji-first */}
      <div className="space-y-3">
        <span className="text-base font-extrabold text-stone-800 block px-1">
          {labels.quickActions}
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Scan Crop — Primary CTA */}
          <button
            onClick={() => onOpenScanModal()}
            className="p-5 bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 active:scale-[0.98] text-white rounded-[26px] shadow-[0_18px_30px_rgba(16,185,129,0.28)] text-left transition-all cursor-pointer flex flex-col gap-3 col-span-2 sm:col-span-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-3xl">📷</span>
            </div>
            <div>
              <strong className="block text-xl font-extrabold">{labels.scanCrop}</strong>
              <span className="text-sm text-emerald-100 block mt-0.5">{labels.scanSub}</span>
            </div>
          </button>

          {/* Action 2: Water */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('water')}
            className="p-5 bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50 text-stone-900 rounded-[24px] shadow-[0_12px_22px_rgba(15,23,42,0.04)] text-left transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <span className="text-3xl">💧</span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">{labels.waterAction}</strong>
              <span className="text-xs text-stone-500 block mt-0.5">{labels.waterSub}</span>
            </div>
          </button>

          {/* Action 3: Weather */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('weather')}
            className="p-5 bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50 text-stone-900 rounded-[24px] shadow-[0_12px_22px_rgba(15,23,42,0.04)] text-left transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <span className="text-3xl">🌦️</span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">{labels.weatherAction}</strong>
              <span className="text-xs text-stone-500 block mt-0.5">{labels.weatherSub}</span>
            </div>
          </button>

          {/* Action 4: Help / Expert */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('help')}
            className="p-5 bg-white border border-violet-100 hover:border-violet-300 hover:bg-violet-50 text-stone-900 rounded-[24px] shadow-[0_12px_22px_rgba(15,23,42,0.04)] text-left transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <span className="text-3xl">👨‍🌾</span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">{labels.helpAction}</strong>
              <span className="text-xs text-stone-500 block mt-0.5">{labels.helpSub}</span>
            </div>
          </button>

          {/* Action 5: Market Prices */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('market')}
            className="p-5 bg-white border border-green-100 hover:border-green-300 hover:bg-green-50 text-stone-900 rounded-[24px] shadow-[0_12px_22px_rgba(15,23,42,0.04)] text-left transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">
                {language === 'mr' ? 'बाजार भाव' : language === 'hi' ? 'मंडी भाव' : 'Market Prices'}
              </strong>
              <span className="text-xs text-stone-500 block mt-0.5">
                {language === 'mr' ? 'मंडी दर' : language === 'hi' ? 'APMC दर' : 'APMC Mandi Rates'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 6. MY FIELDS COMPACT BANNER */}
      <div
        className="bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(236,253,245,0.96))] border border-emerald-100 rounded-[28px] p-5 shadow-[0_16px_30px_rgba(15,23,42,0.04)] flex items-center justify-between gap-4 cursor-pointer hover:shadow-[0_20px_35px_rgba(15,23,42,0.06)] transition-all"
        onClick={onViewAllFields}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-3xl">🗺️</span>
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg leading-snug">
              {fields.length} {labels.myFields}
            </h3>
            <p className="text-sm text-stone-500 mt-0.5">
              {fields.reduce((acc, f) => acc + f.areaAcres, 0).toFixed(1)}{' '}
              {language === 'mr' ? 'एकर • हिंगणघाट' : language === 'hi' ? 'एकड़ • हिंगणघाट' : 'Acres • Hinganghat'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-extrabold text-sm rounded-2xl shadow-[0_14px_24px_rgba(16,185,129,0.2)] shrink-0 cursor-pointer transition-all">
          <span>{labels.viewFields}</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* 7. RECENT ACTIVITY — Simple list with large dots */}
      <div className="bg-white border border-stone-100 rounded-[28px] p-5 shadow-[0_16px_30px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="font-extrabold text-stone-900 text-base">
            {language === 'mr' ? 'अलीकडील क्रिया' : language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
          </span>
          <span className="text-xs text-stone-400 font-medium">
            {language === 'mr' ? 'आज अपडेट' : language === 'hi' ? 'आज अपडेट' : 'Updated Today'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-2xl shrink-0">🔬</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 leading-snug">
                {language === 'mr'
                  ? 'शेत अ (सोयाबीन) — गंज संशय'
                  : language === 'hi'
                  ? 'खेत A (सोयाबीन) — रस्ट संदेह'
                  : 'Field A (Soybean) — Early Rust Suspicion'}
              </p>
              <span className="text-xs text-stone-500 font-medium">
                {language === 'mr' ? '२ तासांपूर्वी' : language === 'hi' ? '2 घंटे पहले' : '2 hours ago'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50 border border-blue-100">
            <span className="text-2xl shrink-0">✅</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 leading-snug">
                {language === 'mr'
                  ? 'अंजली मॅडम (विस्तार अधिकारी) यांनी उपचार मंजूर केले'
                  : language === 'hi'
                  ? 'अंजलि मैडम (Extension Officer) ने उपचार मंजूर किया'
                  : 'Extension Officer Anjali validated treatment plan'}
              </p>
              <span className="text-xs text-stone-500 font-medium">
                {language === 'mr' ? 'काल' : language === 'hi' ? 'कल' : 'Yesterday'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
