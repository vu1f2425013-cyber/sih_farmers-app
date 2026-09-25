export type UserRole = 'farmer' | 'extension' | 'official' | 'expert';

export type Language = 'en' | 'hi' | 'mr';

export type RiskLevel = 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'VALIDATION REQUIRED';

export type CaseStatus =
  | 'NEW'
  | 'AI ANALYZED'
  | 'VALIDATION REQUIRED'
  | 'UNDER REVIEW'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'FOLLOW-UP'
  | 'RESOLVED';

export type IssueCategory =
  | 'fungal disease'
  | 'bacterial disease'
  | 'viral disease'
  | 'insect pest'
  | 'nutrient-related symptom'
  | 'healthy / no significant issue'
  | 'unknown / uncertain';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: UserRole;
  state: string;
  district: string;
  village?: string;
  language: Language;
  organization?: string;
  designation?: string;
  jurisdiction?: string;
  expertise?: string;
  serviceArea?: string;
  assignedVillages?: string[];
  onboardingComplete: boolean;
  onboardingStep?: number;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  totalLandArea: number;
  unit: 'acre' | 'hectare';
  state: string;
  district: string;
  village: string;
  pinCode: string;
  address?: string;
  soilType?: string;
  irrigationType?: string;
  waterSource?: string;
  farmingMethod?: string;
  ownershipType?: string;
  terrain?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface BoundaryPoint {
  lat: number;
  lng: number;
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  rainfall: number; // mm in last 24-48h
  windSpeed: number; // km/h
  condition: string;
  leafWetnessDurationHours?: number;
  forecast: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainfallChance: number;
    condition: string;
  }>;
}

export interface SensorData {
  pestTrapCount: number; // moths/insects trapped in 24h
  soilMoisture: number; // %
  canopyTemp: number; // °C
  relativeHumidity: number; // %
  leafWetness: boolean;
  status: 'ONLINE' | 'STALE' | 'OFFLINE';
  lastUpdated: string;
}

export interface HistoryEvent {
  id: string;
  date: string;
  crop: string;
  variety?: string;
  growthStage: string;
  diagnosis: string;
  category: IssueCategory;
  confirmationStatus: 'AI Suspected' | 'Expert Confirmed' | 'Lab Verified' | 'Rejected';
  weatherCondition?: string;
  managementActionTaken: string;
  followUpOutcome: 'Improving' | 'Stable' | 'Worsening' | 'Resolved' | 'Pending';
  notes?: string;
}

export interface FarmingPractices {
  soil: {
    type?: string;
    testResult?: string;
    pH?: number;
    organicMatter?: string;
    source: 'Farmer entered' | 'Soil Lab Report' | 'Unavailable';
    lastUpdated: string;
  };
  irrigation: {
    type?: string;
    frequency?: string;
    lastIrrigation?: string;
    source: 'Farmer entered' | 'Sensor Log' | 'Unavailable';
    lastUpdated: string;
  };
  nutrientManagement: Array<{
    id: string;
    fertilizer: string;
    applicationDate: string;
    notes?: string;
    source: 'Farmer entered' | 'Soil Card';
    lastUpdated: string;
  }>;
  cropProtection: Array<{
    id: string;
    pesticideUsed: string;
    applicationDate: string;
    reason: string;
    result: string;
    notes?: string;
    source: 'Farmer entered' | 'Extension advisory';
    lastUpdated: string;
  }>;
  cropHistory: Array<{
    id: string;
    season: string;
    previousCrop: string;
    previousDisease?: string;
    previousPest?: string;
    confirmedDiagnosis?: string;
    management?: string;
    outcome?: string;
    yieldAcre?: string;
    source: 'Farmer entered' | 'Verified Record';
    lastUpdated: string;
  }>;
}

export interface FarmDocument {
  id: string;
  farmId?: string;
  fieldId?: string;
  name: string;
  category: 'Soil Report' | 'Crop Health Report' | 'Lab Diagnosis' | 'Farm Record' | 'Pest Trap' | 'Other';
  fileUrl?: string;
  fileSize?: string;
  uploadDate: string;
  notes?: string;
  status: 'Stored in farm records';
}

