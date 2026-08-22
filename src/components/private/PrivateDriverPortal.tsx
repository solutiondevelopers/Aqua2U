import React, { useState } from 'react';
import { usePrivate } from '../../context/PrivateContext';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Droplet,
  AlertTriangle,
  Clock,
  Check,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const PrivateDriverPortal: React.FC = () => {
  const {
    driverOrders,
    activeDriverOrder,
    startPrivateDelivery,
    markPrivateArrived,
    startPrivateDelivering,
    verifyAndCompleteOrder,
    reportPrivateIssue
  } = usePrivate();

  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDriverOrder) return;
    const res = verifyAndCompleteOrder(activeDriverOrder.id, otpInput);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setIsOtpModalOpen(false);
      setIsSuccessModalOpen(true);
      setOtpInput('');
      setOtpError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Driver & Vehicle Header Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                DRIVER CONSOLE
              </span>
              <h2 className="text-xl font-bold">Ramesh Kumar</h2>
              <p className="text-xs text-slate-300">
                Vehicle: <strong>MH-12-PQ-8841</strong> (5,000 L Potable) · AquaFresh Tankers
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            On Duty
          </div>
        </div>
      </div>

      {/* Active Trip / Job Assigned */}
      {activeDriverOrder ? (
        <div className="bg-white rounded-3xl border-2 border-teal-500 p-6 space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                CURRENT ASSIGNED DELIVERY
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Order #{activeDriverOrder.id}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {activeDriverOrder.status}
            </span>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Customer</div>
                  <div className="text-sm font-bold text-slate-900">{activeDriverOrder.customerName}</div>
                  <div className="text-slate-600 font-medium">{activeDriverOrder.customerPhone}</div>
                </div>

                <a
                  href={`tel:${activeDriverOrder.customerPhone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Customer
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Address:</strong> {activeDriverOrder.customerAddress} ({activeDriverOrder.customerArea})
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                <div className="text-[10px] uppercase font-bold text-sky-700">Water Quantity</div>
                <div className="text-sm font-bold text-sky-950">
                  {activeDriverOrder.quantityLiters.toLocaleString()} L ({activeDriverOrder.waterType})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] uppercase font-bold text-emerald-700">Payment Status</div>
                <div className="text-sm font-bold text-emerald-950">
                  {activeDriverOrder.paymentStatus} (₹{activeDriverOrder.totalAmount})
                </div>
              </div>
            </div>
          </div>

          {/* Big Driver Step Controls */}
          <div className="space-y-3 pt-2">
            {activeDriverOrder.status === 'Tanker Assigned' && (
              <button
                onClick={() => startPrivateDelivery(activeDriverOrder.id)}
                className="w-full py-4 rounded-2xl bg-teal-600 text-white font-extrabold text-base hover:bg-teal-500 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                START TRIP (I AM ON THE WAY)
              </button>
            )}

            {activeDriverOrder.status === 'On The Way' && (
              <button
                onClick={() => markPrivateArrived(activeDriverOrder.id)}
                className="w-full py-4 rounded-2xl bg-sky-700 text-white font-extrabold text-base hover:bg-sky-600 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                I HAVE ARRIVED AT DESTINATION
              </button>
            )}

            {activeDriverOrder.status === 'Arrived' && (
              <button
                onClick={() => startPrivateDelivering(activeDriverOrder.id)}
                className="w-full py-4 rounded-2xl bg-indigo-700 text-white font-extrabold text-base hover:bg-indigo-600 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Droplet className="w-5 h-5" />
                START PUMPING WATER INTO SUMP
              </button>
            )}

            {activeDriverOrder.status === 'Delivering' && (
              <button
                onClick={() => {
                  setOtpInput('');
                  setOtpError('');
                  setIsOtpModalOpen(true);
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-base hover:bg-emerald-500 transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                ENTER CUSTOMER OTP TO COMPLETE
              </button>
            )}

            {/* Roadblock / Delay Report */}
            <button
              onClick={() => {
                const note = prompt('Describe delay/roadblock reason (e.g. Heavy traffic on Baner Road, narrow society gate):');
                if (note) {
                  reportPrivateIssue(activeDriverOrder.id, `Driver Report: ${note}`);
                  alert('Status updated for customer and provider.');
                }
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Report Traffic / Delay to Customer
            </button>
          </div>
        </div>
      ) : (
        /* No active delivery */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Pending Delivery Jobs</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are ready and idle at depot. You will be notified automatically when the supplier assigns a new tanker delivery.
          </p>
        </div>
      )}

      {/* Driver's Past Deliveries */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm">Today's Completed Trips</h3>
        <div className="space-y-2">
          {driverOrders.filter(o => o.status === 'Completed').map(order => (
            <div
              key={order.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">Order #{order.id} · {order.customerName}</div>
                <div className="text-slate-500">{order.quantityLiters.toLocaleString()} L · {order.customerArea}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ✓ Delivered
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* OTP ENTRY MODAL FOR DRIVER */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verify Customer OTP</h3>
              <p className="text-xs text-slate-500">
                Ask customer for their 4-digit code (e.g. 7421)
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                required
                maxLength={4}
                autoFocus
                placeholder="4-digit OTP"
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setOtpError('');
                }}
                className="w-full text-center tracking-widest text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-teal-500"
              />

              {otpError && (
                <p className="text-xs font-bold text-rose-600 text-center">
                  {otpError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition cursor-pointer shadow-xs"
                >
                  Verify & Finish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delivery Completed!</h3>
            <p className="text-xs text-slate-500">
              The order has been marked completed and the customer will receive an invoice receipt.
            </p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Back to Driver Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
