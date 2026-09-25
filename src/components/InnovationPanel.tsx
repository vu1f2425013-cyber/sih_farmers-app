import React from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  RotateCcw,
  Activity,
  ArrowRight,
  HelpCircle,
  Database,
  Cpu,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const InnovationPanel: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Headline */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
          Smart India Hackathon 2026 Innovation Architecture
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          “Every field builds its own crop-health intelligence over time.”
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Why FARMER'S FRIEND avoids the pitfalls of naive "image-to-disease-name" apps by unifying
          multimodal vision, local agronomic risk rules, and persistent field memory.
        </p>
      </div>

      {/* The 4 Architectural Innovations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Innovation 1 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
            01
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Persistent Field Health Memory
          </h3>
          <p className="text-stone-600 leading-relaxed">
            Rather than treating every scan as an isolated one-off query, each registered field maintains
            its own persistent crop-health biography: past fungal and pest outbreaks, microclimate history,
            and confirmed management outcomes across multiple seasons.
          </p>
        </div>

        {/* Innovation 2 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base">
            02
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Contextual Case Analysis (Image + Environment)
          </h3>
          <p className="text-stone-600 leading-relaxed">
            AI reasoning fuses foliar leaf images with real-time relative humidity, recent rainfall, crop
            phenology stage, soil moisture, and nearby cluster cases. An identical visual spot is interpreted
            differently under 88% humidity vs 45% dry weather.
          </p>
        </div>

        {/* Innovation 3 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-base">
            03
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Confidence-Based Escalation (Trust Boundary)
          </h3>
          <p className="text-stone-600 leading-relaxed">
            The platform never fabricates false scientific certainty. If confidence is moderate or if high-risk
            pathogens are suspected, the case is automatically escalated to local Extension Officers or
            Agricultural University Labs before chemical sprays are initiated.
          </p>
        </div>

        {/* Innovation 4 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
            04
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Closed-Loop Outcome Feedback
          </h3>
          <p className="text-stone-600 leading-relaxed">
            Every intervention is tracked through structured follow-ups (improving, stable, worsening, resolved).
            The confirmed outcome is committed back to the field's health profile, creating an evidence loop
            that informs future diagnostic assessments.
          </p>
        </div>
      </div>

      {/* Interactive System Flow Architecture Diagram */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">
            Engineering Architecture
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            The Crop Health Intelligence Synthesis Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center text-xs">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1">
            <span className="font-bold text-emerald-400 block text-[11px]">1. INPUT SIGNALS</span>
            <p className="text-stone-300 text-[11px]">
              Leaf photo + RH% + Rain + Stage + Sensors
            </p>
          </div>

          <div className="hidden sm:flex justify-center text-stone-500 font-bold">→</div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 space-y-1">
            <span className="font-bold text-emerald-300 block text-[11px]">2. HYBRID REASONING</span>
            <p className="text-emerald-100 text-[11px]">
              Gemini Vision + Agronomic Rules Engine
            </p>
          </div>

          <div className="hidden sm:flex justify-center text-stone-500 font-bold">→</div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-stone-800 border border-stone-700 space-y-1">
            <span className="font-bold text-purple-300 block text-[11px]">3. FIELD MEMORY</span>
            <p className="text-stone-300 text-[11px]">
              Cross-checked with 2-year plot history
            </p>
          </div>
        </div>

        {/* Second row of loop */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-stone-300 text-center sm:text-left">
            <span className="font-bold text-white block">Persistent Intelligence Loop:</span>
            <span className="text-emerald-400 font-mono text-[11px]">
              DETECT → VALIDATE → ACT → MONITOR → LEARN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-medium text-[11px]">
              Zero Fabricated Dosage
            </span>
            <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-medium text-[11px]">
              Role-Based Governance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
