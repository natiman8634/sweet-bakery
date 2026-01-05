
import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Search, User as UserIcon, LayoutDashboard, Store, Truck, ChevronDown, ShoppingBag } from 'lucide-react';
import { UserRole, User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenLoginModal: () => void;
  cartItemCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
    user, 
    onLogout, 
    onSearch, 
    onNavigate, 
    activeSection, 
    onOpenLoginModal,
    cartItemCount,
    onOpenCart
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-8">
            <button onClick={() => onNavigate('home')} className="flex items-center group cursor-pointer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2830/2830305.png" 
                className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 object-contain" 
                alt="Sweet Bakery Logo" 
              />
              <div className="flex flex-col text-left">
                <span className="font-black text-base sm:text-xl tracking-tighter leading-none text-gray-900">SWEET<span className="text-bakery-accent">BAKERY</span></span>
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] text-bakery-accent leading-none mt-1">Premium Artisan</span>
              </div>
            </button>

            <div className="hidden md:flex space-x-8">
              {['home', 'menu', 'about'].map((id) => (
                <button 
                  key={id} 
                  onClick={() => onNavigate(id)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-bakery-accent ${activeSection === id ? 'text-bakery-accent' : 'text-gray-400'}`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <form className="hidden lg:flex relative group" onSubmit={(e) => { e.preventDefault(); onSearch(searchValue); onNavigate('menu'); }}>
              <input 
                type="text" 
                placeholder="Search treats..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-gray-100/50 backdrop-blur-sm border-none rounded-full py-2.5 px-6 pl-12 text-xs font-bold w-64 focus:ring-2 focus:ring-bakery-accent/30 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-bakery-accent transition-colors" size={16} />
            </form>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <div className="absolute top-full left-0 w-full h-4 bg-transparent pointer-events-auto"></div>
                        
                        <button className="flex items-center space-x-3 bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2 hover:shadow-md transition-all group-hover:border-bakery-accent">
                            <div className="w-6 h-6 rounded-full bg-bakery-accent flex items-center justify-center text-white text-[10px] font-black uppercase">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 hidden sm:inline">{user.name.split(' ')[0]}</span>
                            <ChevronDown size={12} className="text-gray-400 group-hover:rotate-180 transition-transform" />
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[200] border border-gray-50">
                            <div className="px-5 py-4 border-b border-gray-50 mb-2">
                                <span className="block text-[8px] font-black text-bakery-accent uppercase tracking-[0.2em] mb-1">Account Overview</span>
                                <span className="text-sm font-black text-gray-900 tracking-tight">{user.name}</span>
                                <span className="block text-[9px] font-bold text-gray-400 mt-1">{user.role}</span>
                            </div>
                            
                            <div className="space-y-1 text-left">
                                {user.role === UserRole.ADMIN && (
                                    <button onClick={() => onNavigate('admin')} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl hover:bg-bakery-light hover:text-bakery-accent transition-all text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <LayoutDashboard size={14} /> <span>Admin Console</span>
                                    </button>
                                )}
                                {user.role === UserRole.VENDOR && (
                                    <button onClick={() => onNavigate('vendor')} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl hover:bg-bakery-light hover:text-bakery-accent transition-all text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <Store size={14} /> <span>My Bakery Shop</span>
                                    </button>
                                )}
                                {user.role === UserRole.DELIVERY && (
                                    <button onClick={() => onNavigate('delivery')} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl hover:bg-bakery-light hover:text-bakery-accent transition-all text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <Truck size={14} /> <span>Delivery Portal</span>
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => onNavigate('customer-orders')} 
                                    className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-all text-[10px] font-black uppercase tracking-widest text-gray-600"
                                >
                                    <ShoppingBag size={14} /> <span>Track Orders</span>
                                </button>

                                <div className="pt-1 mt-1 border-t border-gray-50">
                                    <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest text-red-500">
                                        <LogOut size={14} /> <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <button 
                  onClick={onOpenLoginModal} 
                  className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] bg-bakery-dark text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-bakery-accent transition-all shadow-xl shadow-bakery-dark/10 whitespace-nowrap"
                >
                  Sign In
                </button>
              )}
              
              <button onClick={onOpenCart} className="relative p-2.5 sm:p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100">
                <ShoppingCart size={18} className="sm:w-5 sm:h-5 text-gray-700" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-bakery-accent text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {cartItemCount}
                    </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
