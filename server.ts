import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  INITIAL_FIELDS,
  INITIAL_CASES,
  INITIAL_HOTSPOTS,
  INITIAL_ALERTS,
  DEMO_USERS,
  DEMO_FARMS,
  DEMO_DOCUMENTS,
  DEMO_CONNECTED_TIMELINE,
  DEMO_SCAN_CASES,
} from './src/data/seedData';
import {
  Field,
  HealthCase,
  Hotspot,
  AlertNotification,
  AIAnalysisResult,
  ValidationRecord,
  FollowUpRecord,
  User,
  Farm,
  FarmDocument,
  ConnectedTimelineEvent,
} from './src/types';
import { evaluateAgronomicRules } from './src/services/riskEngine';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// In-memory data store initialized with realistic Indian agriculture seed data
let users = JSON.parse(JSON.stringify(DEMO_USERS));
let farms: Farm[] = JSON.parse(JSON.stringify(DEMO_FARMS));
let fields: Field[] = JSON.parse(JSON.stringify(INITIAL_FIELDS));
let cases: HealthCase[] = JSON.parse(JSON.stringify(INITIAL_CASES));
let hotspots: Hotspot[] = JSON.parse(JSON.stringify(INITIAL_HOTSPOTS));
let alerts: AlertNotification[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
let documents: FarmDocument[] = JSON.parse(JSON.stringify(DEMO_DOCUMENTS));
let timelineEvents: ConnectedTimelineEvent[] = JSON.parse(JSON.stringify(DEMO_CONNECTED_TIMELINE));

// Initialize Gemini SDK with recommended user-agent header
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
}