export interface Field {
  id: string;
  farmId?: string;
  name: string;
  farmerName: string;
  farmerPhone: string;
  location: {
    village: string;
    taluka: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  areaAcres: number;
  unit?: 'acre' | 'hectare';
  crop: string;
  variety: string;
  growthStage: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  soilType: string;
  soilCondition: string;
  irrigationMethod?: string;
  waterSource?: string;
  seedSource?: string;
  seedTreatment?: string;
  boundaryPolygon?: BoundaryPoint[];
  profileCompletion: number; // e.g. 78%
  healthStatus: 'Healthy' | 'Under Watch' | 'Moderate Risk' | 'High Risk' | 'Action Needed';
  currentRisk: RiskLevel;
  activeCasesCount: number;
  lastObservationDate: string;
  weather: WeatherData;
  sensors: SensorData;
  history: HistoryEvent[];
  practices?: FarmingPractices;
}

export interface PossibleIssue {
  name: string;
  type: IssueCategory;
  likelihood: 'Possible issue' | 'Likely' | 'Needs confirmation' | 'Low confidence' | 'High confidence';
  confidence: number; // 0-100
  severity: 'Mild' | 'Moderate' | 'Severe';
  pathogenOrPest?: string;
}

export interface ManagementAction {
  category:
    | 'Immediate Action'
    | 'Monitoring Action'
    | 'Cultural Practice'
    | 'Biological Control'
    | 'Mechanical / Physical Control'
    | 'Chemical Control (Cautious Guidance)'
    | 'When to Escalate';
  action: string;
  priority: 1 | 2 | 3 | 4;
}

export interface DataAvailability {
  crop: boolean;
  variety: boolean;
  growthStage: boolean;
  image: boolean;
  weather: boolean;
  fieldHistory: boolean;
  soilData: boolean;
  sensorData: boolean;
}

export interface AIAnalysisResult {
  source: 'gemini-3.8-flash' | 'agronomic-engine';
  observation: string;
  possibleIssues: PossibleIssue[];
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  riskLevel: RiskLevel;
  evidence: string[]; // Supporting signals
  uncertainty: string[]; // Conflicting / unconfirmed factors
  whatCouldChangeThis: string[];
  recommendedNextStep: string;
  needsExpertValidation: boolean;
  needsLabReferral: boolean;
  dataAvailability?: DataAvailability;
  managementActions: ManagementAction[];
  followUpRecommendation: string;
  ruleBreakdown: {
    weatherScore: number;
    cropStageScore: number;
    historyScore: number;
    localCasesScore: number;
    sensorScore: number;
    compositeRisk: RiskLevel;
    activatedRules: string[];
  };
}

export interface ValidationRecord {
  id: string;
  caseId: string;
  validatorName: string;
  validatorRole: 'Extension Worker' | 'District Agronomist' | 'Lab Pathologist';
  result: 'CONFIRMED' | 'REJECTED' | 'REQUEST_MORE_INFO' | 'REFERRED_TO_LAB';
  confirmedDiagnosis?: string;
  notes: string;
  timestamp: string;
  recommendedTreatment?: string;
}

export interface FollowUpRecord {
  id: string;
  caseId: string;
  date: string;
  symptomImproved: boolean;
  spreadIncreased: boolean;
  newSymptomsObserved: string;
  status: 'IMPROVING' | 'STABLE' | 'WORSENING' | 'RESOLVED';
  farmerNotes: string;
  image?: string;
}

export interface HealthCase {
  id: string;
  caseNumber: string;
  fieldId: string;
  fieldName: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  crop: string;
  variety: string;
  growthStage: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  image: string;
  farmerNotes?: string;
  aiAnalysis: AIAnalysisResult;
  validationHistory: ValidationRecord[];
  followUpRecords: FollowUpRecord[];
  assignedWorker?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Hotspot {
  id: string;
  name: string;
  taluka: string;
  district: string;
  lat: number;
  lng: number;
  crop: string;
  diseaseOrPest: string;
  category: IssueCategory;
  activeCases: number;
  confirmedCases: number;
  severity: 'Moderate' | 'Severe' | 'Critical';
  status: 'Active Outbreak' | 'Emerging Cluster' | 'Contained' | 'Monitoring';
  affectedAcresApprox: number;
  radiusKm: number;
  lastReportedDate: string;
  recommendedAdvisory: string;
}

export interface AlertNotification {
  id: string;
  type: 'EARLY_RISK' | 'NEW_CASE' | 'VALIDATION' | 'FOLLOW_UP' | 'HOTSPOT';
  priority: 'informational' | 'moderate' | 'high';
  title: string;
  message: string;
  fieldId?: string;
  caseId?: string;
  timestamp: string;
  read: boolean;
}

export interface ConnectedTimelineEvent {
  id: string;
  date: string;
  type:
    | 'FIELD_CREATED'
    | 'CROP_PLANTED'
    | 'WEATHER_ALERT'
    | 'IMAGE_SCAN'
    | 'AI_ANALYSIS'
    | 'EXPERT_REQUEST'
    | 'DIAGNOSIS_CONFIRMED'
    | 'IPM_ADVISORY'
    | 'FOLLOW_UP';
  title: string;
  description: string;
  badge?: string;
  source: string;
  status?: string;
}
