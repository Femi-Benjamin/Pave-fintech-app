import React, { useState, useRef } from 'react';
import { ArrowLeft, Crown, Users, Calendar, Clock, MessageCircle, ChevronRight, AlertTriangle, Bell, Trash2, Send, CheckCircle2, XCircle, Timer, GripVertical, ArrowUp, ArrowDown, X } from 'lucide-react';

import { THRIFT_GROUPS } from './AllThriftGroupsScreen';

interface ThriftDetailScreenProps {
  onNavigate: (screen: string) => void;
  groupId?: string;
}

const MEMBERS = [
  { id: 1, name: 'You (Admin)', initials: 'YA', paid: true, amount: 25000, position: 1, avatar: 'bg-primary text-white' },
  { id: 2, name: 'Sarah Adeyemi', initials: 'SA', paid: true, amount: 25000, position: 2, avatar: 'bg-[#d97706] text-white' },
  { id: 3, name: 'Mike Okonkwo', initials: 'MO', paid: true, amount: 25000, position: 3, avatar: 'bg-surface-variant text-on-surface' },
  { id: 4, name: 'David Nnamdi', initials: 'DN', paid: false, amount: 0, position: 4, avatar: 'bg-[#0891b2] text-white' },
  { id: 5, name: 'Chioma Eze', initials: 'CE', paid: true, amount: 25000, position: 5, avatar: 'bg-[#be185d] text-white' },
  { id: 6, name: 'Emeka Uche', initials: 'EU', paid: false, amount: 0, position: 6, avatar: 'bg-surface-variant text-on-surface' },
  { id: 7, name: 'Grace Balogun', initials: 'GB', paid: true, amount: 25000, position: 7, avatar: 'bg-[#7c3aed] text-white' },
  { id: 8, name: 'Tunde Ajayi', initials: 'TA', paid: true, amount: 25000, position: 8, avatar: 'bg-[#059669] text-white' },
  { id: 9, name: 'Funke Alabi', initials: 'FA', paid: true, amount: 25000, position: 9, avatar: 'bg-[#dc2626] text-white' },
  { id: 10, name: 'Kola Badmus', initials: 'KB', paid: true, amount: 25000, position: 10, avatar: 'bg-surface-variant text-on-surface' },
];

const ACTIVITIES = [
  { id: 1, type: 'contribution', user: 'Tunde Ajayi', text: 'contributed ₦5,000', time: '2 hours ago' },
  { id: 2, type: 'payout', user: 'Sarah Adeyemi', text: 'received payout of ₦50,000', time: '1 day ago' },
  { id: 3, type: 'reminder', user: 'Admin', text: 'sent reminder to David Nnamdi', time: '1 day ago' },
  { id: 4, type: 'contribution', user: 'Grace Balogun', text: 'contributed ₦5,000', time: '2 days ago' },
  { id: 5, type: 'join', user: 'Kola Badmus', text: 'joined the group', time: '5 days ago' },
  { id: 6, type: 'contribution', user: 'You', text: 'contributed ₦5,000', time: '1 week ago' },
  { id: 7, type: 'payout', user: 'Mike Okonkwo', text: 'received payout of ₦50,000', time: '2 weeks ago' },
];

const MESSAGES = [
  { id: 1, sender: 'Sarah Adeyemi', initials: 'SA', text: 'Please let\'s all try to pay on time this week 🙏', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'You', initials: 'YA', text: 'Noted! I\'ve sent reminders to those who haven\'t paid yet.', time: '10:45 AM', isMe: true },
  { id: 3, sender: 'Mike Okonkwo', initials: 'MO', text: 'Already done from my end ✅', time: '11:02 AM', isMe: false },
  { id: 4, sender: 'David Nnamdi', initials: 'DN', text: 'Will pay before EOD, had a small delay', time: '11:15 AM', isMe: false },
  { id: 5, sender: 'Grace Balogun', initials: 'GB', text: 'Just made my payment now!', time: '12:00 PM', isMe: false },
];

type TabId = 'overview' | 'members' | 'schedule' | 'activity' | 'chat';