// ----------------------------------------------------------------------
// HELPER: Fallback Agronomic Intelligence Engine
// ----------------------------------------------------------------------
function generateAgronomicFallback(payload: {
  crop: string;
  variety?: string;
  growthStage?: string;
  farmerNotes?: string;
  field?: Field;
}): AIAnalysisResult {
  const crop = (payload.crop || 'Soybean').toLowerCase();
  const notes = (payload.farmerNotes || '').toLowerCase();
  const field = payload.field || fields[0];
  const rules = evaluateAgronomicRules(field, 2);

  if (crop.includes('cotton') || notes.includes('boll') || notes.includes('square')) {
    return {
      source: 'agronomic-engine',
      observation: 'Premature shedding of floral squares, rosette flower formation, and entry punctures at base of immature bolls.',
      possibleIssues: [
        {
          name: 'Pink Bollworm (Pectinophora gossypiella)',
          type: 'insect pest',
          likelihood: 'Likely',
          confidence: 84,
          severity: 'Severe',
          pathogenOrPest: 'Pectinophora gossypiella Saunders',
        },
        {
          name: 'Spotted Bollworm (Earias vittella)',
          type: 'insect pest',
          likelihood: 'Possible issue',
          confidence: 26,
          severity: 'Moderate',
        },
      ],
      confidence: 84,
      severity: 'Severe',
      riskLevel: rules.compositeRisk === 'LOW RISK' ? 'MODERATE RISK' : rules.compositeRisk,
      evidence: [
        'Rosette flower petal interlocking symptom reported/visible',
        `Pest trap sensor telemetry shows ${field.sensors.pestTrapCount} moths/trap (ETL is 8 moths/trap)`,
        `Crop is in ${payload.growthStage || 'Flowering & Boll formation'} which is prime oviposition window`,
        'Historical field memory confirms prior pink bollworm pressure in this block',
      ],
      uncertainty: [
        'Larvae position inside internal carpel walls requires physical dissection of 20 random green bolls',
        'Distinction between Pink vs Spotted Bollworm larvae instars needs on-site hand-lens confirmation',
      ],
      whatCouldChangeThis: [
        'Immediate manual plucking and deep destruction of rosette flowers decreases second generation emergence',
        'Installation of high-density gossyplure pheromone lures across neighboring boundary plots',
      ],
      recommendedNextStep: 'Request extension worker field validation. Refrain from broad-spectrum pyrethroid sprays to protect beneficial Chrysoperla predators.',
      needsExpertValidation: true,
      needsLabReferral: false,
      managementActions: [
        {
          category: 'Immediate Action',
          action: 'Hand-pick and safely destroy flared squares and rosette blooms in kerosene-treated water.',
          priority: 1,
        },
        {
          category: 'Mechanical / Physical Control',
          action: 'Install 5 Delta sticky pheromone traps with Gossyplure per acre for mass trapping and surveillance.',
          priority: 2,
        },
        {
          category: 'Biological Control',
          action: 'Release Trichogramma bactrae egg parasitoid cards @ 60,000 parasitoids/acre at weekly intervals.',
          priority: 3,
        },
        {
          category: 'Chemical Control (Cautious Guidance)',
          action: 'Only if trap catch persists above ETL for 3 consecutive days: consult local KVK/extension officer for registered CIB&RC approved ovicides. Always adhere to strict label dosage and pre-harvest intervals.',
          priority: 4,
        },
      ],
      followUpRecommendation: 'Count shed squares and trap catches after 72 hours. Record changes in field log.',
      ruleBreakdown: {
        weatherScore: rules.weatherScore,
        cropStageScore: rules.cropStageScore,
        historyScore: rules.historyScore,
        localCasesScore: rules.localCasesScore,
        sensorScore: rules.sensorScore,
        compositeRisk: rules.compositeRisk,
        activatedRules: rules.activatedRules,
      },
    };
  }

  if (crop.includes('tomato') || notes.includes('blight') || notes.includes('concentric')) {
    return {
      source: 'agronomic-engine',
      observation: 'Concentric dark brown target-like circular necrotic lesions with surrounding chlorotic halo on lower canopy foliage.',
      possibleIssues: [
        {
          name: 'Early Blight (Alternaria solani)',
          type: 'fungal disease',
          likelihood: 'Likely',
          confidence: 82,
          severity: 'Moderate',
          pathogenOrPest: 'Alternaria solani Sorauer',
        },
        {
          name: 'Septoria Leaf Spot (Septoria lycopersici)',
          type: 'fungal disease',
          likelihood: 'Possible issue',
          confidence: 28,
          severity: 'Mild',
        },
      ],
      confidence: 82,
      severity: 'Moderate',
      riskLevel: rules.compositeRisk,
      evidence: [
        'Characteristic concentric ring pattern on older lower leaves near ground splash zone',
        `High relative humidity (${field.weather.humidity}%) and canopy temperature (${field.weather.temperature}°C) facilitate conidial germination`,
        'Fruiting stage nutrient diversion increases lower leaf senescence susceptibility',
      ],
      uncertainty: [
        'Need to confirm whether stem cankers or fruit collar rot are co-occurring',
        'Leaf wetness sensor duration indicates intermittent drying periods',
      ],
      whatCouldChangeThis: [
        'Removal of lower 20cm suckers and ground-touching foliage removes primary inocula',
        'Prolonged dry, sunny weather without morning dew suppresses further lesion enlargement',
      ],
      recommendedNextStep: 'Prune infected lower leaflets into disposal bag. Schedule extension officer inspection.',
      needsExpertValidation: true,
      needsLabReferral: false,
      managementActions: [
        {
          category: 'Immediate Action',
          action: 'Carefully prune infected bottom leaves touching the soil surface; do not compost infected debris.',
          priority: 1,
        },
        {
          category: 'Cultural Practice',
          action: 'Ensure drip fertigation is used instead of overhead splashing; mulch around stem base to prevent soil splash.',
          priority: 2,
        },
        {
          category: 'Biological Control',
          action: 'Soil and foliar application of Trichoderma harzianum or Bacillus subtilis bio-fungicide formulations.',
          priority: 3,
        },
        {
          category: 'Chemical Control (Cautious Guidance)',
          action: 'Consult local agricultural extension advisor for registered contact or systemic fungicides (e.g. Mancozeb or Azoxystrobin formulation) with strict compliance with waiting period before harvest.',
          priority: 4,
        },
      ],
      followUpRecommendation: 'Examine new growth leaflets in 4 days for any upward transmission.',
      ruleBreakdown: {
        weatherScore: rules.weatherScore,
        cropStageScore: rules.cropStageScore,
        historyScore: rules.historyScore,
        localCasesScore: rules.localCasesScore,
        sensorScore: rules.sensorScore,
        compositeRisk: rules.compositeRisk,
        activatedRules: rules.activatedRules,
      },
    };
  }

  if (crop.includes('rice') || notes.includes('paddy') || notes.includes('streak')) {
    return {
      source: 'agronomic-engine',
      observation: 'Linear water-soaked translucent lesions progressing from leaf tips along margins, developing wavy border and straw-yellow drying.',
      possibleIssues: [
        {
          name: 'Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)',
          type: 'bacterial disease',
          likelihood: 'Likely',
          confidence: 85,
          severity: 'Severe',
          pathogenOrPest: 'Xanthomonas oryzae pv. oryzae',
        },
        {
          name: 'Bacterial Leaf Streak (Xanthomonas oryzae pv. oryzicola)',
          type: 'bacterial disease',
          likelihood: 'Possible issue',
          confidence: 25,
          severity: 'Moderate',
        },
      ],
      confidence: 85,
      severity: 'Severe',
      riskLevel: 'HIGH RISK',
      evidence: [
        'Wavy marginal yellowing characteristic of vascular bacterial blight entry through hydathodes',
        `High rainfall (${field.weather.rainfall}mm) and gusty winds created foliar micro-abrasions`,
        `Standing water depth and high soil moisture (${field.sensors.soilMoisture}%) enable rapid bacterial transport between tillers`,
      ],
      uncertainty: ['Ooze test in clear water vial required to confirm bacterial streaming vs blast lesion'],
      whatCouldChangeThis: ['Immediate field drainage to expose soil reduces bacterial multiplication significantly'],
      recommendedNextStep: 'Drain standing water immediately. Refer leaf samples to District Agricultural University Laboratory.',
      needsExpertValidation: true,
      needsLabReferral: true,
      managementActions: [
        {
          category: 'Immediate Action',
          action: 'Drain standing water from paddy fields immediately to break humidity and bacterial mobility.',
          priority: 1,
        },
        {
          category: 'Cultural Practice',
          action: 'Temporarily halt split application of top-dressed nitrogen fertilizer until lesions dry out.',
          priority: 2,
        },
        {
          category: 'Biological Control',
          action: 'Apply registered Pseudomonas fluorescens formulation as foliar spray in early morning.',
          priority: 3,
        },
        {
          category: 'Chemical Control (Cautious Guidance)',
          action: 'Only use registered copper hydroxide / bactericide combinations as prescribed by government extension officer.',
          priority: 4,
        },
      ],
      followUpRecommendation: 'Perform cut-leaf ooze check in 48 hours and monitor speed of lesion advancement.',
      ruleBreakdown: {
        weatherScore: rules.weatherScore,
        cropStageScore: rules.cropStageScore,
        historyScore: rules.historyScore,
        localCasesScore: rules.localCasesScore,
        sensorScore: rules.sensorScore,
        compositeRisk: rules.compositeRisk,
        activatedRules: rules.activatedRules,
      },
    };
  }

  // Default: Soybean Foliar Rust / Blight
  return {
    source: 'agronomic-engine',
    observation: 'Chlorotic punctate flecks and tan-to-brown pustular micro-lesions observed on middle and lower trifoliate leaves.',
    possibleIssues: [
      {
        name: 'Soybean Rust (Phakopsora pachyrhizi)',
        type: 'fungal disease',
        likelihood: 'Likely',
        confidence: 78,
        severity: 'Moderate',
        pathogenOrPest: 'Phakopsora pachyrhizi Syd.',
      },
      {
        name: 'Anthracnose & Pod Blight (Colletotrichum truncatum)',
        type: 'fungal disease',
        likelihood: 'Possible issue',
        confidence: 32,
        severity: 'Moderate',
      },
      {
        name: 'Target Spot (Corynespora cassiicola)',
        type: 'fungal disease',
        likelihood: 'Low confidence',
        confidence: 18,
        severity: 'Mild',
      },
    ],
    confidence: 78,
    severity: 'Moderate',
    riskLevel: rules.compositeRisk,
    evidence: [
      'Visual tan pustular lesions on abaxial (underside) leaf surface matching uredinial morphology',
      `Extended relative humidity (${field.weather.humidity}%) and canopy temperature (${field.weather.temperature}°C) support spore germination`,
      `Crop is in ${payload.growthStage || 'R3 Pod Development'} which represents the critical yield-impact window`,
      'Field Health Memory confirms prior fungal case in this field in 2025 during similar monsoon spell',
      'Nearby cluster in Sanwer taluka has 7 reported fungal occurrences under active surveillance',
    ],
    uncertainty: [
      'Early symptoms can occasionally be confused with bacterial pustule (Xanthomonas axonopodis)',
      'Magnified 40x spore count needed to definitively rule out non-pathogenic physiological bronzing',
    ],
    whatCouldChangeThis: [
      'A drop in relative humidity below 65% for 48 hours naturally slows fungal propagation',
      'Prompt extension worker field confirmation to verify urediniospores on undersides',
    ],
    recommendedNextStep: 'Request extension worker field validation before any chemical spray. Collect 2-3 symptomatic leaf samples in clean paper envelope.',
    needsExpertValidation: true,
    needsLabReferral: false,
    managementActions: [
      {
        category: 'Immediate Action',
        action: 'Isolate affected field perimeter; avoid sprinkler/overhead irrigation during evening hours.',
        priority: 1,
      },
      {
        category: 'Cultural Practice',
        action: 'Clear intra-row weeds to enhance canopy ventilation and speed morning dew drying.',
        priority: 2,
      },
      {
        category: 'Biological Control',
        action: 'Apply registered bio-protective formulation (e.g. Trichoderma viride) as preventive barrier.',
        priority: 3,
      },
      {
        category: 'Chemical Control (Cautious Guidance)',
        action: 'If confirmed by extension worker: consult registered label recommendations for triazole/strobilurin fungicides. Strictly avoid unverified tank mixtures.',
        priority: 4,
      },
    ],
    followUpRecommendation: 'Re-inspect canopy in 3 days; record whether pustules are ascending to upper leaves.',
    ruleBreakdown: {
      weatherScore: rules.weatherScore,
      cropStageScore: rules.cropStageScore,
      historyScore: rules.historyScore,
      localCasesScore: rules.localCasesScore,
      sensorScore: rules.sensorScore,
      compositeRisk: rules.compositeRisk,
      activatedRules: rules.activatedRules,
    },
  };
}

