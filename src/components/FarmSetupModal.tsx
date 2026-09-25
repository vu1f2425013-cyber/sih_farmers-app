import React, { useState } from 'react';
import { Farm } from '../types';
import { api } from '../services/api';
import {
  X,
  MapPin,
  Compass,
  CheckCircle2,
  Building,
  Droplets,
  Layers,
  Sparkles,
  Info,
  Navigation,
} from 'lucide-react';

interface FarmSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onFarmCreated: (farm: Farm, shouldAddField: boolean) => void;
}

export const FarmSetupModal: React.FC<FarmSetupModalProps> = ({
  isOpen,
  onClose,
  userId,
  onFarmCreated,
}) => {
  const [farmName, setFarmName] = useState('');
  const [totalLandArea, setTotalLandArea] = useState<number | ''>(4.5);
  const [unit, setUnit] = useState<'acre' | 'hectare'>('acre');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Wardha');
  const [village, setVillage] = useState('Hinganghat');
  const [pinCode, setPinCode] = useState('442301');
  const [address, setAddress] = useState('Survey No. 42/B, Hinganghat Bypass Road');

  // Location
  const [lat, setLat] = useState<number>(20.5512);
  const [lng, setLng] = useState<number>(78.8354);
  const [locationMode, setLocationMode] = useState<'manual' | 'gps' | 'marker'>('manual');
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Characteristics (Optional)
  const [soilType, setSoilType] = useState('Deep Black Cotton Soil (Vertisol)');
  const [irrigationType, setIrrigationType] = useState('Drip & Furrow Irrigation');
  const [waterSource, setWaterSource] = useState('Borewell & Farm Pond');
  const [farmingMethod, setFarmingMethod] = useState('Integrated Crop Management (ICM)');
  const [ownershipType, setOwnershipType] = useState('Owner Cultivator');
  const [terrain, setTerrain] = useState('Flat Agricultural Basin');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by your browser; using manual coordinates.');
      return;
    }
    setGpsStatus('Requesting device location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(parseFloat(pos.coords.latitude.toFixed(4)));
        setLng(parseFloat(pos.coords.longitude.toFixed(4)));
        setGpsStatus('Location retrieved from device GPS.');
      },
      (err) => {
        setGpsStatus('Location access denied or unavailable. Manual entry active.');
      },
      { timeout: 8000 }
    );
  };

  const handleSave = async (shouldAddField: boolean) => {
    if (!farmName.trim()) {
      alert('Please enter a Farm Name.');
      return;
    }

    setLoading(true);
    try {
      const newFarm = await api.addFarm({
        userId: userId || 'user-farmer',
        name: farmName,
        totalLandArea: Number(totalLandArea) || 1,
        unit,
        state,
        district,
        village,
        pinCode,
        address,
        soilType,
        irrigationType,
        waterSource,
        farmingMethod,
        ownershipType,
        terrain,
        lat,
        lng,
      });

      onFarmCreated(newFarm, shouldAddField);
      onClose();
    } catch (err) {
      console.error('Failed to create farm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 border border-stone-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">Set Up Your Farm</h3>
              <p className="text-xs text-stone-500">Register your agricultural holding and land parcels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs max-h-[65vh] overflow-y-auto pr-1">
          {/* Section 1: Basic Farm Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5" /> Basic Farm Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Name *</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Kisan Krishi Farm"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Total Land Area *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={totalLandArea}
                    onChange={(e) => setTotalLandArea(e.target.value === '' ? '' : Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
                  >
                    <option value="acre">Acres</option>
                    <option value="hectare">Hectares</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farm Address / Survey No.</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Survey No., Gram Panchayat / Gat No."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                <MapPin className="w-3.5 h-3.5" /> Farm Location
              </h4>
              <button
                type="button"
                onClick={handleUseDeviceLocation}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-1 rounded-lg"
              >
                <Navigation className="w-3 h-3" /> Use Device GPS
              </button>
            </div>

            {gpsStatus && (
              <div className="p-2 bg-stone-100 rounded-lg text-[11px] text-stone-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>{gpsStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Farm Characteristics (Optional) */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-700">
                <Layers className="w-3.5 h-3.5" /> Farm Characteristics (Optional)
              </h4>
              <span className="text-[10px] text-stone-400">Can be filled later</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
                >
                  <option value="Deep Black Cotton Soil (Vertisol)">Deep Black Cotton Soil</option>
                  <option value="Medium Black Loam">Medium Black Loam</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Alluvial Silt Loam">Alluvial Silt Loam</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Irrigation Method</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
                >
                  <option value="Drip & Furrow Irrigation">Drip & Furrow Irrigation</option>
                  <option value="Drip Irrigation (Automated)">Drip Irrigation (Automated)</option>
                  <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                  <option value="Flood / Channel Irrigation">Flood / Channel Irrigation</option>
                  <option value="Rainfed (Non-irrigated)">Rainfed (Non-irrigated)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Water Source</label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  placeholder="e.g. Borewell, Farm Pond, River Lift"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farming Method</label>
                <select
                  value={farmingMethod}
                  onChange={(e) => setFarmingMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
                >
                  <option value="Integrated Crop Management (ICM)">Integrated Crop Management (ICM)</option>
                  <option value="Conventional Cultivation">Conventional Cultivation</option>
                  <option value="Natural / Organic Farming">Natural / Organic Farming</option>
                  <option value="Precision Drip Agriculture">Precision Drip Agriculture</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-stone-500 hover:text-stone-700 font-semibold cursor-pointer text-xs"
          >
            Skip Farm Details
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 cursor-pointer text-xs transition-colors"
            >
              SAVE FARM
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold cursor-pointer text-xs shadow-md transition-colors"
            >
              SAVE & ADD FIELD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FarmSetupModal;
