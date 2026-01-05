
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { PromoSlide } from '../types';

interface PromoCarouselProps {
  slides: PromoSlide[];
  onExplore: () => void;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ slides, onExplore }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden group bg-bakery-dark">
      {slides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              className="w-full h-full object-cover animate-pulse-slow opacity-60" 
              alt={slide.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bakery-dark via-bakery-dark/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bakery-dark/40"></div>
          </div>

          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className={`max-w-3xl transform transition-all duration-1000 delay-200 ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <span className="inline-block px-4 py-1.5 bg-bakery-accent/10 border border-bakery-accent/30 rounded-full text-bakery-accent text-[9px] font-black uppercase tracking-[0.4em] mb-6">
                  Featured Today
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter italic uppercase">
                  {slide.title.split(':').map((part, i) => (
                    <React.Fragment key={i}>
                      {i === 1 ? <span className="text-bakery-accent">{part}</span> : part}
                      {i === 0 && <br/>}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="text-base md:text-lg text-gray-300 mb-10 max-w-xl leading-relaxed font-semibold">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={onExplore}
                  className="bg-bakery-accent text-bakery-dark font-black px-10 py-4 rounded-full hover:bg-white hover:text-bakery-dark transition-all shadow-2xl shadow-bakery-accent/20 flex items-center group text-xs tracking-widest uppercase"
                >
                  {slide.buttonText || 'ORDER NOW'}
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <div className="absolute left-8 bottom-10 z-30 flex items-center space-x-3">
            <button 
              onClick={() => setCurrent(prev => prev === 0 ? slides.length - 1 : prev - 1)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-bakery-accent hover:text-bakery-dark transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrent(prev => prev === slides.length - 1 ? 0 : prev + 1)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-bakery-accent hover:text-bakery-dark transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="absolute bottom-10 right-8 z-30 flex space-x-2 items-end h-10">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`transition-all duration-700 rounded-full ${i === current ? 'h-10 w-1.5 bg-bakery-accent' : 'h-3 w-1.5 bg-white/20 hover:bg-bakery-accent/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoCarousel;