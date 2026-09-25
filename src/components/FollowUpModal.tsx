import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Camera,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { HealthCase } from '../types';
import { api } from '../services/api';

interface FollowUpModalProps {
  caseItem: HealthCase | null;
  isOpen: boolean;
  onClose: () => void;
  onFollowUpSaved: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  onFollowUpSaved,
}) => {
  if (!isOpen || !caseItem) return null;

  const [symptomImproved, setSymptomImproved] = useState<boolean>(true);
  const [spreadIncreased, setSpreadIncreased] = useState<boolean>(false);
  const [newSymptomsObserved, setNewSymptomsObserved] = useState('');
  const [status, setStatus] = useState<'IMPROVING' | 'STABLE' | 'WORSENING' | 'RESOLVED'>('IMPROVING');
  const [farmerNotes, setFarmerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitFollowUp(caseItem.id, {
        symptomImproved,
        spreadIncreased,
        newSymptomsObserved,
        status,
        farmerNotes: farmerNotes || 'Follow-up observation verified on field plot.',
      });

      setSuccess(true);
      onFollowUpSaved();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to log follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-stone-200 text-stone-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Submit Field Follow-up Observation
            </h3>
            <p className="text-xs text-stone-500">
              {caseItem.caseNumber} • {caseItem.fieldName} ({caseItem.crop})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-stone-100 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick status radio pills */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">
              Current Field Health Trajectory
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'IMPROVING', label: '🌱 Improving', color: 'emerald' },
                { id: 'STABLE', label: '⚖️ Stable', color: 'blue' },
                { id: 'WORSENING', label: '⚠️ Worsening', color: 'amber' },
                { id: 'RESOLVED', label: '✅ Resolved', color: 'emerald' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setStatus(st.id as any);
                    if (st.id === 'RESOLVED' || st.id === 'IMPROVING') {
                      setSymptomImproved(true);
                      setSpreadIncreased(false);
                    } else if (st.id === 'WORSENING') {
                      setSymptomImproved(false);
                      setSpreadIncreased(true);
                    }
                  }}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    status === st.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <span className="block font-semibold text-stone-700 mb-1">
                Are symptoms improving?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSymptomImproved(true)}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${
                    symptomImproved ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setSymptomImproved(false)}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${
                    !symptomImproved ? 'bg-red-700 text-white' : 'bg-white border border-stone-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <span className="block font-semibold text-stone-700 mb-1">
                Has spread to upper leaves?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSpreadIncreased(true)}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${
                    spreadIncreased ? 'bg-red-700 text-white' : 'bg-white border border-stone-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setSpreadIncreased(false)}
                  className={`px-3 py-1 rounded-md font-bold text-xs ${
                    !spreadIncreased ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              New Symptoms or Secondary Manifestations (If any)
            </label>
            <input
              type="text"
              value={newSymptomsObserved}
              onChange={(e) => setNewSymptomsObserved(e.target.value)}
              placeholder="e.g. None; lesion pustules dried out into brown crust."
              className="w-full px-3 py-2 rounded-lg border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Farmer Observations & Management Inputs Applied
            </label>
            <textarea
              rows={2}
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              placeholder="e.g. Cleared border weeds and applied registered bio-formulation. Morning dew dried faster."
              className="w-full px-3 py-2 rounded-lg border border-stone-300"
            />
          </div>

          {/* Innovation Note */}
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Outcome Feedback Loop:</strong> This follow-up observation directly strengthens{' '}
              <em>{caseItem.fieldName}</em>'s persistent field health memory for future diagnostic accuracy.
            </span>
          </div>

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-950 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Follow-up logged successfully! Case status updated.</span>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Recording...' : 'Submit Follow-up'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
