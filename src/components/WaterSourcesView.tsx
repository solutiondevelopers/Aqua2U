import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FillingStation } from '../types';
import { 
  Building2, 
  Droplet, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  Gauge, 
  Activity,
  Info,
  Clock,
  MapPin
} from 'lucide-react';

export const WaterSourcesView: React.FC = () => {
  const { stations, refillStationWater, tankers } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Operational' | 'Planned'>('All');

  const operationalCount = stations.filter(s => s.isOperational).length;
  const plannedCount = stations.filter(s => !s.isOperational).length;

  const filteredStations = stations.filter(s => {
    if (filterType === 'Operational') return s.isOperational;
    if (filterType === 'Planned') return !s.isOperational;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PMC Filling Stations & Water Hubs</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-world Pune municipal filling points, intake treatment nodes, and tanker loading bays.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filterType === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Stations ({stations.length})
          </button>
          <button
            onClick={() => setFilterType('Operational')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'Operational'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Operational ({operationalCount})
          </button>
          <button
            onClick={() => setFilterType('Planned')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filterType === 'Planned'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Planned / Under Review ({plannedCount})
          </button>
        </div>
      </div>

      {/* Dataset Verification Notice */}
      <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-900">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Official Pune Municipal Corporation (PMC) Filling Station Dataset</p>
          <p className="text-sky-800 leading-relaxed">
            Stations marked <span className="font-semibold text-slate-900">"Reported Existing"</span> are active municipal loading hubs used in the AI allocation engine. For stations without live telemetry sensors, storage reflects <span className="font-semibold text-slate-900">"Data unavailable"</span> to preserve transparency. Planned/Announced sites are non-operational.
          </p>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map(station => {
          const tankersLoadingHere = tankers.filter(
            t => t.assignedStationId === station.id && (t.status === 'At Filling Station' || t.status === 'On Route')
          );
          const hasLiveData = station.currentWater != null;
          const currentWater = station.currentWater || 0;
          const totalCap = station.totalCapacity || 100000;
          const percent = hasLiveData ? Math.round((currentWater / totalCap) * 100) : null;

          return (
            <div 
              key={station.id} 
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition hover:border-slate-300 ${
                station.isOperational ? 'border-slate-200' : 'border-dashed border-amber-300 bg-amber-50/20'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: ID + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-mono border border-sky-100">
                      {station.id}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[130px]">
                      {station.type}
                    </span>
                  </div>
                  <span 
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                      station.status === 'Announced'
                        ? 'text-purple-700 bg-purple-50 border-purple-200'
                        : station.status === 'Reported / Expansion Context'
                        ? 'text-amber-800 bg-amber-50 border-amber-200'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    {station.isOperational ? '● Operational' : '◌ Non-operational'}
                  </span>
                </div>

                {/* Name & Location */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{station.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{station.location}</span>
                  </div>
                </div>

                {/* Water Availability Box (Rule 4: Show "Data unavailable" when live telemetry unverified) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Live Water Availability</span>
                    {hasLiveData ? (
                      <span className="font-bold text-slate-900">{currentWater.toLocaleString()} L</span>
                    ) : (
                      <span className="font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                        Data unavailable
                      </span>
                    )}
                  </div>

                  {hasLiveData && percent !== null ? (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent > 40 ? 'bg-sky-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  ) : null}

                  {/* Official Data Note */}
                  <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-500 leading-snug border-t border-slate-200/60">
                    <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>{station.dataNote}</span>
                  </div>
                </div>

                {/* Operational Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50/60 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Flow Rate</span>
                    <span className="font-bold text-slate-800">
                      {station.isOperational ? `${station.flowRateLpm || 800} L/min` : 'N/A (Inactive)'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50/60 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Loading Bays</span>
                    <span className="font-bold text-slate-800">
                      {station.isOperational ? `${station.availableBays || 2} Bays Active` : 'Planned'}
                    </span>
                  </div>
                </div>

                {/* Tanker Allocation Activity */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Tankers Assigned:
                  </span>
                  <span className="font-bold text-sky-700">
                    {tankersLoadingHere.length > 0 ? `${tankersLoadingHere.length} tankers` : '0 in queue'}
                  </span>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Status in AI Allocation:</span>
                <span className={`font-semibold ${station.isOperational ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {station.isOperational ? '✓ Eligible for Dispatch' : '✕ Excluded (Non-operational)'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
