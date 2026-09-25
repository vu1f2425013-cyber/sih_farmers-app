import assert from 'node:assert';
import { test, describe } from 'node:test';
import { evaluateAgronomicRules } from './riskEngine';
import { Field } from '../types';

describe('Agronomic Risk Engine Unit Tests', () => {
  const mockField: Field = {
    id: 'test-field-1',
    name: 'Test Field A',
    farmerName: 'Ravi Patil',
    farmerPhone: '9000000001',
    location: {
      village: 'Hinganghat',
      taluka: 'Hinganghat',
      district: 'Wardha',
      state: 'Maharashtra',
      lat: 20.5512,
      lng: 78.8354,
    },
    areaAcres: 2.5,
    crop: 'Soybean',
    variety: 'JS 20-29',
    growthStage: 'R3 Pod Development Flowering Stage',
    plantingDate: '2026-06-12',
    soilType: 'Deep Black Cotton Soil',
    soilCondition: 'Moist',
    profileCompletion: 85,
    healthStatus: 'Moderate Risk',
    currentRisk: 'MODERATE RISK',
    activeCasesCount: 1,
    lastObservationDate: '2026-09-24',
    weather: {
      temperature: 28,
      humidity: 85,
      rainfall: 15,
      windSpeed: 8,
      condition: 'Rainy',
      forecast: [],
    },
    sensors: {
      pestTrapCount: 9,
      soilMoisture: 65,
      canopyTemp: 27,
      relativeHumidity: 84,
      leafWetness: true,
      status: 'ONLINE',
      lastUpdated: '2026-09-25 09:00',
    },
    history: [
      {
        id: 'h1',
        date: '2025-08-15',
        crop: 'Soybean',
        growthStage: 'Flowering',
        diagnosis: 'Soybean Rust',
        category: 'fungal disease',
        confirmationStatus: 'Expert Confirmed',
        managementActionTaken: 'Bio-fungicide spray',
        followUpOutcome: 'Resolved',
      },
    ],
  };

  test('calculates correct composite risk score under high fungal & pest pressure', () => {
    const result = evaluateAgronomicRules(mockField, 3);
    assert.ok(result.totalScore >= 42, 'Expected total score to trigger at least MODERATE or HIGH risk');
    assert.strictEqual(typeof result.compositeRisk, 'string');
    assert.ok(result.activatedRules.length > 0, 'Expected activated rules list to contain triggered rules');
    assert.ok(result.weatherScore > 0, 'Weather score should be positive');
    assert.ok(result.cropStageScore > 0, 'Crop stage score should be positive');
    assert.ok(result.historyScore > 0, 'History score should be positive from previous confirmed fungal case');
    assert.ok(result.sensorScore > 0, 'Sensor score should be positive from pest trap count 9');
  });

  test('lowers risk score when microclimate is dry and sensors are offline', () => {
    const lowRiskField: Field = {
      ...mockField,
      growthStage: 'Early Seedling',
      weather: {
        temperature: 22,
        humidity: 45,
        rainfall: 0,
        windSpeed: 5,
        condition: 'Clear',
        forecast: [],
      },
      sensors: {
        pestTrapCount: 1,
        soilMoisture: 40,
        canopyTemp: 22,
        relativeHumidity: 45,
        leafWetness: false,
        status: 'OFFLINE',
        lastUpdated: '2026-09-20',
      },
      history: [],
    };

    const result = evaluateAgronomicRules(lowRiskField, 0);
    assert.strictEqual(result.compositeRisk, 'LOW RISK');
    assert.ok(result.totalScore < 42, 'Total score should be below 42 for low risk');
  });
});
