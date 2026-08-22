import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { 
  Download, 
  Scale, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  PieChart,
  Users,
  Droplet
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { equityData, setActiveTab, setSelectedRequestId, generateAIRecommendation } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [reallocationAccepted, setReallocationAccepted] = useState(false);

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleApplyReallocation = () => {
    setReallocationAccepted(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Download Button (Screen 4 exact match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Water Equity Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fair distribution across 230 city areas — equity over proximity
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{downloadSuccess ? 'Report Generated (PDF)' : 'Download Report'}</span>
        </button>
      </div>

      {/* Yellow Alert Banner (Screen 4 exact match) */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 block">
              12 areas currently below minimum service level
            </span>
            <span className="text-xs text-amber-800 font-medium">
              2 critical · 7 high · 3 medium — reallocation recommended within 2 hours
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('emergency')}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition whitespace-nowrap"
        >
          View Areas
        </button>
      </div>

      {/* Main Grid: City Equity Map on Left + Equity Index/AI Reallocation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: City Equity Map */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">City Equity Map</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Well-served
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Under-served
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical shortage
              </span>
            </div>
          </div>

          <InteractiveMap mode="equity" height="h-[360px]" />
        </div>

        {/* Right Column: Equity Index & Reallocation Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Equity Index Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Equity Index</h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                ● 78 / 100
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>

            <p className="text-[11px] text-slate-500">
              Balanced across 230 areas · improved 6% this quarter
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                <span className="font-bold text-emerald-800 block text-sm">68</span>
                <span className="text-[10px] text-emerald-600">well-served</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                <span className="font-bold text-amber-800 block text-sm">150</span>
                <span className="text-[10px] text-amber-600">under-served</span>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-2">
                <span className="font-bold text-red-800 block text-sm">12</span>
                <span className="text-[10px] text-red-600">critical</span>
              </div>
            </div>
          </div>

          {/* AI Reallocation Suggestion Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sky-700">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold text-slate-900">AI Reallocation Suggestion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reallocate 2 tankers from Kamla Park to Railway Quarters to lift 2 areas above minimum service level.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {reallocationAccepted ? (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold w-full text-center">
                  Reallocation Plan Queued!
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApplyReallocation}
                    className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    Review
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Skip
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Areas below service level Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Areas below service level</h3>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                ● 12
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-800 font-medium">Railway Quarters</span>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  ● 5 days
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-800 font-medium">Indira Colony</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  ● 4 days
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-800 font-medium">Sector 12</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  ● 2 days
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('requests')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 pt-1 block cursor-pointer"
            >
              View all 12 areas →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: 4 Data Visualizer Cards (Screen 4 exact match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Water received per area (Bar chart) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Water received per area</h4>
          <div className="h-28 flex items-end justify-between gap-2 pt-2 px-2 border-b border-slate-100">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-sky-500 rounded-t" style={{ height: '45px' }}></div>
              <span className="text-[9px] text-slate-500">SJ</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-sky-500 rounded-t" style={{ height: '38px' }}></div>
              <span className="text-[9px] text-slate-500">IN</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-sky-500 rounded-t" style={{ height: '32px' }}></div>
              <span className="text-[9px] text-slate-500">GN</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-amber-500 rounded-t" style={{ height: '22px' }}></div>
              <span className="text-[9px] text-slate-500">RQ</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-emerald-600 rounded-t" style={{ height: '70px' }}></div>
              <span className="text-[9px] text-slate-500">KP</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full bg-sky-500 rounded-t" style={{ height: '52px' }}></div>
              <span className="text-[9px] text-slate-500">S2</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center">Volume in 1,000s Liters (Last 7 Days)</p>
        </div>

        {/* Card 2: Population vs water received */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900">Population vs water</h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-600"></span> Pop</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Water</span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Shivaji Nagar</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="bg-sky-600 rounded" style={{ width: '60%' }}></div>
                <div className="bg-emerald-600 rounded" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Indira Colony</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="bg-sky-600 rounded" style={{ width: '45%' }}></div>
                <div className="bg-emerald-600 rounded" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Railway Qtrs</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="bg-sky-600 rounded" style={{ width: '85%' }}></div>
                <div className="bg-rose-500 rounded" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Kamla Park</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="bg-sky-600 rounded" style={{ width: '30%' }}></div>
                <div className="bg-emerald-600 rounded" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Days since last delivery */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900">Days since last delivery</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Railway Qtrs</span>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">● 5 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Indira Colony</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">● 4 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Shivaji Nagar</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">● 3 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Sector 12</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">● 2 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-800">Kamla Park</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">● 1 day</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tanker distribution by area */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Tanker distribution by area</h4>
          {/* Segmented bar */}
          <div className="flex h-3 rounded-full overflow-hidden w-full gap-0.5">
            <div className="bg-sky-600" style={{ width: '34%' }}></div>
            <div className="bg-teal-600" style={{ width: '26%' }}></div>
            <div className="bg-amber-500" style={{ width: '23%' }}></div>
            <div className="bg-slate-400" style={{ width: '17%' }}></div>
          </div>

          <div className="space-y-1 text-xs pt-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span> Zone A · North
              </span>
              <span className="font-bold text-slate-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span> Zone B · East
              </span>
              <span className="font-bold text-slate-900">9</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Zone C · West
              </span>
              <span className="font-bold text-slate-900">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Zone D · South
              </span>
              <span className="font-bold text-slate-900">6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
