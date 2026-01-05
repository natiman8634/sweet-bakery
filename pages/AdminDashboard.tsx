
import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingBag, Package, Users, Plus, 
  Edit, Trash2, ClipboardList, X, LayoutDashboard, ShieldCheck, 
  ChevronRight, Store, Truck, UserCircle, Layers, UserPlus, Phone, 
  History, Clock, Calendar, BarChart3, PackageSearch, Navigation, 
  Fingerprint, Info, Sparkles, Loader2, Search, CheckCircle2, AlertTriangle, UserMinus, Shield
} from 'lucide-react';
import { Product, UserRole, Order, User, BannerConfig, PromoSlide } from '../types';
import { aiService } from '../services/aiService';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  currentUser: User;
  products: Product[];
  users: any[];
  orders: Order[];
  banner: BannerConfig;
  promoSlides: PromoSlide[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, stock: number) => void;
  onAddUser: (user: any) => void;
  onDeleteUser: (username: string) => void;
  onUpdateUser: (username: string, updates: any) => void;
  onUpdateBanner: (banner: BannerConfig) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onUpdatePromoSlides: (slides: PromoSlide[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, users, orders, onDeleteProduct, onUpdateOrder, onAddProduct, onEditProduct, onDeleteUser, onAddUser, onUpdateUser, onUpdateStock
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const vendorUsers = users.filter(u => u.role === UserRole.VENDOR);
  const deliveryUsers = users.filter(u => u.role === UserRole.DELIVERY);

  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: '', price: 0, category: 'bread', description: '', 
    image: 'https://images.unsplash.com/photo-1585478259715-876a2560efc8?auto=format&fit=crop&w=800&q=80',
    stock: 20, vendor: vendorUsers[0]?.name || 'Sweet Bakery',
    occasion: undefined, breadType: 'white'
  });

  const [formUser, setFormUser] = useState({ name: '', username: '', password: '123', role: UserRole.VENDOR, phoneNumber: '', bio: '' });

  const stats = [
    { title: 'Total Revenue', value: `$${orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + parseFloat(o.total.replace('$', '')), 0).toFixed(2)}`, icon: <DollarSign size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Active Orders', value: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length, icon: <ShoppingBag size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Bakery Items', value: products.length, icon: <Package size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Community', value: users.length, icon: <Users size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const handleGetAIInsights = async () => {
    setIsAnalyzing(true);
    const insights = await aiService.getAdminInsights(orders, products);
    setAiReport(insights);
    setIsAnalyzing(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
        onEditProduct({ ...editingProduct, ...formProduct } as Product);
    } else {
        onAddProduct({ 
            ...formProduct, 
            id: Math.random().toString(36).substr(2, 9), 
            rating: 5 
        } as Product);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
          onUpdateUser(editingUser.username, formUser);
      } else {
          onAddUser({ ...formUser, id: `USR-${Date.now()}` });
      }
      setShowUserModal(false);
      setEditingUser(null);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 text-left">
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-bakery-dark rounded-lg"><ShieldCheck size={20} className="text-bakery-accent" /></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-accent">System Administrator</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Command <span className="text-bakery-accent">Center</span></h1>
            </div>
            
            <div className="w-full md:w-auto bg-white border border-bakery-accent/20 rounded-[2rem] p-6 shadow-xl shadow-bakery-accent/5 flex items-center space-x-6 relative overflow-hidden group">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-bakery-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-bakery-accent/20">
                    <Sparkles size={24} className={isAnalyzing ? 'animate-spin' : ''} />
                </div>
                <div className="relative z-10 text-left">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-bakery-accent mb-1 flex items-center">
                        AI Business Advisor
                    </h4>
                    <p className="text-xs font-bold text-gray-400 max-w-[250px] truncate">
                        {aiReport || "Ready to analyze performance..."}
                    </p>
                </div>
                <button 
                    onClick={handleGetAIInsights}
                    disabled={isAnalyzing}
                    className="relative z-10 p-3 bg-gray-900 text-white rounded-xl hover:bg-bakery-accent transition-all"
                >
                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 space-y-3 sticky top-28">
              {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'products', label: 'Treat Catalog', icon: Package },
                  { id: 'orders', label: 'Order Hub', icon: ClipboardList },
                  { id: 'users', label: 'Team Directory', icon: Users },
              ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-bakery-dark text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center space-x-4">
                        <tab.icon size={18} className={activeTab === tab.id ? 'text-bakery-accent' : ''} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                    </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow space-y-10 text-left">
            {activeTab === 'overview' && (
                <div className="space-y-10 animate-slide-up">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>{stat.icon}</div>
                                <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</h6>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter italic">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {aiReport && (
                        <div className="bg-bakery-dark rounded-[3rem] p-10 text-white relative overflow-hidden animate-slide-up">
                            <Sparkles className="absolute -top-10 -right-10 text-white/5" size={300} />
                            <div className="relative z-10">
                                <h4 className="text-bakery-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Strategic Briefing</h4>
                                <p className="text-2xl font-black italic tracking-tighter uppercase leading-tight max-w-2xl mb-6">
                                    "{aiReport}"
                                </p>
                                <button onClick={() => setActiveTab('products')} className="text-[9px] font-black uppercase tracking-widest bg-bakery-accent text-bakery-dark px-8 py-3 rounded-full hover:bg-white transition-all">Execute Recommendations</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                             <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Recent Order Activity</h5>
                             <div className="space-y-4">
                                {orders.slice(0, 4).map(o => (
                                    <div key={o.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-bakery-accent shadow-sm border border-gray-100">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{o.customer}</p>
                                                <p className="text-[9px] font-bold text-gray-400">{o.id}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-bakery-accent uppercase">{o.total}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                             <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Low Stock Alerts</h5>
                             <div className="space-y-4">
                                {products.filter(p => (p.stock || 0) < 10).slice(0, 4).map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                                        <div className="flex items-center space-x-4">
                                            <img src={p.image} className="w-10 h-10 rounded-xl object-cover" />
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{p.name}</p>
                                                <p className="text-[9px] font-bold text-red-400 uppercase">Only {p.stock} left</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setEditingProduct(p); setFormProduct(p); setShowProductModal(true); }} className="text-[9px] font-black text-bakery-accent uppercase tracking-widest">Restock</button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h5 className="text-2xl font-black uppercase italic tracking-tighter">Global <span className="text-bakery-accent">Inventory</span></h5>
                        <button onClick={() => { setEditingProduct(null); setFormProduct({ name: '', price: 0, category: 'bread', description: '', image: 'https://images.unsplash.com/photo-1585478259715-876a2560efc8?auto=format&fit=crop&w=800&q=80', stock: 20 }); setShowProductModal(true); }} className="bg-bakery-dark text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-bakery-accent transition-all flex items-center shadow-lg">
                            <Plus size={16} className="mr-2" /> New Bakery Item
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50/30 transition-all">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-4">
                                                <img src={p.image} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-bakery-accent uppercase">${p.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{p.vendor}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => { setEditingProduct(p); setFormProduct(p); setShowProductModal(true); }} className="p-3 text-gray-400 hover:text-bakery-accent hover:bg-bakery-light rounded-xl transition-all">
                                                    <Edit size={16}/>
                                                </button>
                                                <button onClick={() => onDeleteProduct(p.id)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
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
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h5 className="text-2xl font-black uppercase italic tracking-tighter">Order <span className="text-bakery-accent">Monitor</span></h5>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Rider</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50/30 transition-all">
                                        <td className="px-10 py-6 font-mono text-[10px] text-bakery-accent">{o.id}</td>
                                        <td className="px-10 py-6 font-bold text-gray-900">{o.customer}</td>
                                        <td className="px-10 py-6">
                                            {/* Fixed Visibility for Status Dropdown */}
                                            <select 
                                                className="bg-gray-100 border-none text-[9px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer text-gray-900"
                                                value={o.status}
                                                onChange={(e) => onUpdateOrder(o.id, { status: e.target.value })}
                                            >
                                                <option value="Pending" className="bg-white text-gray-900">Pending</option>
                                                <option value="Preparing" className="bg-white text-gray-900">Preparing</option>
                                                <option value="Ready for Pickup" className="bg-white text-gray-900">Ready for Pickup</option>
                                                <option value="Out for Delivery" className="bg-white text-gray-900">Out for Delivery</option>
                                                <option value="Delivered" className="bg-white text-gray-900">Delivered</option>
                                                <option value="Cancelled" className="bg-white text-gray-900">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-10 py-6">
                                            {o.deliveryMethod === 'Pickup' ? (
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Store Pickup</span>
                                            ) : (
                                                <select 
                                                    className="bg-gray-100 border-none text-[9px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer text-gray-900"
                                                    value={o.assignedTo || 'Unassigned'}
                                                    onChange={(e) => onUpdateOrder(o.id, { assignedTo: e.target.value })}
                                                >
                                                    <option value="Unassigned" className="bg-white text-gray-900">Assign Rider</option>
                                                    {deliveryUsers.map(u => <option key={u.id} value={u.name} className="bg-white text-gray-900">{u.name}</option>)}
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right font-black text-gray-900">{o.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h5 className="text-2xl font-black uppercase italic tracking-tighter">Team <span className="text-bakery-accent">Registry</span></h5>
                        <button onClick={() => { setEditingUser(null); setFormUser({ name: '', username: '', password: '123', role: UserRole.VENDOR, phoneNumber: '', bio: '' }); setShowUserModal(true); }} className="bg-bakery-dark text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-bakery-accent transition-all flex items-center shadow-lg">
                            <UserPlus size={16} className="mr-2" /> Add Team Member
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Username</th>
                                    <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50/30 transition-all">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-bakery-accent font-black uppercase">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                u.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' :
                                                u.role === UserRole.VENDOR ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                                                u.role === UserRole.DELIVERY ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' :
                                                'bg-gray-50 text-gray-400 border border-gray-100'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">@{u.username}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => { setEditingUser(u); setFormUser({ ...u }); setShowUserModal(true); }} className="p-3 text-gray-400 hover:text-bakery-accent hover:bg-bakery-light rounded-xl transition-all">
                                                    <Edit size={16}/>
                                                </button>
                                                {u.username !== 'admin' && (
                                                    <button onClick={() => onDeleteUser(u.username)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <UserMinus size={16}/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-bakery-dark/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh] text-bakery-dark">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Artisan <span className="text-bakery-accent">{editingProduct ? 'Update' : 'Entry'}</span></h3>
                    <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-bakery-dark transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleProductSubmit} className="overflow-y-auto p-10 space-y-8 text-left">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Treat Name</label>
                            <input type="text" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-bakery-accent border-2 transition-all" value={formProduct.name} onChange={(e) => setFormProduct({...formProduct, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Price ($)</label>
                            <input type="number" step="0.01" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-bakery-accent border-2 transition-all" value={formProduct.price} onChange={(e) => setFormProduct({...formProduct, price: parseFloat(e.target.value)})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Category</label>
                            <select 
                                className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none"
                                value={formProduct.category}
                                onChange={(e) => setFormProduct({...formProduct, category: e.target.value as any})}
                            >
                                <option value="cake">Cake</option>
                                <option value="bread">Bread</option>
                                <option value="pastry">Pastry</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Associated Vendor</label>
                            <select 
                                className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none"
                                value={formProduct.vendor}
                                onChange={(e) => setFormProduct({...formProduct, vendor: e.target.value})}
                            >
                                {vendorUsers.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-bakery-dark text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-bakery-accent transition-all shadow-xl">
                        {editingProduct ? 'Save Artisan Updates' : 'Publish to Catalog'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-bakery-dark/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh] text-bakery-dark">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Team <span className="text-bakery-accent">{editingUser ? 'Profile' : 'Access'}</span></h3>
                    <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-bakery-dark transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleUserSubmit} className="overflow-y-auto p-10 space-y-8 text-left">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Full Name</label>
                            <input type="text" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none border-transparent focus:border-bakery-accent border-2 transition-all" value={formUser.name} onChange={(e) => setFormUser({...formUser, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Username</label>
                                <input type="text" className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none" value={formUser.username} onChange={(e) => setFormUser({...formUser, username: e.target.value})} disabled={!!editingUser} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Role</label>
                                <select 
                                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-xs font-bold outline-none"
                                    value={formUser.role}
                                    onChange={(e) => setFormUser({...formUser, role: e.target.value as UserRole})}
                                >
                                    <option value={UserRole.VENDOR}>Vendor</option>
                                    <option value={UserRole.DELIVERY}>Delivery Rider</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                    <option value={UserRole.CUSTOMER}>Customer</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-bakery-dark text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-bakery-accent transition-all shadow-xl">
                        {editingUser ? 'Save Profile' : 'Provision Account'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
