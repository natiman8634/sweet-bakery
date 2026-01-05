
import React, { useState, useEffect } from 'react';
import { SearchX, Star, PackageX, AlertTriangle, ShoppingBag, Filter, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface ProductGridProps {
    searchQuery?: string;
    onProductClick?: (product: Product) => void;
    products: Product[];
    onAddToCart: (product: Product) => void;
    onBack?: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ searchQuery = '', onProductClick, products, onAddToCart, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const categories = ['All', 'Bread', 'Cake', 'Pastry'];

  const cakeOccasions = ['All', 'Birthday', 'Wedding', 'Holiday'];
  const breadTypes = ['All', 'Sourdough', 'Wheat', 'Rye', 'White'];

  useEffect(() => {
    setSelectedSubCategory('All');
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    let matchesSub = true;
    if (selectedCategory === 'Cake' && selectedSubCategory !== 'All') {
        matchesSub = p.occasion?.toLowerCase() === selectedSubCategory.toLowerCase();
    } else if (selectedCategory === 'Bread' && selectedSubCategory !== 'All') {
        matchesSub = p.breadType?.toLowerCase() === selectedSubCategory.toLowerCase();
    }
    return matchesSearch && matchesCategory && matchesSub;
  });

  const showSubFilters = selectedCategory === 'Cake' || selectedCategory === 'Bread';
  const subFilterList = selectedCategory === 'Cake' ? cakeOccasions : breadTypes;

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button for Mobile Clarity */}
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-bakery-accent transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="text-left max-w-xl">
            <span className="text-bakery-accent font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Full Menu</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter leading-none uppercase">
              FRESH <span className="text-bakery-accent">SELECTIONS</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-white text-bakery-accent shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {showSubFilters && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto justify-start md:justify-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 flex items-center">
                  <Filter size={12} className="mr-1.5" /> Filter by:
                </span>
                <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                  {subFilterList.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedSubCategory === sub ? 'bg-bakery-dark text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const stock = product.stock ?? 0;
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 5;

              return (
                <div 
                    key={product.id}
                    onClick={() => onProductClick?.(product)}
                    className={`bakery-card p-1 group cursor-pointer flex flex-col h-full ${isOutOfStock ? 'opacity-80' : ''}`}
                >
                    <div className="relative h-48 sm:h-64 rounded-[2rem] overflow-hidden mb-5 bg-white/20">
                        <img 
                            src={product.image} 
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isOutOfStock ? 'grayscale' : ''}`} 
                            alt={product.name}
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="px-2.5 py-1 bg-gray-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                {product.category}
                            </span>
                            {isLowStock && !isOutOfStock && (
                                <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest text-[8px] flex items-center shadow-lg border border-amber-400">
                                    <AlertTriangle size={8} className="mr-1" /> Only {stock} Left
                                </span>
                            )}
                            {!isLowStock && !isOutOfStock && (
                                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest text-[8px] flex items-center shadow-lg border border-emerald-400">
                                    <CheckCircle2 size={8} className="mr-1" /> In Stock
                                </span>
                            )}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center space-x-1 border border-white/20">
                            <Star size={10} className="text-gray-900 fill-bakery-accent" />
                            <span className="text-[10px] font-bold text-gray-900">{product.rating}</span>
                        </div>
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-md font-black uppercase tracking-widest text-[10px] border border-white/20 transform -rotate-12">
                                    Baking Soon
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="px-4 pb-6 flex flex-col flex-grow text-left">
                        <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-xl font-black text-gray-900/70 italic tracking-tighter">${product.price.toFixed(2)}</span>
                            {stock > 0 && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stock} units</span>}
                        </div>
                        <button 
                            disabled={isOutOfStock}
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            className={`mt-auto w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center group/btn ${
                                isOutOfStock 
                                ? 'bg-gray-900/20 text-gray-900/40 cursor-not-allowed' 
                                : 'bg-gray-900 text-white hover:bg-white hover:text-gray-900 shadow-lg'
                            }`}
                        >
                            {isOutOfStock ? (
                                <PackageX size={12} />
                            ) : (
                                <>
                                    <ShoppingBag size={12} className="mr-2" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <SearchX size={48} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">No treats found</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
