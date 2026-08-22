import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { 
  Zap, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Navigation, 
  ShieldCheck, 
  Truck, 
  ArrowRight 
} from 'lucide-react';

export const RouteOptimizationView: React.FC = () => {
  const { userRole, setUserRole, setActiveTab, startDriverTrip } = useApp();
  const [routeAccepted, setRouteAccepted] = useState(false);
  const [showingAlternative, setShowingAlternative] = useState(false);

  const handleAcceptRoute = () => {
    setRouteAccepted(true);
    startDriverTrip('TK-104');
  };

  const handleLaunchDriverMode = () => {
    setUserRole('driver');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Route Optimization</h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              AI Optimized
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            TK-104 · Filling Station FS-02 → Shivaji Nagar Settlement
          </p>
        </div>

        <button
          onClick={handleLaunchDriverMode}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold cursor-pointer transition"
        >
          <Truck className="w-4 h-4 text-sky-600" />
          <span>Switch to Driver Navigation View</span>
        </button>
      </div>

      {/* Light Green AI Savings Banner (Screen 2 exact match) */}
      <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-4 flex items-center gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 fill-emerald-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-900 block">
            AI optimized route saves approximately 12 minutes
          </span>
          <span className="text-xs text-emerald-700">
            Compared to the standard route via MG Road due to dynamic traffic re-routing and bypass lane usage.
          </span>
        </div>
      </div>

      {/* Main Grid: Map on Left + Route Metrics & Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optimized Route Map */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Optimized Route Map</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Current route
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Alternative
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Road blockage
              </span>
            </div>
          </div>

          <InteractiveMap mode="routeOptimization" height="h-[430px]" />
        </div>

        {/* Right Column: Route Metrics & Timeline */}
        <div className="lg:col-span-4 space-y-4">
          {/* Route Metrics Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Route Metrics</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Distance</span>
                <span className="font-bold text-slate-900 text-sm">8.4 km</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Estimated time</span>
                <span className="font-bold text-slate-900 text-sm">28 min</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Traffic condition</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  ● Moderate
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Road blockage</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ● None
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Alternative route</span>
                <span className="text-xs font-bold text-amber-700">+9 min</span>
              </div>
            </div>
          </div>

          {/* Route Timeline Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Route Timeline</h3>
            <div className="space-y-3 text-xs">
              {/* Point 1 */}
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mt-1 shrink-0"></div>
                <div>
                  <span className="font-bold text-slate-900">08:10 · Pickup at FS-02</span>
                  <p className="text-slate-500 text-[11px]">Loading 10,000 L</p>
                </div>
              </div>
              {/* Point 2 */}
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mt-1 shrink-0"></div>
                <div>
                  <span className="font-bold text-slate-900">08:22 · Loaded</span>
                  <p className="text-slate-500 text-[11px]">Tank full · 10,000 L</p>
                </div>
              </div>
              {/* Point 3 */}
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0 ring-4 ring-emerald-100"></div>
                <div>
                  <span className="font-bold text-emerald-900">08:30 · En route</span>
                  <p className="text-emerald-700 text-[11px] font-medium">AI-optimized path active</p>
                </div>
              </div>
              {/* Point 4 */}
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1 shrink-0"></div>
                <div>
                  <span className="font-bold text-slate-700">08:58 · Delivery</span>
                  <p className="text-slate-400 text-[11px]">Shivaji Nagar Settlement</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              {routeAccepted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Route Dispatched to Driver Suresh Kumar!
                </div>
              ) : (
                <button
                  onClick={handleAcceptRoute}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm shadow-sky-600/20 cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept Route</span>
                </button>
              )}

              <button
                onClick={() => setShowingAlternative(!showingAlternative)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition"
              >
                {showingAlternative ? 'Hide Alternative' : 'View Alternative'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
