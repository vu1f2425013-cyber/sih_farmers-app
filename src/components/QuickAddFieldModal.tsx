import React, { useState } from 'react';
import { Field } from '../types';
import { api } from '../services/api';
import {
  X,
  Zap,
  Sprout,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface QuickAddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId?: string;
  onFieldAdded: (field: Field) => void;
}

export const QuickAddFieldModal: React.FC<QuickAddFieldModalProps> = ({
  isOpen,
  onClose,
  farmId,
  onFieldAdded,
}) => {
  const [fieldName, setFieldName] = useState('');
  const [crop, setCrop] = useState('Soybean');
  const [areaAcres, setAreaAcres] = useState<number | ''>(2.0);
  const [locationVillage, setLocationVillage] = useState('Hinganghat, Wardha');
  const [growthStage, setGrowthStage] = useState('Vegetative Stage');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    setLoading(true);
    try {
      const newField = await api.addField({
        farmId: farmId || 'farm-1',
        name: fieldName,
        crop,
        areaAcres: Number(areaAcres) || 2.0,
        unit: 'acre',
        growthStage,
        location: {
          village: locationVillage.split(',')[0]?.trim() || 'Hinganghat',
          taluka: 'Hinganghat',
          district: 'Wardha',
          state: 'Maharashtra',
          lat: 20.5512,
          lng: 78.8354,
        },
      });

      onFieldAdded(newField);
      onClose();
    } catch (err) {
      console.error('Failed to quick-add field:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Quick Add Field</h3>
              <p className="text-[11px] text-stone-500">Fast 5-field setup • 30 seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              1. Field Name *
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g. Riverbank Plot B"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                2. Crop *
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
              >
                <option value="Soybean">Soybean</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato</option>
                <option value="Rice">Rice</option>
                <option value="Chilli">Chilli</option>
                <option value="Chickpea">Chickpea / Gram</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                3. Land Area (Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value === '' ? '' : Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              4. Location / Village
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationVillage}
                onChange={(e) => setLocationVillage(e.target.value)}
                placeholder="Village, District"
                className="w-full pl-8 pr-3 py-2 border border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              5. Growth Stage
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
            >
              <option value="Vegetative Stage">Vegetative Stage</option>
              <option value="Flowering Stage">Flowering Stage</option>
              <option value="Pod / Boll Formation">Pod / Boll Formation</option>
              <option value="Ripening / Maturity">Ripening / Maturity</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-stone-500 hover:text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !fieldName.trim()}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>Create Field Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default QuickAddFieldModal;
