import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  ShieldAlert,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar,
  Eye,
  Radio,
} from 'lucide-react';
import { Hotspot, IssueCategory } from '../types';

interface HotspotMapProps {
  hotspots: Hotspot[];
  onSelectHotspot?: (hotspot: Hotspot) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  hotspots,
  onSelectHotspot,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredHotspots = hotspots.filter((h) => {
    if (categoryFilter !== 'all' && h.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && h.severity !== severityFilter) return false;
    return true;
  });

  const totalActiveCases = hotspots.reduce((acc, h) => acc + h.activeCases, 0);
  const totalConfirmedCases = hotspots.reduce((acc, h) => acc + h.confirmedCases, 0);
  const totalAcres = hotspots.reduce((acc, h) => acc + h.affectedAcresApprox, 0);

  // Map coordinates projection for Indian agricultural zones (MP / Maharashtra / Karnataka)
  // Mapping Lat [15 to 24] and Lng [75 to 79] into SVG coordinates [0 to 100%]
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 15.0;
    const maxLat = 24.5;
    const minLng = 74.8;
    const maxLng = 79.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 75 + 12;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'Severe':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Crop Health Hotspots & Outbreak Clusters
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Geospatial surveillance combining farmer alerts, sensor triggers, and extension verifications
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={categoryFilter}
              aria-label="Filter by Pathogen / Pest Type"
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Issue Categories</option>
              <option value="fungal disease">Fungal Diseases</option>
              <option value="insect pest">Insect Pests</option>
              <option value="bacterial disease">Bacterial Diseases</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <select
              value={severityFilter}
              aria-label="Filter by Severity"
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent font-medium text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="Severe">Severe</option>
              <option value="Moderate">Moderate</option>
            </select>
          </div>
        </div>
      </div>

      {/* TOP SUMMARY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Active Hotspots
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{hotspots.length} Clusters</div>
          <span className="text-[10px] text-amber-700 font-medium">Under active containment</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Active Case Reports
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{totalActiveCases} Cases</div>
          <span className="text-[10px] text-stone-500">Across 4 monitored talukas</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Confirmed Outbreaks
          </span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{totalConfirmedCases} Verified</div>
          <span className="text-[10px] text-emerald-700 font-medium">Lab & KVK field inspected</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Surveillance Perimeter
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">~{totalAcres.toFixed(0)} Acres</div>
          <span className="text-[10px] text-stone-500">Buffer advisory radius</span>
        </div>
      </div>

      {/* Map Canvas + Details Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 bg-stone-900 rounded-2xl border border-stone-800 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2 bg-stone-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-800 text-stone-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Regional Agronomic Geospatial Grid (Central India)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-stone-400 bg-stone-950/70 px-2 py-1 rounded">
              <span>● Red: Severe Outbreak</span>
              <span>● Amber: Emerging Cluster</span>
            </div>
          </div>

          {/* Interactive SVG Projection Canvas */}
          <div className="relative w-full h-80 sm:h-96 my-2">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#262626" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="hotspotGlowRed" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="hotspotGlowAmber" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100" height="100" fill="url(#grid)" />

              {/* Simplified stylized state boundaries outline */}
              <path
                d="M 20,18 Q 45,15 70,22 T 85,45 Q 82,75 55,85 T 25,70 Q 15,40 20,18 Z"
                fill="#1c2520"
                stroke="#2e4336"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />

              {/* District Labels */}
              <text x="24" y="28" fill="#4b5563" fontSize="3" fontWeight="bold">INDORE REGION</text>
              <text x="56" y="52" fill="#4b5563" fontSize="3" fontWeight="bold">WARDHA CLUSTER</text>
              <text x="32" y="78" fill="#4b5563" fontSize="3" fontWeight="bold">RAICHUR BASIN</text>

              {/* Hotspot Nodes */}
              {filteredHotspots.map((hs) => {
                const { x, y } = projectCoords(hs.lat, hs.lng);
                const isSelected = selectedHotspot?.id === hs.id;
                const isSevere = hs.severity === 'Severe' || hs.severity === 'Critical';

                return (
                  <g
                    key={hs.id}
                    onClick={() => {
                      setSelectedHotspot(hs);
                      onSelectHotspot?.(hs);
                    }}
                    className="cursor-pointer transition-all group"
                  >
                    {/* Pulsating Heat Buffer Radius */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 10 : 7}
                      fill={isSevere ? 'url(#hotspotGlowRed)' : 'url(#hotspotGlowAmber)'}
                      className={isSevere ? 'animate-pulse' : ''}
                    />

                    {/* Outer Cluster ring */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 4 : 3}
                      fill={isSevere ? '#dc2626' : '#d97706'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '1' : '0.6'}
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Label Badge */}
                    <text
                      x={x}
                      y={y - 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="2.6"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-sm"
                    >
                      {hs.crop}: {hs.activeCases}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer status */}
          <div className="z-10 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800 pt-2">
            <span>Lat: 20.8°N • Long: 77.2°E • Coordinate Mesh Active</span>
            <span>Click any node to inspect containment protocol</span>
          </div>
        </div>

        {/* Hotspot Details Inspector Drawer */}
        <div className="space-y-4">
          {selectedHotspot ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Selected Outbreak Node
                  </span>
                  <h3 className="font-bold text-base text-stone-900 tracking-tight">
                    {selectedHotspot.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {selectedHotspot.taluka} Taluka, {selectedHotspot.district} District
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadge(
                    selectedHotspot.severity
                  )}`}
                >
                  {selectedHotspot.status}
                </span>
              </div>

              {/* Case Stats in this cluster */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 block">Active Cases</span>
                  <span className="text-base font-bold text-amber-800">{selectedHotspot.activeCases}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 block">Confirmed Cases</span>
                  <span className="text-base font-bold text-emerald-800">{selectedHotspot.confirmedCases}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 block">Affected Area</span>
                  <span className="text-sm font-bold text-stone-900">{selectedHotspot.affectedAcresApprox} Acres</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-500 block">Alert Radius</span>
                  <span className="text-sm font-bold text-stone-900">{selectedHotspot.radiusKm} km</span>
                </div>
              </div>

              {/* Diagnosis details */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Host Crop:</span>
                  <strong className="text-stone-900">{selectedHotspot.crop}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pathogen / Pest:</span>
                  <strong className="text-stone-900">{selectedHotspot.diseaseOrPest}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Latest Report:</span>
                  <span className="text-stone-700">{selectedHotspot.lastReportedDate}</span>
                </div>
              </div>

              {/* Containment advisory */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>Regional Containment Advisory</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900">
                  {selectedHotspot.recommendedAdvisory}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
              Select any hotspot on the map or filter list to inspect containment details.
            </div>
          )}

          {/* Quick Hotspot Directory */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-2">
            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-2">
              Hotspot Node Index
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredHotspots.map((hs) => (
                <div
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    selectedHotspot?.id === hs.id
                      ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                      : 'bg-stone-50 border-stone-200/70 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <div className="font-bold">{hs.crop} - {hs.diseaseOrPest}</div>
                    <div className="text-[10px] text-stone-500">{hs.taluka}, {hs.district}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">{hs.activeCases} Cases</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
