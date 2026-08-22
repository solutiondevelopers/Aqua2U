import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Droplets, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Truck, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  Bot,
  Zap,
  PhoneCall,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: (initialRole?: 'admin' | 'driver' | 'citizen' | 'operator', serviceMode?: 'government' | 'private') => void;
  onNavigateToRegister: (serviceMode?: 'government' | 'private') => void;
  onSelectServiceMode?: (mode: 'government' | 'private') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateToLogin, 
  onNavigateToRegister,
  onSelectServiceMode
}) => {
  const [searchQuery, setSearchQuery] = useState('Why did water supply drop in Ward 4?');
  const [activeTab, setActiveTab] = useState<'government' | 'private'>('government');
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0284C7] p-3 sm:p-6 md:p-10 lg:p-12 font-sans selection:bg-sky-200 selection:text-sky-900 flex flex-col items-center justify-center">
      
      {/* Outer Curved Tablet Container Frame (As in reference image) */}
      <div className="w-full max-w-[1440px] bg-[#FAF8F5] rounded-[28px] sm:rounded-[36px] md:rounded-[48px] border border-black/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* TOP HEADER / NAVBAR */}
        <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between">
          
          {/* Brand Logo Chip */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs cursor-pointer hover:border-sky-300 transition"
          >
            <div className="w-5 h-5 rounded-md bg-[#0284C7] flex items-center justify-center text-white shadow-2xs">
              <Droplets className="w-3 h-3 fill-white" />
            </div>
            <span className="font-extrabold text-xs text-slate-900 tracking-tight">AQUA2U</span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-500">
            <button 
              onClick={() => scrollToSection('portal-selection')}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              Product
            </button>
            <button 
              onClick={() => scrollToSection('solutions')}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              Solutions
            </button>
            <button 
              onClick={() => scrollToSection('customers')}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              Customers
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              Docs
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <LanguageSelector variant="landing" />
            
            <button
              onClick={() => onNavigateToLogin('citizen', 'government')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer hidden sm:block"
            >
              Sign in
            </button>
            <button
              onClick={() => onNavigateToLogin('admin', 'government')}
              className="px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
            >
              Get started
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="flex-1 px-6 sm:px-12 md:px-20 pt-10 pb-20">
          
          {/* Main Hero Headline (Water Tanker Management System Theme) */}
          <div className="text-center max-w-4xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              {t('landingTitle1', 'Smart Water Tanker Allocation')}
            </h1>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-400 leading-[1.08]">
              {t('landingTitle2', '& Distribution Management.')}
            </h2>

            {/* Subtitle */}
            <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium max-w-xl mx-auto pt-3 leading-relaxed">
              {t('landingSubtitle', 'AQUA2U reads your city water demand and tanker fleet metrics — delivering real-time AI allocation, turn-by-turn route optimization, live GPS tracking, and secure OTP delivery verification.')}
            </p>

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigateToLogin('admin', 'government')}
                className="px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer active:scale-95"
              >
                {t('landingLaunchBtn', 'Launch Municipal Platform')}
              </button>
              <button
                onClick={() => scrollToSection('portal-selection')}
                className="px-6 py-3 rounded-full bg-white/80 hover:bg-white text-slate-800 border border-slate-200/90 text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>{t('landingExploreBtn', 'Explore Portals')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* TRUSTED BY LOGO BAR */}
            <div className="pt-12 pb-6">
              <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.2em] uppercase mb-4">
                POWERING MUNICIPAL & PRIVATE WATER NETWORKS AT
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-serif italic text-sm sm:text-base opacity-70">
                <span>Pune Municipal</span>
                <span>Metro Water</span>
                <span>AquaCorp</span>
                <span>CityHydro</span>
                <span>Verano Supply</span>
              </div>
            </div>
          </div>

          {/* HERO INTERACTIVE PREVIEW MOCKUP CARD */}
          <div className="max-w-4xl mx-auto mt-6 bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 text-left">
            
            {/* Search Input Box */}
            <div className="relative flex items-center bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none placeholder-slate-400"
                placeholder="Ask any water dispatch or allocation question..."
              />
              <button 
                onClick={() => alert(`Analyzing: "${searchQuery}"`)}
                className="w-8 h-8 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shadow-xs shrink-0 cursor-pointer transition ml-2"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Answer Section with Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              
              {/* Left Answer Text */}
              <div className="md:col-span-7 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block mb-2">
                    MANAGEMENT AI ANALYSIS
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    Ward 4 deficit resolved: <span className="bg-[#E0F2FE] text-[#0284C7] font-extrabold px-2 py-0.5 rounded text-xs">18 Water Tankers</span> allocated via AI engine. On-time delivery rate at <span className="font-bold text-emerald-600">94.2%</span> verified via OTP across 12 feeder filling stations.
                  </p>
                </div>

                {/* Smooth Mini Area Chart */}
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <div className="relative h-28 w-full flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,60 Q 50,40 100,20 T 200,15 T 300,10 L 300,80 L 0,80 Z" 
                        fill="url(#blueGrad)" 
                      />
                      <path 
                        d="M 0,60 Q 50,40 100,20 T 200,15 T 300,10" 
                        fill="none" 
                        stroke="#0284C7" 
                        strokeWidth="2.5" 
                      />
                      {/* Highlight Dot */}
                      <circle cx="200" cy="15" r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>

                    {/* Tooltip callout */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0d0d12] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                      On-Time Fulfillment: 94.2%
                    </div>
                  </div>

                  {/* X Axis Months */}
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mt-2">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span className="text-[#0284C7]">JUN</span>
                    <span>JUL</span>
                  </div>
                </div>
              </div>

              {/* Right Cards Column */}
              <div className="md:col-span-5 space-y-4">
                
                {/* Metric Card 1 */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-semibold">Active Tanker Fleet</span>
                    <span className="text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full text-[10px]">
                      GPS Active
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    142<span className="text-xs font-bold text-slate-400 ml-1">Vehicles</span>
                  </div>
                  {/* Mini Sparkline */}
                  <div className="mt-2 h-6 w-full">
                    <svg className="w-full h-full" viewBox="0 0 100 20">
                      <path d="M0,15 Q25,10 50,8 T100,3" fill="none" stroke="#0284C7" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-semibold">OTP Delivery Success</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      +8.4%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    98.6<span className="text-base font-bold text-slate-400">%</span>
                  </div>
                  {/* Mini Sparkline Green */}
                  <div className="mt-2 h-6 w-full">
                    <svg className="w-full h-full" viewBox="0 0 100 20">
                      <path d="M0,15 Q25,18 50,10 T100,4" fill="none" stroke="#10B981" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* LOWER HEADLINE SECTION */}
          <div className="max-w-4xl mx-auto pt-20 text-left space-y-4" id="solutions">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Operational Management Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] max-w-2xl">
              End-to-End Water Distribution & Dispatch Management.
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-lg">
              Automating the complete lifecycle of municipal water relief and commercial tanker operations — from scarcity logging to AI allocation, queue management, route navigation, and OTP auditing.
            </p>
          </div>

          {/* 5-STEP MANAGEMENT PROCESS PIPELINE */}
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="how-it-works">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">01</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Demands</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Citizen & Ward Scarcity Logging</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Residents and welfare desks submit emergency water delivery requests, log dry tap complaints, and track request status with instant reference IDs.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToLogin('citizen', 'government')}
                className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Resident Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">02</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">AI Engine</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">AI Deficit & Priority Allocation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Algorithms analyze ward population density, vulnerability indexes, and supply gaps to calculate priority scores and recommend tanker volumes.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToLogin('admin', 'government')}
                className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Municipal Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">03</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Refills</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Station Loading & Water Quality</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filling station operators manage tanker queues, verify digital fill approvals, and record water quality metrics (pH, TDS, Turbidity).
                </p>
              </div>
              <button 
                onClick={() => onNavigateToLogin('operator', 'government')}
                className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Station Operator Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">04</span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Transit</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Turn-by-Turn Tanker GPS Routing</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Drivers navigate via optimized routes, update trip milestones (Loaded / En Route / Arrived), and broadcast live GPS locations.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToLogin('driver', 'government')}
                className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Driver Mobile App</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between sm:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">05</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Verification</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">OTP Delivery Gatekeeping & Audit Logs</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Beneficiaries and welfare officers provide secure 6-digit OTP codes to driver upon discharge, instantly logging fulfilled capacity and closing tickets in the central municipal audit ledger.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Tamper-proof OTP verification enabled
                </span>
                <button 
                  onClick={() => onNavigateToLogin('admin', 'government')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Audit Logs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* PORTALS SELECTION CARDS */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" id="portal-selection">
            
            {/* Government Municipal Portal Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between group hover:border-sky-300 transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0369A1] text-white flex items-center justify-center mb-6 shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Government & Municipal Sector</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  Complete city-wide water allocation, AI route optimization, ward complaints tracking, and OTP delivery auditing.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Ward Deficit Heatmaps & AI Allocations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Turn-by-Turn Tanker GPS Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Citizen Scarcity Requests & Verification</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigateToLogin('admin', 'government')}
                  className="w-full py-3 px-4 bg-[#0369A1] hover:bg-[#075985] text-white text-xs font-bold rounded-2xl shadow-xs transition text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Launch Municipal Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateToLogin('citizen', 'government')}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition text-center cursor-pointer"
                >
                  Enter as Resident / Citizen
                </button>
              </div>
            </div>

            {/* Commercial Sector Portal Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md flex flex-col justify-between group hover:border-sky-300 transition">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center mb-6 shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Commercial Sector & On-Demand</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  On-demand private water tanker booking, commercial supplier fleet management, and live consumer delivery updates.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Instant Commercial Tanker Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Supplier Pricing & Order Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>Live GPS Consumer Tracking</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (onSelectServiceMode) onSelectServiceMode('private');
                    else onNavigateToLogin('citizen', 'private');
                  }}
                  className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-2xl shadow-xs transition text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Order Commercial Water Tanker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateToLogin('operator', 'private')}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition text-center cursor-pointer"
                >
                  Commercial Supplier Console
                </button>
              </div>
            </div>

          </div>

        </main>

        {/* FOOTER */}
        <footer className="w-full px-8 py-6 border-t border-slate-200/60 bg-white/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#0284C7] flex items-center justify-center text-white">
              <Droplets className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="font-bold text-slate-700">AQUA2U Water Dispatch</span>
            <span>© 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('portal-selection')} className="hover:text-slate-700 transition cursor-pointer">
              Portals
            </button>
            <button onClick={() => onNavigateToLogin('driver', 'government')} className="hover:text-slate-700 transition cursor-pointer">
              Driver Login
            </button>
            <button onClick={() => onNavigateToLogin('operator', 'government')} className="hover:text-slate-700 transition cursor-pointer">
              Station Operator
            </button>
          </div>
        </footer>

      </div>

    </div>
  );
};
