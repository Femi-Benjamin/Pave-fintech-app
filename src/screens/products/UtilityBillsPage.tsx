import React, { useState } from "react";
import {
  Zap,
  Tv,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Smartphone,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  HelpCircle,
  Download,
} from "lucide-react";
import billsHeroImg from "../../assets/images/bills_utilities_hero_1791561186311.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function UtilityBillsPage({ onOpenApp }: PageProps) {
  const [billType, setBillType] = useState<"electricity" | "cable">("electricity");
  const [selectedDisco, setSelectedDisco] = useState("IKEDC");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");
  const [meterNumber, setMeterNumber] = useState("01428392011");
  const [amount, setAmount] = useState(5000);
  const [copiedToken, setCopiedToken] = useState(false);
  const [simulatedTokenReady, setSimulatedTokenReady] = useState(false);

  // Cable TV state
  const [cableProvider, setCableProvider] = useState<"dstv" | "gotv" | "startimes">("dstv");
  const [smartcard, setSmartcard] = useState("1029384756");
  const [cablePackage, setCablePackage] = useState("DStv Compact (₦15,700/mo)");

  const sampleToken = "4321-8765-9101-1094-7781";
  const estimatedUnits = (amount / 68).toFixed(1); // Approximate tariff kWh

  const handleCopy = () => {
    navigator.clipboard?.writeText(sampleToken.replace(/-/g, ""));
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSimulateToken = () => {
    setSimulatedTokenReady(true);
    setTimeout(() => setSimulatedTokenReady(false), 6000);
  };

  const discos = [
    { id: "IKEDC", name: "Ikeja Electric (IKEDC)", loc: "Lagos Mainland" },
    { id: "EKEDC", name: "Eko Electric (EKEDC)", loc: "Lagos Island & Lekki" },
    { id: "AEDC", name: "Abuja DISCO (AEDC)", loc: "FCT, Niger, Kogi" },
  ];

  const faqs = [
    {
      q: "How fast do I receive my 20-digit electricity prepaid token?",
      a: "Instantly on your screen within 2 to 4 seconds of payment confirmation. We also send a free instant SMS containing the token and save it permanently in your transaction history.",
    },
    {
      q: "Does PAVE charge extra convenience fees on power or TV bills?",
      a: "₦0.00! Unlike many platforms and agents that slap on ₦100 to ₦200 convenience charges, PAVE bill payments carry zero extra service charges.",
    },
    {
      q: "What happens if my token says 'Reject' or 'Error' on the meter?",
      a: "Ensure your keypad has power and battery. If the meter is still unkeyed, PAVE customer support operates a 24/7 dedicated escalation channel directly integrated with DISCO technical backends to resolve Key Change Tokens (KCT).",
    },
    {
      q: "Can I set automated monthly renewal for my DStv or GOtv package?",
      a: "Yes! You can enable Auto-Renew to charge your PAVE wallet 24 hours before expiration so your family never misses live matches or favorite telenovelas.",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-[#E11D48] dark:text-[#FB7185] text-xs font-bold w-fit border border-rose-200 dark:border-rose-800/60 shadow-xs">
              <Zap size={14} />
              <span>Instant Electricity Tokens & Cable TV</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Pay Utility Bills in 10 Seconds Without Power Outages
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Generate 20-digit prepaid electricity tokens instantly on your screen, 
              renew your DStv and GOtv packages before kickoff, and manage recurring 
              household utility payments with zero extra convenience charges.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm shadow-lg shadow-[#E11D48]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Generate Prepaid Token</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/70 dark:bg-transparent"
              >
                Sign In to Pay Bills
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-rose-600 dark:text-rose-400" />
                <span>Zero Convenience Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <span>Instant 20-Digit STS Token</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>All 11 Discos Supported</span>
              </div>
            </div>
          </div>

          {/* Hero Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10">
              <img
                src={billsHeroImg}
                alt="Nigerian family living room enjoying illuminated home and TV after instant PAVE token recharge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  Prepaid Power Active
                </div>
                <div className="text-xl font-bold">Token: 4321-8765-9101-1094-7781</div>
                <div className="text-xs text-white/90">73.5 kWh Units Added · Ikeja Electric Meter Validated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive STS Bill Payment Engine */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48] dark:text-[#FB7185]">
              Real-Time STS Bill Engine
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Test Instant Power Token & Cable TV Activation
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              Select your electricity distribution company or TV bouquet and simulate real-time token delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Utility Category
                </label>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => setBillType("electricity")}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      billType === "electricity"
                        ? "bg-white dark:bg-[#1A1D36] text-[#E11D48] dark:text-[#FB7185] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Zap size={14} /> Electricity (Prepaid/Postpaid)
                  </button>
                  <button
                    onClick={() => setBillType("cable")}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      billType === "cable"
                        ? "bg-white dark:bg-[#1A1D36] text-[#E11D48] dark:text-[#FB7185] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Tv size={14} /> Cable TV (DStv/GOtv)
                  </button>
                </div>
              </div>

              {billType === "electricity" ? (
                <>
                  {/* Disco Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Electricity Distribution Company (DISCO)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {discos.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedDisco(d.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedDisco === d.id
                              ? "bg-rose-50 dark:bg-rose-950/70 border-[#E11D48] ring-2 ring-[#E11D48]/20 shadow-xs"
                              : "bg-white dark:bg-[#181B34] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="text-sm font-bold text-slate-950 dark:text-white">
                            {d.id}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {d.loc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meter Number with Live Verification Badge */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      11-Digit Meter / Account Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        placeholder="01428392011"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-[#E11D48]"
                      />
                      <div className="absolute right-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={13} />
                        <span>MALLAM SANUSI (IKEDC Verified)</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Presets */}
                  <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Purchase Amount
                      </label>
                      <span className="text-base font-extrabold text-[#E11D48] dark:text-[#FB7185]">
                        ₦{amount.toLocaleString()} (~{estimatedUnits} kWh)
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[2000, 5000, 10000, 20000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            amount === amt
                              ? "bg-[#E11D48] text-white border-[#E11D48]"
                              : "bg-white dark:bg-[#121426] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full accent-[#E11D48] cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                      <span>₦1,000</span>
                      <span>₦25,000</span>
                      <span>₦50,000</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Cable TV Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Cable TV Provider
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "dstv", name: "DStv Nigeria" },
                        { id: "gotv", name: "GOtv Nigeria" },
                        { id: "startimes", name: "StarTimes" },
                      ].map((cp) => (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setCableProvider(cp.id as any)}
                          className={`p-3.5 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
                            cableProvider === cp.id
                              ? "bg-rose-50 dark:bg-rose-950/70 border-[#E11D48] text-[#E11D48] ring-2 ring-[#E11D48]/20 shadow-xs"
                              : "bg-white dark:bg-[#181B34] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {cp.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Smartcard / IUC Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={smartcard}
                        onChange={(e) => setSmartcard(e.target.value)}
                        placeholder="1029384756"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-[#E11D48]"
                      />
                      <div className="absolute right-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={13} />
                        <span>CHIDINMA N. (IUC Verified)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Select Package Bouquet
                    </label>
                    <select
                      value={cablePackage}
                      onChange={(e) => setCablePackage(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-hidden focus:border-[#E11D48]"
                    >
                      <option>DStv Premium (₦37,000/mo)</option>
                      <option>DStv Compact Plus (₦25,000/mo)</option>
                      <option>DStv Compact (₦15,700/mo)</option>
                      <option>DStv Confam (₦9,300/mo)</option>
                      <option>GOtv Supa Plus (₦15,700/mo)</option>
                      <option>GOtv Max (₦7,200/mo)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Checkout Preview & Generated Token Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#181B34] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Bill Settlement Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                    Live DISCO Gateway
                  </span>
                </div>

                <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-white/10 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Billed Customer:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {billType === "electricity" ? "MALLAM SANUSI" : "CHIDINMA N."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Provider:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {billType === "electricity" ? `${selectedDisco} Electricity` : cablePackage.split(" (")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Identifier:</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-white">
                      {billType === "electricity" ? meterNumber : smartcard}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Service Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₦0.00 (Zero Fee)
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10">
                    <span className="text-base font-bold text-slate-950 dark:text-white">Total Charge:</span>
                    <span className="text-xl font-black text-slate-950 dark:text-white">
                      ₦{amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Simulated Token Display */}
                {simulatedTokenReady ? (
                  <div className="mt-5 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 animate-in fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Prepaid Meter Token Generated!
                      </span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        Units: {estimatedUnits} kWh
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-black/30 rounded-xl p-3 border border-emerald-300 dark:border-emerald-700/60 mb-2">
                      <span className="font-mono text-base sm:text-lg font-black tracking-wider text-slate-950 dark:text-white">
                        {sampleToken}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-emerald-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-emerald-800 dark:text-emerald-200"
                        title="Copy Token"
                      >
                        {copiedToken ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Type this 20-digit token into your CIU meter keypad and press Enter. SMS also dispatched.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#E11D48] shrink-0" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSimulateToken}
                  className="w-full py-3.5 px-6 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Generate Token (Simulate)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp("signup")}
                  className="w-full py-3 px-6 rounded-full bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-100 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Pay Live Utility Bills
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Utility Billing Answers
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Frequently Asked Bills Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#121426] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
