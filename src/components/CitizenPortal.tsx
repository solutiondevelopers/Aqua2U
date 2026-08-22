/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { CitizenRequestForm } from './CitizenRequestForm';
import { 
  Droplet, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Truck, 
  AlertCircle, 
  MessageSquare, 
  Star, 
  ShieldCheck,
  Send,
  Building2,
  Sparkles,
  Phone,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  Eye
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const { 
    requests, 
    citizenActiveRequestId, 
    setCitizenActiveRequestId, 
    submitCitizenComplaint, 
    confirmCitizenReceipt,
    citizenSubmitMoreInfo,
    tankers,
    activeTab,
    setActiveTab
  } = useApp();
  
  // Complaint Form state
  const [complaintType, setComplaintType] = useState<'Delayed Tanker' | 'Water Quality' | 'Inadequate Quantity' | 'Driver Conduct'>('Delayed Tanker');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Delivery confirmation rating
  const [rating, setRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // More Info submission state
  const [moreInfoInput, setMoreInfoInput] = useState('');
  const [moreInfoSubmitted, setMoreInfoSubmitted] = useState(false);

  // Filter requests belonging to this citizen / resident area (Sunita Gaikwad or Shivaji Nagar or newly created)
  const citizenRequests = requests.filter(r => 
    r.contactName?.toLowerCase().includes('sunita') || 
    r.area?.toLowerCase().includes('shivaji') ||
    r.id === citizenActiveRequestId
  );
  
  const currentRequest = requests.find(r => r.id === citizenActiveRequestId) || citizenRequests[0] || requests[0];
  const assignedTanker = tankers.find(t => t.id === currentRequest?.assignedTankerId);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim() || !currentRequest) return;
    submitCitizenComplaint({
      area: currentRequest.area,
      citizenName: currentRequest.contactName || 'Sunita Gaikwad',
      phone: currentRequest.contactPhone || '+91 98210 44321',
      tankerId: currentRequest.assignedTankerId || 'TK-104',
      issueType: complaintType,
      description: complaintDesc
    });
    setComplaintSuccess(true);
    setTimeout(() => {
      setComplaintSuccess(false);
      setComplaintDesc('');
      setActiveTab('home');
    }, 1500);
  };

  const handleConfirmDelivery = () => {
    if (currentRequest) {
      confirmCitizenReceipt(currentRequest.id, rating);
      setRatingSubmitted(true);
    }
  };

  const handleSendMoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest || !moreInfoInput.trim()) return;
    citizenSubmitMoreInfo(currentRequest.id, moreInfoInput.trim());
    setMoreInfoSubmitted(true);
    setTimeout(() => {
      setMoreInfoSubmitted(false);
      setMoreInfoInput('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Citizen Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Droplet className="w-4 h-4 fill-sky-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">Citizen Water Beneficiary Portal</span>
              <p className="text-slate-400 text-xs mt-0.5">
                Pune Municipal Water Tanker Tracking & Verified Beneficiary Services
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex-wrap">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === 'home' || activeTab === 'trackTanker' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            Track Tanker
          </button>
          <button
            onClick={() => setActiveTab('requestWater')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === 'requestWater' || activeTab === 'newRequest' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            + Request Tanker
          </button>
          <button
            onClick={() => setActiveTab('myRequests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === 'myRequests' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            My Applications ({citizenRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === 'complaints' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            Grievance
          </button>
        </div>
      </div>

      {/* Render based on activeTab */}
      {(activeTab === 'home' || activeTab === 'trackTanker') && currentRequest && (
        <div className="space-y-6">
          {/* Active Request Status Lifecycle Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  Active Water Application Status
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {currentRequest.area} ({currentRequest.ward})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Application ID: <span className="font-mono font-semibold text-slate-800">{currentRequest.id}</span> · Quantity: <span className="font-semibold text-slate-800">{currentRequest.quantity.toLocaleString()} L</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  currentRequest.adminStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                  currentRequest.adminStatus === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-300' :
                  currentRequest.adminStatus === 'Information Requested' ? 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse' :
                  currentRequest.status === 'Dispatched' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                  currentRequest.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                  'bg-sky-50 text-sky-800 border border-sky-300'
                }`}>
                  Status: {currentRequest.adminStatus ? `${currentRequest.adminStatus} (${currentRequest.status})` : currentRequest.status}
                </span>
              </div>
            </div>

            {/* Information Requested Callout (if admin requested more info) */}
            {currentRequest.adminStatus === 'Information Requested' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <FileQuestion className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Municipal Authority Requested Clarification:
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 italic">
                      "{currentRequest.moreInfoNotes || 'Please provide additional clarification on the current sump capacity and storage availability.'}"
                    </p>
                  </div>
                </div>

                {moreInfoSubmitted ? (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Response sent to Municipal Review Officer!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMoreInfo} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter response details (e.g. Sump is 10,000L, completely dry since yesterday)..."
                      value={moreInfoInput}
                      onChange={(e) => setMoreInfoInput(e.target.value)}
                      className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
                    >
                      Submit Clarification
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Key Delivery Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4">
                <span className="text-[11px] font-bold text-sky-800 uppercase">Assigned Water Tanker</span>
                <div className="flex items-center gap-2 mt-2">
                  <Truck className="w-5 h-5 text-sky-800" />
                  <span className="text-sm font-bold text-slate-900">
                    {assignedTanker?.id || currentRequest.assignedTankerId || 'In Review / Allocation Queue'}
                  </span>
                </div>
                {assignedTanker && (
                  <span className="text-xs text-slate-600 block mt-1">
                    Driver: {assignedTanker.driverName} ({assignedTanker.driverPhone})
                  </span>
                )}
              </div>

              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
                <span className="text-[11px] font-bold text-amber-800 uppercase">Estimated Arrival (ETA)</span>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span className="text-base font-bold text-slate-900">
                    {currentRequest.eta || '14 Minutes'}
                  </span>
                </div>
                <span className="text-xs text-slate-600 block mt-1">Live GPS Route Optimized</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Beneficiary Delivery OTP</span>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span className="text-xl font-mono font-extrabold text-emerald-900 tracking-wider">
                    {currentRequest.otp || '4892'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 block mt-1">Provide OTP to tanker driver upon water discharge</span>
              </div>
            </div>

            {/* Live Transit Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Live Municipal Tanker Transit Route</span>
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live GPS Connected</span>
                </span>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
                <InteractiveMap />
              </div>
            </div>

            {/* Verification of Delivery Card */}
            {currentRequest.status === 'Delivered' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">Water Tanker Discharged Successfully</h4>
                      <p className="text-xs text-slate-600">Please confirm receipt and rate delivery satisfaction.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleConfirmDelivery}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    {ratingSubmitted ? 'Feedback Recorded ✓' : 'Confirm Delivery & Submit Rating'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REQUEST WATER TAB */}
      {(activeTab === 'requestWater' || activeTab === 'newRequest') && (
        <div className="space-y-4">
          <CitizenRequestForm
            onSuccess={() => {
              setActiveTab('myRequests');
            }}
          />
        </div>
      )}

      {/* MY APPLICATIONS TAB */}
      {activeTab === 'myRequests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Water Demand Applications</h3>
              <p className="text-xs text-slate-500">
                Official records registered under your profile
              </p>
            </div>
            <span className="text-xs bg-sky-50 text-sky-800 font-bold px-3 py-1 rounded-full border border-sky-200">
              {citizenRequests.length} Applications
            </span>
          </div>

          <div className="space-y-3">
            {citizenRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active water requests found. Click "+ Request Tanker" to submit a new application.
              </div>
            ) : (
              citizenRequests.map(req => (
                <div 
                  key={req.id} 
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                    req.id === currentRequest?.id ? 'border-sky-500 bg-sky-50/20' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{req.area}</span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">({req.id})</span>
                      {req.requestType && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          {req.requestType}
                        </span>
                      )}
                      {req.isEmergency && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-200">
                          Emergency: {req.emergencyType || 'Shortage'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      {req.address || req.urgencyReason}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5 flex-wrap">
                      <span>Volume: <b className="text-slate-800">{req.quantity.toLocaleString()} L</b></span>
                      <span>Ward: <b className="text-slate-800">{req.ward}</b></span>
                      <span>Delivery OTP: <b className="text-emerald-700 font-mono">{req.otp || '4892'}</b></span>
                      {req.gpsCaptured && (
                        <span className="text-slate-400">
                          GPS Verified (±{req.gpsCaptured.accuracyM}m)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.adminStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      req.adminStatus === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      req.adminStatus === 'Information Requested' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      req.status === 'Dispatched' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      req.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}>
                      {req.adminStatus || req.status}
                    </span>

                    <button
                      onClick={() => {
                        setCitizenActiveRequestId(req.id);
                        setActiveTab('home');
                      }}
                      className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      <span>Track Live</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* COMPLAINTS / GRIEVANCE TAB */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">File Grievance / Report Water Supply Issue</h3>
            <p className="text-xs text-slate-500">
              Report delays, water quality concerns, or driver conduct directly to municipal inspectors.
            </p>
          </div>

          {complaintSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Grievance Ticket Registered Successfully!</h4>
              <p className="text-xs text-emerald-700">Reference ID: #GRV-8821. Municipal inspector assigned.</p>
            </div>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Issue Category</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Delayed Tanker">Delayed Tanker / Overdue ETA</option>
                  <option value="Water Quality">Water Quality / Contamination Concern</option>
                  <option value="Inadequate Quantity">Inadequate Quantity Delivered</option>
                  <option value="Driver Conduct">Driver Conduct / Service Issue</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe the issue with timestamps, location, or tanker ID..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Official Grievance Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
