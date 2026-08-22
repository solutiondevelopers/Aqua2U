import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintTicket } from '../types';
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Search, 
  ShieldCheck,
  Send,
  Phone
} from 'lucide-react';

export const ComplaintsView: React.FC = () => {
  const { complaints, resolveComplaint } = useApp();
  const [filter, setFilter] = useState<'All' | 'Open' | 'Investigating' | 'Resolved'>('All');
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(complaints[0] || null);

  const filtered = complaints.filter(c => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Grievances & Quality Desk</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            AI-assisted triage of community reports regarding delays, water quality, and driver compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Open', 'Investigating', 'Resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                filter === f ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Grievance List on Left + AI Resolution Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Grievances Table */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`bg-white rounded-2xl border p-4.5 cursor-pointer transition space-y-2.5 ${
                selectedTicket?.id === ticket.id
                  ? 'border-sky-500 shadow-sm ring-1 ring-sky-500/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs font-mono">{ticket.id}</span>
                  <span className="text-xs font-bold text-slate-800">· {ticket.area}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ticket.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-200' :
                  ticket.status === 'Investigating' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  ● {ticket.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium">{ticket.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                <span>By: {ticket.citizenName} ({ticket.phone})</span>
                <span>Ref: Tanker {ticket.tankerId} · {ticket.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 5 Cols: AI Resolution Panel */}
        <div className="lg:col-span-5">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">AI Triage & Action Recommendation</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{selectedTicket.id}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reported Issue</span>
                  <p className="font-semibold text-slate-900">{selectedTicket.issueType}</p>
                  <p className="text-slate-600">{selectedTicket.description}</p>
                </div>

                <div className="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1 text-sky-950">
                  <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-600" /> AI Root Cause Analysis
                  </span>
                  <p className="text-xs leading-relaxed">{selectedTicket.aiResolutionSuggestion}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {selectedTicket.status !== 'Resolved' ? (
                  <button
                    onClick={() => resolveComplaint(selectedTicket.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve AI Resolution & Notify Citizen</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Complaint Successfully Resolved & Archived
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
              Select a complaint ticket to inspect AI triage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