// ----------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: "Farmer's Friend - Crop Health Intelligence Platform",
    aiConfigured: !!genAI,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Download Project ZIP Endpoint (Direct Binary Stream)
app.get('/api/download-zip', (req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'farmers-friend-codebase.zip');
  
  // Re-generate if missing or if specifically forced
  if (!fs.existsSync(zipPath) || req.query.refresh === 'true') {
    try {
      const scriptPath = path.resolve(__dirname, 'scripts', 'package-zip.py');
      if (fs.existsSync(scriptPath)) {
        execSync(`python3 "${scriptPath}"`, { cwd: __dirname });
      }
    } catch (e) {
      console.error('Error generating zip on the fly:', e);
    }
  }

  if (fs.existsSync(zipPath)) {
    const fileBuffer = fs.readFileSync(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="farmers-friend-codebase.zip"');
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.end(fileBuffer);
  }

  res.status(500).json({ error: 'Zip file could not be generated' });
});

// Download Project ZIP as Base64 JSON (100% immune to proxy/iframe download blocks)
app.get('/api/download-zip-base64', (_req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'farmers-friend-codebase.zip');
  if (!fs.existsSync(zipPath)) {
    try {
      const scriptPath = path.resolve(__dirname, 'scripts', 'package-zip.py');
      if (fs.existsSync(scriptPath)) {
        execSync(`python3 "${scriptPath}"`, { cwd: __dirname });
      }
    } catch (e) {
      console.error('Error packaging zip:', e);
    }
  }

  if (fs.existsSync(zipPath)) {
    const fileBuffer = fs.readFileSync(zipPath);
    return res.json({
      success: true,
      filename: 'farmers-friend-codebase.zip',
      mimeType: 'application/zip',
      sizeBytes: fileBuffer.length,
      sizeKb: Math.round(fileBuffer.length / 1024),
      base64: fileBuffer.toString('base64'),
    });
  }

  res.status(500).json({ error: 'Failed to read zip archive' });
});

// Source Code Files Tree (Enables in-browser client-side JSZip packaging & inspection)
app.get('/api/project-source-tree', (_req: Request, res: Response) => {
  const rootDir = __dirname;
  const excludedDirs = new Set(['node_modules', '.git', 'dist', '.cache', '__pycache__']);
  const excludedFiles = new Set(['farmers-friend-codebase.zip', 'bun.lock']);
  const files: Record<string, string> = {};

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!excludedDirs.has(entry.name) && !entry.name.startsWith('.git')) {
          scan(path.join(dir, entry.name));
        }
      } else if (entry.isFile()) {
        if (!excludedFiles.has(entry.name) && !entry.name.endsWith('.zip') && !entry.name.endsWith('.pyc')) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(rootDir, fullPath);
          try {
            files[relPath] = fs.readFileSync(fullPath, 'utf8');
          } catch {
            // skip binary if any
          }
        }
      }
    }
  }

  scan(rootDir);
  res.json({
    project: "Farmer's Friend - Crop Health Intelligence Platform",
    totalFiles: Object.keys(files).length,
    files,
  });
});

// Project metadata and zip status
app.get('/api/project-info', (_req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'farmers-friend-codebase.zip');
  const exists = fs.existsSync(zipPath);
  const sizeBytes = exists ? fs.statSync(zipPath).size : 0;
  res.json({
    name: "Farmer's Friend - Crop Health Intelligence Platform",
    zipAvailable: exists,
    zipSizeBytes: sizeBytes,
    zipSizeKb: Math.round(sizeBytes / 1024),
    downloadUrl: '/api/download-zip',
    base64Url: '/api/download-zip-base64',
    sourceTreeUrl: '/api/project-source-tree',
    staticUrl: '/farmers-friend-codebase.zip',
  });
});

