import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, ArrowUp, ArrowLeftRight, CreditCard, ChevronRight, Bell, Users, Landmark, Banknote, ShoppingCart, Smartphone, Phone, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    setIsDark(nextDark);
  };

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      {/* Header */}
      <header className="px-5 py-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <Logo size="sm" onClick={() => onNavigate('dashboard')} />
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-on-surface-variant hover:text-on-surface transition-colors p-1" title="Toggle Theme">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell size={24} />
            <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full"></span>
          </button>
          <button onClick={() => onNavigate('profile')} className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 space-y-10 scrollbar-hide">
        
        {/* Overview Section */}
        <section>
          <h2 className="text-headline-md text-on-surface mb-4">Overview</h2>
          <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-label-caps text-on-surface-variant">Available Balance</span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            
            <h1 className="text-display-naira text-on-surface mb-8 flex items-baseline">
              <span className="text-[0.75em] mr-1">₦</span>
              {showBalance ? (
                <>450,240<span className="text-[0.75em] text-on-surface-variant/70 font-normal">.50</span></>
              ) : (
                <>•••••••</>
              )}
            </h1>
            
            <div className="flex justify-between gap-4">
              <button onClick={() => onNavigate('deposit')} className="flex-1 bg-primary text-on-primary h-[56px] rounded-lg font-semibold flex flex-col items-center justify-center gap-1 hover:bg-primary/90 transition-colors active:scale-95 shadow-sm">
                <Plus size={18} />
                <span className="text-xs">Fund</span>
              </button>
              <button onClick={() => onNavigate('airtime')} className="hidden md:flex flex-1 bg-surface-variant text-on-surface h-[56px] rounded-lg font-semibold flex-col items-center justify-center gap-1 hover:bg-surface-variant/80 transition-colors active:scale-95">
                <Phone size={18} />
                <span className="text-xs">Airtime</span>
              </button>
              <button className="flex-1 bg-surface-variant text-on-surface/50 h-[56px] rounded-lg font-semibold flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed">
                <ArrowUp size={18} />
                <span className="text-xs">Withdraw</span>
              </button>
              <button className="flex-1 bg-surface-variant text-on-surface/50 h-[56px] rounded-lg font-semibold flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed">
                <ArrowLeftRight size={18} />
                <span className="text-xs">Transfer</span>
              </button>
            </div>
          </div>
        </section>

        {/* Active Plans Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-headline-md text-on-surface">Active Plans</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {/* Plan 1 */}
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 shadow-card hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-body-lg">Emergency Fund</h3>
                  <p className="text-sm text-on-surface-variant">Savings</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg text-on-surface flex items-baseline font-display">
                  <span className="text-sm mr-0.5">₦</span>150,000
                </span>
                <span className="text-xs font-medium text-on-surface-variant flex items-baseline">
                  of <span className="text-[10px] ml-1 mr-0.5">₦</span>500,000
                </span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[30%] rounded-full"></div>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 shadow-card hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-body-lg">Oluwa Ajo</h3>
                  <p className="text-sm text-on-surface-variant">Thrift Group</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg text-on-surface flex items-baseline font-display">
                  <span className="text-sm mr-0.5">₦</span>50,000
                </span>
                <span className="text-xs font-medium text-on-surface-variant">
                  Next turn: 12 Nov
                </span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[20%] rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-headline-md text-on-surface">Recent Activity</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          
          <div className="bg-surface rounded-2xl border border-outline-variant/20 shadow-card overflow-hidden">
            {[
              { icon: Landmark, title: 'Bank Deposit', date: 'Today, 10:24 AM', amount: '+₦25,000.00', positive: true, iconBg: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
              { icon: ShoppingCart, title: 'Jumia Checkout', date: 'Yesterday, 4:15 PM', amount: '-₦12,500.00', positive: false, iconBg: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
              { icon: ArrowLeftRight, title: 'Transfer to Chinedu', date: '05 Nov 2023', amount: '-₦5,000.00', positive: false, iconBg: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
              { icon: Smartphone, title: 'MTN Airtime', date: '04 Nov 2023', amount: '-₦1,000.00', positive: false, iconBg: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
              { icon: Banknote, title: 'Emergency Fund Auto-save', date: '01 Nov 2023', amount: '-₦20,000.00', positive: false, iconBg: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
            ].map((txn, idx, arr) => {
              const Icon = txn.icon;
              return (
                <div key={idx} className={`flex items-center justify-between p-5 hover:bg-surface-variant/30 transition-colors ${idx !== arr.length - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${txn.iconBg} ${txn.iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-body-sm">{txn.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{txn.date}</p>
                    </div>
                  </div>
                  <div className={`font-mono text-sm tracking-tight font-semibold ${txn.positive ? 'text-primary' : 'text-on-surface'}`}>
                    {txn.amount}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
}
