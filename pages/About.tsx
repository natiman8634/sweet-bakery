
import React from 'react';
import { Truck, Award, Users, Heart, Clock, Wheat, Flame, Star, Quote } from 'lucide-react';

const About: React.FC = () => {
  const imgProcess = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80';
  const imgTeam = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80';
  const imgFlour = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-white text-bakery-dark pb-24">
      {/* Hero Narrative Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-bakery-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgProcess} 
            className="w-full h-full object-cover opacity-40 scale-110" 
            alt="Bakery Craft" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bakery-dark/20 via-bakery-dark/60 to-white"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <span className="text-bakery-accent font-black uppercase tracking-[0.5em] text-[10px] mb-6 block animate-fade-in">Established 1995</span>
            <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-8">
                TRADITION <br/> 
                <span className="text-bakery-accent">REIMAGINED.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium italic max-w-2xl mx-auto leading-relaxed">
                "We don't just bake bread; we cultivate a legacy of patience, fire, and flour."
            </p>
        </div>
      </section>

      {/* The 48-Hour Secret Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="text-left space-y-10">
                <div>
                    <span className="text-bakery-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">The Philosophy</span>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">
                        THE ART OF <br/> <span className="text-bakery-accent">SLOW.</span>
                    </h2>
                </div>
                
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                    Most bakeries prioritize speed. We prioritize the crumb. Our signature sourdough undergoes a rigorous 48-hour cold fermentation process. This allows natural enzymes to break down gluten and develop a complexity of flavor that cannot be rushed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-bakery-light rounded-xl text-bakery-accent">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-1">Time Honored</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">48-Hour Fermentation</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-bakery-light rounded-xl text-bakery-accent">
                            <Flame size={24} />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-1">Stone Baked</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Traditional Hearth Ovens</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-bakery-accent/10 rounded-full blur-3xl"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-12">
                        <img src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] shadow-xl w-full h-64 object-cover" />
                        <img src="https://images.unsplash.com/photo-1585478259715-876a2560efc8?auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] shadow-xl w-full h-80 object-cover" />
                    </div>
                    <div className="space-y-4">
                        <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] shadow-xl w-full h-80 object-cover" />
                        <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80" className="rounded-[2rem] shadow-xl w-full h-64 object-cover" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-bakery-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                    { label: "Artisan Loaves", value: "250K+", icon: Wheat },
                    { label: "Local Partners", value: "12", icon: Users },
                    { label: "Cities Served", value: "45", icon: Truck },
                    { label: "Craft Awards", value: "09", icon: Award }
                ].map((stat, i) => (
                    <div key={i} className="text-center space-y-4">
                        <div className="w-12 h-12 bg-bakery-accent/10 rounded-2xl flex items-center justify-center text-bakery-accent mx-auto mb-4 border border-bakery-accent/20">
                            <stat.icon size={20} />
                        </div>
                        <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* The Ingredients Story */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Wheat size={300} className="text-bakery-dark" />
                </div>
                <div className="md:w-1/2 text-left relative z-10">
                    <span className="text-bakery-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Purity First</span>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-8">
                        NOTHING BUT <br/> <span className="text-bakery-accent">THE GRAIN.</span>
                    </h3>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                        We source our heritage wheat from stone-ground mills that haven't changed their process in a century. No preservatives, no commercial yeast, and absolutely no compromises.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">Non-GMO Certified</span>
                        <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">Local Harvest</span>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <img 
                        src={imgFlour} 
                        className="rounded-[3rem] shadow-2xl h-[400px] w-full object-cover border-8 border-white"
                        alt="Flour texture" 
                    />
                </div>
            </div>
        </div>
      </section>

      {/* The Master Baker Quote */}
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
            <Quote size={48} className="text-bakery-accent mx-auto mb-10 opacity-30" />
            <h4 className="text-3xl md:text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-tight mb-8">
                "A true sourdough is alive. It breathes, it reacts to the weather, and it demands respect. My job is simply to listen to the dough."
            </h4>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-bakery-dark rounded-full mb-4 flex items-center justify-center text-white overflow-hidden border-2 border-bakery-accent">
                    <img src={imgTeam} className="w-full h-full object-cover" alt="Chef Pierre" />
                </div>
                <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Chef Pierre</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Patissier & Founder</p>
            </div>
      </section>

      {/* Social Call to Action */}
      <section className="py-32 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic mb-8 tracking-tighter uppercase leading-tight">
                VISIT THE <br/> <span className="text-bakery-accent">BAKERY STUDIO.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 font-medium leading-relaxed max-w-xl mx-auto">
                Step inside our workshop and see the 48-hour magic for yourself. Fresh batches come out of the oven every morning at 4:00 AM.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-bakery-dark text-white font-black px-12 py-5 rounded-full hover:bg-bakery-accent transition-all shadow-2xl shadow-bakery-dark/10 text-[10px] uppercase tracking-widest">
                    Find Nearest Studio
                </button>
                <button className="bg-white border-2 border-gray-100 text-gray-400 font-black px-12 py-5 rounded-full hover:border-bakery-accent hover:text-bakery-accent transition-all text-[10px] uppercase tracking-widest">
                    Follow Our Story
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;
