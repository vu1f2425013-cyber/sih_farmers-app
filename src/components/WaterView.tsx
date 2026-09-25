import React from 'react';
import {
  Droplets,
  CloudRain,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { Field, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface WaterViewProps {
  fields: Field[];
  selectedField: Field;
  onSelectField: (field: Field) => void;
  language: Language;
}

export const WaterView: React.FC<WaterViewProps> = ({
  fields,
  selectedField,
  onSelectField,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              💧
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Water & Irrigation Smart Advisor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time soil moisture telemetry, crop evapotranspiration & watering schedule
          </p>
        </div>

        {/* Field Select Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Select Field:</span>
          <select
            value={selectedField?.id}
            onChange={(e) => {
              const f = fields.find((item) => item.id === e.target.value);
              if (f) onSelectField(f);
            }}
            className="px-3 py-2 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.crop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Soil Moisture Telemetry Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Current Soil Moisture</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {selectedField.sensors.soilMoisture}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Optimal Range (55% - 70%)</span>
          </div>
          <p className="text-xs text-stone-500">
            Sufficient root-zone moisture for current {selectedField.growthStage} stage.
          </p>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider">24h Rainfall Forecast</span>
            <CloudRain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-sky-900">18 - 25 mm</div>
          <div className="text-xs text-sky-700 font-bold">82% Precipitation Chance</div>
          <p className="text-xs text-stone-500">
            Moderate showers expected tomorrow afternoon. Natural watering will replenish soil.
          </p>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Watering Recommendation</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-bold text-amber-900">Hold Drip Irrigation</div>
          <div className="text-xs text-stone-600 font-medium">Delay 24 Hours</div>
          <p className="text-xs text-stone-500">
            Avoid over-saturation to reduce fungal spore germination risk.
          </p>
        </div>
      </div>

      {/* Field by Field Moisture Comparison */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-stone-900">All Fields Water Status</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fields.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectField(f)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedField.id === f.id
                  ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">{f.name}</span>
                <span className="text-xs text-stone-500">{f.crop}</span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600">Moisture:</span>
                  <strong className="text-blue-900">{f.sensors.soilMoisture}%</strong>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${f.sensors.soilMoisture}%` }}
                  />
                </div>
                <span className="text-[11px] text-stone-500 block">
                  Soil: {f.soilType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
