import React, { useState } from 'react';
import { ArrowLeft, Users, CheckCircle2, ArrowRight, Search } from 'lucide-react';

interface JoinThriftGroupScreenProps {
  onNavigate: (screen: string) => void;
}

export default function JoinThriftGroupScreen({ onNavigate }: JoinThriftGroupScreenProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groupFound, setGroupFound] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleSearch = () => {
    if (!inviteCode.trim()) return;
    setIsSearching(true);
    // Simulate network request
    setTimeout(() => {
      setIsSearching(false);
      setGroupFound(true);
    }, 1500);
  };

  const handleJoin = () => {
    setJoined(true);
    setTimeout(() => {
      onNavigate('thrift_detail:family_target'); // Redirect to a group as an example
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 bg-background text-on-background">
        <button onClick={() => onNavigate('thrift')} className="p-2 -ml-2 text-on-surface-variant hover:text-on-background transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[22px] font-semibold">Join Group</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24 scrollbar-hide">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-headline-sm font-bold text-on-background mb-2">Have an invite code?</h2>
            <p className="text-body-sm text-on-surface-variant">Enter the code below to join an existing thrift group and start saving together.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. PAVE-Q3TS-2024"
                className="w-full pl-11 pr-4 py-4 bg-surface border border-outline-variant/30 rounded-xl text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary font-mono tracking-widest text-center transition-colors uppercase font-bold"
              />
            </div>
            
            {!groupFound && (
              <button
                onClick={handleSearch}
                disabled={!inviteCode.trim() || isSearching}
                className="w-full py-4 bg-surface-variant text-on-surface rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-on-surface border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </span>
                ) : (
                  'Find Group'
                )}
              </button>
            )}
          </div>

          {/* Group Preview Card */}
          {groupFound && !joined && (
            <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-center font-bold text-lg text-on-background mb-1">Family Target 2024</h3>
              <p className="text-center text-xs text-on-surface-variant mb-6">Created by Sarah Adeyemi</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant font-medium">Contribution</span>
                  <span className="text-sm font-bold text-on-background">₦20,000 / Month</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant font-medium">Total Pool</span>
                  <span className="text-sm font-bold text-on-background">₦100,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant font-medium">Members</span>
                  <span className="text-sm font-bold text-on-background">4 / 5 Joined</span>
                </div>
              </div>

              <button
                onClick={handleJoin}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-on-background rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-[15px]"
              >
                Confirm & Join <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Success State */}
          {joined && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-background mb-2">Successfully Joined!</h3>
              <p className="text-sm text-on-surface-variant text-center">You are now a member of Family Target 2024. Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
