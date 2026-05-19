import React, { useState } from 'react';
import { ArrowLeft, Clock, Phone, Contact, ChevronRight, Check, X, CheckCircle2, Wifi } from 'lucide-react';
import { useLocalStore } from '../hooks/useLocalStore';

interface AirtimeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function AirtimeScreen({ onNavigate }: AirtimeScreenProps) {
  const { walletBalance, buyAirtime, airtimeTransactions } = useLocalStore();
  const [phone, setPhone] = useState('0803 123 4567');
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);
  const [activeTab, setActiveTab] = useState('airtime');
  const [selectedNetwork, setSelectedNetwork] = useState('1');
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [airtimeAmount, setAirtimeAmount] = useState('1000');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  const networks = [
    { id: '1', name: 'MTN', bg: 'bg-[#ffcc00]', textPrimary: 'MTN', textColor: 'text-[#004f71]' },
    { id: '2', name: 'Airtel', bg: 'bg-[#ff0000]', textPrimary: 'airtel', textColor: 'text-white' },
    { id: '3', name: 'Glo', bg: 'bg-[#00985f]', textPrimary: 'glo', textColor: 'text-white' },
    { id: '4', name: '9mobile', bg: 'bg-[#006600]', textPrimary: '9', textColor: 'text-white' }
  ];

  const amounts = [100, 200, 500, 1000, 2000];

  const dataPlans = [
    { id: '1', size: '1.5GB', validity: '30 Days', price: 1000 },
    { id: '2', size: '3.5GB', validity: '30 Days', price: 2000 },
    { id: '3', size: '10GB', validity: '30 Days', price: 5000 },
    { id: '4', size: '15GB', validity: '30 Days', price: 8000 },
  ];

  const selectedNetworkObj = networks.find(n => n.id === selectedNetwork)!;
  const currentAmount = activeTab === 'airtime'
    ? parseInt(airtimeAmount) || 0
    : (dataPlans.find(p => p.id === selectedPlan)?.price || 0);
  const selectedDataPlan = dataPlans.find(p => p.id === selectedPlan);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = () => {
    if (currentAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Please enter a phone number', 'error');
      return;
    }
    setShowConfirm(true);
  };

  const confirmPurchase = () => {
    const result = buyAirtime({
      type: activeTab as 'airtime' | 'data',
      network: selectedNetworkObj.name,
      phone: phone.replace(/\s/g, ''),
      amount: currentAmount,
      planSize: activeTab === 'data' ? selectedDataPlan?.size : undefined,
    });
    setShowConfirm(false);
    if (result.success) {
      setSuccessDetails({
        type: activeTab,
        network: selectedNetworkObj.name,
        phone: phone,
        amount: currentAmount,
        planSize: activeTab === 'data' ? selectedDataPlan?.size : undefined,
      });
      setShowSuccessModal(true);
    } else {
      showToast(result.message, 'error');
    }
  };

  // Recent transactions from store
  const recentTxs = airtimeTransactions.slice(0, 3);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-variant/80 rounded-full text-on-surface-variant transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold text-on-background">
            {activeTab === 'airtime' ? 'Buy Airtime' : 'Buy Data'}
          </h1>
        </div>
        <button onClick={() => onNavigate('airtime_history')} className="text-on-surface-variant hover:text-on-surface transition-colors p-2">
          <Clock size={22} />
        </button>
      </header>

      <div className="bg-surface rounded-2xl p-1.5 flex mb-6">
        <button
          onClick={() => setActiveTab('airtime')}
          className={`flex-1 py-2.5 ${activeTab === 'airtime' ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant hover:text-on-surface'} rounded-xl text-xs font-bold tracking-wide transition-colors`}
        >
          Airtime
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 ${activeTab === 'data' ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant hover:text-on-surface'} rounded-xl text-xs font-bold tracking-wide transition-colors`}
        >
          Data Bundle
        </button>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-4">Select Network</label>
          <div className="flex gap-4">
            {networks.map(net => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 ${net.id === selectedNetwork ? 'border-primary' : 'border-transparent'} relative overflow-hidden`}
              >
                <div className={`w-full h-full ${net.bg} flex items-center justify-center ${net.textColor}`}>
                  <span className={net.id === '4' ? 'font-black text-2xl' : 'text-[11px] font-black'}>{net.textPrimary}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
            <button className="text-xs font-medium text-primary hover:underline">Use My Number</button>
          </div>

          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone size={18} className="text-on-surface-variant" />
            </div>
            <input
              type="tel"
              maxLength={13}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-background border border-primary/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base text-on-surface tracking-wide"
            />
            <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors">
              <Contact size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-on-surface pb-6 border-b border-outline-variant/30">
            <Contact size={14} className="text-on-surface-variant" />
            John Doe
          </div>

          <div className="flex justify-between items-center pt-5">
            <div>
              <p className="text-sm font-medium text-on-surface">Save Beneficiary</p>
              <p className="text-xs text-on-surface-variant">Add to quick access</p>
            </div>
            <button
              onClick={() => setSaveBeneficiary(!saveBeneficiary)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${saveBeneficiary ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${saveBeneficiary ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'airtime' ? (
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Amount</label>
            <div className="bg-background border border-outline-variant/30 rounded-xl p-4 flex items-center mb-4">
              <span className="text-xl font-bold text-on-surface mr-2">₦</span>
              <input
                type="text"
                value={airtimeAmount}
                onChange={(e) => setAirtimeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-transparent focus:outline-none text-2xl font-bold text-on-surface"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {amounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAirtimeAmount(String(amt))}
                  className={`py-2 px-4 rounded-full border ${parseInt(airtimeAmount) === amt ? 'border-primary text-primary' : 'border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-outline-variant'} text-sm font-semibold transition-colors`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Select Plan</label>
            <div className="grid grid-cols-1 gap-3">
              {dataPlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-xl border ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline-variant'} flex justify-between items-center transition-colors`}
                >
                  <div className="text-left flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === plan.id ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                      <Wifi size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{plan.size}</p>
                      <p className="text-xs text-on-surface-variant">{plan.validity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">₦{plan.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface p-4 rounded-xl border border-outline-variant/20 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-background border border-outline-variant/30 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Main Wallet</h4>
            <p className="text-xs text-on-surface-variant">Balance: ₦{walletBalance.toLocaleString()}.00</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-on-surface-variant" />
      </div>

      <button
        onClick={handleBuy}
        className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 text-[15px]"
      >
        {activeTab === 'airtime'
          ? `Buy Airtime — ₦${(parseInt(airtimeAmount) || 0).toLocaleString()}`
          : `Buy Data — ₦${(selectedDataPlan?.price || 0).toLocaleString()}`
        }
      </button>

      {/* Recent Recipients */}
      <div className="pt-4">
        <h3 className="text-sm font-medium text-on-surface mb-4">Recent Recipients</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <button className="w-14 h-14 rounded-full border border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-variant transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
            <span className="text-xs font-medium text-on-surface">New</span>
          </div>
          {[
            { initials: 'JD', name: 'Mom', color: 'bg-surface-variant text-on-surface' },
            { initials: 'SA', name: 'Sarah', color: 'bg-[#d97706] text-white' },
            { initials: 'MK', name: 'Mike', color: 'bg-surface-variant text-on-surface' },
            { initials: 'EL', name: 'Emma', color: 'bg-surface-variant text-on-surface' },
          ].map((rec, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
              <button className={`w-14 h-14 rounded-full ${rec.color} flex items-center justify-center font-bold text-lg`}>
                {rec.initials}
              </button>
              <span className="text-xs font-medium text-on-surface">{rec.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History — from store */}
      <div className="pt-2 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-on-surface">Recent History</h3>
          <button onClick={() => onNavigate('airtime_history')} className="text-xs font-medium text-primary hover:underline">View All</button>
        </div>

        <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden">
          {recentTxs.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm">
              No transactions yet. Buy airtime or data to see history here.
            </div>
          ) : (
            recentTxs.map((tx, i) => (
              <div key={tx.id} className={`flex justify-between items-center p-4 ${i < recentTxs.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'success' ? 'bg-surface-variant text-primary' : 'bg-error-container text-on-error-container'}`}>
                    {tx.status === 'success' ? <Check size={18} /> : <X size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{tx.network} {tx.type === 'data' ? tx.planSize : 'Airtime'}</h4>
                    <p className="text-xs text-on-surface-variant">{tx.status === 'success' ? 'Success' : 'Failed'} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-on-surface">-₦{tx.amount.toLocaleString()}.00</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-outline-variant/20 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-on-background text-lg">Confirm Purchase</h3>
              <button onClick={() => setShowConfirm(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">Type</span>
                <span className="text-sm font-bold text-on-background capitalize">{activeTab}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">Network</span>
                <span className="text-sm font-bold text-on-background">{selectedNetworkObj.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">Phone</span>
                <span className="text-sm font-bold text-on-background">{phone}</span>
              </div>
              {activeTab === 'data' && selectedDataPlan && (
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm text-on-surface-variant">Plan</span>
                  <span className="text-sm font-bold text-on-background">{selectedDataPlan.size} / {selectedDataPlan.validity}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-on-surface-variant">Amount</span>
                <span className="text-lg font-bold text-primary">₦{currentAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3.5 bg-surface-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-variant/80 transition-colors">
                Cancel
              </button>
              <button onClick={confirmPurchase} className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-outline-variant/20 shadow-xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-bold text-on-background text-xl mb-1">Purchase Successful!</h3>
            <p className="text-sm text-on-surface-variant mb-6">Your {successDetails.type} purchase was successful.</p>

            <div className="space-y-3 mb-6 bg-background rounded-xl p-4 text-left">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Type</span>
                <span className="font-semibold text-on-surface capitalize">{successDetails.type}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Network</span>
                <span className="font-semibold text-on-surface">{successDetails.network}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Phone</span>
                <span className="font-semibold text-on-surface">{successDetails.phone}</span>
              </div>
              {successDetails.type === 'data' && successDetails.planSize && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Plan</span>
                  <span className="font-semibold text-on-surface">{successDetails.planSize}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm pt-2 border-t border-outline-variant/20">
                <span className="text-on-surface-variant font-medium">Amount</span>
                <span className="font-bold text-primary text-lg">₦{successDetails.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm font-medium ${toastType === 'success' ? 'bg-surface border border-outline-variant/30 text-on-surface' : 'bg-error-container text-on-error-container border border-error/30'}`}>
          <CheckCircle2 size={16} className={toastType === 'success' ? 'text-primary' : 'text-error'} />
          {toast}
        </div>
      )}
    </div>
  );
}
