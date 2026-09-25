import React from 'react';
import {
  Sparkles,
  Droplets,
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Leaf,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Field, HealthCase, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface AdvisorViewProps {
  fields: Field[];
  cases: HealthCase[];
  selectedField: Field;
  language: Language;
  onOpenScanModal: (fieldId?: string) => void;
  onOpenFollowUpModal: (caseId: string) => void;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  fields,
  cases,
  selectedField,
  language,
  onOpenScanModal,
  onOpenFollowUpModal,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🤖
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Crop Health & IPM Advisor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Actionable decision support based on weather, crop stage, soil signals & AI analysis
          </p>
        </div>

        <button
          onClick={() => onOpenScanModal(selectedField?.id)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Crop Scan</span>
        </button>
      </div>

      {/* Primary Today's Action Advisory */}
      <div className="bg-emerald-950 text-white p-5 sm:p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-emerald-800 text-emerald-200 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 border border-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              TOP AI ADVISORY TODAY
            </span>
            <span className="text-xs text-emerald-300 font-mono">Confidence: 87%</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              💧 Delay Next Irrigation for {selectedField?.name || 'Field'} (24h)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
              Rainfall is forecasted in Hinganghat within 24 hours (82% probability). Soil moisture is at an optimal 61%. Delaying irrigation prevents leaf wetness duration spike and root hypoxia.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-emerald-900/60 border border-emerald-800 p-2.5 rounded-xl text-xs">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Soil Moisture</span>
              <strong className="text-white font-bold text-sm">61% (Optimal)</strong>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800 p-2.5 rounded-xl text-xs">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Rain Forecast</span>
              <strong className="text-white font-bold text-sm">Light-Mod Rain</strong>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800 p-2.5 rounded-xl text-xs">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Pest Risk</span>
              <strong className="text-emerald-300 font-bold text-sm">Moderate (Rust)</strong>
            </div>
            <div className="bg-emerald-900/60 border border-emerald-800 p-2.5 rounded-xl text-xs">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Recommended Action</span>
              <strong className="text-white font-bold text-sm">Hold Watering</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Field Diagnostics & Recommended IPM Protocols */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Integrated Pest & Disease Management (IPM) Prescriptions</span>
        </h2>

        {cases.map((c) => {
          const mainIssueName = c.aiAnalysis.possibleIssues[0]?.name || c.aiAnalysis.observation;
          const severityLevel = c.aiAnalysis.severity;
          const latestValidation = c.validationHistory && c.validationHistory.length > 0
            ? c.validationHistory[c.validationHistory.length - 1]
            : null;

          return (
            <div
              key={c.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-base">{mainIssueName}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        severityLevel === 'Severe'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {severityLevel} Severity
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded border border-emerald-200">
                      Status: {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Field: <strong className="text-stone-800">{c.fieldName}</strong> • Scanned on {c.createdAt}
                  </p>
                </div>

                {c.status === 'CONFIRMED' && (
                  <button
                    onClick={() => onOpenFollowUpModal(c.id)}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Log Follow-up Check</span>
                  </button>
                )}
              </div>

              {/* AI Diagnostics Rationale */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                <strong className="text-stone-900 block font-bold text-xs">
                  AI Diagnostic Reasoning & Supporting Evidence:
                </strong>
                <p className="text-stone-700 leading-relaxed">{c.aiAnalysis.observation}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.aiAnalysis.evidence.map((ev: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white border border-stone-200 text-stone-700 rounded text-[11px] font-medium"
                    >
                      ✓ {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescribed Actions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Recommended IPM Management Actions:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {c.aiAnalysis.managementActions.map((mAction, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="mt-0.5 font-medium">{mAction.action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Human Expert Validation Callout */}
              {latestValidation ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-3 text-xs">
                  <UserCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-950 block font-bold">
                      Validated by {latestValidation.validatorName} ({latestValidation.validatorRole})
                    </strong>
                    <p className="text-emerald-800 mt-0.5">{latestValidation.notes}</p>
                    <span className="text-[10px] text-emerald-700 block mt-1">
                      Verified on {latestValidation.timestamp}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-amber-900 font-medium">
                      Awaiting Agronomist / Extension Officer physical plot verification.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
