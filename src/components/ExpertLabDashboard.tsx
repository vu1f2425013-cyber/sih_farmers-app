import React, { useState } from 'react';
import {
  Microscope,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  ShieldAlert,
  ArrowRight,
  FlaskConical,
  Eye,
  UserCheck,
} from 'lucide-react';
import { HealthCase } from '../types';
import { api } from '../services/api';

interface ExpertLabDashboardProps {
  cases: HealthCase[];
  onCaseValidated: (caseId: string) => void;
}

export const ExpertLabDashboard: React.FC<ExpertLabDashboardProps> = ({
  cases,
  onCaseValidated,
}) => {
  // Referred or under review cases
  const referredCases = cases.filter(
    (c) =>
      c.status === 'UNDER REVIEW' ||
      c.status === 'VALIDATION REQUIRED' ||
      c.aiAnalysis?.needsLabReferral
  );

  const [selectedCase, setSelectedCase] = useState<HealthCase | null>(referredCases[0] || cases[0] || null);
  const [labDiagnosis, setLabDiagnosis] = useState('');
  const [microscopeNotes, setMicroscopeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleConfirmDiagnosis = async (result: 'CONFIRMED' | 'REJECTED') => {
    if (!selectedCase) return;
    setIsSubmitting(true);
    setSuccessMessage(false);

    try {
      await api.validateCase(selectedCase.id, {
        validatorName: 'Dr. Meera Nambiar (Senior Plant Pathologist)',
        validatorRole: 'Lab Pathologist',
        result,
        confirmedDiagnosis: labDiagnosis || selectedCase.aiAnalysis.possibleIssues[0]?.name || 'Lab Verified Diagnosis',
        notes: microscopeNotes || 'Microscopic spore scrape mount and slide staining verified diagnostic fungal/bacterial structures.',
        recommendedTreatment: 'Proceed with selective bio-formulation or registered IPM fungicide as per state university package of practices.',
      });

      setSuccessMessage(true);
      onCaseValidated(selectedCase.id);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Lab validation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              State Agriculture University Pathology Laboratory
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Laboratory Diagnostics
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Secondary microscopic validation, culture assays, and confirmed disease certificate issuance
          </p>
        </div>

        <span className="px-3 py-1 bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold">
          {referredCases.length} Complex Cases Referred
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Cases list */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-700 uppercase tracking-wider text-xs">
            Referred Diagnostic Samples ({referredCases.length})
          </h3>

          <div className="space-y-2">
            {referredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCase(c);
                    setLabDiagnosis(c.aiAnalysis?.possibleIssues?.[0]?.name || '');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15'
                      : 'bg-white border-stone-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-stone-500 text-[11px] font-semibold">{c.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                      {c.crop}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {c.aiAnalysis?.possibleIssues?.[0]?.name || 'Suspected Condition'}
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-1">
                    Farmer: {c.farmerName} • {c.location}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Sample Examination Desk */}
        <div className="lg:col-span-2 space-y-4">
          {selectedCase ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                    Diagnostic Bench Review
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedCase.caseNumber} • {selectedCase.fieldName}
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Submitted by {selectedCase.farmerName} ({selectedCase.farmerPhone})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 font-mono font-bold">
                  Stage: {selectedCase.growthStage}
                </span>
              </div>

              {/* Sample Photo & Microscopic View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-stone-200 h-48 bg-stone-100">
                  <img
                    src={selectedCase.image}
                    alt="Field Specimen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">
                      Field Environmental Profile
                    </span>
                    <ul className="space-y-1 text-stone-600 text-[11px]">
                      <li>• Variety: {selectedCase.variety}</li>
                      <li>• Reported Symptoms: "{selectedCase.farmerNotes || selectedCase.aiAnalysis.observation}"</li>
                      <li>• AI Initial Inference: {selectedCase.aiAnalysis.possibleIssues[0]?.name} ({selectedCase.aiAnalysis.confidence}%)</li>
                      <li>• Proximity Cluster: Sanwer Taluka</li>
                    </ul>
                  </div>
                  <div className="text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200">
                    Laboratory Protocol: Verified per ICAR standard mycological / bacteriological procedure.
                  </div>
                </div>
              </div>

              {/* Pathologist Verification Form */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <FlaskConical className="w-4 h-4 text-blue-700" />
                  <span>Official Pathology Laboratory Certification</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Verified Pathological Identification
                  </label>
                  <input
                    type="text"
                    value={labDiagnosis}
                    onChange={(e) => setLabDiagnosis(e.target.value)}
                    placeholder="e.g. Soybean Rust (Phakopsora pachyrhizi) - Confirmed"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Microscopic / Culture Slide Notes
                  </label>
                  <textarea
                    rows={2}
                    value={microscopeNotes}
                    onChange={(e) => setMicroscopeNotes(e.target.value)}
                    placeholder="e.g. Microscopic inspection under 40x magnification confirmed subglobose to ellipsoid urediniospores with echinulate cell walls. No secondary bacterial contamination detected."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  />
                </div>

                {successMessage && (
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-950 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Lab certificate published! Field Health Memory updated and farmer notified.</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleConfirmDiagnosis('REJECTED')}
                    disabled={isSubmitting}
                    className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg transition-colors"
                  >
                    Reject Diagnosis
                  </button>
                  <button
                    onClick={() => handleConfirmDiagnosis('CONFIRMED')}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Certifying...' : 'Issue Verified Lab Certificate'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-stone-500">
              Select a sample from the referred queue to begin laboratory certification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
