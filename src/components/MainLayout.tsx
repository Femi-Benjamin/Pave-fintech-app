import React from 'react';
import { Home, Smartphone, ArrowLeftRight, Settings, Bell, User, PiggyBank, Wallet, Users, Sun, LogOut } from 'lucide-react';
import Logo from './Logo';

interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export default function MainLayout({ children, activeScreen, onNavigate }: MainLayoutProps) {
  const desktopNavItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'savings_hub', icon: PiggyBank, label: 'Savings' },
    { id: 'thrift', icon: Users, label: 'Thrift' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const mobileNavItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'savings_hub', icon: PiggyBank, label: 'Savings' },
    { id: 'thrift', icon: Users, label: 'Thrift' },
    { id: 'airtime', icon: Smartphone, label: 'Airtime' }
  ];

  return (
    <div className="h-dvh bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-outline-variant/50 p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <Logo size="md" onClick={() => onNavigate('dashboard')} />
        </div>
        
        <nav className="flex-1 space-y-2">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold ${
                  isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <button 
             onClick={() => document.documentElement.classList.toggle('dark')}
             className="w-full flex items-center justify-between px-4 py-3 bg-surface-variant/30 rounded-xl hover:bg-surface-variant/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sun size={18} className="text-on-surface" />
              <span className="text-sm font-semibold text-on-surface">Theme</span>
            </div>
            <div className="w-8 h-5 bg-primary/20 dark:bg-surface-variant rounded-full p-0.5 flex items-center dark:justify-end">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
          </button>
          
          <button 
             onClick={() => onNavigate('login')}
             className="w-full flex items-center gap-3 px-4 py-3 bg-surface-variant/30 rounded-xl hover:bg-surface-variant/80 transition-colors text-error"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        {/* Mobile Topbar */}
        {!['dashboard', 'create_savings'].includes(activeScreen) && (
          <header className="md:hidden flex items-center justify-between p-5 bg-background sticky top-0 z-20 h-16">
            {activeScreen === 'profile' ? (
              <>
                <button onClick={() => onNavigate('profile')} className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 relative z-10">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <Logo size="sm" onClick={() => onNavigate('dashboard')} />
                  </div>
                </div>
                <button onClick={() => onNavigate('notifications')} className="relative text-on-surface-variant hover:text-on-surface transition-colors z-10">
                  <Bell size={24} />
                </button>
              </>
            ) : (
              <>
                <Logo size="sm" onClick={() => onNavigate('dashboard')} />
                <div className="flex items-center gap-4">
                  <button onClick={() => onNavigate('notifications')} className="relative text-on-surface-variant hover:text-on-surface transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full"></span>
                  </button>
                  <button onClick={() => onNavigate('profile')} className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                  </button>
                </div>
              </>
            )}
          </header>
        )}

        {/* Desktop Topbar */}
        {!['dashboard', 'create_savings'].includes(activeScreen) && (
          <header className="hidden md:flex items-center justify-between p-6 bg-background">
             <div>
               <h2 className="text-headline-md font-bold text-on-background capitalize">
                 {activeScreen.replace('_', ' ')}
               </h2>
               <p className="text-on-surface-variant text-body-sm font-normal mt-1">Welcome back, John!</p>
             </div>
             
             <div className="flex items-center gap-4">

                <button onClick={() => onNavigate('notifications')} className="relative text-on-surface-variant hover:text-on-surface transition-colors p-2">
                 <Bell size={24} />
                 <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full"></span>
               </button>
             </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto relative scroll-smooth scrollbar-hide ${!['dashboard', 'create_savings'].includes(activeScreen) ? 'p-5 pb-24 md:pb-6' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/20 pt-2 pb-6 px-6 flex justify-between items-center z-30 transition-transform ${mobileNavItems.some(i => i.id === activeScreen) ? 'translate-y-0' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-0 w-[72px] rounded-2xl transition-colors ${
                isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] tracking-wider uppercase ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
}
