import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { Tanker, TankerStatus } from '../types';
import { 
  Search, 
  Filter, 
  Truck, 
  Phone, 
  MessageSquare, 
  Navigation, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Droplet,
  Send,
  X
} from 'lucide-react';

export const LiveMapView: React.FC = () => {
  const { 
    tankers, 
    selectedTankerId, 
    setSelectedTankerId, 
    setActiveTab, 
    isSimulating 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [driverMessage, setDriverMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const selectedTanker = tankers.find(t => t.id === selectedTankerId) || tankers[0];

  const filteredTankers = tankers.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.destinationArea && t.destinationArea.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!driverMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageModalOpen(false);
      setDriverMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title & Filters Row (Screen 3 exact match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Tanker Tracking</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            48 tankers active across the city · updated {isSimulating ? 'just now' : 'paused'}
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tanker ID, driver, area..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
          >
            <option value="All">Status: All</option>
            <option value="On Route">On Route</option>
            <option value="At Filling Station">At Filling Station</option>
            <option value="Delayed">Delayed</option>
            <option value="Route Deviation">Route Deviation</option>
            <option value="Offline">Offline</option>
            <option value="Available">Available</option>
          </select>
        </div>
      </div>

      {/* Status Legend Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> On Route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> At Filling Station
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Delayed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Route Deviation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Offline
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
          Click any tanker marker to inspect telemetry
        </span>
      </div>

      {/* Main Map Container with Floating Detail Card */}
      <div className="relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <InteractiveMap
          mode="liveMap"
          height="h-[520px]"
          selectedTankerId={selectedTankerId}
          onSelectTanker={(tId) => setSelectedTankerId(tId)}
          showDeviationAlert={true}
        />

        {/* Floating Tanker Card Popup (Screen 3 exact match) */}
        {selectedTanker && (
          <div className="absolute top-4 right-4 w-80 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-xl z-20 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Header with status pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">{selectedTanker.id}</span>
                <span className="text-xs text-slate-400 font-mono">({selectedTanker.licensePlate})</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedTanker.status === 'On Route'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : selectedTanker.status === 'Delayed'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : selectedTanker.status === 'Route Deviation'
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-blue-700 bg-blue-50 border-blue-200'
                }`}
              >
                ● {selectedTanker.status}
              </span>
            </div>

            {/* Driver Profile */}
            <div className="flex items-center gap-3 mt-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center border border-sky-200">
                {selectedTanker.driverName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{selectedTanker.driverName}</span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  Driver · {selectedTanker.driverPhone}
                </span>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="divide-y divide-slate-100 text-xs mt-1">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Destination</span>
                <span className="font-semibold text-slate-900">{selectedTanker.destinationArea || 'Standby Depot'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">ETA</span>
                <span className="font-semibold text-slate-900">{selectedTanker.etaMinutes ? `${selectedTanker.etaMinutes} min` : 'N/A'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Capacity</span>
                <span className="font-semibold text-slate-900">{selectedTanker.capacity.toLocaleString()} L</span>
              </div>
            </div>

            {/* Water Remaining Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Water remaining</span>
                <span className="font-bold text-slate-800">
                  {(selectedTanker.waterRemainingLiters ?? selectedTanker.currentWater ?? 0).toLocaleString()} L / {(selectedTanker.capacity ?? 10000).toLocaleString()} L
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((selectedTanker.waterRemainingLiters / selectedTanker.capacity) * 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => setMessageModalOpen(true)}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Message Driver</span>
              </button>
              <button
                onClick={() => setActiveTab('deliveries')}
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>View Route</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Driver Messaging Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Message Driver: {selectedTanker.driverName}</h3>
              </div>
              <button onClick={() => setMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600">
                Send urgent dispatch notification to driver console on <strong>{selectedTanker.id}</strong>:
              </p>
              <textarea
                rows={3}
                value={driverMessage}
                onChange={(e) => setDriverMessage(e.target.value)}
                placeholder="e.g. Please proceed via alternate bypass. Road blockage reported on MG Road."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-sky-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDriverMessage("Avoid Sector 12 junction - high traffic detected. Use East bypass.")}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer"
                >
                  Traffic Alert
                </button>
                <button
                  type="button"
                  onClick={() => setDriverMessage("Urgent request: Please expedite delivery to Shivaji Nagar.")}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer"
                >
                  Expedite Delivery
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setMessageModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {messageSent ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Driver</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
