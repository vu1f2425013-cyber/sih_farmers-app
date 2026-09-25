import React, { useState } from 'react';
import { User, Farm, Field, Language } from '../types';
import { api } from '../services/api';
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Compass,
  FileCheck,
  Building2,
  UserCheck,
  FlaskConical,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OnboardingWizardProps {
  user: User;
  onOnboardingComplete?: (updatedUser: User) => void;
  onComplete?: (updatedUser: User) => void;
  onSkip?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  onOnboardingComplete,
  onComplete,
  onSkip,
}) => {
  const notifyComplete = (updatedUser: User) => {
    if (onOnboardingComplete) onOnboardingComplete(updatedUser);
    if (onComplete) onComplete(updatedUser);
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Farmer Form State
  const [farmerProfile, setFarmerProfile] = useState({
    name: user.name,
    mobile: user.mobile,
    state: user.state || 'Maharashtra',
    district: user.district || 'Wardha',
    village: user.village || 'Hinganghat',
    language: user.language || 'en',
  });

  const [farmData, setFarmData] = useState<Partial<Farm>>({
    name: `${user.name.split(' ')[0]}'s Farm`,
    totalLandArea: 4.5,
    unit: 'acre',
    village: user.village || 'Hinganghat',
    district: user.district || 'Wardha',
    state: user.state || 'Maharashtra',
    pinCode: '442301',
    soilType: 'Deep Black Cotton Soil (Vertisol)',
    irrigationType: 'Drip & Furrow',
    waterSource: 'Borewell & Farm Pond',
    farmingMethod: 'Integrated Crop Management (ICM)',
  });

  const [fieldData, setFieldData] = useState<Partial<Field>>({
    name: 'Plot 1 (Main Kharif Field)',
    areaAcres: 2.5,
    crop: 'Soybean',
    variety: 'JS 20-29',
    growthStage: 'Vegetative Stage',
    plantingDate: '2026-06-25',
    soilType: 'Black Cotton Soil',
    irrigationMethod: 'Furrow Irrigation',
  });

  // Professional Role State
  const [profData, setProfData] = useState({
    organization: user.organization || (user.role === 'extension' ? 'State Dept of Agriculture' : user.role === 'expert' ? 'Agricultural University Pathology Dept' : 'Directorate of Agriculture'),
    designation: user.designation || (user.role === 'extension' ? 'Block Extension Officer' : user.role === 'expert' ? 'Senior Plant Pathologist' : 'Joint Director'),
    jurisdiction: user.jurisdiction || 'Wardha District',
    expertise: user.expertise || 'Crop Protection & Integrated Pest Management',
    serviceArea: user.serviceArea || 'Hinganghat & Deoli Talukas',
  });

  const finishOnboarding = async () => {
    setLoading(true);
    try {
      if (user.role === 'farmer') {
        // Save farm and field if provided
        if (farmData.name) {
          const newFarm = await api.addFarm({
            ...farmData,
            userId: user.id,
          });
          if (fieldData.name) {
            await api.addField({
              ...fieldData,
              farmId: newFarm.id,
              farmerName: user.name,
              farmerPhone: user.mobile,
            });
          }
        }
      }

      const updated = await api.updateOnboarding(user.id, {
        complete: true,
        step: 5,
        profileData: user.role === 'farmer' ? farmerProfile : profData,
      });

      notifyComplete(updated);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      // Even on network error, allow prototype completion
      const localUpdated = { ...user, onboardingComplete: true };
      notifyComplete(localUpdated);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
    } else {
      finishOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-950 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              FF
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Welcome to Farmer's Friend
              </h2>
              <p className="text-[11px] text-stone-400">
                Let's set up your personalized crop-health workspace
              </p>
            </div>
          </div>
          <button
            onClick={handleSkipClick}
            className="text-xs text-stone-400 hover:text-emerald-400 font-semibold transition-colors underline cursor-pointer"
          >
            Skip to Dashboard
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        {/* FARMER ONBOARDING FLOW */}
        {user.role === 'farmer' ? (
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <span>
                  Step {step} of 4: {step === 1 ? 'Personal Profile' : step === 2 ? 'Your Farm' : step === 3 ? 'Your Field' : 'Crop & Practices'}
                </span>
                <span className="text-emerald-400">{step * 25}% Completed</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-stone-800'}`} />
                <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-stone-800'}`} />
                <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-stone-800'}`} />
                <div className={`h-1.5 rounded-full ${step >= 4 ? 'bg-emerald-500' : 'bg-stone-800'}`} />
              </div>
            </div>

            {/* STEP 1: Basic Profile */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Your Basic Information</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    This minimum information allows us to localize microclimate disease forecasts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={farmerProfile.name}
                      onChange={(e) => setFarmerProfile({ ...farmerProfile, name: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      value={farmerProfile.mobile}
                      onChange={(e) => setFarmerProfile({ ...farmerProfile, mobile: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">State *</label>
                    <input
                      type="text"
                      value={farmerProfile.state}
                      onChange={(e) => setFarmerProfile({ ...farmerProfile, state: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">District *</label>
                    <input
                      type="text"
                      value={farmerProfile.district}
                      onChange={(e) => setFarmerProfile({ ...farmerProfile, district: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Village</label>
                    <input
                      type="text"
                      value={farmerProfile.village}
                      onChange={(e) => setFarmerProfile({ ...farmerProfile, village: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Preferred Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'हिंदी (Hindi)' },
                      { code: 'mr', label: 'मराठी (Marathi)' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setFarmerProfile({ ...farmerProfile, language: l.code as Language })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                          farmerProfile.language === l.code
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[11px] text-stone-500">You can update these anytime in Settings</span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Save & Add Farm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Set Up Farm */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Set Up Your Farm</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Enter details for your land parcel. You can add more plots later.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Farm Name</label>
                    <input
                      type="text"
                      value={farmData.name}
                      onChange={(e) => setFarmData({ ...farmData, name: e.target.value })}
                      placeholder="e.g. Patil Krishi Farm"
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Total Land Area</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={farmData.totalLandArea}
                        onChange={(e) => setFarmData({ ...farmData, totalLandArea: Number(e.target.value) })}
                        className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                      />
                      <select
                        value={farmData.unit}
                        onChange={(e) => setFarmData({ ...farmData, unit: e.target.value as any })}
                        className="px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                      >
                        <option value="acre">Acres</option>
                        <option value="hectare">Hectares</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Soil Type</label>
                    <select
                      value={farmData.soilType}
                      onChange={(e) => setFarmData({ ...farmData, soilType: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                    >
                      <option value="Deep Black Cotton Soil (Vertisol)">Deep Black Cotton Soil</option>
                      <option value="Medium Black Soil">Medium Black Soil</option>
                      <option value="Red Loamy Soil">Red Loamy Soil</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Alluvial Soil">Alluvial Soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Water Source</label>
                    <input
                      type="text"
                      value={farmData.waterSource}
                      onChange={(e) => setFarmData({ ...farmData, waterSource: e.target.value })}
                      placeholder="e.g. Borewell & Canal"
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                    >
                      Skip Farm Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Save & Add Field</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Add Field */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Add Your First Field</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Individual plots maintain their own continuous crop health intelligence memory.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Field / Plot Name</label>
                    <input
                      type="text"
                      value={fieldData.name}
                      onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Cultivated Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fieldData.areaAcres}
                      onChange={(e) => setFieldData({ ...fieldData, areaAcres: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Current Crop</label>
                    <select
                      value={fieldData.crop}
                      onChange={(e) => setFieldData({ ...fieldData, crop: e.target.value })}
                      className="w-full px-2.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                    >
                      <option value="Soybean">Soybean</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Rice">Rice</option>
                      <option value="Chilli">Chilli</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Variety</label>
                    <input
                      type="text"
                      value={fieldData.variety}
                      onChange={(e) => setFieldData({ ...fieldData, variety: e.target.value })}
                      className="w-full px-2.5 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Growth Stage</label>
                    <select
                      value={fieldData.growthStage}
                      onChange={(e) => setFieldData({ ...fieldData, growthStage: e.target.value })}
                      className="w-full px-2 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white"
                    >
                      <option value="Vegetative Stage">Vegetative Stage</option>
                      <option value="Flowering Stage">Flowering Stage</option>
                      <option value="Pod / Boll Formation">Pod / Boll Formation</option>
                      <option value="Ripening / Maturity">Ripening / Maturity</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                    >
                      Skip Field
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Optional Crop History & Ready Screen */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center py-2 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Your Workspace Is Ready!</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    You can immediately perform AI crop diagnostics, monitor microclimate spore risks, or complete your field profile progressively later.
                  </p>
                </div>

                <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Field Profile Initialized</span>
                    <span className="font-bold text-emerald-400">70% Complete</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Entering optional soil reports or previous crop history unlocks higher precision for AI pathogen differentiation.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={finishOnboarding}
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Enter Farmer Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PROFESSIONAL ROLES ONBOARDING (Extension, Expert, Official) */
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                {user.role === 'extension' ? <UserCheck className="w-5 h-5" /> : user.role === 'expert' ? <FlaskConical className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {user.role === 'extension'
                    ? 'Extension Worker Onboarding'
                    : user.role === 'expert'
                    ? 'Pathology Lab Expert Onboarding'
                    : 'Agricultural Official Onboarding'}
                </h3>
                <p className="text-xs text-stone-400">
                  Configure your official credentials, jurisdiction, and triage workflow.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Department / Organization *
                </label>
                <input
                  type="text"
                  value={profData.organization}
                  onChange={(e) => setProfData({ ...profData, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={profData.designation}
                    onChange={(e) => setProfData({ ...profData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Jurisdiction / District</label>
                  <input
                    type="text"
                    value={profData.jurisdiction}
                    onChange={(e) => setProfData({ ...profData, jurisdiction: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {user.role === 'expert' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Specialization & Research Focus</label>
                  <input
                    type="text"
                    value={profData.expertise}
                    onChange={(e) => setProfData({ ...profData, expertise: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                  />
                </div>
              )}

              {user.role === 'extension' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Assigned Service Blocks</label>
                  <input
                    type="text"
                    value={profData.serviceArea}
                    onChange={(e) => setProfData({ ...profData, serviceArea: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={finishOnboarding}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Activate Professional Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-3 text-center text-xs text-stone-500">
        Progressive Onboarding • Non-blocking setup
      </footer>
    </div>
  );
};
export default OnboardingWizard;
