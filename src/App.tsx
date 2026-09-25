import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FarmerSidebar } from './components/FarmerSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { FarmerDashboard } from './components/FarmerDashboard';
import { FieldList } from './components/FieldList';
import { FieldHealthProfile } from './components/FieldHealthProfile';
import { AdvisorView } from './components/AdvisorView';
import { WaterView } from './components/WaterView';
import { MarketView } from './components/MarketView';
import { HelpSupportView } from './components/HelpSupportView';
import { HotspotMap } from './components/HotspotMap';
import { WeatherRiskEngine } from './components/WeatherRiskEngine';
import { ExtensionWorkerDashboard } from './components/ExtensionWorkerDashboard';
import { OfficialDashboard } from './components/OfficialDashboard';
import { ExpertLabDashboard } from './components/ExpertLabDashboard';
import { InnovationPanel } from './components/InnovationPanel';
import { CropScanModal } from './components/CropScanModal';
import { FollowUpModal } from './components/FollowUpModal';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { FarmSetupModal } from './components/FarmSetupModal';
import { FarmDataDashboard } from './components/FarmDataDashboard';
import { FarmDataImportModal } from './components/FarmDataImportModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { QuickAddFieldModal } from './components/QuickAddFieldModal';
import { DownloadZipModal } from './components/DownloadZipModal';
import {
  Field,
  HealthCase,
  Hotspot,
  AlertNotification,
  UserRole,
  Language,
  User,
  Farm,
} from './types';
import { api } from './services/api';
import { TRANSLATIONS } from './i18n/translations';
import { Bell, FolderArchive } from 'lucide-react';

