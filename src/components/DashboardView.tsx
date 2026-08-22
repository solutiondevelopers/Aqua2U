import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from './InteractiveMap';
import { 
  Plus, 
  Clock, 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle,
  Droplet,
  Droplets,
  Cpu,
  Building2,
  Users,
  Check,
  X,
  Eye,
  MessageSquare,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewRequest?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenNewRequest }) => {
  const { 
    requests, 
    tankers, 
    stations, 
    complaints,
    setActiveTab, 
    setSelectedRequestId, 
    approveAllocation,
    generateAIRecommendation,
    adminRejectRequest
  } = useApp();

  const { t } = useLanguage();

  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'map'>('overview');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Key Municipal Metrics
  const pendingRequests = requests.filter(r => r.status === 'Pending Allocation' || r.status === 'Under Review');
  const emergencyRequests = requests.filter(r => r.isEmergency && r.status !== 'Delivered');
  const activeTankers = tankers.filter(t => t.status === 'On Route' || t.status === 'At Filling Station');
  const completedDeliveries = requests.filter(r => r.status === 'Delivered').length;
  const totalVolumeRequested = requests.reduce((acc, r) => acc + (r.quantity || 0), 0);
  const totalVolumeDelivered = requests.filter(r => r.status === 'Delivered').reduce((acc, r) => acc + (r.quantity || 0), 0);

  const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'Investigating');

  const handleReviewRecommendation = (reqId: string) => {
    setSelectedRequestId(reqId);
    generateAIRecommendation(reqId);
    setActiveTab('allocations');
  };

  const handleQuickApprove = (reqId: string) => {
    approveAllocation(reqId);
  };

  const handleConfirmReject = (reqId: string) => {
    if (!rejectReason.trim()) return;
    adminRejectRequest(reqId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Row with Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('navDashboard', 'Municipal Dispatch Console')}
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              Admin Authority
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time municipal water distribution, AI dispatch allocations, fleet tracking, and ward telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-200/80 p-1 rounded-full flex items-center gap-1 border border-slate-300/60">
            <button
              onClick={() => setActiveTabSub('overview')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTabSub === 'overview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Control Grid
            </button>
            <button
              onClick={() => setActiveTabSub('map')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTabSub === 'map'
                  ? 'bg-[#0284C7] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Live GIS Map</span>
            </button>
          </div>

          <button
            onClick={onOpenNewRequest || (() => setActiveTab('requests'))}
            className="px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Water Request</span>
          </button>

          <button
            onClick={() => setActiveTab('allocations')}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-[0.98]"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Engine</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'map' ? (
        /* Live Operations Map Full Section */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Municipal Fleet & Ward Map</h2>
              <p className="text-xs text-slate-500">Real-time GPS tanker locations, filling stations, and emergency demand corridors</p>
            </div>
            <button
              onClick={() => setActiveTab('liveMap')}
              className="text-xs text-sky-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen Live Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <InteractiveMap mode="dashboard" height="h-[520px]" />
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ROW 1: TOP 4 MUNICIPAL ADMIN METRIC CARDS                                 */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Water Demand (Ocean Blue Featured) */}
            <div 
              onClick={() => setActiveTab('requests')}
              className="bg-[#0284C7] text-white p-5 rounded-2xl shadow-sm relative hover:bg-[#0369A1] transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-100">Total City Water Demand</span>
                <div className="w-8 h-8 rounded-full border border-sky-300/40 flex items-center justify-center text-white text-xs group-hover:bg-sky-800/40 transition">
                  <Droplet className="w-4 h-4 text-sky-100" />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white tracking-tight">{requests.length}</span>
                  <span className="text-xs font-bold text-sky-200">Requests</span>
                </div>
                <p className="text-[11px] font-semibold text-sky-100 mt-0.5">
                  {Math.round(totalVolumeRequested / 1000).toLocaleString()}k Liters Total Volume
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-sky-100 bg-[#0369A1] border border-sky-400/30 px-3 py-1.5 rounded-full">
                <span>Pending Dispatch</span>
                <span className="font-extrabold text-white bg-sky-500 px-2 py-0.5 rounded-full text-[10px]">
                  {pendingRequests.length} Pending
                </span>
              </div>
            </div>

            {/* Card 2: Active Tanker Fleet */}
            <div 
              onClick={() => setActiveTab('tankers')}
              className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Active GPS Tanker Fleet</span>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 text-xs group-hover:bg-slate-50 transition">
                  <Truck className="w-4 h-4 text-sky-600" />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{activeTankers.length} / {tankers.length}</span>
                  <span className="text-xs font-bold text-emerald-600">On Duty</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {tankers.filter(t => t.status === 'On Route').length} En Route | {tankers.filter(t => t.status === 'At Filling Station').length} At Refill Station
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <span>Fleet Capacity</span>
                <span className="font-extrabold text-slate-900">
                  {tankers.reduce((acc, t) => acc + (t.capacity || 0), 0).toLocaleString()} L
                </span>
              </div>
            </div>

            {/* Card 3: Emergency & Critical Dry Wards */}
            <div 
              onClick={() => setActiveTab('emergency')}
              className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Critical Dry Tap Alerts</span>
                <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-600 text-xs transition">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-red-600 tracking-tight">{emergencyRequests.length}</span>
                  <span className="text-xs font-bold text-red-700">Emergency Wards</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  High deficit areas requiring immediate priority dispatch
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Priority Level
                </span>
                <span>Urgent</span>
              </div>
            </div>

            {/* Card 4: OTP Verified Fulfillment */}
            <div 
              onClick={() => setActiveTab('deliveries')}
              className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">OTP Fulfillment Rate</span>
                <div className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-700 tracking-tight">98.4%</span>
                  <span className="text-xs font-bold text-emerald-600">Verified</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {completedDeliveries} Trips Fulfilled | {Math.round(totalVolumeDelivered / 1000).toLocaleString()}k Liters
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <span>Tamper Audit</span>
                <span className="font-extrabold text-emerald-900">100% Secure</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* ROW 2: PENDING AI ALLOCATION REQUESTS & LIVE DISPATCH TELEMETRY            */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1 (8 Cols): Pending Water Allocations requiring Admin Approval */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-600" />
                    <span>Pending Water Allocations (AI Priority Queue)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and approve AI recommended tanker dispatches for municipal wards
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('allocations')}
                  className="px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Engine Console</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pending Requests Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Req ID & Ward</th>
                      <th className="py-2.5 px-3">Priority Score</th>
                      <th className="py-2.5 px-3">Volume (L)</th>
                      <th className="py-2.5 px-3">Recommended Tanker</th>
                      <th className="py-2.5 px-3 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingRequests.slice(0, 5).map((req) => {
                      const priorityColor = (req.priorityScore || 75) >= 80 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : (req.priorityScore || 75) >= 60 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-sky-50 text-sky-800 border-sky-200';

                      const assignedTanker = tankers.find(t => t.id === req.assignedTankerId) || tankers[0];

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{req.id}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{req.ward || req.area}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${priorityColor}`}>
                              {req.isEmergency && <AlertTriangle className="w-3 h-3 text-red-600" />}
                              <span>{req.priorityScore || 75}/100</span>
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-xs font-bold text-slate-800">
                              {(req.quantity || 0).toLocaleString()} L
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900">{assignedTanker?.licensePlate || assignedTanker?.id || 'TK-104'}</span>
                                <span className="text-[10px] text-slate-400">{(assignedTanker?.capacity || 10000).toLocaleString()} L</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right">
                            {rejectingId === req.id ? (
                              <div className="flex items-center gap-1 justify-end">
                                <input 
                                  type="text" 
                                  placeholder="Reason..." 
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="text-[10px] border border-slate-300 rounded px-2 py-1 w-24"
                                />
                                <button 
                                  onClick={() => handleConfirmReject(req.id)}
                                  className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                                  title="Confirm Reject"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => setRejectingId(null)}
                                  className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleQuickApprove(req.id)}
                                  className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition active:scale-95"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Dispatch</span>
                                </button>

                                <button
                                  onClick={() => handleReviewRecommendation(req.id)}
                                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  title="Review AI Decision Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setRejectingId(req.id)}
                                  className="p-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 transition cursor-pointer"
                                  title="Reject Request"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pendingRequests.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                  All water requests are currently dispatched and allocated.
                </div>
              )}
            </div>

            {/* Column 2 (4 Cols): Filling Stations Telemetry & Water Reserves */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Municipal Filling Stations</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('waterSources')}
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Stations List */}
              <div className="space-y-3.5">
                {stations.map((station) => {
                  const currentVal = station.currentWater ?? station.currentStorageLiters ?? 80000;
                  const maxVal = station.capacityLiters ?? station.totalCapacity ?? 100000;
                  const percentage = Math.round((currentVal / maxVal) * 100);
                  const isLow = percentage < 30;

                  return (
                    <div key={station.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{station.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Station ID: {station.id}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isLow 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {percentage}% Capacity
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLow ? 'bg-red-500' : 'bg-sky-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                        <span>{currentVal.toLocaleString()} L available</span>
                        <span>Max: {Math.round(maxVal / 1000).toLocaleString()}k L</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* ROW 3: ACTIVE FLEET TELEMETRY & WARD GRIEVANCES                           */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column A (7 Cols): Active Tanker Dispatch Telemetry */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Active Tanker Telemetry</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('tankers')}
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Fleet View</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tankers.slice(0, 4).map((tanker) => {
                  const statusBg = tanker.status === 'On Route' 
                    ? 'bg-sky-50 text-sky-800 border-sky-200' 
                    : tanker.status === 'At Filling Station' 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200';

                  const assignedReq = requests.find(r => r.id === tanker.assignedRequestId);

                  return (
                    <div key={tanker.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{tanker.licensePlate || tanker.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg}`}>
                          {tanker.status}
                        </span>
                      </div>

                      <div className="text-[11px] space-y-1 text-slate-600">
                        <p className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>Driver: <strong className="text-slate-800">{tanker.driverName || 'Driver Assigned'}</strong></span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-600" />
                          <span>Capacity: <strong className="text-slate-800">{(tanker.capacity || 10000).toLocaleString()} L</strong></span>
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Zone: <strong className="text-slate-800">{tanker.destinationArea || 'Central Ward'}</strong></span>
                        </p>
                      </div>

                      {tanker.status === 'On Route' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-sky-700 bg-sky-50/60 p-2 rounded-xl">
                          <span>OTP Gatekeeper Active</span>
                          <span className="font-mono bg-sky-100 px-1.5 py-0.5 rounded text-sky-900">OTP: {assignedReq?.otpCode || '492018'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column B (5 Cols): Citizen Grievances & Dry Tap Escalations */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Citizen Complaints & Dry Tap Alerts</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Complaints Desk</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {openComplaints.slice(0, 3).map((comp) => (
                  <div key={comp.id} className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{comp.area}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {comp.priority || 'High'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug font-medium line-clamp-2">
                      "{comp.description}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
                      <span>Ref ID: {comp.id}</span>
                      <span>{comp.timeAgo || comp.timestamp || '10 mins ago'}</span>
                    </div>
                  </div>
                ))}

                {openComplaints.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No open dry tap complaints logged at this time.
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
