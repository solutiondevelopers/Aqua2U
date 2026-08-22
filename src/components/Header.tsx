import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { UserRole } from '../types';
import { 
  Search, 
  Bell, 
  Mail, 
  ChevronDown, 
  Check, 
  Play, 
  Pause, 
  X, 
  LogOut, 
  Home, 
  User,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface HeaderProps {
  serviceMode?: 'government' | 'private';
  onSwitchServiceMode?: (mode: 'government' | 'private') => void;
  onLogout?: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  serviceMode = 'government',
  onSwitchServiceMode,
  onLogout, 
  onGoHome 
}) => {
  const {
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    isSimulating,
    setIsSimulating,
    notifications,
    dismissNotification
  } = useApp();
  const { t } = useLanguage();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setIsContextOpen(false);
    if (role === 'citizen') {
      setActiveTab('complaints' as any);
    } else if (role === 'driver') {
      setActiveTab('driverDashboard' as any);
    } else if (role === 'operator') {
      setActiveTab('operatorDashboard' as any);
    } else if (role === 'beneficiary') {
      setActiveTab('beneficiaryDashboard' as any);
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-transparent select-none">
      
      {/* 1. Left Search Input Box (Donezo style search with ⌘F shortcut) */}
      <div className="w-full md:w-96 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder', 'Search task or request...')}
          className="w-full bg-white border border-slate-200/80 rounded-full pl-10 pr-12 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D5338] shadow-2xs transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
          <span>⌘</span>
          <span>F</span>
        </div>
      </div>

      {/* 2. Right Header Actions & User Profile */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        
        {/* Language Selector Dropdown */}
        <LanguageSelector variant="pill" />

        {/* System Scope & Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsContextOpen(!isContextOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#0D5338]" />
            <span>{serviceMode === 'government' ? '🏛️ Gov Admin' : '🚰 Private Supplier'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold hidden sm:inline capitalize">
              {userRole}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isContextOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              {onSwitchServiceMode && (
                <div className="mb-3.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    1. System Sector
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => {
                        onSwitchServiceMode('government');
                        setIsContextOpen(false);
                      }}
                      className={`py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                        serviceMode === 'government'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🏛️ Government
                    </button>
                    <button
                      onClick={() => {
                        onSwitchServiceMode('private');
                        setIsContextOpen(false);
                      }}
                      className={`py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                        serviceMode === 'private'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚰 Private Sector
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  2. Administrative Role
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                      userRole === 'admin' ? 'bg-[#0D5338] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏛️ Municipal Administrator</span>
                    {userRole === 'admin' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('citizen')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                      userRole === 'citizen' ? 'bg-[#0D5338] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>👥 Citizen / Resident Client</span>
                    {userRole === 'citizen' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('driver')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                      userRole === 'driver' ? 'bg-[#0D5338] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🚚 Fleet Driver</span>
                    {userRole === 'driver' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('operator')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                      userRole === 'operator' ? 'bg-[#0D5338] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>💧 Station Operator</span>
                    {userRole === 'operator' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mail Icon Button */}
        <button 
          onClick={() => alert("Direct messages & team chat accessible in settings!")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs transition"
          title="Messages"
        >
          <Mail className="w-4 h-4" />
        </button>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                <span>Notifications</span>
                <span className="text-[10px] text-slate-400 font-medium">{notifications.length} unread</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mt-2">
                {notifications.length === 0 ? (
                  <p className="p-3 text-center text-slate-400 text-xs">No unread notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 hover:bg-slate-50 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-800 text-[11px]">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge (Totok Michael / R. Mehta style chip) */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-full pl-1.5 pr-4 py-1.5 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
              alt="Totok Michael" 
              className="w-8 h-8 rounded-full object-cover border border-emerald-300"
            />
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-xs font-black text-slate-900 block">Totok Michael</span>
              <span className="text-[10px] text-slate-400 font-semibold block">tmichael20@gmail.com</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100">
                <p className="font-extrabold text-slate-900">Totok Michael</p>
                <p className="text-[10px] text-slate-400">tmichael20@gmail.com</p>
              </div>

              <div className="pt-1">
                {onGoHome && (
                  <button
                    onClick={() => { onGoHome(); setIsProfileOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Landing Page</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => { onLogout(); setIsProfileOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
