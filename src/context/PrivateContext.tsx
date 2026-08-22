import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PrivateRole,
  PrivateCustomerProfile,
  PrivateProvider,
  PrivateTankerVehicle,
  PrivateOrder,
  PrivateOrderStatus,
  PrivateSavedAddress
} from '../types';
import {
  INITIAL_PRIVATE_CUSTOMER,
  INITIAL_PRIVATE_PROVIDERS,
  INITIAL_PRIVATE_TANKERS,
  INITIAL_PRIVATE_ORDERS
} from '../data/privateMockData';

interface PrivateContextType {
  privateRole: PrivateRole;
  setPrivateRole: (role: PrivateRole) => void;
  activePrivateTab: string;
  setActivePrivateTab: (tab: string) => void;

  // Customer State & Actions
  customer: PrivateCustomerProfile;
  updateCustomerProfile: (profile: Partial<PrivateCustomerProfile>) => void;
  addSavedAddress: (address: Omit<PrivateSavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;

  // Providers State & Actions
  providers: PrivateProvider[];
  currentProvider: PrivateProvider;
  setCurrentProviderId: (id: string) => void;
  registerProvider: (data: Partial<PrivateProvider>) => PrivateProvider;

  // Tankers Fleet State & Actions
  tankers: PrivateTankerVehicle[];
  addPrivateTanker: (tanker: Partial<PrivateTankerVehicle>) => void;

  // Orders State & Actions
  orders: PrivateOrder[];
  customerOrders: PrivateOrder[];
  providerOrders: PrivateOrder[];
  driverOrders: PrivateOrder[];
  activeCustomerOrder: PrivateOrder | null;
  activeDriverOrder: PrivateOrder | null;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Order Lifecycle Handlers
  createPrivateOrder: (data: Partial<PrivateOrder>) => PrivateOrder;
  acceptPrivateOrder: (orderId: string) => void;
  rejectPrivateOrder: (orderId: string, reason?: string) => void;
  assignTankerAndDriver: (orderId: string, tankerId: string) => void;
  startPrivateDelivery: (orderId: string) => void;
  markPrivateArrived: (orderId: string) => void;
  startPrivateDelivering: (orderId: string) => void;
  verifyAndCompleteOrder: (orderId: string, otp: string, photoUrl?: string) => { success: boolean; message: string };
  submitOrderFeedback: (orderId: string, rating: number, feedback: string) => void;
  reportPrivateIssue: (orderId: string, issue: string) => void;
  cancelPrivateOrder: (orderId: string) => void;

  // Registration Draft for Private Flow
  registerPrivateCustomer: (customerData: Partial<PrivateCustomerProfile>) => void;
}

const PrivateContext = createContext<PrivateContextType | undefined>(undefined);

export const PrivateAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [privateRole, setPrivateRole] = useState<PrivateRole>('private_customer');
  const [activePrivateTab, setActivePrivateTab] = useState<string>('dashboard');
  
