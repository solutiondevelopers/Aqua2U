/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculatePriorityScore, PriorityEvaluationInput } from '../utils/priorityScorer';
import { 
  MapPin, 
  Navigation, 
  Droplet, 
  AlertTriangle, 
  Camera, 
  CheckCircle, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Users, 
  Building2, 
  GraduationCap,
  HeartPulse,
  Home,
  Check,
  Send,
  HelpCircle,
  X,
  FileCheck,
  Info,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface CitizenRequestFormProps {
  onSuccess?: (requestId: string) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const SAMPLE_EVIDENCE_PHOTOS = [
  {
    label: 'Hospital Storage Tank Low',
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Dry Community Sump',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'School Water Dispenser Empty',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80'
  }
];

export const CitizenRequestForm: React.FC<CitizenRequestFormProps> = ({
  onSuccess,
  onCancel,
  isModal = false
}) => {
  const { addNewRequest, setSelectedRequestId, generateAIRecommendation, setActiveTab } = useApp();

  // Progressive Step state (1: Basic Info, 2: Water Status, 3: Org-Specific, 4: Emergency, 5: Evidence, 6: Review & Submit)
  const [activeStep, setActiveStep] = useState<number>(1);

  // 1. BASIC INFORMATION
  const [requestType, setRequestType] = useState<'Hospital' | 'School / College' | 'Residential Society' | 'Slum / Informal Settlement' | 'Other'>('Hospital');
  const [otherRequestType, setOtherRequestType] = useState('');
  const [contactName, setContactName] = useState('Dr. Prakash Jadhav (Medical Superintendent)');
  const [contactPhone, setContactPhone] = useState('+91 98220 11984');
  const [area, setArea] = useState('Baner');
  const [ward, setWard] = useState('Ward 09 - Aundh-Baner');
  const [address, setAddress] = useState('Plot 12, Baner Main Road, near Medipoint');

  // GPS Auto-detect
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracyM: number; timestamp: string } | null>({
    lat: 18.5590,
    lng: 73.7868,
    accuracyM: 3.8,
    timestamp: new Date().toLocaleTimeString()
  });

  // 2. WATER STATUS (COMMON & NUMERICAL)
  const [waterAvailability, setWaterAvailability] = useState<'No Water (0%)' | 'Less than 10%' | '10–25%' | '25–50%' | 'More than 50%'>('Less than 10%');
  const [waterStorageCapacityLiters, setWaterStorageCapacityLiters] = useState<number>(100000);
  const [currentWaterAvailableLiters, setCurrentWaterAvailableLiters] = useState<number>(8000);
  const [quantityLiters, setQuantityLiters] = useState<number>(20000);
  const [lastDelivery, setLastDelivery] = useState<'Today' | 'Yesterday' | '2 Days Ago' | 'More than 3 Days Ago' | 'Never'>('2 Days Ago');

  // 3. HOSPITAL SPECIFIC FIELDS
  const [hospitalId, setHospitalId] = useState('H001');
  const [hospitalName, setHospitalName] = useState('Baner General Hospital');
  const [totalBeds, setTotalBeds] = useState<number>(300);
  const [hospitalType, setHospitalType] = useState<'Government' | 'Private'>('Government');
  const [hospitalEmergencyType, setHospitalEmergencyType] = useState<'Medical Emergency' | 'ICU Requirement' | 'Operation / Surgery Requirement' | 'Other'>('ICU Requirement');
  const [otherHospitalEmergency, setOtherHospitalEmergency] = useState('');

  // 4. SCHOOL / COLLEGE SPECIFIC FIELDS
  const [schoolName, setSchoolName] = useState('Shivaji Memorial High School & Junior College');
  const [isSchoolOpenToday, setIsSchoolOpenToday] = useState<boolean>(true);
  const [studentsPresentToday, setStudentsPresentToday] = useState<number>(650);
  const [isMidDayMealRunning, setIsMidDayMealRunning] = useState<'Yes' | 'No' | 'Not Applicable'>('Yes');
  const [areToiletsFunctional, setAreToiletsFunctional] = useState<'Yes' | 'No' | 'Partially'>('No');
  const [schoolUrgentRequirementType, setSchoolUrgentRequirementType] = useState<'Drinking Water' | 'Mid-Day Meal' | 'Toilets / Sanitation' | 'Other'>('Toilets / Sanitation');
  const [otherSchoolUrgentType, setOtherSchoolUrgentType] = useState('');

  // 5. CITIZEN / RESIDENTIAL / SLUM SPECIFIC FIELDS
  const [peopleAffected, setPeopleAffected] = useState<number>(1800);
  const [waterLastDuration, setWaterLastDuration] = useState<'Less than 2 Hours' | '2–6 Hours' | '6–12 Hours' | '12–24 Hours' | 'More than 24 Hours'>('Less than 2 Hours');
  const [waterSupplyStatus, setWaterSupplyStatus] = useState<'Completely Stopped' | 'Partial Supply' | 'Irregular Supply' | 'Normal Supply'>('Completely Stopped');
  const [alternativeSource, setAlternativeSource] = useState<'No' | 'Borewell' | 'Private Tanker' | 'Stored Water' | 'Other'>('No');
  const [otherAlternativeSource, setOtherAlternativeSource] = useState('');

  // 6. EMERGENCY SITUATION (GENERAL)
  const [isEmergency, setIsEmergency] = useState<boolean>(true);
  const [emergencyType, setEmergencyType] = useState<'Medical Emergency' | 'Fire' | 'Heat Wave' | 'Water Contamination' | 'Other'>('Medical Emergency');
  const [otherEmergencyType, setOtherEmergencyType] = useState('');
  const [urgencyReason, setUrgencyReason] = useState(
    'ICU ward oxygen concentrators & surgical sterilization units requiring continuous water supply. Ground storage is below 8%.'
  );

  // 7. EVIDENCE
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState<string>(SAMPLE_EVIDENCE_PHOTOS[0].url);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Switch request type presets for ease of testing
  const handleSelectRequestType = (type: 'Hospital' | 'School / College' | 'Residential Society' | 'Slum / Informal Settlement' | 'Other') => {
    setRequestType(type);
    if (type === 'Hospital') {
      setContactName('Dr. Prakash Jadhav (Medical Superintendent)');
      setContactPhone('+91 98220 11984');
      setArea('Baner');
      setWard('Ward 09 - Aundh-Baner');
      setAddress('Plot 12, Baner Main Road, near Medipoint');
      setHospitalId('H001');
      setHospitalName('Baner General Hospital');
      setTotalBeds(300);
      setHospitalType('Government');
      setWaterStorageCapacityLiters(100000);
      setCurrentWaterAvailableLiters(8000);
      setWaterAvailability('Less than 10%');
      setQuantityLiters(20000);
      setLastDelivery('2 Days Ago');
      setIsEmergency(true);
      setHospitalEmergencyType('ICU Requirement');
      setUrgencyReason('Only 8% water remaining in hospital sump. ICU and emergency surgical wards at risk.');
      setEvidencePhotoUrl(SAMPLE_EVIDENCE_PHOTOS[0].url);
    } else if (type === 'School / College') {
      setContactName('Mrs. Vandana Kulkarni (Principal)');
      setContactPhone('+91 94225 67890');
      setArea('Kothrud');
      setWard('Ward 12 - Kothrud-Bavdhan');
      setAddress('Paud Road, near MIT Circle, Kothrud');
      setSchoolName('Shivaji Memorial High School & Junior College');
      setIsSchoolOpenToday(true);
      setStudentsPresentToday(650);
      setIsMidDayMealRunning('Yes');
      setAreToiletsFunctional('No');
      setSchoolUrgentRequirementType('Toilets / Sanitation');
      setWaterStorageCapacityLiters(30000);
      setCurrentWaterAvailableLiters(2500);
      setWaterAvailability('Less than 10%');
      setQuantityLiters(10000);
      setLastDelivery('2 Days Ago');
      setIsEmergency(true);
      setUrgencyReason('650 students present. Toilets are non-functional and Mid-Day Meal cooking is at risk.');
      setEvidencePhotoUrl(SAMPLE_EVIDENCE_PHOTOS[2].url);
    } else if (type === 'Slum / Informal Settlement') {
      setContactName('Sunita Gaikwad (Community Head)');
      setContactPhone('+91 98210 44321');
      setArea('Shivaji Nagar Settlement');
      setWard('Ward 14 - Central');
      setAddress('Plot 44, Gali No. 3, Shivaji Nagar');
      setPeopleAffected(3500);
      setWaterAvailability('No Water (0%)');
      setWaterLastDuration('Less than 2 Hours');
      setWaterSupplyStatus('Completely Stopped');
      setAlternativeSource('No');
      setQuantityLiters(12000);
      setLastDelivery('More than 3 Days Ago');
      setIsEmergency(true);
      setEmergencyType('Medical Emergency');
      setUrgencyReason('Piped water cut for 4 days. 3,500 residents with zero potable water.');
      setEvidencePhotoUrl(SAMPLE_EVIDENCE_PHOTOS[1].url);
    } else {
      setContactName('Sanjay More (Secretary)');
      setContactPhone('+91 98810 23456');
      setArea('Hadapsar Magarpatta');
      setWard('Ward 18 - Hadapsar');
      setAddress('Tower B, Marvel Residency, Hadapsar');
      setPeopleAffected(1200);
      setWaterAvailability('10–25%');
      setWaterLastDuration('2–6 Hours');
      setWaterSupplyStatus('Partial Supply');
      setAlternativeSource('Borewell');
      setQuantityLiters(10000);
      setLastDelivery('Yesterday');
      setIsEmergency(false);
      setUrgencyReason('Low municipal pressure in overhead tanks.');
      setEvidencePhotoUrl(SAMPLE_EVIDENCE_PHOTOS[1].url);
    }
  };

  // GPS Auto-detect logic
  const handleAutoDetectGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracyM: Number(pos.coords.accuracy.toFixed(1)),
            timestamp: new Date().toLocaleTimeString()
          });
          setIsDetectingGps(false);
        },
        () => {
          setGpsCoords({
            lat: 18.5314,
            lng: 73.8446,
            accuracyM: 5.0,
            timestamp: new Date().toLocaleTimeString()
          });
          setIsDetectingGps(false);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  // Compute live priority evaluation
  const priorityEvaluation = useMemo(() => {
    const input: PriorityEvaluationInput = {
      requestType,
      otherRequestType,
      waterAvailability,
      waterLastDuration,
      waterSupplyStatus,
      peopleAffected: requestType === 'Hospital' 
        ? (Number(totalBeds) * 3) 
        : requestType === 'School / College' 
        ? Number(studentsPresentToday) 
        : Number(peopleAffected) || 100,
      alternativeSource,
      otherAlternativeSource,
      lastDelivery,
      isEmergency,
      emergencyType,
      otherEmergencyType,
      quantityLiters: Number(quantityLiters) || 1000,
      
      // Hospital
      hospitalId,
      hospitalName,
      totalBeds: Number(totalBeds) || 100,
      hospitalType,
      waterStorageCapacityLiters: Number(waterStorageCapacityLiters) || 100000,
      currentWaterAvailableLiters: Number(currentWaterAvailableLiters) || 0,
      hospitalEmergencyType,
      otherHospitalEmergency,

      // School
      schoolName,
      isSchoolOpenToday,
      studentsPresentToday: Number(studentsPresentToday) || 300,
      isMidDayMealRunning,
      areToiletsFunctional,
      schoolUrgentRequirementType,
      otherSchoolUrgentType
    };

    return calculatePriorityScore(input);
  }, [
    requestType,
    otherRequestType,
    waterAvailability,
    waterLastDuration,
    waterSupplyStatus,
    peopleAffected,
    alternativeSource,
    otherAlternativeSource,
    lastDelivery,
    isEmergency,
    emergencyType,
    otherEmergencyType,
    quantityLiters,
    hospitalId,
    hospitalName,
    totalBeds,
    hospitalType,
    waterStorageCapacityLiters,
    currentWaterAvailableLiters,
    hospitalEmergencyType,
    otherHospitalEmergency,
    schoolName,
    isSchoolOpenToday,
    studentsPresentToday,
    isMidDayMealRunning,
    areToiletsFunctional,
    schoolUrgentRequirementType,
    otherSchoolUrgentType
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `WR-${Math.floor(2100 + Math.random() * 899)}`;
    const effectivePopulation = requestType === 'Hospital'
      ? (Number(totalBeds) * 3)
      : requestType === 'School / College'
      ? Number(studentsPresentToday)
      : Number(peopleAffected);

    const effectiveName = requestType === 'Hospital'
      ? `${hospitalName} (${hospitalId})`
      : requestType === 'School / College'
      ? schoolName
      : contactName;

    // Create the full request object
    addNewRequest({
      id: generatedId,
      area: area || 'Central Pune',
      ward: ward || 'Ward 14 - Central',
      address: address || area,
      quantity: Number(quantityLiters) || 10000,
      population: effectivePopulation || 1000,
      priority: priorityEvaluation.mappedPriority,
      priorityScore: priorityEvaluation.score,
      priorityLevel: priorityEvaluation.level,
      requestTime: 'Just now',
      status: 'Under Review',
      urgencyReason: urgencyReason,
      vulnerability: priorityEvaluation.score >= 71 ? 'Critical' : priorityEvaluation.score >= 51 ? 'High' : 'Medium',
      daysSinceLastDelivery: lastDelivery === 'Never' ? 7 : lastDelivery === 'More than 3 Days Ago' ? 4 : lastDelivery === '2 Days Ago' ? 2 : 1,
      
      // Request details
      requestType,
      otherRequestType,
      waterAvailability,
      waterLastDuration,
      waterSupplyStatus,
      alternativeSource,
      otherAlternativeSource,
      lastDelivery,
      isEmergency,
      emergencyType: requestType === 'Hospital' 
        ? (hospitalEmergencyType === 'ICU Requirement' ? 'Medical Emergency' : emergencyType)
        : emergencyType,
      otherEmergencyType,
      evidencePhotoUrl,
      gpsCaptured: gpsCoords || { lat: 18.5314, lng: 73.8446, accuracyM: 5.0, timestamp: new Date().toLocaleTimeString() },

      // Hospital specific
      hospitalId,
      hospitalName,
      totalBeds: Number(totalBeds),
      hospitalType,
      waterStorageCapacityLiters: Number(waterStorageCapacityLiters),
      currentWaterAvailableLiters: Number(currentWaterAvailableLiters),
      hospitalEmergencyType,
      otherHospitalEmergency,

      // School specific
      schoolName,
      isSchoolOpenToday,
      studentsPresentToday: Number(studentsPresentToday),
      isMidDayMealRunning,
      areToiletsFunctional,
      schoolUrgentRequirementType,
      otherSchoolUrgentType,

      // AI Decision-Support
      aiRecommendation: priorityEvaluation.aiRecommendation,
      aiReasons: priorityEvaluation.reasons,

      // Admin Review tracking
      adminStatus: 'Pending',
      adminDecision: 'Under Review',
      adminNotes: 'Application lodged through standard portal. Awaiting PMC Officer review.',

      contactName: effectiveName,
      contactPhone: contactPhone || '+91 98000 00000',
      locationCoords: {
        x: 50,
        y: 50,
        lat: gpsCoords?.lat || 18.5314,
        lng: gpsCoords?.lng || 73.8446
      },
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(generatedId);
      if (onSuccess) {
        onSuccess(generatedId);
      }
    }, 900);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-5 animate-in fade-in max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
            Request Transmitted to Municipal Control Center
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Water Tanker Application Lodged
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your application is registered under official tracking reference:
          </p>
          <div className="inline-block bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-lg font-mono font-bold text-slate-900 mt-2">
            {submittedId}
          </div>
        </div>

        {/* AI Priority & Decision Support Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-sky-300">AI Priority Calculation Result</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              priorityEvaluation.level === 'CRITICAL' ? 'bg-rose-500 text-white' :
              priorityEvaluation.level === 'HIGH' ? 'bg-amber-500 text-slate-950' :
              'bg-sky-500 text-white'
            }`}>
              {priorityEvaluation.level} ({priorityEvaluation.score}/100)
            </span>
          </div>
          <p className="text-xs text-slate-300 italic">
            "{priorityEvaluation.aiRecommendation}"
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Note: Municipal Administrative Officers have final authorization authority. You can track status in real-time.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              setActiveStep(1);
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition"
          >
            Submit Another Request
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRequestId(submittedId);
              generateAIRecommendation(submittedId);
              setActiveTab('requests');
            }}
            className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <span>View in Municipal Request Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Water Status' },
    { 
      num: 3, 
      title: requestType === 'Hospital' 
        ? 'Hospital Details' 
        : requestType === 'School / College' 
        ? 'School Details' 
        : 'Beneficiary Scale' 
    },
    { num: 4, title: 'Emergency' },
    { num: 5, title: 'Evidence & GPS' },
    { num: 6, title: 'Review & AI Score' }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${isModal ? '' : 'max-w-4xl mx-auto'}`}>
      {/* Form Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
            <Droplet className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Municipal Water Tanker Application Form
            </h2>
            <p className="text-xs text-sky-200/80">
              Pune Municipal Corporation (PMC) · AI Decision Support & Equitable Dispatch
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* PROGRESSIVE STEP INDICATOR TABS */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[580px] gap-2">
          {stepsList.map((step) => {
            const isCurrent = activeStep === step.num;
            const isDone = activeStep > step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-sky-800 text-white shadow-xs'
                    : isDone
                    ? 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                    : 'text-slate-500 hover:bg-slate-200/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white text-sky-900' : isDone ? 'bg-sky-700 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {isDone ? '✓' : step.num}
                </span>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM BODY */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 text-xs text-slate-800">
        {/* ========================================================================= */}
        {/* STEP 1: BASIC INFORMATION */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 1 — Beneficiary & Category Type</h3>
                <p className="text-slate-500 text-[11px]">Select your applicant entity type to reveal relevant municipal questions.</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Step 1 of 6
              </span>
            </div>

            {/* Request Type Selector Cards */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Request Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { type: 'Hospital', label: 'Hospital / Clinic', icon: HeartPulse, desc: 'Beds, ICU & Surgery' },
                  { type: 'School / College', label: 'School / College', icon: GraduationCap, desc: 'Students & Toilets' },
                  { type: 'Residential Society', label: 'Residential Society', icon: Building2, desc: 'Apartments & Sumps' },
                  { type: 'Slum / Informal Settlement', label: 'Slum Settlement', icon: Home, desc: 'High Vulnerability' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = requestType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleSelectRequestType(item.type as any)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-600/20 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-sky-700" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Applicant Contact & Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Person / Official In-Charge *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Dr. Prakash Jadhav or Sanjay More"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mobile Phone (OTP verification) *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98220 11984"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Area / Locality *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Baner, Kothrud, Shivaji Nagar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Municipal Ward Zone *</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 cursor-pointer"
                >
                  <option value="Ward 09 - Aundh-Baner">Ward 09 - Aundh-Baner</option>
                  <option value="Ward 12 - Kothrud-Bavdhan">Ward 12 - Kothrud-Bavdhan</option>
                  <option value="Ward 14 - Central">Ward 14 - Central / Shivaji Nagar</option>
                  <option value="Ward 18 - Hadapsar">Ward 18 - Hadapsar-Mundhwa</option>
                  <option value="Ward 05 - Ahmednagar Rd">Ward 05 - Ahmednagar Rd-Wadgaon Sheri</option>
                  <option value="Ward 21 - Dhankawadi-Sahakarnagar">Ward 21 - Dhankawadi-Sahakarnagar</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Detailed Landmark / Delivery Address *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Gate number, building name, nearest chowk or landmark for tanker navigation..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            {/* GPS Auto-Detect Banner */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">GPS Coordinates:</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng} (Accuracy ±${gpsCoords.accuracyM}m)` : 'Not yet captured'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoDetectGps}
                disabled={isDetectingGps}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting...' : 'Auto Detect GPS'}</span>
              </button>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to Water Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WATER STATUS & STORAGE RESERVES */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 2 — Water Status & Storage Reserve</h3>
                <p className="text-slate-500 text-[11px]">Specify remaining storage and delivery gap for accurate urgency weighting.</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Step 2 of 6
              </span>
            </div>

            {/* Water Availability Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Current Water Availability in Storage *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { value: 'No Water (0%)', label: 'No Water (0%)', badge: 'Critical' },
                  { value: 'Less than 10%', label: 'Less than 10%', badge: 'Acute' },
                  { value: '10–25%', label: '10–25%', badge: 'Low' },
                  { value: '25–50%', label: '25–50%', badge: 'Moderate' },
                  { value: 'More than 50%', label: 'More than 50%', badge: 'Adequate' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setWaterAvailability(item.value as any)}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                      waterAvailability === item.value
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Liters Storage Capacity & Available Liters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Water Storage Capacity (Liters) *</label>
                <input
                  type="number"
                  min={500}
                  value={waterStorageCapacityLiters}
                  onChange={(e) => setWaterStorageCapacityLiters(Number(e.target.value))}
                  placeholder="e.g. 100000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Current Water Available (Liters) *</label>
                <input
                  type="number"
                  min={0}
                  value={currentWaterAvailableLiters}
                  onChange={(e) => setCurrentWaterAvailableLiters(Number(e.target.value))}
                  placeholder="e.g. 8000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Requested Tanker Quantity (Liters) *</label>
                <select
                  value={quantityLiters}
                  onChange={(e) => setQuantityLiters(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 cursor-pointer"
                >
                  <option value={5000}>5,000 Liters (Mini Tanker)</option>
                  <option value={10000}>10,000 Liters (Standard Tanker)</option>
                  <option value={15000}>15,000 Liters (Heavy Tanker)</option>
                  <option value={20000}>20,000 Liters (Dual Tanker Multi-Trip)</option>
                </select>
              </div>
            </div>

            {/* Last Water Supply / Tanker Delivery */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Last Water Supply / Tanker Delivery *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['Today', 'Yesterday', '2 Days Ago', 'More than 3 Days Ago', 'Never'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLastDelivery(opt as any)}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition ${
                      lastDelivery === opt
                        ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to {requestType === 'Hospital' ? 'Hospital Details' : requestType === 'School / College' ? 'School Details' : 'Beneficiary Metrics'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ORGANIZATION-SPECIFIC INFORMATION (CONDITIONAL) */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* ---------------- 3.1 HOSPITAL INFORMATION ---------------- */}
            {requestType === 'Hospital' && (
              <div className="space-y-4 bg-sky-50/50 p-4 rounded-2xl border border-sky-200">
                <div className="border-b border-sky-200 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">HOSPITAL INFORMATION</h3>
                      <p className="text-slate-500 text-[11px]">Healthcare specific parameters for patient care & ICU continuity.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Hospital Mode Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Hospital ID *</label>
                    <input
                      type="text"
                      required
                      value={hospitalId}
                      onChange={(e) => setHospitalId(e.target.value)}
                      placeholder="e.g. H001"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Hospital Name *</label>
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. Baner General Hospital"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Total Inpatient Beds *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={totalBeds}
                      onChange={(e) => setTotalBeds(Number(e.target.value))}
                      placeholder="e.g. 300"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Hospital Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Government', 'Private'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setHospitalType(type as any)}
                          className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                            hospitalType === type
                              ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-200 text-slate-600 space-y-1">
                  <span className="font-bold text-sky-900 block text-xs">Healthcare Water Demand Guideline:</span>
                  <p className="text-[11px]">
                    PMC standard quota for tertiary hospitals is 450 Liters per bed/day (including hemodialysis, operation theatres, and sterilization units).
                  </p>
                </div>
              </div>
            )}

            {/* ---------------- 3.2 SCHOOL / COLLEGE INFORMATION ---------------- */}
            {requestType === 'School / College' && (
              <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <div className="border-b border-amber-200 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-700" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">SCHOOL INFORMATION</h3>
                      <p className="text-slate-500 text-[11px]">Educational institution student safety, hygiene, and mid-day meal metrics.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    School Mode Active
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">School / College Name *</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Shivaji Memorial High School & Junior College"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Is the school open today? *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Yes (Open)', val: true },
                        { label: 'No (Closed)', val: false }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setIsSchoolOpenToday(item.val)}
                          className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                            isSchoolOpenToday === item.val
                              ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">How many students are present today? *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={studentsPresentToday}
                      onChange={(e) => setStudentsPresentToday(Number(e.target.value))}
                      placeholder="e.g. 650"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Is Mid-Day Meal currently running? *</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Yes', 'No', 'Not Applicable'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setIsMidDayMealRunning(opt as any)}
                          className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                            isMidDayMealRunning === opt
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Are toilets functional? *</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Yes', 'No', 'Partially'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAreToiletsFunctional(opt as any)}
                          className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                            areToiletsFunctional === opt
                              ? opt === 'No' ? 'bg-rose-600 text-white border-rose-600' : 'bg-sky-700 text-white border-sky-700'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 3.3 CITIZEN / RESIDENTIAL / SLUM INFORMATION ---------------- */}
            {requestType !== 'Hospital' && requestType !== 'School / College' && (
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-700" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">RESIDENTIAL / COMMUNITY SHORTAGE METRICS</h3>
                      <p className="text-slate-500 text-[11px]">Community scale and alternative source dependency metrics.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                    Community Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Number of Residents / People Affected *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={peopleAffected}
                      onChange={(e) => setPeopleAffected(Number(e.target.value))}
                      placeholder="e.g. 1800"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Duration Current Water Will Last *</label>
                    <select
                      value={waterLastDuration}
                      onChange={(e) => setWaterLastDuration(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 cursor-pointer"
                    >
                      <option value="Less than 2 Hours">Less than 2 Hours (Urgent Exhaustion)</option>
                      <option value="2–6 Hours">2–6 Hours</option>
                      <option value="6–12 Hours">6–12 Hours</option>
                      <option value="12–24 Hours">12–24 Hours</option>
                      <option value="More than 24 Hours">More than 24 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Municipal Piped Supply Status *</label>
                    <select
                      value={waterSupplyStatus}
                      onChange={(e) => setWaterSupplyStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 cursor-pointer"
                    >
                      <option value="Completely Stopped">Completely Stopped</option>
                      <option value="Partial Supply">Partial Supply (Low Pressure)</option>
                      <option value="Irregular Supply">Irregular / Contaminated</option>
                      <option value="Normal Supply">Normal Supply</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Alternative Water Source *</label>
                    <select
                      value={alternativeSource}
                      onChange={(e) => setAlternativeSource(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600 cursor-pointer"
                    >
                      <option value="No">No Alternative Source (100% Dependent on Tanker)</option>
                      <option value="Borewell">Borewell (Low Yield / Dry)</option>
                      <option value="Private Tanker">Private Tanker (Unaffordable / Delayed)</option>
                      <option value="Stored Water">Stored Water</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation */}
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to Emergency Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: EMERGENCY & URGENCY DETAILS (CONDITIONAL) */}
        {/* ========================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 4 — Emergency & Critical Situation Assessment</h3>
                <p className="text-slate-500 text-[11px]">Emergency flags elevate algorithm priority score and dispatch queue.</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Step 4 of 6
              </span>
            </div>

            {/* Emergency Toggle */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isEmergency ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Is there an Emergency / Critical Situation?
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Flagging emergency triggers instant validation checks in the PMC control dashboard.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmergency(true)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    isEmergency
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Yes (Emergency)
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmergency(false)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    !isEmergency
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  No (Normal)
                </button>
              </div>
            </div>

            {/* Conditional Emergency Details based on Request Type */}
            {isEmergency && (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                {/* Hospital Emergency Options */}
                {requestType === 'Hospital' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-rose-950">Hospital Critical Requirement Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Medical Emergency',
                        'ICU Requirement',
                        'Operation / Surgery Requirement',
                        'Other'
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setHospitalEmergencyType(opt as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                            hospitalEmergencyType === opt
                              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                              : 'bg-white border-rose-200 text-rose-900 hover:bg-rose-100/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* School Emergency Options */}
                {requestType === 'School / College' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-amber-950">School Urgent Requirement Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Drinking Water',
                        'Mid-Day Meal',
                        'Toilets / Sanitation',
                        'Other'
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSchoolUrgentRequirementType(opt as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                            schoolUrgentRequirementType === opt
                              ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                              : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-100/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citizen / Slum Emergency Options */}
                {requestType !== 'Hospital' && requestType !== 'School / College' && (
                  <div className="space-y-1.5">
                    <label className="font-bold text-rose-950">Community Emergency Nature *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        'Medical Emergency',
                        'Fire',
                        'Heat Wave',
                        'Water Contamination',
                        'Other'
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setEmergencyType(opt as any)}
                          className={`p-2 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                            emergencyType === opt
                              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                              : 'bg-white border-rose-200 text-rose-900 hover:bg-rose-100/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-rose-950">Urgency Justification / Critical Situation Note *</label>
                  <textarea
                    rows={2}
                    value={urgencyReason}
                    onChange={(e) => setUrgencyReason(e.target.value)}
                    placeholder="Provide specific operational or human impact details for the reviewing administrative officer..."
                    className="w-full bg-white border border-rose-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}

            {/* Step Navigation */}
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to Evidence & Geotag</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: EVIDENCE & GEOTAGGED PHOTO */}
        {/* ========================================================================= */}
        {activeStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 5 — Photographic Shortage Evidence</h3>
                <p className="text-slate-500 text-[11px]">Upload or select photographic evidence showing empty tanks or sumps.</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Step 5 of 6
              </span>
            </div>

            {/* Evidence Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Select or Upload Geotagged Shortage Photo *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_EVIDENCE_PHOTOS.map((photo) => {
                  const isSelected = evidencePhotoUrl === photo.url;
                  return (
                    <button
                      key={photo.label}
                      type="button"
                      onClick={() => setEvidencePhotoUrl(photo.url)}
                      className={`p-2 rounded-2xl border text-left cursor-pointer transition flex flex-col space-y-1.5 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="h-28 rounded-xl overflow-hidden relative">
                        <img
                          src={photo.url}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-sky-700 text-white p-1 rounded-full shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-800 text-xs px-1">{photo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to AI Score Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: AI RECOMMENDED PRIORITY & OFFICIAL SUBMISSION */}
        {/* ========================================================================= */}
        {activeStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">SECTION 6 — AI Priority Evaluation & Official Submission</h3>
                <p className="text-slate-500 text-[11px]">Review calculated decision-support score before submitting to PMC.</p>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Step 6 of 6
              </span>
            </div>

            {/* AI DECISION SUPPORT PREVIEW CARD */}
            <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-800/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">
                      AI RECOMMENDED PRIORITY
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-white">
                        {priorityEvaluation.level}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        priorityEvaluation.level === 'CRITICAL' ? 'bg-rose-500 text-white' :
                        priorityEvaluation.level === 'HIGH' ? 'bg-amber-500 text-slate-950' :
                        'bg-sky-500 text-white'
                      }`}>
                        Score: {priorityEvaluation.score}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-300 font-semibold block">Decision Support Status:</span>
                  <span className="text-[10px] text-sky-300">
                    Authority/Admin has final approval
                  </span>
                </div>
              </div>

              {/* Explainability Reasons */}
              <div className="bg-sky-900/40 border border-sky-700/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-sky-200 font-bold text-xs">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reasons behind this recommendation:</span>
                </div>

                <ul className="space-y-1 text-slate-200 text-xs list-disc list-inside">
                  {priorityEvaluation.reasons.map((reason, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-medium text-white">{reason}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-sky-800/40 text-[11px] text-slate-300 italic">
                  "{priorityEvaluation.aiRecommendation}"
                </div>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex justify-between">
                <span>Application Summary</span>
                <span className="text-sky-700">{requestType}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block">Applicant:</span>
                  <span className="font-bold text-slate-800">
                    {requestType === 'Hospital' ? hospitalName : requestType === 'School / College' ? schoolName : contactName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Area & Ward:</span>
                  <span className="font-bold text-slate-800">{area} ({ward})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Requested Water:</span>
                  <span className="font-bold text-slate-800">{quantityLiters.toLocaleString()} Liters</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Status:</span>
                  <span className={`font-bold ${isEmergency ? 'text-rose-600' : 'text-slate-700'}`}>
                    {isEmergency ? 'Yes (Critical)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Application...' : 'Submit Official Water Tanker Request'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