export default function ThriftDetailScreen({ onNavigate, groupId = 'q3_tech' }: ThriftDetailScreenProps) {
  const group = THRIFT_GROUPS.find(g => g.id === groupId) || THRIFT_GROUPS[0];
  const groupMembers = MEMBERS.slice(0, group.members);
  const isAdmin = group.isAdmin;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ member: string; action: string } | null>(null);
  const [payoutOrder, setPayoutOrder] = useState(groupMembers.map(m => ({ ...m })));
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState(MESSAGES);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Clock size={16} /> },
    { id: 'members', label: 'Members', icon: <Users size={16} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={16} /> },
    { id: 'activity', label: 'Activity', icon: <Bell size={16} /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle size={16} /> },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmAction = () => {
    if (confirmModal) {
      showToast(`${confirmModal.action === 'remind' ? 'Reminder sent to' : 'Removed'} ${confirmModal.member}`);
      setConfirmModal(null);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...payoutOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newOrder.length) return;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setPayoutOrder(newOrder);
  };

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: 'You', initials: 'YA', text: chatMsg, time: 'Just now', isMe: true }]);
    setChatMsg('');
  };

  const paidCount = groupMembers.filter(m => m.paid).length;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <CheckCircle2 size={16} className="text-primary" />;
      case 'payout': return <ArrowUp size={16} className="text-tertiary" />;
      case 'reminder': return <Bell size={16} className="text-[#d97706]" />;
      case 'join': return <Users size={16} className="text-primary" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-full min-h-0">
      {/* Header */}
      <header className="flex items-center gap-4 mb-4 shrink-0">
        <button onClick={() => onNavigate('thrift')} className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-variant/80 rounded-full text-on-surface-variant transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-display font-bold text-on-background">{group.name}</h1>
            {isAdmin && <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><Crown size={10} /> Admin</span>}
          </div>
          <p className="text-xs text-on-surface-variant">{group.amount} / {group.frequency} • {group.members} Members</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 mb-4 shrink-0 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold tracking-wide transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 space-y-4">

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <>
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cycle Progress</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Week 4 of 12</span>
              </div>
              <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden mb-3">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: '33%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-background rounded-xl p-3.5 border border-outline-variant/20">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Pool</p>
                  <p className="text-lg font-bold text-on-background font-display">₦600,000</p>
                </div>
                <div className="bg-background rounded-xl p-3.5 border border-outline-variant/20">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Collected</p>
                  <p className="text-lg font-bold text-primary font-display">₦200,000</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Next Payout</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0891b2] text-white flex items-center justify-center font-bold text-sm">DN</div>
                <div className="flex-1">
                  <p className="font-semibold text-on-background">David Nnamdi</p>
                  <p className="text-xs text-on-surface-variant">Position 4 • Oct 31, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-on-background font-display">₦50,000</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Est. Payout</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 shadow-card">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">This Week's Status</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(paidCount / groupMembers.length) * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold text-on-surface">{paidCount}/{groupMembers.length}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {groupMembers.slice(0, 5).map(m => (
                  <div key={m.id} className={`w-9 h-9 rounded-full ${m.avatar} flex items-center justify-center text-[10px] font-bold ring-2 ${m.paid ? 'ring-primary' : 'ring-error'}`}>
                    {m.initials}
                  </div>
                ))}
                {groupMembers.length > 5 && (
                  <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                    +{groupMembers.length - 5}
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <button onClick={() => setActiveTab('members')} className="w-full py-3 bg-primary/10 text-primary rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                <Users size={16} /> Manage Members <ChevronRight size={16} />
              </button>
            )}
          </>
        )}

        {/* ===== MEMBERS TAB ===== */}
        {activeTab === 'members' && (
          <>
            <div className="bg-surface rounded-xl p-4 border border-outline-variant/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">Contributions This Cycle</p>
                <p className="text-xs text-on-surface-variant">{paidCount} of {groupMembers.length} members paid</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${paidCount === groupMembers.length ? 'bg-primary/10 text-primary' : 'bg-[#d97706]/10 text-[#d97706]'}`}>
                {Math.round((paidCount / groupMembers.length) * 100)}% Complete
              </div>
            </div>

            <div className="space-y-2">
              {groupMembers.map(member => (
                <div key={member.id} className="bg-surface rounded-xl p-4 border border-outline-variant/10 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${member.avatar} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-on-surface truncate">{member.name}</p>
                      {member.id === 1 && <Crown size={12} className="text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-on-surface-variant">Position {member.position} • ₦{member.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${member.paid ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                      {member.paid ? 'Paid' : 'Overdue'}
                    </span>
                    {isAdmin && member.id !== 1 && !member.paid && (
                      <button
                        onClick={() => setConfirmModal({ member: member.name, action: 'remind' })}
                        className="w-8 h-8 rounded-lg bg-[#d97706]/10 text-[#d97706] flex items-center justify-center hover:bg-[#d97706]/20 transition-colors"
                        title="Send Reminder"
                      >
                        <Bell size={14} />
                      </button>
                    )}
                    {isAdmin && member.id !== 1 && (
                      <button
                        onClick={() => setConfirmModal({ member: member.name, action: 'remove' })}
                        className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== SCHEDULE TAB ===== */}
        {activeTab === 'schedule' && (
          <>
            {isAdmin && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">
                <Crown size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface leading-relaxed">As admin, use the <strong>arrows</strong> to reorder the payout schedule.</p>
              </div>
            )}
            <div className="space-y-1">
              {payoutOrder.map((member, index) => {
                const status = index < 3 ? 'completed' : index === 3 ? 'current' : 'upcoming';
                return (
                  <div key={member.id} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${status === 'current' ? 'bg-primary/5 border-primary/30' : 'bg-surface border-outline-variant/10'}`}>
                    {isAdmin && (
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-variant disabled:opacity-20 transition-colors">
                          <ArrowUp size={12} />
                        </button>
                        <button onClick={() => moveItem(index, 'down')} disabled={index === payoutOrder.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-variant disabled:opacity-20 transition-colors">
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${status === 'completed' ? 'bg-primary/10 text-primary' : status === 'current' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {index + 1}
                    </div>
                    <div className={`w-9 h-9 rounded-full ${member.avatar} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{member.name}</p>
                      <p className="text-[11px] text-on-surface-variant">
                        {status === 'completed' ? 'Received ₦50,000' : status === 'current' ? 'Payout: Oct 31' : `Week ${index + 1}`}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {status === 'completed' && <CheckCircle2 size={18} className="text-primary" />}
                      {status === 'current' && <Timer size={18} className="text-primary" />}
                      {status === 'upcoming' && <Clock size={18} className="text-on-surface-variant/40" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===== ACTIVITY TAB ===== */}
        {activeTab === 'activity' && (
          <div className="space-y-1">
            {ACTIVITIES.map(act => (
              <div key={act.id} className="bg-surface rounded-xl p-4 border border-outline-variant/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                  {getActivityIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface"><span className="font-semibold">{act.user}</span> {act.text}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== CHAT TAB ===== */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide mb-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  {!msg.isMe && (
                    <div className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-[9px] font-bold text-on-surface-variant shrink-0 mt-1">
                      {msg.initials}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.isMe ? 'bg-primary text-white' : 'bg-surface border border-outline-variant/20 text-on-surface'} rounded-2xl px-4 py-2.5`}>
                    {!msg.isMe && <p className="text-[10px] font-bold text-primary mb-1">{msg.sender}</p>}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-white/60' : 'text-on-surface-variant'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 shrink-0">
              <input
                type="text"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-sm text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
              />
              <button onClick={sendMessage} className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0 active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-outline-variant/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-on-background">{confirmModal.action === 'remind' ? 'Send Reminder' : 'Remove Member'}</h3>
              <button onClick={() => setConfirmModal(null)} className="text-on-surface-variant hover:text-on-surface"><X size={20} /></button>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">
              {confirmModal.action === 'remind'
                ? `Send a payment reminder notification to ${confirmModal.member}?`
                : `Are you sure you want to remove ${confirmModal.member} from this group? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 bg-surface-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-variant/80 transition-colors">Cancel</button>
              <button onClick={handleConfirmAction} className={`flex-1 py-3 ${confirmModal.action === 'remind' ? 'bg-primary' : 'bg-error'} text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-colors`}>
                {confirmModal.action === 'remind' ? 'Send' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant/30 text-on-surface px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm font-medium animate-pulse">
          <CheckCircle2 size={16} className="text-primary" />
          {toast}
        </div>
      )}
    </div>
  );
}
