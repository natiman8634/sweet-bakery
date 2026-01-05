
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Plus, Search, Edit, Trash2, 
  DollarSign, Store, X, Clock, Archive, Phone, Calendar, Layers, 
  CheckCircle2, AlertTriangle, ChevronRight, TrendingUp, ChevronDown, History, Sparkles, Loader2, Fingerprint, Info, ShieldCheck, Send, UserCheck
} from 'lucide-react';
import { Product, Order, User, UserRole } from '../types';
import { aiService } from '../services/aiService';

interface VendorDashboardProps {
  user: User;
  products: Product[];
  users: any[];
  orders: Order[];
  onNavigateHome: () => void;
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

type TabType = 'overview' | 'products' | 'orders';

const VendorDashboard: React.FC<VendorDashboardProps> = ({ 
    user, products, users, orders, onAddProduct, onEditProduct, onDeleteProduct, onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orderFilter, setOrderFilter] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [pickupOtpInputs, setPickupOtpInputs] = useState<Record<string, string>>({});
  
  const myProducts = products.filter(p => p.vendor === user.name);
  const myOrders = orders.filter(o => o.vendor === user.name);
  const activeOrders = myOrders.filter(o => !['Delivered', 'Cancelled', 'Picked Up'].includes(o.status));
  const historicalOrders = myOrders.filter(o => ['Delivered', 'Cancelled', 'Picked Up'].includes(o.status));

  const deliveryUsers = users.filter(u => u.role === UserRole.DELIVERY);

  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: '', price: 0, category: 'bread', description: '', 
    image: 'https://images.unsplash.com/photo-1585478259715-876a2560efc8?auto=format&fit=crop&w=800&q=80',
    stock: 20, vendor: user.name,
    occasion: undefined, breadType: 'white'
  });

  const stats = [
    { 
        title: 'Total Revenue', 
        value: `$${myOrders.filter(o => o.status === 'Delivered').reduce((a,c) => a + parseFloat(c.total.replace('$','')), 0).toFixed(2)}`, 
        icon: <DollarSign size={20} />, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10' 
    },
    { 
        title: 'Active Tasks', 
        value: activeOrders.length.toString(), 
        icon: <ShoppingBag size={20} />, 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/10' 
    },
    { 
        title: 'My Catalog', 
        value: myProducts.length.toString(), 
        icon: <Package size={20} />, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10' 
    },
    { 
        title: 'Growth Rate', 
        value: '+12.5%', 
        icon: <TrendingUp size={20} />, 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10' 
    },
  ];

  const handleAIDescription = async () => {
    if (!formProduct.name) return;
    setIsGenerating(true);
    const desc = await aiService.generateProductDescription(formProduct.name, formProduct.category || 'treat');
    setFormProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEditProduct({ ...editingProduct, ...formProduct } as Product);
    } else {
      onAddProduct({ 
        ...formProduct, 
        id: Math.random().toString(36).substr(2, 9), 
        rating: 5,
        vendor: user.name 
      } as Product);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleVerifyPickup = (orderId: string) => {
    const input = pickupOtpInputs[orderId];
    if (!input || input.length !== 6) {
        alert("Please enter a valid 6-digit code provided by the customer.");
        return;
    }
    onUpdateOrder(orderId, { riderProvidedOTP: input });
  };

  const handleStatusChange = (orderId: string, newStatus: string, isPickup: boolean, isUnassigned: boolean) => {
    if (newStatus === 'Out for Delivery' && !isPickup && isUnassigned) {
      alert("Warning: An order cannot be sent 'Out for Delivery' until a rider has accepted the task.");
      return;
    }
    onUpdateOrder(orderId, { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-[#0a101f] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Store size={20} className="text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Artisan Workshop</span>
                </div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                    Bakery <span className="text-amber-500">Suite</span>
                </h1>
                <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">Logged in as {user.name}</p>
            </div>

            <div className="flex p-1 bg-[#131b2e] rounded-2xl border border-white/5">
                {[
                    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'products', label: 'My Catalog', icon: Package },
                    { id: 'orders', label: 'Order Hub', icon: ShoppingBag },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        <tab.icon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'overview' && (
            <div className="space-y-10 animate-slide-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#131b2e] p-8 rounded-[2.5rem] border border-white/5 shadow-sm group hover:border-amber-500/30 transition-all">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>{stat.icon}</div>
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</h6>
                            <p className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#131b2e] p-10 rounded-[3rem] border border-white/5">
                        <div className="flex items-center justify-between mb-8 text-left">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Recent <span className="text-amber-500">Activity</span></h3>
                            <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">View All</button>
                        </div>
                        <div className="space-y-4">
                            {activeOrders.length > 0 ? activeOrders.slice(0, 3).map(o => (
                                <div key={o.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-white uppercase">{o.customer}</p>
                                            <p className="text-[10px] font-bold text-gray-500">{o.items.slice(0, 30)}...</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">{o.status}</span>
                                </div>
                            )) : (
                                <p className="text-gray-500 italic text-center py-10">No active orders found.</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-amber-500 p-10 rounded-[3rem] text-left flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-bakery-dark uppercase italic tracking-tighter leading-none mb-4">Artisan <br/> Insight</h3>
                            <p className="text-xs font-bold text-bakery-dark/70 uppercase tracking-widest mb-8 leading-relaxed">Your most popular item this week is "Artisan Sourdough". Consider increasing production by 15%.</p>
                        </div>
                        <CheckCircle2 size={120} className="absolute -bottom-4 -right-4 text-bakery-dark/5" />
                        <button onClick={() => setActiveTab('products')} className="relative z-10 w-full py-4 bg-bakery-dark text-white text-[10px] font-black uppercase tracking-widest rounded-2xl">Refine Inventory</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
            <div className="bg-[#131b2e] rounded-[3rem] shadow-xl border border-white/5 overflow-hidden animate-slide-up">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h5 className="text-2xl font-black uppercase italic tracking-tighter text-left">My Artisan <span className="text-amber-500">Portfolio</span></h5>
                    <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="bg-amber-500 text-bakery-dark text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-white transition-all flex items-center shadow-lg shadow-amber-500/10">
                        <Plus size={16} className="mr-2" /> Launch New Treat
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                                <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {myProducts.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center space-x-4">
                                            <img src={p.image} className="w-10 h-10 rounded-xl object-cover" alt={p.name} />
                                            <span className="font-bold text-white">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                            {p.category} {p.breadType || p.occasion ? '• ' : ''}{p.breadType || p.occasion}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`font-bold ${p.stock && p.stock < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                                            {p.stock} units
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => { setEditingProduct(p); setFormProduct(p); setShowProductModal(true); }} className="p-3 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all">
                                                <Edit size={16}/>
                                            </button>
                                            <button onClick={() => onDeleteProduct(p.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div className="space-y-8 animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex p-1 bg-[#131b2e] rounded-2xl border border-white/5 shadow-sm">
                        <button onClick={() => setOrderFilter('ACTIVE')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${orderFilter === 'ACTIVE' ? 'bg-amber-500 text-bakery-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <Clock size={14} className="mr-2" /> Live Orders ({activeOrders.length})
                        </button>
                        <button onClick={() => setOrderFilter('HISTORY')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${orderFilter === 'HISTORY' ? 'bg-amber-500 text-bakery-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <History size={14} className="mr-2" /> Audit History ({historicalOrders.length})
                        </button>
                    </div>
                </div>

                {orderFilter === 'ACTIVE' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {activeOrders.map(o => {
                            const isPickup = o.deliveryMethod === 'Pickup';
                            const isReady = o.status === 'Ready for Pickup';
                            const isUnassigned = o.assignedTo === 'Unassigned';
                            
                            return (
                                <div key={o.id} className="bg-[#131b2e] p-10 rounded-[3rem] border border-white/5 shadow-sm flex flex-col h-full hover:border-amber-500/20 transition-all">
                                    <div className="flex justify-between items-start mb-8 text-left">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-amber-500 font-mono text-[10px] font-black uppercase tracking-widest">Ref: {o.id}</span>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${isPickup ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                                    {o.deliveryMethod}
                                                </span>
                                            </div>
                                            <h6 className="text-2xl font-black text-white italic tracking-tighter leading-none uppercase">{o.customer}</h6>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <select 
                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${
                                                    o.status === 'Pending' ? 'bg-amber-500 text-bakery-dark border-amber-600' : 
                                                    o.status === 'Preparing' ? 'bg-blue-500 text-white border-blue-600' : 
                                                    'bg-[#1a253a] text-white border-white/10'
                                                }`}
                                                value={o.status}
                                                onChange={(e) => handleStatusChange(o.id, e.target.value, isPickup, isUnassigned)}
                                            >
                                                <option value="Pending" className="bg-[#1a253a] text-white">Pending</option>
                                                <option value="Preparing" className="bg-[#1a253a] text-white">Preparing</option>
                                                <option value="Ready for Pickup" className="bg-[#1a253a] text-white">Ready for Pickup</option>
                                                {/* Constraint: Only show "Out for Delivery" if a rider is assigned */}
                                                {!isPickup && !isUnassigned && <option value="Out for Delivery" className="bg-[#1a253a] text-white">Out for Delivery</option>}
                                                <option value="Cancelled" className="bg-[#1a253a] text-white">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-grow text-left">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Artisan Selection</p>
                                            <p className="text-sm font-bold text-gray-200 italic">"{o.items}"</p>
                                        </div>

                                        {/* Status notification for delivery orders without riders */}
                                        {!isPickup && isUnassigned && (
                                            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex items-center space-x-4 animate-pulse">
                                                <Loader2 className="text-indigo-400 animate-spin" size={18} />
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-relaxed">
                                                    Waiting for Delivery Rider to accept this task.
                                                </p>
                                            </div>
                                        )}

                                        {isPickup && isReady ? (
                                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 space-y-4 animate-fade-in">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <ShieldCheck className="text-emerald-500" size={20} />
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pickup Verification Required</h4>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Ask customer for their 6-digit secret code to finalize pickup.</p>
                                                
                                                <div className="flex gap-3">
                                                    <div className="relative flex-grow">
                                                        <input 
                                                            type="text" 
                                                            maxLength={6}
                                                            placeholder="000000"
                                                            value={pickupOtpInputs[o.id] || ''}
                                                            onChange={(e) => setPickupOtpInputs({...pickupOtpInputs, [o.id]: e.target.value.replace(/\D/g, '')})}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black tracking-[0.4em] text-white focus:border-emerald-500 outline-none transition-all placeholder:tracking-normal placeholder:font-bold"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => handleVerifyPickup(o.id)}
                                                        className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : isPickup ? (
                                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex items-center space-x-4">
                                                <Clock className="text-blue-400" size={20} />
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                                                    Mark as "Ready for Pickup" to enable code verification when customer arrives.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Delivery Rider</label>
                                                    <div className={`w-full text-[10px] font-black uppercase tracking-widest outline-none px-4 py-3 rounded-xl border flex items-center gap-2 ${isUnassigned ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500 text-bakery-dark border-amber-600'}`}>
                                                        {!isUnassigned && <UserCheck size={14} />}
                                                        <span>{o.assignedTo || 'Unassigned'}</span>
                                                    </div>
                                                </div>

                                                {!isUnassigned && (
                                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Rider Assigned</p>
                                                        <p className="text-[10px] font-black text-white italic">Ready for hand-off.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-[#131b2e] rounded-[3rem] shadow-xl border border-white/5 overflow-hidden animate-slide-up">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5 text-left">
                            <h5 className="text-2xl font-black uppercase italic tracking-tighter">Sales <span className="text-amber-500">Archive</span></h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Ref</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {historicalOrders.map(o => (
                                        <tr key={o.id} className="hover:bg-white/5 transition-all">
                                            <td className="px-10 py-6 font-mono text-[10px] text-amber-500">{o.id}</td>
                                            <td className="px-10 py-6 font-bold text-white">{o.customer}</td>
                                            <td className="px-10 py-6 font-black text-white italic">{o.total}</td>
                                            <td className="px-10 py-6 text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>

      {showProductModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0a101f]/90 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh] text-bakery-dark">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Artisan <span className="text-amber-500">{editingProduct ? 'Update' : 'Entry'}</span></h3>
                    <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-bakery-dark transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleProductSubmit} className="overflow-y-auto p-10 space-y-8 text-left">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Treat Name</label>
                            <input type="text" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-amber-500 border-2 transition-all" value={formProduct.name} onChange={(e) => setFormProduct({...formProduct, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Artisan Price ($)</label>
                            <input type="number" step="0.01" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-amber-500 border-2 transition-all" value={formProduct.price} onChange={(e) => setFormProduct({...formProduct, price: parseFloat(e.target.value)})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Master Category</label>
                            <select 
                                className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none"
                                value={formProduct.category}
                                onChange={(e) => setFormProduct({...formProduct, category: e.target.value as any, occasion: undefined, breadType: undefined})}
                            >
                                <option value="cake">Cake</option>
                                <option value="bread">Bread</option>
                                <option value="pastry">Pastry</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Batch Quantity (Stock)</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-amber-500 border-2 transition-all" 
                                placeholder="20" 
                                value={formProduct.stock}
                                onChange={(e) => setFormProduct({...formProduct, stock: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Treat Story (Description)</label>
                            <button 
                                type="button" 
                                onClick={handleAIDescription}
                                disabled={isGenerating || !formProduct.name}
                                className={`flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest transition-all ${isGenerating ? 'text-amber-500' : 'text-amber-500 hover:underline'}`}
                            >
                                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                <span>{isGenerating ? 'Cooking up copy...' : 'AI Generate Magic'}</span>
                            </button>
                        </div>
                        <textarea 
                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-bold h-32 focus:ring-2 focus:ring-amber-500/30 outline-none resize-none" 
                            placeholder="Describe the artisan magic behind this treat..."
                            value={formProduct.description}
                            onChange={(e) => setFormProduct({...formProduct, description: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full py-5 bg-bakery-dark text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-amber-500 transition-all shadow-xl shadow-bakery-dark/10">
                        {editingProduct ? 'Update Artisan Listing' : 'Publish Artisan Listing'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