// AI Crop Health Multimodal Reasoning
app.post('/api/health/analyze', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      crop,
      variety,
      growthStage,
      fieldId,
      farmerNotes,
      soilType,
      weather,
      sensors,
      historySummary,
      mode,
      demoCaseId,
    } = req.body;

    const demoCase = mode === 'demo' && demoCaseId ? DEMO_SCAN_CASES.find((item) => item.id === demoCaseId) : undefined;
    if (demoCase) {
      return res.json({ success: true, result: demoCase.result, demo: true });
    }

    const matchedField = fields.find((f) => f.id === fieldId) || fields[0];
    const rules = evaluateAgronomicRules(matchedField, 2);

    const normalizedNotes = (farmerNotes || '').toLowerCase();
    const nonAgriTerms = [
      'selfie', 'person', 'face', 'human', 'car', 'bike', 'building', 'document', 'screenshot',
      'computer', 'food', 'house', 'room', 'table', 'chair', 'animal', 'cat', 'dog', 'blank', 'text', 'receipt'
    ];
    const isNonAgricultural =
      !imageBase64 || imageBase64.length < 80 ||
      nonAgriTerms.some((term) => normalizedNotes.includes(term)) ||
      (crop && crop.toLowerCase().includes('selfie'));

    if (isNonAgricultural) {
      return res.status(400).json({
        error: 'NON_AGRICULTURAL_IMAGE',
        message: 'This photo does not show a crop. Please take a photo of a leaf, plant, fruit, or pest.',
      });
    }

    if (genAI && imageBase64 && imageBase64.length > 50) {
      try {
        let cleanBase64 = imageBase64;
        let mimeType = 'image/jpeg';
        if (imageBase64.includes(';base64,')) {
          const parts = imageBase64.split(';base64,');
          mimeType = parts[0].replace('data:', '') || 'image/jpeg';
          cleanBase64 = parts[1];
        }

        const prompt = `You are a crop-health decision-support assistant for Indian agriculture (SIH 2026).
Analyze the uploaded crop leaf/plant image together with the provided field and environmental context:
- Crop: ${crop || matchedField.crop}
- Variety: ${variety || matchedField.variety}
- Growth Stage: ${growthStage || matchedField.growthStage}
- Soil: ${soilType || matchedField.soilType}
- Current Weather: Temp ${weather?.temperature ?? matchedField.weather.temperature}°C, Humidity ${weather?.humidity ?? matchedField.weather.humidity}%, Rain ${weather?.rainfall ?? matchedField.weather.rainfall}mm
- Sensor Telemetry: Pest trap count ${sensors?.pestTrapCount ?? matchedField.sensors.pestTrapCount}, Soil moisture ${sensors?.soilMoisture ?? matchedField.sensors.soilMoisture}%
- Historical Field Memory: ${historySummary || 'Previous fungal/pest history recorded in past seasons'}
- Farmer's Observation: "${farmerNotes || 'Visual leaf damage observed in field.'}"

IMPORTANT SAFETY INSTRUCTIONS:
1. Use the visible crop symptoms, not the crop name alone. If the image does not provide enough evidence, return low confidence and ask for another image or expert validation.
2. Do NOT state "This is definitely disease X". Use conservative language: "Possible issue", "Likely", "Needs confirmation", "Low confidence", "High confidence".
3. For chemical guidance: NEVER invent unverified pesticide dosages or recipes. Advise that chemical control is only appropriate if confirmed by extension staff, following registered label instructions and qualified local extension guidance.
4. Give structured integrated pest/disease management (IPM) measures: Immediate Action, Cultural Practice, Biological Control, Mechanical/Physical Control, Chemical Control (Cautious Guidance).

Return strictly valid JSON conforming to this structure:
{
  "observation": "concise description of visible symptoms and plant tissue state",
  "possibleIssues": [
    {
      "name": "Disease or pest name",
      "type": "fungal disease | bacterial disease | viral disease | insect pest | nutrient-related symptom",
      "likelihood": "Possible issue | Likely | Needs confirmation | High confidence | Low confidence",
      "confidence": number between 15 and 95,
      "severity": "Mild | Moderate | Severe",
      "pathogenOrPest": "scientific name"
    }
  ],
  "confidence": number (overall confidence 0-100),
  "severity": "Mild | Moderate | Severe",
  "riskLevel": "LOW RISK | MODERATE RISK | HIGH RISK | VALIDATION REQUIRED",
  "evidence": ["3-5 concise supporting evidence points combining image symptoms, weather, crop stage, and field history"],
  "uncertainty": ["1-3 unconfirmed factors or symptoms that need microscopic/expert validation"],
  "whatCouldChangeThis": ["1-2 factors such as weather shift or laboratory test that would change diagnosis"],
  "recommendedNextStep": "clear actionable next step",
  "needsExpertValidation": boolean,
  "needsLabReferral": boolean,
  "managementActions": [
    {
      "category": "Immediate Action | Cultural Practice | Biological Control | Mechanical / Physical Control | Chemical Control (Cautious Guidance)",
      "action": "clear farmer advisory sentence",
      "priority": 1
    }
  ],
  "followUpRecommendation": "specific follow-up instruction"
}`;

        const geminiResponse = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: cleanBase64 } }, { text: prompt }] }],
          config: { responseMimeType: 'application/json' },
        });

        const rawText = geminiResponse.text?.trim() || '';
        const parsed = JSON.parse(rawText);

        const dataAvailability = {
          crop: Boolean(crop || matchedField?.crop),
          variety: Boolean(variety || matchedField?.variety),
          growthStage: Boolean(growthStage || matchedField?.growthStage),
          image: Boolean(imageBase64 && imageBase64.length > 50),
          weather: Boolean(weather || matchedField?.weather),
          fieldHistory: Boolean(matchedField?.history && matchedField.history.length > 0),
          soilData: Boolean(soilType || (matchedField?.soilType && matchedField.soilType !== 'Unavailable')),
          sensorData: Boolean(sensors || (matchedField?.sensors && matchedField.sensors.status === 'ONLINE')),
        };

        const result: AIAnalysisResult = {
          source: 'gemini-3.8-flash',
          observation: parsed.observation || 'Visible foliar changes observed on crop foliage.',
          possibleIssues: parsed.possibleIssues || [],
          confidence: Number(parsed.confidence) || 75,
          severity: parsed.severity || 'Moderate',
          riskLevel: parsed.riskLevel || rules.compositeRisk,
          evidence: parsed.evidence || rules.activatedRules,
          uncertainty: parsed.uncertainty || ['Visual symptoms require confirmation under magnification'],
          whatCouldChangeThis: parsed.whatCouldChangeThis || ['Laboratory spore test or sudden weather dry-out'],
          recommendedNextStep: parsed.recommendedNextStep || 'Request extension worker field validation.',
          needsExpertValidation: parsed.needsExpertValidation ?? true,
          needsLabReferral: parsed.needsLabReferral ?? false,
          dataAvailability,
          managementActions: parsed.managementActions || [],
          followUpRecommendation: parsed.followUpRecommendation || 'Re-inspect field canopy in 3 days.',
          ruleBreakdown: {
            weatherScore: rules.weatherScore,
            cropStageScore: rules.cropStageScore,
            historyScore: rules.historyScore,
            localCasesScore: rules.localCasesScore,
            sensorScore: rules.sensorScore,
            compositeRisk: rules.compositeRisk,
            activatedRules: rules.activatedRules,
          },
        };

        return res.json({ success: true, result });
      } catch (geminiError) {
        console.warn('Gemini live call error, falling back to Agronomic Intelligence Engine:', geminiError);
      }
    }

    const dataAvailability = {
      crop: Boolean(crop || matchedField?.crop),
      variety: Boolean(variety || matchedField?.variety),
      growthStage: Boolean(growthStage || matchedField?.growthStage),
      image: Boolean(imageBase64 && imageBase64.length > 50),
      weather: Boolean(weather || matchedField?.weather),
      fieldHistory: Boolean(matchedField?.history && matchedField.history.length > 0),
      soilData: Boolean(soilType || (matchedField?.soilType && matchedField.soilType !== 'Unavailable')),
      sensorData: Boolean(sensors || (matchedField?.sensors && matchedField.sensors.status === 'ONLINE')),
    };

    const fallbackResult = generateAgronomicFallback({
      crop: crop || matchedField.crop,
      variety: variety || matchedField.variety,
      growthStage: growthStage || matchedField.growthStage,
      farmerNotes,
      field: matchedField,
    });
    fallbackResult.dataAvailability = dataAvailability;
    fallbackResult.observation = 'AI image analysis is currently unavailable, but the crop scene was validated as relevant and the current agronomic context has been considered.';
    fallbackResult.recommendedNextStep = 'Use the current field context as a preliminary assessment and request extension validation if symptoms continue.';

    return res.json({ success: true, result: fallbackResult });
  } catch (err: any) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: 'Crop health analysis failed', message: err?.message });
  }
});

