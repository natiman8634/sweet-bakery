
import React, { useState } from 'react';
// Added X to the lucide-react imports to fix the 'Cannot find name X' error on line 258
import { 
  Package, Clock, CheckCircle, MapPin, Store, Truck, ArrowLeft, 
  ShoppingBag, ChevronRight, Check, ClipboardCheck, Home, 
  Calendar, Hash, ShoppingCart, Fingerprint, Flame, UserCheck, 
  ShieldCheck, History, User, CreditCard, Star, RefreshCw, X
} from 'lucide-react';
import { Order, User as UserType } from '../types';

interface CustomerOrdersProps {
  user: UserType;
  orders: Order[];
  onNavigateHome: () => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ user, orders, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'history'>('tracking');
  
  const myOrders = orders.filter(o => o.customer === user.name);
  const activeOrders = myOrders.filter(o => !['Delivered', 'Cancelled', 'Picked Up'].includes(o.status));
  const historicalOrders = myOrders.filter(o => ['Delivered', 'Cancelled', 'Picked Up'].includes(o.status))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpend = myOrders
    .filter(o => o.status === 'Delivered' || o.status === 'Picked Up')
    .reduce((acc, o) => acc + parseFloat(o.total.replace('$', '')), 0);

  // Stages for Delivery Path
  const deliveryStages = [
    { key: 'Confirmed', label: 'Order Confirmed', icon: ClipboardCheck, color: 'text-blue-500' },
    { key: 'Preparing', label: 'In Preparation', icon: Package, color: 'text-amber-500' },
    { key: 'Transit', label: 'Out for Delivery', icon: Truck, color: 'text-blue-400' },
    { key: 'Delivered', label: 'Order Delivered', icon: Home, color: 'text-emerald-500' }
  ];

  // Stages for Pickup Path
  const pickupStages = [
    { key: 'Confirmed', label: 'Order Received', icon: ClipboardCheck, color: 'text-blue-500' },
    { key: 'Preparing', label: 'Baking & Prep', icon: Flame, color: 'text-orange-500' },
    { key: 'Ready', label: 'Ready at Bakery', icon: Store, color: 'text-amber-500' },
    { key: 'Collected', label: 'Picked Up', icon: UserCheck, color: 'text-emerald-500' }
  ];

