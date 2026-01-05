
import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, CheckCircle, Navigation, ArrowRight, Archive, Map as MapIcon, ChevronUp, ChevronDown, Locate, Plus, ShoppingBag, DollarSign, ExternalLink, Copy, AlertCircle, Clock, Store, Sparkles, Loader2, Fingerprint, Send, PackageSearch } from 'lucide-react';
import { Order, User } from '../types';
import { aiService } from '../services/aiService';

interface DeliveryDashboardProps {
  user: User;
  orders: Order[];
  onNavigateHome: () => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ 
    user, 
    orders, 
    onNavigateHome,
    onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'requests'>('requests');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => console.warn('Location access denied.')
        );
    }
  }, []);

  const unassignedOrders = orders.filter(o => o.assignedTo === 'Unassigned' && o.deliveryMethod === 'Delivery' && !['Delivered', 'Cancelled'].includes(o.status));
  const activeDeliveries = orders.filter(o => o.assignedTo === user.name && !['Delivered', 'Cancelled', 'Picked Up'].includes(o.status));
  const pastDeliveries = orders.filter(o => o.assignedTo === user.name && ['Delivered', 'Cancelled', 'Picked Up'].includes(o.status));

  const handleGetAIBrief = async () => {
    if (activeDeliveries.length === 0) return;
    setIsLoadingBrief(true);
    const brief = await aiService.getDeliveryBrief(activeDeliveries);
    setAiBriefing(brief);
    setIsLoadingBrief(false);
  };

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    let nextStatus = '';
    // Status Guard: Rider moves from Pickup to Out for Delivery
    if (currentStatus === 'Ready for Pickup' || currentStatus === 'Preparing' || currentStatus === 'Pending') {
      nextStatus = 'Out for Delivery';
    }
    if (nextStatus) onUpdateOrder(orderId, { status: nextStatus });
  };

  const handleOTPSubmit = (orderId: string) => {
    const input = otpInputs[orderId];
    if (!input || input.length !== 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
    }
    
    // Send the OTP update. App.tsx logic will handle the verification and status update.
    onUpdateOrder(orderId, { riderProvidedOTP: input });
  };

  const handleAcceptOrder = (orderId: string) => {
      onUpdateOrder(orderId, { assignedTo: user.name, status: 'Preparing' });
      setActiveTab('current');
  };

  const openExternalMap = (address: string, location?: { lat: number, lng: number }) => {
    const dest = location ? `${location.lat},${location.lng}` : encodeURIComponent(address);
    let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    if (currentLocation) url += `&origin=${currentLocation.lat},${currentLocation.lng}`;
    window.open(url, '_blank');
  };

  const renderOrderCard = (order: Order, isRequest: boolean) => {
    const isHeadingToBakery = ['Preparing', 'Pending', 'Ready for Pickup'].includes(order.status);
    const isHeadingToCustomer = order.status === 'Out for Delivery';
    const hasSubmittedOTP = !!order.riderProvidedOTP;

    return (
        <div key={order.id} className="bg-[#131b2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-8 relative group">
            <div className={`absolute top-0 left-0 w-2 h-full ${isRequest ? 'bg-purple-500' : isHeadingToBakery ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <div className="p-8 space-y-8 text-left">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <span className="font-mono text-blue-400 font-black text-sm uppercase tracking-widest">{order.id}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{order.customer}</h3>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                        isRequest ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                        isHeadingToBakery ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                        {order.status.toUpperCase()}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Navigation</label>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 cursor-pointer" onClick={() => openExternalMap(order.address, order.location)}>
                            <p className="text-xs font-bold text-white leading-relaxed">{order.address}</p>
                        </div>
                        <button 
                            onClick={() => openExternalMap(order.address, order.location)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center transition-all text-[10px] uppercase tracking-widest"
                        >
                            <Navigation size={16} className="mr-2" /> Start Route
                        </button>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Actions</label>
                        {isRequest ? (
                            <button onClick={() => handleAcceptOrder(order.id)} className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] bg-purple-600 hover:bg-purple-500 text-white shadow-2xl">Accept Task</button>
                        ) : isHeadingToCustomer ? (
                            <div className="space-y-4">
                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center">
                                        <Fingerprint size={12} className="mr-2"/> Customer Passcode
                                    </p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            maxLength={6}
                                            placeholder="Enter 6-digit OTP"
                                            value={otpInputs[order.id] || ''}
                                            disabled={hasSubmittedOTP}
                                            onChange={(e) => setOtpInputs({...otpInputs, [order.id]: e.target.value.replace(/\D/g, '')})}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black tracking-widest text-white flex-grow focus:border-amber-500 outline-none"
                                        />
                                        <button 
                                            onClick={() => handleOTPSubmit(order.id)}
                                            disabled={hasSubmittedOTP}
                                            className={`p-3 rounded-xl transition-all ${hasSubmittedOTP ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-bakery-dark hover:bg-white'}`}
                                        >
                                            {hasSubmittedOTP ? <CheckCircle size={18}/> : <Send size={18}/>}
                                        </button>
                                    </div>
                                    {hasSubmittedOTP && (
                                        <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-2">Submitted. System will auto-verify delivery.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => handleStatusUpdate(order.id, order.status)} className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] bg-amber-500 hover:bg-amber-400 text-bakery-dark shadow-2xl">
                                Confirm Artisan Pickup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a101f] text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="md:col-span-2 bg-[#131b2e] p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20"><Truck size={32} /></div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Rider Portal</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{user.name}</p>
                    </div>
                </div>
            </div>
            <div className="bg-amber-500 p-8 rounded-[2.5rem] flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-bakery-dark/60 uppercase tracking-widest mb-1">Successful Trips</p>
                <p className="text-4xl font-black text-bakery-dark tracking-tighter italic">{pastDeliveries.length}</p>
            </div>
        </div>

        {activeTab === 'current' && activeDeliveries.length > 0 && (
            <div className="mb-10 bg-indigo-600/20 border border-indigo-500/30 rounded-[2rem] p-8 text-left relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Sparkles size={16} className="text-indigo-400" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">AI Tactical Briefing</h4>
                        </div>
                        <button onClick={handleGetAIBrief} disabled={isLoadingBrief} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-500 transition-all shadow-lg">
                            {isLoadingBrief ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        </button>
                    </div>
                    <p className="text-sm font-medium text-gray-300 italic">{aiBriefing || "Tap the sparkle to get an intelligent routing strategy."}</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Truck size={120} /></div>
            </div>
        )}

        <div className="flex flex-col sm:flex-row p-1.5 bg-[#131b2e] rounded-[1.5rem] border border-white/5 mb-10 gap-2">
            {[
                { id: 'requests', label: 'Marketplace', icon: ShoppingBag, count: unassignedOrders.length },
                { id: 'current', label: 'Current Route', icon: Navigation, count: activeDeliveries.length },
                { id: 'history', label: 'Trip Logs', icon: Archive, count: pastDeliveries.length },
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-4 px-6 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                    <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
            ))}
        </div>

        <div className="space-y-4">
            {activeTab === 'requests' && (
                unassignedOrders.length > 0 ? (
                    unassignedOrders.map(order => renderOrderCard(order, true))
                ) : (
                    <div className="bg-[#131b2e] rounded-[3rem] p-20 border border-dashed border-white/10 text-center animate-fade-in">
                        <PackageSearch size={48} className="text-gray-600 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Marketplace is Quiet</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wait for new artisan requests to appear.</p>
                    </div>
                )
            )}
            
            {activeTab === 'current' && (
                activeDeliveries.length > 0 ? (
                    activeDeliveries.map(order => renderOrderCard(order, false))
                ) : (
                    <div className="bg-[#131b2e] rounded-[3rem] p-20 border border-dashed border-white/10 text-center">
                        <Navigation size={48} className="text-gray-600 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">No Active Route</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Accept a task from the marketplace to begin.</p>
                    </div>
                )
            )}

            {activeTab === 'history' && pastDeliveries.map(order => (
                <div key={order.id} className="bg-[#131b2e] rounded-3xl border border-white/5 p-8 flex justify-between items-center opacity-70">
                    <div className="text-left">
                        <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{order.customer}</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{order.address}</p>
                    </div>
                    <div className="text-right">
                         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/5 mb-2 inline-block">COMPLETED</span>
                         <p className="text-xl font-black text-white italic tracking-tighter">{order.total}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
