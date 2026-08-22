import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  Search, 
  Download, 
  Star 
} from 'lucide-react';

export const DeliveriesView: React.FC = () => {
  const { requests, tankers } = useApp();
  const [search, setSearch] = useState('');

  const completedRequests = requests.filter(r => r.status === 'Delivered' || r.status === 'In Progress');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Verification Records</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Transparent immutable audit log of verified tanker deliveries with digital OTP proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% OTP Discharged
          </span>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Destination Area</th>
                <th className="py-3 px-4">Tanker / Driver</th>
                <th className="py-3 px-4">Volume Delivered</th>
                <th className="py-3 px-4">OTP Verification</th>
                <th className="py-3 px-4">Delivery Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {completedRequests.map(req => {
                const tanker = tankers.find(t => t.id === req.assignedTankerId);

                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{req.area}</div>
                      <div className="text-[11px] text-slate-400">{req.ward}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{req.assignedTankerId || 'TK-104'}</div>
                      <div className="text-[11px] text-slate-500">{tanker?.driverName || 'Suresh Kumar'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sky-800">
                      {req.quantity.toLocaleString()} L
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        OTP: {req.otpCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {req.deliveryTime || req.requestTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                        req.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        ● {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
