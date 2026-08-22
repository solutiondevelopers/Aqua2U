import React, { useState, useEffect } from 'react';
import { usePrivate } from '../../context/PrivateContext';
import { useApp } from '../../context/AppContext';
import { PrivateOrder, PrivateTankerVehicle, PrivateWaterType } from '../../types';
import {
  Truck,
  Droplet,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  ShieldCheck,
  Plus,
  IndianRupee,
  Navigation,
  FileCheck,
  Star,
  Building,
  AlertCircle
} from 'lucide-react';

export const PrivateProviderPortal: React.FC = () => {
  const {
    currentProvider,
    providers,
    setCurrentProviderId,
    providerOrders,
    tankers,
    acceptPrivateOrder,
    rejectPrivateOrder,
    assignTankerAndDriver,
    startPrivateDelivery,
    markPrivateArrived,
    startPrivateDelivering,
    verifyAndCompleteOrder,
    addPrivateTanker
  } = usePrivate();

  const { activeTab: appActiveTab } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'fleet' | 'settings'>('orders');

  useEffect(() => {
    if (appActiveTab === 'privateFleet') {
      setActiveTab('fleet');
    } else if (appActiveTab === 'privatePricing') {
      setActiveTab('settings');
    } else if (appActiveTab === 'privateOrders') {
      setActiveTab('orders');
    }
  }, [appActiveTab]);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<PrivateOrder | null>(null);
  const [selectedTankerIdToAssign, setSelectedTankerIdToAssign] = useState<string>('PTK-105');
  const [isAddTankerModalOpen, setIsAddTankerModalOpen] = useState(false);

  // New Tanker Form State
  const [newTankerNumber, setNewTankerNumber] = useState('');
  const [newTankerCapacity, setNewTankerCapacity] = useState<number>(5000);
  const [newWaterType, setNewWaterType] = useState<PrivateWaterType>('Potable');
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverLicense, setNewDriverLicense] = useState('');

  const pendingOrders = providerOrders.filter(o => o.status === 'Order Received');
  const activeOrders = providerOrders.filter(
    o => ['Accepted', 'Tanker Assigned', 'On The Way', 'Arrived', 'Delivering'].includes(o.status)
  );
  const completedOrders = providerOrders.filter(o => o.status === 'Completed');

  const availableTankers = tankers.filter(t => t.providerId === currentProvider.id && t.status === 'Available');
  const activeTankers = tankers.filter(t => t.providerId === currentProvider.id && t.status !== 'Available' && t.status !== 'Offline');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForAssign) return;
    assignTankerAndDriver(selectedOrderForAssign.id, selectedTankerIdToAssign);
    setSelectedOrderForAssign(null);
  };

  const handleAddTankerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTankerNumber.trim()) return;
    addPrivateTanker({
      tankerNumber: newTankerNumber,
      capacityLiters: newTankerCapacity,
      waterType: newWaterType,
      driverName: newDriverName || 'Driver',
      driverPhone: newDriverPhone || '+91 98000 00000',
      driverLicense: newDriverLicense || 'MH-12-2022-009811'
    });
    setNewTankerNumber('');
    setNewDriverName('');
    setNewDriverPhone('');
    setNewDriverLicense('');
    setIsAddTankerModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Provider Dashboard Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                PRIVATE TANKER SUPPLIER PORTAL
              </span>
              {currentProvider.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Government Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {currentProvider.name}
            </h1>
            <p className="text-xs text-slate-300">
              Owner: {currentProvider.ownerName} · {currentProvider.phone} · {currentProvider.businessAddress}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddTankerModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Tanker to Fleet
            </button>
          </div>
        </div>

        {/* Operational Performance KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Orders</div>
            <div className="text-2xl font-bold text-white">{providerOrders.length + currentProvider.todayStats.totalOrders}</div>
            <div className="text-[11px] text-teal-400 font-semibold">{pendingOrders.length} New Pending</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Revenue</div>
            <div className="text-2xl font-bold text-emerald-400">
              ₹{(currentProvider.todayStats.todayRevenue + completedOrders.reduce((sum, o) => sum + o.priceWater, 0)).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Direct Settlement</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Tankers</div>
            <div className="text-2xl font-bold text-sky-400">{activeTankers.length} / {tankers.filter(t => t.providerId === currentProvider.id).length}</div>
            <div className="text-[11px] text-slate-400 font-medium">{availableTankers.length} Available at Depot</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Rating</div>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" />
              {currentProvider.rating}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">{currentProvider.reviewCount} Reviews</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Orders Management ({pendingOrders.length + activeOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'fleet'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          Fleet & Tankers ({tankers.filter(t => t.providerId === currentProvider.id).length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#0F2942] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Rates & Verification Documents
        </button>
      </div>

      {/* 1. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Pending New Orders (Awaiting Acceptance) */}
          {pendingOrders.length > 0 && (
            <div className="bg-amber-50/60 rounded-3xl border-2 border-amber-300 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <h3 className="font-bold text-amber-950 text-base">
                    New Incoming Orders Awaiting Confirmation ({pendingOrders.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {pendingOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                        <span className="text-xs text-slate-500">· {order.orderTimestamp}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-semibold">
                        Customer: {order.customerName} ({order.customerPhone})
                      </p>
                      <p className="text-xs text-slate-600">
                        📍 {order.customerAddress} ({order.customerArea})
                      </p>
                      <p className="text-xs font-bold text-teal-800">
                        Quantity: {order.quantityLiters.toLocaleString()} L · {order.waterType} · Slot: {order.preferredDeliverySlot}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => acceptPrivateOrder(order.id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Order
                      </button>

                      <button
                        onClick={() => rejectPrivateOrder(order.id, 'Depot capacity fully booked')}
                        className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50 transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Orders In-Progress */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Deliveries in Progress ({activeOrders.length})</h3>
                <p className="text-xs text-slate-500">Track dispatch, driver status and delivery execution</p>
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active deliveries currently in progress.
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-white space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-400">· {order.orderTimestamp}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium mt-1">
                          <strong>{order.customerName}</strong> ({order.customerPhone}) · 📍 {order.customerAddress}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.quantityLiters.toLocaleString()} L ({order.waterType}) · Revenue: <strong>₹{order.priceWater}</strong>
                        </p>
                      </div>

                      {/* Action Controls by Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        {order.status === 'Accepted' && (
                          <button
                            onClick={() => setSelectedOrderForAssign(order)}
                            className="px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5 text-teal-400" />
                            Assign Tanker & Driver
                          </button>
                        )}

                        {order.status === 'Tanker Assigned' && (
                          <button
                            onClick={() => startPrivateDelivery(order.id)}
                            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Start Delivery Trip
                          </button>
                        )}

                        {order.status === 'On The Way' && (
                          <button
                            onClick={() => markPrivateArrived(order.id)}
                            className="px-4 py-2 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-600 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Mark Arrived at Location
                          </button>
                        )}

                        {order.status === 'Arrived' && (
                          <button
                            onClick={() => startPrivateDelivering(order.id)}
                            className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-600 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Droplet className="w-3.5 h-3.5" />
                            Start Pumping Water
                          </button>
                        )}

                        {order.status === 'Delivering' && (
                          <button
                            onClick={() => {
                              const otp = prompt(`Enter customer delivery OTP for Order #${order.id} (Customer has code ${order.otpCode}):`);
                              if (otp) {
                                const res = verifyAndCompleteOrder(order.id, otp);
                                alert(res.message);
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete Delivery (Enter OTP)
                          </button>
                        )}
                      </div>
                    </div>

                    {order.tankerNumber && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                        <span>Assigned Vehicle: <strong>{order.tankerNumber}</strong> (Driver: {order.driverName} · {order.driverPhone})</span>
                        <span className="font-bold text-amber-800">OTP: {order.otpCode}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FLEET & TANKERS TAB */}
      {activeTab === 'fleet' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Tanker Fleet Vehicles</h3>
              <p className="text-xs text-slate-500">Managed fleet for {currentProvider.name}</p>
            </div>

            <button
              onClick={() => setIsAddTankerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tankers.filter(t => t.providerId === currentProvider.id).map(tanker => (
              <div
                key={tanker.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-white space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{tanker.tankerNumber}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tanker.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {tanker.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Capacity: <strong>{tanker.capacityLiters.toLocaleString()} L</strong> · Type: <strong>{tanker.waterType}</strong>
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Driver:</span>
                    <span className="font-semibold text-slate-800">{tanker.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver Phone:</span>
                    <span className="font-semibold text-slate-800">{tanker.driverPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">License No:</span>
                    <span className="font-medium text-slate-700">{tanker.driverLicense}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RATES & SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Commercial Rates & Government Audits</h3>
            <p className="text-xs text-slate-500">Verified compliance, lab certificates and pricing structures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Current Pricing Structure
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Base Price (5,000 Liters):</span>
                  <span className="font-bold text-slate-900">₹{currentProvider.pricePer5000L}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Per-Liter Equivalent:</span>
                  <span className="font-bold text-slate-900">₹{currentProvider.pricePerLiter} / Liter</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Operating Hours:</span>
                  <span className="font-semibold text-slate-800">{currentProvider.operatingHours}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Service Localities:</span>
                  <span className="font-semibold text-slate-800">{currentProvider.serviceAreas.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Vehicle Documents & Safety Audit
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">RTO Vehicle Fitness Certificate:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Potable Water Quality Lab Report:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed (TDS: 185 ppm)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Tanker Sanitization Certificate:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bi-Weekly Audit Passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TANKER MODAL */}
      {selectedOrderForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-slate-900 text-base">
              Assign Tanker to Order #{selectedOrderForAssign.id}
            </h3>

            <p className="text-xs text-slate-600">
              Customer requires <strong>{selectedOrderForAssign.quantityLiters.toLocaleString()} L</strong> in <strong>{selectedOrderForAssign.customerArea}</strong>.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Available Tanker & Driver:</label>
                <select
                  value={selectedTankerIdToAssign}
                  onChange={(e) => setSelectedTankerIdToAssign(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-none"
                >
                  {tankers.filter(t => t.providerId === currentProvider.id).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.tankerNumber} ({t.capacityLiters} L) · Driver: {t.driverName} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForAssign(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2942] text-white font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TANKER MODAL */}
      {isAddTankerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-slate-900 text-base">Add Tanker to Fleet</h3>

            <form onSubmit={handleAddTankerSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Vehicle Registration Number:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-12-XX-9900"
                  value={newTankerNumber}
                  onChange={(e) => setNewTankerNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanker Capacity (L):</label>
                  <select
                    value={newTankerCapacity}
                    onChange={(e) => setNewTankerCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value={2000}>2,000 L</option>
                    <option value={5000}>5,000 L</option>
                    <option value={10000}>10,000 L</option>
                    <option value={20000}>20,000 L</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Water Standard:</label>
                  <select
                    value={newWaterType}
                    onChange={(e) => setNewWaterType(e.target.value as PrivateWaterType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="Potable">Potable</option>
                    <option value="Non-Potable">Non-Potable</option>
                    <option value="RO Purified">RO Purified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Assigned Driver Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Shinde"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Driver Mobile Phone:</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTankerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2942] text-white font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Save Tanker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
