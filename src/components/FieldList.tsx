import React, { useState } from 'react';
import {
  Plus,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Droplets,
  Radio,
  ScanLine,
  X,
  Zap,
} from 'lucide-react';
import { Field, Language, BoundaryPoint } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { FieldPolygonDrawer } from './FieldPolygonDrawer';

interface FieldListProps {
  fields: Field[];
  language: Language;
  onSelectField: (fieldId: string) => void;
  onScanField: (fieldId: string) => void;
  onAddField: (fieldData: Partial<Field>) => Promise<void>;
}

export const FieldList: React.FC<FieldListProps> = ({
  fields,
  language,
  onSelectField,
  onScanField,
  onAddField,
}) => {
  const t = TRANSLATIONS[language];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('Soybean');
  const [variety, setVariety] = useState('JS 20-29');
  const [growthStage, setGrowthStage] = useState('Vegetative Stage');
  const [areaAcres, setAreaAcres] = useState('2.5');
  const [village, setVillage] = useState('Hinganghat');
  const [district, setDistrict] = useState('Wardha');
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [boundaryPolygon, setBoundaryPolygon] = useState<BoundaryPoint[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAddField({
        name: name || 'New Farm Block',
        crop,
        variety,
        growthStage,
        areaAcres: parseFloat(areaAcres) || 2.0,
        soilType,
        boundaryPolygon: boundaryPolygon.length > 0 ? boundaryPolygon : undefined,
        location: {
          village,
          taluka: village,
          district,
          state: 'Maharashtra',
          lat: 20.5512,
          lng: 78.8354,
        },
      });
      setIsAddModalOpen(false);
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
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
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {t.my_fields}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Every registered field maintains an independent crop-health intelligence record
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.add_field}</span>
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header with Risk Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-stone-900 tracking-tight">
                    {f.name}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>
                      {f.location.village}, {f.location.district} • {f.areaAcres} ac
                    </span>
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(
                    f.currentRisk
                  )}`}
                >
                  {f.currentRisk}
                </span>
              </div>

              {/* Crop & Stage info */}
              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-700 border border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">Crop:</span>
                  <span className="font-bold text-stone-900">
                    {f.crop} ({f.variety})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Growth Stage:</span>
                  <span className="font-semibold text-stone-800">{f.growthStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Soil:</span>
                  <span className="text-stone-700">{f.soilType}</span>
                </div>
              </div>

              {/* Telemetry signals */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80">
                  <span className="text-[10px] text-stone-500 block">Relative Humidity</span>
                  <span className="font-bold text-emerald-950">{f.weather.humidity}% RH</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60">
                  <span className="text-[10px] text-stone-500 block">Health History</span>
                  <span className="font-bold text-stone-900">{f.history.length} logged events</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                <span>Active Cases: <strong>{f.activeCasesCount}</strong></span>
                <span>Last Observation: {f.lastObservationDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => onScanField(f.id)}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan Crop</span>
              </button>
              <button
                onClick={() => onSelectField(f.id)}
                className="px-3 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Memory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-stone-200 text-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Add New Agricultural Field</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Field Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Balaji Field D"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop</label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Soybean"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Variety</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. JS 20-29"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Growth Stage</label>
                  <input
                    type="text"
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    placeholder="e.g. Vegetative"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Soil Type</label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  placeholder="e.g. Deep Black Cotton Soil"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              {/* Geographic Field Polygon Boundary Drawer */}
              <FieldPolygonDrawer
                onPolygonChange={setBoundaryPolygon}
                centerLat={20.5512}
                centerLng={78.8354}
              />

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
