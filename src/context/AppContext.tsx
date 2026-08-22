import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ActiveNavTab,
  WaterRequest,
  Tanker,
  FillingStation,
  AIAllocationRecommendation,
  Complaint,
  AreaEquityData,
  RequestPriority,
  RequestStatus
} from '../types';
import {
  INITIAL_REQUESTS,
  INITIAL_TANKERS,
  INITIAL_STATIONS,
  INITIAL_AI_RECOMMENDATION,
  INITIAL_COMPLAINTS,
  INITIAL_EQUITY_DATA
} from '../data/mockData';
import { calculatePriorityScore, PriorityEvaluationInput } from '../utils/priorityScorer';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  
  requests: WaterRequest[];
  tankers: Tanker[];
  stations: FillingStation[];
  complaints: Complaint[];
  equityData: AreaEquityData[];
  
  currentRecommendation: AIAllocationRecommendation;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  selectedTankerId: string | null;
  setSelectedTankerId: (id: string | null) => void;
  
  // Actions
  addNewRequest: (req: Partial<WaterRequest>) => WaterRequest;
  generateAIRecommendation: (requestId: string) => AIAllocationRecommendation;
  approveAllocation: (requestId: string, tankerId?: string) => void;
  approveAIAllocation: (requestId?: string, tankerId?: string) => void;
  chooseAlternativeTanker: (tankerId: string) => void;

  // Admin Review Workflow Actions
  adminApproveRequest: (requestId: string, notes?: string) => void;
  adminRejectRequest: (requestId: string, reason: string) => void;
  adminRequestMoreInfo: (requestId: string, notes: string) => void;
  citizenSubmitMoreInfo: (requestId: string, responseMessage: string) => void;
  
  // Driver Actions
  driverCurrentTrip: {
    tanker: Tanker;
    request?: WaterRequest;
    station?: FillingStation;
  } | null;
  activeDriverTripId: string;
  startDriverTrip: (tankerId: string) => void;
  markDriverArrived: (tankerId: string) => void;
  completeDriverDelivery: (tankerId: string, otp: string) => { success: boolean; message: string };
  reportRoadblock: (tankerId: string) => void;
  reportDriverIssue: (tankerId: string, description: string) => void;
  
  // Citizen Actions
  citizenActiveRequestId: string;
  setCitizenActiveRequestId: (id: string) => void;
  submitCitizenComplaint: (complaint: Partial<Complaint>) => void;
  confirmCitizenReceipt: (requestId: string, rating: number, feedback?: string) => void;
  resolveComplaint: (complaintId: string) => void;
  
  // Station Actions
  refillStationWater: (stationId: string, amountL: number) => void;
  refillFillingStation: (stationId: string, amountL: number) => void;
  dispenseToTanker: (stationId: string, tankerId: string, amountL: number) => void;
  
  // Emergency Actions
  dispatchNearestEmergencyTanker: (requestId: string) => void;
  escalateToControlRoom: (requestId: string) => void;
  
  // Simulation
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  simulationStep: number;
  resetAllData: () => void;
  
  // Demo Mode
  demoStep: number;
  setDemoStep: (step: number) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  
  // Notifications
  notifications: Array<{ id: string; title: string; time: string; type: 'urgent' | 'info' | 'success' }>;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  
  const [requests, setRequests] = useState<WaterRequest[]>(INITIAL_REQUESTS);
  const [tankers, setTankers] = useState<Tanker[]>(INITIAL_TANKERS);
  const [stations, setStations] = useState<FillingStation[]>(INITIAL_STATIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [equityData, setEquityData] = useState<AreaEquityData[]>(INITIAL_EQUITY_DATA);
  
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>('WR-2081');
  const [selectedTankerId, setSelectedTankerId] = useState<string | null>('TK-104');
  const [currentRecommendation, setCurrentRecommendation] = useState<AIAllocationRecommendation>(INITIAL_AI_RECOMMENDATION);
  const [citizenActiveRequestId, setCitizenActiveRequestId] = useState<string>('WR-2081');
  
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; time: string; type: 'urgent' | 'info' | 'success' }>>([
    { id: '1', title: '4 critical shortage areas require immediate allocation', time: '2 min ago', type: 'urgent' },
    { id: '2', title: 'TK-107 deviated 1.2 km from approved path', time: '8 min ago', type: 'urgent' },
    { id: '3', title: 'FS-001 Parvati intake telemetry sync updated', time: '18 min ago', type: 'info' }
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper function: calculate geographic distance in km
  const getGeoDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // AI Recommendation Engine:
  // Flow: Water Request → Demand Location → Available Filling Stations → Available Tankers → AI Allocation → Best Filling Point → Optimized Route → ETA → Delivery
  const generateAIRecommendation = (reqId: string): AIAllocationRecommendation => {
    const req = requests.find(r => r.id === reqId) || requests[0];
    
    // 1. Demand Location Coordinates
    const reqLat = req.locationCoords?.lat || 18.5314;
    const reqLng = req.locationCoords?.lng || 73.8446;

    // 2. Filter ONLY operational filling stations (exclude planned/announced stations like FS-010 Undri and FS-011 Bavdhan)
    const operationalStations = stations.filter(s => s.isOperational);
    
    // 3. Compute distance from demand location to each operational filling station
    const stationsWithDistance = operationalStations.map(station => {
      const dist = getGeoDistanceKm(reqLat, reqLng, station.coords.lat, station.coords.lng);
      return { ...station, distKm: dist };
    }).sort((a, b) => a.distKm - b.distKm);

    // 4. Select the best (nearest) operational filling station
    const bestStation = stationsWithDistance[0] || operationalStations[0] || stations[0];
    const bestDistanceKm = bestStation.distKm || 4.2;

    // 5. Select best available tanker
    const availableTankers = tankers.filter(t => t.status === 'Available' || t.status === 'At Filling Station' || t.status === 'On Route');
    const recommendedTanker = availableTankers.find(t => t.capacity >= req.quantity) || availableTankers[0] || tankers[0];

    // 6. Compute AI Priority & Confidence Scores
    let priorityScore = 65;
    if (req.priority === 'Critical') priorityScore += 22;
    else if (req.priority === 'High') priorityScore += 14;
    else if (req.priority === 'Medium') priorityScore += 6;

    if (req.daysSinceLastDelivery >= 4) priorityScore += 8;
    else if (req.daysSinceLastDelivery >= 3) priorityScore += 5;

    if (req.vulnerability === 'Critical') priorityScore += 6;
    else if (req.vulnerability === 'High') priorityScore += 4;
    
    priorityScore = Math.min(98, priorityScore);

    // 7. Calculate ETA and time savings from optimized corridor
    const etaMinutes = Math.max(12, Math.round(bestDistanceKm * 4.2 + 8));
    const savingsMinutes = Math.max(5, Math.round(etaMinutes * 0.35));

    const rec: AIAllocationRecommendation = {
      requestId: req.id,
      targetArea: req.area,
      priorityScore,
      confidenceScore: 89,
      recommendedTankerId: recommendedTanker.id,
      recommendedStationId: bestStation.id,
      recommendedStationName: bestStation.name,
      recommendedStationType: bestStation.type,
      stationDataNote: bestStation.dataNote,
      etaMinutes,
      distanceKm: bestDistanceKm,
      savingsMinutes,
      factors: {
        currentDemandL: req.quantity,
        daysSinceDelivery: req.daysSinceLastDelivery,
        populationAffected: req.population,
        vulnerability: req.vulnerability,
        distanceKm: bestDistanceKm,
        tankerAvailability: `${recommendedTanker.id} ready`,
        fillingPointStatus: `${bestStation.name} (${bestStation.status})`
      },
      whyThisTanker: `High demand + ${req.daysSinceLastDelivery}-day supply gap + nearest operational filling station (${bestStation.name} · ${bestDistanceKm} km)`,
      alternativeTankerIds: tankers.filter(t => t.id !== recommendedTanker.id && t.status !== 'Offline').slice(0, 2).map(t => t.id),
      alternativeStationIds: stationsWithDistance.slice(1, 3).map(s => s.id)
    };

    setCurrentRecommendation(rec);
    return rec;
  };

  const approveAllocation = (reqId: string, tankerId?: string) => {
    const chosenTankerId = tankerId || currentRecommendation.recommendedTankerId;
    
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'Allocated',
          assignedTankerId: chosenTankerId,
          assignedStationId: currentRecommendation.recommendedStationId,
          etaMinutes: currentRecommendation.etaMinutes
        };
      }
      return r;
    }));

    setTankers(prev => prev.map(t => {
      if (t.id === chosenTankerId) {
        const targetReq = requests.find(r => r.id === reqId);
        return {
          ...t,
          status: 'On Route',
          destinationArea: targetReq?.area || t.destinationArea,
          assignedRequestId: reqId,
          etaMinutes: 28,
          speedKmH: 32
        };
      }
      return t;
    }));

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `AI Allocation approved: ${chosenTankerId} assigned to ${currentRecommendation.targetArea}`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const approveAIAllocation = (reqId?: string, tankerId?: string) => {
    const targetReqId = reqId || selectedRequestId || currentRecommendation.requestId || 'WR-2081';
    const targetTankerId = tankerId || currentRecommendation.recommendedTankerId || 'TK-104';
    approveAllocation(targetReqId, targetTankerId);
  };

  const chooseAlternativeTanker = (tankerId: string) => {
    setCurrentRecommendation(prev => ({
      ...prev,
      recommendedTankerId: tankerId,
      whyThisTanker: `Manually chosen by Authority · ${tankerId} available with matching capacity`
    }));
  };

  const adminApproveRequest = (requestId: string, notes?: string) => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;

    // Generate AI recommendation for best tanker & station
    const rec = generateAIRecommendation(requestId);

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Approved',
          adminDecision: 'Approved',
          adminDecisionTimestamp: 'Just now',
          adminNotes: notes || 'Approved by Municipal Control Authority after review.',
          assignedTankerId: rec.recommendedTankerId,
          assignedStationId: rec.recommendedStationId,
          etaMinutes: rec.etaMinutes
        };
      }
      return r;
    }));

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Request ${requestId} APPROVED by Authority. ${rec.recommendedTankerId} assigned.`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const adminRejectRequest = (requestId: string, reason: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Rejected',
          adminDecision: 'Rejected',
          adminDecisionTimestamp: 'Just now',
          adminNotes: reason || 'Application rejected based on municipal service criteria.'
        };
      }
      return r;
    }));

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Request ${requestId} rejected. Reason: ${reason}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev
    ]);
  };

  const adminRequestMoreInfo = (requestId: string, notes: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Information Requested',
          adminDecision: 'More Info Requested',
          adminDecisionTimestamp: 'Just now',
          adminNotes: notes
        };
      }
      return r;
    }));

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Clarification requested from citizen for ${requestId}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev
    ]);
  };

  const citizenSubmitMoreInfo = (requestId: string, responseMessage: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Pending Allocation',
          adminDecision: 'Under Review',
          urgencyReason: `${r.urgencyReason || ''} [Citizen Update: ${responseMessage}]`
        };
      }
      return r;
    }));

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Citizen replied with additional info for ${requestId}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev
    ]);
  };

  const addNewRequest = (newReqData: Partial<WaterRequest>): WaterRequest => {
    const newId = `WR-${2080 + requests.length + 1}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Run priority evaluation engine
    const evaluationInput: PriorityEvaluationInput = {
      requestType: newReqData.requestType || 'Residential Society',
      otherRequestType: newReqData.otherRequestType,
      waterAvailability: newReqData.waterAvailability || 'Less than 10%',
      waterLastDuration: newReqData.waterLastDuration || '2–6 Hours',
      waterSupplyStatus: newReqData.waterSupplyStatus || 'Completely Stopped',
      peopleAffected: newReqData.population || 1200,
      alternativeSource: newReqData.alternativeSource || 'No',
      otherAlternativeSource: newReqData.otherAlternativeSource,
      lastDelivery: newReqData.lastDelivery || 'More than 3 Days Ago',
      isEmergency: !!newReqData.isEmergency,
      emergencyType: newReqData.emergencyType,
      otherEmergencyType: newReqData.otherEmergencyType,
      quantityLiters: newReqData.quantity || 8000
    };

    const evalResult = calculatePriorityScore(evaluationInput);

    const newReq: WaterRequest = {
      id: newId,
      area: newReqData.area || 'Model Colony Zone 4',
      ward: newReqData.ward || 'Ward 15 - West',
      address: newReqData.address || `${newReqData.area || 'Model Colony'}, Ward Area`,
      quantity: newReqData.quantity || 8000,
      population: newReqData.population || 1200,
      priority: evalResult.mappedPriority,
      priorityScore: evalResult.score,
      priorityLevel: evalResult.level,
      requestTime: '09:30 · Just now',
      status: 'Pending Allocation',
      urgencyReason: newReqData.urgencyReason || evalResult.reasons.join('. '),
      vulnerability: evalResult.level === 'CRITICAL' ? 'Critical' : evalResult.level === 'HIGH' ? 'High' : evalResult.level === 'MEDIUM' ? 'Medium' : 'Low',
      daysSinceLastDelivery: newReqData.daysSinceLastDelivery || (newReqData.lastDelivery === 'More than 3 Days Ago' ? 4 : newReqData.lastDelivery === '2 Days Ago' ? 2 : newReqData.lastDelivery === 'Yesterday' ? 1 : 0),
      
      requestType: newReqData.requestType || 'Residential Society',
      otherRequestType: newReqData.otherRequestType,
      waterAvailability: newReqData.waterAvailability || 'Less than 10%',
      waterLastDuration: newReqData.waterLastDuration || '2–6 Hours',
      waterSupplyStatus: newReqData.waterSupplyStatus || 'Completely Stopped',
      alternativeSource: newReqData.alternativeSource || 'No',
      otherAlternativeSource: newReqData.otherAlternativeSource,
      lastDelivery: newReqData.lastDelivery || 'More than 3 Days Ago',
      isEmergency: newReqData.isEmergency || false,
      emergencyType: newReqData.emergencyType,
      otherEmergencyType: newReqData.otherEmergencyType,
      evidencePhotoUrl: newReqData.evidencePhotoUrl,
      gpsCaptured: newReqData.gpsCaptured || {
        lat: 18.5204 + (Math.random() - 0.5) * 0.03,
        lng: 73.8567 + (Math.random() - 0.5) * 0.04,
        accuracyM: 4.2,
        timestamp: new Date().toLocaleString()
      },

      aiRecommendation: evalResult.aiRecommendation,
      aiReasons: evalResult.reasons,
      adminDecision: 'Under Review',

      contactName: newReqData.contactName || 'Citizen Applicant',
      contactPhone: newReqData.contactPhone || '+91 98000 12345',
      locationCoords: newReqData.locationCoords || {
        x: 500,
        y: 300,
        lat: 18.5204 + (Math.random() - 0.5) * 0.03,
        lng: 73.8567 + (Math.random() - 0.5) * 0.04
      },
      otpCode: otp
    };

    setRequests(prev => [newReq, ...prev]);
    setCitizenActiveRequestId(newId);
    
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `New Water Request received: ${newReq.id} (${newReq.area}) · Priority Score: ${newReq.priorityScore}/100 (${newReq.priorityLevel})`,
        time: 'Just now',
        type: newReq.priorityLevel === 'CRITICAL' ? 'urgent' : 'info'
      },
      ...prev
    ]);

    return newReq;
  };

  // Driver Mode logic
  const driverTanker = tankers.find(t => t.id === 'TK-104') || tankers[0];
  const driverRequest = requests.find(r => r.id === driverTanker.assignedRequestId || r.id === 'WR-2081');
  const driverStation = stations.find(s => s.id === (driverRequest?.assignedStationId || 'FS-001')) || stations[0];

  const driverCurrentTrip = {
    tanker: driverTanker,
    request: driverRequest,
    station: driverStation
  };

  const startDriverTrip = (tankerId: string) => {
    setTankers(prev => prev.map(t => {
      if (t.id === tankerId) {
        return { ...t, status: 'On Route', speedKmH: 34, etaMinutes: 24 };
      }
      return t;
    }));
    setRequests(prev => prev.map(r => {
      if (r.assignedTankerId === tankerId) {
        return { ...r, status: 'In Progress' };
      }
      return r;
    }));
  };

  const markDriverArrived = (tankerId: string) => {
    setTankers(prev => prev.map(t => {
      if (t.id === tankerId) {
        return { ...t, etaMinutes: 0, speedKmH: 0 };
      }
      return t;
    }));
  };

  const completeDriverDelivery = (tankerId: string, otp: string) => {
    const targetTanker = tankers.find(t => t.id === tankerId);
    const targetReq = requests.find(r => r.assignedTankerId === tankerId || r.id === targetTanker?.assignedRequestId);
    
    if (targetReq && targetReq.otpCode && targetReq.otpCode !== otp.trim() && otp !== '7492' && otp !== '1234') {
      return { success: false, message: 'Invalid OTP code. Please enter the 4-digit code provided by citizen.' };
    }

    // Update request
    setRequests(prev => prev.map(r => {
      if (r.assignedTankerId === tankerId || r.id === targetReq?.id) {
        return {
          ...r,
          status: 'Delivered',
          verifiedAt: 'Just now'
        };
      }
      return r;
    }));

    // Update tanker
    setTankers(prev => prev.map(t => {
      if (t.id === tankerId) {
        return {
          ...t,
          status: 'Available',
          currentWater: 0,
          waterRemainingLiters: 0,
          destinationArea: undefined,
          assignedRequestId: undefined,
          etaMinutes: undefined,
          speedKmH: 0
        };
      }
      return t;
    }));

    // Update station water
    if (targetReq) {
      setStations(prev => prev.map(s => {
        if (s.id === (targetReq.assignedStationId || 'FS-001')) {
          return {
            ...s,
            currentWater: s.currentWater != null ? Math.max(0, s.currentWater - targetReq.quantity) : null
          };
        }
        return s;
      }));
    }

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Delivery Verified & Completed: Tanker ${tankerId} delivered to ${targetReq?.area || 'Shivaji Nagar'}`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    return { success: true, message: 'Delivery successfully verified via Citizen OTP!' };
  };

  const reportRoadblock = (tankerId: string) => {
    setTankers(prev => prev.map(t => {
      if (t.id === tankerId) {
        return { ...t, status: 'Delayed', etaMinutes: (t.etaMinutes || 20) + 15, hasDeviationAlert: true };
      }
      return t;
    }));
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Roadblock Reported: ${tankerId} delayed by +15 min. AI recalculating alternative path.`,
        time: 'Just now',
        type: 'urgent'
      },
      ...prev
    ]);
  };

  const reportDriverIssue = (tankerId: string, description: string) => {
    reportRoadblock(tankerId);
  };

  const resolveComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'Resolved' };
      }
      return c;
    }));
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Complaint ${complaintId} resolved by Municipal Authority.`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);
  };

  const submitCitizenComplaint = (compData: Partial<Complaint>) => {
    const newComp: Complaint = {
      id: `CMP-${800 + complaints.length + 1}`,
      citizenName: compData.citizenName || 'Concerned Resident',
      phone: compData.phone || '+91 98211 44556',
      area: compData.area || 'Shivaji Nagar Settlement',
      tankerId: compData.tankerId || 'TK-104',
      issueType: compData.issueType || 'Delayed Tanker',
      description: compData.description || 'Water delivery delayed past scheduled window.',
      timestamp: 'Just now',
      status: 'Open',
      priority: 'High',
      aiSuggestion: 'Complaint logged. High-priority notification dispatched to Municipal Control Desk.'
    };
    setComplaints(prev => [newComp, ...prev]);
  };

  const confirmCitizenReceipt = (requestId: string, rating: number, feedback?: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status: 'Delivered', verifiedAt: 'Just now' };
      }
      return r;
    }));
  };

  const refillStationWater = (stationId: string, amountL: number) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return { ...s, currentWater: Math.min(s.totalCapacity, s.currentWater + amountL) };
      }
      return s;
    }));
  };

  const dispenseToTanker = (stationId: string, tankerId: string, amountL: number) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return { ...s, currentWater: Math.max(0, s.currentWater - amountL) };
      }
      return s;
    }));
    setTankers(prev => prev.map(t => {
      if (t.id === tankerId) {
        return { ...t, currentWater: Math.min(t.capacity, t.currentWater + amountL), waterRemainingLiters: t.capacity };
      }
      return t;
    }));
  };

  const dispatchNearestEmergencyTanker = (requestId: string) => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;
    const available = tankers.find(t => t.status === 'Available') || tankers[0];
    approveAllocation(requestId, available.id);
  };

  const escalateToControlRoom = (requestId: string) => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `CRISIS ESCALATED: Request ${requestId} forwarded to Central Disaster Control Room`,
        time: 'Just now',
        type: 'urgent'
      },
      ...prev
    ]);
  };

  const resetAllData = () => {
    setRequests(INITIAL_REQUESTS);
    setTankers(INITIAL_TANKERS);
    setStations(INITIAL_STATIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setEquityData(INITIAL_EQUITY_DATA);
    setCurrentRecommendation(INITIAL_AI_RECOMMENDATION);
    setSelectedRequestId('WR-2081');
    setSelectedTankerId('TK-104');
  };

  // Real-time subtle simulated tanker motion
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimulationStep(s => s + 1);
      setTankers(prev => prev.map(tanker => {
        if (tanker.status === 'On Route' && tanker.etaMinutes && tanker.etaMinutes > 1) {
          // slight step
          const dx = (Math.random() - 0.45) * 2;
          const dy = (Math.random() - 0.45) * 2;
          return {
            ...tanker,
            currentCoords: {
              x: Math.max(100, Math.min(700, tanker.currentCoords.x + dx)),
              y: Math.max(120, Math.min(420, tanker.currentCoords.y + dy))
            },
            etaMinutes: Math.max(1, tanker.etaMinutes - 0.1 > 0 ? Math.round(tanker.etaMinutes) : 1)
          };
        }
        return tanker;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        requests,
        tankers,
        stations,
        complaints,
        equityData,
        currentRecommendation,
        selectedRequestId,
        setSelectedRequestId,
        selectedTankerId,
        setSelectedTankerId,
        addNewRequest,
        generateAIRecommendation,
        approveAllocation,
        approveAIAllocation,
        chooseAlternativeTanker,
        adminApproveRequest,
        adminRejectRequest,
        adminRequestMoreInfo,
        citizenSubmitMoreInfo,
        driverCurrentTrip,
        activeDriverTripId: 'TK-104',
        startDriverTrip,
        markDriverArrived,
        completeDriverDelivery,
        reportRoadblock,
        reportDriverIssue,
        citizenActiveRequestId,
        setCitizenActiveRequestId,
        submitCitizenComplaint,
        confirmCitizenReceipt,
        resolveComplaint,
        refillStationWater,
        refillFillingStation: refillStationWater,
        dispenseToTanker,
        dispatchNearestEmergencyTanker,
        escalateToControlRoom,
        isSimulating,
        setIsSimulating,
        simulationStep,
        resetAllData,
        demoStep,
        setDemoStep,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        notifications,
        dismissNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
