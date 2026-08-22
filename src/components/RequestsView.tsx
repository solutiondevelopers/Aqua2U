/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WaterRequest } from '../types';
import { 
  Download, 
  Plus, 
  Search, 
  Sparkles, 
  Eye, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  Droplet, 
  Building2, 
  ShieldAlert, 
  Camera, 
  ChevronRight, 
  X, 
  AlertTriangle,
  FileQuestion,
  Check,
  Send,
  Navigation
} from 'lucide-react';

interface RequestsViewProps {
  onOpenNewRequest: () => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({ onOpenNewRequest }) => {
  const { 
    requests, 
    setSelectedRequestId, 
    generateAIRecommendation, 
    setActiveTab,
    adminApproveRequest,
    adminRejectRequest,
    adminRequestMoreInfo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Selected request for Admin Review Detail Modal/Drawer
  const [reviewRequest, setReviewRequest] = useState<WaterRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Rejection & More Info sub-dialog states
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('Piped municipal supply scheduled for restoration today.');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoQuestion, setInfoQuestion] = useState('Please clarify community sump storage capacity and provide current meter reading.');

  // Zoom photo modal
  const [zoomedPhotoUrl, setZoomedPhotoUrl] = useState<string | null>(null);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    setAreaFilter('All');
    setStatusFilter('All');
    setAdminStatusFilter('All');
  };

  const filteredRequests = requests.filter(req => {
    const matchSearch = searchQuery === '' || 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.contactName && req.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.requestType && req.requestType.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchPriority = priorityFilter === 'All' || req.priority === priorityFilter;
    const matchArea = areaFilter === 'All' || req.area.toLowerCase().includes(areaFilter.toLowerCase());
    const matchStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchAdminStatus = adminStatusFilter === 'All' || 
      (adminStatusFilter === 'Pending' && (!req.adminStatus || req.adminStatus === 'Pending')) ||
      req.adminStatus === adminStatusFilter;

    return matchSearch && matchPriority && matchArea && matchStatus && matchAdminStatus;
  });

  const handleOpenReview = (req: WaterRequest) => {
    setReviewRequest(req);
    setAdminNotes(req.adminNotes || '');
    setActionFeedback(null);
    setShowRejectDialog(false);
    setShowInfoDialog(false);
  };

  const handleApproveAction = () => {
    if (!reviewRequest) return;
    adminApproveRequest(reviewRequest.id, adminNotes || 'Approved based on algorithmic priority criteria and validated emergency shortage.');
    setActionFeedback({
      type: 'success',
      message: `Request ${reviewRequest.id} Approved. Queued for AI Allocation & Tanker Dispatch.`
    });
    
    // Update local modal state
    setReviewRequest(prev => prev ? {
      ...prev,
      adminStatus: 'Approved',
      adminReviewedBy: 'PMC Officer Desai (Zone 1)',
      adminReviewedAt: new Date().toLocaleTimeString(),
      adminNotes: adminNotes || 'Approved based on algorithmic priority criteria.'
    } : null);

    setTimeout(() => {
      setSelectedRequestId(reviewRequest.id);
      generateAIRecommendation(reviewRequest.id);
      setActiveTab('allocations');
    }, 1200);
  };

  const handleRejectAction = () => {
    if (!reviewRequest) return;
    adminRejectRequest(reviewRequest.id, rejectReason);
    setActionFeedback({
      type: 'success',
      message: `Request ${reviewRequest.id} rejected. Reason logged in audit registry.`
    });
    setShowRejectDialog(false);
    setReviewRequest(prev => prev ? {
      ...prev,
      adminStatus: 'Rejected',
      adminReviewedBy: 'PMC Officer Desai (Zone 1)',
      adminReviewedAt: new Date().toLocaleTimeString(),
      adminNotes: `Rejected: ${rejectReason}`
    } : null);
  };