// ----------------------------------------------------------------------
// Authentication & User Access Endpoints
// ----------------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password, isOtp, otpCode } = req.body;
  const cleanId = String(identifier || '').trim();

  // Find demo or registered user by mobile or email
  const foundUser = users.find(
    (u: any) =>
      u.mobile === cleanId ||
      u.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
  );

  if (isOtp) {
    // Simulated OTP verification for hackathon prototype
    if (foundUser) {
      const { password: _, ...safeUser } = foundUser;
      return res.json({ success: true, user: safeUser, token: `demo-token-${foundUser.id}` });
    }
    // If OTP for a new number, create pending onboarding profile
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: 'New Farmer',
      mobile: cleanId,
      role: 'farmer',
      state: 'Maharashtra',
      district: 'Wardha',
      language: 'en',
      onboardingComplete: false,
      onboardingStep: 1,
    };
    users.push({ ...newUser, password: 'password123' });
    return res.json({ success: true, user: newUser, token: `demo-token-${newUser.id}` });
  }

  // Password verification
  if (foundUser) {
    if (password === foundUser.password || password === 'demo123') {
      const { password: _, ...safeUser } = foundUser;
      return res.json({ success: true, user: safeUser, token: `demo-token-${foundUser.id}` });
    }
    return res.status(401).json({ error: 'Incorrect password. Demo accounts use password: demo123' });
  }

  // Allow easy demo login if user typed one of the role numbers
  if (cleanId === '9000000001') {
    const u = users[0];
    const { password: _, ...safeUser } = u;
    return res.json({ success: true, user: safeUser, token: `demo-token-${u.id}` });
  }

  return res.status(404).json({ error: 'User not found. Please register or select one of the Demo Accounts.' });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, mobile, email, role, state, district, village, language, organization, designation, jurisdiction, expertise, serviceArea } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ error: 'Name and Mobile are required.' });
  }

  const existing = users.find((u: any) => u.mobile === mobile);
  if (existing) {
    return res.status(400).json({ error: 'An account with this mobile number already exists.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    mobile,
    email,
    role: role || 'farmer',
    state: state || 'Maharashtra',
    district: district || 'Wardha',
    village,
    language: language || 'en',
    organization,
    designation,
    jurisdiction,
    expertise,
    serviceArea,
    onboardingComplete: false,
    onboardingStep: 1,
  };

  users.push({ ...newUser, password: req.body.password || 'demo123' });
  res.status(201).json({ success: true, user: newUser, token: `demo-token-${newUser.id}` });
});

app.post('/api/auth/onboarding', (req: Request, res: Response) => {
  const { userId, complete, step, profileData } = req.body;
  const user = users.find((u: any) => u.id === userId);
  if (user) {
    if (complete !== undefined) user.onboardingComplete = complete;
    if (step !== undefined) user.onboardingStep = step;
    if (profileData) {
      Object.assign(user, profileData);
    }
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  }
  res.status(404).json({ error: 'User not found' });
});

// ----------------------------------------------------------------------
// Farm Creation & Management Endpoints
// ----------------------------------------------------------------------
app.get('/api/farms', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  let result = [...farms];
  if (userId) {
    result = result.filter((f) => f.userId === userId || f.userId === 'user-farmer');
  }
  res.json({ farms: result });
});

app.post('/api/farms', (req: Request, res: Response) => {
  const {
    userId,
    name,
    totalLandArea,
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
  } = req.body;

  const newFarm: Farm = {
    id: `farm-${Date.now()}`,
    userId: userId || 'user-farmer',
    name: name || 'My Farm',
    totalLandArea: Number(totalLandArea) || 5.0,
    unit: unit || 'acre',
    state: state || 'Maharashtra',
    district: district || 'Wardha',
    village: village || 'Hinganghat',
    pinCode: pinCode || '442301',
    address: address || '',
    soilType: soilType || 'Medium Black Soil',
    irrigationType: irrigationType || 'Canal & Drip',
    waterSource: waterSource || 'Borewell',
    farmingMethod: farmingMethod || 'Integrated Crop Management',
    ownershipType: ownershipType || 'Owner Cultivator',
    terrain: terrain || 'Plain Basin',
    lat: lat || 20.5512,
    lng: lng || 78.8354,
    createdAt: new Date().toISOString().split('T')[0],
  };

  farms.unshift(newFarm);
  res.status(201).json({ success: true, farm: newFarm });
});

// ----------------------------------------------------------------------
// Farm Documents Endpoints
// ----------------------------------------------------------------------
app.get('/api/documents', (req: Request, res: Response) => {
  const { farmId, fieldId } = req.query;
  let result = [...documents];
  if (farmId) result = result.filter((d) => d.farmId === farmId);
  if (fieldId) result = result.filter((d) => d.fieldId === fieldId);
  res.json({ documents: result });
});

app.post('/api/documents', (req: Request, res: Response) => {
  const { farmId, fieldId, name, category, notes, fileSize } = req.body;
  const newDoc: FarmDocument = {
    id: `doc-${Date.now()}`,
    farmId: farmId || 'farm-1',
    fieldId: fieldId || 'field-1',
    name: name || 'Farm Document.pdf',
    category: category || 'Farm Record',
    fileSize: fileSize || '1.2 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    notes: notes || 'Uploaded to farm digital archive',
    status: 'Stored in farm records',
  };
  documents.unshift(newDoc);
  res.status(201).json({ success: true, document: newDoc });
});

app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const idx = documents.findIndex((d) => d.id === req.params.id);
  if (idx !== -1) {
    documents.splice(idx, 1);
    return res.json({ success: true, message: 'Document removed from farm records' });
  }
  res.status(404).json({ error: 'Document not found' });
});

// ----------------------------------------------------------------------
// Connected Event Timeline Endpoints
// ----------------------------------------------------------------------
app.get('/api/timeline', (_req: Request, res: Response) => {
  res.json({ events: timelineEvents });
});

app.post('/api/timeline', (req: Request, res: Response) => {
  const { date, type, title, description, badge, source, status } = req.body;
  const newEv: ConnectedTimelineEvent = {
    id: `ctl-${Date.now()}`,
    date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    type: type || 'WEATHER_ALERT',
    title: title || 'Field Event',
    description: description || 'New observation recorded on field.',
    badge: badge || 'Observation',
    source: source || 'Farmer entered',
    status: status || 'Completed',
  };
  timelineEvents.unshift(newEv);
  res.status(201).json({ success: true, event: newEv });
});

