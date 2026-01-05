
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ProductGrid from './components/ProductGrid';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import CustomerOrders from './pages/CustomerOrders';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import { UserRole, User, Product, BannerConfig, CartItem, Order, PromoSlide } from './types';
import { FEATURED_PRODUCTS, MOCK_USERS, DEFAULT_PROMO_SLIDES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sb_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('sb_all_users_v2');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sb_products_v2');
    return saved ? JSON.parse(saved) : FEATURED_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sb_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sb_cart_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { localStorage.setItem('sb_user_v2', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('sb_all_users_v2', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('sb_products_v2', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sb_orders_v2', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sb_cart_v2', JSON.stringify(cartItems)); }, [cartItems]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setIsLoginModalOpen(false);
    if (loggedUser.role === UserRole.ADMIN) setCurrentView('admin');
    else if (loggedUser.role === UserRole.VENDOR) setCurrentView('vendor');
    else if (loggedUser.role === UserRole.DELIVERY) setCurrentView('delivery');
    else setCurrentView('home');
  };

  const handleRegister = (newUser: any) => {
    if (allUsers.some(u => u.username === newUser.username)) {
      alert("Username already taken!");
      return;
    }
    const userToSave: User = { 
        ...newUser, 
        id: `USR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        role: UserRole.CUSTOMER 
    };
    setAllUsers(prev => [...prev, userToSave]);
    handleLogin(userToSave);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setCartItems([]);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!user) {
        setIsLoginModalOpen(true);
        return;
    }
    const currentInCart = cartItems.find(i => i.id === product.id)?.quantity || 0;
    const availableStock = product.stock ?? 0;
    if (currentInCart + quantity > availableStock) {
        alert(`Insufficient stock! You already have ${currentInCart} in basket, and only ${availableStock} are available in total.`);
        return;
    }
    setCartItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
            return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id !== id) return order;

      const mergedOrder = { ...order, ...updates };

      // AUTOMATIC OTP CHECKING LOGIC
      if (updates.riderProvidedOTP) {
        if (updates.riderProvidedOTP === order.verificationOTP) {
          // If it's a pickup order, status is 'Picked Up'
          // If it's a delivery order, status is 'Delivered'
          mergedOrder.status = order.deliveryMethod === 'Pickup' ? 'Picked Up' : 'Delivered';
        } else {
            alert("Verification code incorrect. Please try again.");
            return order; // Don't apply the incorrect OTP
        }
      }

      return mergedOrder;
    }));
  };

  const handleCheckout = (details: any) => {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: Order = {
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customer: user?.name || 'Guest',
        items: cartItems.map(i => `${i.quantity}x ${i.name}`).join(', '),
        total: `$${(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) + (details.deliveryMethod === 'Delivery' ? 5 : 0)).toFixed(2)}`,
        status: 'Pending',
        assignedTo: 'Unassigned',
        vendor: cartItems[0]?.vendor || 'Chef Pierre',
        phoneNumber: details.phone,
        address: details.address,
        date: new Date().toISOString(),
        deliveryMethod: details.deliveryMethod,
        location: details.location,
        verificationOTP: generatedOTP,
        riderProvidedOTP: undefined
    };

    const updatedProducts = products.map(p => {
        const cartItem = cartItems.find(item => item.id === p.id);
        if (cartItem) return { ...p, stock: (p.stock ?? 0) - cartItem.quantity };
        return p;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setIsCartOpen(false);
    setCurrentView('customer-orders');
  };

  return (
    <div className="container-fluid p-0 overflow-hidden text-left">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSearch={setSearchQuery}
        onNavigate={setCurrentView}
        activeSection={currentView}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main style={{ marginTop: '72px' }}>
        {currentView === 'home' && (
          <Home 
            user={user}
            products={products}
            banner={{} as any}
            promoSlides={DEFAULT_PROMO_SLIDES}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
            onNavigate={setCurrentView}
            onExplore={() => setCurrentView('menu')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {currentView === 'menu' && (
          <ProductGrid 
            searchQuery={searchQuery}
            products={products}
            onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            onBack={() => setCurrentView('menu')}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
            onProductClick={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'admin' && user?.role === UserRole.ADMIN && (
          <AdminDashboard 
            onNavigateHome={() => setCurrentView('home')}
            currentUser={user}
            products={products}
            users={allUsers}
            orders={orders}
            banner={{} as any}
            promoSlides={DEFAULT_PROMO_SLIDES}
            onAddProduct={(p) => setProducts([p, ...products])}
            onEditProduct={(p) => setProducts(products.map(old => old.id === p.id ? p : old))}
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
            onUpdateStock={(id, s) => setProducts(products.map(p => p.id === id ? {...p, stock: s} : p))}
            onAddUser={(u) => setAllUsers([u, ...allUsers])}
            onDeleteUser={(username) => setAllUsers(allUsers.filter(u => u.username !== username))}
            onUpdateUser={(username, updates) => setAllUsers(allUsers.map(u => u.username === username ? {...u, ...updates} : u))}
            onUpdateBanner={() => {}}
            onUpdateOrder={handleUpdateOrder}
            onUpdatePromoSlides={() => {}}
          />
        )}

        {currentView === 'vendor' && user?.role === UserRole.VENDOR && (
          <VendorDashboard 
            user={user}
            products={products}
            users={allUsers}
            orders={orders}
            onNavigateHome={() => setCurrentView('home')}
            onAddProduct={(p) => setProducts([p, ...products])}
            onEditProduct={(p) => setProducts(products.map(old => old.id === p.id ? p : old))}
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
            onUpdateStock={(id, s) => setProducts(products.map(p => p.id === id ? {...p, stock: s} : p))}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {currentView === 'delivery' && user?.role === UserRole.DELIVERY && (
          <DeliveryDashboard 
            user={user}
            orders={orders}
            onNavigateHome={() => setCurrentView('home')}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {currentView === 'customer-orders' && user && (
          <CustomerOrders 
            user={user} 
            orders={orders} 
            onNavigateHome={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'about' && <About />}
      </main>

      <Footer />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        users={allUsers}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, d) => {
            const item = cartItems.find(i => i.id === id);
            const product = products.find(p => p.id === id);
            if (item && product && d > 0 && item.quantity >= (product.stock ?? 0)) {
                alert("Cannot add more. No more items in stock.");
                return;
            }
            setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i));
        }}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
