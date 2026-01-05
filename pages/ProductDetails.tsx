
import React, { useState } from 'react';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Heart, PackageX, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { FEATURED_PRODUCTS } from '../constants';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onProductClick, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const relatedProducts = FEATURED_PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
            onClick={onBack} 
            className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-bakery-accent transition-all mb-12"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start text-left">
          <div className="space-y-6">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 border border-gray-100 aspect-square group">
              <img 
                src={product.image} 
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ${isOutOfStock ? 'grayscale' : ''}`} 
                alt={product.name} 
              />
              <button className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-900">
                <Heart size={20}/>
              </button>
              {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transform -rotate-12">Baking Soon</span>
                  </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block px-3 py-1 bg-bakery-light text-bakery-accent text-[8px] font-black uppercase tracking-widest rounded-md">{product.category}</span>
                    {isOutOfStock ? (
                         <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-red-100 flex items-center">
                            <AlertTriangle size={10} className="mr-1.5" /> Out of Stock
                         </span>
                    ) : (
                         <span className={`${isLowStock ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border flex items-center`}>
                            {isLowStock ? <AlertTriangle size={10} className="mr-1.5" /> : <CheckCircle2 size={10} className="mr-1.5" />}
                            {isLowStock ? `Only ${stock} Left` : 'Available for Order'}
                         </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-tight mb-4">
                    {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-bakery-accent fill-bakery-accent" : "text-gray-200"} />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-4">Premium Quality Guaranteed</span>
                </div>
            </div>

            <p className="text-3xl font-black text-gray-900 italic mb-8 tracking-tighter">${product.price.toFixed(2)}</p>
            <p className="text-base text-gray-500 font-medium leading-relaxed mb-10 max-w-lg">
                {product.description} Our artisan team uses a traditional {product.category === 'bread' ? 'long fermentation' : 'slow-baking'} technique to ensure the highest flavor profile.
            </p>

            <div className="space-y-6 mb-12">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                            className="p-4 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <Minus size={18}/>
                        </button>
                        <span className="px-8 py-2 text-xl font-black text-gray-900 w-20 text-center italic">{quantity}</span>
                        <button 
                            disabled={quantity >= stock}
                            onClick={() => setQuantity(Math.min(stock, quantity + 1))} 
                            className={`p-4 transition-colors ${quantity >= stock ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            <Plus size={18}/>
                        </button>
                    </div>
                    <button 
                        disabled={isOutOfStock}
                        onClick={() => onAddToCart(product, quantity)} 
                        className="flex-grow bg-bakery-dark text-white font-black py-5 rounded-3xl hover:bg-bakery-accent transition-all shadow-2xl shadow-bakery-dark/10 text-xs uppercase tracking-widest flex items-center justify-center group disabled:opacity-50"
                    >
                        <ShoppingCart size={18} className="mr-3" /> Add to Basket
                        <ChevronRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={16} />
                    </button>
                </div>
                {isOutOfStock ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 text-[10px] font-black uppercase tracking-widest">
                        <AlertTriangle size={14} className="mr-2" /> Out of stock for today. Back tomorrow at 4 AM!
                    </div>
                ) : quantity === stock ? (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center text-amber-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <AlertTriangle size={14} className="mr-2" /> You've reached the maximum available inventory ({stock} units).
                    </div>
                ) : null}
            </div>

            <div className="border-t border-gray-100 pt-8">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">Artisan Specs</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Batch Freshness</p>
                        <p className="text-[10px] font-bold text-gray-600">Baked {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Status</p>
                        <p className={`text-[10px] font-bold ${isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>{stock} Units Available</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
