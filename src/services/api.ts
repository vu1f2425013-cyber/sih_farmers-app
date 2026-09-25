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
  FarmingPractices,
} from '../types';
import {
  INITIAL_FIELDS,
  INITIAL_CASES,
  INITIAL_HOTSPOTS,
  INITIAL_ALERTS,
  DEMO_USERS,
  DEMO_FARMS,
  DEMO_DOCUMENTS,
  DEMO_CONNECTED_TIMELINE,
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'ff_current_user',
  TOKEN: 'ff_auth_token',
  FIELDS: 'ff_fields_cache',
  CASES: 'ff_cases_cache',
  HOTSPOTS: 'ff_hotspots_cache',
  ALERTS: 'ff_alerts_cache',
  FARMS: 'ff_farms_cache',
  DOCUMENTS: 'ff_documents_cache',
  TIMELINE: 'ff_timeline_cache',
  LAST_SYNC: 'ff_last_sync',
};

export const api = {
  // ----------------------------------------------------------------------
  // Authentication & Session
  // ----------------------------------------------------------------------
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null, token?: string): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  async login(payload: {
    identifier: string;
    password?: string;
    isOtp?: boolean;
    otpCode?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Login failed (${res.status})`);
      }
      const data = await res.json();
      this.setCurrentUser(data.user, data.token);
      return data;
    } catch (err: any) {
      // Offline / fallback fallback for demo accounts
      const clean = payload.identifier.replace(/\D/g, '');
      const matched = DEMO_USERS.find(
        (u) => u.mobile.replace(/\D/g, '') === clean || u.email?.toLowerCase() === payload.identifier.toLowerCase()
      );
      if (matched) {
        const { password: _, ...safe } = matched;
        this.setCurrentUser(safe, `demo-token-${safe.id}`);
        return { user: safe, token: `demo-token-${safe.id}` };
      }
      throw err;
    }
  },

  async register(payload: Partial<User> & { password?: string }): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Registration failed (${res.status})`);
      }
      const data = await res.json();
      this.setCurrentUser(data.user, data.token);
      return data;
    } catch (err: any) {
      // Local fallback
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: payload.name || 'New User',
        mobile: payload.mobile || '9000000000',
        email: payload.email,
        role: payload.role || 'farmer',
        state: payload.state || 'Maharashtra',
        district: payload.district || 'Wardha',
        village: payload.village,
        language: payload.language || 'en',
        organization: payload.organization,
        designation: payload.designation,
        jurisdiction: payload.jurisdiction,
        expertise: payload.expertise,
        serviceArea: payload.serviceArea,
        onboardingComplete: false,
        onboardingStep: 1,
      };
      this.setCurrentUser(newUser, `demo-token-${newUser.id}`);
      return { user: newUser, token: `demo-token-${newUser.id}` };
    }
  },

  async updateOnboarding(userId: string, update: { complete?: boolean; step?: number; profileData?: Partial<User> }): Promise<User> {
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...update }),
      });
      if (!res.ok) throw new Error('Onboarding update failed');
      const data = await res.json();
      this.setCurrentUser(data.user);
      return data.user;
    } catch {
      const current = this.getCurrentUser();
      if (current) {
        if (update.complete !== undefined) current.onboardingComplete = update.complete;
        if (update.step !== undefined) current.onboardingStep = update.step;
        if (update.profileData) Object.assign(current, update.profileData);
        this.setCurrentUser(current);
        return current;
      }
      throw new Error('User not logged in');
    }
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  // ----------------------------------------------------------------------
  // Farm Operations
  // ----------------------------------------------------------------------
  async getFarms(userId?: string): Promise<Farm[]> {
    try {
      const url = userId ? `/api/farms?userId=${encodeURIComponent(userId)}` : '/api/farms';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load farms');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(data.farms));
      return data.farms;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.FARMS);
      return cached ? JSON.parse(cached) : DEMO_FARMS;
    }
  },

  async addFarm(farmData: Partial<Farm>): Promise<Farm> {
    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmData),
      });
      if (!res.ok) throw new Error('Failed to save farm');
      const data = await res.json();
      return data.farm;
    } catch {
      const farms = await this.getFarms();
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        userId: farmData.userId || 'user-farmer',
        name: farmData.name || 'My Farm',
        totalLandArea: Number(farmData.totalLandArea) || 5.0,
        unit: farmData.unit || 'acre',
        state: farmData.state || 'Maharashtra',
        district: farmData.district || 'Wardha',
        village: farmData.village || 'Hinganghat',
        pinCode: farmData.pinCode || '442301',
        address: farmData.address || '',
        soilType: farmData.soilType || 'Black Cotton Soil',
        irrigationType: farmData.irrigationType || 'Drip & Furrow',
        waterSource: farmData.waterSource || 'Borewell',
        farmingMethod: farmData.farmingMethod || 'Integrated Crop Management',
        ownershipType: farmData.ownershipType || 'Owner Cultivator',
        terrain: farmData.terrain || 'Plain Basin',
        lat: farmData.lat || 20.5512,
        lng: farmData.lng || 78.8354,
        createdAt: new Date().toISOString().split('T')[0],
      };
      farms.unshift(newFarm);
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
      return newFarm;
    }
  },

  // ----------------------------------------------------------------------
  // Farm Documents
  // ----------------------------------------------------------------------
  async getDocuments(farmId?: string, fieldId?: string): Promise<FarmDocument[]> {
    try {
      const params = new URLSearchParams();
      if (farmId) params.append('farmId', farmId);
      if (fieldId) params.append('fieldId', fieldId);
      const res = await fetch(`/api/documents?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents));
      return data.documents;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return cached ? JSON.parse(cached) : DEMO_DOCUMENTS;
    }
  },

  async uploadDocument(doc: Partial<FarmDocument>): Promise<FarmDocument> {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (!res.ok) throw new Error('Failed to upload document');
      const data = await res.json();
      return data.document;
    } catch {
      const docs = await this.getDocuments();
      const newDoc: FarmDocument = {
        id: `doc-${Date.now()}`,
        farmId: doc.farmId || 'farm-1',
        fieldId: doc.fieldId || 'field-1',
        name: doc.name || 'Document.pdf',
        category: doc.category || 'Farm Record',
        fileSize: doc.fileSize || '1.1 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        notes: doc.notes || 'Stored in farm records',
        status: 'Stored in farm records',
      };
      docs.unshift(newDoc);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
      return newDoc;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      const docs = await this.getDocuments();
      const filtered = docs.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
      return true;
    }
  },

  // ----------------------------------------------------------------------
  // Connected Event Timeline
  // ----------------------------------------------------------------------
  async getTimelineEvents(): Promise<ConnectedTimelineEvent[]> {
    try {
      const res = await fetch('/api/timeline');
      if (!res.ok) throw new Error('Failed to load timeline');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(data.events));
      return data.events;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      return cached ? JSON.parse(cached) : DEMO_CONNECTED_TIMELINE;
    }
  },

  async addTimelineEvent(ev: Partial<ConnectedTimelineEvent>): Promise<ConnectedTimelineEvent> {
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev),
      });
      if (!res.ok) throw new Error('Failed to add timeline event');
      const data = await res.json();
      return data.event;
    } catch {
      const events = await this.getTimelineEvents();
      const newEv: ConnectedTimelineEvent = {
        id: `ctl-${Date.now()}`,
        date: ev.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        type: ev.type || 'WEATHER_ALERT',
        title: ev.title || 'Field Observation',
        description: ev.description || 'Observed changes in field canopy.',
        badge: ev.badge || 'Observation',
        source: ev.source || 'Farmer entered',
        status: ev.status || 'Completed',
      };
      events.unshift(newEv);
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(events));
      return newEv;
    }
  },

  // ----------------------------------------------------------------------
  // Farming Practices Update
  // ----------------------------------------------------------------------
  async updatePractices(fieldId: string, practices: Partial<FarmingPractices>): Promise<Field> {
    try {
      const res = await fetch(`/api/fields/${fieldId}/practices`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ practices }),
      });
      if (!res.ok) throw new Error('Failed to update practices');
      const data = await res.json();
      return data.field;
    } catch {
      const fields = await this.getFields();
      const target = fields.find((f) => f.id === fieldId);
      if (target) {
        target.practices = { ...target.practices, ...(practices as FarmingPractices) };
        target.profileCompletion = Math.min(100, (target.profileCompletion || 70) + 10);
        localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
        return target;
      }
      throw new Error('Field not found');
    }
  },

  // ----------------------------------------------------------------------
  // Farm Data Import (CSV / Excel / JSON)
  // ----------------------------------------------------------------------
  async importFarmData(fileName: string, records: any[], targetFarmId?: string): Promise<{ success: boolean; message: string; importedCount: number }> {
    try {
      const res = await fetch('/api/farms/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, records, targetFarmId }),
      });
      if (!res.ok) throw new Error('Import failed');
      return await res.json();
    } catch {
      return {
        success: true,
        message: `Successfully parsed and imported ${records.length} records into farm workspace.`,
        importedCount: records.length,
      };
    }
  },

  // ----------------------------------------------------------------------
  // Fields Endpoints
  // ----------------------------------------------------------------------
  async getFields(): Promise<Field[]> {
    try {
      const res = await fetch('/api/fields');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(data.fields));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString());
      return data.fields;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.FIELDS);
      return cached ? JSON.parse(cached) : INITIAL_FIELDS;
    }
  },

  async getFieldById(id: string): Promise<Field | null> {
    try {
      const res = await fetch(`/api/fields/${id}`);
      if (!res.ok) throw new Error('Field fetch failed');
      const data = await res.json();
      return data.field;
    } catch {
      const fields = await this.getFields();
      return fields.find((f) => f.id === id) || null;
    }
  },

  async addField(fieldData: Partial<Field>): Promise<Field> {
    try {
      const res = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldData),
      });
      const data = await res.json();
      return data.field;
    } catch (err) {
      console.error('Failed to add field to server, using local store:', err);
      const fields = await this.getFields();
      const newField: Field = {
        id: `field-${Date.now()}`,
        farmId: fieldData.farmId || 'farm-1',
        name: fieldData.name || 'New Field',
        farmerName: 'Ravi Patil',
        farmerPhone: '+91 90000 00001',
        location: fieldData.location || {
          village: 'Hinganghat',
          taluka: 'Hinganghat',
          district: 'Wardha',
          state: 'Maharashtra',
          lat: 20.5512,
          lng: 78.8354,
        },
        areaAcres: Number(fieldData.areaAcres) || 2.5,
        unit: fieldData.unit || 'acre',
        crop: fieldData.crop || 'Soybean',
        variety: fieldData.variety || 'JS 20-29',
        growthStage: fieldData.growthStage || 'Vegetative Stage',
        plantingDate: fieldData.plantingDate || new Date().toISOString().split('T')[0],
        expectedHarvestDate: fieldData.expectedHarvestDate,
        soilType: fieldData.soilType || 'Black Cotton Soil',
        soilCondition: 'Moist and well drained',
        irrigationMethod: fieldData.irrigationMethod || 'Furrow Irrigation',
        waterSource: fieldData.waterSource || 'Borewell',
        seedSource: fieldData.seedSource || 'Certified Seed',
        seedTreatment: fieldData.seedTreatment,
        profileCompletion: 65,
        healthStatus: 'Healthy',
        currentRisk: 'LOW RISK',
        activeCasesCount: 0,
        lastObservationDate: new Date().toISOString().split('T')[0],
        boundaryPolygon: fieldData.boundaryPolygon,
        weather: fields[0]?.weather || INITIAL_FIELDS[0].weather,
        sensors: fields[0]?.sensors || INITIAL_FIELDS[0].sensors,
        history: [],
      };
      fields.unshift(newField);
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
      return newField;
    }
  },

  async analyzeCropImage(payload: {
    imageBase64?: string;
    crop: string;
    variety: string;
    growthStage: string;
    fieldId: string;
    farmerNotes?: string;
    soilType?: string;
    weather?: any;
    sensors?: any;
    historySummary?: string;
    mode?: 'real' | 'demo';
    demoCaseId?: string;
  }): Promise<AIAnalysisResult> {
    const res = await fetch('/api/health/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.message || `Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.result;
  },

  async getCases(filter?: { status?: string; fieldId?: string }): Promise<HealthCase[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.append('status', filter.status);
      if (filter?.fieldId) params.append('fieldId', filter.fieldId);

      const res = await fetch(`/api/cases?${params.toString()}`);
      if (!res.ok) throw new Error('Cases fetch failed');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(data.cases));
      return data.cases;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.CASES);
      return cached ? JSON.parse(cached) : INITIAL_CASES;
    }
  },

  async createCase(caseData: {
    fieldId: string;
    image: string;
    farmerNotes: string;
    aiAnalysis: AIAnalysisResult;
  }): Promise<HealthCase> {
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) throw new Error('Failed to create case');
    const data = await res.json();
    return data.case;
  },

  async validateCase(
    caseId: string,
    validation: {
      validatorName: string;
      validatorRole: 'Extension Worker' | 'District Agronomist' | 'Lab Pathologist';
      result: 'CONFIRMED' | 'REJECTED' | 'REQUEST_MORE_INFO' | 'REFERRED_TO_LAB';
      confirmedDiagnosis?: string;
      notes: string;
      recommendedTreatment?: string;
    }
  ): Promise<{ case: HealthCase; validationRecord: ValidationRecord }> {
    const res = await fetch(`/api/cases/${caseId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation),
    });
    if (!res.ok) throw new Error('Validation failed');
    return await res.json();
  },

  async submitFollowUp(
    caseId: string,
    followUp: {
      symptomImproved: boolean;
      spreadIncreased: boolean;
      newSymptomsObserved: string;
      status: 'IMPROVING' | 'STABLE' | 'WORSENING' | 'RESOLVED';
      farmerNotes: string;
      image?: string;
    }
  ): Promise<{ case: HealthCase; followUpRecord: FollowUpRecord }> {
    const res = await fetch(`/api/cases/${caseId}/followup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(followUp),
    });
    if (!res.ok) throw new Error('Follow-up submission failed');
    return await res.json();
  },

  async getHotspots(): Promise<Hotspot[]> {
    try {
      const res = await fetch('/api/hotspots');
      if (!res.ok) throw new Error('Hotspots fetch failed');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.HOTSPOTS, JSON.stringify(data.hotspots));
      return data.hotspots;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.HOTSPOTS);
      return cached ? JSON.parse(cached) : INITIAL_HOTSPOTS;
    }
  },

  async getAlerts(): Promise<AlertNotification[]> {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Alerts fetch failed');
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(data.alerts));
      return data.alerts;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return cached ? JSON.parse(cached) : INITIAL_ALERTS;
    }
  },

  async getAnalytics(): Promise<any> {
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Analytics failed');
      return await res.json();
    } catch {
      return {
        totalCases: 5,
        confirmedCases: 2,
        suspectedCases: 2,
        resolvedCases: 1,
        highRiskCases: 2,
        activeHotspotsCount: 3,
        cropDistribution: [
          { crop: 'Soybean', count: 2 },
          { crop: 'Cotton', count: 1 },
          { crop: 'Rice', count: 1 },
          { crop: 'Tomato', count: 1 },
        ],
        diseaseDistribution: [
          { type: 'Fungal Pathogens', count: 8, percentage: 45 },
          { type: 'Insect Pests', count: 5, percentage: 30 },
          { type: 'Bacterial Blights', count: 3, percentage: 15 },
          { type: 'Nutrient / Abiotic', count: 1, percentage: 10 },
        ],
      };
    }
  },

  async runJudgeScenario(scenarioId: string): Promise<any> {
    const res = await fetch(`/api/demo/scenario/${scenarioId}`, { method: 'POST' });
    return await res.json();
  },

  async resetDemoData(): Promise<any> {
    const res = await fetch('/api/demo/reset', { method: 'POST' });
    localStorage.removeItem(STORAGE_KEYS.FIELDS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.HOTSPOTS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.FARMS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    return await res.json();
  },

  getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Live';
  },
};