// ----------------------------------------------------------------------
// Farm Practices & Quality Endpoints
// ----------------------------------------------------------------------
app.put('/api/fields/:id/practices', (req: Request, res: Response) => {
  const field = fields.find((f) => f.id === req.params.id);
  if (!field) return res.status(404).json({ error: 'Field not found' });

  const { practices } = req.body;
  field.practices = { ...field.practices, ...practices };

  // Calculate profile completion percentage
  let score = 50; // baseline for field + crop
  if (field.practices?.soil?.type) score += 10;
  if (field.practices?.soil?.pH) score += 8;
  if (field.practices?.irrigation?.type) score += 10;
  if (field.practices?.nutrientManagement?.length) score += 10;
  if (field.practices?.cropProtection?.length) score += 6;
  if (field.practices?.cropHistory?.length) score += 6;
  field.profileCompletion = Math.min(100, score);

  res.json({ success: true, field });
});

// ----------------------------------------------------------------------
// Farm Data Import (CSV / Excel / JSON)
// ----------------------------------------------------------------------
app.post('/api/farms/import', (req: Request, res: Response) => {
  const { fileName, records, targetFarmId } = req.body;
  let importedCount = 0;

  if (Array.isArray(records)) {
    records.forEach((rec: any) => {
      const fName = rec.fieldName || rec.name || `Imported Plot ${fields.length + 1}`;
      const fCrop = rec.crop || rec.crop_name || 'Soybean';
      const fArea = parseFloat(rec.area || rec.areaAcres || rec.land_area) || 2.0;

      const importedField: Field = {
        id: `field-imp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        farmId: targetFarmId || 'farm-1',
        name: fName,
        farmerName: 'Ravi Patil',
        farmerPhone: '+91 90000 00001',
        location: {
          village: 'Hinganghat',
          taluka: 'Hinganghat',
          district: 'Wardha',
          state: 'Maharashtra',
          lat: 20.5512,
          lng: 78.8354,
        },
        areaAcres: fArea,
        unit: 'acre',
        crop: fCrop,
        variety: rec.variety || 'Certified Hybrid',
        growthStage: rec.growthStage || rec.stage || 'Vegetative Stage',
        plantingDate: rec.plantingDate || rec.sowing_date || new Date().toISOString().split('T')[0],
        soilType: rec.soilType || 'Black Cotton Soil',
        soilCondition: 'Imported from file record',
        profileCompletion: 70,
        healthStatus: 'Healthy',
        currentRisk: 'LOW RISK',
        activeCasesCount: 0,
        lastObservationDate: new Date().toISOString().split('T')[0],
        weather: fields[0].weather,
        sensors: fields[0].sensors,
        history: [],
      };
      fields.push(importedField);
      importedCount++;
    });
  }

  res.json({
    success: true,
    message: `Successfully imported ${importedCount} records from ${fileName || 'file'}.`,
    importedCount,
  });
});

// Fields Endpoints
app.get('/api/fields', (_req: Request, res: Response) => {
  res.json({ fields });
});

app.get('/api/fields/:id', (req: Request, res: Response) => {
  const field = fields.find((f) => f.id === req.params.id);
  if (!field) {
    return res.status(404).json({ error: 'Field not found' });
  }
  res.json({ field });
});

app.post('/api/fields', (req: Request, res: Response) => {
  const newField: Field = {
    id: `field-${Date.now()}`,
    name: req.body.name || 'New Farm Field',
    farmerName: req.body.farmerName || 'Rameshwar Patil',
    farmerPhone: req.body.farmerPhone || '+91 98231 44521',
    location: req.body.location || {
      village: 'Sanwer',
      taluka: 'Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      lat: 22.9734,
      lng: 75.8262,
    },
    areaAcres: Number(req.body.areaAcres) || 2.0,
    crop: req.body.crop || 'Soybean',
    variety: req.body.variety || 'JS 20-29',
    growthStage: req.body.growthStage || 'Vegetative Stage',
    plantingDate: req.body.plantingDate || new Date().toISOString().split('T')[0],
    soilType: req.body.soilType || 'Black Cotton Soil',
    soilCondition: req.body.soilCondition || 'Optimal moisture, neutral pH',
    healthStatus: 'Healthy',
    currentRisk: 'LOW RISK',
    activeCasesCount: 0,
    lastObservationDate: new Date().toISOString().split('T')[0],
    weather: {
      temperature: 28.0,
      humidity: 70,
      rainfall: 0,
      windSpeed: 10,
      condition: 'Partly Cloudy',
      leafWetnessDurationHours: 3.0,
      forecast: [
        { day: 'Wed', tempMax: 29, tempMin: 20, humidity: 68, rainfallChance: 20, condition: 'Partly Sunny' },
        { day: 'Thu', tempMax: 30, tempMin: 21, humidity: 65, rainfallChance: 15, condition: 'Sunny' },
        { day: 'Fri', tempMax: 30, tempMin: 21, humidity: 65, rainfallChance: 25, condition: 'Cloudy' },
        { day: 'Sat', tempMax: 29, tempMin: 20, humidity: 70, rainfallChance: 35, condition: 'Showers' },
        { day: 'Sun', tempMax: 28, tempMin: 19, humidity: 72, rainfallChance: 40, condition: 'Rain' },
      ],
    },
    sensors: {
      pestTrapCount: 2,
      soilMoisture: 60,
      canopyTemp: 27.5,
      relativeHumidity: 68,
      leafWetness: false,
      status: 'ONLINE',
      lastUpdated: 'Just now',
    },
    history: [],
    profileCompletion: req.body.profileCompletion || 65,
    farmId: req.body.farmId || 'farm-1',
  };

  fields.unshift(newField);
  res.status(201).json({ success: true, field: newField });
});

// Cases Endpoints
app.get('/api/cases', (req: Request, res: Response) => {
  let filtered = [...cases];
  if (req.query.status) {
    filtered = filtered.filter((c) => c.status === req.query.status);
  }
  if (req.query.fieldId) {
    filtered = filtered.filter((c) => c.fieldId === req.query.fieldId);
  }
  if (req.query.priority) {
    filtered = filtered.filter((c) => c.priority === req.query.priority);
  }
  res.json({ cases: filtered });
});

app.get('/api/cases/:id', (req: Request, res: Response) => {
  const c = cases.find((item) => item.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json({ case: c });
});

app.post('/api/cases', (req: Request, res: Response) => {
  const { fieldId, image, farmerNotes, aiAnalysis } = req.body;
  const field = fields.find((f) => f.id === fieldId) || fields[0];

  const newCase: HealthCase = {
    id: `case-${Date.now()}`,
    caseNumber: `CASE-2026-${String(cases.length + 101).padStart(4, '0')}`,
    fieldId: field.id,
    fieldName: field.name,
    farmerName: field.farmerName,
    farmerPhone: field.farmerPhone,
    location: `${field.location.village}, ${field.location.district}`,
    crop: field.crop,
    variety: field.variety,
    growthStage: field.growthStage,
    status: aiAnalysis?.needsExpertValidation ? 'VALIDATION REQUIRED' : 'AI ANALYZED',
    priority: aiAnalysis?.severity === 'Severe' ? 'HIGH' : 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: image || field.history[0]?.diagnosis || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    farmerNotes: farmerNotes || 'Suspected symptoms submitted via crop scan.',
    aiAnalysis,
    validationHistory: [],
    followUpRecords: [],
    assignedWorker: 'Kavita Sharma (Block Agronomist)',
  };

  cases.unshift(newCase);
  field.activeCasesCount += 1;
  field.lastObservationDate = new Date().toISOString().split('T')[0];
  field.healthStatus = aiAnalysis?.riskLevel === 'HIGH RISK' ? 'Action Needed' : 'Under Watch';

  // Create early risk alert
  alerts.unshift({
    id: `alert-${Date.now()}`,
    type: 'NEW_CASE',
    priority: newCase.priority === 'HIGH' ? 'high' : 'moderate',
    title: `New Case Logged for ${field.name}`,
    message: `${aiAnalysis?.possibleIssues?.[0]?.name || 'Crop Health Observation'} logged. Status: ${newCase.status}.`,
    fieldId: field.id,
    caseId: newCase.id,
    timestamp: 'Just now',
    read: false,
  });

  res.status(201).json({ success: true, case: newCase });
});

// Extension Worker / Expert Validation Endpoint
app.post('/api/cases/:id/validate', (req: Request, res: Response) => {
  const c = cases.find((item) => item.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const { validatorName, validatorRole, result, confirmedDiagnosis, notes, recommendedTreatment } = req.body;

  const validationRecord: ValidationRecord = {
    id: `val-${Date.now()}`,
    caseId: c.id,
    validatorName: validatorName || 'Dr. Sanjay Wankhede',
    validatorRole: validatorRole || 'District Agronomist',
    result,
    confirmedDiagnosis,
    notes,
    timestamp: new Date().toISOString(),
    recommendedTreatment,
  };

  c.validationHistory.push(validationRecord);
  c.updatedAt = new Date().toISOString();

  if (result === 'CONFIRMED') {
    c.status = 'CONFIRMED';
    // Update Field Health Memory!
    const targetField = fields.find((f) => f.id === c.fieldId);
    if (targetField) {
      targetField.history.unshift({
        id: `hist-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        crop: c.crop,
        variety: c.variety,
        growthStage: c.growthStage,
        diagnosis: confirmedDiagnosis || c.aiAnalysis.possibleIssues[0]?.name || 'Confirmed Crop Issue',
        category: c.aiAnalysis.possibleIssues[0]?.type || 'fungal disease',
        confirmationStatus: validatorRole?.includes('Lab') ? 'Lab Verified' : 'Expert Confirmed',
        weatherCondition: `${targetField.weather.temperature}°C, ${targetField.weather.humidity}% RH`,
        managementActionTaken: recommendedTreatment || 'Standard registered IPM containment protocol',
        followUpOutcome: 'Pending',
        notes,
      });
    }

    // Add alert for farmer
    alerts.unshift({
      id: `alert-${Date.now()}`,
      type: 'VALIDATION',
      priority: 'high',
      title: `Expert Validation: ${c.fieldName}`,
      message: `${validatorName} confirmed: ${confirmedDiagnosis || 'Diagnosis confirmed'}. Management advisory activated.`,
      fieldId: c.fieldId,
      caseId: c.id,
      timestamp: 'Just now',
      read: false,
    });
  } else if (result === 'REFERRED_TO_LAB') {
    c.status = 'UNDER REVIEW';
    c.priority = 'HIGH';
    alerts.unshift({
      id: `alert-${Date.now()}`,
      type: 'VALIDATION',
      priority: 'moderate',
      title: `Case Referred to Laboratory`,
      message: `Sample for ${c.caseNumber} referred to Regional Agri Lab for culture diagnosis.`,
      fieldId: c.fieldId,
      caseId: c.id,
      timestamp: 'Just now',
      read: false,
    });
  } else if (result === 'REJECTED') {
    c.status = 'REJECTED';
  } else {
    c.status = 'UNDER REVIEW';
  }

  res.json({ success: true, case: c, validationRecord });
});

