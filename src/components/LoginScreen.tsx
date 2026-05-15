import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, Eye, EyeOff, Fingerprint } from 'lucide-react';
import Logo from './Logo';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <Logo size="xl" layout="vertical" />
          <p className="text-on-surface-variant font-normal text-lg mt-4">Secure access to your wealth.</p>
        </div>

        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Email or Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type="text" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                  placeholder="Enter your credentials"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-on-surface">Password</label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-on-surface-variant" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-[#0b1120] border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background tracking-widest placeholder:tracking-normal placeholder:text-on-surface-variant/60"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Login <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <span className="relative bg-surface px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">OR</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button className="w-16 h-16 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors active:scale-95 mb-3">
              <Fingerprint size={28} strokeWidth={1.5} />
            </button>
            <span className="text-xs font-medium text-on-surface-variant">Biometric Login</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="text-on-surface-variant">Don't have an account? </span>
          <button onClick={() => onNavigate('signup')} className="font-semibold text-primary hover:underline">
            Create Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
