import React from 'react';
import { Clock, Wheat, Award, Heart } from 'lucide-react';

const Features: React.FC = () => {
  const items = [
    { icon: Clock, title: "Fresh Daily", desc: "Baked at 4 AM every morning." },
    { icon: Wheat, title: "100% Organic", desc: "Locally sourced grains." },
    { icon: Award, title: "Top Rated", desc: "Best bakery 5 years running." },
    { icon: Heart, title: "Family Made", desc: "Traditional recipes." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-start transition-all hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-bakery-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="text-bakery-accent" size={24} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-2">{item.title}</h4>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;