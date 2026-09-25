import { Field, RiskLevel } from '../types';

export interface RuleEvaluationResult {
  weatherScore: number;
  cropStageScore: number;
  historyScore: number;
  localCasesScore: number;
  sensorScore: number;
  totalScore: number;
  compositeRisk: RiskLevel;
  activatedRules: string[];
  focalIssues: string[];
}

export function evaluateAgronomicRules(
  field: Field,
  nearbyCasesCount: number = 2
): RuleEvaluationResult {
  const activatedRules: string[] = [];
  const focalIssues: string[] = [];

  let weatherScore = 5;
  let cropStageScore = 5;
  let historyScore = 0;
  let localCasesScore = 0;
  let sensorScore = 0;

  const w = field.weather;
  const s = field.sensors;

  // 1. WEATHER RULES
  if (w.humidity >= 80 && w.rainfall >= 12) {
    weatherScore += 18;
    activatedRules.push(
      `High Relative Humidity (${w.humidity}%) & Recent Rainfall (${w.rainfall}mm) trigger Fungal Disease Proliferation conditions`
    );
    focalIssues.push('Fungal Leaf Blight / Rust');
  } else if (w.humidity >= 75) {
    weatherScore += 10;
    activatedRules.push(`Elevated Humidity (${w.humidity}%) favors spore germination`);
  }

  if (w.temperature >= 28 && w.humidity < 55) {
    weatherScore += 12;
    activatedRules.push(
      `Warm & Drier Microclimate (${w.temperature}°C, ${w.humidity}%) favors Sucking Pests (Whitefly / Thrips / Mites)`
    );
    focalIssues.push('Sucking Pest Complex');
  }

  // 2. CROP GROWTH STAGE RULES
  const stageLower = field.growthStage.toLowerCase();
  if (
    stageLower.includes('flowering') ||
    stageLower.includes('pod') ||
    stageLower.includes('fruiting') ||
    stageLower.includes('boll')
  ) {
    cropStageScore = 18;
    activatedRules.push(
      `Critical Reproductive Stage (${field.growthStage}): Foliar damage directly impacts yield formation`
    );
  } else if (stageLower.includes('vegetative') || stageLower.includes('tillering')) {
    cropStageScore = 12;
    activatedRules.push(`Vegetative Canopy Expansion (${field.growthStage}): Dense microclimate reduces airflow`);
  } else {
    cropStageScore = 7;
  }

  // 3. FIELD HEALTH MEMORY (Historical Case Rules)
  const hasFungalHistory = field.history.some(
    (h) => h.category === 'fungal disease' && (h.confirmationStatus === 'Expert Confirmed' || h.confirmationStatus === 'Lab Verified')
  );
  const hasPestHistory = field.history.some(
    (h) => h.category === 'insect pest' && (h.confirmationStatus === 'Expert Confirmed' || h.confirmationStatus === 'Lab Verified')
  );

  if (hasFungalHistory) {
    historyScore += 12;
    activatedRules.push('Field Health Memory: Previous confirmed fungal pressure in this field increases spore reservoir probability');
  }
  if (hasPestHistory) {
    historyScore += 8;
    activatedRules.push('Field Health Memory: Historical pest infestation logged during similar seasonal window');
  }

  // 4. LOCAL CASE PROXIMITY RULES
  if (nearbyCasesCount >= 3) {
    localCasesScore = 15;
    activatedRules.push(`Active Local Cluster: ${nearbyCasesCount} verified crop-health cases reported within 5 km radius`);
  } else if (nearbyCasesCount >= 1) {
    localCasesScore = 8;
    activatedRules.push(`Nearby Case: ${nearbyCasesCount} case active within village cluster`);
  }

  // 5. PEST TRAP & SENSOR RULES
  if (s.status === 'ONLINE') {
    if (s.pestTrapCount >= 8) {
      sensorScore += 14;
      activatedRules.push(`Pest Trap Sensor: Daily trap catch of ${s.pestTrapCount} moths exceeds economic threshold (ETL 8/trap)`);
      focalIssues.push('Lepidopteran Pest Infestation');
    } else if (s.pestTrapCount >= 4) {
      sensorScore += 7;
      activatedRules.push(`Pest Trap Sensor: Moderate trap activity (${s.pestTrapCount} moths/day)`);
    }

    if (s.soilMoisture >= 85) {
      sensorScore += 6;
      activatedRules.push(`Soil Moisture Sensor: Saturated soil (${s.soilMoisture}%) promotes root zone hypoxia and fungal root rot`);
    }
  } else if (s.status === 'STALE') {
    activatedRules.push('Telemetry Notice: Sensor data is STALE (>36h old); excluding telemetry from algorithmic risk score');
  }

  // Cap sub-scores
  weatherScore = Math.min(30, weatherScore);
  cropStageScore = Math.min(20, cropStageScore);
  historyScore = Math.min(20, historyScore);
  localCasesScore = Math.min(15, localCasesScore);
  sensorScore = Math.min(15, sensorScore);

  const totalScore = weatherScore + cropStageScore + historyScore + localCasesScore + sensorScore;

  let compositeRisk: RiskLevel = 'LOW RISK';
  if (totalScore >= 70) {
    compositeRisk = 'HIGH RISK';
  } else if (totalScore >= 42) {
    compositeRisk = 'MODERATE RISK';
  }

  return {
    weatherScore,
    cropStageScore,
    historyScore,
    localCasesScore,
    sensorScore,
    totalScore,
    compositeRisk,
    activatedRules,
    focalIssues: Array.from(new Set(focalIssues)),
  };
}