export function App() {
  // Authentication & User Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const u = api.getCurrentUser();
    return u?.role || 'farmer';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const u = api.getCurrentUser();
    return u?.language || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [fields, setFields] = useState<Field[]>([]);
  const [cases, setCases] = useState<HealthCase[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field-1');
  const [selectedCaseForFollowUp, setSelectedCaseForFollowUp] = useState<HealthCase | null>(null);

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadZipModalOpen, setIsDownloadZipModalOpen] = useState(false);

  const [lastSyncTime, setLastSyncTime] = useState('Live');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [f, c, h, a] = await Promise.all([
        api.getFields(),
        api.getCases(),
        api.getHotspots(),
        api.getAlerts(),
      ]);
      setFields(f);
      setCases(c);
      setHotspots(h);
      setAlerts(a);
      if (f.length > 0 && !selectedFieldId) {
        setSelectedFieldId(f[0].id);
      }
      setLastSyncTime(api.getLastSyncTime());
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.onboardingComplete) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.language) setLanguage(user.language);
    if (user.onboardingComplete) {
      loadData();
    }
  };

  const handleOnboardingComplete = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    loadData();
  };

  const handleSkipOnboarding = () => {
    if (currentUser) {
      const updated: User = { ...currentUser, onboardingComplete: true };
      setCurrentUser(updated);
      localStorage.setItem('crop_health_current_user', JSON.stringify(updated));
      loadData();
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleScenarioTriggered = async (scId: string) => {
    await loadData();
    if (scId === 'scenario-1') {
      setCurrentRole('farmer');
      setActiveTab('home');
    } else if (scId === 'scenario-2') {
      setCurrentRole('farmer');
      setActiveTab('weather');
    } else if (scId === 'scenario-3') {
      setCurrentRole('official');
      setActiveTab('hotspots');
    } else if (scId === 'scenario-4') {
      setCurrentRole('extension');
      setActiveTab('cases');
    } else if (scId === 'scenario-5') {
      setCurrentRole('farmer');
      setActiveTab('memory');
    }
  };

  const handleReset = async () => {
    await api.resetDemoData();
    await loadData();
    setActiveTab('home');
    setCurrentRole('farmer');
  };

  const handleOpenScan = (fId?: string) => {
    if (fId) setSelectedFieldId(fId);
    setIsScanModalOpen(true);
  };

  const handleViewFieldHealth = (fId: string) => {
    setSelectedFieldId(fId);
    setActiveTab('memory');
  };

  const handleOpenFollowUp = (cId: string) => {
    const found = cases.find((c) => c.id === cId);
    if (found) {
      setSelectedCaseForFollowUp(found);
      setIsFollowUpModalOpen(true);
    }
  };

  const handleAddField = async (fieldData: Partial<Field>) => {
    const added = await api.addField(fieldData);
    setFields((prev) => [added, ...prev]);
    setSelectedFieldId(added.id);
  };

  const handleFarmCreated = (farm: Farm) => {
    loadData();
  };

  // Condition 1: UNAUTHENTICATED -> Render Login Screen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Condition 2: AUTHENTICATED BUT ONBOARDING INCOMPLETE -> Render Wizard
  if (!currentUser.onboardingComplete) {
    return (
      <OnboardingWizard
        user={currentUser}
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  // Condition 3: AUTHENTICATED & ONBOARDED -> Main Application
  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0];
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f5faf6_0%,_#edf8f3_28%,_#f9faf7_100%)] font-sans text-stone-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* SIH Judge Demo Quick-Runner Banner */}
      <JudgeDemoBanner
        onScenarioTriggered={handleScenarioTriggered}
        onReset={handleReset}
        onDownloadZip={() => setIsDownloadZipModalOpen(true)}
      />

      {/* Main Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setActiveTab('home');
        }}
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenScanModal={() => handleOpenScan()}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenDownloadZipModal={() => setIsDownloadZipModalOpen(true)}
        onLogout={handleLogout}
        unreadAlertsCount={unreadAlertsCount}
        lastSyncTime={lastSyncTime}
      />

      {/* Responsive Main Layout Container */}
      <div className="flex-1 flex w-full">
        {/* Farmer Sidebar for Desktop */}
        {currentRole === 'farmer' && (
          <FarmerSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenScanModal={() => handleOpenScan()}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onOpenDownloadZipModal={() => setIsDownloadZipModalOpen(true)}
            language={language}
            unreadAlertsCount={unreadAlertsCount}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                Loading Crop Health Intelligence Platform...
              </p>
            </div>
          ) : (
            <>
              {/* FARMER ROLE VIEWS */}
              {currentRole === 'farmer' && (
                <>
                  {activeTab === 'home' && (
                    <FarmerDashboard
                      fields={fields}
                      cases={cases}
                      alerts={alerts}
                      language={language}
                      onOpenScanModal={handleOpenScan}
                      onViewFieldHealth={handleViewFieldHealth}
                      onViewAllFields={() => setActiveTab('fields')}
                      onOpenFollowUpModal={handleOpenFollowUp}
                      onNavigateTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'fields' && (
                    <FieldList
                      fields={fields}
                      language={language}
                      onSelectField={handleViewFieldHealth}
                      onScanField={handleOpenScan}
                      onAddField={handleAddField}
                    />
                  )}

                  {activeTab === 'advisor' && (
                    <AdvisorView
                      fields={fields}
                      cases={cases}
                      selectedField={selectedField}
                      language={language}
                      onOpenScanModal={handleOpenScan}
                      onOpenFollowUpModal={handleOpenFollowUp}
                    />
                  )}

                  {activeTab === 'water' && selectedField && (
                    <WaterView
                      fields={fields}
                      selectedField={selectedField}
                      onSelectField={(f) => setSelectedFieldId(f.id)}
                      language={language}
                    />
                  )}

                  {activeTab === 'market' && <MarketView language={language} />}

                  {activeTab === 'help' && <HelpSupportView language={language} />}

                  {activeTab === 'farm_data' && selectedField && (
                    <FarmDataDashboard
                      field={selectedField}
                      allFields={fields}
                      onSelectField={(f) => setSelectedFieldId(f.id)}
                      onOpenImportModal={() => setIsImportModalOpen(true)}
                      onOpenScanModal={() => handleOpenScan()}
                    />
                  )}

                  {activeTab === 'memory' && selectedField && (
                    <FieldHealthProfile
                      field={selectedField}
                      cases={cases}
                      hotspots={hotspots}
                      onScanFieldCrop={handleOpenScan}
                      onOpenFollowUpModal={handleOpenFollowUp}
                      onBack={() => setActiveTab('fields')}
                    />
                  )}

                  {activeTab === 'weather' && selectedField && (
                    <WeatherRiskEngine
                      field={selectedField}
                      allFields={fields}
                      onSelectField={(f) => setSelectedFieldId(f.id)}
                    />
                  )}

                  {activeTab === 'hotspots' && <HotspotMap hotspots={hotspots} />}
                </>
              )}

              {/* EXTENSION WORKER ROLE VIEWS */}
              {currentRole === 'extension' && (
                <>
                  {(activeTab === 'home' || activeTab === 'cases') && (
                    <ExtensionWorkerDashboard
                      cases={cases}
                      fields={fields}
                      onCaseValidated={loadData}
                      onOpenFollowUpModal={handleOpenFollowUp}
                    />
                  )}

                  {activeTab === 'hotspots' && <HotspotMap hotspots={hotspots} />}

                  {activeTab === 'fields' && (
                    <FieldList
                      fields={fields}
                      language={language}
                      onSelectField={handleViewFieldHealth}
                      onScanField={handleOpenScan}
                      onAddField={handleAddField}
                    />
                  )}
                </>
              )}

              {/* AGRICULTURE OFFICIAL ROLE VIEWS */}
              {currentRole === 'official' && (
                <>
                  {activeTab === 'home' && (
                    <OfficialDashboard
                      cases={cases}
                      hotspots={hotspots}
                      fields={fields}
                      onSelectHotspotTab={() => setActiveTab('hotspots')}
                    />
                  )}

                  {activeTab === 'hotspots' && <HotspotMap hotspots={hotspots} />}

                  {activeTab === 'cases' && (
                    <ExtensionWorkerDashboard
                      cases={cases}
                      fields={fields}
                      onCaseValidated={loadData}
                      onOpenFollowUpModal={handleOpenFollowUp}
                    />
                  )}
                </>
              )}

              {/* EXPERT / LABORATORY ROLE VIEWS */}
              {currentRole === 'expert' && (
                <>
                  {(activeTab === 'home' || activeTab === 'cases') && (
                    <ExpertLabDashboard cases={cases} onCaseValidated={loadData} />
                  )}

                  {activeTab === 'hotspots' && <HotspotMap hotspots={hotspots} />}
                </>
              )}

              {/* PLATFORM INNOVATIONS TAB */}
              {activeTab === 'innovations' && <InnovationPanel />}

              {/* ALERTS TAB */}
              {activeTab === 'alerts' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                        All Agricultural Alerts & Microclimate Warnings
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Early risk notices, outbreak clusters, and validation notifications
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                      {alerts.length} Total Alerts
                    </span>
                  </div>

                  <div className="space-y-3">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-stone-100 text-stone-800 uppercase tracking-wider">
                            {a.type.replace('_', ' ')}
                          </span>
                          <span className="text-stone-400 text-[11px]">{a.timestamp}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm">{a.title}</h4>
                        <p className="text-stone-600 leading-relaxed">{a.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar for Farmer */}
      {currentRole === 'farmer' && (
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenScanModal={() => handleOpenScan()}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenDownloadZipModal={() => setIsDownloadZipModalOpen(true)}
          language={language}
          unreadAlertsCount={unreadAlertsCount}
        />
      )}

      {/* AI Crop Diagnostic Scan Modal */}
      <CropScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        fields={fields}
        selectedFieldId={selectedFieldId}
        language={language}
        onCaseCreated={loadData}
      />

      {/* Follow-up Observation Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        caseItem={selectedCaseForFollowUp}
        onFollowUpSaved={loadData}
      />

      {/* Set Up Farm Modal */}
      <FarmSetupModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onFarmCreated={handleFarmCreated}
      />

      {/* Quick Add Field Modal */}
      <QuickAddFieldModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onFieldAdded={(newF) => {
          setFields((prev) => [newF, ...prev]);
          setSelectedFieldId(newF.id);
        }}
      />

      {/* Farm Data Import Modal */}
      <FarmDataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={loadData}
      />

      {/* User Account & Settings Modal */}
      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          if (updated.language) setLanguage(updated.language);
        }}
        onLogout={handleLogout}
      />

      {/* Codebase Source ZIP Modal */}
      <DownloadZipModal
        isOpen={isDownloadZipModalOpen}
        onClose={() => setIsDownloadZipModalOpen(false)}
      />

      {/* Professional Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">FARMER'S FRIEND</span>
            <span>•</span>
            <span>Smart India Hackathon (SIH) 2026</span>
            <span>•</span>
            <span>Detect Early. Validate Smartly. Act Safely.</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setIsDownloadZipModalOpen(true)}
              className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download Source .ZIP (154 KB)</span>
            </button>
            <span>•</span>
            <span>Server-Side Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Field Health Memory Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
