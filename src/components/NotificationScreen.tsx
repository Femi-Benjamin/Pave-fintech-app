import React from 'react';
import { ArrowLeft, Bell, Wallet, Users, PiggyBank } from 'lucide-react';

interface NotificationScreenProps {
  onNavigate: (screen: string) => void;
}

export default function NotificationScreen({ onNavigate }: NotificationScreenProps) {
  const notifications = [
    { type: 'wallet', title: 'Fund Received', message: 'You have received ₦50,000 from GTBank.', time: '2 hours ago', unread: true, icon: Wallet, color: 'text-green-600 bg-green-100' },
    { type: 'thrift', title: 'Ajo contribution deducted', message: '₦20,000 was deducted for Office Ajo Group.', time: '1 day ago', unread: false, icon: Users, color: 'text-blue-600 bg-blue-100' },
    { type: 'savings', title: 'Goal Reached!', message: 'Congrats! You hit your 10% milestone for Dubai Trip.', time: '2 days ago', unread: false, icon: PiggyBank, color: 'text-orange-600 bg-orange-100' },
    { type: 'system', title: 'Please complete your KYC', message: 'You need to verify your BVN to unlock full account limits.', time: '3 days ago', unread: true, action: 'kyc', icon: Bell, color: 'text-red-600 bg-red-100' }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="p-2 -ml-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-display font-bold text-on-background">Notifications</h1>
        </div>
        <button className="text-xs font-bold text-primary">Mark all as read</button>
      </header>

      <div className="space-y-4">
        {notifications.map((notif, idx) => {
          const Icon = notif.icon;
          return (
            <div key={idx} className={`bg-surface p-5 rounded-2xl flex gap-4 transition-all ${notif.unread ? 'border-l-4 border-l-primary shadow-sm' : 'border border-outline-variant/30 opacity-70'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                 <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${notif.unread ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{notif.title}</h4>
                  <span className="text-[10px] whitespace-nowrap text-on-surface-variant ml-2">{notif.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{notif.message}</p>
                {notif.action && (
                  <button onClick={() => onNavigate(notif.action)} className="mt-3 text-xs font-bold text-primary hover:underline">
                    Take Action
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
