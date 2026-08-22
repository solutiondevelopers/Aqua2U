import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Droplet, 
  Truck, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  X,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface WelcomeActionBannerProps {
  onOpenNewRequest?: () => void;
  onDismiss: () => void;
}

export const WelcomeActionBanner: React.FC<WelcomeActionBannerProps> = ({ 
  onOpenNewRequest,
  onDismiss 
}) => {
  const { userRole, setActiveTab } = useApp();

  return (
    <div className="mb-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs relative">
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        title="Dismiss welcome card"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-1">
          <Droplet className="w-3.5 h-3.5 fill-teal-700" />
          <span>Welcome to Jal-Setu AI</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          What would you like to do?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-5">
          Select an immediate action below or explore your dedicated portal dashboard.
        </p>

        {/* Role: CITIZEN */}
        {userRole === 'citizen' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('requestWater');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-[#0F2942] hover:bg-[#153a5c] text-white font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">Request Water Tanker</span>
                <span className="text-[11px] text-slate-300 font-normal">Submit a new water delivery requirement</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => {
                setActiveTab('trackTanker');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">Track Tanker ETA</span>
                <span className="text-[11px] text-slate-500 font-normal">View live location and arrival time</span>
              </div>
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 ml-2" />
            </button>
          </div>
        )}

        {/* Role: DRIVER */}
        {userRole === 'driver' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('myAssignment');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-[#0F2942] hover:bg-[#153a5c] text-white font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">View My Assignment</span>
                <span className="text-[11px] text-slate-300 font-normal">Check assigned tanker TK-104 & destination</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => {
                setActiveTab('navigation');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">Start Route Navigation</span>
                <span className="text-[11px] text-slate-500 font-normal">Open turn-by-turn route to delivery ward</span>
              </div>
              <Compass className="w-4 h-4 text-teal-700 shrink-0 ml-2" />
            </button>
          </div>
        )}

        {/* Role: OPERATOR */}
        {userRole === 'operator' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('tankerQueue');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-[#0F2942] hover:bg-[#153a5c] text-white font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">View Today's Tanker Queue</span>
                <span className="text-[11px] text-slate-300 font-normal">Manage vehicles queued at refilling bays</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => {
                setActiveTab('waterAvailability');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">Check Reservoir Storage & Quality</span>
                <span className="text-[11px] text-slate-500 font-normal">Monitor station tank level and pH/TDS telemetry</span>
              </div>
              <Droplet className="w-4 h-4 text-teal-700 shrink-0 ml-2" />
            </button>
          </div>
        )}

        {/* Role: AUTHORITY / ADMIN */}
        {userRole === 'admin' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('requests');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-[#0F2942] hover:bg-[#153a5c] text-white font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">View Priority Requests</span>
                <span className="text-[11px] text-slate-300 font-normal">4 critical ward shortage requests awaiting dispatch</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => {
                setActiveTab('liveMap');
                onDismiss();
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer text-left"
            >
              <div>
                <span className="block text-sm font-bold">Open City Live Map</span>
                <span className="text-[11px] text-slate-500 font-normal">48 tankers and 11 filling stations live telemetry</span>
              </div>
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
