import React, { useState, useEffect } from 'react';
import { usePrivate } from '../../context/PrivateContext';
import { useApp } from '../../context/AppContext';
import {
  PrivateOrder,
  PrivateWaterType,
  PrivateCustomerUsageType,
  PrivateProvider
} from '../../types';
import {
  Droplet,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Phone,
  Plus,
  Navigation,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  Home,
  Utensils,
  HardHat,
  Search,
  Filter,
  Check,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const PrivateCustomerPortal: React.FC = () => {
  const {
    customer,
    customerOrders,
    activeCustomerOrder,
    providers,
    createPrivateOrder,
    verifyAndCompleteOrder,
    submitOrderFeedback,
    reportPrivateIssue,
    cancelPrivateOrder,
    addSavedAddress,
    deleteSavedAddress
  } = usePrivate();

  const { activeTab: appActiveTab } = useApp();
  // Navigation tabs inside Private Customer Portal
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'support'>('dashboard');

  useEffect(() => {
    if (appActiveTab === 'privateOrder') {
      setActiveTab('dashboard');
      setIsOrderModalOpen(true);
    } else if (appActiveTab === 'privateTrack') {
      setActiveTab('dashboard');
      setIsTrackingModalOpen(true);
    } else if (appActiveTab === 'privateHistory') {
      setActiveTab('orders');
    }
  }, [appActiveTab]);

  // Modal / Flow State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<PrivateOrder | null>(null);

  // New Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Office');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Baner');
  const [newAddrSociety, setNewAddrSociety] = useState('');

  // Order Placement Multi-Step State
  const [orderStep, setOrderStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(5000);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [selectedWaterType, setSelectedWaterType] = useState<PrivateWaterType>('Potable');
  const [selectedUsage, setSelectedUsage] = useState<PrivateCustomerUsageType>('Home');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(customer.savedAddresses[0]?.id || 'default');
  const [deliverySlot, setDeliverySlot] = useState<string>('Today · Immediate (30–45 mins)');
  const [isImmediate, setIsImmediate] = useState<boolean>(true);
  
  // Provider Filtering
  const [selectedProviderId, setSelectedProviderId] = useState<string>('PROV-01');
  const [filterWaterType, setFilterWaterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'eta'>('rating');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Verification & Feedback State
  const [verifyOtpInput, setVerifyOtpInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [issueText, setIssueText] = useState('');

  const currentAddress = customer.savedAddresses.find(a => a.id === selectedAddressId) || customer.savedAddresses[0] || {
    label: 'Home',
    address: customer.address,
    area: customer.area,
    lat: customer.gpsLocation.lat,
    lng: customer.gpsLocation.lng
  };

  const selectedProvider = providers.find(p => p.id === selectedProviderId) || providers[0];
  const effectiveQuantity = customQuantity ? Number(customQuantity) || 5000 : selectedQuantity;
  const calcPriceWater = Math.round(selectedProvider.pricePer5000L * (effectiveQuantity / 5000));
  const calcDelivery = 100;
  const calcPlatformFee = 20;
  const calcTotal = calcPriceWater + calcDelivery + calcPlatformFee;

  // Filtered & Sorted Providers
  const filteredProviders = providers
    .filter(p => p.verified)
    .filter(p => filterWaterType === 'All' || p.waterTypes.includes(filterWaterType as PrivateWaterType))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.pricePer5000L - b.pricePer5000L;
      if (sortBy === 'eta') return a.etaMinutesAverage - b.etaMinutesAverage;
      return 0;
    });

  const handleOpenOrderFlow = (prefillQty?: number) => {
    if (prefillQty) setSelectedQuantity(prefillQty);
    setOrderStep(1);
    setIsOrderModalOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      const newOrder = createPrivateOrder({
        quantityLiters: effectiveQuantity,
        waterType: selectedWaterType,
        usageType: selectedUsage,
        customerAddress: currentAddress.address,
        customerArea: currentAddress.area,
        societyName: currentAddress.societyName,
        coords: { lat: currentAddress.lat, lng: currentAddress.lng },
        preferredDeliverySlot: deliverySlot,
        isImmediate,
        providerId: selectedProvider.id,
        paymentMethod
      });

      setIsOrderModalOpen(false);
      setSelectedOrderForAction(newOrder);
      setIsTrackingModalOpen(true);
    }, 1200);
  };

  const handleOpenVerifyModal = (order: PrivateOrder) => {
    setSelectedOrderForAction(order);
    setVerifyOtpInput(order.otpCode);
    setVerifyError('');
    setIsFeedbackSubmitted(false);
    setIsVerifyModalOpen(true);
  };

  const handleVerifyDelivery = () => {
    if (!selectedOrderForAction) return;
    const res = verifyAndCompleteOrder(selectedOrderForAction.id, verifyOtpInput);
    if (!res.success) {
      setVerifyError(res.message);
    } else {
      setIsFeedbackSubmitted(true);
    }
  };

  const handleSubmitRating = () => {
    if (!selectedOrderForAction) return;
    submitOrderFeedback(selectedOrderForAction.id, feedbackRating, feedbackComment);
    setIsVerifyModalOpen(false);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    addSavedAddress({
      label: newAddrLabel,
      address: newAddrText,
      area: newAddrArea,
      societyName: newAddrSociety,
      lat: 18.5590,
      lng: 73.7868,
      isDefault: false
    });
    setNewAddrText('');
    setNewAddrSociety('');
    setIsAddAddressOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Order Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-sky-200 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PRIVATE WATER DELIVERY SERVICE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {customer.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-sky-100/90 leading-relaxed">
              Order verified, lab-tested water tankers for your home, apartment society, restaurant, or business in Pune. Fast dispatch with real-time GPS tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenOrderFlow()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-md hover:bg-emerald-300 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Droplet className="w-5 h-5 fill-slate-950" />
              ORDER WATER NOW
            </button>
          </div>
        </div>

        {/* Decorative Water Ripple background graphics */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-sky-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Dashboard & Active Orders
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          Order History ({customerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Saved Addresses ({customer.savedAddresses.length})
        </button>
      </div>

      {/* 1. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Active Order Card (If any in progress) */}
          {activeCustomerOrder && (
            <div className="bg-white rounded-3xl border-2 border-teal-500/40 p-6 shadow-md relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      ACTIVE DELIVERY
                    </span>
                    <span className="text-xs font-bold text-slate-500">Order #{activeCustomerOrder.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-teal-600" />
                    {activeCustomerOrder.quantityLiters.toLocaleString()} Liters ({activeCustomerOrder.waterType})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provider: <strong className="text-slate-800">{activeCustomerOrder.providerName}</strong> · Placed at {activeCustomerOrder.orderTimestamp}
                  </p>
                </div>

                {/* Status Indicator & ETA */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Status</div>
                    <div className="text-sm font-bold text-teal-700">{activeCustomerOrder.status}</div>
                  </div>

                  {activeCustomerOrder.status === 'On The Way' && (
                    <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">Estimated Arrival</div>
                      <div className="text-sm font-black text-emerald-800">{activeCustomerOrder.etaMinutes} mins ({activeCustomerOrder.distanceKm} km)</div>
                    </div>
                  )}

                  <div className="bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200 text-center">
                    <div className="text-[10px] uppercase font-bold text-amber-700">Delivery OTP</div>
                    <div className="text-base font-black text-amber-900 tracking-widest">{activeCustomerOrder.otpCode}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrderForAction(activeCustomerOrder);
                      setIsTrackingModalOpen(true);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Navigation className="w-4 h-4 text-teal-400" />
                    Live Map Track
                  </button>

                  <button
                    onClick={() => handleOpenVerifyModal(activeCustomerOrder)}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Delivery
                  </button>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                    ['Order Received', 'Accepted', 'Tanker Assigned', 'On The Way', 'Arrived', 'Delivering', 'Completed'].includes(activeCustomerOrder.status)
                      ? 'bg-teal-50/70 border-teal-200 text-teal-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>1. Confirmed</span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                    ['Tanker Assigned', 'On The Way', 'Arrived', 'Delivering', 'Completed'].includes(activeCustomerOrder.status)
                      ? 'bg-teal-50/70 border-teal-200 text-teal-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>2. Tanker Assigned ({activeCustomerOrder.tankerNumber || 'Pending'})</span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                    ['On The Way', 'Arrived', 'Delivering', 'Completed'].includes(activeCustomerOrder.status)
                      ? 'bg-teal-50/70 border-teal-200 text-teal-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <Navigation className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>3. On The Way</span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                    ['Completed'].includes(activeCustomerOrder.status)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4. Delivered & Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Order Presets */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Instant Order by Tanker Capacity</h3>
                <p className="text-xs text-slate-500">Select standard capacity to find available verified tankers in Baner & Pune</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Preset 1 */}
              <div
                onClick={() => handleOpenOrderFlow(2000)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    2K
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    From ₹500
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-900">2,000 Liters</h4>
                  <p className="text-xs text-slate-500">Mini Tanker · Cafes, Independent Villas & Small Shops</p>
                </div>
                <div className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                  Book 2,000 L <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Preset 2 - Most Popular */}
              <div
                onClick={() => handleOpenOrderFlow(5000)}
                className="p-5 rounded-2xl border-2 border-teal-500 bg-teal-50/20 hover:bg-teal-50/40 transition cursor-pointer space-y-3 relative group"
              >
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  MOST POPULAR
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    5K
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    From ₹900
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-900">5,000 Liters</h4>
                  <p className="text-xs text-slate-500">Standard Tanker · Homes, Societies & Restaurants</p>
                </div>
                <div className="text-[11px] font-bold text-teal-800 flex items-center gap-1">
                  Book 5,000 L <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Preset 3 */}
              <div
                onClick={() => handleOpenOrderFlow(10000)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    10K
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    From ₹1,700
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-900">10,000 Liters</h4>
                  <p className="text-xs text-slate-500">Large Tanker · Medium Apartment Societies & Commercial Units</p>
                </div>
                <div className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                  Book 10,000 L <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Preset 4 */}
              <div
                onClick={() => handleOpenOrderFlow(20000)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    20K
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    From ₹3,200
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-900">20,000 Liters</h4>
                  <p className="text-xs text-slate-500">Heavy Duty · Large Societies, Construction Sites & Industries</p>
                </div>
                <div className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                  Book 20,000 L <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Verified Private Tanker Suppliers in Pune */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verified Private Tanker Suppliers (Baner & Pune)</h3>
                <p className="text-xs text-slate-500">Government audited water quality, certified sanitization & fixed rates</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
                >
                  <option value="rating">Top Rated ⭐</option>
                  <option value="price">Lowest Price (₹)</option>
                  <option value="eta">Fastest ETA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProviders.map(provider => (
                <div
                  key={provider.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-white space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-base">{provider.name}</h4>
                        {provider.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {provider.businessAddress}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {provider.rating} ({provider.reviewCount})
                      </div>
                    </div>
                  </div>

                  {/* Highlights & Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                      5,000L: <strong>₹{provider.pricePer5000L}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                      Avg ETA: <strong>{provider.etaMinutesAverage} min</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                      Fleet: <strong>{provider.fleetCount} Tankers</strong>
                    </span>
                    {provider.waterTypes.map(wt => (
                      <span key={wt} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-[11px] font-medium border border-sky-100">
                        {wt}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Operating: {provider.operatingHours}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProviderId(provider.id);
                        handleOpenOrderFlow(5000);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-xs"
                    >
                      Book Tanker
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDER HISTORY VIEW */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Private Water Orders</h3>
              <p className="text-xs text-slate-500">History of all residential and commercial water deliveries</p>
            </div>
          </div>

          <div className="space-y-3">
            {customerOrders.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-white space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-400">· {order.orderTimestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong>{order.quantityLiters.toLocaleString()} L ({order.waterType})</strong> via <strong>{order.providerName}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      📍 {order.customerAddress}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-base font-bold text-slate-900">₹{order.totalAmount}</span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {order.customerRating && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (order.customerRating || 0) ? 'fill-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <span>"{order.customerFeedback}"</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    {order.tankerNumber ? `Tanker: ${order.tankerNumber} (${order.driverName || 'Driver'})` : 'Tanker pending assignment'}
                  </span>

                  <div className="flex items-center gap-2">
                    {order.status !== 'Completed' && order.status !== 'Cancelled' ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOrderForAction(order);
                            setIsTrackingModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 font-bold hover:bg-teal-100 transition cursor-pointer"
                        >
                          Track Live
                        </button>
                        <button
                          onClick={() => handleOpenVerifyModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedQuantity(order.quantityLiters);
                          setSelectedWaterType(order.waterType);
                          setSelectedProviderId(order.providerId);
                          handleOpenOrderFlow(order.quantityLiters);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Re-Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SAVED ADDRESSES VIEW */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Delivery Locations</h3>
              <p className="text-xs text-slate-500">Manage frequently used delivery points for 1-click water tanker ordering</p>
            </div>

            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.savedAddresses.map(addr => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-white space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{addr.label}</h4>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>

                  {customer.savedAddresses.length > 1 && (
                    <button
                      onClick={() => deleteSavedAddress(addr.id)}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {addr.address}
                </p>
                {addr.societyName && (
                  <p className="text-[11px] text-slate-400">
                    Society: {addr.societyName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: MULTI-STEP PRIVATE ORDER FLOW                   */}
      {/* ======================================================== */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Header & Steps Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Step {orderStep} of 4 · Private Water Tanker Order
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {orderStep === 1 && '1. Select Quantity & Water Type'}
                  {orderStep === 2 && '2. Delivery Location & Preferred Slot'}
                  {orderStep === 3 && '3. Choose Verified Tanker Supplier'}
                  {orderStep === 4 && '4. Review & Online Payment'}
                </h2>
              </div>

              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: QUANTITY & TYPE */}
            {orderStep === 1 && (
              <div className="space-y-5">
                {/* Quantity Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Water Quantity (Liters):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[2000, 5000, 10000, 20000].map(qty => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => {
                          setSelectedQuantity(qty);
                          setCustomQuantity('');
                        }}
                        className={`p-3.5 rounded-2xl border text-center font-bold text-sm transition cursor-pointer ${
                          selectedQuantity === qty && !customQuantity
                            ? 'border-teal-600 bg-teal-50/60 text-teal-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>{qty.toLocaleString()} L</div>
                        <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                          {qty === 2000 ? 'Mini Tanker' : qty === 5000 ? 'Standard' : qty === 10000 ? 'Large' : 'Heavy'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Or enter custom quantity (L):</label>
                  <input
                    type="number"
                    placeholder="e.g. 8000"
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Water Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Water Quality Standard:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { type: 'Potable' as PrivateWaterType, desc: 'Drinking & Kitchen Safe' },
                      { type: 'Non-Potable' as PrivateWaterType, desc: 'Utility, Washing & Flushing' },
                      { type: 'RO Purified' as PrivateWaterType, desc: 'Commercial & Restaurant Grade' }
                    ].map(item => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setSelectedWaterType(item.type)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          selectedWaterType === item.type
                            ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.type}</div>
                        <div className="text-[10px] font-normal text-slate-500">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Usage Category */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Usage Category:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'Home' as PrivateCustomerUsageType, icon: Home },
                      { role: 'Apartment / Society' as PrivateCustomerUsageType, icon: Building2 },
                      { role: 'Restaurant' as PrivateCustomerUsageType, icon: Utensils },
                      { role: 'Construction Site' as PrivateCustomerUsageType, icon: HardHat }
                    ].map(u => {
                      const Icon = u.icon;
                      return (
                        <button
                          key={u.role}
                          type="button"
                          onClick={() => setSelectedUsage(u.role)}
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                            selectedUsage === u.role
                              ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="truncate">{u.role}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOrderStep(2)}
                    className="px-6 py-3 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
                  >
                    Continue to Location <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & SLOT */}
            {orderStep === 2 && (
              <div className="space-y-5">
                {/* Saved Address Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Select Delivery Location:</label>
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(true)}
                      className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      + Add New Location
                    </button>
                  </div>

                  <div className="space-y-2">
                    {customer.savedAddresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                          selectedAddressId === addr.id
                            ? 'border-teal-600 bg-teal-50/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 rounded">
                              {addr.area}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{addr.address}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedAddressId === addr.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                        }`}>
                          {selectedAddressId === addr.id && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Time Slot */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Preferred Delivery Slot:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Today · Immediate (30–45 mins)',
                      'Today · 2:00 PM – 4:00 PM',
                      'Today · 5:00 PM – 7:00 PM',
                      'Tomorrow · 07:00 AM – 09:00 AM'
                    ].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setDeliverySlot(slot);
                          setIsImmediate(slot.includes('Immediate'));
                        }}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                          deliverySlot === slot
                            ? 'border-teal-600 bg-teal-50 text-teal-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setOrderStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderStep(3)}
                    className="px-6 py-3 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
                  >
                    Find Verified Tankers <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CHOOSE VERIFIED TANKER SUPPLIER */}
            {orderStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Showing verified providers serving <strong>{currentAddress.area}</strong></span>
                  <span className="text-teal-700 font-bold">{filteredProviders.length} Available Tankers</span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {filteredProviders.map(provider => {
                    const priceForQty = Math.round(provider.pricePer5000L * (effectiveQuantity / 5000));
                    return (
                      <div
                        key={provider.id}
                        onClick={() => setSelectedProviderId(provider.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                          selectedProviderId === provider.id
                            ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 text-sm">{provider.name}</h4>
                              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                Verified ✓
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              ETA: <strong>{provider.etaMinutesAverage} mins</strong> · Distance: <strong>{provider.distanceKmAverage} km</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-extrabold text-slate-900">
                              ₹{priceForQty}
                            </div>
                            <div className="text-[10px] font-bold text-amber-700 flex items-center justify-end gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              {provider.rating} ({provider.reviewCount})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>✓ Tanker Sanitized</span>
                          <span>·</span>
                          <span>✓ TDS & Chlorine Tested</span>
                          <span>·</span>
                          <span>✓ GPS Telemetry Enabled</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setOrderStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderStep(4)}
                    className="px-6 py-3 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
                  >
                    Proceed to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ITEMIZATION & PAYMENT */}
            {orderStep === 4 && (
              <div className="space-y-5">
                {/* Order Summary Box */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order Breakdown
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Water ({effectiveQuantity.toLocaleString()} L · {selectedWaterType} by {selectedProvider.name}):</span>
                      <span className="font-semibold text-slate-900">₹{calcPriceWater}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Standard Delivery & Fuel Charge:</span>
                      <span className="font-semibold text-slate-900">₹{calcDelivery}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform & Tanker Quality Audit Fee:</span>
                      <span className="font-semibold text-slate-900">₹{calcPlatformFee}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                      <span>Total Payable:</span>
                      <span className="text-emerald-700">₹{calcTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Target Verification */}
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-sky-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Delivering to:</strong> {currentAddress.address} ({currentAddress.area})
                    <div className="text-[11px] text-sky-800 mt-0.5">Slot: {deliverySlot}</div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { method: 'UPI' as const, label: 'Instant UPI (GPay / PhonePe / QR)', icon: QrCode },
                      { method: 'Card' as const, label: 'Credit / Debit Card', icon: CreditCard },
                      { method: 'Net Banking' as const, label: 'Net Banking (All Banks)', icon: Building2 },
                      { method: 'Cash on Delivery' as const, label: 'Cash on Delivery (To Driver)', icon: FileText }
                    ].map(p => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.method}
                          type="button"
                          onClick={() => setPaymentMethod(p.method)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                            paymentMethod === p.method
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-emerald-700" />
                          <span className="truncate">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOrderStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isPaymentProcessing}
                    onClick={handleConfirmOrder}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-500 transition cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Authorizing ₹{calcTotal}...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        PAY ₹{calcTotal} & BOOK TANKER
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: LIVE GPS TRACKING MODAL                         */}
      {/* ======================================================== */}
      {isTrackingModalOpen && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Live GPS Fleet Telemetry
                </span>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-teal-600" />
                  Order #{selectedOrderForAction.id} · {selectedOrderForAction.providerName}
                </h2>
              </div>

              <button
                onClick={() => setIsTrackingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Map Canvas */}
            <div className="h-64 sm:h-72 w-full rounded-2xl bg-slate-900 relative overflow-hidden border border-slate-700 flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

              {/* Street simulation routes */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 60 180 Q 240 120 420 160 T 680 80" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 6" />
              </svg>

              {/* Tanker Marker */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center animate-bounce">
                <div className="px-2 py-0.5 rounded bg-[#0F2942] text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                  🚚 {selectedOrderForAction.tankerNumber || 'Tanker TK-P104'}
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Truck className="w-4 h-4" />
                </div>
              </div>

              {/* Destination Pin */}
              <div className="absolute top-1/4 right-1/4 z-10 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                  📍 {selectedOrderForAction.customerArea} (Delivery Point)
                </div>
                <MapPin className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>

              {/* Telemetry Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                <div>
                  <span className="text-slate-400">Current Speed:</span> <strong className="text-teal-400">32 km/h</strong>
                </div>
                <div>
                  <span className="text-slate-400">ETA:</span> <strong className="text-emerald-400">{selectedOrderForAction.etaMinutes} mins</strong>
                </div>
                <div>
                  <span className="text-slate-400">Distance:</span> <strong>{selectedOrderForAction.distanceKm} km</strong>
                </div>
                <div>
                  <span className="text-slate-400">Water Temp / TDS:</span> <strong>24°C / 185 ppm</strong>
                </div>
              </div>
            </div>

            {/* Driver & Verification Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned Driver & Tanker
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {selectedOrderForAction.driverName || 'Ramesh Kumar'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Vehicle: {selectedOrderForAction.tankerNumber || 'MH-12-PQ-8841'} (5,000 L)
                    </p>
                  </div>
                  <a
                    href={`tel:${selectedOrderForAction.driverPhone || '+91 98230 44551'}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Driver
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Your Delivery Verification OTP
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-amber-900 tracking-widest">
                    {selectedOrderForAction.otpCode}
                  </div>
                  <span className="text-[11px] text-amber-800">
                    Share this code with driver after water is pumped
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  handleOpenVerifyModal(selectedOrderForAction);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Enter OTP & Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELIVERY VERIFICATION & RATING MODAL            */}
      {/* ======================================================== */}
      {isVerifyModalOpen && selectedOrderForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Delivery Confirmation
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Was your water delivered?
                </h2>
              </div>

              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isFeedbackSubmitted ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please verify that <strong>{selectedOrderForAction.quantityLiters.toLocaleString()} Liters</strong> of water was pumped into your storage tank by <strong>{selectedOrderForAction.providerName}</strong>.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Enter Verification OTP (or confirm prefilled OTP):
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={verifyOtpInput}
                    onChange={(e) => {
                      setVerifyOtpInput(e.target.value);
                      setVerifyError('');
                    }}
                    placeholder="e.g. 7421"
                    className="w-full text-center tracking-widest text-xl font-black bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                  {verifyError && (
                    <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {verifyError}
                    </p>
                  )}
                </div>

                <div className="pt-3 flex flex-col gap-2">
                  <button
                    onClick={handleVerifyDelivery}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-500 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    YES, DELIVERY RECEIVED
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Please describe the issue (e.g. Inadequate quantity, leakage, delayed):');
                      if (reason) {
                        reportPrivateIssue(selectedOrderForAction.id, reason);
                        alert('Issue reported to customer support and provider.');
                        setIsVerifyModalOpen(false);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    REPORT A PROBLEM
                  </button>
                </div>
              </div>
            ) : (
              /* Rating and Feedback step */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Delivery Verified Successfully!</h3>
                  <p className="text-xs text-slate-500">How was your service with {selectedOrderForAction.providerName}?</p>
                </div>

                {/* 5 Stars */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 cursor-pointer transition hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${star <= feedbackRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Feedback (Optional):</label>
                  <textarea
                    rows={3}
                    placeholder="Punctual delivery, clean stainless steel tanker, exact quantity..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  onClick={handleSubmitRating}
                  className="w-full py-3 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Submit Review & Finish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD NEW SAVED ADDRESS                           */}
      {/* ======================================================== */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Delivery Location</h3>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Location Label (e.g. Office, Site):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hinjawadi Tech Park"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Area / Locality in Pune:</label>
                <select
                  value={newAddrArea}
                  onChange={(e) => setNewAddrArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none"
                >
                  {['Baner', 'Kothrud', 'Aundh', 'Hinjawadi', 'Wakad', 'Hadapsar', 'Kharadi', 'Viman Nagar', 'Bavdhan'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Full Address:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Plot/Flat No, Building Name, Landmark..."
                  value={newAddrText}
                  onChange={(e) => setNewAddrText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-600">Apartment / Society Name (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Quadron Tech Park"
                  value={newAddrSociety}
                  onChange={(e) => setNewAddrSociety(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2942] text-white font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
