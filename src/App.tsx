/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PrivateAppProvider } from './context/PrivateContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { WelcomeActionBanner } from './components/WelcomeActionBanner';
import { DashboardView } from './components/DashboardView';
import { AllocationsView } from './components/AllocationsView';
import { RouteOptimizationView } from './components/RouteOptimizationView';
import { LiveMapView } from './components/LiveMapView';
import { RequestsView } from './components/RequestsView';
import { EmergencyView } from './components/EmergencyView';
import { AnalyticsView } from './components/AnalyticsView';
import { TankersView } from './components/TankersView';
import { WaterSourcesView } from './components/WaterSourcesView';
import { DeliveriesView } from './components/DeliveriesView';
import { ComplaintsView } from './components/ComplaintsView';
import { UserPortal } from './components/UserPortal';
import { BeneficiaryPortal } from './components/BeneficiaryPortal';
import { DriverPortal } from './components/DriverPortal';
import { OperatorPortal } from './components/OperatorPortal';
import { SettingsView } from './components/SettingsView';
import { UsersView } from './components/UsersView';
import { NewRequestModal } from './components/NewRequestModal';

// Private Sector Portals
import { 
  PrivateCustomerPortal 
} from './components/private/PrivateCustomerPortal';
import { PrivateProviderPortal } from './components/private/PrivateProviderPortal';
import { PrivateDriverPortal } from './components/private/PrivateDriverPortal';