  const [customer, setCustomer] = useState<PrivateCustomerProfile>(INITIAL_PRIVATE_CUSTOMER);
  const [providers, setProviders] = useState<PrivateProvider[]>(INITIAL_PRIVATE_PROVIDERS);
  const [currentProviderId, setCurrentProviderId] = useState<string>('PROV-01');
  const [tankers, setTankers] = useState<PrivateTankerVehicle[]>(INITIAL_PRIVATE_TANKERS);
  const [orders, setOrders] = useState<PrivateOrder[]>(INITIAL_PRIVATE_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('PO-1024');

  const currentProvider = providers.find(p => p.id === currentProviderId) || providers[0];

  // Filtered views based on separation of concerns
  const customerOrders = orders.filter(o => o.customerId === customer.id || o.customerName === customer.name);
  const providerOrders = orders.filter(o => o.providerId === currentProvider.id);
  const driverOrders = orders.filter(o => o.driverName === 'Ramesh Kumar' || o.tankerId === 'PTK-104');

  // Active in-progress orders
  const activeCustomerOrder = customerOrders.find(
    o => o.status !== 'Completed' && o.status !== 'Cancelled'
  ) || null;

  const activeDriverOrder = driverOrders.find(
    o => o.status === 'On The Way' || o.status === 'Arrived' || o.status === 'Delivering' || o.status === 'Tanker Assigned'
  ) || null;

  // Live map simulation ticker for active order
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.status === 'On The Way' && order.etaMinutes > 1) {
            const nextEta = Math.max(1, order.etaMinutes - 1);
            const nextDistance = Math.max(0.2, Number((order.distanceKm - 0.15).toFixed(1)));
            return {
              ...order,
              etaMinutes: nextEta,
              distanceKm: nextDistance
            };
          }
          return order;
        })
      );
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const updateCustomerProfile = (profile: Partial<PrivateCustomerProfile>) => {
    setCustomer(prev => ({ ...prev, ...profile }));
  };

  const addSavedAddress = (newAddr: Omit<PrivateSavedAddress, 'id'>) => {
    const newId = `ADDR-${Date.now()}`;
    setCustomer(prev => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, { ...newAddr, id: newId }]
    }));
  };

  const deleteSavedAddress = (id: string) => {
    setCustomer(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter(a => a.id !== id)
    }));
  };

  const registerPrivateCustomer = (customerData: Partial<PrivateCustomerProfile>) => {
    const newProfile: PrivateCustomerProfile = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customerData.name || 'Private Customer',
      phone: customerData.phone || '+91 98220 00000',
      email: customerData.email || 'customer@example.com',
      address: customerData.address || 'Pune',
      area: customerData.area || 'Baner',
      societyName: customerData.societyName || '',
      gstNumber: customerData.gstNumber || '',
      usageType: customerData.usageType || 'Home',
      gpsLocation: customerData.gpsLocation || { lat: 18.5590, lng: 73.7868 },
      savedAddresses: [
        {
          id: 'ADDR-1',
          label: 'Primary Location',
          address: customerData.address || 'Pune',
          area: customerData.area || 'Baner',
          societyName: customerData.societyName || '',
          lat: customerData.gpsLocation?.lat || 18.5590,
          lng: customerData.gpsLocation?.lng || 73.7868,
          isDefault: true
        }
      ]
    };
    setCustomer(newProfile);
    setPrivateRole('private_customer');
  };

  const registerProvider = (data: Partial<PrivateProvider>): PrivateProvider => {
    const newProvId = `PROV-${String(providers.length + 1).padStart(2, '0')}`;
    const newProvider: PrivateProvider = {
      id: newProvId,
      name: data.name || 'Private Water Supplies',
      ownerName: data.ownerName || 'Owner Name',
      phone: data.phone || '+91 98220 00000',
      email: data.email || 'provider@example.com',
      businessAddress: data.businessAddress || 'Pune, Maharashtra',
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      verificationStatus: 'Pending Verification',
      fleetCount: data.fleetCount || 2,
      pricePer5000L: data.pricePer5000L || 900,
      pricePerLiter: data.pricePerLiter || 0.18,
      availableCapacities: data.availableCapacities || [2000, 5000, 10000],
      waterTypes: data.waterTypes || ['Potable', 'Non-Potable'],
      serviceAreas: data.serviceAreas || ['Baner', 'Kothrud', 'Aundh'],
      operatingHours: data.operatingHours || '06:00 AM – 09:00 PM',
      etaMinutesAverage: 35,
      distanceKmAverage: 4.0,
      vehicleDocuments: {
        fitnessCertificate: true,
        waterQualityLabReport: true,
        tankerSanitizationAudit: false
      },
      todayStats: {
        totalOrders: 0,
        completedOrders: 0,
        activeOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0
      }
    };

    setProviders(prev => [newProvider, ...prev]);
    setCurrentProviderId(newProvId);
    return newProvider;
  };

  const addPrivateTanker = (tankerData: Partial<PrivateTankerVehicle>) => {
    const newId = `PTK-${Date.now().toString().slice(-3)}`;
    const newTanker: PrivateTankerVehicle = {
      id: newId,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      tankerNumber: tankerData.tankerNumber || 'MH-12-AB-1234',
      capacityLiters: tankerData.capacityLiters || 5000,
      waterType: tankerData.waterType || 'Potable',
      driverName: tankerData.driverName || 'Assigned Driver',
      driverPhone: tankerData.driverPhone || '+91 98000 00000',
      driverLicense: tankerData.driverLicense || 'MH-12-2022-0019281',
      status: 'Available',
      currentCoords: { lat: 18.5590, lng: 73.7868 }
    };
    setTankers(prev => [newTanker, ...prev]);
  };

  // Order Placement
  const createPrivateOrder = (data: Partial<PrivateOrder>): PrivateOrder => {
    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const quantity = data.quantityLiters || 5000;
    const provider = providers.find(p => p.id === data.providerId) || currentProvider;
    const priceWater = provider.pricePer5000L * (quantity / 5000);
    const priceDelivery = 100;
    const pricePlatformFee = 20;
    const total = priceWater + priceDelivery + pricePlatformFee;

    const newOrder: PrivateOrder = {
      id: newId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: data.customerAddress || customer.address,
      customerArea: data.customerArea || customer.area,
      societyName: data.societyName || customer.societyName,
      usageType: data.usageType || customer.usageType,
      coords: data.coords || customer.gpsLocation,
      quantityLiters: quantity,
      waterType: data.waterType || 'Potable',
      preferredDeliverySlot: data.preferredDeliverySlot || 'Today · Immediate',
      isImmediate: data.isImmediate ?? true,
      providerId: provider.id,
      providerName: provider.name,
      providerRating: provider.rating,
      providerPhone: provider.phone,
      priceWater,
      priceDelivery,
      pricePlatformFee,
      totalAmount: total,
      paymentStatus: (data.paymentMethod === 'Cash on Delivery') ? 'Pending' : 'Paid Online',
      paymentMethod: data.paymentMethod || 'UPI',
      paymentTransactionId: `UPI-TXN-${Date.now().toString().slice(-8)}`,
      status: 'Order Received',
      orderTimestamp: `${nowTime} · Today`,
      etaMinutes: provider.etaMinutesAverage || 35,
      distanceKm: provider.distanceKmAverage || 3.2,
      otpCode: generatedOtp,
      isVerified: false,
      statusHistory: [
        {
          status: 'Order Received',
          timestamp: `${nowTime} · Today`,
          note: 'Order placed & payment authorized.'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    return newOrder;
  };

  const acceptPrivateOrder = (orderId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Accepted',
            statusHistory: [
              ...order.statusHistory,
              { status: 'Accepted', timestamp: `${nowTime} · Today`, note: 'Provider accepted order.' }
            ]
          };
        }
        return order;
      })
    );
  };

  const rejectPrivateOrder = (orderId: string, reason?: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled',
            problemReported: reason || 'Rejected by provider due to unavailability',
            statusHistory: [
              ...order.statusHistory,
              { status: 'Cancelled', timestamp: `${nowTime} · Today`, note: reason || 'Order rejected.' }
            ]
          };
        }
        return order;
      })
    );
  };

  const assignTankerAndDriver = (orderId: string, tankerId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const tanker = tankers.find(t => t.id === tankerId);

    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Tanker Assigned',
            tankerId: tanker?.id || 'PTK-104',
            tankerNumber: tanker?.tankerNumber || 'MH-12-PQ-8841',
            driverName: tanker?.driverName || 'Ramesh Kumar',
            driverPhone: tanker?.driverPhone || '+91 98230 44551',
            statusHistory: [
              ...order.statusHistory,
              {
                status: 'Tanker Assigned',
                timestamp: `${nowTime} · Today`,
                note: `Assigned Tanker ${tanker?.tankerNumber || 'MH-12-PQ-8841'} (Driver: ${tanker?.driverName || 'Ramesh Kumar'})`
              }
            ]
          };
        }
        return order;
      })
    );

    // update tanker status
    setTankers(prev =>
      prev.map(t => (t.id === tankerId ? { ...t, status: 'Assigned', activeOrderId: orderId } : t))
    );
  };

  const startPrivateDelivery = (orderId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'On The Way',
            statusHistory: [
              ...order.statusHistory,
              { status: 'On The Way', timestamp: `${nowTime} · Today`, note: 'Tanker left depot and is on the way.' }
            ]
          };
        }
        return order;
      })
    );
  };

  const markPrivateArrived = (orderId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Arrived',
            etaMinutes: 0,
            distanceKm: 0,
            statusHistory: [
              ...order.statusHistory,
              { status: 'Arrived', timestamp: `${nowTime} · Today`, note: 'Tanker arrived at customer delivery location.' }
            ]
          };
        }
        return order;
      })
    );
  };

  const startPrivateDelivering = (orderId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Delivering',
            statusHistory: [
              ...order.statusHistory,
              { status: 'Delivering', timestamp: `${nowTime} · Today`, note: 'Pumping water into underground / overhead sump.' }
            ]
          };
        }
        return order;
      })
    );
  };

  const verifyAndCompleteOrder = (orderId: string, otp: string, photoUrl?: string): { success: boolean; message: string } => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found' };
    }

    if (otp.trim() !== targetOrder.otpCode.trim()) {
      return { success: false, message: 'Invalid verification OTP. Please check the 4-digit code in customer app.' };
    }

    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Completed',
            isVerified: true,
            verifiedAt: `${nowTime} · Today`,
            deliveryPhotoUrl: photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18fe2b7?auto=format&fit=crop&w=600&q=80',
            statusHistory: [
              ...order.statusHistory,
              { status: 'Completed', timestamp: `${nowTime} · Today`, note: 'Customer verified delivery via digital OTP.' }
            ]
          };
        }
        return order;
      })
    );

    // Free up tanker
    if (targetOrder.tankerId) {
      setTankers(prev =>
        prev.map(t => (t.id === targetOrder.tankerId ? { ...t, status: 'Available', activeOrderId: undefined } : t))
      );
    }

    return { success: true, message: 'Delivery successfully verified and completed!' };
  };

  const submitOrderFeedback = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            customerRating: rating,
            customerFeedback: feedback
          };
        }
        return order;
      })
    );
  };

  const reportPrivateIssue = (orderId: string, issue: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            problemReported: issue
          };
        }
        return order;
      })
    );
  };

  const cancelPrivateOrder = (orderId: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled',
            statusHistory: [
              ...order.statusHistory,
              { status: 'Cancelled', timestamp: `${nowTime} · Today`, note: 'Cancelled by customer' }
            ]
          };
        }
        return order;
      })
    );
  };

  return (
    <PrivateContext.Provider
      value={{
        privateRole,
        setPrivateRole,
        activePrivateTab,
        setActivePrivateTab,
        customer,
        updateCustomerProfile,
        addSavedAddress,
        deleteSavedAddress,
        providers,
        currentProvider,
        setCurrentProviderId,
        registerProvider,
        tankers,
        addPrivateTanker,
        orders,
        customerOrders,
        providerOrders,
        driverOrders,
        activeCustomerOrder,
        activeDriverOrder,
        selectedOrderId,
        setSelectedOrderId,
        createPrivateOrder,
        acceptPrivateOrder,
        rejectPrivateOrder,
        assignTankerAndDriver,
        startPrivateDelivery,
        markPrivateArrived,
        startPrivateDelivering,
        verifyAndCompleteOrder,
        submitOrderFeedback,
        reportPrivateIssue,
        cancelPrivateOrder,
        registerPrivateCustomer
      }}
    >
      {children}
    </PrivateContext.Provider>
  );
};

export const usePrivate = () => {
  const context = useContext(PrivateContext);
  if (!context) {
    throw new Error('usePrivate must be used within a PrivateAppProvider');
  }
  return context;
};

