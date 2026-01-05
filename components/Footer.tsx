
import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-left">
          <div className="space-y-8">
            <div className="flex items-center group cursor-pointer">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2830/2830305.png" 
                className="w-12 h-12 mr-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 object-contain" 
                alt="Sweet Bakery Logo" 
              />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none text-gray-900">SWEET<span className="text-bakery-accent">BAKERY</span></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-bakery-accent leading-none mt-1">Premium Artisan</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed">
              Crafting artisan memories since 1995. Every loaf and cake is a testament to our dedication to the art of baking.
            </p>
            <div className="flex space-x-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white rounded-full border border-gray-100 shadow-sm text-gray-400 hover:text-bakery-accent hover:shadow-md transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Our Story', 'Menu Gallery', 'Order Tracking', 'Store Locator'].map((item) => (
                <li key={item}>
                    <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-bakery-accent transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8">Service Hours</h4>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mon - Fri</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">7AM - 8PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saturday</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">8AM - 9PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sunday</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase">8AM - 4PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8">Contact Studio</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={18} className="text-bakery-accent flex-shrink-0" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">123 Baker St, Sweet Valley, CA 90210</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={18} className="text-bakery-accent flex-shrink-0" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">(555) BAKERY-90</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={18} className="text-bakery-accent flex-shrink-0" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">hello@sweetbakery.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; 2024 SWEET BAKERY ARTISAN DELIVERY • ALL RIGHTS RESERVED</p>
          <div className="flex space-x-8">
            <a href="#" className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
