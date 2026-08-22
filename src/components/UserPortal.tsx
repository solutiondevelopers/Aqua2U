import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from './InteractiveMap';
import { CitizenRequestForm } from './CitizenRequestForm';
import { 
  Droplet, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Truck, 
  AlertCircle, 
  MessageSquare, 
  Star, 
  ShieldCheck,
  Send,
  Building2,
  Phone,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  Bell,
  Check,
  AlertTriangle,
  Radio,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Key,
  Flame,
  ThumbsUp,
  Share2,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Paperclip,
  Maximize2,
  Mic,
  Volume2,
  Gauge,
  FileUp,
  X,
  Crosshair,
  Sparkles,
  Info
} from 'lucide-react';

const PUNE_AREAS = [
  'Shivaji Nagar Settlement',
  'Parvati Gaon',
  'Kothrud',
  'Hadapsar',
  'Katraj',
  'Undri',
  'Bavdhan',
  'Wadgaon Sheri',
  'Viman Nagar',
  'Bibwewadi',
  'Sinhagad Road',
  'Baner',
  'Aundh',
  'Yerawada Slum Cluster',
  'Dhanori',
  'Kondhwa',
  'Pune Camp',
  'Dhankawadi',
  'Pashan',
  'Warje'
];

export interface EvidenceProofItem {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
  size: string;
  timestamp: string;
  tag: string;
  geoTag?: string;
}

const SAMPLE_EVIDENCE_PRESETS: EvidenceProofItem[] = [
  {
    id: 'preset-1',
    type: 'image',
    name: 'Dry_Community_Sump.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    size: '2.4 MB',
    timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: 'Zero Sump Storage (0%)',
    geoTag: '18.5312° N, 73.8445° E (±3m)'
  },
  {
    id: 'preset-2',
    type: 'image',
    name: 'Empty_Public_Standpost.jpg',
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    size: '1.8 MB',
    timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: 'Dry Standpost / No Flow',
    geoTag: '18.5309° N, 73.8451° E (±4m)'
  },
  {
    id: 'preset-3',
    type: 'image',
    name: 'Turbid_Water_Sample.jpg',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    size: '3.1 MB',
    timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: 'Brownish Turbid Contamination',
    geoTag: '18.5320° N, 73.8439° E (±2m)'
  },
  {
    id: 'preset-4',
    type: 'image',
    name: 'Broken_Main_Pipeline_Leak.jpg',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    size: '2.9 MB',
    timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: 'Pipeline Rupture / Waste',
    geoTag: '18.5298° N, 73.8460° E (±5m)'
  }
];

