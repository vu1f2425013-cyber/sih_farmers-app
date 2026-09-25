import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  FileCheck,
  Calendar,
  Send,
} from 'lucide-react';
import { Field, AIAnalysisResult, Language } from '../types';
import { SAMPLE_SCAN_PRESETS } from '../data/seedData';
import { api } from '../services/api';
import { ExplainableAIPanel } from './ExplainableAIPanel';
import { TRANSLATIONS } from '../i18n/translations';

interface CropScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  selectedFieldId?: string;
  language: Language;
  onCaseCreated: () => void;
}

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const CropScanModal: React.FC<CropScanModalProps> = ({
  isOpen,
  onClose,
  fields,
  selectedFieldId,
  language,
  onCaseCreated,
}) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [selectedField, setSelectedField] = useState<string>(selectedFieldId || fields[0]?.id || 'field-1');
  const [crop, setCrop] = useState<string>(fields[0]?.crop || 'Soybean');
  const [variety, setVariety] = useState<string>(fields[0]?.variety || 'JS 20-29');
  const [growthStage, setGrowthStage] = useState<string>(fields[0]?.growthStage || 'R3 Pod Development');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<'idle' | 'ready' | 'unclear' | 'not_crop' | 'invalid'>('idle');
  const [analyzingProgress, setAnalyzingProgress] = useState<string>(t.scan_loading);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [submittingCase, setSubmittingCase] = useState(false);
  const [caseSavedMessage, setCaseSavedMessage] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [cameraUseMode, setCameraUseMode] = useState<'camera' | 'gallery' | 'demo' | null>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetFileInputs = () => {
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const currentFieldObj = fields.find((f) => f.id === selectedField) || fields[0];

  const handleFieldChange = (fId: string) => {
    setSelectedField(fId);
    const f = fields.find((item) => item.id === fId);
    if (f) {
      setCrop(f.crop);
      setVariety(f.variety);
      setGrowthStage(f.growthStage);
    }
  };

  const loadImageToPreview = (dataUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;
        const mimeMatch = dataUrl.match(/^data:(image\/[^;]+);/);
        const mime = mimeMatch ? mimeMatch[1] : '';
        const sizeMatch = dataUrl.match(/^data:.*;base64,(.*)$/);
        const rawSize = sizeMatch ? atob(sizeMatch[1]).length : 0;

        if (!allowedImageTypes.includes(mime)) {
          setValidationState('invalid');
          setValidationMessage(t.scan_invalid_image);
          resolve(false);
          return;
        }

        if (width < 80 || height < 80 || rawSize < 512 || rawSize > 15 * 1024 * 1024) {
          setValidationState('unclear');
          setValidationMessage(t.scan_unclear_desc);
          resolve(false);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          setValidationState('invalid');
          setValidationMessage(t.scan_invalid_image);
          resolve(false);
          return;
        }

        context.drawImage(img, 0, 0, width, height);
        const pixels = context.getImageData(0, 0, width, height).data;
        let totalBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        }
        const avgBrightness = totalBrightness / (pixels.length / 4);

        if (avgBrightness < 20 || width * height < 6000) {
          setValidationState('unclear');
          setValidationMessage(t.scan_unclear_desc);
          resolve(false);
          return;
        }

        setValidationState('ready');
        setValidationMessage(t.scan_ready_desc);
        resolve(true);
      };
      img.onerror = () => {
        setValidationState('invalid');
        setValidationMessage(t.scan_invalid_image);
        resolve(false);
      };
      img.src = dataUrl;
    });
  };

  const handleUseValidatedImage = async (dataUrl: string, source: 'camera' | 'gallery' | 'demo') => {
    setCameraUseMode(source);
    setValidationMessage(null);
    const accepted = await loadImageToPreview(dataUrl);
    if (!accepted) {
      setImagePreview(null);
      return;
    }
    setImagePreview(dataUrl);
    setStep('input');
  };

  const handleApplyPreset = async (preset: typeof SAMPLE_SCAN_PRESETS[0]) => {
    setImagePreview(preset.imageUrl);
    setValidationState('ready');
    setValidationMessage(t.scan_ready_desc);
    setCrop(preset.crop);
    setVariety(preset.variety);
    setGrowthStage(preset.growthStage);
    setFarmerNotes(preset.description);
    if (preset.fieldId && fields.some((f) => f.id === preset.fieldId)) {
      setSelectedField(preset.fieldId);
    }

    try {
      setStep('analyzing');
      const result = await api.analyzeCropImage({
        mode: 'demo',
        demoCaseId: preset.id,
        imageBase64: preset.imageUrl,
        crop: preset.crop,
        variety: preset.variety,
        growthStage: preset.growthStage,
        fieldId: preset.fieldId || selectedField,
        farmerNotes: preset.description,
      });
      setAnalysisResult(result);
      setStep('result');
    } catch (err) {
      console.error('Demo analysis error:', err);
      setStep('input');
      setValidationMessage(t.scan_error_generic);
      setValidationState('invalid');
    }
  };

  const handleFileSelection = async (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      await handleUseValidatedImage(result, cameraUseMode === 'gallery' ? 'gallery' : 'camera');
      resetFileInputs();
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const startCamera = async (): Promise<boolean> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraUnavailable(true);
      setCameraPermissionError(false);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOpen(true);
      setCameraPermissionError(false);
      setCameraUnavailable(false);
      return true;
    } catch {
      setCameraPermissionError(true);
      setCameraOpen(false);
      setCameraUnavailable(false);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
      return false;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    handleUseValidatedImage(dataUrl, 'camera');
    stopCamera();
  };

  const retakePhoto = () => {
    setImagePreview(null);
    setValidationState('idle');
    setValidationMessage(null);
    setAnalysisResult(null);
    setCaseSavedMessage(false);
    setStep('input');
    resetFileInputs();
    stopCamera();
  };

  const canAnalyze = Boolean(imagePreview) && validationState === 'ready';

  const runAnalysis = async () => {
    if (!imagePreview || !canAnalyze) return;
    setStep('analyzing');
    setCaseSavedMessage(false);
    setAnalyzingProgress(t.scan_checking_fields);

    try {
      setTimeout(() => setAnalyzingProgress(t.scan_checking_weather), 600);
      setTimeout(() => setAnalyzingProgress(t.scan_preparing), 1200);

      const result = await api.analyzeCropImage({
        imageBase64: imagePreview,
        crop,
        variety,
        growthStage,
        fieldId: selectedField,
        farmerNotes,
      });

      setAnalysisResult(result);
      setStep('result');
    } catch (err) {
      console.error('Analysis error:', err);
      setStep('input');
      setValidationMessage(t.scan_error_generic);
      setValidationState('invalid');
    }
  };

  const handleSaveAsCase = async () => {
    if (!analysisResult) return;
    setSubmittingCase(true);
    try {
      await api.createCase({
        fieldId: selectedField,
        image: imagePreview || '',
        farmerNotes,
        aiAnalysis: analysisResult,
      });
      setCaseSavedMessage(true);
      onCaseCreated();
      setTimeout(() => {
        onClose();
        setStep('input');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCase(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-[28px] shadow-[0_30px_80px_rgba(15,23,42,0.30)] max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-emerald-700 to-green-700 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base tracking-tight truncate">
                {t.scan_ai_scan}
              </h3>
              <p className="text-[10px] sm:text-xs text-emerald-100 truncate">
                {t.scan_field_context}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.scan_close}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800 flex-1">
          {!cameraOpen && step === 'input' && (
            <>
              <div className="text-center px-1">
                <div className="w-16 h-16 bg-emerald-100 rounded-[22px] mx-auto flex items-center justify-center text-3xl shadow-inner">
                  🌱
                </div>
                <h4 className="mt-4 text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {t.scan_check_crop}
                </h4>
                <p className="mt-2 text-sm text-stone-600 max-w-sm mx-auto">
                  {t.scan_take_photo_desc}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setCameraUseMode('camera');
                    const opened = await startCamera();
                    if (!opened && cameraInputRef.current) {
                      cameraInputRef.current.click();
                    }
                  }}
                  className="w-full max-w-xs rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-extrabold text-sm py-3.5 flex items-center justify-center gap-2 shadow-[0_16px_28px_rgba(16,185,129,0.25)]"
                >
                  <Camera className="w-5 h-5" />
                  <span>{t.scan_take_photo}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraUseMode('gallery');
                    galleryInputRef.current?.click();
                  }}
                  className="w-full max-w-xs rounded-2xl bg-white text-stone-800 font-bold text-sm py-3 border border-stone-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5 text-stone-600" />
                  <span>{t.scan_choose_gallery}</span>
                </button>
              </div>

              {cameraPermissionError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <h5 className="font-extrabold text-stone-900">{t.scan_camera_access}</h5>
                  <p className="text-sm text-stone-600 mt-1">{t.scan_camera_access_desc}</p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                    >
                      {t.scan_try_camera_again}
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700"
                    >
                      {t.scan_choose_gallery}
                    </button>
                  </div>
                </div>
              )}

              {cameraUnavailable && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <h5 className="font-extrabold text-stone-900">{t.scan_camera_unavailable}</h5>
                  <p className="text-sm text-stone-600 mt-1">{t.scan_gallery_fallback}</p>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    {t.scan_choose_gallery}
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-extrabold text-emerald-900">{t.scan_photo_tips}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  <li className="flex items-center gap-2"><span>🌿</span><span>{t.scan_tip_visible}</span></li>
                  <li className="flex items-center gap-2"><span>☀️</span><span>{t.scan_tip_light}</span></li>
                  <li className="flex items-center gap-2"><span>🔍</span><span>{t.scan_tip_closer}</span></li>
                  <li className="flex items-center gap-2"><span>📷</span><span>{t.scan_tip_stable}</span></li>
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <button
                  type="button"
                  onClick={() => setCameraUseMode('demo')}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-stone-700"
                >
                  <span>{t.scan_try_demo}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_SCAN_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="relative rounded-xl overflow-hidden border border-stone-200 bg-white p-1.5 text-left"
                    >
                      <div className="relative h-16 w-full overflow-hidden rounded-lg">
                        <img src={preset.imageUrl} alt={preset.crop} className="h-full w-full object-cover" />
                        <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {t.scan_demo_tag}
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] font-bold text-stone-900 truncate">{preset.crop}</div>
                    </button>
                  ))}
                </div>
              </div>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageInputChange} />
              <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageInputChange} />
            </>
          )}

          {cameraOpen && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button type="button" onClick={stopCamera} className="text-sm font-bold text-stone-700">← {t.scan_cancel}</button>
                <span className="text-sm font-extrabold text-stone-900">{t.scan_camera_heading}</span>
              </div>
              <div className="relative overflow-hidden rounded-[26px] border border-stone-200 bg-stone-950 aspect-[4/5] w-full">
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[78%] h-[60%] border-2 border-emerald-300/80 rounded-[28px] bg-transparent shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.12)]" />
                </div>
                <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
                  <div className="bg-black/45 text-white text-xs rounded-full px-3 py-1.5 backdrop-blur-sm">
                    {t.scan_camera_guide}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-1 rounded-2xl border border-stone-300 bg-white py-3 text-sm font-bold text-stone-700">
                  {t.scan_choose_gallery}
                </button>
                <button type="button" onClick={capturePhoto} className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 py-3 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(16,185,129,0.24)]">
                  {t.scan_take_photo}
                </button>
              </div>

              <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageInputChange} />
            </div>
          )}

          {step === 'input' && !cameraOpen && imagePreview && (
            <div className="space-y-4">
              <div className="rounded-[26px] border border-emerald-100 bg-stone-50 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-extrabold text-stone-900">{t.scan_preview_title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {validationState === 'ready' ? t.scan_ready : validationState === 'unclear' ? t.scan_unclear : t.scan_not_crop}
                  </span>
                </div>
                <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-white aspect-[4/3]">
                  <img src={imagePreview} alt={t.scan_cropphoto} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
                <p className="text-sm font-bold text-stone-900">{t.scan_is_visible}</p>
                {validationMessage && (
                  <p className={`mt-2 text-sm ${validationState === 'ready' ? 'text-emerald-700' : validationState === 'unclear' ? 'text-amber-700' : 'text-red-700'}`}>
                    {validationMessage}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={retakePhoto} className="flex-1 rounded-2xl border border-stone-300 bg-white py-3 text-sm font-bold text-stone-700">
                  {t.scan_retake}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  disabled={validationState !== 'ready'}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 disabled:cursor-not-allowed disabled:opacity-50 py-3 text-sm font-extrabold text-white"
                >
                  {t.scan_use_photo}
                </button>
              </div>

              {validationState === 'ready' && (
                <button
                  type="button"
                  onClick={runAnalysis}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(16,185,129,0.24)]"
                >
                  {t.scan_analyze}
                </button>
              )}
            </div>
          )}

          {step === 'analyzing' && (
            <div className="py-10 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin" />
                <Sparkles className="w-6 h-6 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-black text-xl text-stone-900">{t.scan_check_crop}</h4>
                <p className="text-sm text-stone-600 mt-2 max-w-sm mx-auto">{analyzingProgress}</p>
              </div>
            </div>
          )}

          {step === 'result' && analysisResult && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50 p-3">
                <img src={imagePreview || ''} alt={t.scan_cropphoto} className="h-52 w-full object-cover rounded-[18px]" />
              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-200">{t.scan_result_heading}</span>
                  <span className="rounded-full bg-emerald-700/60 border border-emerald-500/50 px-2 py-1 text-[10px] font-bold text-emerald-100">
                    {t.scan_confidence}: {analysisResult.confidence}%
                  </span>
                </div>
                <h4 className="mt-3 text-xl font-black text-white">
                  {analysisResult.possibleIssues[0]?.name || 'Possible Crop Issue'}
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-white/5 p-2 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-200">{t.scan_confidence}</div>
                    <div className="mt-1 font-bold">{analysisResult.confidence}%</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-200">{t.scan_risk}</div>
                    <div className="mt-1 font-bold">{analysisResult.riskLevel || 'High'}</div>
                  </div>
                </div>
              </div>

              <ExplainableAIPanel analysis={analysisResult} />

              <div className="flex gap-2">
                <button type="button" onClick={retakePhoto} className="flex-1 rounded-2xl border border-stone-300 bg-white py-3 text-sm font-bold text-stone-700">
                  {t.scan_retake}
                </button>
                <button type="button" onClick={onClose} className="flex-1 rounded-2xl bg-stone-900 py-3 text-sm font-bold text-white">
                  {t.scan_close}
                </button>
              </div>
            </div>
          )}
        </div>

        {step === 'input' && !cameraOpen && (
          <div className="px-4 sm:px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900">
              {t.scan_cancel}
            </button>
            <button
              type="button"
              onClick={runAnalysis}
              disabled={!canAnalyze}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.scan_scan_crop}</span>
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="px-4 sm:px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <button type="button" onClick={retakePhoto} className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.scan_retake}</span>
            </button>

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-lg">
                {t.scan_close}
              </button>
              <button
                type="button"
                onClick={handleSaveAsCase}
                disabled={submittingCase || caseSavedMessage}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {submittingCase
                    ? t.scan_logging
                    : caseSavedMessage
                    ? t.scan_case_saved
                    : t.scan_log_case}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
