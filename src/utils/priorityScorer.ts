/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequestPriority } from '../types';

export interface PriorityEvaluationInput {
  requestType: 'Hospital' | 'School / College' | 'Residential Society' | 'Slum / Informal Settlement' | 'Other';
  otherRequestType?: string;
  
  // General Water Availability & Status
  waterAvailability: 'No Water (0%)' | 'Less than 10%' | '10–25%' | '25–50%' | 'More than 50%';
  waterLastDuration?: 'Less than 2 Hours' | '2–6 Hours' | '6–12 Hours' | '12–24 Hours' | 'More than 24 Hours';
  waterSupplyStatus?: 'Completely Stopped' | 'Partial Supply' | 'Irregular Supply' | 'Normal Supply';
  peopleAffected: number;
  alternativeSource?: 'No' | 'Borewell' | 'Private Tanker' | 'Stored Water' | 'Other';
  otherAlternativeSource?: string;
  lastDelivery: 'Today' | 'Yesterday' | '2 Days Ago' | 'More than 3 Days Ago' | 'Never';
  
  // General Emergency
  isEmergency: boolean;
  emergencyType?: 'Medical Emergency' | 'Fire' | 'Heat Wave' | 'Water Contamination' | 'Other';
  otherEmergencyType?: string;
  quantityLiters: number;

  // 1. HOSPITAL SPECIFIC FIELDS
  hospitalId?: string;
  hospitalName?: string;
  totalBeds?: number;
  hospitalType?: 'Government' | 'Private';
  waterStorageCapacityLiters?: number;
  currentWaterAvailableLiters?: number;
  hospitalEmergencyType?: 'Medical Emergency' | 'ICU Requirement' | 'Operation / Surgery Requirement' | 'Other';
  otherHospitalEmergency?: string;

  // 2. SCHOOL / COLLEGE SPECIFIC FIELDS
  schoolName?: string;
  isSchoolOpenToday?: boolean;
  studentsPresentToday?: number;
  isMidDayMealRunning?: 'Yes' | 'No' | 'Not Applicable';
  areToiletsFunctional?: 'Yes' | 'No' | 'Partially';
  schoolUrgentRequirementType?: 'Drinking Water' | 'Mid-Day Meal' | 'Toilets / Sanitation' | 'Other';
  otherSchoolUrgentType?: string;
}

export interface PriorityEvaluationResult {
  score: number; // 0 - 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mappedPriority: RequestPriority; // 'Critical' | 'High' | 'Medium' | 'Normal'
  aiRecommendation: string;
  reasons: string[];
  breakdown: Record<string, number>;
}