export const UserPortal: React.FC = () => {
  const { 
    requests, 
    tankers, 
    complaints, 
    submitCitizenComplaint, 
    confirmCitizenReceipt,
    citizenActiveRequestId,
    setCitizenActiveRequestId,
    activeTab,
    setActiveTab
  } = useApp();

  // Active view tab inside User Portal
  const [userTab, setUserTab] = useState<'complaints' | 'notifications' | 'requestWater' | 'trackTanker' | 'myRequests'>('complaints');

  useEffect(() => {
    if (activeTab === 'requestWater' || activeTab === 'trackTanker' || activeTab === 'myRequests' || activeTab === 'complaints' || activeTab === 'notifications') {
      setUserTab(activeTab as 'complaints' | 'notifications' | 'requestWater' | 'trackTanker' | 'myRequests');
    } else if (activeTab === 'myDeliveries') {
      setUserTab('myRequests');
    }
  }, [activeTab]);

  // User Profile States
  const [username, setUsername] = useState('Sunita Gaikwad');
  const [selectedArea, setSelectedArea] = useState<string>('Shivaji Nagar Settlement');
  const [mobileNumber, setMobileNumber] = useState('+91 98210 44321');
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  
  // OTP Verification dialog/inline state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Complaints & Scarcity Assessment Form States
  // Question 1: Is your area currently facing water shortage? (Yes / No)
  const [facingShortage, setFacingShortage] = useState<'yes' | 'no'>('yes');
  
  // Question 2: Water situation? (no water, limited water, available water)
  const [waterSituation, setWaterSituation] = useState<'no_water' | 'limited_water' | 'available_water'>('no_water');
  
  // Additional complaint fields
  const [complaintCategory, setComplaintCategory] = useState<'Water Shortage' | 'Delayed Tanker' | 'Water Quality' | 'Inadequate Quantity' | 'Driver Conduct' | 'Billing / Extortion'>('Water Shortage');
  const [selectedTankerForComplaint, setSelectedTankerForComplaint] = useState<string>('None / General Area');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintSuccessMessage, setComplaintSuccessMessage] = useState<string | null>(null);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  // REAL PROOF & EVIDENCE STATES
  // User Attached Proof items
  const [evidenceList, setEvidenceList] = useState<EvidenceProofItem[]>([
    SAMPLE_EVIDENCE_PRESETS[0]
  ]);

  // Selected Image for Fullscreen Modal Preview
  const [previewImageModal, setPreviewImageModal] = useState<EvidenceProofItem | null>(null);

  // Meter / Sump Level Gauge Proof
  const [sumpLevelReading, setSumpLevelReading] = useState<number>(5); // 0 to 100%
  const [waterPressurePsi, setWaterPressurePsi] = useState<string>('Zero (0.0 PSI)');

  // GPS Location Stamp State
  const [gpsStamp, setGpsStamp] = useState<{ coords: string; accuracy: string; isLive: boolean }>({
    coords: '18.5314° N, 73.8446° E',
    accuracy: '± 3.8m (High Precision)',
    isLive: true
  });
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  // Voice Grievance Note State
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);

  // Supporting Document / Bill
  const [supportingBillFile, setSupportingBillFile] = useState<{ name: string; size: string } | null>(null);

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProof: EvidenceProofItem = {
          id: 'user-proof-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          type: 'image',
          name: file.name,
          url: (event.target?.result as string) || URL.createObjectURL(file),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          timestamp: 'Just now, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tag: 'Resident Uploaded Photo',
          geoTag: gpsStamp.coords
        };
        setEvidenceList(prev => [newProof, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Preset Evidence Photo
  const handleAddPresetEvidence = (preset: EvidenceProofItem) => {
    if (evidenceList.some(item => item.name === preset.name)) return;
    setEvidenceList(prev => [...prev, preset]);
  };

  // Remove Evidence Photo
  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(item => item.id !== id));
  };

  // Live Camera Snapshot Trigger
  const handleTakeCameraSnapshot = () => {
    const randomSnapshot = SAMPLE_EVIDENCE_PRESETS[Math.floor(Math.random() * SAMPLE_EVIDENCE_PRESETS.length)];
    const snapshotProof: EvidenceProofItem = {
      id: 'cam-snap-' + Date.now(),
      type: 'image',
      name: `Live_Camera_Capture_${Date.now().toString().slice(-4)}.jpg`,
      url: randomSnapshot.url,
      size: '2.1 MB',
      timestamp: 'Captured now, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'Live Camera Capture',
      geoTag: gpsStamp.coords
    };
    setEvidenceList(prev => [snapshotProof, ...prev]);
  };

  // Refresh GPS Coordinates
  const handleRefreshGps = () => {
    setIsRefreshingGps(true);
    setTimeout(() => {
      const lat = (18.5300 + (Math.random() * 0.005)).toFixed(4);
      const lng = (73.8440 + (Math.random() * 0.005)).toFixed(4);
      setGpsStamp({
        coords: `${lat}° N, ${lng}° E`,
        accuracy: '± 2.5m (Calibrated)',
        isLive: true
      });
      setIsRefreshingGps(false);
    }, 600);
  };

  // Simulate Voice Grievance Recording
  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      const interval = setInterval(() => {
        setVoiceDuration(prev => {
          if (prev >= 12) {
            clearInterval(interval);
            setIsRecordingVoice(false);
            setHasVoiceNote(true);
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      setHasVoiceNote(true);
    }
  };

  // Tanker Arrival Notifications Filter & Search
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'my_area' | 'arriving' | 'otps'>('all');
  const [searchTankerQuery, setSearchTankerQuery] = useState('');

  // Rating & delivery confirmation
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  // Active request
  const currentRequest = requests.find(r => r.id === citizenActiveRequestId) || requests.find(r => r.area.includes(selectedArea.split(' ')[0])) || requests[0];
  const assignedTanker = tankers.find(t => t.id === currentRequest?.assignedTankerId);

  // Handle OTP verification flow
  const handleSendOtp = () => {
    setOtpSentNotice(true);
    setOtpError(null);
    setShowOtpModal(true);
    setEnteredOtp('');
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === '4921' || enteredOtp.trim() === '1234' || enteredOtp.trim().length === 4) {
      setIsOtpVerified(true);
      setShowOtpModal(false);
      setOtpError(null);
      setOtpSentNotice(false);
    } else {
      setOtpError('Invalid OTP code. Enter 4921 (Demo Code) to verify.');
    }
  };

  // Handle Complaint Submission
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDescription.trim()) return;

    setIsSubmittingComplaint(true);
    setTimeout(() => {
      submitCitizenComplaint({
        citizenName: username,
        phone: mobileNumber,
        area: selectedArea,
        tankerId: selectedTankerForComplaint !== 'None / General Area' ? selectedTankerForComplaint : undefined,
        issueType: complaintCategory,
        description: `[Shortage Status: ${facingShortage.toUpperCase()} | Situation: ${waterSituation.replace('_', ' ').toUpperCase()}] ${complaintDescription}`,
        isFacingShortage: facingShortage === 'yes',
        waterSituation: waterSituation,
        isOtpVerified: isOtpVerified
      });

      setIsSubmittingComplaint(false);
      setComplaintSuccessMessage(`Complaint logged successfully! Ticket ID generated.`);
      setComplaintDescription('');
      setTimeout(() => {
        setComplaintSuccessMessage(null);
      }, 4000);
    }, 400);
  };

  // Mock list of Tanker Arrival Notifications
  const arrivalNotifications = useMemo(() => {
    return [
      {
        id: 'notif-1',
        tankerId: 'TK-104',
        driverName: 'Suresh Kumar',
        driverPhone: '+91 98221 00123',
        capacity: 10000,
        area: 'Shivaji Nagar Settlement',
        ward: 'Ward 14',
        status: 'Arrived at Destination Point',
        statusType: 'arrived',
        time: 'Just now',
        etaMinutes: 0,
        otpCode: '7492',
        message: 'Tanker TK-104 has arrived at Shivaji Nagar Settlement Community Tank. Please share verification OTP with driver.'
      },
      {
        id: 'notif-2',
        tankerId: 'TK-101',
        driverName: 'Ramesh K.',
        driverPhone: '+91 98220 11223',
        capacity: 12000,
        area: 'Parvati Gaon',
        ward: 'Ward 08',
        status: 'En Route (1.2 km away)',
        statusType: 'in_transit',
        time: '4 mins ago',
        etaMinutes: 8,
        otpCode: '8310',
        message: 'Tanker TK-101 has departed Parvati Filling Station. Approaching delivery route on Sinhagad Arterial.'
      },
      {
        id: 'notif-3',
        tankerId: 'TK-108',
        driverName: 'Kiran N.',
        driverPhone: '+91 98234 44556',
        capacity: 6000,
        area: 'Yerawada Slum Cluster',
        ward: 'Ward 04',
        status: 'Dispatched from Bay #1',
        statusType: 'dispatched',
        time: '12 mins ago',
        etaMinutes: 18,
        otpCode: '5521',
        message: 'Municipal emergency allocation approved. Tanker TK-108 dispatched with 6,000L Potable Water.'
      },
      {
        id: 'notif-4',
        tankerId: 'TK-112',
        driverName: 'Vikas G.',
        driverPhone: '+91 98211 99887',
        capacity: 8000,
        area: 'Hadapsar',
        ward: 'Ward 11',
        status: 'Scheduled for Delivery',
        statusType: 'scheduled',
        time: '25 mins ago',
        etaMinutes: 35,
        otpCode: '9104',
        message: 'Automated morning quota scheduled for Hadapsar Gali 4 residents. Driver assigned.'
      },
      {
        id: 'notif-5',
        tankerId: 'TK-106',
        driverName: 'Rahul P.',
        driverPhone: '+91 98219 88776',
        capacity: 9000,
        area: 'Kothrud',
        ward: 'Ward 06',
        status: 'Delivery Completed & Verified',
        statusType: 'completed',
        time: '42 mins ago',
        etaMinutes: 0,
        otpCode: '1092',
        message: '9,000L water dispensed at Kothrud Sump #2. Delivery verified by citizen representative.'
      }
    ];
  }, []);

  // Filtered arrival notifications
  const filteredNotifications = arrivalNotifications.filter(n => {
    if (notificationFilter === 'my_area') {
      const areaKeyword = selectedArea.split(' ')[0].toLowerCase();
      if (!n.area.toLowerCase().includes(areaKeyword)) return false;
    }
    if (notificationFilter === 'arriving') {
      if (n.statusType !== 'in_transit' && n.statusType !== 'arrived') return false;
    }
    if (notificationFilter === 'otps') {
      if (!n.otpCode) return false;
    }
    if (searchTankerQuery.trim()) {
      const q = searchTankerQuery.toLowerCase();
      return (
        n.tankerId.toLowerCase().includes(q) ||
        n.area.toLowerCase().includes(q) ||
        n.driverName.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: COMPLAINTS & SCARCITY ASSESSMENT WITH REQUIRED QUESTIONS */}
      {/* ========================================================================= */}
      {userTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 7 Cols: The Interactive Scarcity & Complaint Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    File Water Complaint & Scarcity Report
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your assessment feeds directly into the Municipal AI Fairness & Dispatch Engine.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full">
                  Area: {selectedArea}
                </span>
              </div>

              {complaintSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{complaintSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitComplaint} className="space-y-6">
                
                {/* 1. SCARCITY SEVERITY QUESTIONS */}
                <div className="space-y-4">
                  {/* QUESTION 1: Is your area currently facing water shortage? (Yes or No) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                        Is your area currently facing water shortage?
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {/* YES BUTTON */}
                      <button
                        type="button"
                        onClick={() => setFacingShortage('yes')}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                          facingShortage === 'yes'
                            ? 'bg-red-50 border-red-300 text-red-950 font-bold ring-2 ring-red-400/40 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <AlertTriangle className={`w-4 h-4 ${facingShortage === 'yes' ? 'text-red-600' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs block">Yes, Facing Shortage</span>
                            <span className="text-[10px] text-slate-500 font-normal">Active crisis or deficit</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          facingShortage === 'yes' ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300'
                        }`}>
                          {facingShortage === 'yes' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>

                      {/* NO BUTTON */}
                      <button
                        type="button"
                        onClick={() => setFacingShortage('no')}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                          facingShortage === 'no'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 ${facingShortage === 'no' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs block">No Shortage</span>
                            <span className="text-[10px] text-slate-500 font-normal">Normal regular supply</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          facingShortage === 'no' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {facingShortage === 'no' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* QUESTION 2: Water situation (no water, limited water, available water) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                        Water Situation in your locality?
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* OPTION A: NO WATER */}
                      <button
                        type="button"
                        onClick={() => setWaterSituation('no_water')}
                        className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                          waterSituation === 'no_water'
                            ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold ring-2 ring-rose-400/40 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🔴</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            waterSituation === 'no_water' ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                          }`}>
                            {waterSituation === 'no_water' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold block">No Water</span>
                          <span className="text-[10px] text-slate-500 font-normal leading-tight block">
                            Zero tap supply, dry storage & sumps
                          </span>
                        </div>
                      </button>

                      {/* OPTION B: LIMITED WATER */}
                      <button
                        type="button"
                        onClick={() => setWaterSituation('limited_water')}
                        className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                          waterSituation === 'limited_water'
                            ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400/40 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🟡</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            waterSituation === 'limited_water' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                          }`}>
                            {waterSituation === 'limited_water' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Limited Water</span>
                          <span className="text-[10px] text-slate-500 font-normal leading-tight block">
                            Low pressure, &lt;2 hrs/day irregular supply
                          </span>
                        </div>
                      </button>

                      {/* OPTION C: AVAILABLE WATER */}
                      <button
                        type="button"
                        onClick={() => setWaterSituation('available_water')}
                        className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                          waterSituation === 'available_water'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🟢</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            waterSituation === 'available_water' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {waterSituation === 'available_water' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Available Water</span>
                          <span className="text-[10px] text-slate-500 font-normal leading-tight block">
                            Sufficient regular municipal supply
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. REAL PROOF & EVIDENCE ATTACHMENT SECTION */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-sky-50/70 to-slate-50 border border-sky-200 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-xs font-bold">3</span>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <span>Attach Real Proof & Visual Evidence</span>
                          <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Verified Dispatch
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Upload real photos of dry sumps, taps, leaks, or water meter readings to expedite municipal dispatch.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="text-xs font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg">
                        {evidenceList.length} Proof{evidenceList.length !== 1 ? 's' : ''} Attached
                      </span>
                    </div>
                  </div>

                  {/* UPLOAD ACTIONS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Real Device File Upload Box */}
                    <div className="relative group p-4 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-white hover:bg-sky-50/40 transition cursor-pointer flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        id="proof-photo-upload"
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload photos or documents"
                      />
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Upload Photos from Device
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Drag & drop or browse JPG, PNG, WebP
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        + Auto Geo-Stamp Included
                      </div>
                    </div>

                    {/* Live Camera Snapshot Button */}
                    <button
                      type="button"
                      onClick={handleTakeCameraSnapshot}
                      className="p-4 rounded-xl border border-sky-200 hover:border-sky-400 bg-white hover:bg-sky-50/50 transition cursor-pointer flex flex-col items-center justify-center text-center group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Capture Live Photo
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Snap real-time photo of tank or tap
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-sky-600" />
                        Live Camera Capture
                      </div>
                    </button>
                  </div>

                  {/* 1-CLICK EVIDENCE SAMPLE PRESETS */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Quick Add Evidence Samples (Municipal Presets)
                      </span>
                      <span className="text-[10px] text-slate-400">Click to attach</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_EVIDENCE_PRESETS.map((preset) => {
                        const isAttached = evidenceList.some(item => item.name === preset.name);
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => isAttached ? handleRemoveEvidence(preset.id) : handleAddPresetEvidence(preset)}
                            className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group ${
                              isAttached
                                ? 'bg-sky-100/90 border-sky-400 ring-2 ring-sky-300'
                                : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/40'
                            }`}
                          >
                            <div className="relative h-16 w-full rounded-lg overflow-hidden bg-slate-100">
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1">
                                <span className="text-[9px] text-white font-bold truncate">
                                  {preset.tag}
                                </span>
                              </div>
                              {isAttached && (
                                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-slate-700 truncate">
                                {preset.name.replace('.jpg', '')}
                              </span>
                              <span className="text-slate-400">{preset.size}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ATTACHED PROOFS LIST & THUMBNAILS */}
                  {evidenceList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-sky-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                          Attached Proof Files ({evidenceList.length})
                        </span>
                        <span className="text-[10px] text-teal-800 font-semibold">
                          Click image to view high-res preview
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {evidenceList.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-3 shadow-xs hover:border-sky-400 transition"
                          >
                            <div
                              onClick={() => setPreviewImageModal(item)}
                              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {item.name}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                                  <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100">
                                    {item.tag}
                                  </span>
                                  <span>{item.size}</span>
                                </div>
                                {item.geoTag && (
                                  <div className="text-[9px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                                    <span>{item.geoTag}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveEvidence(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                              title="Remove proof"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SENSOR / WATER LEVEL METER & GPS CONTROLS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Water Tank / Sump Level Gauge */}
                    <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Gauge className="w-4 h-4 text-sky-600" />
                          <span>Sump Water Level Gauge</span>
                        </label>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                          sumpLevelReading <= 15 ? 'bg-rose-100 text-rose-800' : sumpLevelReading <= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sumpLevelReading}% {sumpLevelReading <= 15 ? '(Critical Dry)' : sumpLevelReading <= 40 ? '(Low)' : '(Moderate)'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={sumpLevelReading}
                        onChange={(e) => setSumpLevelReading(Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>0% (Empty)</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100% (Full)</span>
                      </div>
                    </div>

                    {/* Live GPS Verification Stamp */}
                    <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span>GPS Location Proof Stamp</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleRefreshGps}
                          disabled={isRefreshingGps}
                          className="text-[10px] font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshingGps ? 'animate-spin' : ''}`} />
                          <span>{isRefreshingGps ? 'Calibrating...' : 'Recalibrate'}</span>
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {gpsStamp.coords}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                          <span>Accuracy: {gpsStamp.accuracy}</span>
                          <span className="text-emerald-800 font-semibold">● Verified Live</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OPTIONAL SUPPORTING BILL & VOICE GRIEVANCE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Supporting Bill / Document */}
                    <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {supportingBillFile ? supportingBillFile.name : 'Attach Bill / Tanker Receipt'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {supportingBillFile ? supportingBillFile.size : 'Optional address/water tax proof'}
                          </div>
                        </div>
                      </div>

                      <label className="text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1.5 rounded-lg border border-sky-200 cursor-pointer shrink-0 transition">
                        <span>{supportingBillFile ? 'Change' : 'Attach'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const f = e.target.files[0];
                              setSupportingBillFile({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Voice Grievance Audio Note */}
                    <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isRecordingVoice ? 'bg-rose-100 text-rose-600 animate-pulse' : hasVoiceNote ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Mic className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {isRecordingVoice ? `Recording... (${voiceDuration}s)` : hasVoiceNote ? 'Voice Note Attached (12s)' : 'Record Voice Grievance'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {hasVoiceNote ? 'Recorded in local language' : 'Optional voice audio message'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleVoiceRecord}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer shrink-0 transition ${
                          isRecordingVoice
                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                            : hasVoiceNote
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isRecordingVoice ? 'Stop' : hasVoiceNote ? 'Re-record' : 'Record'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. GRIEVANCE CATEGORY & TANKER SELECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Issue Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    >
                      <option value="Water Shortage">Water Shortage & Scarcity</option>
                      <option value="Delayed Tanker">Delayed Tanker Arrival</option>
                      <option value="Water Quality">Water Quality / Contamination</option>
                      <option value="Inadequate Quantity">Inadequate Quantity Dispensed</option>
                      <option value="Driver Conduct">Driver Conduct / Irregularity</option>
                      <option value="Billing / Extortion">Illegal Charges / Extortion</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Specific Tanker Tag (Optional)
                    </label>
                    <select
                      value={selectedTankerForComplaint}
                      onChange={(e) => setSelectedTankerForComplaint(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    >
                      <option value="None / General Area">None / General Locality Issue</option>
                      {tankers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.id} - Driver: {t.driverName} ({t.capacity.toLocaleString()} L)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. COMPLAINT DETAILS & PROMPT CHIPS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Complaint & Grievance Description <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {complaintDescription.length} characters
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    placeholder="Describe the water issue in detail (e.g. Community sump completely dried up 2 days ago, tanker did not arrive in morning slot, high TDS murky water)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400 font-medium"
                    required
                  ></textarea>

                  {/* Quick Description Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold self-center mr-1">
                      Quick suggestions:
                    </span>
                    {[
                      'Sump 0% dry for 48 hrs',
                      'High turbidity brownish water',
                      'Morning tanker delayed >2 hrs',
                      'Severe drinking shortage for 250 families'
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setComplaintDescription(prev => prev ? `${prev} - ${suggestion}` : suggestion)}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 px-2 py-0.5 rounded-md border border-slate-200 transition cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. SUBMIT ACTION BUTTON WITH EVIDENCE BADGE */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingComplaint || !complaintDescription.trim()}
                    className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmittingComplaint
                        ? 'Transmitting Evidence & Report to Municipal Authority...'
                        : `Submit Grievance & Scarcity Report (${evidenceList.length} Proof${evidenceList.length !== 1 ? 's' : ''} Attached)`}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    🔒 High Priority Municipal Ticket with verified geo-timestamp generated instantly.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right 5 Cols: Real-time Grievance Log & Scarcity Summary */}
          <div className="lg:col-span-5 space-y-5">
            {/* Scarcity Status Metric for Selected Locality */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locality Water Health</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  facingShortage === 'yes' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {facingShortage === 'yes' ? '● Shortage Flagged' : '● Supply Stable'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{selectedArea}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Current Shortage State:</span>
                  <span className="font-bold text-slate-900">{facingShortage === 'yes' ? 'Yes (Active Shortage)' : 'No Shortage'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Situation Status:</span>
                  <span className="font-bold capitalize text-slate-900">{waterSituation.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sump Storage Gauge:</span>
                  <span className="font-bold text-slate-900">{sumpLevelReading}% ({sumpLevelReading <= 15 ? 'Critical' : sumpLevelReading <= 40 ? 'Low' : 'Adequate'})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GPS Precision Stamp:</span>
                  <span className="font-mono font-bold text-teal-800 text-[11px]">{gpsStamp.coords}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Registered Mobile:</span>
                  <span className="font-mono text-slate-900">{mobileNumber} {isOtpVerified && '✓'}</span>
                </div>
              </div>
            </div>

            {/* Attached Evidence Snapshot in Right Column */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Current Evidence Docket</h3>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {evidenceList.length} Verified
                </span>
              </div>

              {evidenceList.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs font-semibold">
                  No photographic proof attached yet. Use the upload box to attach photos.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {evidenceList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPreviewImageModal(item)}
                      className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-1.5">
                        <span className="text-[10px] text-white font-bold truncate">
                          {item.tag}
                        </span>
                        <span className="text-[9px] text-slate-300 truncate">
                          {item.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent Complaints in Your Area</h3>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {complaints.length} Logged
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto space-y-2.5 pr-1">
                {complaints.slice(0, 5).map((comp) => (
                  <div key={comp.id} className="pt-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{comp.id} · {comp.issueType}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        comp.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {comp.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Area: {comp.area}</span>
                      <span>{comp.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: TANKER ARRIVAL NOTIFICATIONS CENTER                        */}
      {/* ========================================================================= */}
      {userTab === 'notifications' && (
        <div className="space-y-6">
          
          {/* Header Banner & Filters */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Live Tanker Arrival Notifications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time alerts, arrival countdowns, driver dispatch telemetry, and recipient OTPs.
                  </p>
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setNotificationFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    notificationFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Alerts ({arrivalNotifications.length})
                </button>
                <button
                  onClick={() => setNotificationFilter('my_area')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    notificationFilter === 'my_area'
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  My Area ({selectedArea.split(' ')[0]})
                </button>
                <button
                  onClick={() => setNotificationFilter('arriving')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    notificationFilter === 'arriving'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Arriving Soon
                </button>
                <button
                  onClick={() => setNotificationFilter('otps')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    notificationFilter === 'otps'
                      ? 'bg-sky-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Delivery OTPs
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTankerQuery}
                onChange={(e) => setSearchTankerQuery(e.target.value)}
                placeholder="Search by Tanker ID (e.g. TK-104), driver name, locality or keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* List of Arrival Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  notif.area.toLowerCase().includes(selectedArea.split(' ')[0].toLowerCase())
                    ? 'border-teal-300 ring-2 ring-teal-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                        {notif.tankerId}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {notif.capacity.toLocaleString()} L
                      </span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      notif.statusType === 'arrived'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : notif.statusType === 'in_transit'
                        ? 'bg-teal-50 text-teal-800 border-teal-200 animate-pulse'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {notif.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{notif.area} ({notif.ward})</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Driver: <strong>{notif.driverName}</strong></span>
                    <a href={`tel:${notif.driverPhone}`} className="text-teal-700 font-bold hover:underline">
                      {notif.driverPhone}
                    </a>
                  </div>

                  {/* OTP Code Display */}
                  {notif.otpCode && (
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900">
                        <Key className="w-3.5 h-3.5 text-teal-700" />
                        <span>Delivery Verification Code:</span>
                      </div>
                      <span className="font-mono text-sm font-black text-teal-800 tracking-wider bg-white px-2 py-0.5 rounded border border-teal-300">
                        {notif.otpCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>ETA: {notif.etaMinutes > 0 ? `${notif.etaMinutes} mins` : 'Arrived at Tap'}</span>
                    <span>{notif.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: REQUEST WATER                                             */}
      {/* ========================================================================= */}
      {userTab === 'requestWater' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Submit Water Request</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill the municipal water demand request. Vulnerability and shortage metrics are scored automatically.
              </p>
            </div>
            <CitizenRequestForm
              onSuccess={(reqId) => {
                setCitizenActiveRequestId(reqId);
                setUserTab('trackTanker');
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: TRACK TANKER GPS MAP                                      */}
      {/* ========================================================================= */}
      {userTab === 'trackTanker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Live Tanker GPS Telemetry</h2>
                <p className="text-xs text-slate-500">
                  Tracking assigned municipal water carrier for {selectedArea}.
                </p>
              </div>
              {assignedTanker && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                    {assignedTanker.id} · Driver: {assignedTanker.driverName}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4 h-[500px]">
              <InteractiveMap />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB CONTENT: MY REQUESTS HISTORY                                       */}
      {/* ========================================================================= */}
      {userTab === 'myRequests' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">My Water Requests History</h2>
          <div className="divide-y divide-slate-100">
            {requests.map(req => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{req.id}</span>
                    <span className="text-xs font-bold text-slate-700">{req.area}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {req.quantity.toLocaleString()} L
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Requested: {req.requestTime} · Priority Score: {req.priorityScore}/100
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {req.status}
                  </span>
                  {req.otpCode && (
                    <span className="font-mono text-xs font-black bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      OTP: {req.otpCode}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. HIGH-DEFINITION EVIDENCE PROOF PREVIEW MODAL                           */}
      {/* ========================================================================= */}
      {previewImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {previewImageModal.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100">
                      {previewImageModal.tag}
                    </span>
                    <span>•</span>
                    <span>{previewImageModal.size}</span>
                    <span>•</span>
                    <span>{previewImageModal.timestamp}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.name}
                className="w-full h-full max-h-[60vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Municipal Verified Field Evidence</span>
                </div>
                {previewImageModal.geoTag && (
                  <div className="text-[11px] font-mono text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>GPS Stamp: {previewImageModal.geoTag}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveEvidence(previewImageModal.id);
                    setPreviewImageModal(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Proof</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImageModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
