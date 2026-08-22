import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Truck, 
  Droplets, 
  ShieldAlert, 
  Smartphone,
  MapPin,
  MessageSquare,
  Droplet,
  Bell,
  Navigation,
  Gauge,
  Building2,
  HeartPulse,
  PlusCircle,
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
  serviceMode?: 'government' | 'private';
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, serviceMode = 'government' }) => {
  const { activeTab, setActiveTab, userRole, requests, tankers, complaints } = useApp();
  const { t } = useLanguage();

  const pendingRequestsCount = requests.filter(r => r.status === 'Pending Allocation').length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;

  let menuItems: Array<{ id: string; label: string; icon: any; badge?: string | null }> = [];

  if (serviceMode === 'private') {
    if (userRole === 'citizen') {
      menuItems = [
        { id: 'privateOrder', label: t('orderCommercial', 'Order Tanker'), icon: Droplet },
        { id: 'privateTrack', label: t('navMap', 'Live Tracking'), icon: Truck, badge: 'Live' },
        { id: 'privateHistory', label: t('navDeliveries', 'Orders & Invoices'), icon: FileText }
      ];
    } else if (userRole === 'driver') {
      menuItems = [
        { id: 'privateDriverTrip', label: t('navDriverApp', 'Commercial Trips'), icon: Truck },
        { id: 'privateDriverVerify', label: t('verifyOTP', 'Confirm Delivery'), icon: ShieldCheck }
      ];
    } else {
      // Operator / Admin for Private Sector
      menuItems = [
        { id: 'privateOrders', label: t('navDashboard', 'Supplier Console'), icon: LayoutDashboard },
        { id: 'privateFleet', label: t('navTankers', 'Commercial Fleet'), icon: Truck, badge: `${tankers.length}` },
        { id: 'privatePricing', label: t('navAnalytics', 'Pricing & Earnings'), icon: BarChart3 }
      ];
    }
  } else {
    // Government Service Mode
    if (userRole === 'admin') {
      menuItems = [
        { id: 'dashboard', label: t('navDashboard', 'Dashboard'), icon: LayoutDashboard },
        { id: 'requests', label: t('navRequests', 'Water Requests'), icon: CheckSquare, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null },
        { id: 'allocations', label: t('navAllocations', 'AI Allocations'), icon: Cpu },
        { id: 'deliveries', label: t('navDeliveries', 'Schedule & Routes'), icon: Calendar },
        { id: 'tankers', label: t('navTankers', 'Fleet & Tankers'), icon: Truck, badge: `${tankers.length}` },
        { id: 'waterSources', label: t('navSources', 'Filling Stations'), icon: Droplet },
        { id: 'liveMap', label: t('navMap', 'Live Map'), icon: MapPin },
        { id: 'complaints', label: t('navComplaints', 'Citizen Complaints'), icon: MessageSquare, badge: pendingComplaintsCount > 0 ? `${pendingComplaintsCount}` : null },
        { id: 'analytics', label: t('navAnalytics', 'Analytics'), icon: BarChart3 },
        { id: 'users', label: t('users', 'Team & Drivers'), icon: Users }
      ];
    } else if (userRole === 'citizen') {
      menuItems = [
        { id: 'complaints', label: t('navResidentPortal', 'Citizen Dashboard'), icon: LayoutDashboard },
        { id: 'requestWater', label: t('requestWater', 'Request Water'), icon: PlusCircle },
        { id: 'trackTanker', label: t('navMap', 'Track Tanker'), icon: MapPin, badge: 'GPS' },
        { id: 'myRequests', label: t('navRequests', 'My Orders'), icon: Clock },
        { id: 'notifications', label: t('arrivalAlerts', 'Arrival Alerts'), icon: Bell }
      ];
    } else if (userRole === 'driver') {
      menuItems = [
        { id: 'driverDashboard', label: t('navDriverApp', 'Driver Console'), icon: LayoutDashboard },
        { id: 'driverNavigation', label: t('navRoutes', 'Route Navigation'), icon: Navigation },
        { id: 'driverDelivery', label: t('verifyOTP', 'Verify Delivery (OTP)'), icon: ShieldCheck },
        { id: 'driverVehicle', label: t('vehicleInspection', 'Vehicle Inspection'), icon: Gauge }
      ];
    } else if (userRole === 'operator') {
      menuItems = [
        { id: 'operatorDashboard', label: t('navOperatorPortal', 'Station Overview'), icon: LayoutDashboard },
        { id: 'operatorQueue', label: t('navTankers', 'Tanker Queue'), icon: Truck, badge: 'Active' },
        { id: 'operatorQuality', label: t('waterQuality', 'Water Quality'), icon: Gauge },
        { id: 'operatorSources', label: t('navSources', 'Feeder Refills'), icon: RefreshCw }
      ];
    } else if (userRole === 'beneficiary') {
      menuItems = [
        { id: 'beneficiaryDashboard', label: t('navBeneficiaryPortal', 'Welfare Desk'), icon: HeartPulse },
        { id: 'beneficiaryRequest', label: t('requestWater', 'Request Subsidized'), icon: PlusCircle },
        { id: 'beneficiaryHistory', label: t('navDeliveries', 'Delivery Records'), icon: FileText }
      ];
    } else {
      menuItems = [
        { id: 'dashboard', label: t('navDashboard', 'Dashboard'), icon: LayoutDashboard },
        { id: 'requests', label: t('navRequests', 'Requests'), icon: CheckSquare },
        { id: 'deliveries', label: t('navDeliveries', 'Schedule & Routes'), icon: Calendar },
        { id: 'analytics', label: t('navAnalytics', 'Analytics'), icon: BarChart3 },
        { id: 'tankers', label: t('navTankers', 'Fleet & Tankers'), icon: Truck },
        { id: 'users', label: t('users', 'Team & Drivers'), icon: Users }
      ];
    }
  }

  const generalItems = [
    {
      id: 'settings',
      label: t('navSettings', 'Settings'),
      icon: Settings
    },
    {
      id: 'emergency',
      label: t('navEmergency', 'Emergency Help'),
      icon: ShieldAlert
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (userRole === 'citizen') setActiveTab('complaints');
            else if (userRole === 'driver') setActiveTab('driverDashboard');
            else if (userRole === 'operator') setActiveTab('operatorDashboard');
            else if (userRole === 'beneficiary') setActiveTab('beneficiaryDashboard');
            else setActiveTab('dashboard');
          }}
          className="flex items-center gap-3 mb-8 cursor-pointer group px-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#0284C7] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">AQUA2U</h2>
            <span className="text-[10px] font-bold text-slate-400 block mt-1 tracking-wider uppercase">
              {serviceMode === 'private' ? 'Commercial Sector' : 'Water Dispatch'}
            </span>
          </div>
        </div>

        {/* MENU Group */}
        <div className="mb-6">
          <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase block mb-3 px-3">
            MENU ({userRole})
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#116343] text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-emerald-900/80 text-emerald-100' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* GENERAL Group */}
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase block mb-3 px-3">
            GENERAL
          </span>
          <nav className="space-y-1">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#116343] text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Download Mobile App Promo Card */}
      <div className="mt-8 bg-[#0B3B26] text-white p-4 rounded-2xl relative overflow-hidden shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-emerald-500/20 blur-xl pointer-events-none"></div>

        <div className="w-8 h-8 rounded-lg bg-emerald-900/80 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-300">
          <Smartphone className="w-4 h-4" />
        </div>

        <h4 className="font-extrabold text-xs text-white leading-tight">
          Download Mobile App
        </h4>
        <p className="text-[10px] text-emerald-200/80 font-medium mt-1 mb-3">
          Get easy access in another way
        </p>

        <button 
          onClick={() => alert("Donezo Mobile App link sent to registered phone!")}
          className="w-full py-2 bg-[#116343] hover:bg-[#0E5438] text-white text-xs font-extrabold rounded-xl transition text-center shadow-xs cursor-pointer active:scale-[0.98]"
        >
          Download
        </button>
      </div>
    </aside>
  );
};
