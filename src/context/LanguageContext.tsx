import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // General
    appName: "AQUA2U",
    tagline: "Smart Water Tanker Allocation & Distribution Platform",
    searchPlaceholder: "Search task, ward or request...",
    language: "Language",
    selectLanguage: "Select Language",
    role: "User Role",
    
    // Navigation
    navDashboard: "Dashboard",
    navRequests: "Requests & Demands",
    navAllocations: "AI Allocations",
    navTankers: "Tanker Fleet",
    navDeliveries: "Deliveries & Audits",
    navComplaints: "Grievances & Complaints",
    navSources: "Filling Stations",
    navRoutes: "Route Optimization",
    navMap: "Live GPS Tracking",
    navEmergency: "Emergency Dispatch",
    navAnalytics: "Analytics & Equity",
    navSettings: "System Settings",
    navDriverApp: "Driver Mobile App",
    navResidentPortal: "Resident Portal",
    navOperatorPortal: "Station Operator",
    navBeneficiaryPortal: "Welfare Desk",
    
    // Header & Modes
    govAdminMode: "Municipal Authority",
    privateMode: "Commercial Supplier",
    liveSimActive: "Live Simulation Active",
    signOut: "Sign Out",
    switchRole: "Switch Portal / Role",

    // Common Actions
    requestWater: "Request Water Tanker",
    orderCommercial: "Order Water Tanker",
    approve: "Approve Allocation",
    reject: "Reject Request",
    dispatch: "Dispatch Tanker",
    verifyOTP: "Verify OTP & Complete",
    saveSettings: "Save Parameters",
    cancel: "Cancel",
    close: "Close",
    refresh: "Refresh Data",
    viewDetails: "View Details",

    // Status Badges
    statusUnderReview: "Under Review",
    statusApproved: "Approved",
    statusAllocated: "Allocated",
    statusInProgress: "En Route",
    statusDelivered: "Delivered",
    statusCritical: "Critical",
    statusPending: "Pending",

    // Landing Page
    landingTitle1: "Smart Water Tanker Allocation",
    landingTitle2: "& Distribution Management.",
    landingSubtitle: "AQUA2U reads your city water demand and tanker fleet metrics — delivering real-time AI allocation, turn-by-turn route optimization, live GPS tracking, and secure OTP delivery verification.",
    landingLaunchBtn: "Launch Municipal Platform",
    landingExploreBtn: "Explore Portals",
    landingTrustedBy: "POWERING MUNICIPAL & PRIVATE WATER NETWORKS AT",
    
    // Pipeline Steps
    step1Title: "Citizen & Ward Scarcity Logging",
    step1Desc: "Residents and welfare desks submit emergency water delivery requests, log dry tap complaints, and track request status with instant reference IDs.",
    step2Title: "AI Deficit & Priority Allocation",
    step2Desc: "Algorithms analyze ward population density, vulnerability indexes, and supply gaps to calculate priority scores and recommend tanker volumes.",
    step3Title: "Station Loading & Water Quality",
    step3Desc: "Filling station operators manage tanker queues, verify digital fill approvals, and record water quality metrics (pH, TDS, Turbidity).",
    step4Title: "Turn-by-Turn Tanker GPS Routing",
    step4Desc: "Drivers navigate via optimized routes, update trip milestones (Loaded / En Route / Arrived), and broadcast live GPS locations.",
    step5Title: "OTP Delivery Gatekeeping & Audit Logs",
    step5Desc: "Beneficiaries and welfare officers provide secure 6-digit OTP codes to driver upon discharge, instantly logging fulfilled capacity and closing tickets in the central municipal audit ledger.",

    // Dashboard Cards
    totalRequests: "Total Water Requests",
    activeTankers: "Active GPS Tankers",
    otpFulfillmentRate: "OTP Fulfillment Rate",
    unservedWards: "Unserved Wards Alert",
    aiRecommendationTitle: "AI Allocation Recommendation Engine",
    liveMapTitle: "Live Municipal Tanker Operations",

    // Common Terms
    capacityLiters: "Liters",
    ward: "Ward",
    priority: "Priority",
    eta: "Est. Arrival",
    otpCode: "6-Digit Verification OTP",
  },

  hi: {
    // General
    appName: "AQUA2U",
    tagline: "स्मार्ट वॉटर टैंकर आवंटन और वितरण मंच",
    searchPlaceholder: "कार्य, वार्ड या अनुरोध खोजें...",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    role: "उपयोगकर्ता भूमिका",
    
    // Navigation
    navDashboard: "डैशबोर्ड",
    navRequests: "अनुरोध एवं मांग",
    navAllocations: "एआई आवंटन",
    navTankers: "टैंकर बेड़ा",
    navDeliveries: "वितरण एवं ऑडिट",
    navComplaints: "शिकायतें एवं शिकायत निवारण",
    navSources: "जल भराव केंद्र",
    navRoutes: "मार्ग अनुकूलन",
    navMap: "लाइव जीपीएस ट्रैकिंग",
    navEmergency: "आपातकालीन प्रेषण",
    navAnalytics: "विश्लेषण और निष्पक्षता",
    navSettings: "सिस्टम सेटिंग्स",
    navDriverApp: "ड्राइवर मोबाइल ऐप",
    navResidentPortal: "नागरिक पोर्टल",
    navOperatorPortal: "स्टेशन ऑपरेटर",
    navBeneficiaryPortal: "कल्याणकारी डेस्क",
    
    // Header & Modes
    govAdminMode: "नगरपालिका प्राधिकरण",
    privateMode: "व्यावसायिक आपूर्तिकर्ता",
    liveSimActive: "लाइव सिमुलेशन सक्रिय",
    signOut: "साइन आउट",
    switchRole: "पोर्टल या भूमिका बदलें",

    // Common Actions
    requestWater: "पानी के टैंकर का अनुरोध करें",
    orderCommercial: "व्यावसायिक टैंकर ऑर्डर करें",
    approve: "आवंटन स्वीकृत करें",
    reject: "अनुरोध अस्वीकार करें",
    dispatch: "टैंकर रवाना करें",
    verifyOTP: "ओटीपी सत्यापित करें",
    saveSettings: "सेटिंग्स सहेजें",
    cancel: "रद्द करें",
    close: "बंद करें",
    refresh: "डेटा रीफ्रेश करें",
    viewDetails: "विवरण देखें",

    // Status Badges
    statusUnderReview: "समीक्षाधीन",
    statusApproved: "स्वीकृत",
    statusAllocated: "आवंटित",
    statusInProgress: "मार्ग में",
    statusDelivered: "वितरित",
    statusCritical: "अत्यंत गंभीर",
    statusPending: "लंबित",

    // Landing Page
    landingTitle1: "स्मार्ट वॉटर टैंकर आवंटन",
    landingTitle2: "और वितरण प्रबंधन।",
    landingSubtitle: "AQUA2U शहर की पानी की मांग और टैंकरों का विश्लेषण करके रीयल-टाइम एआई आवंटन, जीपीएस ट्रैकिंग और सुरक्षित ओटीपी वितरण प्रदान करता है।",
    landingLaunchBtn: "नगरपालिका मंच शुरू करें",
    landingExploreBtn: "पोर्टल देखें",
    landingTrustedBy: "नगरपालिका और निजी जल नेटवर्क द्वारा संचालित",
    
    // Pipeline Steps
    step1Title: "नागरिक और वार्ड कमी पंजीकरण",
    step1Desc: "नागरिक और कल्याण केंद्र आपातकालीन जल वितरण अनुरोध दर्ज करते हैं और शिकायत स्थिति ट्रैक करते हैं।",
    step2Title: "एआई कमी और प्राथमिकता आवंटन",
    step2Desc: "एल्गोरिदम वार्ड जनसंख्या और जल संकट का विश्लेषण करके प्राथमिकता अंक और टैंकर मात्रा निर्धारित करते हैं।",
    step3Title: "स्टेशन लोडिंग और जल गुणवत्ता",
    step3Desc: "स्टेशन ऑपरेटर टैंकर कतारों को प्रबंधित करते हैं और जल गुणवत्ता (pH, TDS, मैलापन) दर्ज करते हैं।",
    step4Title: "जीपीएस टैंकर मार्ग दिशा-निर्देश",
    step4Desc: "चालक अनुकूलित मार्गों पर चलते हैं, यात्रा स्थिति अपडेट करते हैं और लाइव जीपीएस स्थान भेजते हैं।",
    step5Title: "ओटीपी वितरण सत्यापन और ऑडिट",
    step5Desc: "लाभार्थी डिलीवरी पर 6-अंकों का ओटीपी प्रदान करते हैं, जिससे केंद्रीय ऑडिट में पूर्ति दर्ज होती है।",

    // Dashboard Cards
    totalRequests: "कुल जल अनुरोध",
    activeTankers: "सक्रिय जीपीएस टैंकर",
    otpFulfillmentRate: "ओटीपी पूर्ति दर",
    unservedWards: "अविभाजित वार्ड चेतावनी",
    aiRecommendationTitle: "एआई आवंटन सिफारिश इंजन",
    liveMapTitle: "लाइव नगरपालिका टैंकर संचालन",

    // Common Terms
    capacityLiters: "लीटर",
    ward: "वार्ड",
    priority: "प्राथमिकता",
    eta: "अनुमानित आगमन",
    otpCode: "6-अंकों का सत्यापन ओटीपी",
  },

  mr: {
    // General
    appName: "AQUA2U",
    tagline: "स्मार्ट वॉटर टँकर वाटप आणि वितरण मंच",
    searchPlaceholder: "काम, प्रभाग किंवा मागणी शोधा...",
    language: "भाषा",
    selectLanguage: "भाषा निवडा",
    role: "वापरकर्ता भूमिका",
    
    // Navigation
    navDashboard: "डैशबोर्ड",
    navRequests: "मागण्या आणि मागण्या",
    navAllocations: "एआय वाटप",
    navTankers: "टँकर ताफा",
    navDeliveries: "वितरण आणि ऑडिट",
    navComplaints: "तक्रारी निवारण",
    navSources: "पाणी भरणे केंद्र",
    navRoutes: "मार्ग ऑप्टिमायझेशन",
    navMap: "थेट जीपीएस ट्रॅकिंग",
    navEmergency: "आणीबाणी डिस्पॅच",
    navAnalytics: "विश्लेषण आणि समता",
    navSettings: "सिस्टम सेटिंग्ज",
    navDriverApp: "ड्रायव्हर मोबाईल ॲप",
    navResidentPortal: "नागरिक पोर्टल",
    navOperatorPortal: "स्टेशन चालक",
    navBeneficiaryPortal: "कल्याणकारी डेस्क",
    
    // Header & Modes
    govAdminMode: "नगरपालिका प्राधिकरण",
    privateMode: "व्यावसायिक पुरवठादार",
    liveSimActive: "थेट सिम्युलेशन सक्रिय",
    signOut: "साइन आउट",
    switchRole: "पोर्टल किंवा भूमिका बदला",

    // Common Actions
    requestWater: "पाण्याच्या टँकरची मागणी करा",
    orderCommercial: "टँकर ऑर्डर करा",
    approve: "वाटप मंजूर करा",
    reject: "मागणी नाकारा",
    dispatch: "टँकर रवाना करा",
    verifyOTP: "OTP सत्यापित करा",
    saveSettings: "सेटिंग्ज जतन करा",
    cancel: "रद्द करा",
    close: "बंद करा",
    refresh: "डेटा रिफ्रेश करा",
    viewDetails: "तपशील पहा",

    // Status Badges
    statusUnderReview: "तपासणीखाली",
    statusApproved: "मंजूर",
    statusAllocated: "वाटप केले",
    statusInProgress: "मार्गावर",
    statusDelivered: "पोहोचवले",
    statusCritical: "अत्यंत गंभीर",
    statusPending: "प्रलंबित",

    // Landing Page
    landingTitle1: "स्मार्ट वॉटर टँकर वाटप",
    landingTitle2: "आणि वितरण व्यवस्थापन.",
    landingSubtitle: "AQUA2U शहराची पाण्याची मागणी आणि टँकरची आकडेवारी विश्लेषित करून रिअल-टाइम एआय वाटप, जीपीएस ट्रॅकिंग आणि ओटीपी पडताळणी प्रदान करते.",
    landingLaunchBtn: "नगरपालिका प्लॅटफॉर्म सुरू करा",
    landingExploreBtn: "पोर्टल्स पहा",
    landingTrustedBy: "नगरपालिका आणि खाजगी पाणी पुरवठा नेटवर्क्स",
    
    // Pipeline Steps
    step1Title: "नागरिक आणि प्रभाग टंचाई नोंदणी",
    step1Desc: "नागरिक आणि संस्था आपत्कालीन पाणी वितरणाची मागणी करतात आणि स्थिती ट्रॅक करतात.",
    step2Title: "एआय टंचाई आणि प्राधान्य वाटप",
    step2Desc: "अल्गोरिदम प्रभागांची लोकसंख्या आणि पाणी टंचाईचे विश्लेषण करून प्राधान्य स्कोअर निश्चित करतात.",
    step3Title: "स्टेशन लोडिंग आणि पाण्याची गुणवत्ता",
    step3Desc: "स्टेशन चालक टँकर रांगा व्यवस्थापित करतात आणि गुणवत्तेचे निकष नोंदवतात.",
    step4Title: "जीपीएस टँकर मार्ग मार्गदर्शन",
    step4Desc: "चालक सर्वोत्तम मार्गाने प्रवास करतात आणि थेट जीपीएस स्थान प्रसारित करतात.",
    step5Title: "ओटीपी वितरण पडताळणी आणि ऑडिट",
    step5Desc: "लाभार्थी वितरणावर ६ अंकी ओटीपी देतात, ज्यामुळे मध्यवर्ती ऑडिटमध्ये नोंद होते.",

    // Dashboard Cards
    totalRequests: "एकूण पाणी मागण्या",
    activeTankers: "सक्रिय जीपीएस टँकर्स",
    otpFulfillmentRate: "ओटीपी पूर्णता दर",
    unservedWards: "अपुरवठा प्रभाग इशारा",
    aiRecommendationTitle: "एआय वाटप शिफारस इंजिन",
    liveMapTitle: "थेट नगरपालिका टँकर ऑपरेशन्स",

    // Common Terms
    capacityLiters: "लीटर",
    ward: "प्रभाग",
    priority: "प्राधान्य",
    eta: "अंदाजे आगमन",
    otpCode: "६-अंकी पडताळणी OTP",
  },

  ta: {
    // General
    appName: "AQUA2U",
    tagline: "ஸ்மார்ட் நீர் டேங்கர் ஒதுக்கீடு & விநியோக தளம்",
    searchPlaceholder: "பணி அல்லது கோரிக்கையை தேடுங்கள்...",
    language: "மொழி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    role: "பயனர் பங்கு",
    
    // Navigation
    navDashboard: "டாஷ்போர்டு",
    navRequests: "கோரிக்கைகள்",
    navAllocations: "AI ஒதுக்கீடுகள்",
    navTankers: "டேங்கர் படை",
    navDeliveries: "விநியோகங்கள் & தணிக்கை",
    navComplaints: "புகார்கள்",
    navSources: "நீர் நிரப்பும் நிலையங்கள்",
    navRoutes: "பாதை மேம்பாடு",
    navMap: "நேரலை GPS கண்காணிப்பு",
    navEmergency: "அவசரக்கால அனுப்புதல்",
    navAnalytics: "பகுப்பாய்வு",
    navSettings: "அமைப்புகள்",
    navDriverApp: "ஓட்டுநர் மொபைல் செயலி",
    navResidentPortal: "குடிமக்கள் தளம்",
    navOperatorPortal: "நிலையை இயக்குபவர்",
    navBeneficiaryPortal: "நலன்புரி மேஜை",
    
    // Header & Modes
    govAdminMode: "மாநகராட்சி அதிகாரம்",
    privateMode: "தனியார் சப்ளையர்",
    liveSimActive: "நேரலை இயக்கம் செயலில் உள்ளது",
    signOut: "வெளியேறு",
    switchRole: "பங்கை மாற்றவும்",

    // Common Actions
    requestWater: "நீர் டேங்கர் கோரிக்கை",
    orderCommercial: "டேங்கர் ஆர்டர் செய்",
    approve: "ஒப்புதல் அளி",
    reject: "நிராகரி",
    dispatch: "டேங்கர் அனுப்பு",
    verifyOTP: "OTP சரிபார்",
    saveSettings: "சேமிக்கவும்",
    cancel: "ரத்து செய்",
    close: "மூடு",
    refresh: "புதுப்பி",
    viewDetails: "விவரங்களை பார்",

    // Status Badges
    statusUnderReview: "பரிசீலனையில்",
    statusApproved: "ஒப்புதல் அளிக்கப்பட்டது",
    statusAllocated: "ஒதுக்கப்பட்டது",
    statusInProgress: "வழியில்",
    statusDelivered: "விநியோகிக்கப்பட்டது",
    statusCritical: "அவசரம்",
    statusPending: "நிலுவையில்",

    // Landing Page
    landingTitle1: "ஸ்மார்ட் நீர் டேங்கர் ஒதுக்கீடு",
    landingTitle2: "& விநியோக மேலாண்மை.",
    landingSubtitle: "AQUA2U உங்கள் நகரத்தின் நீர் தேவையை பகுப்பாய்வு செய்து AI ஒதுக்கீடு, நேரலை GPS கண்காணிப்பு மற்றும் OTP விநியோக சரிபார்ப்பை வழங்குகிறது.",
    landingLaunchBtn: "தளத்தை தொடங்கு",
    landingExploreBtn: "தளங்களை பாருங்கள்",
    landingTrustedBy: "மாநகராட்சி மற்றும் தனியார் நீர் நெட்வொர்க்குகள்",
    
    // Pipeline Steps
    step1Title: "குடிமக்கள் பற்றாக்குறை பதிவு",
    step1Desc: "குடிமக்கள் அவசர நீர் விநியோக கோரிக்கைகளை பதிவு செய்து நிலையைக் கண்காணிக்கின்றனர்.",
    step2Title: "AI பற்றாக்குறை & முன்னுரிமை ஒதுக்கீடு",
    step2Desc: "AI வழிமுறைகள் வார்டு தேவைகளை பகுப்பாய்வு செய்து டேங்கர் அளவை பரிந்துரைக்கின்றன.",
    step3Title: "நிலையம் நிரப்புதல் & நீர் தரம்",
    step3Desc: "நிலைய இயக்குபவர்கள் டேங்கர் வரிசைகளை நிர்வகித்து நீரின் தரத்தை பதிவு செய்கின்றனர்.",
    step4Title: "GPS டேங்கர் பாதை வழிகாட்டுதல்",
    step4Desc: "ஓட்டுநர்கள் உகந்த பாதைகள் வழியே சென்று நேரலை GPS இருப்பிடத்தைப் பகிர்கின்றனர்.",
    step5Title: "OTP விநியோக சரிபார்ப்பு",
    step5Desc: "பயனாளிகள் 6 இலக்க OTP வழங்கி விநியோகத்தை உறுதிப்படுத்துகின்றனர்.",

    // Dashboard Cards
    totalRequests: "மொத்த நீர் கோரிக்கைகள்",
    activeTankers: "செயலில் உள்ள டேங்கர்கள்",
    otpFulfillmentRate: "OTP விநியோக விகிதம்",
    unservedWards: "நீர் கிடைக்காத வார்டுகள்",
    aiRecommendationTitle: "AI பரிந்துரை இயந்திரம்",
    liveMapTitle: "நேரலை டேங்கர் இயக்கம்",

    // Common Terms
    capacityLiters: "லிட்டர்கள்",
    ward: "வார்டு",
    priority: "முன்னுரிமை",
    eta: "வருகை நேரம்",
    otpCode: "6-இலக்க OTP குறியீடு",
  },

  te: {
    // General
    appName: "AQUA2U",
    tagline: "స్మార్ట్ వాటర్ ట్యాంకర్ కేటాయింపు & పంపిణీ ప్లాట్‌ఫారమ్",
    searchPlaceholder: "పని లేదా అభ్యర్థన శోధించండి...",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    role: "యూజర్ పాత్ర",
    
    // Navigation
    navDashboard: "డాష్‌బోర్డ్",
    navRequests: "అభ్యర్థనలు",
    navAllocations: "AI కేటాయింపులు",
    navTankers: "ట్యాంకర్ల నౌకాదళం",
    navDeliveries: "పంపిణీలు & ఆడిట్",
    navComplaints: "ఫిర్యాదులు",
    navSources: "నీటి నింపే కేంద్రాలు",
    navRoutes: "రూట్ ఆప్టిమైజేషన్",
    navMap: "లైవ్ GPS ట్రాకింగ్",
    navEmergency: "అత్యవసర రవాణా",
    navAnalytics: "విశ్లేషణలు",
    navSettings: "సెట్టింగ్‌లు",
    navDriverApp: "డ్రైవర్ మొబైల్ యాప్",
    navResidentPortal: "పౌర పోర్టల్",
    navOperatorPortal: "స్టేషన్ ఆపరేటర్",
    navBeneficiaryPortal: "సంక్షేమ డెస్క్",
    
    // Header & Modes
    govAdminMode: "మునిసిపల్ అథారిటీ",
    privateMode: "ప్రైవేట్ సరఫరాదారు",
    liveSimActive: "లైవ్ సిమ్యులేషన్ సక్రియం",
    signOut: "సైన్ అవుట్",
    switchRole: "పాత్రను మార్చండి",

    // Common Actions
    requestWater: "నీటి ట్యాంకర్ అభ్యర్థించండి",
    orderCommercial: "ట్యాంకర్ ఆర్డర్ చేయండి",
    approve: "ఆమోదించండి",
    reject: "తిరస్కరించండి",
    dispatch: "ట్యాంకర్ రవాణా చేయండి",
    verifyOTP: "OTP సరిచూడండి",
    saveSettings: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    close: "మూసివేయండి",
    refresh: "రిఫ్రెష్ చేయండి",
    viewDetails: "వివరాలు చూడండి",

    // Status Badges
    statusUnderReview: "పరిశీలనలో ఉంది",
    statusApproved: "ఆమోదించబడింది",
    statusAllocated: "కేటాయించబడింది",
    statusInProgress: "దారిలో ఉంది",
    statusDelivered: "పంపిణీ చేయబడింది",
    statusCritical: "అత్యవసరం",
    statusPending: "పెండింగ్‌లో ఉంది",

    // Landing Page
    landingTitle1: "స్మార్ట్ వాటర్ ట్యాంకర్ కేటాయింపు",
    landingTitle2: "& పంపిణీ నిర్వహణ.",
    landingSubtitle: "AQUA2U నీటి అవసరాన్ని విశ్లేషించి AI కేటాయింపు, లైవ్ GPS ట్రాకింగ్ మరియు భద్రతా OTP పంపిణీ సరిచూడడం అందిస్తుంది.",
    landingLaunchBtn: "ప్లాట్‌ఫారమ్ ప్రారంభించండి",
    landingExploreBtn: "పోర్టల్‌లను చూడండి",
    landingTrustedBy: "మునిసిపల్ మరియు ప్రైవేట్ వాటర్ నెట్‌వర్క్‌లు",
    
    // Pipeline Steps
    step1Title: "పౌరుల కొరత నమోదు",
    step1Desc: "పౌరులు అత్యవసర నీటి సరఫరా అభ్యర్థనలను నమోదు చేసి స్థితిని ట్రాక్ చేస్తారు.",
    step2Title: "AI కొరత & ప్రాధాన్యత కేటాయింపు",
    step2Desc: "AI అల్గారిథమ్‌లు వార్డు అవసరాలను విశ్లేషించి ట్యాంకర్ పరిమాణాన్ని సిఫార్సు చేస్తాయి.",
    step3Title: "స్టేషన్ ఫిల్లింగ్ & నీటి నాణ్యత",
    step3Desc: "స్టేషన్ ఆపరేటర్లు క్యూలను నిర్వహించి నీటి నాణ్యతను నమోదు చేస్తారు.",
    step4Title: "GPS ట్యాంకర్ మార్గదర్శకత్వం",
    step4Desc: "డ్రైవర్లు ఆప్టిమైజ్ చేసిన మార్గాల్లో వెళ్తూ లైవ్ GPS సమాచారాన్ని పంచుకుంటారు.",
    step5Title: "OTP పంపిణీ సరిచూడడం",
    step5Desc: "లబ్ధిదారులు 6 అంకెల OTP ని అందించి పంపిణీని ధృవీకరిస్తారు.",

    // Dashboard Cards
    totalRequests: "మొత్తం నీటి అభ్యర్థనలు",
    activeTankers: "యాక్టివ్ GPS ట్యాంకర్లు",
    otpFulfillmentRate: "OTP పంపిణీ రేటు",
    unservedWards: "నీరు అందని వార్డులు",
    aiRecommendationTitle: "AI సిఫార్సు ఇంజిన్",
    liveMapTitle: "లైవ్ ట్యాంకర్ నిర్వహణ",

    // Common Terms
    capacityLiters: "లీటర్లు",
    ward: "వార్డు",
    priority: "ప్రాధాన్యత",
    eta: "అంచనా సమయం",
    otpCode: "6 అంకెల OTP కోడ్",
  },

  es: {
    // General
    appName: "AQUA2U",
    tagline: "Plataforma Inteligente de Asignación y Distribución de Cisternas de Agua",
    searchPlaceholder: "Buscar tarea, distrito o solicitud...",
    language: "Idioma",
    selectLanguage: "Seleccionar Idioma",
    role: "Rol de Usuario",
    
    // Navigation
    navDashboard: "Panel Principal",
    navRequests: "Solicitudes y Demandas",
    navAllocations: "Asignaciones IA",
    navTankers: "Flota de Cisternas",
    navDeliveries: "Entregas y Auditorías",
    navComplaints: "Quejas y Reclamos",
    navSources: "Estaciones de Llenado",
    navRoutes: "Optimización de Rutas",
    navMap: "Rastreo GPS en Vivo",
    navEmergency: "Despacho de Emergencia",
    navAnalytics: "Análisis y Equidad",
    navSettings: "Configuración del Sistema",
    navDriverApp: "App Móvil de Conductores",
    navResidentPortal: "Portal del Ciudadano",
    navOperatorPortal: "Operador de Estación",
    navBeneficiaryPortal: "Mesa de Bienestar",
    
    // Header & Modes
    govAdminMode: "Autoridad Municipal",
    privateMode: "Proveedor Comercial",
    liveSimActive: "Simulación en Vivo Activa",
    signOut: "Cerrar Sesión",
    switchRole: "Cambiar Portal / Rol",

    // Common Actions
    requestWater: "Solicitar Cisterna de Agua",
    orderCommercial: "Pedir Cisterna Comercial",
    approve: "Aprobar Asignación",
    reject: "Rechazar Solicitud",
    dispatch: "Despachar Cisterna",
    verifyOTP: "Verificar OTP y Completar",
    saveSettings: "Guardar Configuración",
    cancel: "Cancelar",
    close: "Cerrar",
    refresh: "Actualizar Datos",
    viewDetails: "Ver Detalles",

    // Status Badges
    statusUnderReview: "En Revisión",
    statusApproved: "Aprobado",
    statusAllocated: "Asignado",
    statusInProgress: "En Camino",
    statusDelivered: "Entregado",
    statusCritical: "Crítico",
    statusPending: "Pendiente",

    // Landing Page
    landingTitle1: "Asignación Inteligente de Cisternas",
    landingTitle2: "y Gestión de Distribución.",
    landingSubtitle: "AQUA2U analiza la demanda de agua de su ciudad y las métricas de la flota de cisternas, ofreciendo asignación por IA en tiempo real, seguimiento GPS y verificación segura por OTP.",
    landingLaunchBtn: "Iniciar Plataforma Municipal",
    landingExploreBtn: "Explorar Portales",
    landingTrustedBy: "IMPULSANDO REDES MUNICIPALES Y PRIVADAS DE AGUA",
    
    // Pipeline Steps
    step1Title: "Registro de Escasez por Ciudadanos",
    step1Desc: "Residentes y mesas de ayuda solicitan entregas de emergencia de agua y rastrean su estado en tiempo real.",
    step2Title: "Asignación Prioritaria por IA",
    step2Desc: "Los algoritmos analizan la densidad poblacional y el déficit de suministro para recomendar volúmenes de cisternas.",
    step3Title: "Llenado en Estación y Calidad",
    step3Desc: "Los operadores gestionan colas de cisternas y registran métricas de calidad de agua (pH, TDS, Turbidez).",
    step4Title: "Navegación GPS Paso a Paso",
    step4Desc: "Los conductores navegan mediante rutas optimizadas y transmiten su ubicación GPS en tiempo real.",
    step5Title: "Verificación por OTP y Registro",
    step5Desc: "Los beneficiarios proporcionan un código OTP de 6 dígitos para confirmar la entrega y cerrar la solicitud.",

    // Dashboard Cards
    totalRequests: "Solicitudes Totales de Agua",
    activeTankers: "Cisternas GPS Activas",
    otpFulfillmentRate: "Tasa de Cumplimiento OTP",
    unservedWards: "Alerta de Distritos Sin Servicio",
    aiRecommendationTitle: "Motor de Recomendación de Asignación IA",
    liveMapTitle: "Operaciones de Cisternas en Vivo",

    // Common Terms
    capacityLiters: "Litros",
    ward: "Distrito / Barrio",
    priority: "Prioridad",
    eta: "Llegada Est.",
    otpCode: "Código OTP de 6 Dígitos",
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageOption: LanguageOption;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('aqua2u_language');
      if (saved && ['en', 'hi', 'mr', 'ta', 'te', 'es'].includes(saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // Ignore
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aqua2u_language', lang);
    } catch {
      // Ignore
    }
  };

  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const translation = TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key];
    if (translation) return translation;
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currentLanguageOption, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
