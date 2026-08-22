import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Tanker, FillingStation, WaterRequest } from '../types';
import {
  Truck,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Navigation2,
  Layers,
  Maximize2,
  Minimize2,
  Compass,
  MapPin,
  Clock,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

interface InteractiveMapProps {
  mode?: 'dashboard' | 'liveMap' | 'routeOptimization' | 'emergency' | 'equity' | 'compact' | 'driver';
  height?: string;
  selectedTankerId?: string | null;
  onSelectTanker?: (tankerId: string) => void;
  showDeviationAlert?: boolean;
}

// Realistic Road Network Coordinates for Pune Smart City Pilot
const PUNE_ROADS = {
  // Parvati Station (FS-02) to Shivaji Nagar Settlement (WR-2081)
  parvatiToShivajiNagar: [
    [18.4975, 73.8475], // Parvati Water Works (FS-02)
    [18.5020, 73.8468], // Sinhagad Rd Junction
    [18.5075, 73.8480], // Dandekar Bridge
    [18.5120, 73.8492], // Tilak Road crossing
    [18.5165, 73.8440], // Alka Talkies Chowk
    [18.5210, 73.8430], // FC Road south
    [18.5270, 73.8420], // Fergusson College Gate
    [18.5305, 73.8435], // Simla Office Chowk
    [18.5314, 73.8446]  // Shivaji Nagar Settlement (Destination)
  ] as [number, number][],

  // Alternative detour route (avoiding JM Road blockage)
  detourRoute: [
    [18.4975, 73.8475],
    [18.5010, 73.8550], // Swargate Flyover bypass
    [18.5090, 73.8580], // Bajirao Road
    [18.5180, 73.8570], // Shaniwar Wada bypass
    [18.5280, 73.8560], // Pune Municipal Corp (PMC) main gate
    [18.5314, 73.8446]
  ] as [number, number][],

  // Bund Garden Station (FS-01) to Railway Quarters (WR-2084)
  bundGardenToRailway: [
    [18.5362, 73.8824], // Bund Garden Station (FS-01)
    [18.5340, 73.8790], // Sangamwadi Bridge
    [18.5310, 73.8760], // RTO Chowk
    [18.5284, 73.8743]  // Railway Quarters, Pune Jn
  ] as [number, number][],

  // Bund Garden Station (FS-01) to Yerwada / Indira Colony (WR-2082)
  bundGardenToIndiraColony: [
    [18.5362, 73.8824],
    [18.5420, 73.8810], // Yerwada Bridge
    [18.5480, 73.8800], // Gunjan Cinema Chowk
    [18.5529, 73.8796]  // Indira Colony
  ] as [number, number][]
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mode = 'dashboard',
  height = 'h-[380px]',
  selectedTankerId: propSelectedTankerId,
  onSelectTanker,
  showDeviationAlert = false
}) => {
  const {
    tankers,
    stations,
    requests,
    equityData,
    selectedTankerId: contextSelectedTankerId,
    setSelectedTankerId,
    selectedRequestId,
    setSelectedRequestId,
    setActiveTab,
    generateAIRecommendation,
    approveAllocation
  } = useApp();

  const activeSelectedTankerId = propSelectedTankerId ?? contextSelectedTankerId;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapLayerType, setMapLayerType] = useState<'streets' | 'osm' | 'topo'>('streets');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showEquityZones, setShowEquityZones] = useState<boolean>(mode === 'equity');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(13);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);

  // Map Tile provider URL selector
  const getTileUrl = (type: 'streets' | 'osm' | 'topo') => {
    switch (type) {
      case 'osm':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'topo':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'streets':
      default:
        // CartoDB Voyager / Positron - clean municipal aesthetic with visible road names
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [18.5280, 73.8500]; // Pune Central
      const initialZoom = mode === 'compact' ? 14 : mode === 'driver' ? 14 : 13;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add Tile Layer
      const tileLayer = L.tileLayer(getTileUrl(mapLayerType), {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add attribution in clean subtle corner
      L.control.attribution({ position: 'bottomright', prefix: 'AquaGrid GIS · OSM' }).addTo(map);

      // Layer groups for clean updates
      const routesGroup = L.layerGroup().addTo(map);
      const zonesGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      routesLayerRef.current = routesGroup;
      zonesLayerRef.current = zonesGroup;
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });
    }

    return () => {
      // Keep instance alive during state re-renders to prevent flickering
    };
  }, []);

  // Update base tile layer if changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });
    L.tileLayer(getTileUrl(mapLayerType), {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(mapInstanceRef.current);
  }, [mapLayerType]);

  // 2. Render Markers, Routes, and Equity Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !routesLayerRef.current || !zonesLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    const routesGroup = routesLayerRef.current;
    const zonesGroup = zonesLayerRef.current;

    markersGroup.clearLayers();
    routesGroup.clearLayers();
    zonesGroup.clearLayers();

    // A. Render Filling Stations (Real Pune Municipal dataset: FS-001 to FS-011)
    stations.forEach(station => {
      const lat = station.coords.lat || 18.4975;
      const lng = station.coords.lng || 73.8475;
      const isOperational = station.isOperational;
      const hasLiveData = station.currentWater != null;

      const stationIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div class="w-8 h-8 rounded-2xl ${
              isOperational 
                ? 'bg-teal-600 border-2 border-white shadow-lg' 
                : 'bg-amber-600/90 border-2 border-dashed border-white shadow-md'
            } flex items-center justify-center text-white transform hover:scale-110 transition duration-200">
              <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              ${isOperational ? `
                <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white text-[8px] font-bold text-white flex items-center justify-center">
                  ${station.queueCount || 1}
                </span>
              ` : `
                <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border border-white text-[8px] font-bold text-white flex items-center justify-center">
                  !
                </span>
              `}
            </div>
            <div class="bg-slate-900/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-md mt-0.5 border border-slate-700 whitespace-nowrap">
              ${station.name} ${!isOperational ? 'Status: Planned' : ''}
            </div>
          </div>
        `,
        iconSize: [40, 44],
        iconAnchor: [20, 22]
      });

      const marker = L.marker([lat, lng], { icon: stationIcon }).addTo(markersGroup);

      marker.bindPopup(`
        <div class="p-2 space-y-2 min-w-[230px] font-sans">
          <div class="flex items-center justify-between border-b pb-1.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full ${isOperational ? 'bg-teal-500' : 'bg-amber-500'}"></span>
              <span class="font-bold text-slate-800 text-xs">${station.name} (${station.id})</span>
            </div>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              isOperational ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }">
              ${station.status}
            </span>
          </div>
          <div class="text-[11px] text-slate-600 space-y-1">
            <p><strong>Type:</strong> ${station.type}</p>
            <p><strong>Location:</strong> ${station.location}</p>
            <div class="flex justify-between items-center py-0.5 bg-slate-50 px-1.5 rounded border border-slate-100">
              <span class="font-medium text-slate-600">Live Water Storage:</span>
              <span class="font-bold ${hasLiveData ? 'text-teal-800' : 'text-slate-500'}">
                ${hasLiveData ? `${station.currentWater?.toLocaleString()} L` : 'Data unavailable'}
              </span>
            </div>
            <p class="text-[10px] text-slate-500 italic bg-amber-50/60 p-1 rounded border border-amber-100">
              ℹ ${station.dataNote}
            </p>
            <div class="flex justify-between pt-1 text-[11px]">
              <span>Flow Capacity:</span>
              <span class="font-semibold text-slate-700">${isOperational ? `${station.flowRateLpm || 800} L/min` : 'N/A (Planned)'}</span>
            </div>
            <div class="flex justify-between text-[11px]">
              <span>AI Dispatch:</span>
              <span class="font-semibold ${isOperational ? 'text-emerald-700' : 'text-amber-700'}">
                ${isOperational ? 'Eligible for Allocation' : 'Non-operational (Excluded)'}
              </span>
            </div>
          </div>
        </div>
      `);
    });

    // B. Render Water Requests (Citizen Locations / Delivery Points)
    requests.forEach(req => {
      const lat = req.locationCoords.lat || 18.5314;
      const lng = req.locationCoords.lng || 73.8446;
      const isSelected = selectedRequestId === req.id;
      const isCritical = req.priority === 'Critical' || req.isEmergency;
      const isDelivered = req.status === 'Delivered';

      let pinBg = 'bg-sky-600';
      if (isCritical) pinBg = 'bg-rose-600';
      if (isDelivered) pinBg = 'bg-emerald-600';
      if (req.priority === 'High' && !isCritical) pinBg = 'bg-amber-500';

      const reqIcon = L.divIcon({
        className: 'custom-req-pin',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center ${isSelected ? 'scale-115 z-30' : ''}">
            ${isCritical && !isDelivered ? `
              <div class="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></div>
            ` : ''}
            <div class="w-8 h-8 rounded-full ${pinBg} border-2 border-white shadow-md flex items-center justify-center text-white">
              ${isDelivered ? `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              ` : `
                <span class="text-[10px] font-bold">${req.priority === 'Critical' ? '!' : (req.quantity / 1000).toFixed(0) + 'k'}</span>
              `}
            </div>
            <div class="bg-white/95 text-slate-800 font-bold text-[9px] px-1.5 py-0.5 rounded shadow border border-slate-200 mt-1 whitespace-nowrap">
              ${req.area.split('(')[0].trim()}
            </div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 22]
      });

      const marker = L.marker([lat, lng], { icon: reqIcon }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedRequestId(req.id);
      });

      marker.bindPopup(`
        <div class="p-2 space-y-2 min-w-[230px] font-sans">
          <div class="flex items-center justify-between border-b pb-1">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-rose-600' : 'bg-sky-600'}"></span>
              <span class="font-bold text-slate-800 text-xs">${req.id} · ${req.area}</span>
            </div>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isCritical ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}">
              ${req.priority === 'Critical' ? '🚨 CRITICAL' : req.priority === 'High' ? '⚠️ HIGH' : 'ℹ️ MEDIUM'}
            </span>
          </div>
          <div class="text-[11px] text-slate-600 space-y-1">
            <p><strong>Ward:</strong> ${req.ward}</p>
            <p><strong>Demand Volume:</strong> <span class="font-bold text-slate-800">${req.quantity.toLocaleString()} L</span> (${req.population} residents)</p>
            <p><strong>Days without water:</strong> <span class="font-bold text-rose-600">${req.daysSinceLastDelivery} days</span></p>
            <p><strong>Status:</strong> <span class="font-semibold text-slate-800">${req.status}</span></p>
            ${req.assignedTankerId ? `<p><strong>Assigned Tanker:</strong> <span class="font-bold text-teal-700">${req.assignedTankerId} (ETA: ${req.etaMinutes || 25}m)</span></p>` : ''}
            <p class="text-[10px] text-slate-500 italic mt-1">${req.urgencyReason || 'Community water supply request.'}</p>
          </div>
        </div>
      `);
    });

    // C. Render Tankers (Live Moving Fleet)
    tankers.forEach(tanker => {
      const lat = tanker.currentCoords.lat || 18.5180;
      const lng = tanker.currentCoords.lng || 73.8420;
      const isSelected = activeSelectedTankerId === tanker.id;
      const isDeviation = tanker.status === 'Route Deviation' || tanker.hasDeviationAlert;

      let colorClass = 'bg-teal-600';
      if (tanker.status === 'At Filling Station') colorClass = 'bg-blue-600';
      if (tanker.status === 'Delayed') colorClass = 'bg-amber-500';
      if (isDeviation) colorClass = 'bg-red-600 animate-pulse';
      if (tanker.status === 'Offline') colorClass = 'bg-slate-400';
      if (tanker.status === 'Available') colorClass = 'bg-emerald-500';

      const tankerIcon = L.divIcon({
        className: 'custom-tanker-pin',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center ${isSelected ? 'scale-120 z-40' : ''}">
            ${isSelected ? `
              <div class="absolute -inset-2 rounded-full border-2 border-dashed border-sky-500 animate-spin" style="animation-duration: 8s;"></div>
            ` : ''}
            ${isDeviation ? `
              <div class="absolute -inset-2.5 rounded-full bg-rose-500/40 animate-ping"></div>
            ` : ''}
            <div class="w-8 h-8 rounded-xl ${colorClass} border-2 border-white shadow-lg flex items-center justify-center text-white transform hover:scale-110 transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div class="bg-slate-900 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              ${tanker.id}
            </div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 22]
      });

      const marker = L.marker([lat, lng], { icon: tankerIcon }).addTo(markersGroup);

      marker.on('click', () => {
        if (onSelectTanker) {
          onSelectTanker(tanker.id);
        } else {
          setSelectedTankerId(tanker.id);
        }
      });

      marker.bindPopup(`
        <div class="p-2 space-y-2 min-w-[240px] font-sans">
          <div class="flex items-center justify-between border-b pb-1.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full ${colorClass}"></span>
              <span class="font-bold text-slate-800 text-xs">${tanker.id} (${tanker.licensePlate})</span>
            </div>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isDeviation ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}">
              ${tanker.status}
            </span>
          </div>
          <div class="text-[11px] text-slate-600 space-y-1">
            <p><strong>Driver:</strong> ${tanker.driverName} (${tanker.driverPhone})</p>
            <p><strong>Water Payload:</strong> <span class="font-bold text-teal-700">${(tanker.waterRemainingLiters || tanker.currentWater).toLocaleString()} L</span> / ${tanker.capacity.toLocaleString()} L</p>
            <p><strong>Destination:</strong> ${tanker.destinationArea || 'Standby Hub'}</p>
            <div class="flex justify-between">
              <span>Speed:</span>
              <span class="font-semibold text-slate-800">${tanker.speedKmH || tanker.speedKmh || 0} km/h</span>
            </div>
            <div class="flex justify-between">
              <span>ETA:</span>
              <span class="font-bold text-teal-800">${tanker.etaMinutes || 20} mins</span>
            </div>
            <div class="flex justify-between">
              <span>Fuel:</span>
              <span class="font-semibold text-slate-800">${tanker.fuelPercent || 80}%</span>
            </div>
            ${isDeviation ? `
              <div class="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>Route deviation detected (+1.2km)</span>
              </div>
            ` : ''}
          </div>
        </div>
      `);
    });

    // D. Render Route Polylines (Realistic Road Routing)
    // 1. Primary AI-Optimized Route (Parvati Station -> Shivaji Nagar)
    const primaryRoute = L.polyline(PUNE_ROADS.parvatiToShivajiNagar, {
      color: '#0284c7', // Sky blue
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(routesGroup);

    // 2. Alternative Route (Dashed)
    if (mode === 'routeOptimization' || mode === 'driver') {
      L.polyline(PUNE_ROADS.detourRoute, {
        color: '#94a3b8',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.75
      }).addTo(routesGroup);

      // Road Blockage Hazard Marker on JM Road
      const hazardIcon = L.divIcon({
        className: 'custom-hazard-pin',
        html: `
          <div class="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white animate-bounce">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            <span>JM Road Congestion</span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      L.marker([18.5220, 73.8480], { icon: hazardIcon }).addTo(routesGroup);
    }

    // 3. Secondary Routes in Live Map / Dashboard
    if (mode === 'liveMap' || mode === 'dashboard') {
      L.polyline(PUNE_ROADS.bundGardenToRailway, {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.75
      }).addTo(routesGroup);

      L.polyline(PUNE_ROADS.bundGardenToIndiraColony, {
        color: '#0d9488',
        weight: 3.5,
        opacity: 0.75
      }).addTo(routesGroup);
    }

    // E. Render Equity / Shortage Zones
    if (showEquityZones || mode === 'equity' || mode === 'emergency') {
      equityData.forEach(eq => {
        const lat = eq.coords.lat || 18.5200;
        const lng = eq.coords.lng || 73.8500;
        const radius = eq.coords.radius || 900;

        let zoneColor = '#10b981'; // well-served
        let fillColor = '#dcfce7';
        if (eq.status === 'Under-served') {
          zoneColor = '#f97316';
          fillColor = '#ffedd5';
        }
        if (eq.status === 'Critical shortage') {
          zoneColor = '#ef4444';
          fillColor = '#fee2e2';
        }

        const circle = L.circle([lat, lng], {
          radius: radius,
          color: zoneColor,
          weight: 2,
          fillColor: fillColor,
          fillOpacity: 0.35
        }).addTo(zonesGroup);

        circle.bindPopup(`
          <div class="p-2 space-y-1.5 min-w-[200px] font-sans">
            <div class="flex items-center justify-between border-b pb-1">
              <span class="font-bold text-slate-800 text-xs">${eq.areaName}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${eq.status === 'Critical shortage' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">
                ${eq.status}
              </span>
            </div>
            <p class="text-[11px] text-slate-600"><strong>Zone:</strong> ${eq.zone}</p>
            <p class="text-[11px] text-slate-600"><strong>Population:</strong> ${eq.population.toLocaleString()}</p>
            <p class="text-[11px] text-slate-600"><strong>Delivered (Last 7d):</strong> ${(eq.waterReceivedL / 1000).toFixed(0)}k L</p>
            <p class="text-[11px] text-slate-600"><strong>Days Without Delivery:</strong> <span class="font-bold text-red-600">${eq.daysSinceLastDelivery} days</span></p>
          </div>
        `);
      });
    }

    // F. Focus on selected tanker or request if specified
    if (activeSelectedTankerId) {
      const targetTanker = tankers.find(t => t.id === activeSelectedTankerId);
      if (targetTanker && targetTanker.currentCoords.lat && targetTanker.currentCoords.lng) {
        map.flyTo([targetTanker.currentCoords.lat, targetTanker.currentCoords.lng], 14, {
          duration: 0.8
        });
      }
    }
  }, [tankers, stations, requests, equityData, activeSelectedTankerId, selectedRequestId, mode, showEquityZones]);

  // Recenter to full Pune city bounds
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([18.5280, 73.8500], 13, { duration: 0.8 });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div
      className={`relative w-full ${height} ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'rounded-2xl'} overflow-hidden border border-slate-200 shadow-xs bg-slate-100 flex flex-col select-none`}
    >
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* City & Live Status Badge */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-800">Pune Municipal Grid</span>
          <span className="text-[10px] font-medium text-slate-400 border-l border-slate-200 pl-2">
            10 Tankers Active · 3 Hubs
          </span>
        </div>

        {/* Layer Controls & Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Map Layer Switcher */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-1">
            <button
              onClick={() => setMapLayerType('streets')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                mapLayerType === 'streets' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Carto Positron Streets"
            >
              Streets
            </button>
            <button
              onClick={() => setMapLayerType('osm')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                mapLayerType === 'osm' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="OpenStreetMap Standard"
            >
              OSM
            </button>
          </div>

          {/* Equity Zones Toggle */}
          <button
            onClick={() => setShowEquityZones(!showEquityZones)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shadow-md cursor-pointer transition flex items-center gap-1.5 ${
              showEquityZones
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white/95 border-slate-200/80 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Water Equity Heatmap"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Equity Zones</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-md text-slate-700 hover:bg-slate-50 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Right Side Zoom & Recenter Controls */}
      <div className="absolute right-3 top-14 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white/95 hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white/95 hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm cursor-pointer"
          title="Zoom out"
        >
          -
        </button>
        <button
          onClick={handleRecenter}
          className="w-8 h-8 bg-white/95 hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
          title="Recenter to Pune City"
        >
          <Compass className="w-4 h-4 text-teal-600" />
        </button>
      </div>

      {/* Route Deviation Floating Alert */}
      {showDeviationAlert && (
        <div className="absolute top-14 left-3 bg-rose-500/95 text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 shadow-lg max-w-xs z-10 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-white shrink-0 animate-bounce" />
          <div className="flex-1 text-[11px]">
            <span className="font-bold block">TK-107 Route Deviation</span>
            <span className="text-rose-100">1.2 km off designated Shivaji Nagar bypass</span>
          </div>
          <button
            onClick={() => {
              if (onSelectTanker) onSelectTanker('TK-107');
              else setSelectedTankerId('TK-107');
            }}
            className="text-[10px] font-bold text-rose-900 bg-white hover:bg-rose-50 px-2 py-1 rounded-lg cursor-pointer shadow-xs"
          >
            Locate
          </button>
        </div>
      )}

      {/* Bottom Live Legend & Traffic Indicator */}
      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between pointer-events-none z-10">
        {/* Collapsible Rich Map Legend */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-3 max-w-[280px] pointer-events-auto transition-all duration-300">
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              🗺️ GIS MAP LEGEND
            </span>
            <button
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="text-[10px] font-bold text-teal-600 hover:text-teal-700 underline focus:outline-none cursor-pointer"
            >
              {isLegendOpen ? 'Hide' : 'Show Details'}
            </button>
          </div>

          {isLegendOpen ? (
            <div className="mt-2 space-y-2.5 text-[10px] text-slate-600 max-h-44 overflow-y-auto pr-1">
              {/* Fleet section */}
              <div>
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">🚚 Tanker Status</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-teal-600 inline-block"></span>
                    <span>On Route</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-blue-600 inline-block"></span>
                    <span>At Station</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600 font-bold">
                    <span className="w-2 h-2 rounded bg-red-600 inline-block animate-pulse"></span>
                    <span>Deviation</span>
                  </div>
                </div>
              </div>

              {/* Request points */}
              <div>
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">📍 Request/Delivery Points</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="flex items-center gap-1 text-rose-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                    <span>🚨 Critical</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                    <span>⚠️ High Priority</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span>
                    <span>Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    <span>✓ Delivered</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 italic mt-1 leading-tight">
                  * Floating numeric labels (e.g. <span className="font-bold">"10k"</span>) display requested capacity in Liters (kL).
                </p>
              </div>

              {/* Stations */}
              <div>
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">💧 Filling Stations</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-teal-600 inline-block"></span>
                    <span>Operational (Small circle shows queue count)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded border border-dashed border-amber-600 bg-amber-50 inline-block"></span>
                    <span>Planned Station <span className="font-semibold text-amber-700">(Status: Planned)</span></span>
                  </div>
                </div>
              </div>

              {/* Routes */}
              <div>
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">🛣️ Routes & Corridors</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-0.5 bg-sky-600 inline-block"></span>
                    <span>Primary AI-Optimized Corridor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
                    <span>Alternative / Detour Bypass</span>
                  </div>
                </div>
              </div>

              {showEquityZones && (
                <div>
                  <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">🌐 Equity Zones</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Well-served
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Under-served
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[9px] text-slate-400 mt-1">Legend hidden. Click expand to view codings.</p>
          )}
        </div>

        {/* Live Traffic Badge */}
        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-md text-[10px] font-bold text-slate-700 flex items-center gap-1.5 pointer-events-auto hidden md:flex mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Traffic: Moderate (Sinhagad Rd · 32 km/h)</span>
        </div>
      </div>
    </div>
  );
};
