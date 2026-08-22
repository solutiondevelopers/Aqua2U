import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';
import { 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle,
  Database,
  Bell,
  Scale,
  MapPin,
  Clock,
  Globe,
  Languages
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetAllData } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [minServiceLevel, setMinServiceLevel] = useState(50); // LPCD
  const [criticalThresholdHours, setCriticalThresholdHours] = useState(72);
  const [maxDispatchRadiusKm, setMaxDispatchRadiusKm] = useState(25);
  const [aiFairnessWeight, setAiFairnessWeight] = useState(85);
  const [autoApproveEmergencies, setAutoApproveEmergencies] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('navSettings', 'System Settings')} & {t('language', 'Language')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure municipal water distribution thresholds, multi-lingual localization, and AI fairness weights.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-[0.98] cursor-pointer transition"
        >
          <Save className="w-4 h-4" />
          <span>{t('saveSettings', 'Save Parameters')}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration and language parameters updated successfully!</span>
        </div>
      )}

      {/* Multi-Language & Regional Localization Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('language', 'Language')} & Regional Localization</h2>
              <p className="text-[11px] text-slate-400">Select preferred language for citizen forms, driver app, and municipal dispatch interface.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            6 Languages Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer text-left ${
                  isSelected 
                    ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{lang.nativeName}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{lang.name}</span>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Water Equity & Minimum Service Standards */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Scale className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Equity & Minimum Service Standards</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Minimum Target Service Level</span>
                <span className="text-teal-800 font-bold">{minServiceLevel} LPCD</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Liters Per Capita per Day standard benchmark</p>
              <input
                type="range"
                min={30}
                max={100}
                value={minServiceLevel}
                onChange={(e) => setMinServiceLevel(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Critical Supply Gap Alarm</span>
                <span className="text-amber-700 font-bold">{criticalThresholdHours} Hours (3 Days)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Triggers automatic high-priority flag if no supply</p>
              <input
                type="range"
                min={24}
                max={120}
                step={12}
                value={criticalThresholdHours}
                onChange={(e) => setCriticalThresholdHours(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 2: AI Allocation Optimization Weights */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Fairness & Allocation Weights</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Vulnerability & Equity Weight</span>
                <span className="text-teal-800 font-bold">{aiFairnessWeight}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Balance between speed/fuel efficiency vs equity in underserved areas</p>
              <input
                type="range"
                min={50}
                max={100}
                value={aiFairnessWeight}
                onChange={(e) => setAiFairnessWeight(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Max Tanker Dispatch Radius</span>
                <span className="text-slate-800 font-bold">{maxDispatchRadiusKm} km</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Maximum allowed distance for single round-trip tanker allocation</p>
              <input
                type="range"
                min={10}
                max={50}
                value={maxDispatchRadiusKm}
                onChange={(e) => setMaxDispatchRadiusKm(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Automated Policies & Protocols */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Emergency & Triage Policies</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60">
              <div>
                <span className="font-bold text-slate-900 block">Auto-Recommend Redirections</span>
                <span className="text-[11px] text-slate-500">Allow AI to calculate instant tanker reassignment for hospitals</span>
              </div>
              <input
                type="checkbox"
                checked={autoApproveEmergencies}
                onChange={(e) => setAutoApproveEmergencies(e.target.checked)}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60">
              <div>
                <span className="font-bold text-slate-900 block">Citizen SMS / WhatsApp Alerts</span>
                <span className="text-[11px] text-slate-500">Auto-send OTP and tracking URL when tanker departs filling point</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Card 4: Prototype Demo Reset & Seeding */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Database className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Demo Prototype Control</h2>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Reset all tanker positions, simulated GPS streams, citizen requests, and deliveries back to original smart city baseline state.
            </p>
          </div>

          <button
            onClick={() => {
              resetAllData();
              alert("All prototype demo data has been reset to baseline state!");
            }}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
