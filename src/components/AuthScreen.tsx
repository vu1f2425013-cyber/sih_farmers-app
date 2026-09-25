import React, { useState } from 'react';
import { User, UserRole, Language } from '../types';
import { api } from '../services/api';
import { DEMO_USERS } from '../data/seedData';
import {
  Sprout,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserCheck,
  FlaskConical,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('9000000001'); // prefilled with Demo Farmer for judge convenience
  const [password, setPassword] = useState('demo123');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('demo123');
  const [regRole, setRegRole] = useState<UserRole>('farmer');
  const [regState, setRegState] = useState('Maharashtra');
  const [regDistrict, setRegDistrict] = useState('Wardha');
  const [regVillage, setRegVillage] = useState('Hinganghat');
  const [regLanguage, setRegLanguage] = useState<Language>('en');

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginMethod === 'otp' && !otpSent) {
        // Send simulated OTP
        setOtpSent(true);
        setOtpCode('582914');
        setLoading(false);
        return;
      }

      const res = await api.login({
        identifier,
        password: loginMethod === 'password' ? password : 'demo123',
        isOtp: loginMethod === 'otp',
        otpCode: loginMethod === 'otp' ? otpCode : undefined,
      });

      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-Click Demo Account Quick Login
  const handleQuickDemoLogin = async (demoUser: (typeof DEMO_USERS)[0]) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({
        identifier: demoUser.mobile,
        password: demoUser.password,
      });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.register({
        name: regName,
        mobile: regMobile,
        email: regEmail || undefined,
        password: regPassword,
        role: regRole,
        state: regState,
        district: regDistrict,
        village: regVillage || undefined,
        language: regLanguage,
      });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(180deg,_#07130f_0%,_#0b1714_35%,_#0e1411_100%)] text-stone-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-90">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/25 blur-[120px]" />
        <div className="absolute top-1/3 right-[-5rem] w-[28rem] h-[28rem] rounded-full bg-lime-400/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-teal-500/10 blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-emerald-500/10 bg-stone-900/60 backdrop-blur-xl px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-200/10">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-base">FARMER'S FRIEND</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Crop Health Intelligence Platform</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-300/90">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control • Multilingual (EN/HI/MR)</span>
          </div>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Brand & Value Proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Every field builds its own crop-health intelligence over time</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Detect Early. <br />
              <span className="text-emerald-400">Validate Smartly.</span> <br />
              Act Safely.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed pt-2">
              Next-generation agricultural platform combining multimodal Gemini AI crop diagnosis, in-situ sensor telemetry, localized pathogen outbreak surveillance, and human-in-the-loop expert validation.
            </p>
          </div>

          {/* Quick Demo Accounts Banner */}
          <div className="bg-stone-900/80 border border-emerald-500/10 rounded-2xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> Demo Accounts (1-Click Login)
              </span>
              <span className="text-[11px] text-stone-400">SIH 2026 Evaluation Ready</span>
            </div>
            <p className="text-xs text-stone-300">
              Click any role below to instantly authenticate into that role's customized dashboard and operational workflow:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {DEMO_USERS.map((demo) => {
                const isFarmer = demo.role === 'farmer';
                const isExt = demo.role === 'extension';
                const isExp = demo.role === 'expert';
                const isOff = demo.role === 'official';

                return (
                  <button
                    key={demo.id}
                    onClick={() => handleQuickDemoLogin(demo)}
                    disabled={loading}
                    className="group relative flex flex-col text-left p-3 rounded-2xl border border-stone-700 bg-stone-800/75 hover:bg-stone-800 hover:border-emerald-500/60 transition-all duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {demo.name}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                          isFarmer
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : isExt
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : isExp
                            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {demo.role.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-300 mt-1">
                      {isFarmer && '3 Fields • Hinganghat, Wardha'}
                      {isExt && 'Block Extension Officer • Wardha'}
                      {isExp && 'Plant Pathologist • PDKV Nagpur'}
                      {isOff && 'Surveillance Command • Vidarbha'}
                    </span>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-700/60 text-[10px] text-stone-400">
                      <span>Mob: {demo.mobile}</span>
                      <span className="text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Login <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Auth Card */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div className="bg-stone-900/85 border border-emerald-500/10 rounded-[28px] shadow-[0_28px_80px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur-sm">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 border-b border-stone-800 bg-stone-950/40 text-xs font-bold">
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-3.5 text-center transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-b-2 border-emerald-500 shadow-inner shadow-emerald-900/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-3.5 text-center transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 text-emerald-300 border-b-2 border-emerald-500 shadow-inner shadow-emerald-900/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800/70 text-red-300 text-xs flex items-start gap-2.5 shadow-[0_10px_24px_rgba(127,29,29,0.2)]">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-300">
                        Mobile Number or Email
                      </label>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setLoginMethod('password')}
                          className={`font-semibold ${
                            loginMethod === 'password' ? 'text-emerald-400 underline' : 'text-stone-400'
                          }`}
                        >
                          Password
                        </button>
                        <span className="text-stone-600">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginMethod('otp');
                            setOtpSent(false);
                          }}
                          className={`font-semibold ${
                            loginMethod === 'otp' ? 'text-emerald-400 underline' : 'text-stone-400'
                          }`}
                        >
                          OTP
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9000000001 or email@domain.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2.75 bg-stone-950/80 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {loginMethod === 'password' ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-stone-300">Password</label>
                        <span className="text-[10px] text-stone-500">Demo: demo123</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-3.5 py-2.75 bg-stone-950/80 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-stone-300">
                          {otpSent ? 'Enter 6-Digit OTP' : 'Verification Code'}
                        </label>
                        {otpSent && (
                          <span className="text-[10px] text-emerald-300 font-mono">
                            Simulated OTP: 582914
                          </span>
                        )}
                      </div>
                      {otpSent ? (
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="582914"
                          maxLength={6}
                          required
                          className="w-full text-center tracking-widest font-mono text-base py-2.75 bg-stone-950/80 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      ) : (
                        <p className="text-[11px] text-stone-400">
                          Clicking verify will send a simulated OTP for prototype access.
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-emerald-600 active:from-emerald-700 active:to-green-700 text-white font-bold text-xs rounded-xl shadow-[0_16px_30px_rgba(16,185,129,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{loginMethod === 'otp' && !otpSent ? 'Send OTP Code' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Select Your Professional Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { role: 'farmer' as UserRole, label: 'Farmer', icon: Sprout },
                        { role: 'extension' as UserRole, label: 'Extension Worker', icon: UserCheck },
                        { role: 'expert' as UserRole, label: 'Expert / Lab', icon: FlaskConical },
                        { role: 'official' as UserRole, label: 'Agri Official', icon: Building2 },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = regRole === item.role;
                        return (
                          <button
                            key={item.role}
                            type="button"
                            onClick={() => setRegRole(item.role)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:bg-stone-800/70'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-stone-500'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Patil"
                        required
                        className="w-full px-3 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="9823100000"
                        required
                        className="w-full px-3 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">State</label>
                      <input
                        type="text"
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full px-2.5 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">District</label>
                      <input
                        type="text"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full px-2.5 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Language</label>
                      <select
                        value={regLanguage}
                        onChange={(e) => setRegLanguage(e.target.value as Language)}
                        className="w-full px-2 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="mr">मराठी</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="demo123"
                      className="w-full px-3 py-2.5 bg-stone-950/80 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-[0_16px_30px_rgba(16,185,129,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <span>Create Account & Start Onboarding</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="bg-stone-950/80 px-6 py-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Data Protected & Private
              </span>
              <span>No Aadhaar or Banking details requested</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/80 py-4 text-center text-xs text-stone-400">
        <p>
          FARMER'S FRIEND — Smart India Hackathon (SIH 2026) Prototype • AI Studio Build
        </p>
      </footer>
    </div>
  );
};
export default AuthScreen;
