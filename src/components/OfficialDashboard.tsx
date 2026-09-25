import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldAlert,
  Users,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Activity,
  Calendar,
} from 'lucide-react';
import { HealthCase, Hotspot, Field } from '../types';

interface OfficialDashboardProps {
  cases: HealthCase[];
  hotspots: Hotspot[];
  fields: Field[];
  onSelectHotspotTab: () => void;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({
  cases,
  hotspots,
  fields,
  onSelectHotspotTab,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalCases = cases.length;
  const confirmedCount = cases.filter((c) => c.status === 'CONFIRMED').length;
  const suspectedCount = cases.filter(
    (c) => c.status === 'VALIDATION REQUIRED' || c.status === 'UNDER REVIEW'
  ).length;
  const resolvedCount = cases.filter((c) => c.status === 'RESOLVED').length;

  const handleExportBulletin = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              State & District Agricultural Surveillance Dashboard
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Official Command
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time phytosanitary intelligence, outbreak cluster trajectory, and extension triage
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedDistrict}
            aria-label="Filter by District"
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-hidden"
          >
            <option>All Districts (Central Division)</option>
            <option>Indore (MP)</option>
            <option>Wardha (MH)</option>
            <option>Raichur (KA)</option>
            <option>Amravati (MH)</option>
          </select>

          <button
            onClick={handleExportBulletin}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Bulletin Exported' : 'Export Surveillance Bulletin'}</span>
          </button>
        </div>
      </div>

      {/* Surveillance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Monitored Cases
          </span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalCases} Total</div>
          <span className="text-[10px] text-stone-500">Across 5 crop commodities</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Confirmed Pathogens
          </span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{confirmedCount} Verified</div>
          <span className="text-[10px] text-emerald-700 font-medium">Under verified containment</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Pending Extension Check
          </span>
          <div className="text-2xl font-bold text-purple-900 mt-1">{suspectedCount} Suspected</div>
          <span className="text-[10px] text-purple-700 font-medium">Awaiting ground validation</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Active Geospatial Hotspots
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{hotspots.length} Clusters</div>
          <span className="text-[10px] text-amber-700 font-medium">3 in containment protocol</span>
        </div>
      </div>

      {/* Disease Distribution & Commodity Vulnerability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {/* Card 1: Disease / Pest Category Distribution */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              Pathogen & Pest Distribution
            </h3>
            <span className="text-stone-400 text-[11px]">Active Season</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Fungal Pathogens (Rust, Blight, Mildew)</span>
                <span className="text-emerald-800">45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="w-[45%] h-full bg-emerald-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Insect Pests (Bollworm, Borers, Thrips)</span>
                <span className="text-amber-800">30%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="w-[30%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Bacterial Diseases (Xanthomonas Blight)</span>
                <span className="text-blue-800">15%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="w-[15%] h-full bg-blue-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Abiotic / Nutrient Stress</span>
                <span className="text-stone-600">10%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="w-[10%] h-full bg-stone-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Cases by Major Crop */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              Crop Commodity Surveillance
            </h3>
            <span className="text-stone-400 text-[11px]">Area Proportion</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Soybean (Kharif)</span>
                <span className="text-[10px] text-stone-500">Sanwer / Indore taluka</span>
              </div>
              <span className="font-bold text-stone-800">7 Active Cases</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Cotton (Bt Hybrids)</span>
                <span className="text-[10px] text-stone-500">Hinganghat / Wardha taluka</span>
              </div>
              <span className="font-bold text-amber-700">14 Active Cases</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Paddy / Rice</span>
                <span className="text-[10px] text-stone-500">Sindhanur / Raichur basin</span>
              </div>
              <span className="font-bold text-blue-700">6 Active Cases</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Tomato & Chilli</span>
                <span className="text-[10px] text-stone-500">Nagda & Chandur blocks</span>
              </div>
              <span className="font-bold text-stone-800">4 Active Cases</span>
            </div>
          </div>
        </div>

        {/* Card 3: Extension Cadre Response Workload */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              Extension Officer Cadre Workload
            </h3>
            <span className="text-emerald-700 font-bold text-[11px]">94% Avg Response</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-stone-900">Kavita Sharma</div>
                <div className="text-[10px] text-stone-500">Sanwer (Indore) • 4 active cases</div>
              </div>
              <span className="text-emerald-800 font-bold">96% on-time</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-stone-900">Dr. Sanjay Wankhede</div>
                <div className="text-[10px] text-stone-500">Hinganghat (Wardha) • 7 active cases</div>
              </div>
              <span className="text-emerald-800 font-bold">98% on-time</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-stone-900">Basavaraj Patil</div>
                <div className="text-[10px] text-stone-500">Sindhanur (Raichur) • 5 active cases</div>
              </div>
              <span className="text-amber-800 font-bold">88% on-time</span>
            </div>
          </div>

          <button
            onClick={onSelectHotspotTab}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs transition-colors"
          >
            Open Regional Hotspot Geospatial Map
          </button>
        </div>
      </div>

      {/* Official Early Warning Bulletin */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>State Phytosanitary Early Warning & Advisory Notice</span>
          </div>
          <span className="text-xs text-emerald-300 font-mono">Issued: 23-Sep-2026</span>
        </div>

        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          Due to sustained high relative humidity (&gt;82%) across Indore and Wardha divisions, agricultural officers
          must enforce village-level community light-trapping and foliar inspections. Blanket pesticide spraying
          is strictly discouraged; all interventions must prioritize registered IPM inputs with prior extension validation.
        </p>
      </div>
    </div>
  );
};