export function calculatePriorityScore(input: PriorityEvaluationInput): PriorityEvaluationResult {
  let score = 0;
  const reasons: string[] = [];
  const breakdown: Record<string, number> = {};

  // =========================================================================
  // 1. IF REQUEST TYPE === 'Hospital'
  // =========================================================================
  if (input.requestType === 'Hospital') {
    // 1.1 Water Availability & Storage Capacity
    let availScore = 0;
    const storageCap = Number(input.waterStorageCapacityLiters) || 100000;
    const currentWater = Number(input.currentWaterAvailableLiters);
    
    // Check percentage ratio if liters are specified, else use selector
    let calculatedPercentage = 100;
    if (!isNaN(currentWater) && storageCap > 0) {
      calculatedPercentage = Math.round((currentWater / storageCap) * 100);
    }

    if (input.waterAvailability === 'No Water (0%)' || calculatedPercentage === 0) {
      availScore = 30;
      reasons.push(`Zero water remaining in hospital reservoir (0% reserve)`);
    } else if (input.waterAvailability === 'Less than 10%' || calculatedPercentage < 10) {
      availScore = 26;
      reasons.push(`Severe hospital water depletion (${calculatedPercentage < 10 ? `${calculatedPercentage}%` : '<10%'} reserve remaining)`);
    } else if (input.waterAvailability === '10–25%' || calculatedPercentage <= 25) {
      availScore = 18;
      reasons.push(`Critically low storage reserve (${calculatedPercentage <= 25 ? `${calculatedPercentage}%` : '10–25%'})`);
    } else if (input.waterAvailability === '25–50%' || calculatedPercentage <= 50) {
      availScore = 10;
      reasons.push(`Moderate storage depletion (${calculatedPercentage}%)`);
    } else {
      availScore = 3;
    }
    score += availScore;
    breakdown['waterAvailability'] = availScore;

    // 1.2 Total Beds Capacity
    let bedScore = 0;
    const beds = Number(input.totalBeds) || 100;
    if (beds >= 300) {
      bedScore = 22;
      reasons.push(`Major tertiary healthcare facility: ${beds} inpatient beds`);
    } else if (beds >= 150) {
      bedScore = 16;
      reasons.push(`High bed capacity: ${beds} inpatient beds`);
    } else if (beds >= 50) {
      bedScore = 10;
      reasons.push(`Medium hospital facility: ${beds} beds`);
    } else {
      bedScore = 6;
      reasons.push(`Local healthcare clinic / hospital: ${beds} beds`);
    }
    score += bedScore;
    breakdown['bedCapacity'] = bedScore;

    // 1.3 Hospital Type (Government vs Private)
    let typeScore = 0;
    if (input.hospitalType === 'Government') {
      typeScore = 8;
      reasons.push(`Government public hospital serving high-density vulnerable population`);
    } else {
      typeScore = 4;
      reasons.push(`Private healthcare facility`);
    }
    score += typeScore;
    breakdown['hospitalType'] = typeScore;

    // 1.4 Emergency / Critical Situation
    let emergScore = 0;
    if (input.isEmergency) {
      if (input.hospitalEmergencyType === 'ICU Requirement') {
        emergScore = 25;
        reasons.push(`CRITICAL: ICU & Life Support units at acute operational risk`);
      } else if (input.hospitalEmergencyType === 'Operation / Surgery Requirement') {
        emergScore = 22;
        reasons.push(`CRITICAL: Operation Theatres & Surgical sterilization units stalled`);
      } else if (input.hospitalEmergencyType === 'Medical Emergency') {
        emergScore = 20;
        reasons.push(`Active medical emergency protocol reported`);
      } else {
        emergScore = 15;
        reasons.push(`Emergency situation flagged: ${input.otherHospitalEmergency || 'Hospital shortage'}`);
      }
    }
    score += emergScore;
    breakdown['emergencyScore'] = emergScore;

    // 1.5 Last Tanker Delivery
    let deliveryScore = 0;
    switch (input.lastDelivery) {
      case 'Never':
      case 'More than 3 Days Ago':
        deliveryScore = 15;
        reasons.push(`No tanker delivery received in over 3 days`);
        break;
      case '2 Days Ago':
        deliveryScore = 10;
        reasons.push(`No tanker delivery received for 2 days`);
        break;
      case 'Yesterday':
        deliveryScore = 4;
        break;
      case 'Today':
        deliveryScore = 0;
        break;
    }
    score += deliveryScore;
    breakdown['lastDelivery'] = deliveryScore;
  }

  // =========================================================================
  // 2. IF REQUEST TYPE === 'School / College'
  // =========================================================================
  else if (input.requestType === 'School / College') {
    // 2.1 Is School Open Today?
    const isOpen = input.isSchoolOpenToday !== false; // default true
    if (!isOpen) {
      reasons.push('School is closed today - Scheduled non-urgent replenishment queue');
      score = 25; // low baseline if closed
      breakdown['schoolStatus'] = 25;
    } else {
      let openScore = 10;
      reasons.push('School is currently open and operational today');
      score += openScore;
      breakdown['schoolStatus'] = openScore;

      // 2.2 Students Present
      const students = Number(input.studentsPresentToday) || 300;
      let studentScore = 0;
      if (students >= 1000) {
        studentScore = 22;
        reasons.push(`High campus attendance: ${students.toLocaleString()} students present today`);
      } else if (students >= 500) {
        studentScore = 18;
        reasons.push(`${students.toLocaleString()} students present on campus today`);
      } else if (students >= 200) {
        studentScore = 12;
        reasons.push(`${students} students present today`);
      } else {
        studentScore = 6;
        reasons.push(`${students} students on campus`);
      }
      score += studentScore;
      breakdown['studentAttendance'] = studentScore;

      // 2.3 Water Availability
      let availScore = 0;
      switch (input.waterAvailability) {
        case 'No Water (0%)':
          availScore = 25;
          reasons.push('Zero water currently available in school overhead tanks');
          break;
        case 'Less than 10%':
          availScore = 20;
          reasons.push('Water availability below 10% critical threshold');
          break;
        case '10–25%':
          availScore = 14;
          reasons.push('Low water reserve (10–25%)');
          break;
        case '25–50%':
          availScore = 6;
          break;
        case 'More than 50%':
          availScore = 0;
          break;
      }
      score += availScore;
      breakdown['waterAvailability'] = availScore;

      // 2.4 Functional Toilets & Hygiene Risk
      let toiletScore = 0;
      if (input.areToiletsFunctional === 'No') {
        toiletScore = 22;
        reasons.push('Toilets are completely non-functional (Severe sanitation & student health hazard)');
      } else if (input.areToiletsFunctional === 'Partially') {
        toiletScore = 12;
        reasons.push('Toilets are only partially functional due to low pressure');
      } else {
        toiletScore = 0;
      }
      score += toiletScore;
      breakdown['toiletsSanitation'] = toiletScore;

      // 2.5 Mid-Day Meal Running
      let mealScore = 0;
      if (input.isMidDayMealRunning === 'Yes') {
        mealScore = 16;
        reasons.push('Government Mid-Day Meal program is currently running (requires hygienic cooking water)');
      }
      score += mealScore;
      breakdown['midDayMeal'] = mealScore;

      // 2.6 Urgent Requirement Flag
      let urgentScore = 0;
      if (input.isEmergency) {
        if (input.schoolUrgentRequirementType === 'Drinking Water') {
          urgentScore = 15;
          reasons.push('Urgent drinking water shortage for students and staff');
        } else if (input.schoolUrgentRequirementType === 'Toilets / Sanitation') {
          urgentScore = 15;
          reasons.push('Emergency sanitation demand');
        } else if (input.schoolUrgentRequirementType === 'Mid-Day Meal') {
          urgentScore = 14;
          reasons.push('Urgent water needed for Mid-Day Meal preparation');
        } else {
          urgentScore = 10;
          reasons.push(`Urgent requirement flagged: ${input.otherSchoolUrgentType || 'School demand'}`);
        }
      }
      score += urgentScore;
      breakdown['urgentNeed'] = urgentScore;

      // 2.7 Last Delivery
      let deliveryScore = 0;
      switch (input.lastDelivery) {
        case 'Never':
        case 'More than 3 Days Ago':
          deliveryScore = 10;
          reasons.push('No municipal tanker received in more than 3 days');
          break;
        case '2 Days Ago':
          deliveryScore = 6;
          break;
        case 'Yesterday':
          deliveryScore = 2;
          break;
        case 'Today':
          deliveryScore = 0;
          break;
      }
      score += deliveryScore;
      breakdown['lastDelivery'] = deliveryScore;
    }
  }

  // =========================================================================
  // 3. CITIZEN / RESIDENTIAL SOCIETY / SLUM / OTHER
  // =========================================================================
  else {
    // 3.1 Water Availability (0 - 25 pts)
    let availabilityScore = 0;
    switch (input.waterAvailability) {
      case 'No Water (0%)':
        availabilityScore = 25;
        reasons.push('Zero water currently available (0% storage reserve)');
        break;
      case 'Less than 10%':
        availabilityScore = 18;
        reasons.push('Severe tank depletion (< 10% reserve remaining)');
        break;
      case '10–25%':
        availabilityScore = 12;
        reasons.push('Critical low water reserve (10–25%)');
        break;
      case '25–50%':
        availabilityScore = 6;
        break;
      case 'More than 50%':
        availabilityScore = 0;
        break;
    }
    score += availabilityScore;
    breakdown['waterAvailability'] = availabilityScore;

    // 3.2 Duration Remaining (0 - 20 pts)
    let durationScore = 0;
    switch (input.waterLastDuration) {
      case 'Less than 2 Hours':
        durationScore = 20;
        reasons.push('Current water supply will run out in less than 2 hours');
        break;
      case '2–6 Hours':
        durationScore = 14;
        reasons.push('Water supply will be exhausted within 2–6 hours');
        break;
      case '6–12 Hours':
        durationScore = 9;
        break;
      case '12–24 Hours':
        durationScore = 4;
        break;
      case 'More than 24 Hours':
        durationScore = 0;
        break;
    }
    score += durationScore;
    breakdown['durationRemaining'] = durationScore;

    // 3.3 Current Water Supply Status (0 - 10 pts)
    let supplyStatusScore = 0;
    switch (input.waterSupplyStatus) {
      case 'Completely Stopped':
        supplyStatusScore = 10;
        reasons.push('Municipal piped water supply is completely stopped');
        break;
      case 'Partial Supply':
        supplyStatusScore = 6;
        reasons.push('Piped network operating on severe partial supply');
        break;
      case 'Irregular Supply':
        supplyStatusScore = 4;
        break;
      case 'Normal Supply':
        supplyStatusScore = 0;
        break;
    }
    score += supplyStatusScore;
    breakdown['supplyStatus'] = supplyStatusScore;

    // 3.4 Request Type & Location Vulnerability (0 - 15 pts)
    let requestTypeScore = 0;
    if (input.requestType === 'Slum / Informal Settlement') {
      requestTypeScore = 15;
      reasons.push('Highly vulnerable informal settlement / dense slum community');
    } else if (input.requestType === 'Residential Society') {
      requestTypeScore = 6;
    } else {
      requestTypeScore = 4;
    }
    score += requestTypeScore;
    breakdown['requestTypeScore'] = requestTypeScore;

    // 3.5 Emergency Situation (0 - 20 pts)
    let emergencyScore = 0;
    if (input.isEmergency) {
      emergencyScore = 20;
      const type = input.emergencyType || 'Urgent Shortage';
      reasons.push(`Active municipal emergency flagged: ${type}`);
    }
    score += emergencyScore;
    breakdown['emergency'] = emergencyScore;

    // 3.6 Alternative Water Source (0 - 10 pts)
    let alternativeSourceScore = 0;
    if (input.alternativeSource === 'No') {
      alternativeSourceScore = 10;
      reasons.push('No alternative water source (borewell/private tanker/tank) available');
    } else if (input.alternativeSource === 'Borewell') {
      alternativeSourceScore = 3;
    } else if (input.alternativeSource === 'Private Tanker') {
      alternativeSourceScore = 2;
    } else if (input.alternativeSource === 'Stored Water') {
      alternativeSourceScore = 3;
    } else {
      alternativeSourceScore = 4;
    }
    score += alternativeSourceScore;
    breakdown['alternativeSource'] = alternativeSourceScore;

    // 3.7 Last Water Tanker Delivery (0 - 10 pts)
    let lastDeliveryScore = 0;
    switch (input.lastDelivery) {
      case 'Never':
        lastDeliveryScore = 10;
        reasons.push('Never received prior municipal tanker delivery');
        break;
      case 'More than 3 Days Ago':
        lastDeliveryScore = 8;
        reasons.push('Prolonged supply gap: No tanker delivery in more than 3 days');
        break;
      case '2 Days Ago':
        lastDeliveryScore = 5;
        break;
      case 'Yesterday':
        lastDeliveryScore = 2;
        break;
      case 'Today':
        lastDeliveryScore = 0;
        break;
    }
    score += lastDeliveryScore;
    breakdown['lastDelivery'] = lastDeliveryScore;

    // 3.8 Population Affected (0 - 8 pts)
    let populationScore = 0;
    const people = Number(input.peopleAffected) || 100;
    if (people >= 3000) {
      populationScore = 8;
      reasons.push(`High impact scale: ${people.toLocaleString()} citizens affected`);
    } else if (people >= 1000) {
      populationScore = 5;
      reasons.push(`Significant impact: ${people.toLocaleString()} citizens affected`);
    } else if (people >= 300) {
      populationScore = 3;
    } else {
      populationScore = 1;
    }
    score += populationScore;
    breakdown['populationScore'] = populationScore;
  }

  // Ensure strict bounds [0, 100]
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Classification into Levels
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  let mappedPriority: RequestPriority;
  let aiRecommendation: string;

  if (finalScore >= 71) {
    level = 'CRITICAL';
    mappedPriority = 'Critical';
    if (input.requestType === 'Hospital') {
      aiRecommendation = 'Immediate emergency tanker dispatch recommended. Hospital ICU / Surgical operations and inpatient life-support are at acute risk.';
    } else if (input.requestType === 'School / College') {
      aiRecommendation = 'Immediate high-priority tanker dispatch recommended to safeguard student health, functional toilets, and meal services.';
    } else {
      aiRecommendation = 'Prioritize this request for immediate emergency dispatch. Vulnerability and shortage metrics require rapid tanker routing.';
    }
  } else if (finalScore >= 51) {
    level = 'HIGH';
    mappedPriority = 'High';
    aiRecommendation = 'High priority allocation advised. Schedule tanker dispatch in the next available municipal distribution cycle.';
  } else if (finalScore >= 31) {
    level = 'MEDIUM';
    mappedPriority = 'Medium';
    aiRecommendation = 'Standard priority. Manage under regular daytime tanker dispatch queues.';
  } else {
    level = 'LOW';
    mappedPriority = 'Normal';
    aiRecommendation = 'Low urgency. Defer to non-peak hours or scheduled weekly residential replenishment quota.';
  }

  // Ensure at least 2 clear explanation reasons
  if (reasons.length === 0) {
    reasons.push('Standard water demand registration');
    reasons.push('Regular scheduled replenishment cycle');
  }

  return {
    score: finalScore,
    level,
    mappedPriority,
    aiRecommendation,
    reasons,
    breakdown
  };
}
