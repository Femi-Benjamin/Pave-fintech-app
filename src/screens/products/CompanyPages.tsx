import React from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import jonaExecPhoto from "../../assets/images/jona_israel_exec_1791565384913.jpg";
import chidinmaExecPhoto from "../../assets/images/chidinma_nwosu_exec_1791565400528.jpg";
import babajideExecPhoto from "../../assets/images/babajide_alabi_exec_1791565416324.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
  section?: "about" | "story" | "team";
}

export default function CompanyPages({
  onOpenApp,
  section = "about",
}: PageProps) {
  const leadership = [
    {
      name: "Timothy Uche",
      role: "Founder & Chief Executive Officer",
      bio: "Fintech architect passionate about financial inclusion, peer thrift technology, and automated escrow architectures across West Africa.",
      photo: jonaExecPhoto,
      tag: "Executive Leadership",
    },
    {
      name: "Chidinma Nwosu",
      role: "Head of Risk & Regulatory Compliance",
      bio: "12+ years seasoned Nigerian banking veteran specializing in Central Bank of Nigeria guidelines, consumer protection, and AML compliance.",
      photo: chidinmaExecPhoto,
      tag: "Risk & Governance",
    },
    {
      name: "Babajide Alabi",
      role: "Head of Cooperative Operations",
      bio: "Pioneer in digitizing grassroots cooperative societies and Alajo thrift networks across Lagos, Ibadan, and Kano commercial markets.",
      photo: babajideExecPhoto,
      tag: "Operations & Community",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Brand Mission Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-[#3730A3] dark:text-[#818CF8] text-xs font-bold border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
            <Building2 size={15} />
            <span>Licensed Financial Infrastructure</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Empowering Nigerians to Build Generational Wealth
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            PAVE was born to solve a fundamental truth: Africans have always
            built wealth together through trust circles, cooperatives, and
            thrift. We provided the cryptographic security, automated banking
            rails, and institutional compliance to guarantee that nobody ever
            loses their hard-earned money again.
          </p>
        </div>

        {/* Regulatory Trust Badges - Solid High-Contrast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-[#121426] rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-[#3730A3] dark:text-[#818CF8] flex items-center justify-center mb-5">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                CBN Regulatory Alignment
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Operating through fully licensed Microfinance Banks and payment
                switches compliant with Central Bank of Nigeria guidelines.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              <CheckCircle2 size={15} />
              <span>Verified Banking Tier</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121426] rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Lock size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                NDIC Insured Custody
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Every customer deposit is held in insured custody with partner
                deposit money institutions, protected up to ₦5,000,000 per user.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={15} />
              <span>Deposit Insurance Protected</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121426] rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Award size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                Bank-Grade Encryption
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                256-bit SSL encryption, tokenized cards, biometric
                authentication, and strict KYC verification prevent unauthorized
                access.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <CheckCircle2 size={15} />
              <span>ISO 27001 Security Standard</span>
            </div>
          </div>
        </div>

        {/* Executive Leadership Team with Photos */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The People Behind PAVE
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Our Executive Leadership Team
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-xl mx-auto">
              Combining decades of banking regulation, fintech engineering, and
              grassroots community wealth building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((l, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121426] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={l.photo}
                      alt={l.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-black/80 backdrop-blur-md text-slate-800 dark:text-white border border-black/10 dark:border-white/10 shadow-xs">
                        {l.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      {l.name}
                    </h3>
                    <div className="text-xs font-bold text-[#3730A3] dark:text-[#818CF8] mt-0.5 mb-3">
                      {l.role}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {l.bio}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Verified Leader
                  </span>
                  <span>PAVE Executive Board</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white dark:bg-[#121426] rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-md max-w-4xl mx-auto">
          <h3
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mb-3"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Ready to Build Financial Freedom with PAVE?
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto mb-6">
            Join thousands of Nigerian professionals, merchants, and families
            participating in trusted digital thrift circles and zero-fee instant
            banking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenApp("signup")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3730A3] hover:bg-[#312E81] text-white font-bold text-sm shadow-lg shadow-[#3730A3]/25 transition-all cursor-pointer"
            >
              Open Free Account
            </button>
            <button
              onClick={() => onOpenApp("login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In to Wallet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
