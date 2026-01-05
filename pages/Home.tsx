
import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PromoCarousel from '../components/PromoCarousel';
import { UserRole, User, Product, BannerConfig, PromoSlide } from '../types';
import { ArrowRight, Star, ShoppingBag, ArrowUpRight, AlertTriangle, PackageX } from 'lucide-react';

interface HomeProps {
    user: User | null;
    products: Product[];
    banner: BannerConfig;
    promoSlides: PromoSlide[];
    // Updated signature to match App.tsx handleLogin
    onLogin: (userData: User) => void;
    onLogout: () => void;
    onProductClick: (product: Product) => void;
    onNavigate: (section: string) => void;
    onExplore: () => void;
    onAddToCart: (product: Product) => void;
}

const FeaturedProductCard: React.FC<{ product: Product; onClick: () => void; onAdd: (e: any) => void }> = ({ product, onClick, onAdd }) => {
    const stock = product.stock || 0;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;

    return (
        <div 
            onClick={onClick}
            className={`bakery-card p-1 md:p-2 group cursor-pointer flex flex-col h-full ${isOutOfStock ? 'opacity-80' : ''}`}
        >
            <div className="relative h-40 sm:h-64 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-3 sm:mb-5 bg-white/20">
                <img 
                    src={product.image} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isOutOfStock ? 'grayscale' : ''}`} 
                    alt={product.name}
                />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gray-900 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded-full">
                        {product.category}
                    </span>
                    {isLowStock && !isOutOfStock && (
                        <span className="bg-white text-bakery-accent px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-black uppercase tracking-widest text-[7px] sm:text-[8px] flex items-center shadow-sm">
                            <AlertTriangle size={8} className="mr-0.5 sm:mr-1" /> <span className="hidden xs:inline">Only {stock} Left</span>
                        </span>
                    )}
                </div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/40 backdrop-blur-md rounded-full px-1.5 sm:px-2.5 py-0.5 sm:py-1 flex items-center space-x-1 border border-white/20">
                    <Star size={8} className="text-gray-900 fill-bakery-accent sm:w-[10px]" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-900">{product.rating}</span>
                </div>
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-md font-black uppercase tracking-widest text-[8px] sm:text-[10px] border border-white/20 transform -rotate-12">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            <div className="px-2 sm:px-4 pb-4 sm:pb-6 flex flex-col flex-grow text-left">
                <h3 className="text-sm sm:text-lg font-black text-gray-900 mb-0.5 sm:mb-1 tracking-tight truncate">{product.name}</h3>
                <span className="text-base sm:text-xl font-black text-gray-900/70 mb-3 sm:mb-5">${product.price.toFixed(2)}</span>
                <button 
                    disabled={isOutOfStock}
                    onClick={onAdd}
                    className={`mt-auto w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[7px] xs:text-[8px] sm:text-[10px] transition-all flex items-center justify-center group/btn ${
                        isOutOfStock 
                        ? 'bg-gray-900/20 text-gray-900/40 cursor-not-allowed' 
                        : 'bg-gray-900 text-white hover:bg-white hover:text-gray-900 shadow-lg'
                    }`}
                >
                    {isOutOfStock ? (
                        <PackageX size={10} />
                    ) : (
                        <>
                            <ShoppingBag size={10} className="mr-1 sm:mr-2 sm:w-[12px]" />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const Home: React.FC<HomeProps> = ({ products, promoSlides, onProductClick, onExplore, onAddToCart }) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white pb-20">
      <PromoCarousel slides={promoSlides} onExplore={onExplore} />

      <div className="relative -mt-12 z-30">
        <Features />
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-12 sm:mb-16">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-bakery-accent font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Premium Selection</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter leading-tight uppercase">
                TODAY'S <br/> <span className="text-bakery-accent">SPECIALS</span>
              </h2>
            </div>
            <button 
              onClick={onExplore}
              className="flex px-8 py-3.5 bg-white border-2 border-bakery-accent text-bakery-accent rounded-full font-black text-[10px] tracking-widest uppercase items-center group hover:bg-bakery-accent hover:text-white transition-all duration-500 shadow-sm mx-auto md:mx-0"
            >
              View Full Shop <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {featuredProducts.map((product) => (
                  <FeaturedProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => onProductClick(product)}
                      onAdd={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  />
              ))}
          </div>
        </div>
      </section>

      <Hero onExplore={onExplore} />

      <section className="py-32 relative overflow-hidden bg-white border-t border-gray-100">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic mb-6 tracking-tighter uppercase leading-tight">READY FOR <br/> <span className="text-bakery-accent">DELIVERY?</span></h2>
          <p className="text-base md:text-lg text-gray-500 mb-10 font-medium leading-relaxed max-w-xl mx-auto">
            Our artisan bakers are ready to prepare your order. Experience the warmth and taste of fresh treats delivered straight to you.
          </p>
          <button onClick={onExplore} className="bg-bakery-accent text-white font-black px-12 py-5 rounded-full hover:bg-gray-900 transition-all shadow-2xl shadow-bakery-accent/20 text-xs uppercase tracking-widest">
            ORDER FOR DELIVERY
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
