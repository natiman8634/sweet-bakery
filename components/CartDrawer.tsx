
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (details: { phone: string, address: string, deliveryMethod: 'Delivery' | 'Pickup' }) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [step, setStep] = useState<'cart' | 'details'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [details, setDetails] = useState({ phone: '', address: '' });
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (deliveryMethod === 'Delivery' ? 5 : 0);

  const isPhoneValid = details.phone.trim().length >= 8;
  const isAddressValid = deliveryMethod === 'Pickup' || details.address.trim().length > 0;
  const canPlaceOrder = isPhoneValid && isAddressValid;

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setDetails({ phone: '', address: '' });
      }, 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-bakery-dark/50 backdrop-blur-sm">
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Your <span className="text-bakery-accent">Basket</span></h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{items.length} artisan items</p>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-6">
            {step === 'cart' ? (
                items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="text-gray-300" size={32} />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your basket is empty</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex space-x-4 animate-slide-up">
                            <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                            <div className="flex-grow">
                                <h4 className="text-xs font-black uppercase text-gray-900 mb-1">{item.name}</h4>
                                <p className="text-[10px] font-bold text-bakery-accent mb-3">${item.price.toFixed(2)}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 space-x-4 border border-gray-100">
                                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-gray-400 hover:text-bakery-accent"><Minus size={12}/></button>
                                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-gray-400 hover:text-bakery-accent"><Plus size={12}/></button>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )
            ) : (
                <div className="space-y-6 animate-slide-up">
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        <button 
                            onClick={() => setDeliveryMethod('Delivery')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deliveryMethod === 'Delivery' ? 'bg-white text-bakery-dark shadow-sm' : 'text-gray-400'}`}
                        >
                            Delivery
                        </button>
                        <button 
                            onClick={() => setDeliveryMethod('Pickup')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deliveryMethod === 'Pickup' ? 'bg-white text-bakery-dark shadow-sm' : 'text-gray-400'}`}
                        >
                            Pickup
                        </button>
                    </div>

                    <div className="text-left">
                        <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            <span>Phone Number</span>
                            {!isPhoneValid && <span className="text-red-500 flex items-center"><AlertCircle size={10} className="mr-1"/> Required</span>}
                        </label>
                        <input 
                            type="tel" 
                            className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-xs font-bold transition-all ${!isPhoneValid && details.phone.length > 0 ? 'border-red-100' : 'border-transparent focus:ring-2 focus:ring-bakery-accent/20'}`}
                            placeholder="+1 234 567 890"
                            value={details.phone}
                            onChange={(e) => setDetails({...details, phone: e.target.value})}
                        />
                    </div>

                    {deliveryMethod === 'Delivery' && (
                        <div className="text-left animate-fade-in">
                            <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                <span>Full Address</span>
                                {!isAddressValid && <span className="text-red-500 flex items-center"><AlertCircle size={10} className="mr-1"/> Required</span>}
                            </label>
                            <textarea 
                                className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-xs font-bold h-32 transition-all ${!isAddressValid && details.address.length > 0 ? 'border-red-100' : 'border-transparent focus:ring-2 focus:ring-bakery-accent/20'}`}
                                placeholder="Where should we bring your treats?"
                                value={details.address}
                                onChange={(e) => setDetails({...details, address: e.target.value})}
                            ></textarea>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="p-8 bg-gray-50 rounded-t-[3rem] space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {deliveryMethod === 'Delivery' && (
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Delivery Fee</span>
                        <span>$5.00</span>
                    </div>
                )}
                <div className="flex justify-between text-xl font-black text-gray-900 uppercase tracking-tighter pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {items.length > 0 && (
                <div className="flex space-x-3">
                    {step === 'details' && (
                        <button 
                            onClick={() => setStep('cart')}
                            className="bg-white p-5 rounded-2xl border border-gray-200 text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <button 
                        disabled={step === 'details' && !canPlaceOrder}
                        onClick={() => step === 'cart' ? setStep('details') : onCheckout({...details, deliveryMethod})}
                        className={`flex-grow py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center group ${
                            (step === 'details' && !canPlaceOrder) 
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                            : 'bg-bakery-dark text-white hover:bg-bakery-accent shadow-xl shadow-bakery-dark/10'
                        }`}
                    >
                        {step === 'cart' ? 'Proceed to Details' : (canPlaceOrder ? 'Place Your Order' : 'Enter Required Info')}
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
