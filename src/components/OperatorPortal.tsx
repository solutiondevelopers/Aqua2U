import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Droplet, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Gauge, 
  Clock, 
  Check
} from 'lucide-react';

interface StationOperationalDetails {
  availableL: number;
  maxCapacityL: number;
  tankerQueueCount: number;
  activeBays: number;
  avgLoadingTimeMin: number;
  waterQuality: string;
  pH: number;
  tds: number;
  turbidity: number;
  pumpInflow: string;
  currentTanker: string;
  currentLoadingL: number;
  pressureBar: number;
  stationStatus: string;
  isOperational: boolean;
  baysStatus: Array<{ bay: number; label: string; tanker: string; qty: number; status: 'Active' | 'Loading' | 'Available' }>;
  refillLog: Array<{ tanker: string; qty: string; time: string; status: string; driver: string }>;
}

const STATION_OPERATIONAL_DATA: Record<string, StationOperationalDetails> = {
  'FS-001': {
    availableL: 82000,
    maxCapacityL: 100000,
    tankerQueueCount: 2,
    activeBays: 3,
    avgLoadingTimeMin: 14,
    waterQuality: 'Potable',
    pH: 7.3,
    tds: 172,
    turbidity: 0.7,
    pumpInflow: '+25,000 L',
    currentTanker: 'TK-101',
    currentLoadingL: 8000,
    pressureBar: 4.5,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'High Flow Bay 1', tanker: 'TK-101', qty: 8000, status: 'Loading' },
      { bay: 2, label: 'Automated Bay 2', tanker: 'TK-103', qty: 10000, status: 'Active' },
      { bay: 3, label: 'Standby Bay 3', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-101', qty: '8,000 L', time: '09:15 AM', status: 'In Bay #1', driver: 'Ramesh K.' },
      { tanker: 'TK-103', qty: '10,000 L', time: '08:40 AM', status: 'Dispatched', driver: 'Suresh M.' },
      { tanker: 'Municipal Inflow', qty: '+25,000 L', time: '07:30 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-002': {
    availableL: 64000,
    maxCapacityL: 80000,
    tankerQueueCount: 3,
    activeBays: 4,
    avgLoadingTimeMin: 17,
    waterQuality: 'Potable',
    pH: 7.5,
    tds: 184,
    turbidity: 0.8,
    pumpInflow: '+18,000 L',
    currentTanker: 'TK-104',
    currentLoadingL: 10000,
    pressureBar: 4.2,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'High Flow Bay 1', tanker: 'TK-104', qty: 10000, status: 'Loading' },
      { bay: 2, label: 'Automated Bay 2', tanker: 'TK-106', qty: 9000, status: 'Active' },
      { bay: 3, label: 'Standard Bay 3', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 4, label: 'Standard Bay 4', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-104', qty: '10,000 L', time: '09:20 AM', status: 'In Bay #1', driver: 'Amit S.' },
      { tanker: 'TK-106', qty: '9,000 L', time: '08:50 AM', status: 'Dispatched', driver: 'Rahul P.' },
      { tanker: 'Municipal Inflow', qty: '+18,000 L', time: '07:15 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-003': {
    availableL: 91000,
    maxCapacityL: 120000,
    tankerQueueCount: 1,
    activeBays: 3,
    avgLoadingTimeMin: 11,
    waterQuality: 'Potable',
    pH: 7.2,
    tds: 158,
    turbidity: 0.5,
    pumpInflow: '+30,000 L',
    currentTanker: 'TK-108',
    currentLoadingL: 6000,
    pressureBar: 4.8,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'High Flow Bay 1', tanker: 'TK-108', qty: 6000, status: 'Loading' },
      { bay: 2, label: 'Automated Bay 2', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 3, label: 'Standby Bay 3', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-108', qty: '6,000 L', time: '09:30 AM', status: 'In Bay #1', driver: 'Kiran N.' },
      { tanker: 'Municipal Inflow', qty: '+30,000 L', time: '06:30 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-004': {
    availableL: 47000,
    maxCapacityL: 70000,
    tankerQueueCount: 2,
    activeBays: 2,
    avgLoadingTimeMin: 19,
    waterQuality: 'Potable',
    pH: 7.4,
    tds: 169,
    turbidity: 0.6,
    pumpInflow: '+15,000 L',
    currentTanker: 'TK-112',
    currentLoadingL: 7000,
    pressureBar: 4.0,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'Main Bay 1', tanker: 'TK-112', qty: 7000, status: 'Loading' },
      { bay: 2, label: 'Secondary Bay 2', tanker: 'TK-114', qty: 8000, status: 'Active' }
    ],
    refillLog: [
      { tanker: 'TK-112', qty: '7,000 L', time: '09:05 AM', status: 'In Bay #1', driver: 'Vikas G.' },
      { tanker: 'Municipal Inflow', qty: '+15,000 L', time: '07:00 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-005': {
    availableL: 73000,
    maxCapacityL: 100000,
    tankerQueueCount: 4,
    activeBays: 4,
    avgLoadingTimeMin: 16,
    waterQuality: 'Potable',
    pH: 7.6,
    tds: 191,
    turbidity: 0.9,
    pumpInflow: '+22,000 L',
    currentTanker: 'TK-115',
    currentLoadingL: 10000,
    pressureBar: 4.4,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'Bay 1', tanker: 'TK-115', qty: 10000, status: 'Loading' },
      { bay: 2, label: 'Bay 2', tanker: 'TK-116', qty: 9500, status: 'Active' },
      { bay: 3, label: 'Bay 3', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 4, label: 'Bay 4', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-115', qty: '10,000 L', time: '09:40 AM', status: 'In Bay #1', driver: 'Santosh K.' },
      { tanker: 'TK-116', qty: '9,500 L', time: '08:15 AM', status: 'Dispatched', driver: 'Mahesh D.' },
      { tanker: 'Municipal Inflow', qty: '+22,000 L', time: '07:20 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-006': {
    availableL: 100000,
    maxCapacityL: 100000,
    tankerQueueCount: 1,
    activeBays: 4,
    avgLoadingTimeMin: 11,
    waterQuality: 'Potable',
    pH: 7.4,
    tds: 165,
    turbidity: 0.6,
    pumpInflow: '+30,000 L',
    currentTanker: 'TK-104',
    currentLoadingL: 10000,
    pressureBar: 4.8,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'High Flow Bay 1', tanker: 'TK-108', qty: 6000, status: 'Active' },
      { bay: 2, label: 'Automated Bay 2', tanker: 'TK-104', qty: 10000, status: 'Loading' },
      { bay: 3, label: 'Standby Bay 3', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 4, label: 'Standby Bay 4', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-104', qty: '10,000 L', time: '08:35 AM', status: 'In Bay #2', driver: 'Suresh Kumar' },
      { tanker: 'TK-101', qty: '12,000 L', time: '08:12 AM', status: 'Dispatched', driver: 'Ramesh K.' },
      { tanker: 'Municipal Inflow', qty: '+30,000 L', time: '07:00 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-007': {
    availableL: 56000,
    maxCapacityL: 80000,
    tankerQueueCount: 2,
    activeBays: 3,
    avgLoadingTimeMin: 15,
    waterQuality: 'Potable',
    pH: 7.3,
    tds: 176,
    turbidity: 0.7,
    pumpInflow: '+20,000 L',
    currentTanker: 'TK-109',
    currentLoadingL: 8000,
    pressureBar: 4.3,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'Bay 1', tanker: 'TK-109', qty: 8000, status: 'Loading' },
      { bay: 2, label: 'Bay 2', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 3, label: 'Bay 3', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-109', qty: '8,000 L', time: '09:10 AM', status: 'In Bay #1', driver: 'Ashok V.' },
      { tanker: 'Municipal Inflow', qty: '+20,000 L', time: '07:30 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-008': {
    availableL: 68000,
    maxCapacityL: 90000,
    tankerQueueCount: 3,
    activeBays: 3,
    avgLoadingTimeMin: 18,
    waterQuality: 'Potable',
    pH: 7.5,
    tds: 181,
    turbidity: 0.8,
    pumpInflow: '+17,000 L',
    currentTanker: 'TK-117',
    currentLoadingL: 9000,
    pressureBar: 4.1,
    stationStatus: 'Verification Required',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'Bay 1', tanker: 'TK-117', qty: 9000, status: 'Loading' },
      { bay: 2, label: 'Bay 2', tanker: 'Standby', qty: 0, status: 'Available' },
      { bay: 3, label: 'Bay 3', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-117', qty: '9,000 L', time: '09:25 AM', status: 'In Bay #1', driver: 'Prakash R.' },
      { tanker: 'Municipal Inflow', qty: '+17,000 L', time: '07:10 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-009': {
    availableL: 39000,
    maxCapacityL: 60000,
    tankerQueueCount: 4,
    activeBays: 2,
    avgLoadingTimeMin: 21,
    waterQuality: 'Potable',
    pH: 7.2,
    tds: 188,
    turbidity: 1.0,
    pumpInflow: '+12,000 L',
    currentTanker: 'TK-121',
    currentLoadingL: 6000,
    pressureBar: 3.9,
    stationStatus: 'Operational',
    isOperational: true,
    baysStatus: [
      { bay: 1, label: 'Bay 1', tanker: 'TK-121', qty: 6000, status: 'Loading' },
      { bay: 2, label: 'Bay 2', tanker: 'Standby', qty: 0, status: 'Available' }
    ],
    refillLog: [
      { tanker: 'TK-121', qty: '6,000 L', time: '09:45 AM', status: 'In Bay #1', driver: 'Mohan L.' },
      { tanker: 'Municipal Inflow', qty: '+12,000 L', time: '07:00 AM', status: 'Received', driver: 'Pipeline Feeder' }
    ]
  },
  'FS-010': {
    availableL: 0,
    maxCapacityL: 0,
    tankerQueueCount: 0,
    activeBays: 0,
    avgLoadingTimeMin: 0,
    waterQuality: 'N/A',
    pH: 0,
    tds: 0,
    turbidity: 0,
    pumpInflow: '0 L',
    currentTanker: 'None',
    currentLoadingL: 0,
    pressureBar: 0,
    stationStatus: 'Planned / Announced',
    isOperational: false,
    baysStatus: [],
    refillLog: []
  },
  'FS-011': {
    availableL: 0,
    maxCapacityL: 0,
    tankerQueueCount: 0,
    activeBays: 0,
    avgLoadingTimeMin: 0,
    waterQuality: 'N/A',
    pH: 0,
    tds: 0,
    turbidity: 0,
    pumpInflow: '0 L',
    currentTanker: 'None',
    currentLoadingL: 0,
    pressureBar: 0,
    stationStatus: 'Planned / Announced',
    isOperational: false,
    baysStatus: [],
    refillLog: []
  }
};

export const OperatorPortal: React.FC = () => {
  const { stations, tankers, refillStationWater, dispenseToTanker } = useApp();
  
  // Default to FS-001 Parvati station
  const [selectedStationId, setSelectedStationId] = useState<string>('FS-001');
  const currentStation = stations.find(s => s.id === selectedStationId) || stations[0];
  
  const stationDetails = STATION_OPERATIONAL_DATA[selectedStationId] || STATION_OPERATIONAL_DATA['FS-001'];

  // Filling process state
  const [fillingTankerId, setFillingTankerId] = useState<string>(stationDetails.currentTanker);
  const [fillQuantity, setFillQuantity] = useState<number>(stationDetails.currentLoadingL);
  const [isPumping, setIsPumping] = useState(false);
  const [pumpProgress, setPumpProgress] = useState(0);
  const [fillCompleted, setFillCompleted] = useState(false);
  const [refillNotice, setRefillNotice] = useState<string | null>(null);

  // Sync fillingTankerId and fillQuantity when station changes
  useEffect(() => {
    const details = STATION_OPERATIONAL_DATA[selectedStationId];
    if (details && details.isOperational) {
      setFillingTankerId(details.currentTanker);
      setFillQuantity(details.currentLoadingL);
      setFillCompleted(false);
      setPumpProgress(0);
    }
  }, [selectedStationId]);

  const availableWater = stationDetails.availableL;
  const maxCapacity = stationDetails.maxCapacityL;
  const storagePercent = maxCapacity > 0 ? Math.round((availableWater / maxCapacity) * 100) : 0;

  const handleStartPumping = () => {
    if (availableWater < fillQuantity) {
      alert("Insufficient water available in station storage!");
      return;
    }
    setIsPumping(true);
    setPumpProgress(0);
    setFillCompleted(false);

    const interval = setInterval(() => {
      setPumpProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPumping(false);
          setFillCompleted(true);
          dispenseToTanker(currentStation.id, fillingTankerId, fillQuantity);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleRefillInflow = () => {
    refillStationWater(currentStation.id, 30000);
    setRefillNotice(`Municipal Pipe Inflow Added (${stationDetails.pumpInflow})!`);
    setTimeout(() => setRefillNotice(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Operator Console Header Banner */}
      <div className="bg-[#1e293b] text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">Filling Station Operations</span>
              <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {currentStation.id}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                Demo Operational Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Station: {currentStation.name} · {currentStation.locationName || currentStation.location} · Status: <span className="text-teal-300 font-semibold">{stationDetails.stationStatus}</span>
            </p>
          </div>
        </div>

        {/* Station Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Switch Station:</span>
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-teal-400"
          >
            {stations.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} {!STATION_OPERATIONAL_DATA[s.id]?.isOperational ? '(Planned)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Alert Toast */}
      {refillNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{refillNotice}</span>
        </div>
      )}

      {/* If Station is Not Operational (Planned / Announced e.g. Undri, Bavdhan) */}
      {!stationDetails.isOperational ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{currentStation.name} ({currentStation.id})</h3>
            <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
              Station not yet operational — operational data unavailable.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Location: {currentStation.location} · Status: Planned / Announced
          </p>
        </div>
      ) : (
        <>
          {/* Top 2 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Available Water */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Available</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  storagePercent > 35 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  ● {storagePercent}% Capacity
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{availableWater.toLocaleString()} L</span>
                  <span className="text-xs text-slate-400">/ {maxCapacity.toLocaleString()} L</span>
                </div>
                <button
                  onClick={handleRefillInflow}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 cursor-pointer transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Inflow ({stationDetails.pumpInflow})</span>
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    storagePercent > 35 ? 'bg-teal-600' : 'bg-rose-500'
                  }`}
                  style={{ width: `${storagePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Tanker Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanker Queue</span>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                  {stationDetails.activeBays} Bays Active
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{stationDetails.tankerQueueCount} Tankers</span>
                <span className="text-xs text-slate-500">waiting/filling</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Avg. loading turnaround: {stationDetails.avgLoadingTimeMin} mins</span>
              </div>
            </div>
          </div>

          {/* Main Dispensing Console & Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Interactive Dispenser Bay Console */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-600" />
                    <h2 className="text-base font-bold text-slate-900">Dispense Water to Tanker ({stationDetails.currentTanker})</h2>
                  </div>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
                    Pressure: {stationDetails.pressureBar} Bar
                  </span>
                </div>

                {/* Operator Pumping Steps */}
                <div className="space-y-4">
                  {/* Step 1: Select Inbound Tanker */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">1</span>
                        Receive Tanker & Validate Assignment
                      </span>
                      <span className="text-[11px] font-mono font-bold text-teal-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Verified Assignment
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Select Tanker in Bay</label>
                        <select
                          value={fillingTankerId}
                          onChange={(e) => {
                            setFillingTankerId(e.target.value);
                            const t = tankers.find(tank => tank.id === e.target.value);
                            if (t) setFillQuantity(t.capacity);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-teal-500"
                        >
                          <option value={stationDetails.currentTanker}>{stationDetails.currentTanker} (Active in Station)</option>
                          {tankers.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.id} - {t.driverName} ({t.capacity.toLocaleString()} L)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Fill Quantity (Liters)</label>
                        <input
                          type="number"
                          value={fillQuantity}
                          onChange={(e) => setFillQuantity(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Storage Pre-check */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Check Water Availability & Pressure</span>
                        <span className="text-[11px] text-slate-500">Available: {availableWater.toLocaleString()} L · Pressure: {stationDetails.pressureBar} Bar (Nominal)</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> OK to Pump
                    </span>
                  </div>

                  {/* Step 3: High-flow Pumping Action */}
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                        Pump Water into Tanker
                      </span>
                      <span className="text-xs font-mono font-bold text-teal-800">
                        {isPumping ? `${Math.round((fillQuantity * pumpProgress) / 100).toLocaleString()} L pumped` : `${fillQuantity.toLocaleString()} L Ready`}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300 flex items-center justify-end pr-1 text-[9px] text-white font-bold"
                        style={{ width: `${pumpProgress}%` }}
                      >
                        {pumpProgress > 15 && `${pumpProgress}%`}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={handleStartPumping}
                      disabled={isPumping}
                      className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                        isPumping
                          ? 'bg-amber-500 text-white animate-pulse'
                          : fillCompleted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                      }`}
                    >
                      {isPumping ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Pumping High-Volume Inflow ({pumpProgress}%)...</span>
                        </>
                      ) : fillCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Tank Filled to {fillQuantity.toLocaleString()} L · Dispense Again</span>
                        </>
                      ) : (
                        <>
                          <Droplet className="w-4 h-4 fill-white" />
                          <span>Start Automated Pumping ({fillQuantity.toLocaleString()} L)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Inbound Queue & Live Bay Status */}
            <div className="lg:col-span-5 space-y-5">
              {/* Active Bays Status Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Dispensing Bays Status</h3>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {stationDetails.activeBays} Active Bays
                  </span>
                </div>
                <div className="space-y-2.5">
                  {stationDetails.baysStatus.map((bay, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        bay.status === 'Loading' 
                          ? 'bg-teal-50 border-teal-200' 
                          : bay.status === 'Active' 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Bay {bay.bay} ({bay.label})</span>
                        <span className="text-[11px] text-slate-600">
                          {bay.tanker !== 'Standby' ? `${bay.tanker} · ${bay.qty.toLocaleString()} L` : 'Standby for tanker arrival'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        bay.status === 'Loading' 
                          ? 'bg-white text-teal-800 border-teal-200' 
                          : bay.status === 'Active' 
                          ? 'bg-white text-emerald-800 border-emerald-200' 
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}>
                        {bay.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refill Log History */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Today's Refill & Loading Log</h3>
                  <span className="text-[10px] text-slate-400 font-medium">{currentStation.name} Station</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {stationDetails.refillLog.map((log, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{log.tanker} {log.qty !== log.tanker ? `(${log.qty})` : ''}</span>
                        <span className="text-[10px] text-slate-400">{log.time} · Driver: {log.driver}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status.includes('Bay') 
                          ? 'bg-teal-50 text-teal-700' 
                          : log.status.includes('Dispatched') 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-sky-50 text-sky-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