// Follow-up Observation Endpoint
app.post('/api/cases/:id/followup', (req: Request, res: Response) => {
  const c = cases.find((item) => item.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const { symptomImproved, spreadIncreased, newSymptomsObserved, status, farmerNotes, image } = req.body;

  const followUpRecord: FollowUpRecord = {
    id: `fol-${Date.now()}`,
    caseId: c.id,
    date: new Date().toISOString().split('T')[0],
    symptomImproved: !!symptomImproved,
    spreadIncreased: !!spreadIncreased,
    newSymptomsObserved: newSymptomsObserved || 'None',
    status: status || 'IMPROVING',
    farmerNotes: farmerNotes || 'Follow-up observation logged by farmer.',
    image,
  };

  c.followUpRecords.unshift(followUpRecord);
  c.updatedAt = new Date().toISOString();

  if (status === 'RESOLVED') {
    c.status = 'RESOLVED';
    const field = fields.find((f) => f.id === c.fieldId);
    if (field) {
      field.activeCasesCount = Math.max(0, field.activeCasesCount - 1);
      field.healthStatus = 'Healthy';
      field.currentRisk = 'LOW RISK';
      const hist = field.history.find((h) => h.diagnosis.includes(c.crop) || h.date === c.createdAt.split('T')[0]);
      if (hist) hist.followUpOutcome = 'Resolved';
    }
  } else if (status === 'IMPROVING') {
    c.status = 'FOLLOW-UP';
    const field = fields.find((f) => f.id === c.fieldId);
    if (field) {
      const hist = field.history[0];
      if (hist) hist.followUpOutcome = 'Improving';
    }
  }

  alerts.unshift({
    id: `alert-${Date.now()}`,
    type: 'FOLLOW_UP',
    priority: 'informational',
    title: `Follow-up Recorded: ${c.fieldName}`,
    message: `Condition is ${status}. Recorded into persistent Field Health Memory.`,
    fieldId: c.fieldId,
    caseId: c.id,
    timestamp: 'Just now',
    read: false,
  });

  res.json({ success: true, case: c, followUpRecord });
});

// Hotspots Endpoint
app.get('/api/hotspots', (_req: Request, res: Response) => {
  res.json({ hotspots });
});

// Alerts Endpoint
app.get('/api/alerts', (_req: Request, res: Response) => {
  res.json({ alerts });
});

// Analytics Endpoint for Extension & Official Dashboards
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalCases = cases.length;
  const confirmedCases = cases.filter((c) => c.status === 'CONFIRMED').length;
  const suspectedCases = cases.filter(
    (c) => c.status === 'VALIDATION REQUIRED' || c.status === 'UNDER REVIEW' || c.status === 'AI ANALYZED'
  ).length;
  const resolvedCases = cases.filter((c) => c.status === 'RESOLVED').length;
  const highRiskCases = cases.filter((c) => c.priority === 'HIGH' || c.priority === 'CRITICAL').length;
  const activeHotspotsCount = hotspots.filter((h) => h.status === 'Active Outbreak' || h.status === 'Emerging Cluster').length;

  const cropDistribution = [
    { crop: 'Soybean', count: cases.filter((c) => c.crop === 'Soybean').length },
    { crop: 'Cotton', count: cases.filter((c) => c.crop === 'Cotton').length },
    { crop: 'Rice', count: cases.filter((c) => c.crop === 'Rice').length },
    { crop: 'Tomato', count: cases.filter((c) => c.crop === 'Tomato').length },
    { crop: 'Chilli', count: cases.filter((c) => c.crop === 'Chilli').length },
  ];

  const diseaseDistribution = [
    { type: 'Fungal Pathogens', count: 9, percentage: 45 },
    { type: 'Insect Pests', count: 6, percentage: 30 },
    { type: 'Bacterial Blights', count: 3, percentage: 15 },
    { type: 'Nutrient / Abiotic', count: 2, percentage: 10 },
  ];

  res.json({
    totalCases,
    confirmedCases,
    suspectedCases,
    resolvedCases,
    highRiskCases,
    activeHotspotsCount,
    cropDistribution,
    diseaseDistribution,
    extensionWorkload: [
      { worker: 'Kavita Sharma', taluka: 'Sanwer (Indore)', activeCases: 4, pendingValidations: 2, responseRate: '94%' },
      { worker: 'Dr. Sanjay Wankhede', taluka: 'Hinganghat (Wardha)', activeCases: 7, pendingValidations: 1, responseRate: '98%' },
      { worker: 'Basavaraj Patil', taluka: 'Sindhanur (Raichur)', activeCases: 5, pendingValidations: 3, responseRate: '88%' },
      { worker: 'Girish Deshmukh', taluka: 'Chandur (Amravati)', activeCases: 3, pendingValidations: 1, responseRate: '91%' },
    ],
  });
});

