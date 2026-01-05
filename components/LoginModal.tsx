
import React, { useState, useEffect } from 'react';
import { X, Shield, User as UserIcon, CheckCircle2, Smile, ArrowLeft, Mail, Check, AlertCircle, Lock, Info } from 'lucide-react';
import { UserRole, User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: any) => void;
  users: any[];
}

type ModalView = 'login' | 'register' | 'forgot';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegister, users }) => {
  const [view, setView] = useState<ModalView>('login');
  const [formData, setFormData] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time Validation State
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  const isUsernameValid = usernameRegex.test(formData.username);
  const isPasswordLongEnough = formData.password.length >= 6;
  const isPasswordMatching = formData.password === formData.confirmPassword && formData.password !== '';

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
      setFormData({ username: '', password: '', confirmPassword: '', name: '', email: '' });
      setView('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Simulate API Delay
    setTimeout(() => {
        if (view === 'login') {
            const foundUser = users.find(u => 
                u.username.toLowerCase() === formData.username.toLowerCase() && u.password === formData.password
            );
            
            if (foundUser) {
                onLogin(foundUser);
                onClose();
            } else {
                const userExists = users.some(u => u.username.toLowerCase() === formData.username.toLowerCase());
                setError(userExists ? 'Incorrect password. Please try again.' : 'Artisan profile not found.');
            }
        } else if (view === 'register') {
            // Final validation check
            if (!isUsernameValid) {
                setError('Username must start with a letter and be 3-16 characters.');
                setIsLoading(false);
                return;
            }
            if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
                setError('This username is already claimed by another baker.');
                setIsLoading(false);
                return;
            }
            
            onRegister({
                username: formData.username,
                password: formData.password,
                name: formData.username, // Using username as name since Full Name was removed
                role: UserRole.CUSTOMER
            });
        } else if (view === 'forgot') {
            if (!formData.email.includes('@')) {
                setError('Please enter a valid email address.');
            } else {
                setSuccess('Recovery link dispatched to your inbox!');
                setTimeout(() => setView('login'), 2000);
            }
        }
        setIsLoading(false);
    }, 800);
  };

  const isFormOnLeft = view === 'login' || view === 'forgot';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-bakery-dark/60 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white w-full max-w-[900px] md:h-[650px] h-auto max-h-[95vh] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative flex animate-slide-up border border-white/20">
        
        {/* Slidable Content Area */}
        <div 
            className="w-full md:w-1/2 h-full bg-white z-10 transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) flex flex-col justify-center p-8 sm:p-14 text-left overflow-y-auto"
            style={{ 
                transform: window.innerWidth >= 768 
                  ? (isFormOnLeft ? 'translateX(0)' : 'translateX(100%)')
                  : 'none'
            }}
        >
            <div className="w-full max-w-sm mx-auto md:max-w-none py-4">
                {view === 'login' && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-3">Welcome <br/> <span className="text-bakery-accent">Back</span></h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sign in to your artisan account</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Artisan Identity</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="Username"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-bakery-accent/10 outline-none transition-all"
                                        required
                                    />
                                    <UserIcon size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Password"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold focus:ring-4 focus:ring-bakery-accent/10 outline-none transition-all"
                                        required
                                    />
                                    <Lock size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                                <div className="text-right">
                                    <button type="button" onClick={() => setView('forgot')} className="text-[9px] font-black text-bakery-accent uppercase tracking-widest hover:underline">Forget Password</button>
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-bakery-dark text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-bakery-accent transition-all shadow-xl shadow-bakery-dark/10 active:scale-[0.98]"
                            >
                                {isLoading ? 'Verifying...' : 'Authenticate'}
                            </button>
                        </form>
                        
                        <div className="pt-4 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                New here? <button onClick={() => setView('register')} className="text-bakery-accent hover:underline ml-1">Create Artisan Profile</button>
                            </p>
                        </div>
                    </div>
                )}

                {view === 'register' && (
                    <div className="animate-fade-in space-y-6">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-3">Join <br/> <span className="text-bakery-accent">Bakery</span></h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Become a member of our community</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1">Username</label>
                                <input 
                                    type="text" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="bakery_fan_01"
                                    className={`w-full bg-gray-50 border rounded-xl px-5 py-3.5 text-xs font-bold outline-none transition-colors ${formData.username.length > 0 ? (isUsernameValid ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-100 bg-red-50/30') : 'border-gray-100'}`}
                                    required
                                />
                            </div>

                            {/* Live Username Feedback */}
                            {formData.username.length > 0 && !isUsernameValid && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2 animate-fade-in">
                                    <AlertCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-[8px] font-bold text-red-600 uppercase tracking-wider leading-relaxed">
                                        Must start with a letter. 3-16 chars. Letters, numbers, & underscores only.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1">Password</label>
                                    <input 
                                        type="password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min. 6 characters"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-xs font-bold outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Repeat your password"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-xs font-bold outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Validation Checklist */}
                            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className={`flex items-center space-x-2 transition-all ${isUsernameValid ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isUsernameValid ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                                        {isUsernameValid && <Check size={8} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Valid Username</span>
                                </div>
                                <div className={`flex items-center space-x-2 transition-all ${isPasswordLongEnough ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isPasswordLongEnough ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                                        {isPasswordLongEnough && <Check size={8} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest">6+ Characters</span>
                                </div>
                                <div className={`flex items-center space-x-2 transition-all ${isPasswordMatching ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isPasswordMatching ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                                        {isPasswordMatching && <Check size={8} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Passwords Match</span>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading || !isUsernameValid || !isPasswordLongEnough || !isPasswordMatching}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] mt-2 ${
                                    (isUsernameValid && isPasswordLongEnough && isPasswordMatching)
                                    ? 'bg-bakery-dark text-white hover:bg-bakery-accent shadow-bakery-dark/10'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? 'Processing...' : 'Create Artisan Profile'}
                            </button>
                        </form>
                        <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Already a baker? <button onClick={() => setView('login')} className="text-bakery-accent hover:underline ml-1">Log In</button>
                        </p>
                    </div>
                )}

                {view === 'forgot' && (
                    <div className="animate-fade-in space-y-8">
                        <button 
                            onClick={() => setView('login')}
                            className="flex items-center text-bakery-accent text-[9px] font-black uppercase tracking-[0.2em] hover:underline mb-2 group"
                        >
                            <ArrowLeft size={12} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to portal
                        </button>
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-3">Reset <br/> <span className="text-bakery-accent">Password</span></h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-[250px]">
                                We'll send an artisan recovery link to your registered email.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 pl-14 text-xs font-bold focus:ring-4 focus:ring-bakery-accent/10 outline-none transition-all"
                                    required
                                />
                                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-bakery-dark text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-bakery-accent transition-all shadow-xl"
                            >
                                {isLoading ? 'Sending...' : 'Send Recovery Link'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>

        {/* Branding Sidebar */}
        <div 
            className="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-gray-50 z-20 transition-transform duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) items-center justify-center p-14 text-center"
            style={{ transform: isFormOnLeft ? 'translateX(100%)' : 'translateX(0)' }}
        >
            <div className="relative w-full space-y-12">
                <div className="relative h-40 w-full flex items-center justify-center">
                    <div className={`absolute transition-all duration-700 ${isFormOnLeft ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12 pointer-events-none'}`}>
                        <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-gray-100">
                             <Shield size={64} className="text-bakery-accent" />
                        </div>
                    </div>
                    <div className={`absolute transition-all duration-700 ${!isFormOnLeft ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-12 pointer-events-none'}`}>
                         <div className="w-32 h-32 bg-bakery-accent rounded-[2.5rem] shadow-2xl flex items-center justify-center shadow-bakery-accent/30">
                             <Smile size={64} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">
                        {isFormOnLeft ? (view === 'forgot' ? 'LOST YOUR WAY?' : 'FRESH BATCH READY') : 'JOIN THE KITCHEN'}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 max-w-[220px] mx-auto leading-relaxed uppercase tracking-[0.2em]">
                        {isFormOnLeft 
                            ? (view === 'forgot' ? "Don't worry, we'll help you find your artisan keys." : "Log in to track your delivery and manage your basket.") 
                            : "Create your profile to start ordering our award-winning artisan treats."}
                    </p>
                </div>
                
                <div className="pt-8">
                    <div className="flex justify-center space-x-2">
                        <div className={`w-8 h-1 rounded-full transition-all duration-500 ${isFormOnLeft ? 'bg-bakery-accent' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-1 rounded-full transition-all duration-500 ${!isFormOnLeft ? 'bg-bakery-accent' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Floating Controls */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 z-[100] transition-colors bg-white/50 rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Global Toasts */}
        {error && (
            <div className="absolute top-6 left-6 right-14 md:right-6 z-[100] animate-bounce">
                <div className="p-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-red-600/20 flex items-center">
                    <AlertCircle size={16} className="mr-3 flex-shrink-0" /> {error}
                </div>
            </div>
        )}

        {success && (
            <div className="absolute top-6 left-6 right-14 md:right-6 z-[100] animate-bounce">
                <div className="p-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center">
                    <CheckCircle2 size={16} className="mr-3 flex-shrink-0" /> {success}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
