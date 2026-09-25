import React, { useState } from 'react';
import {
  ShieldAlert,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ScanLine,
  Activity,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { Field, HealthCase, Hotspot } from '../types';

interface FieldHealthProfileProps {
  field: Field;
  cases: HealthCase[];
  hotspots: Hotspot[];
  onScanFieldCrop: (fieldId: string) => void;
  onOpenFollowUpModal: (caseId: string) => void;
  onBack: () => void;
}

export const FieldHealthProfile: React.FC<FieldHealthProfileProps> = ({
  field,
  cases,
  hotspots,
  onScanFieldCrop,
  onOpenFollowUpModal,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'conditions' | 'nearby'>(
    'overview'
  );

  const fieldCases = cases.filter((c) => c.fieldId === field.id);
  const activeCase = fieldCases.find(
    (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  );

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH RISK':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MODERATE RISK':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'VALIDATION REQUIRED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors"
        >
          ← Back to Fields
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onScanFieldCrop(field.id)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Crop for this Field</span>
          </button>
        </div>
      </div>

      {/* Hero Field Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                {field.name}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(
                  field.currentRisk
                )}`}
              >
                {field.currentRisk}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {field.location.village}, {field.location.taluka} Taluka, {field.location.district} ({field.location.state})
              </span>
              <span>•</span>
              <span>{field.areaAcres} Acres</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-900">
              <span className="text-[10px] text-stone-500 block">Current Crop</span>
              <span className="font-bold">{field.crop}</span> ({field.variety})
            </div>
            <div className="px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800">
              <span className="text-[10px] text-stone-500 block">Growth Stage</span>
              <span className="font-bold">{field.growthStage}</span>
            </div>
            <div className="px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800">
              <span className="text-[10px] text-stone-500 block">Soil Type</span>
              <span className="font-bold">{field.soilType}</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex space-x-2 pt-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Health Overview & Follow-up
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Field Health Memory Timeline ({field.history.length})
          </button>
          <button
            onClick={() => setActiveTab('conditions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'conditions'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Field Microclimate & Sensors
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'nearby'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Nearby Clusters & Hotspots
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Follow-up */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active Case Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
                <h3 className="text-sm font-bold text-stone-900">
                  Active Health Observation & Diagnosis
                </h3>
                {activeCase && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Status: {activeCase.status}
                  </span>
                )}
              </div>

              {activeCase ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img
                        src={activeCase.image}
                        alt="Crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5 text-xs">
                      <div className="text-stone-500">
                        Case ID: <span className="font-mono text-stone-800 font-semibold">{activeCase.caseNumber}</span> • Logged on{' '}
                        {new Date(activeCase.createdAt).toLocaleDateString()}
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">
                        {activeCase.aiAnalysis.possibleIssues[0]?.name || 'Suspected Crop Condition'}
                      </h4>
                      <p className="text-stone-600">
                        {activeCase.farmerNotes || activeCase.aiAnalysis.observation}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-semibold text-[11px]">
                          Confidence: {activeCase.aiAnalysis.confidence}%
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          Severity: {activeCase.aiAnalysis.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Validation or Follow-up Action CTA */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="text-stone-700">
                      <span className="font-semibold text-stone-900">Next Action: </span>
                      {activeCase.aiAnalysis.recommendedNextStep}
                    </div>
                    <button
                      onClick={() => onOpenFollowUpModal(activeCase.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                    >
                      Submit Follow-up Observation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-stone-800">No unresolved cases on this field</p>
                  <p className="text-stone-500 mt-0.5">
                    Field is operating under baseline surveillance. Last checked {field.lastObservationDate}.
                  </p>
                </div>
              )}
            </div>

            {/* Field Health Memory Innovation Box */}
            <div className="p-4 rounded-xl bg-emerald-900 text-emerald-100 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-200">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Field Health Memory Core</span>
              </div>
              <p className="text-emerald-100 leading-relaxed">
                This field has accumulated {field.history.length} verified agronomic cases over previous cycles.
                Whenever new leaf symptoms are uploaded, the AI system weights past pathogen occurrences alongside
                current microclimate humidity ({field.weather.humidity}%) to prevent misdiagnosis.
              </p>
            </div>
          </div>

          {/* Microclimate & Sensor Snapshot Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Field Conditions Snapshot
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-bold text-stone-900">{field.weather.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>Relative Humidity</span>
                  </div>
                  <span className="font-bold text-stone-900">{field.weather.humidity}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Wind className="w-4 h-4 text-stone-600" />
                    <span>Recent Rainfall</span>
                  </div>
                  <span className="font-bold text-stone-900">{field.weather.rainfall} mm</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Radio className="w-4 h-4 text-purple-600" />
                    <span>Pest Trap Count</span>
                  </div>
                  <span className="font-bold text-purple-900">
                    {field.sensors.pestTrapCount} moths / 24h
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                Soil: {field.soilCondition}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Health Memory Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Field Health Memory Chronological Timeline
              </h3>
              <p className="text-xs text-stone-500">
                Every validated outcome and management action strengthens future diagnostics
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
              {field.history.length} Logged Events
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {field.history.map((item, idx) => (
              <div key={item.id || idx} className="relative text-xs">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs" />

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-stone-500 text-[11px]">
                      {item.date} • {item.crop} ({item.growthStage})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.confirmationStatus === 'Expert Confirmed' || item.confirmationStatus === 'Lab Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.confirmationStatus}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm">{item.diagnosis}</h4>

                  <div className="text-stone-700">
                    <span className="font-semibold text-stone-900">Management Action: </span>
                    {item.managementActionTaken}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-[11px]">
                    <span className="text-stone-500">
                      Outcome: <strong className="text-stone-800">{item.followUpOutcome}</strong>
                    </span>
                    {item.notes && <span className="text-stone-500 italic">{item.notes}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Conditions & Sensors */}
      {activeTab === 'conditions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Weather & Canopy Microclimate</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px]">Canopy Temp</div>
                <div className="text-base font-bold text-stone-900 mt-1">{field.sensors.canopyTemp}°C</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px]">Leaf Wetness Duration</div>
                <div className="text-base font-bold text-blue-900 mt-1">
                  {field.weather.leafWetnessDurationHours || 0} Hours
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px]">Soil Moisture at 15cm</div>
                <div className="text-base font-bold text-emerald-900 mt-1">
                  {field.sensors.soilMoisture}%
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-500 text-[11px]">Sensor Heartbeat</div>
                <div className="text-base font-bold text-emerald-700 mt-1">
                  {field.sensors.status}
                </div>
              </div>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed">
              Prototype Note: Stale or offline sensors are flagged automatically and do not silently distort
              the agronomic risk engine.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">5-Day Weather Forecast & Implications</h3>
            <div className="space-y-2 text-xs">
              {field.weather.forecast.map((fc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100"
                >
                  <span className="font-bold w-12 text-stone-800">{fc.day}</span>
                  <span className="text-stone-600">{fc.condition}</span>
                  <span className="text-stone-500">
                    {fc.tempMax}° / {fc.tempMin}°C
                  </span>
                  <span className="font-semibold text-blue-700">{fc.rainfallChance}% Rain</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Nearby Clusters */}
      {activeTab === 'nearby' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900">
            Geospatial Hotspots & Nearby Surveillance Clusters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {hotspots.map((hs) => (
              <div key={hs.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{hs.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      hs.severity === 'Severe'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hs.status}
                  </span>
                </div>
                <div className="text-stone-600">
                  {hs.crop} • {hs.diseaseOrPest} ({hs.activeCases} active cases in {hs.taluka})
                </div>
                <p className="text-stone-500 text-[11px] leading-relaxed pt-1 border-t border-stone-200">
                  {hs.recommendedAdvisory}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
