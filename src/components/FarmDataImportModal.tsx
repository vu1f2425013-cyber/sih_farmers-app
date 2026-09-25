import React, { useState } from 'react';
import { api } from '../services/api';
import {
  X,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Database,
} from 'lucide-react';

interface FarmDataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFarmId?: string;
  onImportComplete: () => void;
}

export const FarmDataImportModal: React.FC<FarmDataImportModalProps> = ({
  isOpen,
  onClose,
  targetFarmId,
  onImportComplete,
}) => {
  const [fileType, setFileType] = useState<'csv' | 'excel' | 'json'>('csv');
  const [selectedFileName, setSelectedFileName] = useState<string>('wardha_kharif_records.csv');
  const [parsedRows, setParsedRows] = useState<any[]>([
    { fieldName: 'Plot 4 - East Ridge', crop: 'Soybean', areaAcres: 2.2, variety: 'JS 20-34', growthStage: 'Pod Formation' },
    { fieldName: 'Plot 5 - Well Side', crop: 'Cotton', areaAcres: 3.0, variety: 'Ajeet 155 BG II', growthStage: 'Square Stage' },
  ]);
  const [importing, setImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateLoadSample = (type: 'soybean' | 'soil' | 'all') => {
    if (type === 'soybean') {
      setSelectedFileName('soybean_plots_rotation.csv');
      setParsedRows([
        { fieldName: 'Plot 3 (Black Soil)', crop: 'Soybean', areaAcres: 3.5, variety: 'NRC 37', growthStage: 'Flowering' },
        { fieldName: 'Plot 4 (Canal End)', crop: 'Soybean', areaAcres: 2.0, variety: 'JS 20-29', growthStage: 'Vegetative' },
      ]);
    } else if (type === 'soil') {
      setSelectedFileName('krishi_vigyan_kendra_soil_card.json');
      setParsedRows([
        { fieldName: 'Plot 1 - North Acre', crop: 'Chickpea', areaAcres: 2.8, soilType: 'Vertisol Medium', growthStage: 'Sowing' },
      ]);
    } else {
      setSelectedFileName('village_survey_records_2026.xlsx');
      setParsedRows([
        { fieldName: 'Gat 142/A Main Field', crop: 'Soybean', areaAcres: 4.0, variety: 'JS 20-29', growthStage: 'Vegetative' },
        { fieldName: 'Gat 142/B Orchard Margin', crop: 'Tomato', areaAcres: 1.5, variety: 'Abhinav Hybrid', growthStage: 'Fruit Setting' },
      ]);
    }
  };

  const handleExecuteImport = async () => {
    setImporting(true);
    setSuccessMessage(null);
    try {
      const res = await api.importFarmData(selectedFileName, parsedRows, targetFarmId);
      setSuccessMessage(res.message || 'Imported records successfully.');
      setTimeout(() => {
        onImportComplete();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Import Existing Farm Data</h3>
              <p className="text-[11px] text-stone-500">CSV, Excel, or JSON farm holding records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
          <span className="font-bold text-stone-700 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            Prototype Test Datasets (1-Click Sample)
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSimulateLoadSample('soybean')}
              className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded-lg text-[11px] font-semibold text-stone-700 cursor-pointer"
            >
              Soybean History (.CSV)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateLoadSample('soil')}
              className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded-lg text-[11px] font-semibold text-stone-700 cursor-pointer"
            >
              Soil Health Card (.JSON)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateLoadSample('all')}
              className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded-lg text-[11px] font-semibold text-stone-700 cursor-pointer"
            >
              Farm Cadastral (.XLSX)
            </button>
          </div>
        </div>

        {/* Drag / File Selector */}
        <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center space-y-2 bg-stone-50/50">
          <Upload className="w-6 h-6 text-stone-400 mx-auto" />
          <div className="text-xs">
            <span className="font-bold text-stone-800">{selectedFileName}</span>
            <p className="text-[11px] text-stone-500 mt-0.5">Ready for validation and database injection</p>
          </div>
        </div>

        {/* Parsed Preview Table */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-stone-700">Preview Parsed Plots ({parsedRows.length})</span>
          <div className="border border-stone-200 rounded-xl overflow-hidden text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-stone-100 text-stone-600 font-semibold">
                <tr>
                  <th className="p-2">Field Name</th>
                  <th className="p-2">Crop</th>
                  <th className="p-2">Area</th>
                  <th className="p-2">Growth Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="p-2 font-semibold text-stone-800">{r.fieldName}</td>
                    <td className="p-2 text-stone-700">{r.crop}</td>
                    <td className="p-2 text-stone-600">{r.areaAcres} ac</td>
                    <td className="p-2 text-stone-500">{r.growthStage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-stone-500 hover:text-stone-700 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={importing || parsedRows.length === 0}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer text-xs disabled:opacity-50"
          >
            {importing ? (
              <span>Importing records...</span>
            ) : (
              <>
                <span>Commit & Add to Farm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default FarmDataImportModal;
