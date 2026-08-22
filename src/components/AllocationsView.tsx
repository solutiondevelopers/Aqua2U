import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  Sparkles, 
  Droplet, 
  Clock, 
  Users, 
  Heart, 
  MapPin, 
  Truck, 
  ChevronRight, 
  ShieldCheck, 
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';

export const AllocationsView: React.FC = () => {
  const {
    requests,
    tankers,
    currentRecommendation,
    selectedRequestId,
    setSelectedRequestId,
    generateAIRecommendation,
    approveAllocation,
    chooseAlternativeTanker,
    setActiveTab
  } = useApp();

  const [isChoosingTanker, setIsChoosingTanker] = useState(false);
  const [allocationSuccess, setAllocationSuccess] = useState(false);

  const currentReq = requests.find(r => r.id === selectedRequestId) || requests[0];
  const rec = currentRecommendation;

  const handleRequestChange = (reqId: string) => {
    setSelectedRequestId(reqId);
    generateAIRecommendation(reqId);
    setAllocationSuccess(false);
  };

  const handleApprove = () => {
    approveAllocation(currentReq.id, rec.recommendedTankerId);
    setAllocationSuccess(true);
    setTimeout(() => {
      setActiveTab('deliveries');
    }, 1200);
  };

  const handleSelectAlternative = (tId: string) => {
    chooseAlternativeTanker(tId);
    setIsChoosingTanker(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Request Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Allocation Recommendation</h1>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              Confidence {rec.confidenceScore}%
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Transparent decision support for {currentReq.id} · {currentReq.area}
          </p>
        </div>

        {/* Switch Request Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Evaluate Request:</span>
          <select
            value={currentReq.id}
            onChange={(e) => handleRequestChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer shadow-xs"
          >
            {requests.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.area} ({r.priority})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendation Flow Pipeline (Screen 5 exact match) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recommendation Pipeline</span>
          <span className="text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Transparent · Explainable AI
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-xs font-bold text-slate-800">Water Request</span>
            </div>
            <p className="text-[11px] text-slate-500">{currentReq.id} received</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-xs font-bold text-slate-800">Demand Location</span>
            </div>
            <p className="text-[11px] text-slate-500">{currentReq.area.split('(')[0].trim()}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span className="text-xs font-bold text-teal-900">Priority Score</span>
            </div>
            <p className="text-[11px] text-teal-700 font-semibold">{rec.priorityScore}/100 · {currentReq.priority}</p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                4
              </div>
              <span className="text-xs font-bold text-slate-800">Best Filling Point</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">{rec.recommendedStationName || rec.recommendedStationId}</p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                5
              </div>
              <span className="text-xs font-bold text-slate-800">Route & ETA</span>
            </div>
            <p className="text-[11px] text-slate-500">{rec.etaMinutes} min ETA ({rec.distanceKm} km)</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: 6 Factor Cards on Left + Recommended Assignment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: What the AI Considered */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">What the AI considered</h3>
            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-0.5 rounded-full shadow-xs">
              6 key factors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Factor 1: Demand */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Current demand</span>
                <span className="text-lg font-bold text-slate-900">{currentReq.quantity.toLocaleString()} L</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Requested quantity</span>
              </div>
            </div>

            {/* Factor 2: Days since delivery */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Days since delivery</span>
                <span className="text-lg font-bold text-slate-900">{currentReq.daysSinceLastDelivery} days</span>
                <span className="text-[11px] text-amber-700 block mt-0.5 font-medium">Supply gap active</span>
              </div>
            </div>

            {/* Factor 3: Population */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Population affected</span>
                <span className="text-lg font-bold text-slate-900">{currentReq.population.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Citizens in need</span>
              </div>
            </div>

            {/* Factor 4: Vulnerability */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Vulnerability index</span>
                <span className="text-lg font-bold text-rose-600">{currentReq.vulnerability}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Elderly & healthcare</span>
              </div>
            </div>

            {/* Factor 5: Distance */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Best Filling Point</span>
                <span className="text-lg font-bold text-slate-900 truncate block">{rec.recommendedStationName || rec.recommendedStationId}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{rec.distanceKm} km from demand</span>
              </div>
            </div>

            {/* Factor 6: Tanker Availability */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Optimal tanker</span>
                <span className="text-lg font-bold text-slate-900">{rec.recommendedTankerId}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">Ready for dispatch</span>
              </div>
            </div>
          </div>

          {/* AI Decision Rationale Card */}
          <div className="bg-teal-50/60 border border-teal-200 rounded-3xl p-5 flex items-start gap-3.5 shadow-xs">
            <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-teal-900">AI Fairness & Allocation Rationale</h4>
              <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                {currentReq.area} has been prioritized because the {currentReq.daysSinceLastDelivery}-day supply deficit and high density of {currentReq.population} residents exceeds standard water equity thresholds. Dispatching {rec.recommendedTankerId} from {rec.recommendedStationName || rec.recommendedStationId} ({rec.distanceKm} km) balances turnaround speed without starving adjacent Ward zones.
              </p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Recommended Assignment Card (Screen 5 exact match) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommended Assignment</h3>
              <p className="text-xs text-slate-500 mt-0.5">Suggested by AI · human approval required</p>
            </div>

            {/* Priority Score Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Priority score</span>
                <span className="font-bold text-teal-800">{rec.priorityScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${rec.priorityScore}%` }}
                ></div>
              </div>
            </div>

            {/* Tanker Highlight Card */}
            <div className="bg-teal-50/50 border border-teal-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900">{rec.recommendedTankerId}</span>
                  <p className="text-xs text-slate-500">{currentReq.quantity.toLocaleString()} L capacity</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 border border-teal-300/70 px-2.5 py-0.5 rounded-full">
                ● Available
              </span>
            </div>

            {/* Metrics List */}
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Filling Station</span>
                <span className="font-semibold text-slate-900 truncate max-w-[170px] text-right">{rec.recommendedStationName || rec.recommendedStationId}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Distance</span>
                <span className="font-semibold text-slate-900">{rec.distanceKm} km</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Destination</span>
                <span className="font-semibold text-slate-900">{currentReq.area}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500">Optimized ETA</span>
                <span className="font-bold text-teal-800">{rec.etaMinutes} min (-{rec.savingsMinutes || 8} min saved)</span>
              </div>
            </div>

            {/* Why This Tanker Box */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Why this tanker</span>
              <p className="text-xs text-amber-800 font-medium mt-1">
                {rec.whyThisTanker}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-100">
            {allocationSuccess ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Allocation Approved! Routing Tanker...
              </div>
            ) : (
              <>
                <button
                  onClick={handleApprove}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/20 active:scale-[0.98] cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Allocation</span>
                </button>

                <button
                  onClick={() => setIsChoosingTanker(!isChoosingTanker)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
                >
                  Choose Another Tanker
                </button>
              </>
            )}

            {/* Alternative Tankers Drawer */}
            {isChoosingTanker && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
                <span className="text-[11px] font-bold text-slate-700 block">Select from Available Fleet:</span>
                {tankers.filter(t => t.id !== rec.recommendedTankerId && t.status !== 'Offline').slice(0, 3).map(alt => (
                  <div
                    key={alt.id}
                    onClick={() => handleSelectAlternative(alt.id)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{alt.id}</span>
                      <span className="text-slate-500 ml-2">({alt.capacity.toLocaleString()} L)</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700">Select</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