  const getActiveStageIndex = (status: string, method: 'Delivery' | 'Pickup') => {
    if (method === 'Pickup') {
      if (status === 'Pending') return 0;
      if (status === 'Preparing') return 1;
      if (status === 'Ready for Pickup') return 2;
      if (status === 'Delivered' || status === 'Picked Up') return 3;
    } else {
      if (status === 'Pending') return 0;
      if (status === 'Preparing' || status === 'Ready for Pickup') return 1;
      if (status === 'Out for Delivery') return 2;
      if (status === 'Delivered') return 3;
    }
    return -1;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Overview Header */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 md:p-12 mb-10 flex flex-col md:flex-row gap-10 items-center animate-fade-in">
            <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-bakery-light rounded-full flex items-center justify-center text-bakery-accent border-4 border-white shadow-xl">
                    <User size={48} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                    <CheckCircle size={20} />
                </div>
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-2">
                        {user.name}
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start">
                        <Calendar size={12} className="mr-2" /> Member Since {user.joinDate || '2024'}
                    </p>
                </div>
                <p className="text-xs font-medium text-gray-500 max-w-lg leading-relaxed italic">
                    "{user.bio || 'Artisan treat enthusiast and lover of fresh-baked sourdough.'}"
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center min-w-[140px]">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Treats</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">{myOrders.length}</p>
                </div>
                <div className="bg-bakery-accent p-6 rounded-3xl flex flex-col items-center justify-center min-w-[140px] text-white shadow-lg shadow-bakery-accent/20">
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Artisan Spend</p>
                    <p className="text-2xl font-black tracking-tighter">${totalSpend.toFixed(2)}</p>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex p-1.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <button 
                    onClick={() => setActiveTab('tracking')}
                    className={`flex items-center space-x-3 px-8 py-3 rounded-xl transition-all ${activeTab === 'tracking' ? 'bg-bakery-dark text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Tracking</span>
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center space-x-3 px-8 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-bakery-dark text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    <History size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Order History</span>
                </button>
            </div>
            
            <button 
                onClick={onNavigateHome}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-bakery-accent transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Shop
            </button>
        </div>

        {activeTab === 'tracking' && (
            <div className="space-y-10 animate-slide-up">
                {activeOrders.length > 0 ? (
                    activeOrders.map((order) => {
                        const isPickup = order.deliveryMethod === 'Pickup';
                        const trackerStages = isPickup ? pickupStages : deliveryStages;
                        const currentIdx = getActiveStageIndex(order.status, order.deliveryMethod);
                        const trackingID = order.id.replace('ORD-', '').substring(0, 8);
                        
                        return (
                            <div key={order.id} className="bg-white rounded-[3rem] border border-emerald-500/10 ring-4 ring-emerald-500/5 overflow-hidden shadow-xl p-8 sm:p-12">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
                                    <div className="flex items-center gap-6 text-left">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isPickup ? 'bg-amber-50 shadow-amber-500/20' : 'bg-blue-50 shadow-blue-500/20'}`}>
                                            {isPickup ? <Store size={28} /> : <Truck size={28} />}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-2">
                                                ID: {order.id.replace('ORD-', '')}
                                            </h3>
                                            <div className="flex gap-2">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isPickup ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                    {order.deliveryMethod}
                                                </span>
                                                <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-bakery-dark text-white rounded-[2rem] p-6 flex items-center gap-6 shadow-xl shadow-bakery-dark/10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-2xl font-black italic tracking-tighter">{order.total}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-bakery-accent">
                                            <CreditCard size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Security OTP Block */}
                                <div className={`mb-12 border rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between animate-pulse-slow gap-8 ${isPickup ? 'bg-blue-500/5 border-blue-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                    <div className="flex items-center space-x-6 text-left">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isPickup ? 'bg-blue-600 shadow-blue-600/20' : 'bg-amber-500 shadow-amber-500/20'}`}>
                                            {isPickup ? <ShieldCheck size={28} /> : <Fingerprint size={28} />}
                                        </div>
                                        <div>
                                            <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isPickup ? 'text-blue-600' : 'text-amber-600'}`}>
                                                {isPickup ? 'Artisan Collection Code' : 'Secure Delivery Passcode'}
                                            </p>
                                            <p className="text-xs font-bold text-gray-600 max-w-xs leading-relaxed">
                                                {isPickup 
                                                  ? 'Provide this code at the counter to finalize your collection.' 
                                                  : 'Provide this to the rider to confirm successful delivery.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`bg-white px-10 py-5 rounded-2xl border-4 text-4xl font-black tracking-[0.4em] shadow-xl ${isPickup ? 'border-blue-600 text-blue-600 shadow-blue-500/10' : 'border-amber-500 text-amber-500 shadow-amber-500/10'}`}>
                                        {order.verificationOTP || '--- ---'}
                                    </div>
                                </div>

                                {/* Stage Progress */}
                                <div className="relative mb-20 px-8">
                                    <div className="absolute top-[15px] left-[12%] right-[12%] h-2 bg-gray-100 rounded-full"></div>
                                    <div 
                                        className="absolute top-[15px] left-[12%] h-2 bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.max(0, currentIdx) * (76 / (trackerStages.length - 1))}%` }}
                                    ></div>

                                    <div className="relative flex justify-between">
                                        {trackerStages.map((stage, idx) => {
                                            const isCompleted = idx <= currentIdx;
                                            const isCurrent = idx === currentIdx;
                                            const Icon = stage.icon;
                                            return (
                                                <div key={stage.key} className="flex flex-col items-center w-1/4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 border-4 border-white shadow-lg ${
                                                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-white'
                                                    } ${isCurrent ? 'scale-125 ring-8 ring-emerald-500/10' : ''}`}>
                                                        {isCompleted && <Check size={14} strokeWidth={4} />}
                                                    </div>
                                                    <div className="mt-10 flex flex-col items-center">
                                                        <div className={`mb-4 p-4 rounded-2xl transition-all duration-500 shadow-sm ${isCompleted ? 'bg-white ' + stage.color + ' border border-gray-100' : 'bg-gray-50 text-gray-300 border border-transparent'}`}>
                                                            <Icon size={24} />
                                                        </div>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                                            {stage.label}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 text-left">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                        <ShoppingBag size={14} className="mr-2 text-bakery-accent" /> Artisan Items
                                    </h4>
                                    <p className="text-base font-bold text-gray-700 italic">"{order.items}"</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-200">
                        <ShoppingBag size={48} className="text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No Active Baking</h3>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-10">Your pantry is ready for its next refill.</p>
                        <button onClick={onNavigateHome} className="px-10 py-4 bg-bakery-dark text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-bakery-accent transition-all">Order Treats</button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'history' && (
            <div className="animate-slide-up">
                {historicalOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {historicalOrders.map((order) => {
                            const isCancelled = order.status === 'Cancelled';
                            return (
                                <div key={order.id} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all group text-left flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCancelled ? 'bg-red-50 text-red-400' : 'bg-emerald-50 text-emerald-500'}`}>
                                                {isCancelled ? <X size={24} /> : <CheckCircle size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <h4 className="text-lg font-black text-gray-900 tracking-tight italic uppercase">Ref: {order.id.replace('ORD-', '')}</h4>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isCancelled ? 'bg-red-50 text-red-400 border-red-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-grow space-y-6">
                                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Items</p>
                                            <p className="text-xs font-bold text-gray-700 italic truncate">"{order.items}"</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-bakery-light flex items-center justify-center text-bakery-accent border border-bakery-accent/10">
                                                    <Store size={14} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{order.vendor || 'Sweet Bakery'}</p>
                                            </div>
                                            <p className="text-xl font-black text-gray-900 italic tracking-tighter">{order.total}</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={onNavigateHome}
                                        className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-bakery-accent transition-all group/btn"
                                    >
                                        <RefreshCw size={14} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                                        <span>Order Again</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-200">
                        <History size={48} className="text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Artisan Journey Begins</h3>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-10">Your historical logs will appear here after your first delivery.</p>
                        <button onClick={onNavigateHome} className="px-10 py-4 bg-bakery-dark text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-bakery-accent transition-all">Order First Treat</button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
