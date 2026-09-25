import React from 'react';
import {
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Activity,
  Droplets,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface ExplainableAIPanelProps {
  analysis: AIAnalysisResult;
  onValidationClick?: () => void;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  analysis,
  onValidationClick,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH RISK':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MODERATE RISK':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'VALIDATION REQUIRED':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header with Risk & Confidence Band */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Crop Health Intelligence & Decision Support
            </h4>
            <p className="text-xs text-stone-500">
              Multimodal Vision + Field Microclimate + Agronomic Rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence Badge */}
          <div className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
            Confidence: <span className="text-emerald-700 font-bold">{analysis.confidence}%</span>
          </div>
          {/* Risk Level Badge */}
          <div
            className={`px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide ${getRiskColor(
              analysis.riskLevel
            )}`}
          >
            {analysis.riskLevel}
          </div>
        </div>
      </div>

      {/* Observation Summary */}
      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70 text-xs text-stone-700">
        <span className="font-semibold text-stone-900 mr-1">Visible Symptom:</span>
        {analysis.observation}
      </div>

      {/* DATA AVAILABILITY INDICATOR (SIH Transparent AI Standard) */}
      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Data Used & Context Transparency
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Verified signals used in inference</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Crop
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Variety
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Growth stage
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Image
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Weather
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
            <span className="text-emerald-600 font-bold">✓</span> Field history
          </div>
          {analysis.dataAvailability?.soilData ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
              <span className="text-emerald-600 font-bold">✓</span> Soil test data
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-stone-500 bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
              <span className="text-stone-400">○</span> Soil data unavailable
            </div>
          )}
          {analysis.dataAvailability?.sensorData ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
              <span className="text-emerald-600 font-bold">✓</span> In-situ sensors
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-stone-500 bg-white px-2.5 py-1.5 rounded-lg border border-stone-200/70">
              <span className="text-stone-400">○</span> Sensor data unavailable
            </div>
          )}
        </div>
      </div>

      {/* Two Column Section: Why this assessment? & What could change this? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Why this assessment? (Supporting signals) */}
        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Why this assessment? (Supporting Signals)</span>
          </div>
          <ul className="space-y-1.5 text-stone-700">
            {analysis.evidence.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What could change this assessment? (Uncertainty & Variables) */}
        <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-100">
          <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>What could change this assessment?</span>
          </div>
          <ul className="space-y-1.5 text-stone-700">
            {analysis.whatCouldChangeThis.map((change, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">↻</span>
                <span>{change}</span>
              </li>
            ))}
            {analysis.uncertainty.map((unc, idx) => (
              <li key={`unc-${idx}`} className="flex items-start gap-1.5 text-stone-500 italic">
                <span className="text-stone-400 font-bold">?</span>
                <span>{unc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transparent Agronomic Rule Breakdown */}
      {analysis.ruleBreakdown && (
        <div className="pt-2 border-t border-stone-100">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Transparent Risk Signal Breakdown (Prototype Weights)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
              <div className="text-stone-500 text-[10px]">Weather</div>
              <div className="font-bold text-emerald-900 mt-0.5">{analysis.ruleBreakdown.weatherScore} / 30</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
              <div className="text-stone-500 text-[10px]">Crop Stage</div>
              <div className="font-bold text-emerald-900 mt-0.5">{analysis.ruleBreakdown.cropStageScore} / 20</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
              <div className="text-stone-500 text-[10px]">Field Memory</div>
              <div className="font-bold text-emerald-900 mt-0.5">{analysis.ruleBreakdown.historyScore} / 20</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
              <div className="text-stone-500 text-[10px]">Local Hotspot</div>
              <div className="font-bold text-emerald-900 mt-0.5">{analysis.ruleBreakdown.localCasesScore} / 15</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200/60">
              <div className="text-stone-500 text-[10px]">Sensor Telemetry</div>
              <div className="font-bold text-emerald-900 mt-0.5">{analysis.ruleBreakdown.sensorScore} / 15</div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Guidance Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>
            {analysis.needsExpertValidation
              ? 'Status: Suspected condition. Extension worker validation recommended before chemical interventions.'
              : 'Status: Actionable guidance provided. Continue routine monitoring.'}
          </span>
        </div>

        {analysis.needsExpertValidation && onValidationClick && (
          <button
            onClick={onValidationClick}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Request Extension Validation
          </button>
        )}
      </div>
    </div>
  );
};
