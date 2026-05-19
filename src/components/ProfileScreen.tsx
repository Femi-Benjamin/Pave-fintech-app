import React, { useState } from 'react';
import { User, ShieldCheck, HelpCircle, LogOut, Lock, Bell, Landmark, Pencil } from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">

      {/* User Info Card */}
      <div className="bg-surface rounded-2xl p-6 flex flex-col items-center shadow-card border border-outline-variant/10 mb-6 mt-2 relative">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant/30">
            <img src="https://i.pravatar.cc/150?img=33" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-surface flex items-center justify-center text-on-primary hover:opacity-90 transition-colors">
            <Pencil size={14} />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-on-background mb-1">Adekunle Adewale</h2>
        <p className="text-sm text-on-surface-variant font-medium mb-1">adekunle.a@example.com</p>
        <p className="text-sm text-on-surface-variant font-medium mb-5">+234 801 234 5678</p>
        
        <div className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[11px] tracking-wide">
          <ShieldCheck size={14} className="text-green-500" />
          KYC VERIFIED
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        
        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <User size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Account Details</div>
              <div className="text-xs text-on-surface-variant font-medium">Manage your personal information</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <Lock size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Security & PIN</div>
              <div className="text-xs text-on-surface-variant font-medium">Update password, biometrics & PIN</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <Bell size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Notification Preferences</div>
              <div className="text-xs text-on-surface-variant font-medium">Control alerts and emails</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <Landmark size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Linked Bank Account</div>
              <div className="text-xs text-on-surface-variant font-medium">Manage external accounts</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <HelpCircle size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Help & Support</div>
              <div className="text-xs text-on-surface-variant font-medium">Contact us for assistance</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 px-5 bg-surface border border-outline-variant/10 shadow-sm rounded-2xl hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <ShieldCheck size={20} />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-on-surface mb-0.5">Terms & Privacy</div>
              <div className="text-xs text-on-surface-variant font-medium">Read our policies</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <button 
          onClick={() => onNavigate('login')}
          className="w-full mt-4 bg-transparent border border-error/30 rounded-2xl p-4 flex items-center justify-center gap-3 text-error font-semibold hover:bg-error/10 transition-colors shadow-sm"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>

    </div>
  );
}
