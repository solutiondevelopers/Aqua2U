import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Droplet, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  User, 
  Truck, 
  Building2, 
  Check, 
  AlertCircle,
  Users,
  GraduationCap,
  HeartPulse,
  Gauge,
  MapPin,
  FileText,
  BadgeAlert,
  Calendar,
  ChevronDown
} from 'lucide-react';

interface LoginScreenProps {
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
  initialServiceMode?: 'government' | 'private';
  onLoginSuccess: (role: UserRole, serviceMode: 'government' | 'private') => void;
  onBackToLanding: () => void;
}

export type RegistrationRole = 
  | 'slum_representative' 
  | 'main_tank_operator' 
  | 'school' 
  | 'hospital' 
  | 'driver' 
  | 'citizen';

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  initialRole = 'citizen',
  initialMode = 'login',
  initialServiceMode = 'government',
  onLoginSuccess,
  onBackToLanding
}) => {
  const { setUserRole, setActiveTab } = useApp();
  const [serviceMode, setServiceMode] = useState<'government' | 'private'>(initialServiceMode);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [identifier, setIdentifier] = useState('citizen.pune@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form basic state
  const [regName, setRegName] = useState('Sunita Gaikwad');
  const [regContact, setRegContact] = useState('+91 98230 44921');
  const [regPassword, setRegPassword] = useState('SecurePass@2026');
  const [regConfirmPassword, setRegConfirmPassword] = useState('SecurePass@2026');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Scrollable / Dropdown Account Role Selection (Slum Representative, Main Tank Operator, School, Hospital, Driver, Citizen)
  const [regRole, setRegRole] = useState<RegistrationRole>('slum_representative');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Dynamic Questions State per Role:
  // 1. Slum Representative
  const [slumName, setSlumName] = useState('Ambedkar Nagar Informal Settlement');
  const [slumWard, setSlumWard] = useState('Ward 14 - Bhavani Peth');
  const [slumPopulation, setSlumPopulation] = useState('450 Families (~2,200 Residents)');
  const [slumWaterPoint, setSlumWaterPoint] = useState('2x 5,000L Community Tanks + 1 Standpost');
  const [slumCardId, setSlumCardId] = useState('RC-MH-SLUM-8921');

  // 2. Main Tank Operator
  const [stationName, setStationName] = useState('Parvati Main Water Works & ESR Tank 4');
  const [operatorId, setOperatorId] = useState('PMC-WTP-OP-4091');
  const [stationCapacity, setStationCapacity] = useState('500,000 Liters (5 Filling Bays)');
  const [intakeSource, setIntakeSource] = useState('Khadakwasla Dam Intake Canal');
  const [shiftTiming, setShiftTiming] = useState('Morning Shift (06:00 - 14:00)');

  // 3. School
  const [schoolName, setSchoolName] = useState('Saraswati Vidya Mandir & Junior College');
  const [udiseCode, setUdiseCode] = useState('UDISE-27251408901');
  const [studentCount, setStudentCount] = useState('850 Students & 45 Faculty/Staff');
  const [schoolDailyNeed, setSchoolDailyNeed] = useState('6,500 Liters/day (Drinking & Mid-Day Meal)');
  const [schoolStorage, setSchoolStorage] = useState('Overhead Tank 12,000 Liters + RO Plant');

  // 4. Hospital
  const [hospitalName, setHospitalName] = useState('Sassoon General Hospital & Trauma Wing');
  const [nabhCode, setNabhCode] = useState('NABH-HOSP-2024-8821');
  const [bedCount, setBedCount] = useState('250 Beds (35 ICU / 10 Dialysis Units)');
  const [hospitalDailyNeed, setHospitalDailyNeed] = useState('25,000 Liters/day (Sterilization & ICU Priority)');
  const [officerName, setOfficerName] = useState('Dr. A. K. Joshi (Chief Medical Officer)');

  // 5. Driver
  const [licenseNo, setLicenseNo] = useState('MH-12-DL-2018-09941');
  const [tankerRegNo, setTankerRegNo] = useState('MH-12-Q-4091 (10,000L)');
  const [baseDepot, setBaseDepot] = useState('Swargate Municipal Transport Depot');

  // 6. Citizen
  const [societyAddress, setSocietyAddress] = useState('Flat 402, Shivshankar Apts, Bibwewadi');
  const [citizenWard, setCitizenWard] = useState('Ward 18 - Bibwewadi');
  const [familyMembers, setFamilyMembers] = useState('4 Members');

  // Preset role quick switch credentials
  const handleRolePreset = (role: UserRole, currentMode: 'government' | 'private' = serviceMode) => {
    setSelectedRole(role);
    setLoginError(null);
    if (currentMode === 'government') {
      if (role === 'admin') {
        setIdentifier('authority@pmcwater.gov.in');
      } else if (role === 'driver') {
        setIdentifier('driver.suresh@tankerfleet.in');
      } else if (role === 'operator') {
        setIdentifier('operator.parvati@punehydro.in');
      } else if (role === 'beneficiary') {
        setIdentifier('beneficiary.hospital@sassoon.gov.in');
      } else {
        setIdentifier('sunita.gaikwad@pune-citizen.in');
      }
    } else {
      if (role === 'driver') {
        setIdentifier('driver.vinod@swatitankers.com');
      } else if (role === 'operator') {
        setIdentifier('manager@swatitankers.com');
      } else {
        setIdentifier('aditya.sharma@aquahome.in');
      }
    }
  };

  const handleSwitchServiceMode = (newMode: 'government' | 'private') => {
    setServiceMode(newMode);
    setLoginError(null);
    if (newMode === 'government') {
      handleRolePreset('citizen', 'government');
    } else {
      handleRolePreset('citizen', 'private');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setLoginError('Please enter your email or mobile number.');
      return;
    }
    setLoginError(null);
    setUserRole(selectedRole);
    
    // Set proper initial landing tab per role
    if (selectedRole === 'citizen') {
      setActiveTab('home');
    } else if (selectedRole === 'driver') {
      setActiveTab('home');
    } else if (selectedRole === 'operator') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }

    onLoginSuccess(selectedRole, serviceMode);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regContact.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    setRegError(null);

    // Map registration role to application UserRole
    let mappedUserRole: UserRole = 'citizen';
    if (regRole === 'main_tank_operator') {
      mappedUserRole = 'operator';
    } else if (regRole === 'hospital' || regRole === 'school') {
      mappedUserRole = 'beneficiary';
    } else if (regRole === 'driver') {
      mappedUserRole = 'driver';
    } else {
      mappedUserRole = 'citizen';
    }

    setUserRole(mappedUserRole);
    setRegSuccess(true);

    setTimeout(() => {
      onLoginSuccess(mappedUserRole, serviceMode);
    }, 700);
  };

  // Role metadata definitions for scrollable selector
  const availableRoles: Array<{
    id: RegistrationRole;
    label: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }> = [
    {
      id: 'slum_representative',
      label: 'Slum Representative',
      badge: 'Community Coordinator',
      icon: Users,
      description: 'Representative for informal settlements & community clusters'
    },
    {
      id: 'main_tank_operator',
      label: 'Main Tank Operator',
      badge: 'Master Reservoir',
      icon: Building2,
      description: 'Master storage ESR/GSR & water treatment plant supervisor'
    },
    {
      id: 'school',
      label: 'School',
      badge: 'Education',
      icon: GraduationCap,
      description: 'Primary/secondary schools, colleges, and hostels'
    },
    {
      id: 'hospital',
      label: 'Hospital',
      badge: 'Healthcare',
      icon: HeartPulse,
      description: 'Critical healthcare, dialysis, ICU & emergency clinic'
    },
    {
      id: 'driver',
      label: 'Tanker Driver',
      badge: 'Logistics Fleet',
      icon: Truck,
      description: 'Tanker operator delivering to designated drop points'
    },
    {
      id: 'citizen',
      label: 'Citizen / Resident',
      badge: 'Household',
      icon: User,
      description: 'Residential society, apartment or independent household'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col justify-between select-none">
      {/* Top Simple Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-sky-100 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-700 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl droplet-3d-gradient flex items-center justify-center text-white shadow-xs">
                <Droplet className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full droplet-3d-small flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/90"></div>
              </div>
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">AQUA2U</span>
          </div>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            {serviceMode === 'government' ? 'Municipal Water Logistics Portal' : 'Private Water Delivery Portal'}
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="max-w-xl w-full drops-glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* Mode Switcher Tabs (Government vs Private) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Portal Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleSwitchServiceMode('government')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  serviceMode === 'government'
                    ? 'bg-white text-[#0F2942] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️ Government</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchServiceMode('private')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  serviceMode === 'private'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🚰 Private Delivery</span>
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {serviceMode === 'government' ? 'Government Portal Login' : 'Private Delivery Login'}
                </h1>
                <p className="text-xs text-slate-500">
                  {serviceMode === 'government' 
                    ? 'Sign in to access municipal water requests & allocation.' 
                    : 'Sign in to order water tankers or manage private fleet.'}
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                  Select Account Role
                </label>
                
                {serviceMode === 'government' ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleRolePreset('citizen')}
                      className={`py-1.5 px-1.5 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'citizen'
                          ? 'bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('beneficiary')}
                      className={`py-1.5 px-1.5 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'beneficiary'
                          ? 'bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Beneficiary
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('driver')}
                      className={`py-1.5 px-1.5 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'driver'
                          ? 'bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('operator')}
                      className={`py-1.5 px-1.5 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'operator'
                          ? 'bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Operator
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('admin')}
                      className={`py-1.5 px-1.5 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'admin'
                          ? 'bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Authority
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleRolePreset('citizen')}
                      className={`py-1.5 px-2 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'citizen'
                          ? 'bg-white text-emerald-800 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('operator')}
                      className={`py-1.5 px-2 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'operator'
                          ? 'bg-white text-emerald-800 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Provider
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRolePreset('driver')}
                      className={`py-1.5 px-2 rounded text-xs font-medium transition cursor-pointer text-center ${
                        selectedRole === 'driver'
                          ? 'bg-white text-emerald-800 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Driver
                    </button>
                  </div>
                )}
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email / Mobile Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Email / Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9823000000 or email@domain.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link has been dispatched to your registered mobile/email.');
                      }}
                      className="text-xs font-medium text-teal-700 hover:text-teal-800"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Destination Badge */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Authorized Portal:</span>
                  <span className="font-semibold text-[#0F2942] capitalize">
                    {serviceMode === 'government' 
                      ? (selectedRole === 'admin' ? 'Municipal Authority' : `${selectedRole} Portal`)
                      : (selectedRole === 'citizen' ? 'Private Water Customer' : selectedRole === 'operator' ? 'Water Supplier Portal' : 'Private Driver App')}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer text-white ${
                    serviceMode === 'private'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#0F2942] hover:bg-[#153a5c]'
                  }`}
                >
                  Sign In to {serviceMode === 'government' ? 'Government Portal' : 'Private Delivery'}
                </button>
              </form>

              {/* Bottom toggle to registration */}
              <div className="pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  New user?{' '}
                  <button
                    onClick={() => {
                      setMode('register');
                      setRegError(null);
                    }}
                    className="font-semibold text-teal-700 hover:text-teal-800 cursor-pointer ml-1"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <div className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Create {serviceMode === 'government' ? 'Government' : 'Private'} Account
                  </h1>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                    Registration
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Fill in your institutional or contact credentials, then select your account role below.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Account registered successfully! Routing to your verified dashboard...</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* 1. Basic Information Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Full Name / Contact Person
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Sunita Gaikwad"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942]"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile / Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Mobile Number / Official Email
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="e.g. +91 98230 44921"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0F2942]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Dynamic Questions Section (Changes based on selected role) */}
                <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      {regRole === 'slum_representative' && <Users className="w-4 h-4 text-sky-700" />}
                      {regRole === 'main_tank_operator' && <Building2 className="w-4 h-4 text-sky-700" />}
                      {regRole === 'school' && <GraduationCap className="w-4 h-4 text-sky-700" />}
                      {regRole === 'hospital' && <HeartPulse className="w-4 h-4 text-rose-600" />}
                      {regRole === 'driver' && <Truck className="w-4 h-4 text-emerald-700" />}
                      {regRole === 'citizen' && <User className="w-4 h-4 text-slate-700" />}
                      <span className="text-xs font-bold text-slate-800">
                        {regRole === 'slum_representative' && 'Slum Representative Verification & Cluster Profile'}
                        {regRole === 'main_tank_operator' && 'Main Reservoir & Treatment Plant Operator Profile'}
                        {regRole === 'school' && 'School / Educational Institution Water Profile'}
                        {regRole === 'hospital' && 'Hospital / Healthcare Emergency Reserve Profile'}
                        {regRole === 'driver' && 'Driver License & Assigned Vehicle Information'}
                        {regRole === 'citizen' && 'Residential Society & Household Water Profile'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200">
                      Role Verification
                    </span>
                  </div>

                  {/* Q1: Slum Representative Specific Questions */}
                  {regRole === 'slum_representative' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Slum / Informal Settlement Name
                          </label>
                          <input
                            type="text"
                            value={slumName}
                            onChange={(e) => setSlumName(e.target.value)}
                            placeholder="e.g. Ambedkar Nagar Basti"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Ward & Zone Allocation
                          </label>
                          <input
                            type="text"
                            value={slumWard}
                            onChange={(e) => setSlumWard(e.target.value)}
                            placeholder="e.g. Ward 14 - Bhavani Peth"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Families Represented
                          </label>
                          <input
                            type="text"
                            value={slumPopulation}
                            onChange={(e) => setSlumPopulation(e.target.value)}
                            placeholder="e.g. 450 Families"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Community Storage Points
                          </label>
                          <input
                            type="text"
                            value={slumWaterPoint}
                            onChange={(e) => setSlumWaterPoint(e.target.value)}
                            placeholder="e.g. 2x 5,000L Sintex Tanks"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Representative ID / Ration Card
                          </label>
                          <input
                            type="text"
                            value={slumCardId}
                            onChange={(e) => setSlumCardId(e.target.value)}
                            placeholder="e.g. RC-MH-SLUM-8921"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Q2: Main Tank Operator Specific Questions */}
                  {regRole === 'main_tank_operator' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Master Water Tank / Filling Station Name
                          </label>
                          <input
                            type="text"
                            value={stationName}
                            onChange={(e) => setStationName(e.target.value)}
                            placeholder="e.g. Parvati Main ESR Reservoir Station"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Operator Employee / License ID
                          </label>
                          <input
                            type="text"
                            value={operatorId}
                            onChange={(e) => setOperatorId(e.target.value)}
                            placeholder="e.g. PMC-WTP-OP-4091"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Reservoir Capacity & Bays
                          </label>
                          <input
                            type="text"
                            value={stationCapacity}
                            onChange={(e) => setStationCapacity(e.target.value)}
                            placeholder="e.g. 500,000 Liters (5 Bays)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Intake Canal / Water Source
                          </label>
                          <input
                            type="text"
                            value={intakeSource}
                            onChange={(e) => setIntakeSource(e.target.value)}
                            placeholder="e.g. Khadakwasla Dam Intake"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Assigned Duty Shift
                          </label>
                          <input
                            type="text"
                            value={shiftTiming}
                            onChange={(e) => setShiftTiming(e.target.value)}
                            placeholder="e.g. Morning (06:00 - 14:00)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Q3: School Specific Questions */}
                  {regRole === 'school' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            School / Educational Institution Name
                          </label>
                          <input
                            type="text"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="e.g. Saraswati Vidya Mandir"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            UDISE+ / Govt Registration Code
                          </label>
                          <input
                            type="text"
                            value={udiseCode}
                            onChange={(e) => setUdiseCode(e.target.value)}
                            placeholder="e.g. UDISE-27251408901"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Total Students & Staff
                          </label>
                          <input
                            type="text"
                            value={studentCount}
                            onChange={(e) => setStudentCount(e.target.value)}
                            placeholder="e.g. 850 Students & 45 Staff"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Daily Drinking & Meal Need
                          </label>
                          <input
                            type="text"
                            value={schoolDailyNeed}
                            onChange={(e) => setSchoolDailyNeed(e.target.value)}
                            placeholder="e.g. 6,500 Liters/day"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Campus Storage Tank Capacity
                          </label>
                          <input
                            type="text"
                            value={schoolStorage}
                            onChange={(e) => setSchoolStorage(e.target.value)}
                            placeholder="e.g. Overhead Tank (12,000L)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Q4: Hospital Specific Questions */}
                  {regRole === 'hospital' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Hospital / Healthcare Facility Name
                          </label>
                          <input
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            placeholder="e.g. Sassoon General Hospital & Trauma Center"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            NABH / Medical License Code
                          </label>
                          <input
                            type="text"
                            value={nabhCode}
                            onChange={(e) => setNabhCode(e.target.value)}
                            placeholder="e.g. NABH-HOSP-2024-8821"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Inpatient & ICU Beds
                          </label>
                          <input
                            type="text"
                            value={bedCount}
                            onChange={(e) => setBedCount(e.target.value)}
                            placeholder="e.g. 250 Beds (35 ICU)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Critical Daily Need (ICU/Dialysis)
                          </label>
                          <input
                            type="text"
                            value={hospitalDailyNeed}
                            onChange={(e) => setHospitalDailyNeed(e.target.value)}
                            placeholder="e.g. 25,000 Liters/day"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Medical Officer In-Charge
                          </label>
                          <input
                            type="text"
                            value={officerName}
                            onChange={(e) => setOfficerName(e.target.value)}
                            placeholder="e.g. Dr. A. K. Joshi (CMO)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Q5: Tanker Driver Questions */}
                  {regRole === 'driver' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Commercial Driving License No.
                          </label>
                          <input
                            type="text"
                            value={licenseNo}
                            onChange={(e) => setLicenseNo(e.target.value)}
                            placeholder="e.g. MH-12-DL-2018-09941"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Assigned Tanker Reg No.
                          </label>
                          <input
                            type="text"
                            value={tankerRegNo}
                            onChange={(e) => setTankerRegNo(e.target.value)}
                            placeholder="e.g. MH-12-Q-4091 (10,000L)"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Base Transport Depot
                          </label>
                          <input
                            type="text"
                            value={baseDepot}
                            onChange={(e) => setBaseDepot(e.target.value)}
                            placeholder="e.g. Swargate Municipal Depot"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Q6: Citizen / Resident Questions */}
                  {regRole === 'citizen' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Society / Street Address & Landmark
                          </label>
                          <input
                            type="text"
                            value={societyAddress}
                            onChange={(e) => setSocietyAddress(e.target.value)}
                            placeholder="e.g. Flat 402, Shivshankar Apts, Bibwewadi"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Household Members
                          </label>
                          <input
                            type="text"
                            value={familyMembers}
                            onChange={(e) => setFamilyMembers(e.target.value)}
                            placeholder="e.g. 4 Members"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Account Role (Dropdown at Last Position before Submit) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Account Role <span className="text-teal-700">*</span>
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Dropdown Menu
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Choose your account category from the dropdown to configure institutional verification questions.
                  </p>

                  {/* Dropdown Trigger Button */}
                  {(() => {
                    const currentRole = availableRoles.find(r => r.id === regRole) || availableRoles[0];
                    const CurrentIcon = currentRole.icon;
                    return (
                      <div className="relative mt-1">
                        <button
                          type="button"
                          onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 bg-white ${
                            isRoleDropdownOpen
                              ? 'border-[#0F2942] ring-2 ring-sky-200 shadow-sm'
                              : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-900 flex items-center justify-center shrink-0">
                              <CurrentIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {currentRole.label}
                                </span>
                                <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                                  {currentRole.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {currentRole.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                              isRoleDropdownOpen ? 'rotate-180 text-sky-800' : ''
                            }`} />
                          </div>
                        </button>

                        {/* Dropdown Options List */}
                        {isRoleDropdownOpen && (
                          <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in-50 duration-150">
                            <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Select Role Category
                            </div>
                            {availableRoles.map((roleItem) => {
                              const OptionIcon = roleItem.icon;
                              const isSelected = regRole === roleItem.id;
                              return (
                                <button
                                  key={roleItem.id}
                                  type="button"
                                  onClick={() => {
                                    setRegRole(roleItem.id);
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`w-full p-2.5 px-3 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? 'bg-sky-50/90 text-sky-950 font-medium'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                      isSelected ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      <OptionIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs ${isSelected ? 'font-bold text-sky-950' : 'font-semibold text-slate-800'}`}>
                                          {roleItem.label}
                                        </span>
                                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                          {roleItem.badge}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 truncate">
                                        {roleItem.description}
                                      </p>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* 4. Submit Register Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#0F2942] hover:bg-[#153a5c] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Check className="w-4 h-4 text-teal-300" />
                  <span>
                    Create {regRole === 'slum_representative' ? 'Slum Representative' : regRole === 'main_tank_operator' ? 'Main Tank Operator' : regRole === 'school' ? 'School' : regRole === 'hospital' ? 'Hospital' : regRole === 'driver' ? 'Tanker Driver' : 'Citizen'} Account
                  </span>
                </button>
              </form>

              {/* Bottom toggle back to login */}
              <div className="pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setLoginError(null);
                    }}
                    className="font-semibold text-teal-700 hover:text-teal-800 cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer Security Badge */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>AQUA2U · Jal-Setu · Two Dedicated Systems · Strictly Separated Workflows</span>
        </div>
      </footer>
    </div>
  );
};

