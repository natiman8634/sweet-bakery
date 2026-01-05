import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { BannerConfig } from '../types';

interface HeroProps {
    onExplore?: () => void;
    banner?: BannerConfig;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden bg-white py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <span className="text-bakery-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Heritage</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter leading-none uppercase mb-8">
              BAKED WITH <br/> 
              <span className="text-bakery-accent">PASSION.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 font-medium leading-relaxed max-w-lg">
              Experience artisan craftsmanship delivered to your doorstep. Our sourdough process takes 48 hours, ensuring every bite is a masterpiece.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onExplore}
                className="bg-bakery-dark text-white font-black px-10 py-4 rounded-full hover:bg-bakery-accent transition-all shadow-2xl shadow-bakery-dark/10 text-[10px] uppercase tracking-widest flex items-center group"
              >
                EXPLORE MENU <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
              </button>
              <button className="border-2 border-gray-100 text-gray-400 font-black px-10 py-4 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all text-[10px] uppercase tracking-widest">
                OUR STORY
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-bakery-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                alt="Artisan Bread"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass p-6 rounded-[2rem] max-w-xs shadow-lg">
                  <p className="text-xl font-black text-gray-900 italic uppercase mb-1 tracking-tighter">48 HOUR</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Traditional fermentation for peak flavor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;