import React, { useState, useEffect } from 'react';
import {
  Field,
  Farm,
  FarmDocument,
  ConnectedTimelineEvent,
  FarmingPractices,
} from '../types';
import { api } from '../services/api';
import {
  FileText,
  Clock,
  Layers,
  Sprout,
  Droplets,
  Shield,
  Upload,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  Radio,
  FileSpreadsheet,
  Edit3,
} from 'lucide-react';

interface FarmDataDashboardProps {
  field: Field;
  allFields: Field[];
  onSelectField: (f: Field) => void;
  onOpenImportModal: () => void;
  onOpenScanModal: () => void;
}

type TabKey =
  | 'overview'
  | 'field_details'
  | 'crop_history'
  | 'soil'
  | 'irrigation'
  | 'crop_protection'
  | 'health_history'
  | 'documents'
  | 'sensor_data';

export const FarmDataDashboard: React.FC<FarmDataDashboardProps> = ({
  field,
  allFields,
  onSelectField,
  onOpenImportModal,
  onOpenScanModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [documents, setDocuments] = useState<FarmDocument[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<ConnectedTimelineEvent[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Upload Document State
  const [isUploading, setIsUploading] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<FarmDocument['category']>('Soil Report');
  const [newDocNotes, setNewDocNotes] = useState('');

  // Practices edit state
  const [practices, setPractices] = useState<FarmingPractices>(
    field.practices || {
      soil: {
        type: field.soilType,
        pH: 7.4,
        source: 'Soil Lab Report',
        lastUpdated: '2026-07-02',
      },
      irrigation: {
        type: field.irrigationMethod || 'Drip & Furrow',
        frequency: 'Every 8-10 days',
        source: 'Farmer entered',
        lastUpdated: '2026-09-15',
      },
      nutrientManagement: [],
      cropProtection: [],
      cropHistory: [],
    }
  );

  const loadDocsAndTimeline = async () => {
    try {
      setLoadingDocs(true);
      const [docs, timeline] = await Promise.all([
        api.getDocuments(field.farmId, field.id),
        api.getTimelineEvents(),
      ]);
      setDocuments(docs);
      setTimelineEvents(timeline);
    } catch (err) {
      console.error('Failed to load farm data:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocsAndTimeline();
  }, [field.id]);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    try {
      const added = await api.uploadDocument({
        farmId: field.farmId || 'farm-1',
        fieldId: field.id,
        name: newDocName,
        category: newDocCategory,
        notes: newDocNotes || 'Stored in farm records',
        fileSize: '1.4 MB',
      });
      setDocuments([added, ...documents]);
      setIsUploading(false);
      setNewDocName('');
      setNewDocNotes('');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (window.confirm('Remove this document from farm records?')) {
      await api.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    }
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: Layers },
    { key: 'field_details', label: 'Field Details', icon: FileText },
    { key: 'crop_history', label: 'Crop History', icon: Clock },
    { key: 'soil', label: 'Soil Health', icon: Sprout },
    { key: 'irrigation', label: 'Irrigation', icon: Droplets },
    { key: 'crop_protection', label: 'Crop Protection', icon: Shield },
    { key: 'health_history', label: 'Health Memory', icon: Activity },
    { key: 'documents', label: 'Documents', icon: FileCheck },
    { key: 'sensor_data', label: 'Sensor Data', icon: Radio },
  ];

  const completion = field.profileCompletion || 78;

  return (
    <div className="space-y-6">
      {/* Top Header with Field Selector & Quick Import */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Farm Data Intelligence Core
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {completion}% Complete
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Persistent field profile, verified practices, telemetry logs, and chronological event memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Field Selector */}
          <select
            value={field.id}
            onChange={(e) => {
              const target = allFields.find((f) => f.id === e.target.value);
              if (target) onSelectField(target);
            }}
            className="px-3 py-1.5 border border-stone-300 rounded-xl text-xs font-semibold bg-white text-stone-800 shadow-2xs"
          >
            {allFields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.crop})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-stone-300 cursor-pointer shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Import Data</span>
          </button>

          <button
            onClick={onOpenScanModal}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Scan Crop</span>
          </button>
        </div>
      </div>

      {/* Progressive Data Collection Completion Banner */}
      {completion < 100 && (
        <div className="bg-gradient-to-r from-emerald-50 via-stone-50 to-amber-50 border border-emerald-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-stone-900">
                  Field Health Profile: {completion}% Complete
                </h4>
                <span className="text-[10px] text-stone-500 font-medium">
                  (Contextual AI Diagnostic Precision)
                </span>
              </div>
              <p className="text-stone-600 mt-0.5">
                Complete missing soil reports, irrigation schedules, or previous crop history to improve contextual disease differentiation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('soil')}
              className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              + Add Soil Information
            </button>
          </div>
        </div>
      )}

      {/* 9 Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-stone-200 text-xs font-semibold scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CONNECTED LIFECYCLE TIMELINE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
              <span className="text-stone-500 text-[11px] font-semibold uppercase">Current Crop</span>
              <p className="text-lg font-bold text-stone-900 mt-1">{field.crop}</p>
              <span className="text-xs text-stone-500">Var: {field.variety}</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
              <span className="text-stone-500 text-[11px] font-semibold uppercase">Growth Stage</span>
              <p className="text-lg font-bold text-stone-900 mt-1">{field.growthStage}</p>
              <span className="text-xs text-stone-500">Sown: {field.plantingDate}</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
              <span className="text-stone-500 text-[11px] font-semibold uppercase">Current Risk</span>
              <p className="text-lg font-bold text-stone-900 mt-1">{field.currentRisk}</p>
              <span className="text-xs text-stone-500">{field.activeCasesCount} Active Issue</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs">
              <span className="text-stone-500 text-[11px] font-semibold uppercase">Telemetry Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-lg font-bold text-stone-900">{field.sensors.status}</p>
              </div>
              <span className="text-xs text-stone-500">{field.sensors.lastUpdated}</span>
            </div>
          </div>

          {/* Connected Event Timeline (Section 33) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Connected Field Health Lifecycle Timeline
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chronological trail from field creation to harvest follow-up
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg">
                {timelineEvents.length} Events Logged
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {timelineEvents.map((ev, idx) => (
                <div key={ev.id || idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white border-2 border-emerald-600 group-hover:scale-125 transition-transform" />

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{ev.date}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                          {ev.badge || ev.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span>Source: {ev.source}</span>
                        {ev.status && (
                          <span className="font-semibold text-emerald-700">({ev.status})</span>
                        )}
                      </div>
                    </div>
                    <h5 className="font-bold text-stone-800 text-xs mt-1">{ev.title}</h5>
                    <p className="text-stone-600 leading-relaxed text-[11px]">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIELD DETAILS */}
      {activeTab === 'field_details' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Land Parcel & Sowing Details</h3>
            <span className="text-stone-400 text-[11px]">Updated: {field.lastObservationDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Total Cultivated Area</span>
              <p className="font-bold text-stone-900 text-sm">{field.areaAcres} Acres</p>
              <span className="text-[10px] text-stone-400">Unit: acre (verified survey)</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Location & Jurisdiction</span>
              <p className="font-bold text-stone-900 text-sm">{field.location.village}, {field.location.district}</p>
              <span className="text-[10px] text-stone-400">{field.location.lat}° N, {field.location.lng}° E</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Current Seed Variety</span>
              <p className="font-bold text-stone-900 text-sm">{field.variety}</p>
              <span className="text-[10px] text-stone-400">Source: {field.seedSource || 'Certified Mahabeej'}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Seed Treatment Protocol</span>
              <p className="font-bold text-stone-900 text-sm">{field.seedTreatment || 'Trichoderma + Rhizobium'}</p>
              <span className="text-[10px] text-stone-400">Biological bio-consortium inoculant</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CROP HISTORY */}
      {activeTab === 'crop_history' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Past Seasons & Rotation Records</h3>
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Source: Verified Agricultural History
            </span>
          </div>

          <div className="space-y-3">
            {practices.cropHistory?.map((ch) => (
              <div key={ch.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{ch.season} • {ch.previousCrop}</span>
                  <span className="text-stone-400 text-[11px]">{ch.lastUpdated}</span>
                </div>
                {ch.previousDisease && (
                  <p className="text-stone-700">
                    <span className="font-semibold text-stone-900">Diagnosis: </span>
                    {ch.confirmedDiagnosis || ch.previousDisease}
                  </p>
                )}
                {ch.management && (
                  <p className="text-stone-600">
                    <span className="font-semibold text-stone-800">Management Action: </span>
                    {ch.management}
                  </p>
                )}
                {ch.outcome && (
                  <p className="text-emerald-800 font-semibold">
                    <span>Outcome: </span> {ch.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SOIL HEALTH */}
      {activeTab === 'soil' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Soil Parameters & Laboratory Test Data</h3>
            <span className="text-[11px] text-stone-500">Source: {practices.soil.source}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 font-semibold">Soil Classification</span>
              <p className="font-bold text-stone-900 mt-1">{field.soilType}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 font-semibold">Soil pH Value</span>
              <p className="font-bold text-stone-900 mt-1">{practices.soil.pH || 7.4} (Neutral / Optimal)</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 font-semibold">Organic Carbon Content</span>
              <p className="font-bold text-stone-900 mt-1">{practices.soil.organicMatter || 'Medium (0.68%)'}</p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
            <h5 className="font-bold">Soil Health Card Summary</h5>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Laboratory soil analysis indicates sufficient available phosphorus (18.5 kg/ha) and high cation-exchange capacity. Low salinity risk (EC 0.35 dS/m).
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: IRRIGATION */}
      {activeTab === 'irrigation' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Irrigation Logistics & Moisture Balance</h3>
            <span className="text-[11px] text-stone-500">Source: {practices.irrigation.source}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Irrigation Type</span>
              <p className="font-bold text-stone-900 text-sm">{field.irrigationMethod || 'Furrow / Drip Irrigation'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Water Source</span>
              <p className="font-bold text-stone-900 text-sm">{field.waterSource || 'Borewell & Farm Pond'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Cycle Frequency</span>
              <p className="font-bold text-stone-900 text-sm">{practices.irrigation.frequency || 'Scheduled post-monsoon break'}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Last Irrigation Logged</span>
              <p className="font-bold text-stone-900 text-sm">{practices.irrigation.lastIrrigation || '2026-09-14'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CROP PROTECTION */}
      {activeTab === 'crop_protection' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Integrated Pest Management & Input History</h3>
            <span className="text-[11px] text-stone-500">Safe IPM Protocol Standard</span>
          </div>

          <div className="space-y-3">
            {practices.cropProtection?.map((cp) => (
              <div key={cp.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{cp.pesticideUsed}</span>
                  <span className="text-stone-400 text-[11px]">{cp.applicationDate}</span>
                </div>
                <p className="text-stone-700">
                  <span className="font-semibold text-stone-900">Reason: </span>
                  {cp.reason}
                </p>
                <p className="text-emerald-800 font-semibold">
                  <span>Result: </span> {cp.result}
                </p>
                <span className="text-[10px] text-stone-400 block">Source: {cp.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HEALTH HISTORY */}
      {activeTab === 'health_history' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Field Health Historical Log</h3>
            <span className="text-[11px] text-stone-500">{field.history.length} Prior Cases</span>
          </div>

          <div className="space-y-3">
            {field.history.map((h) => (
              <div key={h.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{h.diagnosis}</span>
                  <span className="text-stone-400 text-[11px]">{h.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-stone-700">Stage: {h.growthStage}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {h.confirmationStatus}
                  </span>
                </div>
                <p className="text-stone-600">{h.managementActionTaken}</p>
                {h.notes && <p className="text-[11px] text-stone-500 italic">Notes: {h.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: DOCUMENTS / IMAGE UPLOAD (Section 17) */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Upload Farm Documents & Lab Reports</h3>
              <p className="text-[11px] text-stone-500">
                Soil test reports, diagnostic certificates, crop images, and pest trap counts
              </p>
            </div>
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Cancel' : 'Upload Document'}</span>
            </button>
          </div>

          {/* Honest Transparent Disclosure */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Uploaded documents are safely stored in your digital farm archive for extension officer review. We do not fabricate AI interpretations of complex external laboratory PDF scans.
            </span>
          </div>

          {/* Upload Form */}
          {isUploading && (
            <form onSubmit={handleUploadDocument} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
              <h4 className="font-bold text-stone-800">Add New Document Record</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g. KVK Wardha Soil Card.pdf"
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Soil Report">Soil Report</option>
                    <option value="Crop Health Report">Crop Health Report</option>
                    <option value="Lab Diagnosis">Lab Diagnosis</option>
                    <option value="Farm Record">Farm Record</option>
                    <option value="Pest Trap">Pest Trap Image</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes / Summary</label>
                <input
                  type="text"
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  placeholder="Key findings or issuing laboratory"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Save to Farm Records
              </button>
            </form>
          )}

          {/* Documents Table */}
          <div className="space-y-2.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900">{doc.name}</h5>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="font-semibold text-emerald-800">{doc.category}</span>
                      <span>•</span>
                      <span>{doc.uploadDate}</span>
                      <span>•</span>
                      <span className="bg-stone-200 px-1.5 py-0.5 rounded text-[10px] text-stone-700">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SENSOR DATA */}
      {activeTab === 'sensor_data' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-700" />
                In-Situ Internet of Crops Telemetry
              </h3>
              <p className="text-[11px] text-stone-500">Live hardware probes installed in field canopy</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {field.sensors.status} • {field.sensors.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Pheromone Trap Count</span>
              <p className="font-bold text-stone-900 text-base">{field.sensors.pestTrapCount} moths/24h</p>
              <span className="text-[10px] text-amber-700 font-semibold">ETL Threshold: 8/trap</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Soil Moisture Probe</span>
              <p className="font-bold text-stone-900 text-base">{field.sensors.soilMoisture}%</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Optimum range (55-75%)</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Canopy Temperature</span>
              <p className="font-bold text-stone-900 text-base">{field.sensors.canopyTemp}°C</p>
              <span className="text-[10px] text-stone-500">Normal thermal window</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-500 font-semibold">Leaf Wetness Grid</span>
              <p className="font-bold text-stone-900 text-base">{field.sensors.leafWetness ? 'WET (Spore Risk)' : 'DRY'}</p>
              <span className="text-[10px] text-stone-500">Duration: 9.5h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FarmDataDashboard;