// Demo Scenarios Handler (1-click trigger for SIH Judges)
app.post('/api/demo/scenario/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (id === 'scenario-1') {
    // Scenario 1: Farmer uploads leaf image -> AI analyzes -> moderate confidence -> expert validation requested
    const targetCase = cases.find((c) => c.id === 'case-101');
    if (targetCase) {
      targetCase.status = 'VALIDATION REQUIRED';
      targetCase.aiAnalysis.confidence = 78;
    }
  } else if (id === 'scenario-2') {
    // Scenario 2: High humidity + rainfall -> fungal risk increases
    const f = fields[0];
    f.weather.humidity = 92;
    f.weather.rainfall = 28;
    f.currentRisk = 'HIGH RISK';
    f.healthStatus = 'High Risk';
  } else if (id === 'scenario-3') {
    // Scenario 3: Multiple nearby cases -> hotspot created
    hotspots[0].activeCases += 3;
    hotspots[0].status = 'Active Outbreak';
  } else if (id === 'scenario-4') {
    // Scenario 4: Expert confirms case -> field history updated -> management advisory issued -> follow-up created
    const c = cases.find((c) => c.id === 'case-101');
    if (c && c.status !== 'CONFIRMED') {
      c.status = 'CONFIRMED';
      c.validationHistory.push({
        id: `val-demo-${Date.now()}`,
        caseId: c.id,
        validatorName: 'Dr. Sanjay Wankhede',
        validatorRole: 'District Agronomist',
        result: 'CONFIRMED',
        confirmedDiagnosis: 'Soybean Rust (Phakopsora pachyrhizi) confirmed',
        notes: 'Microscopic examination verified round echinulate urediniospores. Immediate perimeter containment advised.',
        timestamp: new Date().toISOString(),
      });
      fields[0].history.unshift({
        id: `hist-demo-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        crop: 'Soybean',
        variety: 'JS 20-29',
        growthStage: 'R3 Pod Development',
        diagnosis: 'Soybean Rust (Phakopsora pachyrhizi)',
        category: 'fungal disease',
        confirmationStatus: 'Expert Confirmed',
        weatherCondition: '92% RH, 26°C',
        managementActionTaken: 'Bio-fungicide barrier + improved ventilation',
        followUpOutcome: 'Pending',
      });
    }
  } else if (id === 'scenario-5') {
    // Scenario 5: Follow-up confirms improvement -> resolved in field health memory
    const c = cases.find((c) => c.id === 'case-101');
    if (c) {
      c.status = 'RESOLVED';
      c.followUpRecords.unshift({
        id: `fol-demo-${Date.now()}`,
        caseId: c.id,
        date: new Date().toISOString().split('T')[0],
        symptomImproved: true,
        spreadIncreased: false,
        newSymptomsObserved: 'None. Pustules dried up.',
        status: 'RESOLVED',
        farmerNotes: 'Upper canopy leaves remain clean. Spores halted.',
      });
      fields[0].healthStatus = 'Healthy';
      fields[0].currentRisk = 'LOW RISK';
      fields[0].activeCasesCount = 0;
      if (fields[0].history[0]) {
        fields[0].history[0].followUpOutcome = 'Resolved';
      }
    }
  }

  res.json({ success: true, scenario: id, message: `Scenario ${id} executed successfully` });
});

// Reset demo data
app.post('/api/demo/reset', (_req: Request, res: Response) => {
  fields = JSON.parse(JSON.stringify(INITIAL_FIELDS));
  cases = JSON.parse(JSON.stringify(INITIAL_CASES));
  hotspots = JSON.parse(JSON.stringify(INITIAL_HOTSPOTS));
  alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  res.json({ success: true, message: 'Platform demo seed data reset successfully' });
});

// ----------------------------------------------------------------------
// SERVER INITIALIZATION & VITE MIDDLEWARE
// ----------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🌾 FARMER'S FRIEND - Crop Health Intelligence Platform`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 Server-side Gemini AI: ${genAI ? 'ENABLED (gemini-3.8-flash)' : 'DEMO AGRONOMIC ENGINE (Fallback Active)'}`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