  const handleRequestInfoAction = () => {
    if (!reviewRequest) return;
    adminRequestMoreInfo(reviewRequest.id, infoQuestion);
    setActionFeedback({
      type: 'success',
      message: `Information request transmitted to citizen applicant for ${reviewRequest.id}.`
    });
    setShowInfoDialog(false);
    setReviewRequest(prev => prev ? {
      ...prev,
      adminStatus: 'Information Requested',
      moreInfoNotes: infoQuestion,
      adminReviewedBy: 'PMC Officer Desai (Zone 1)',
      adminReviewedAt: new Date().toLocaleTimeString()
    } : null);
  };

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Water Requests & Administrative Review</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {requests.length} total applications · {requests.filter(r => r.adminStatus === 'Pending' || !r.adminStatus).length} pending municipal review
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{exportSuccess ? 'Exported CSV ✓' : 'Export Data'}</span>
          </button>
          <button
            onClick={onOpenNewRequest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold cursor-pointer transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Water Request</span>
          </button>
        </div>
      </div>

      {/* Filter Row & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Area, Beneficiary, or Request Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">Priority: All</option>
              <option value="Critical">Critical (71-100)</option>
              <option value="High">High (51-70)</option>
              <option value="Medium">Medium (31-50)</option>
              <option value="Normal">Normal (0-30)</option>
            </select>

            {/* Admin Review Status Filter */}
            <select
              value={adminStatusFilter}
              onChange={(e) => setAdminStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">Admin Review: All</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Information Requested">Info Requested</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All">Dispatch: All</option>
              <option value="Pending Allocation">Pending Allocation</option>
              <option value="Allocated">Allocated</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="On Hold">On Hold</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 px-2 py-1 cursor-pointer transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Beneficiary & Area</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Water Quantity</th>
                <th className="py-3 px-4">Priority Score (AI)</th>
                <th className="py-3 px-4">Admin Review</th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-normal">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No requests found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isApproved = req.adminStatus === 'Approved';
                  const isRejected = req.adminStatus === 'Rejected';
                  const isInfoReq = req.adminStatus === 'Information Requested';
                  const isPendingReview = !req.adminStatus || req.adminStatus === 'Pending';
                  const score = req.priorityScore ?? 75;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition">
                      {/* ID & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{req.id}</div>
                        <div className="text-[10px] text-slate-400">{req.requestTime || 'Recent'}</div>
                      </td>

                      {/* Beneficiary & Area */}
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{req.area}</span>
                          {req.isEmergency && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Emergency Flagged"></span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {req.ward} · {req.contactName || 'Resident'} ({req.population?.toLocaleString() || '1,000'} people)
                        </div>
                      </td>

                      {/* Request Type */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {req.requestType || 'Residential'}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {req.quantity.toLocaleString()} L
                      </td>

                      {/* Priority Score (0–100) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                            req.priority === 'Critical' || score >= 71 ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                            req.priority === 'High' || score >= 51 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            req.priority === 'Medium' || score >= 31 ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              score >= 71 ? 'bg-rose-600' : score >= 51 ? 'bg-amber-600' : 'bg-sky-600'
                            }`}></span>
                            {score}/100 ({req.priority?.toUpperCase() || 'HIGH'})
                          </span>
                        </div>
                      </td>

                      {/* Admin Review Status */}
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Approved
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                            <X className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : isInfoReq ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                            <FileQuestion className="w-3 h-3" />
                            Info Requested
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Evidence Photo */}
                      <td className="py-3.5 px-4">
                        {req.evidencePhotoUrl ? (
                          <button
                            type="button"
                            onClick={() => setZoomedPhotoUrl(req.evidencePhotoUrl!)}
                            className="relative w-10 h-8 rounded-lg overflow-hidden border border-slate-300 hover:opacity-80 transition cursor-pointer group"
                            title="Click to zoom evidence"
                          >
                            <img
                              src={req.evidencePhotoUrl}
                              alt="Evidence thumbnail"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                              <Eye className="w-3 h-3" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No photo</span>
                        )}
                      </td>

                      {/* Review Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReview(req)}
                          className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-xs inline-flex items-center gap-1"
                        >
                          <span>Review & Decide</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="py-3 px-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredRequests.length} of {requests.length} requests</span>
          <div className="flex items-center gap-1">
            <span className="px-2 py-1 text-slate-400">Authority: Pune Municipal Corporation (Water Dept)</span>
          </div>
        </div>
      </div>

      {/* ADMIN REVIEW MODAL / DECISION WORKFLOW DRAWER */}
      {reviewRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-800 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Municipal Water Request Review · <span className="font-mono text-sky-800">{reviewRequest.id}</span>
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      reviewRequest.adminStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      reviewRequest.adminStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      reviewRequest.adminStatus === 'Information Requested' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {reviewRequest.adminStatus || 'Pending Decision'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Decision Support Platform · Municipal Admin retains final authorization authority
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReviewRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{actionFeedback.message}</span>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              {/* TOP AI DECISION SUPPORT PANEL */}
              <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                    <div>
                      <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                        AI Fairness & Priority Evaluation
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Computed Score: <span className="font-mono text-sky-300 text-base">{reviewRequest.priorityScore ?? 75}/100</span> ({reviewRequest.priority?.toUpperCase() || 'HIGH'})
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-300 block">Forecast Confidence: <b>92% (High)</b></span>
                    <span className="text-[10px] text-slate-400">Equity Weight: 30% · Vulnerability: 40%</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (reviewRequest.priorityScore ?? 75) >= 71 ? 'bg-rose-500' :
                        (reviewRequest.priorityScore ?? 75) >= 51 ? 'bg-amber-500' :
                        'bg-sky-500'
                      }`}
                      style={{ width: `${reviewRequest.priorityScore ?? 75}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 (LOW)</span>
                    <span>30</span>
                    <span>50 (MED)</span>
                    <span>70 (HIGH)</span>
                    <span>100 (CRITICAL)</span>
                  </div>
                </div>

                {/* Algorithmic Reasons & Explainability */}
                <div className="bg-sky-900/40 border border-sky-700/50 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-200 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Algorithmic Allocation Recommendation:</span>
                  </div>
                  <p className="text-slate-100 text-xs italic font-medium">
                    "{reviewRequest.aiRecommendation || 'Recommend immediate dispatch of 10,000L tanker from nearby Parvati Filling Station.'}"
                  </p>

                  <div className="pt-2 border-t border-sky-800/40 space-y-1">
                    <span className="text-[11px] font-bold text-sky-300">Why this request received this priority score:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {reviewRequest.aiReasons && reviewRequest.aiReasons.length > 0 ? (
                        reviewRequest.aiReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))
                      ) : (
                        <>
                          <li>Critical shortage detected in high-density beneficiary sector</li>
                          <li>Current water duration less than 2 hours with zero alternative backup</li>
                          <li>No municipal tanker received in &gt; 3 days</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* CITIZEN / INSTITUTION SUBMITTED APPLICATION DATA GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section 1 Data Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold">
                    <Building2 className="w-4 h-4 text-sky-700" />
                    <span>SECTION 1 — Beneficiary & Location Details</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Request Type:</span>
                      <span className="font-bold text-slate-800">
                        {reviewRequest.requestType || 'Residential Society'}
                        {reviewRequest.otherRequestType && ` (${reviewRequest.otherRequestType})`}
                      </span>
                    </div>

                    {reviewRequest.requestType === 'Hospital' && (
                      <>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Hospital ID & Name:</span>
                          <span className="font-bold text-sky-900 text-right">
                            {reviewRequest.hospitalId ? `[${reviewRequest.hospitalId}] ` : ''}{reviewRequest.hospitalName || reviewRequest.area}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Hospital Classification:</span>
                          <span className="font-semibold text-slate-800">
                            {reviewRequest.hospitalType || 'Government'} Hospital ({reviewRequest.totalBeds || reviewRequest.population} Inpatient Beds)
                          </span>
                        </div>
                      </>
                    )}

                    {reviewRequest.requestType === 'School / College' && (
                      <>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Institution Name:</span>
                          <span className="font-bold text-sky-900 text-right">
                            {reviewRequest.schoolName || reviewRequest.area}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Operational Status Today:</span>
                          <span className="font-semibold text-slate-800">
                            {reviewRequest.isSchoolOpenToday !== false ? 'Open Today' : 'Closed Today'} ({reviewRequest.studentsPresentToday || reviewRequest.population} Students Present)
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Area & Ward:</span>
                      <span className="font-semibold text-slate-800">{reviewRequest.area} ({reviewRequest.ward})</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Address / Landmark:</span>
                      <span className="text-slate-800 text-right max-w-xs">{reviewRequest.address || reviewRequest.area}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">GPS Auto-Capture:</span>
                      <span className="font-mono text-slate-800 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-600" />
                        {reviewRequest.gpsCaptured ? (
                          <span>{reviewRequest.gpsCaptured.lat}, {reviewRequest.gpsCaptured.lng} (±{reviewRequest.gpsCaptured.accuracyM}m)</span>
                        ) : (
                          <span>18.5314, 73.8446 (Verified)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Authorized Contact:</span>
                      <span className="font-semibold text-slate-800">{reviewRequest.contactName || 'Authorized Representative'} ({reviewRequest.contactPhone || '+91 98201 99882'})</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 Data Card: Dynamic by Request Type */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold">
                    <Droplet className="w-4 h-4 text-sky-700" />
                    <span>
                      {reviewRequest.requestType === 'Hospital' ? 'SECTION 2 & 3 — Hospital Water & Critical Care Metrics' :
                       reviewRequest.requestType === 'School / College' ? 'SECTION 2 & 3 — School Water & Sanitation Metrics' :
                       'SECTION 2 — Water Status & Shortage Metrics'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* If Hospital */}
                    {reviewRequest.requestType === 'Hospital' ? (
                      <>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Storage vs Current Water:</span>
                          <span className="font-bold text-slate-900">
                            {reviewRequest.currentWaterAvailableLiters?.toLocaleString() || '8,000'} L / {reviewRequest.waterStorageCapacityLiters?.toLocaleString() || '100,000'} L
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Current Water Availability:</span>
                          <span className="font-bold text-rose-700">{reviewRequest.waterAvailability || 'Less than 10%'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Duration Water Will Last:</span>
                          <span className="font-semibold text-amber-800">{reviewRequest.waterLastDuration || 'Less than 2 Hours'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Critical Care Emergency:</span>
                          <span className="font-bold text-rose-700">{reviewRequest.hospitalEmergencyType || 'ICU Requirement'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Total Bed Capacity:</span>
                          <span className="font-semibold text-slate-900">{reviewRequest.totalBeds || 300} Inpatient Beds</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Last Tanker Delivery:</span>
                          <span className="text-slate-800 font-medium">{reviewRequest.lastDelivery || '2 Days Ago'}</span>
                        </div>
                      </>
                    ) : reviewRequest.requestType === 'School / College' ? (
                      <>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Storage vs Current Water:</span>
                          <span className="font-bold text-slate-900">
                            {reviewRequest.currentWaterAvailableLiters?.toLocaleString() || '2,500'} L / {reviewRequest.waterStorageCapacityLiters?.toLocaleString() || '30,000'} L
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Water Availability:</span>
                          <span className="font-bold text-rose-700">{reviewRequest.waterAvailability || 'Less than 10%'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Mid-Day Meal Program:</span>
                          <span className="font-bold text-sky-800">{reviewRequest.isMidDayMealRunning === 'Yes' ? 'Running Today (Requires Water)' : 'No'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Toilet Functionality:</span>
                          <span className={`font-bold ${reviewRequest.areToiletsFunctional === 'No' ? 'text-rose-700' : 'text-amber-700'}`}>
                            {reviewRequest.areToiletsFunctional === 'No' ? 'Non-Functional (Hazard)' : reviewRequest.areToiletsFunctional || 'Partially Functional'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Urgent Requirement Focus:</span>
                          <span className="font-semibold text-slate-900">{reviewRequest.schoolUrgentRequirementType || 'Drinking Water & Toilets'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Last Tanker Delivery:</span>
                          <span className="text-slate-800 font-medium">{reviewRequest.lastDelivery || '2 Days Ago'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Water Availability:</span>
                          <span className="font-bold text-rose-700">{reviewRequest.waterAvailability || 'No Water (0%)'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Duration Water Will Last:</span>
                          <span className="font-semibold text-amber-800">{reviewRequest.waterLastDuration || 'Less than 2 Hours'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Piped Supply Status:</span>
                          <span className="text-slate-800">{reviewRequest.waterSupplyStatus || 'Completely Stopped'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">People Affected:</span>
                          <span className="font-bold text-slate-900">{reviewRequest.population.toLocaleString()} Residents</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Alternative Water Source:</span>
                          <span className="text-slate-800">{reviewRequest.alternativeSource || 'No Alternative'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Last Tanker Delivery:</span>
                          <span className="text-slate-800 font-medium">{reviewRequest.lastDelivery || 'More than 3 Days Ago'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* EMERGENCY STATUS & EVIDENCE PHOTO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Camera className="w-4 h-4 text-sky-700" />
                    <span>Uploaded Shortage Evidence & Emergency Context</span>
                  </div>

                  {reviewRequest.isEmergency && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>EMERGENCY: {reviewRequest.emergencyType || 'Shortage'}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <p className="text-slate-600">
                      <b>Applicant Urgency Note:</b> {reviewRequest.urgencyReason || 'Community water storage tank is empty. Medical clinic and nearby elderly residents require immediate supply.'}
                    </p>
                    {reviewRequest.moreInfoNotes && (
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                        <span className="font-bold block text-[11px]">Latest Admin Clarification Thread:</span>
                        <span className="italic">{reviewRequest.moreInfoNotes}</span>
                      </div>
                    )}
                  </div>

                  {reviewRequest.evidencePhotoUrl && (
                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={() => setZoomedPhotoUrl(reviewRequest.evidencePhotoUrl!)}
                        className="w-full h-24 rounded-xl overflow-hidden border border-slate-300 relative group cursor-pointer"
                      >
                        <img
                          src={reviewRequest.evidencePhotoUrl}
                          alt="Shortage evidence"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Inspect Full Size</span>
                        </div>
                      </button>
                      <span className="text-[10px] text-slate-400 block text-center mt-1">Geotagged Photo Attached</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ADMIN DECISION & REVIEW ACTIONS */}
              <div className="bg-slate-100 rounded-2xl border border-slate-300 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Admin Approval & Decision Registry
                  </h4>
                  {reviewRequest.adminReviewedBy && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Reviewed by <b>{reviewRequest.adminReviewedBy}</b> at {reviewRequest.adminReviewedAt}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Official Municipal Review Notes (Audit Log)</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter approval justification, operational notes, or dispatch instructions..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  />
                </div>

                {/* Sub-dialog for Reject */}
                {showRejectDialog && (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 space-y-2 animate-in fade-in">
                    <span className="text-xs font-bold text-rose-900">Specify Formal Reason for Rejection:</span>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-white border border-rose-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowRejectDialog(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRejectAction}
                        className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-dialog for Request More Information */}
                {showInfoDialog && (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-2 animate-in fade-in">
                    <span className="text-xs font-bold text-amber-900">Question / Clarification to Citizen:</span>
                    <input
                      type="text"
                      value={infoQuestion}
                      onChange={(e) => setInfoQuestion(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowInfoDialog(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestInfoAction}
                        className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        Transmit Question
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectDialog(true)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reject Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowInfoDialog(true)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Request More Info</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleApproveAction}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Dispatch Allocation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL PHOTO ZOOM LIGHTBOX */}
      {zoomedPhotoUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-3 bg-slate-800 flex items-center justify-between text-white text-xs font-bold">
              <span>Geotagged Shortage Evidence Verification</span>
              <button
                onClick={() => setZoomedPhotoUrl(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center p-2">
              <img
                src={zoomedPhotoUrl}
                alt="Zoomed evidence"
                className="max-h-[70vh] w-auto rounded-lg object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
