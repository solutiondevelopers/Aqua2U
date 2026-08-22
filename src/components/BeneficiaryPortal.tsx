import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  AlertTriangle, 
  FileText, 
  Send,
  Truck,
  Users,
  MapPin,
  Sparkles,
  Key
} from 'lucide-react';

export const BeneficiaryPortal: React.FC = () => {
  const { requests, tankers, addNewRequest, activeTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'quota' | 'newRequest' | 'tracking'>('quota');

  React.useEffect(() => {
    if (activeTab === 'beneficiaryRequest') {
      setActiveSubTab('newRequest');
    } else if (activeTab === 'beneficiaryHistory') {
      setActiveSubTab('tracking');
    } else if (activeTab === 'beneficiaryDashboard') {
      setActiveSubTab('quota');
    }
  }, [activeTab]);

  // Institution profile
  const [beneficiaryType, setBeneficiaryType] = useState<'Hospital' | 'School' | 'Slum Cluster' | 'Welfare Shelter'>('Hospital');
  const [institutionName, setInstitutionName] = useState('Sassoon General Hospital (Govt)');
  const [rationCardNumber, setRationCardNumber] = useState('RC-MH-PUN-89210');
  const [ward, setWard] = useState('Ward 14 - Central');
  const [quotaUsedLiters, setQuotaUsedLiters] = useState(38000);
  const [monthlyQuotaLiters, setMonthlyQuotaLiters] = useState(120000);

  // New Subsidized Request Form
  const [reqQuantity, setReqQuantity] = useState(15000);
  const [urgencyReason, setUrgencyReason] = useState('ICU and Dialysis Wing reserves dropped below 15%');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleCreateBeneficiaryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addNewRequest({
      area: ward,
      ward: ward,
      quantity: reqQuantity,
      population: 1800,
      priority: 'Critical',
      requestType: beneficiaryType === 'Hospital' ? 'Hospital' : beneficiaryType === 'School' ? 'School / College' : 'Slum / Informal Settlement',
      urgencyReason: urgencyReason,
      contactName: institutionName,
      contactPhone: '+91 98210 55443',
      isEmergency: true
    });
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setActiveSubTab('quota');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Beneficiary Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2942] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                Subsidized Welfare & Institutional Beneficiary Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {institutionName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Priority emergency water quota for critical public healthcare, schools, and welfare settlements with digital verification.
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-1 sm:w-72">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Welfare ID:</span>
              <span className="font-mono font-bold text-white">{rationCardNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Subsidy Status:</span>
              <span className="font-bold text-emerald-400">100% PMC Subsidized</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Priority Rating:</span>
              <span className="font-bold text-teal-300">Priority Grade A (Emergency)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('quota')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
            activeSubTab === 'quota'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Quota & Allocation Health
        </button>
        <button
          onClick={() => setActiveSubTab('newRequest')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
            activeSubTab === 'newRequest'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          + Request Institutional Tanker
        </button>
      </div>

      {/* Quota View */}
      {activeSubTab === 'quota' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Monthly Quota Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Monthly Subsidized Quota</span>
              <Droplet className="w-4 h-4 text-teal-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">
                {(monthlyQuotaLiters - quotaUsedLiters).toLocaleString()} L
              </div>
              <p className="text-xs text-slate-500">Remaining out of {monthlyQuotaLiters.toLocaleString()} L</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-teal-600 h-full rounded-full transition-all"
                style={{ width: `${(quotaUsedLiters / monthlyQuotaLiters) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Verification & Audit</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Govt Institutional Certification Active</span>
              </div>
              <p className="text-xs text-slate-500">
                Authorized for zero-cost rapid municipal dispatches during heat waves and dry spells.
              </p>
            </div>
          </div>

          {/* Active Dispatches */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Today's Deliveries</span>
              <Truck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">1 Tanker In Transit</div>
              <p className="text-xs text-slate-500">Tanker TK-104 arriving in ~12 mins with 10,000L</p>
            </div>
          </div>

        </div>
      )}

      {/* New Institutional Request */}
      {activeSubTab === 'newRequest' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Submit Subsidized Welfare Water Request
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Institutional requests bypass standard queue and receive instant AI priority dispatch.
          </p>

          {successNotice && (
            <div className="p-4 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Request transmitted directly to Municipal Emergency Dispatch Queue!</span>
            </div>
          )}

          <form onSubmit={handleCreateBeneficiaryRequest} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Beneficiary Type</label>
              <select
                value={beneficiaryType}
                onChange={(e) => setBeneficiaryType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800"
              >
                <option value="Hospital">Hospital / Healthcare Facility</option>
                <option value="School">Public School / Anganwadi</option>
                <option value="Slum Cluster">Slum Community / Informal Settlement</option>
                <option value="Welfare Shelter">Shelter / Old Age Home</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Required Quantity (Liters)</label>
              <input
                type="number"
                step={1000}
                value={reqQuantity}
                onChange={(e) => setReqQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Urgency Justification</label>
              <textarea
                rows={3}
                value={urgencyReason}
                onChange={(e) => setUrgencyReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-teal-600/20 transition"
            >
              Submit Urgent Subsidized Request
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
