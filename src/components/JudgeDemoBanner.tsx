import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, ShieldAlert, Cpu, FolderArchive } from 'lucide-react';
import { api } from '../services/api';

interface JudgeDemoBannerProps {
  onScenarioTriggered: (scenarioId: string) => void;
  onReset: () => void;
  onDownloadZip?: () => void;
}

export const JudgeDemoBanner: React.FC<JudgeDemoBannerProps> = ({
  onScenarioTriggered,
  onReset,
  onDownloadZip,
}) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    {
      id: 'scenario-1',
      num: '1',
      title: 'AI Scan & Validation Request',
      desc: 'Leaf image analyzed → 78% confidence → escalated for expert validation',
    },
    {
      id: 'scenario-2',
      num: '2',
      title: 'Weather + Stage Risk Spike',
      desc: 'RH 92% + 28mm rain + R3 stage → Fungal risk escalated to HIGH',
    },
    {
      id: 'scenario-3',
      num: '3',
      title: 'Nearby Cluster Hotspot',
      desc: 'Multi-case cluster triggers regional outbreak notice to extension',
    },
    {
      id: 'scenario-4',
      num: '4',
      title: 'Expert Confirmation & IPM',
      desc: 'Agronomist verifies diagnosis → field memory updated → advisory issued',
    },
    {
      id: 'scenario-5',
      num: '5',
      title: 'Follow-up Closes Loop',
      desc: 'Farmer logs improvement → case resolved → outcome stored in memory',
    },
  ];

  const handleRunScenario = async (scId: string) => {
    setLoading(true);
    setActiveScenario(scId);
    try {
      await api.runJudgeScenario(scId);
      onScenarioTriggered(scId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setActiveScenario(null);
    try {
      await api.resetDemoData();
      onReset();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            SIH 2026 Prototype
          </span>
          <span className="hidden sm:inline text-emerald-200 font-medium">
            Crop Health Intelligence Platform: 5-Minute Evaluation Scenarios
          </span>
        </div>

        {/* Scenarios Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-emerald-400 font-medium mr-1 hidden md:inline">Quick Scenarios:</span>
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleRunScenario(sc.id)}
              disabled={loading}
              title={sc.desc}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeScenario === sc.id
                  ? 'bg-emerald-500 text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-emerald-950/40 flex items-center justify-center text-[10px] font-bold">
                {sc.num}
              </span>
              <span className="hidden lg:inline">{sc.title}</span>
              <span className="lg:hidden">S{sc.num}</span>
            </button>
          ))}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            disabled={loading}
            className="ml-2 px-2.5 py-1 rounded-md bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 flex items-center gap-1 transition-colors"
            title="Reset to fresh demo seed state"
          >
            <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Download Code ZIP Button */}
          {onDownloadZip ? (
            <button
              onClick={onDownloadZip}
              className="ml-1 px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download full project source code as .ZIP"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          ) : (
            <a
              href="/api/download-zip"
              download="farmers-friend-codebase.zip"
              className="ml-1 px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download full project source code as .ZIP"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
