import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Info,
} from 'lucide-react';
import { Field } from '../types';
import { evaluateAgronomicRules } from '../services/riskEngine';

interface WeatherRiskEngineProps {
  field: Field;
  allFields: Field[];
  onSelectField: (f: Field) => void;
}

export const WeatherRiskEngine: React.FC<WeatherRiskEngineProps> = ({
  field,
  allFields,
  onSelectField,
}) => {
  const [selectedField, setSelectedField] = useState<Field>(field);

  const handleFieldChange = (fieldId: string) => {
    const f = allFields.find((item) => item.id === fieldId) || field;
    setSelectedField(f);
    onSelectField(f);
  };

  const ruleResult = evaluateAgronomicRules(selectedField, 2);

  return (
    <div className="space-y-6">
      {/* Header & Field Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Weather-Driven Agronomic Risk Engine
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Prototype Risk Model
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent algorithmic risk synthesis: Microclimate + Stage Vulnerability + History + Sensor Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Evaluate Field:</span>
          <select
            value={selectedField.id}
            aria-label="Select field for risk analysis"
            onChange={(e) => handleFieldChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-hidden"
          >
            {allFields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.crop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Composite Score Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
              Synthesized Crop Health Risk Score
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {ruleResult.totalScore}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ 100 Index Points</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${
                  ruleResult.compositeRisk === 'HIGH RISK'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : ruleResult.compositeRisk === 'MODERATE RISK'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {ruleResult.compositeRisk}
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-600 max-w-sm">
            <span className="font-semibold text-stone-900 block mb-0.5">Threshold Band:</span>
            Low Risk (0–41 pts) • Moderate Risk (42–69 pts) • High Risk (70–100 pts).
            Configured with agronomist prototype weights.
          </div>
        </div>

        {/* 5-Factor Contribution Breakdown Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Factor Contribution Breakdown
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* 1. Weather */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Weather Signal</span>
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-stone-900 mt-1">
                {ruleResult.weatherScore} <span className="text-[10px] text-stone-400">/ 30</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">RH, rain, temp spell</p>
            </div>

            {/* 2. Crop Stage */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Stage Vulnerability</span>
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-stone-900 mt-1">
                {ruleResult.cropStageScore} <span className="text-[10px] text-stone-400">/ 20</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Reproductive vs veg</p>
            </div>

            {/* 3. Field Memory */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Field Health Memory</span>
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-stone-900 mt-1">
                {ruleResult.historyScore} <span className="text-[10px] text-stone-400">/ 20</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Past pathogen records</p>
            </div>

            {/* 4. Local Cases */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Local Cluster</span>
                <Radio className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-lg font-bold text-stone-900 mt-1">
                {ruleResult.localCasesScore} <span className="text-[10px] text-stone-400">/ 15</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Verified cases &lt;5km</p>
            </div>

            {/* 5. Sensors */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Sensor Telemetry</span>
                <Cpu className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="text-lg font-bold text-stone-900 mt-1">
                {ruleResult.sensorScore} <span className="text-[10px] text-stone-400">/ 15</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Pest trap ETL & soil</p>
            </div>
          </div>
        </div>

        {/* Triggered Rule Activations Log */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Activated Agronomic Rules for {selectedField.name}:</span>
          </div>
          <ul className="space-y-1 text-stone-700">
            {ruleResult.activatedRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5-Day Forecast & Soil Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Forecast Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              5-Day Weather Forecast & Agronomic Impact
            </h3>
            <span className="text-stone-400 text-[11px]">Demo Weather Station</span>
          </div>

          <div className="space-y-2.5">
            {selectedField.weather.forecast.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-stone-800"
              >
                <div className="w-12 font-bold text-stone-900">{f.day}</div>
                <div className="flex-1 px-2 text-stone-600">{f.condition}</div>
                <div className="text-stone-500 px-2 font-mono">
                  {f.tempMax}° / {f.tempMin}°C
                </div>
                <div className="w-20 text-right font-semibold text-blue-700">
                  {f.rainfallChance}% Rain
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200/60 text-[11px] text-blue-900">
            <strong>Foliar Advisory:</strong> If humidity stays above 80% during Wednesday to Thursday,
            conduct early morning scouting on leaf undersides for rust pustules.
          </div>
        </div>

        {/* Telemetry Sensor Station */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">
              Pest Trap & In-Situ Sensor Telemetry
            </h3>
            <div className="flex items-center gap-1 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedField.sensors.status === 'ONLINE'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span className="font-bold text-stone-700">{selectedField.sensors.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Pheromone Trap Count</span>
              <div className="text-xl font-extrabold text-purple-900 mt-1">
                {selectedField.sensors.pestTrapCount} moths
              </div>
              <span className="text-[10px] text-stone-500">ETL Threshold: 8/trap</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Soil Moisture (15cm depth)</span>
              <div className="text-xl font-extrabold text-emerald-900 mt-1">
                {selectedField.sensors.soilMoisture}%
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Optimal root zone</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Canopy Temperature</span>
              <div className="text-xl font-extrabold text-amber-900 mt-1">
                {selectedField.sensors.canopyTemp}°C
              </div>
              <span className="text-[10px] text-stone-500">Ambient: {selectedField.weather.temperature}°C</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block">Leaf Wetness Probe</span>
              <div className="text-xl font-extrabold text-blue-900 mt-1">
                {selectedField.sensors.leafWetness ? 'WET' : 'DRY'}
              </div>
              <span className="text-[10px] text-stone-500">
                {selectedField.weather.leafWetnessDurationHours || 0} hrs wet
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
            <span>Last Telemetry Update: {selectedField.sensors.lastUpdated}</span>
            <span className="text-stone-400">LoRaWAN Gateway Node 04</span>
          </div>
        </div>
      </div>
    </div>
  );
};