import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Info, 
  MapPin, 
  Layers, 
  RefreshCw, 
  Eye, 
  ArrowRight, 
  UserCheck, 
  ChevronRight,
  Workflow,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { userRole, setUserRole, activeTab, setActiveTab } = useApp();
  
  // Service mode state: 'government' | 'private'
  const [serviceMode, setServiceMode] = useState<'government' | 'private'>('government');

  // App view navigation state: 'landing' | 'login' | 'register' | 'portal'
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'portal'>('landing');
  const [initialRoleForLogin, setInitialRoleForLogin] = useState<UserRole>('citizen');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(true);
  
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [deliverySubTab, setDeliverySubTab] = useState<'route' | 'records'>('route');

  const handleNavigateToLogin = (role: UserRole = 'citizen', mode: 'government' | 'private' = 'government') => {
    setInitialRoleForLogin(role);
    setServiceMode(mode);
    setCurrentView('login');
  };

  const handleNavigateToRegister = () => {
    setCurrentView('register');
  };

  const handleSelectServiceMode = (mode: 'government' | 'private') => {
    setServiceMode(mode);
    if (mode === 'private') {
      setUserRole('citizen');
    }
    setCurrentView('portal');
  };

  const handleLoginSuccess = (role: UserRole, mode?: 'government' | 'private') => {
    setUserRole(role);
    if (mode) setServiceMode(mode);
    setShowWelcomeBanner(true);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  const handleSwitchServiceMode = (newMode: 'government' | 'private') => {
    setServiceMode(newMode);
    if (newMode === 'private') {
      // In private mode, if role was admin, shift to customer
      if (userRole === 'admin') {
        setUserRole('citizen');
      }
    }
  };

  // 1. Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigateToLogin={(role, mode) => handleNavigateToLogin(role, mode || 'government')}
        onNavigateToRegister={handleNavigateToRegister}
        onSelectServiceMode={handleSelectServiceMode}
      />
    );
  }

  // 2. Login or Register View
  if (currentView === 'login' || currentView === 'register') {
    return (
      <LoginScreen
        initialRole={initialRoleForLogin}
        initialMode={currentView === 'register' ? 'register' : 'login'}
        initialServiceMode={serviceMode}
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={handleGoHome}
      />
    );
  }

  // 3. Authenticated Role-Based Portal View
  return (
    <div className="min-h-screen bg-[#EAECEE] text-slate-800 p-3 sm:p-5 md:p-6 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-5 items-start">
        
        {/* Left Sidebar Navigation */}
        <Sidebar 
          serviceMode={serviceMode}
          onLogout={handleLogout}
        />

        {/* Right Main Content Column */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-5">
          
          {/* Top Header Bar */}
          <Header 
            serviceMode={serviceMode}
            onSwitchServiceMode={handleSwitchServiceMode}
            onLogout={handleLogout} 
            onGoHome={handleGoHome} 
          />

          {/* Main Body View */}
          <main className="w-full">
            {/* ========================================================================= */}
            {/* 🚰 PRIVATE WATER DELIVERY SYSTEM (Completely Isolated from Government)    */}
            {/* ========================================================================= */}
        {serviceMode === 'private' ? (
          <div className="space-y-6">
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'emergency' && <EmergencyView />}

            {activeTab !== 'settings' && activeTab !== 'emergency' && (
              <>
                {/* Private Customer Portal */}
                {userRole === 'citizen' && <PrivateCustomerPortal />}

                {/* Private Water Supplier / Provider Portal */}
                {(userRole === 'operator' || userRole === 'admin') && <PrivateProviderPortal />}

                {/* Private Tanker Driver App */}
                {userRole === 'driver' && <PrivateDriverPortal />}
              </>
            )}
          </div>
        ) : (
          <>
            {/* First-Time / Onboarding Welcome Action Banner */}
            {showWelcomeBanner && activeTab === 'dashboard' && (
              <WelcomeActionBanner
                onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
                onDismiss={() => setShowWelcomeBanner(false)}
              />
            )}

            {/* General Settings & Emergency Help Views for all roles */}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'emergency' && <EmergencyView />}

            {activeTab !== 'settings' && activeTab !== 'emergency' && (
              <>
                {/* Role: Citizen */}
                {userRole === 'citizen' && <UserPortal />}

                {/* Role: Beneficiary */}
                {userRole === 'beneficiary' && <BeneficiaryPortal />}

                {/* Role: Driver */}
                {userRole === 'driver' && <DriverPortal />}

                {/* Role: Filling Station Operator */}
                {userRole === 'operator' && <OperatorPortal />}

                {/* Role: Municipal Authority (Admin) */}
                {userRole === 'admin' && (
                  <>
                    {activeTab === 'dashboard' && (
                      <DashboardView onOpenNewRequest={() => setIsNewRequestModalOpen(true)} />
                    )}
                    {activeTab === 'allocations' && <AllocationsView />}
                    {activeTab === 'requests' && (
                      <RequestsView onOpenNewRequest={() => setIsNewRequestModalOpen(true)} />
                    )}
                    {activeTab === 'liveMap' && <LiveMapView />}
                    {activeTab === 'deliveries' && (
                      <div className="space-y-4">
                        {/* Sub Tab Switcher between Route Optimization and Verified Logs */}
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                          <button
                            onClick={() => setDeliverySubTab('route')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              deliverySubTab === 'route'
                                ? 'bg-[#0F2942] text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            AI Route Optimization & Turn-by-Turn
                          </button>
                          <button
                            onClick={() => setDeliverySubTab('records')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              deliverySubTab === 'records'
                                ? 'bg-[#0F2942] text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Verified Delivery Records & OTP Audit Log
                          </button>
                        </div>

                        {deliverySubTab === 'route' ? <RouteOptimizationView /> : <DeliveriesView />}
                      </div>
                    )}
                    {activeTab === 'analytics' && <AnalyticsView />}
                    {activeTab === 'tankers' && <TankersView />}
                    {(activeTab === 'waterSources' || activeTab === 'sources') && <WaterSourcesView />}
                    {activeTab === 'complaints' && <ComplaintsView />}
                    {activeTab === 'users' && <UsersView />}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
        </div>
      </div>

      {/* New Request Modal (Government) */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PrivateAppProvider>
        <MainAppContent />
      </PrivateAppProvider>
    </AppProvider>
  );
}
