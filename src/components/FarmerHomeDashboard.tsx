import React, { useEffect, useRef, useState } from 'react';
import type { LatLngTuple, Map as LeafletMap, Path as LeafletPath } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowRight, Bell, CheckCircle2, CloudSun, Droplets, Expand, MapPin, ScanLine, Sprout, TrendingUp, Users, Wind } from 'lucide-react';
import { AlertNotification, Field, HealthCase, Language, User } from '../types';

interface FarmerHomeDashboardProps {
  fields: Field[];
  cases: HealthCase[];
  alerts: AlertNotification[];
  language: Language;
  user: User;
  onOpenScanModal: (fieldId?: string) => void;
  onViewFieldHealth: (fieldId: string) => void;
  onViewAllFields: () => void;
  onNavigateTab: (tab: string) => void;
}

const copy = {
  en: {
    greeting: 'Good morning', today: "Here's what needs your attention on the farm today.", advice: "Today's advice", noAdvice: 'No recent crop diagnosis', scanToStart: 'Scan a crop to get advice based on your field.', viewAdvice: 'View advice', cropHealth: 'Crop health', water: 'Soil moisture', weather: 'Weather', alerts: 'Alerts', good: 'Good', watch: 'Needs attention', noFields: 'No fields added yet', addField: 'Add a field', activeFields: 'active fields', viewFields: 'View fields', fieldMap: 'Smart field map', boundaryMissing: 'No field boundaries recorded', selectField: 'Select a field to see its details.', scan: 'Scan crop', waterAction: 'Water', weatherAction: 'Weather', help: 'Expert help', market: 'Market prices', quickActions: 'Quick actions', monitoring: 'Live monitoring', temperature: 'Temperature', humidity: 'Humidity', synced: 'Last updated', weatherToday: 'Local weather', rain: 'Rain chance', tomorrow: 'Tomorrow', marketSubtitle: 'Check current prices for your crops.', recent: 'Recent updates', viewAll: 'View all', noAlerts: 'No new alerts',
  },
  hi: {
    greeting: 'सुप्रभात', today: 'आज आपके खेत में किन बातों पर ध्यान देना है।', advice: 'आज की सलाह', noAdvice: 'फसल का हालिया निदान नहीं है', scanToStart: 'अपने खेत के अनुसार सलाह पाने के लिए फसल स्कैन करें।', viewAdvice: 'सलाह देखें', cropHealth: 'फसल की सेहत', water: 'मिट्टी की नमी', weather: 'मौसम', alerts: 'सूचनाएं', good: 'अच्छा', watch: 'ध्यान दें', noFields: 'अभी कोई खेत नहीं जोड़ा गया', addField: 'खेत जोड़ें', activeFields: 'सक्रिय खेत', viewFields: 'खेत देखें', fieldMap: 'खेत का नक्शा', boundaryMissing: 'खेत की सीमा दर्ज नहीं है', selectField: 'जानकारी देखने के लिए खेत निवड़ा.', scan: 'फसल स्कॅन', waterAction: 'पानी', weatherAction: 'मौसम', help: 'विशेषज्ञ सहायता', market: 'मंडी भाव', quickActions: 'त्वरित कार्य', monitoring: 'खेत की निगरानी', temperature: 'तापमान', humidity: 'नमी', synced: 'आखिरी अपडेट', weatherToday: 'स्थानीय मौसम', rain: 'बारिश की संभावना', tomorrow: 'कल', marketSubtitle: 'अपनी फसलों के मौजूदा भाव पहा।', recent: 'हाल के अपडेट', viewAll: 'सभी देखें', noAlerts: 'कोई नई सूचना नहीं',
  },
  mr: {
    greeting: 'शुभ सकाळ', today: 'आज तुमच्या शेतात कोणत्या गोष्टींकडे लक्ष द्यायचे ते पाहा.', advice: 'आजचा सल्ला', noAdvice: 'पिकाचे अलीकडील निदान नाही', scanToStart: 'तुमच्या शेतासाठी सल्ला मिळवण्यासाठी पीक स्कॅन करा.', viewAdvice: 'सल्ला पहा', cropHealth: 'पिकाचे आरोग्य', water: 'मातीतील ओलावा', weather: 'हवामान', alerts: 'सूचना', good: 'चांगले', watch: 'लक्ष द्या', noFields: 'अजून शेत जोडलेले नाही', addField: 'शेत जोडा', activeFields: 'सक्रिय शेते', viewFields: 'शेते पहा', fieldMap: 'शेताचा नकाशा', boundaryMissing: 'शेताची सीमा नोंदवलेली नाही', selectField: 'माहिती पाहण्यासाठी शेत निवडा.', scan: 'पीक स्कॅन', waterAction: 'पाणी', weatherAction: 'हवामान', help: 'तज्ञांची मदत', market: 'बाजारभाव', quickActions: 'जलद कृती', monitoring: 'थेट निरीक्षण', temperature: 'तापमान', humidity: 'आर्द्रता', synced: 'शेवटचे अपडेट', weatherToday: 'स्थानिक हवामान', rain: 'पावसाची शक्यता', tomorrow: 'उद्या', marketSubtitle: 'तुमच्या पिकांचे सध्याचे भाव पहा.', recent: 'अलीकडील अपडेट', viewAll: 'सर्व पहा', noAlerts: 'नवीन सूचना नाहीत',
  },
} as const;

