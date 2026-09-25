import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Filter,
  Eye,
  Microscope,
  Send,
  Calendar,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { HealthCase, Field, ValidationRecord } from '../types';
import { api } from '../services/api';

interface ExtensionWorkerDashboardProps {
  cases: HealthCase[];
  fields: Field[];
  onCaseValidated: (caseId: string) => void;
  onOpenFollowUpModal: (caseId: string) => void;
}

export const ExtensionWorkerDashboard: React.FC<ExtensionWorkerDashboardProps> = ({
  cases,
  fields,
  onCaseValidated,
  onOpenFollowUpModal,
}) => {
  const [selectedCase, setSelectedCase] = useState<HealthCase | null>(cases[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<'CONFIRMED' | 'REJECTED' | 'REQUEST_MORE_INFO' | 'REFERRED_TO_LAB'>('CONFIRMED');
  const [expertNotes, setExpertNotes] = useState('');
  const [confirmedDiagnosis, setConfirmedDiagnosis] = useState('');
  const [recommendedTreatment, setRecommendedTreatment] = useState('');
  const [validating, setValidating] = useState(false);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.farmerName.toLowerCase().includes(q);
      const matchCrop = c.crop.toLowerCase().includes(q);
      const matchField = c.fieldName.toLowerCase().includes(q);
      const matchLocation = c.location.toLowerCase().includes(q);
      if (!matchName && !matchCrop && !matchField && !matchLocation) return false;
    }
    return true;
  });

  const pendingValidationsCount = cases.filter(
    (c) => c.status === 'VALIDATION REQUIRED' || c.status === 'UNDER REVIEW'
  ).length;
  const confirmedCount = cases.filter((c) => c.status === 'CONFIRMED').length;
  const highRiskCount = cases.filter((c) => c.priority === 'HIGH' || c.priority === 'CRITICAL').length;
  const followUpsDueCount = cases.filter((c) => c.status === 'CONFIRMED' || c.status === 'FOLLOW-UP').length;

  const handleOpenValidateModal = (c: HealthCase) => {
    setSelectedCase(c);
    setConfirmedDiagnosis(c.aiAnalysis?.possibleIssues?.[0]?.name || '');
    setRecommendedTreatment(c.aiAnalysis?.managementActions?.[0]?.action || '');
    setExpertNotes('');
    setIsValidationModalOpen(true);
  };

  const handleExecuteValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setValidating(true);
    try {
      await api.validateCase(selectedCase.id, {
        validatorName: 'Kavita Sharma',
        validatorRole: 'Extension Worker',
        result: validationResult,
        confirmedDiagnosis,
        notes: expertNotes || 'Field verification conducted. Symptom patterns matched agronomic profile.',
        recommendedTreatment,
      });

      setIsValidationModalOpen(false);
      onCaseValidated(selectedCase.id);
    } catch (err) {
      console.error(err);
      alert('Validation submission failed');
    } finally {
      setValidating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'VALIDATION REQUIRED':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'UNDER REVIEW':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'RESOLVED':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Agricultural Extension Officer Queue
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Validate farmer AI detections, triage high-risk outbreaks, and initiate containment protocols
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer, crop, village..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:outline-hidden"
            />
          </div>

          <select
            value={filterStatus}
            aria-label="Filter Cases by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="VALIDATION REQUIRED">Validation Required</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Extension Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Pending Validation
          </span>
          <div className="text-2xl font-bold text-purple-900 mt-1">{pendingValidationsCount} Cases</div>
          <span className="text-[10px] text-purple-700 font-medium">Awaiting extension inspection</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Confirmed Diagnoses
          </span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{confirmedCount} Cases</div>
          <span className="text-[10px] text-emerald-700 font-medium">Field memory updated</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Priority Outbreaks
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{highRiskCount} High Risk</div>
          <span className="text-[10px] text-amber-800 font-medium">Cluster escalation flag</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Scheduled Follow-ups
          </span>
          <div className="text-2xl font-bold text-blue-800 mt-1">{followUpsDueCount} Tasks</div>
          <span className="text-[10px] text-blue-700 font-medium">Canopy recovery check</span>
        </div>
      </div>

      {/* Main Grid: Priority Case Queue + Case Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Cases List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Assigned Field Case Queue ({filteredCases.length})
            </h3>
            <span className="text-[11px] text-stone-500">
              Sorted by Risk Priority & Severity
            </span>
          </div>

          <div className="space-y-3">
            {filteredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`bg-white border rounded-2xl p-4 shadow-2xs cursor-pointer transition-all flex flex-col sm:flex-row gap-4 ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/15'
                      : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={c.image}
                      alt={c.crop}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-500 font-semibold">{c.caseNumber}</span>
                        <span className="text-stone-400">•</span>
                        <span className="font-bold text-stone-900">{c.fieldName}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900">
                      {c.aiAnalysis?.possibleIssues?.[0]?.name || 'Suspected Crop Condition'}
                    </h4>

                    <p className="text-stone-600 line-clamp-2">
                      {c.farmerNotes || c.aiAnalysis?.observation}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                      <span>
                        Farmer: <strong>{c.farmerName}</strong> ({c.location})
                      </span>
                      <span className="font-semibold text-emerald-800">
                        AI Confidence: {c.aiAnalysis?.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Case Inspector & Actions */}
        <div className="space-y-4">
          {selectedCase ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Case Inspector
                </span>
                <h3 className="font-bold text-base text-stone-900 tracking-tight">
                  {selectedCase.caseNumber}
                </h3>
                <p className="text-stone-500 mt-0.5">
                  {selectedCase.farmerName} • {selectedCase.fieldName} ({selectedCase.crop})
                </p>
              </div>

              {/* High-res Image preview */}
              <div className="w-full h-44 rounded-xl overflow-hidden border border-stone-200">
                <img
                  src={selectedCase.image}
                  alt="Inspection"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* AI Reasoning Summary */}
              <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">AI Diagnostic Inference</span>
                  <span className="font-bold text-emerald-800">
                    {selectedCase.aiAnalysis?.confidence}% Confidence
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  {selectedCase.aiAnalysis?.observation}
                </p>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                  Evidence: {selectedCase.aiAnalysis?.evidence?.[0] || 'Visual foliar lesions'}
                </div>
              </div>

              {/* Prior Validation Records */}
              {selectedCase.validationHistory.length > 0 && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Validated by {selectedCase.validationHistory[0].validatorName}</span>
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Diagnosis: {selectedCase.validationHistory[0].confirmedDiagnosis}
                  </p>
                  <p className="text-[11px] text-emerald-800 italic">
                    "{selectedCase.validationHistory[0].notes}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleOpenValidateModal(selectedCase)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Validate or Escalate Case</span>
                </button>

                <button
                  onClick={() => onOpenFollowUpModal(selectedCase.id)}
                  className="w-full py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-600" />
                  <span>Log Field Visit / Follow-up</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
              Select any case from the queue to view full AI evidence and validation controls.
            </div>
          )}
        </div>
      </div>

      {/* Validation Action Modal */}
      {isValidationModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-stone-200 text-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Extension Officer Validation
                </h3>
                <p className="text-xs text-stone-500">
                  Case: {selectedCase.caseNumber} • {selectedCase.farmerName}
                </p>
              </div>
              <button
                onClick={() => setIsValidationModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteValidation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Validation Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValidationResult('CONFIRMED')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      validationResult === 'CONFIRMED'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'border-stone-200'
                    }`}
                  >
                    ✓ Confirm Diagnosis
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationResult('REFERRED_TO_LAB')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      validationResult === 'REFERRED_TO_LAB'
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'border-stone-200'
                    }`}
                  >
                    🔬 Refer to Agri Lab
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationResult('REQUEST_MORE_INFO')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      validationResult === 'REQUEST_MORE_INFO'
                        ? 'bg-amber-50 border-amber-600 text-amber-900'
                        : 'border-stone-200'
                    }`}
                  >
                    ? Request More Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationResult('REJECTED')}
                    className={`p-2 rounded-lg border text-left font-semibold ${
                      validationResult === 'REJECTED'
                        ? 'bg-red-50 border-red-600 text-red-900'
                        : 'border-stone-200'
                    }`}
                  >
                    ✕ Reject / Not a Disease
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Confirmed Diagnosis / Condition Name
                </label>
                <input
                  type="text"
                  required
                  value={confirmedDiagnosis}
                  onChange={(e) => setConfirmedDiagnosis(e.target.value)}
                  placeholder="e.g. Soybean Rust (Phakopsora pachyrhizi)"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Extension Officer Notes & Microscopic Observation
                </label>
                <textarea
                  rows={2}
                  value={expertNotes}
                  onChange={(e) => setExpertNotes(e.target.value)}
                  placeholder="e.g. Inspected 15 plants; verified urediniospore morphology under 20x hand lens. Advised perimeter bio-fungicide barrier."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Prescribed Safe IPM Intervention Guidance
                </label>
                <input
                  type="text"
                  value={recommendedTreatment}
                  onChange={(e) => setRecommendedTreatment(e.target.value)}
                  placeholder="e.g. Apply registered bio-formulation Trichoderma viride + clear border weeds"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950">
                <strong>Memory Update:</strong> Confirming this diagnosis will automatically register this event
                into <em>{selectedCase.fieldName}</em>'s permanent Field Health Memory.
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsValidationModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={validating}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs disabled:opacity-50"
                >
                  {validating ? 'Submitting...' : 'Save & Publish Validation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
