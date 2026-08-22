import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tanker, TankerStatus } from '../types';
import { 
  Truck, 
  Search, 
  Filter, 
  Navigation, 
  Phone, 
  Droplet, 
  Battery, 
  Gauge,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const TankersView: React.FC = () => {
  const { tankers, setSelectedTankerId, setActiveTab } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = tankers.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.driverName.toLowerCase().includes(search.toLowerCase()) ||
      (t.destinationArea && t.destinationArea.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleTrackTanker = (tankerId: string) => {
    setSelectedTankerId(tankerId);
    setActiveTab('liveMap');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tanker Fleet Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            48 municipal and contracted water tankers deployed across the city network.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tanker, driver..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="On Route">On Route</option>
            <option value="At Filling Station">At Filling Station</option>
            <option value="Delayed">Delayed</option>
            <option value="Route Deviation">Route Deviation</option>
            <option value="Available">Available</option>
          </select>
        </div>
      </div>

      {/* Tankers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tanker => {
          const waterPercent = Math.round((tanker.waterRemainingLiters / tanker.capacity) * 100);

          return (
            <div key={tanker.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{tanker.id}</span>
                  <span className="text-xs text-slate-400 font-mono">({tanker.licensePlate})</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  tanker.status === 'On Route' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                  tanker.status === 'Delayed' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  tanker.status === 'Route Deviation' ? 'text-red-700 bg-red-50 border-red-200' :
                  'text-sky-700 bg-sky-50 border-sky-200'
                }`}>
                  ● {tanker.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold text-slate-800">{tanker.driverName} ({tanker.driverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold text-slate-800">{tanker.destinationArea || 'Depot'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ETA / Speed:</span>
                  <span className="font-semibold text-slate-800">{tanker.etaMinutes ? `${tanker.etaMinutes} min` : 'Standby'} · {tanker.speedKmh} km/h</span>
                </div>
              </div>

              {/* Water level bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Water Cargo</span>
                  <span>{(tanker.waterRemainingLiters ?? tanker.currentWater ?? 0).toLocaleString()} / {(tanker.capacity ?? 10000).toLocaleString()} L ({waterPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: `${waterPercent}%` }}></div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleTrackTanker(tanker.id)}
                  className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Live GPS Tracking</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