const statusColor = (status: Field['healthStatus']) => {
  if (status === 'Healthy') return { fill: '#4d9b5e', className: 'text-emerald-800' };
  if (status === 'Under Watch') return { fill: '#d2a630', className: 'text-amber-800' };
  return { fill: '#d47a3c', className: 'text-orange-800' };
};

const statusLabel = (status: Field['healthStatus'], language: Language) => {
  if (status === 'Healthy') return copy[language].good;
  if (status === 'Under Watch') return copy[language].watch;
  if (status === 'High Risk' || status === 'Action Needed') {
    return language === 'hi' ? 'उच्च जोखिम' : language === 'mr' ? 'जास्त धोका' : 'High risk';
  }
  return language === 'hi' ? 'ध्यान दें' : language === 'mr' ? 'लक्ष द्या' : 'Attention';
};

export const FarmerHomeDashboard: React.FC<FarmerHomeDashboardProps> = ({ fields, cases, alerts, language, user, onOpenScanModal, onViewFieldHealth, onViewAllFields, onNavigateTab }) => {
  const labels = copy[language];
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? '');
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const mapLayersRef = useRef(new Map<string, LeafletPath>());
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? fields[0];
  const moistureFields = fields.filter((field) => Number.isFinite(field.sensors.soilMoisture));
  const averageMoisture = moistureFields.length ? Math.round(moistureFields.reduce((sum, field) => sum + field.sensors.soilMoisture, 0) / moistureFields.length) : null;
  const activeCase = [...cases].filter((item) => item.status !== 'RESOLVED' && item.status !== 'REJECTED').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const recentAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);
  const recentCases = [...cases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 2);
  const weather = selectedField?.weather;
  const forecast = weather?.forecast?.[0];
  const boundaryFields = fields.filter((field) => (field.boundaryPolygon?.length ?? 0) >= 3);

  useEffect(() => {
    if (!mapElementRef.current || fields.length === 0) return;
    let isMounted = true;
    let map: LeafletMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const fieldLabels: Array<{ layer: LeafletPath; text: string }> = [];
    void import('leaflet').then(({ default: L }) => {
      if (!isMounted || !mapElementRef.current) return;
      map = L.map(mapElementRef.current, { scrollWheelZoom: false, zoomControl: true });
      mapLayersRef.current.clear();
      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      });
      const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
      satellite.addTo(map);
      const fieldLayer = L.featureGroup().addTo(map);
      L.control.layers({ Satellite: satellite, Streets: street }, { Fields: fieldLayer }, { collapsed: true }).addTo(map);
      let userLocation: ReturnType<typeof L.circleMarker> | null = null;
      const locateControl = new L.Control({ position: 'topleft' });
      locateControl.onAdd = () => {
        const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control farmer-map-locate');
        button.type = 'button';
        button.title = 'Show my location';
        button.setAttribute('aria-label', 'Show my location');
        button.textContent = '◎';
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, 'click', () => map?.locate({ setView: true, maxZoom: 17 }));
        return button;
      };
      locateControl.addTo(map);
      map.on('locationfound', (event) => {
        userLocation?.remove();
        userLocation = L.circleMarker(event.latlng, { radius: 7, color: '#ffffff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }).addTo(map!);
        userLocation.bindTooltip('You are here');
      });

      const bounds = L.latLngBounds([]);
      fields.forEach((field, index) => {
        const fieldColor = ['#27834a', '#d3a631', '#8456a6'][index % 3];
        const boundary = field.boundaryPolygon ?? [];
        const selected = selectedField?.id === field.id;
        const layer: LeafletPath = boundary.length >= 3
          ? L.polygon(boundary.map(({ lat, lng }) => [lat, lng] as LatLngTuple), {
              color: '#ffffff',
              fillColor: fieldColor,
              fillOpacity: selected ? 0.48 : 0.34,
              weight: selected ? 3 : 2,
            })
          : L.circleMarker([field.location.lat, field.location.lng], {
              radius: 8,
              color: '#ffffff',
              weight: selected ? 3 : 2,
              fillColor: fieldColor,
              fillOpacity: 0.9,
            });
        layer.addTo(fieldLayer);
        fieldLabels.push({ layer, text: `${field.name}\n${field.areaAcres} ac` });
        layer.on('click', () => setSelectedFieldId(field.id));
        mapLayersRef.current.set(field.id, layer);
        if (boundary.length >= 3) boundary.forEach(({ lat, lng }) => bounds.extend([lat, lng]));
        else bounds.extend([field.location.lat, field.location.lng]);
      });
      const updateFieldLabels = () => {
        fieldLabels.forEach(({ layer, text }) => {
          if (map!.getZoom() >= 17) {
            if (!layer.getTooltip()) {
              const fieldLabel = document.createElement('span');
              const [fieldName, area] = text.split('\n');
              fieldLabel.append(document.createTextNode(fieldName));
              if (area) {
                fieldLabel.append(document.createElement('br'), document.createTextNode(area));
              }
              layer.bindTooltip(fieldLabel, { permanent: true, direction: 'center', className: 'field-region-label' });
            }
            layer.openTooltip();
          } else if (layer.getTooltip()) {
            layer.unbindTooltip();
          }
        });
      };
      map.on('zoomend overlayadd', updateFieldLabels);
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 });

      resizeObserver = new ResizeObserver(() => map?.invalidateSize());
      resizeObserver.observe(mapElementRef.current);
    });
    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      map?.remove();
      mapLayersRef.current.clear();
    };
  }, [fields]);

  useEffect(() => {
    fields.forEach((field, index) => {
      const layer = mapLayersRef.current.get(field.id);
      if (!layer) return;
      const fieldColor = ['#27834a', '#d3a631', '#8456a6'][index % 3];
      const selected = selectedField?.id === field.id;
      layer.setStyle({ color: '#ffffff', fillColor: fieldColor, fillOpacity: selected ? 0.48 : 0.34, weight: selected ? 3 : 2 });
    });
  }, [fields, selectedField?.id]);

  const healthSummary = fields.length === 0 ? labels.noFields : fields.every((field) => field.healthStatus === 'Healthy') ? labels.good : labels.watch;
  const currentAdvice = activeCase?.aiAnalysis.recommendedNextStep;
  const weatherIcon = /rain|storm|drizzle/i.test(weather?.condition ?? '') ? '🌧' : /cloud/i.test(weather?.condition ?? '') ? '⛅' : '☀';
  const summary = [
    { label: labels.cropHealth, value: healthSummary, detail: `${fields.length} ${labels.activeFields}`, icon: Sprout, tone: 'text-emerald-700' },
    { label: labels.water, value: averageMoisture === null ? '—' : `${averageMoisture}%`, detail: '', icon: Droplets, tone: 'text-blue-700' },
    { label: labels.weather, value: weather ? `${weather.temperature}°C` : '—', detail: weather?.condition ?? '', icon: CloudSun, tone: 'text-amber-700' },
    { label: labels.alerts, value: String(alerts.length), detail: '', icon: Bell, tone: 'text-rose-700' },
  ];

  return <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 pb-28 md:gap-5 md:pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <header className="order-1 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce7d9] bg-[linear-gradient(110deg,#fff_0%,#f1f7ed_72%,#e5efdf_100%)] px-4 py-4 sm:px-6 lg:col-span-2"><div className="min-w-0"><p className="text-sm font-medium text-stone-600">{labels.greeting},</p><h1 className="text-2xl font-bold leading-tight text-[#17301f] sm:text-3xl">{user.name}</h1><p className="mt-1 text-sm text-stone-600">{labels.today}</p></div><button type="button" onClick={() => onNavigateTab('weather')} className="flex min-h-12 items-center gap-3 rounded-xl border border-white/80 bg-white/90 px-3.5 py-2 text-left shadow-sm hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"><span className="text-2xl" aria-hidden="true">{weatherIcon}</span><span><strong className="block text-lg leading-5 text-stone-900">{weather ? `${weather.temperature}°C` : '—'}</strong><span className="block max-w-40 text-xs text-stone-600">{weather?.condition ?? labels.weather}</span></span><MapPin className="ml-1 h-4 w-4 text-emerald-700" aria-hidden="true" /></button></header>

    <section className="contents">
      <article className="order-2 min-w-0 rounded-2xl border border-emerald-200 bg-[linear-gradient(145deg,#f0f7eb,#e2efdf)] p-5 shadow-[0_8px_24px_rgba(23,48,31,0.06)] sm:p-6 lg:order-3"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-900"><Sprout className="h-5 w-5" />{labels.advice}</div>{activeCase && <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-emerald-800">{activeCase.aiAnalysis.confidence}%</span>}</div><div className="mt-5 flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">💧</div><div className="min-w-0"><h2 className="line-clamp-2 text-xl font-bold leading-snug text-[#17301f] sm:text-2xl">{currentAdvice ?? labels.noAdvice}</h2><p className="mt-1 text-sm text-stone-700">{forecast ? `${labels.rain}: ${forecast.rainfallChance}%` : selectedField ? selectedField.crop : labels.scanToStart}</p></div></div>{activeCase && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${Math.min(100, activeCase.aiAnalysis.confidence)}%` }} /></div>}<button type="button" onClick={() => currentAdvice ? onNavigateTab('advisor') : onOpenScanModal(selectedField?.id)} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#14532d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">{currentAdvice ? labels.viewAdvice : labels.scan}<ArrowRight className="h-4 w-4" /></button></article>

      <section className="order-6 min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_8px_24px_rgba(23,48,31,0.05)] sm:p-5 lg:order-4" aria-label={labels.fieldMap}><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-bold text-[#17301f]">{labels.fieldMap}</h2><p className="text-sm text-stone-500">{fields.length} {labels.activeFields}</p>
        {selectedField && <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500"><MapPin className="h-3.5 w-3.5 shrink-0" />{[selectedField.location.village, selectedField.location.taluka, selectedField.location.district].filter((name, index, names) => Boolean(name) && names.indexOf(name) === index).join(', ')}</p>}
      </div><div className="flex items-center gap-1"><button type="button" title="Open full-screen map" aria-label="Open full-screen map" onClick={() => mapFrameRef.current?.requestFullscreen?.()} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"><Expand className="h-4 w-4" /></button><button type="button" onClick={onViewAllFields} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">{labels.viewFields}<ArrowRight className="h-4 w-4" /></button></div></div><div ref={mapFrameRef} className="relative mt-4 h-[260px] overflow-hidden rounded-xl border border-stone-200 bg-stone-100 sm:h-[320px] [&:fullscreen]:mt-0 [&:fullscreen]:h-screen [&:fullscreen]:w-screen" aria-label={labels.fieldMap}>
        {fields.length > 0 ? <div ref={mapElementRef} className="h-full w-full" /> : <div className="flex h-full items-center justify-center p-5 text-center text-sm text-stone-600">{labels.noFields}</div>}
      </div>{selectedField ? <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-3"><div className="min-w-0"><p className="truncate font-semibold text-stone-900">{selectedField.name} <span className="font-normal text-stone-600">· {selectedField.crop} · {selectedField.areaAcres} {language === 'hi' ? 'एकड़' : language === 'mr' ? 'एकर' : 'acres'}</span></p><p className="mt-1 text-xs text-stone-600">{labels.cropHealth}: <span className={`font-semibold ${statusColor(selectedField.healthStatus).className}`}>{statusLabel(selectedField.healthStatus, language)}</span> · {labels.water}: {selectedField.sensors.soilMoisture}%</p></div><button type="button" onClick={() => onViewFieldHealth(selectedField.id)} className="min-h-10 shrink-0 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 hover:border-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700">{labels.viewFields}</button></div> : <p className="mt-3 text-sm text-stone-600">{labels.selectField}</p>}</section>
    </section>

    {recentAlerts[0] && <button type="button" onClick={() => onNavigateTab('alerts')} className="order-3 flex w-full min-h-16 items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700 lg:order-7 lg:col-span-2"><Bell className="h-5 w-5 shrink-0 text-amber-800" /><span className="min-w-0 flex-1"><strong className="block text-sm text-stone-900">{recentAlerts[0].title}</strong><span className="mt-0.5 block line-clamp-1 text-xs text-stone-700">{recentAlerts[0].message}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-amber-900" /></button>}
    <section className="order-4 grid grid-cols-2 gap-3 lg:order-2 lg:col-span-2 lg:grid-cols-4" aria-label={labels.cropHealth}>{summary.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="min-w-0 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-[0_4px_16px_rgba(23,48,31,0.04)] sm:p-4"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50"><Icon className={`h-5 w-5 ${tone}`} /></span><span className="truncate text-xs font-semibold text-stone-600 sm:text-sm">{label}</span></div><p className="mt-3 truncate text-xl font-bold leading-tight text-[#17301f] sm:text-2xl">{value}</p>{detail && <p className="mt-1 truncate text-xs text-stone-500">{detail}</p>}</div>)}</section>

    <section className="order-7 grid min-w-0 grid-cols-1 gap-4 lg:order-5 lg:col-span-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"><article className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_4px_16px_rgba(23,48,31,0.04)] sm:p-5"><div className="flex items-center justify-between gap-2"><h2 className="text-base font-bold text-[#17301f]">{labels.monitoring}</h2><button type="button" onClick={() => onNavigateTab('farm_data')} className="min-h-10 text-sm font-semibold text-emerald-800 hover:underline">{labels.viewAll}</button></div><div className="mt-4 grid grid-cols-3 gap-2"><Metric label={labels.water} value={averageMoisture === null ? '—' : `${averageMoisture}%`} icon={<Droplets className="h-4 w-4 text-blue-700" />} /><Metric label={labels.temperature} value={selectedField ? `${selectedField.sensors.canopyTemp}°C` : '—'} icon={<CloudSun className="h-4 w-4 text-amber-700" />} /><Metric label={labels.humidity} value={selectedField ? `${selectedField.sensors.relativeHumidity}%` : '—'} icon={<Wind className="h-4 w-4 text-sky-700" />} /></div>{selectedField && <p className="mt-3 text-xs text-stone-500">{labels.synced}: {selectedField.sensors.lastUpdated}</p>}</article><article className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_4px_16px_rgba(23,48,31,0.04)] sm:p-5"><div className="flex items-center justify-between gap-2"><h2 className="text-base font-bold text-[#17301f]">{labels.weatherToday}</h2><button type="button" onClick={() => onNavigateTab('weather')} className="min-h-10 text-sm font-semibold text-emerald-800 hover:underline">{labels.viewAll}</button></div>{weather ? <div className="mt-3"><p className="text-2xl font-bold text-stone-900">{weather.temperature}°C <span className="text-base font-medium text-stone-600">{weather.condition}</span></p><p className="mt-2 text-sm text-stone-600">{labels.humidity}: {weather.humidity}% · {labels.rain}: {forecast ? `${forecast.rainfallChance}%` : '—'}</p>{forecast && <p className="mt-1 text-sm text-stone-600">{labels.tomorrow}: {forecast.tempMin}°–{forecast.tempMax}°C · {forecast.rainfallChance}%</p>}</div> : <p className="mt-4 text-sm text-stone-600">—</p>}</article><button type="button" onClick={() => onNavigateTab('market')} className="min-h-32 rounded-xl border border-stone-200 bg-white p-4 text-left shadow-[0_4px_16px_rgba(23,48,31,0.04)] hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 sm:p-5"><span className="flex items-center justify-between"><span className="text-base font-bold text-[#17301f]">{labels.market}</span><TrendingUp className="h-5 w-5 text-emerald-700" /></span><span className="mt-3 block text-sm text-stone-600">{labels.marketSubtitle}</span><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800">{labels.viewAll}<ArrowRight className="h-4 w-4" /></span></button></section>

    <section className="order-5 grid min-w-0 grid-cols-1 gap-4 lg:order-6 lg:col-span-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"><div className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_4px_16px_rgba(23,48,31,0.04)] sm:p-5"><h2 className="text-base font-bold text-[#17301f]">{labels.quickActions}</h2><div className="mt-3 grid grid-cols-2 gap-2"><Action icon={<ScanLine className="h-5 w-5" />} label={labels.scan} onClick={() => onOpenScanModal(selectedField?.id)} primary /><Action icon={<Droplets className="h-5 w-5" />} label={labels.waterAction} onClick={() => onNavigateTab('water')} /><Action icon={<CloudSun className="h-5 w-5" />} label={labels.weatherAction} onClick={() => onNavigateTab('weather')} /><Action icon={<Users className="h-5 w-5" />} label={labels.help} onClick={() => onNavigateTab('help')} /></div></div><div className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_4px_16px_rgba(23,48,31,0.04)] sm:p-5"><div className="flex items-center justify-between gap-2"><h2 className="text-base font-bold text-[#17301f]">{labels.recent}</h2><button type="button" onClick={() => onNavigateTab('alerts')} className="min-h-10 text-sm font-semibold text-emerald-800 hover:underline">{labels.viewAll}</button></div>{recentAlerts.length ? <ul className="mt-2 divide-y divide-stone-100">{recentAlerts.map((alert) => <li key={alert.id}><button type="button" onClick={() => onNavigateTab('alerts')} className="flex min-h-14 w-full items-start gap-3 py-3 text-left"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${alert.priority === 'high' ? 'bg-red-600' : alert.priority === 'moderate' ? 'bg-amber-500' : 'bg-blue-600'}`} /><span className="min-w-0"><strong className="block text-sm text-stone-900">{alert.title}</strong><span className="block text-sm text-stone-600">{alert.message}</span></span></button></li>)}</ul> : <p className="py-5 text-sm text-stone-600"><CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-700" />{labels.noAlerts}</p>}{recentCases.map((item) => <button key={item.id} type="button" onClick={() => onViewFieldHealth(item.fieldId)} className="mt-2 block w-full truncate border-t border-stone-100 pt-2 text-left text-sm text-stone-700 hover:text-emerald-800">{item.fieldName} · {item.crop} · {item.aiAnalysis.observation}</button>)}</div></section>
    {fields.length === 0 && <button type="button" onClick={onViewAllFields} className="rounded-lg border border-emerald-300 px-4 py-3 font-semibold text-emerald-800">{labels.addField}</button>}
  </div>;
};

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="min-w-0 rounded-lg bg-stone-50 p-2.5"><div className="flex items-center gap-1.5 text-xs text-stone-600">{icon}<span className="truncate">{label}</span></div><p className="mt-1 text-lg font-bold text-stone-900">{value}</p></div>;
}

function Action({ icon, label, onClick, primary = false }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex min-h-20 flex-col items-start justify-between gap-2 rounded-xl border p-3 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:min-h-24 sm:p-4 ${primary ? 'border-[#166534] bg-[#166534] text-white hover:bg-[#14532d]' : 'border-stone-200 bg-white text-stone-800 hover:border-emerald-400 hover:bg-emerald-50'}`}><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${primary ? 'bg-white/15' : 'bg-emerald-50 text-emerald-800'}`}>{icon}</span><span>{label}</span></button>;
}