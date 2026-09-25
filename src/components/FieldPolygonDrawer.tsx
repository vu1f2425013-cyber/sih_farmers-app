import React, { useState, useRef, useEffect } from 'react';
import { BoundaryPoint } from '../types';
import {
  MapPin,
  Trash2,
  CheckCircle2,
  Layers,
  RotateCcw,
  Plus,
  Info,
  Compass,
} from 'lucide-react';

interface FieldPolygonDrawerProps {
  initialPolygon?: BoundaryPoint[];
  centerLat?: number;
  centerLng?: number;
  onPolygonChange: (polygon: BoundaryPoint[]) => void;
  isReadOnly?: boolean;
}

export const FieldPolygonDrawer: React.FC<FieldPolygonDrawerProps> = ({
  initialPolygon,
  centerLat = 20.5512,
  centerLng = 78.8354,
  onPolygonChange,
  isReadOnly = false,
}) => {
  const [points, setPoints] = useState<BoundaryPoint[]>(
    initialPolygon && initialPolygon.length > 0
      ? initialPolygon
      : [
          { lat: centerLat + 0.001, lng: centerLng - 0.001 },
          { lat: centerLat + 0.0015, lng: centerLng + 0.0012 },
          { lat: centerLat - 0.0008, lng: centerLng + 0.0015 },
          { lat: centerLat - 0.0012, lng: centerLng - 0.0009 },
        ]
  );

  const [inputLat, setInputLat] = useState<number>(centerLat);
  const [inputLng, setInputLng] = useState<number>(centerLng);
  const [showManualInput, setShowManualInput] = useState(false);

  // Sync back to parent
  useEffect(() => {
    onPolygonChange(points);
  }, [points]);

  const handleAddPoint = () => {
    if (inputLat && inputLng) {
      const updated = [...points, { lat: Number(inputLat), lng: Number(inputLng) }];
      setPoints(updated);
    }
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleResetDefault = () => {
    const defaultPts = [
      { lat: centerLat + 0.001, lng: centerLng - 0.001 },
      { lat: centerLat + 0.0015, lng: centerLng + 0.0012 },
      { lat: centerLat - 0.0008, lng: centerLng + 0.0015 },
      { lat: centerLat - 0.0012, lng: centerLng - 0.0009 },
    ];
    setPoints(defaultPts);
  };

  // Convert GPS points to normalized canvas coordinates for SVG display
  const minLat = Math.min(...points.map((p) => p.lat), centerLat - 0.002);
  const maxLat = Math.max(...points.map((p) => p.lat), centerLat + 0.002);
  const minLng = Math.min(...points.map((p) => p.lng), centerLng - 0.002);
  const maxLng = Math.max(...points.map((p) => p.lng), centerLng + 0.002);

  const latSpan = Math.max(0.0001, maxLat - minLat);
  const lngSpan = Math.max(0.0001, maxLng - minLng);

  const toSvgCoords = (p: BoundaryPoint) => {
    const x = ((p.lng - minLng) / lngSpan) * 260 + 30;
    const y = (1 - (p.lat - minLat) / latSpan) * 160 + 20;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const polygonSvgPoints = points.map(toSvgCoords).join(' ');

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-stone-900">Geographic Field Boundary Polygon</span>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Polygon
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        )}
      </div>

      {/* SVG Interactive Visualizer */}
      <div className="relative bg-stone-900 rounded-xl overflow-hidden h-48 border border-stone-800 flex items-center justify-center">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        <svg className="w-full h-full relative z-10">
          {points.length >= 3 && (
            <polygon
              points={polygonSvgPoints}
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
          )}

          {points.map((p, idx) => {
            const [x, y] = toSvgCoords(p).split(',').map(Number);
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x={x + 7} y={y + 4} fill="#a7f3d0" fontSize="10" fontWeight="bold">
                  P{idx + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HUD Info */}
        <div className="absolute top-2 left-3 z-20 bg-stone-950/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-stone-300 border border-stone-800">
          Center: {centerLat.toFixed(4)}° N, {centerLng.toFixed(4)}° E • {points.length} Boundary Vertices
        </div>
      </div>

      {/* Vertex Coordinates Table */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
          <span>Vertex Points ({points.length})</span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-emerald-700 hover:underline cursor-pointer"
          >
            {showManualInput ? 'Hide Manual Entry' : '+ Enter Specific GPS Coordinates'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {points.map((pt, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-lg p-2 text-[11px] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-stone-800">P{i + 1}: </span>
                <span className="text-stone-600">
                  {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {showManualInput && !isReadOnly && (
          <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-2 mt-2">
            <span className="font-semibold text-stone-800 text-[11px] flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-emerald-700" /> Add Coordinate Vertex
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.0001"
                placeholder="Latitude"
                value={inputLat}
                onChange={(e) => setInputLat(parseFloat(e.target.value))}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={inputLng}
                onChange={(e) => setInputLng(parseFloat(e.target.value))}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddPoint}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
              >
                Add Vertex
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FieldPolygonDrawer;
