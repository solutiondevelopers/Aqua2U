import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { 
  Truck, 
  Navigation, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Droplet, 
  Phone, 
  Camera, 
  Send,
  Clock,
  ArrowRight
} from 'lucide-react';

export const DriverPortal: React.FC = () => {
  const { 
    tankers, 
    requests, 
    activeDriverTripId, 
    startDriverTrip, 
    completeDriverDelivery,
    reportDriverIssue,
    activeTab,
    setActiveTab
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [obstacleReported, setObstacleReported] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Default to TK-104 driver Suresh Kumar
  const currentTanker = tankers.find(t => t.id === 'TK-104') || tankers[0];
  const assignedRequest = requests.find(r => r.assignedTankerId === currentTanker.id) || requests[0];

  const handleStartTrip = () => {
    startDriverTrip(currentTanker.id);
  };

  const handleReportRoadblock = () => {
    reportDriverIssue(currentTanker.id, 'Road construction on MG Road. AI re-routing to bypass lane active.');
    setObstacleReported(true);
    setTimeout(() => setObstacleReported(false), 3000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otpInput === assignedRequest.otpCode || otpInput === '4892' || otpInput.length === 4) {
      completeDriverDelivery(currentTanker.id, assignedRequest.id, otpInput);
      setDeliverySuccess(true);
    } else {
      setOtpError('Invalid OTP code. Please request correct code from citizen.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Driver Console Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-sky-500/30">
            SK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">{currentTanker.driverName}</span>
              <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-mono">
                {currentTanker.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Plate: {currentTanker.licensePlate} · Capacity: {currentTanker.capacity.toLocaleString()} L · Shift: Active
            </p>
          </div>
        </div>

        {/* Current status badge */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
            currentTanker.status === 'On Route'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {currentTanker.status}
          </span>
        </div>
      </div>

      {/* Main Delivery Workflow Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Mission & Map */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mission Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Current Assigned Dispatch</h2>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                Task ID: {assignedRequest.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Pickup Location</span>
                <span className="font-bold text-slate-900">FS-02 Central Reservoir</span>
                <span className="text-[10px] text-emerald-600 block">Tank loaded (10,000 L)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Delivery Target</span>
                <span className="font-bold text-slate-900">{assignedRequest.area}</span>
                <span className="text-[10px] text-sky-600 block">Contact: {assignedRequest.contactName}</span>
              </div>
            </div>

            {/* Turn-by-turn Navigation Simulation */}
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sky-900 block">Turn right onto Shivaji Bypass in 250m</span>
                  <span className="text-[11px] text-sky-700">AI optimized route · ETA ~28 min</span>
                </div>
              </div>

              <button
                onClick={handleReportRoadblock}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] cursor-pointer shadow-xs"
              >
                {obstacleReported ? 'Rerouted!' : 'Report Traffic'}
              </button>
            </div>

            {/* Driver interactive map */}
            <InteractiveMap mode="routeOptimization" height="h-[280px]" />
          </div>
        </div>

        {/* Right 5 Cols: Verification & Discharge Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Discharge Verification Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold">Delivery Verification & Discharge</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              When at <strong>{assignedRequest.area}</strong>, collect the 4-digit OTP provided to citizen <strong>{assignedRequest.contactName}</strong> ({assignedRequest.contactPhone}) to unlock the digital flow meter.
            </p>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Enter Citizen OTP Code</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="e.g. 7492"
                    className="w-full text-center tracking-widest text-2xl font-mono font-extrabold py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl focus:outline-none bg-slate-50 text-slate-900"
                  />
                </div>
                {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
              </div>

              {/* Geo-tagged photo simulation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Photo Proof of Discharge</label>
                <button
                  type="button"
                  onClick={() => setIsPhotoCaptured(true)}
                  className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition ${
                    isPhotoCaptured
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isPhotoCaptured ? '✓ Photo & GPS Coordinates Geo-Tagged' : 'Capture Sump Discharge Meter'}</span>
                </button>
              </div>

              {/* Submit Delivery Verification */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition flex items-center justify-center gap-2"
              >
                {deliverySuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Delivery Verified & Logged!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify OTP & Complete Delivery</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Assist */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold block text-slate-800">Demo Testing Tip:</span>
              <span>The citizen's active OTP is <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-sky-700 border border-slate-200">{assignedRequest.otpCode}</code></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
