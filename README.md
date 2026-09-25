# Farmer's Friend - Crop Health Intelligence Platform 🌾

> **SIH 2026 Prototype** | *Detect Early. Validate Smartly. Act Safely.*

**Farmer's Friend** is an end-to-end, multi-tier agricultural intelligence platform built for early crop disease & pest detection, weather-driven microclimate risk forecasting, expert field validation workflows, and persistent field-health memory.

---

## 🌟 Key Features

1. **Multimodal AI Crop Diagnosis**:
   - Analyzes crop symptoms from foliar photos with high precision.
   - Powered by Google Gemini 3.8 Flash with server-side prompt engineering.
   - Built-in deterministic Agronomic Rule Fallback Engine guaranteeing offline / fallback resilience.
   - Explicit confidence scoring, symptom uncertainty, and verified agronomic evidence points.

2. **Cautious & Safe Action Guidance**:
   - Strict IPM (Integrated Pest Management) tiered recommendations:
     - Immediate Actions
     - Cultural Practices
     - Biological Controls
     - Mechanical / Physical Controls
     - Cautious Chemical Guidance (recommends CIB&RC approved active ingredients, strict label dosages, and extension officer sign-off; never unverified homebrews).

3. **Multi-Role RBAC Collaboration Architecture**:
   - **👨‍🌾 Farmer**: Instant crop scans, farm plot mapping (interactive polygon drawing), soil & irrigation telemetry, and historical field records.
   - **🧑‍🔬 Extension Worker**: Field validation queue, on-ground inspection logging, sample collection tags, and farmer advisories.
   - **🏛️ Agri Official / Department**: District-wide pathogen surveillance, outbreak hotspot tracking, early warning broadcasts, and resource allocation.
   - **🔬 Research / Laboratory Expert**: Referral diagnosis, microscopic verification, lab culture results, and pathogen genomics notes.

4. **Persistent Field Health Memory**:
   - Tracks each plot's historical diseases, recurrence patterns, past treatments, and recovery outcomes across crop cycles.

5. **Farm Data Core**:
   - CSV / Excel / JSON data import.
   - Digital document archive (soil health cards, pesticide bills, certifications).
   - Unified connected event timeline.

6. **Multilingual Interface**:
   - English (EN)
   - Hindi (हिंदी - HI)
   - Marathi (मराठी - MR)

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher (v20+ recommended)
- `npm` or `bun` or `yarn`

### 1. Extract the Project
If you downloaded `farmers-friend-crop-health.zip`:
```bash
unzip farmers-friend-crop-health.zip
cd farmers-friend-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env` file in the root directory (based on `.env.example`):
```bash
cp .env.example .env
```

Add your Gemini API key (optional - if omitted, the built-in Agronomic Rule Fallback Engine will automatically run):
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Application
Run the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser!

---

## 🛠️ Project Structure

```
├── public/                 # Static assets and downloadable zip package
├── scripts/
│   └── package-zip.py      # Automated zip packager script
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── Navbar.tsx              # Role switcher, quick scan, zip download & language
│   │   ├── CropScanModal.tsx       # Image upload & Gemini AI multimodal analysis
│   │   ├── FarmerDashboard.tsx     # Farmer daily overview & field health
│   │   ├── FieldHealthProfile.tsx  # Plot profile & field health memory
│   │   ├── HotspotMap.tsx          # Outbreak surveillance & cluster map
│   │   ├── FarmDataDashboard.tsx   # Document vault & connected event timeline
│   │   ├── DownloadZipModal.tsx    # In-app codebase export & zip download modal
│   │   └── ...
│   ├── data/
│   │   └── seedData.ts     # Realistic Indian agriculture seed datasets
│   ├── i18n/
│   │   └── translations.ts # EN, HI, and MR localization dictionaries
│   ├── services/
│   │   └── riskEngine.ts   # Weather, crop stage, and sensor scoring engine
│   ├── types/
│   │   └── index.ts        # Comprehensive TypeScript definitions
│   ├── App.tsx             # Root application orchestrator
│   ├── main.tsx            # Vite entry point
│   └── index.css           # Tailwind CSS v4 styling
├── server.ts               # Full-stack Express backend & API proxy
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📡 API Endpoints

- `GET /api/download-zip` - Download the clean project source zip archive
- `GET /api/health` - System health check & AI status
- `POST /api/health/analyze` - Multimodal crop leaf analysis with Gemini 3.8 Flash
- `GET /api/farms` & `POST /api/farms` - Farm properties management
- `GET /api/fields` & `POST /api/fields` - Field plots & telemetry
- `GET /api/cases` & `POST /api/cases` - Crop health cases
- `POST /api/cases/:id/validate` - Extension / Expert validation
- `POST /api/cases/:id/followup` - Follow-up outcome logging
- `GET /api/hotspots` - Outbreak surveillance clusters
- `GET /api/analytics` - Regional analytics & extension workload

---

## 📜 License
Developed for Smart India Hackathon (SIH 2026). Open for educational and agricultural development.
