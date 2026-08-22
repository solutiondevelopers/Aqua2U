import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { WaterRequest } from '../types';
import { 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  Truck, 
  FileText, 
  Users, 
  Droplet, 
  Clock, 
  CheckCircle,
  Radio,
  X
} from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const { 
    requests, 
    tankers, 
    stations, 
    dispatchNearestEmergencyTanker, 
    escalateToControlRoom, 
    setActiveTab, 
    setSelectedRequestId, 
    generateAIRecommendation 
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [isSopOpen, setIsSopOpen] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const emergencyRequests = requests.filter(r => r.isEmergency);
  const criticalCount = emergencyRequests.filter(r => r.priority === 'Critical').length;
  const highCount = emergencyRequests.filter(r => r.priority === 'High').length;
  const mediumCount = emergencyRequests.filter(r => r.priority === 'Medium').length;

  const filtered = emergencyRequests.filter(r => {
    if (severityFilter === 'All') return true;
    return r.priority === severityFilter;
  });

  const handleDispatch = (req: WaterRequest) => {
    dispatchNearestEmergencyTanker(req.id);
    setDispatchAlert(`Emergency Unit Dispatched to ${req.area}! Real-time tracking activated.`);
    setTimeout(() => setDispatchAlert(null), 3000);
  };

  const handleViewDetails = (req: WaterRequest) => {
    setSelectedRequestId(req.id);
    generateAIRecommendation(req.id);
    setActiveTab('allocations');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Emergency SOP Button (Screen 1 exact match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Emergency Response</h1>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              {emergencyRequests.length} active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Triage and dispatch resources during water crises
          </p>
        </div>

        <button
          onClick={() => setIsSopOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-xs"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Emergency SOP</span>
        </button>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSeverityFilter('All')}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
            severityFilter === 'All'
              ? 'bg-sky-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All {emergencyRequests.length}
        </button>
        <button
          onClick={() => setSeverityFilter('Critical')}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
            severityFilter === 'Critical'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
          }`}
        >
          Critical {criticalCount}
        </button>
        <button
          onClick={() => setSeverityFilter('High')}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
            severityFilter === 'High'
              ? 'bg-amber-500 text-white'
              : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
          }`}
        >
          High {highCount}
        </button>
        <button
          onClick={() => setSeverityFilter('Medium')}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
            severityFilter === 'Medium'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Medium {mediumCount}
        </button>
      </div>

      {/* Alert toast */}
      {dispatchAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Main Grid: Emergency Queue on Left (8 cols) + Map/Availability on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Emergency Request Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Emergency Request Queue</h2>
            <span className="text-xs text-slate-400">Sorted by severity · oldest first</span>
          </div>

          <div className="space-y-3">
            {filtered.map(req => {
              const isAllocated = req.status === 'Allocated' || req.status === 'In Progress';
              const allocatedTanker = tankers.find(t => t.id === req.assignedTankerId);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs hover:shadow-sm transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          req.priority === 'Critical'
                            ? 'text-red-700 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        ● {req.priority}
                      </span>
                      <span className="font-bold text-slate-900 text-base">{req.area}</span>
                      <span className="text-xs text-slate-400">{req.requestTime}</span>
                    </div>

                    {/* Status note on right */}
                    <div className="text-xs font-medium">
                      {isAllocated ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {req.assignedTankerId} assigned · {req.status === 'In Progress' ? 'en route' : 'filling'}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          No tanker allocated yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {req.population.toLocaleString()} people affected
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Droplet className="w-3.5 h-3.5 text-sky-600" />
                      {req.quantity.toLocaleString()} L requested
                    </span>
                    <span className="text-slate-400">
                      Gap: {req.daysSinceLastDelivery} days
                    </span>
                  </div>

                  {req.urgencyReason && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {req.urgencyReason}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleDispatch(req)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Tanker</span>
                    </button>
                    <button
                      onClick={() => handleViewDetails(req)}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Critical Shortage Map + Resource Availability (Screen 1 exact match) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Critical Shortage Map Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Critical Shortage Map</h3>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                ● 2 zones
              </span>
            </div>

            <InteractiveMap mode="emergency" height="h-[180px]" />
          </div>

          {/* Resource Availability Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Resource Availability</h3>

            {/* Metric 1: Tankers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Available tankers</span>
                <span className="font-bold text-slate-900">6 / 48</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: '12.5%' }}></div>
              </div>
            </div>

            {/* Metric 2: Water stock */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Water stock</span>
                <span className="font-bold text-slate-900">1.2M L</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            {/* Metric 3: Operators on duty */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Operators on duty</span>
                <span className="font-bold text-slate-900">14 / 20</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* Emergency Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleDispatch(emergencyRequests[0])}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/20 cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>Dispatch Nearest Tanker</span>
              </button>
              <button
                onClick={() => escalateToControlRoom('CRISIS-DISASTER-01')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 text-slate-500" />
                <span>Escalate to Control Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency SOP Modal */}
      {isSopOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">Municipal Emergency Water SOP</h3>
              </div>
              <button onClick={() => setIsSopOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900">
                <strong>Protocol Level 3 Activation:</strong> Critical supply gap exceeding 72 hours triggers mandatory priority tanker reassignment from commercial depots to slum clusters and health outposts.
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Phase 1 (0-15 min):</strong> Triage AI allocation recommendations; verify minimum 50 LPCD threshold.</li>
                <li><strong>Phase 2 (15-30 min):</strong> Mobilize auxiliary reserve tankers from FS-02 intake depot.</li>
                <li><strong>Phase 3 (30-60 min):</strong> Establish community distribution points with local ward marshals.</li>
                <li><strong>Phase 4:</strong> Digital OTP or geo-tagged photo verification upon discharge.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSopOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
              >
                Close SOP Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
