import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Landmark,
  CreditCard as IdCard,
  Smile,
} from "lucide-react";
import Logo from './Logo';

interface KYCScreenProps {
  onNavigate: (screen: string) => void;
}

export default function KYCScreen({ onNavigate }: KYCScreenProps) {
  const [step, setStep] = useState(1);
  const [bvn, setBvn] = useState("22233344455");
  const [nin, setNin] = useState("");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onNavigate("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center pt-8">
      <header className="mb-8 flex flex-col items-center w-full max-w-md">
        <Logo size="md" onClick={() => onNavigate('dashboard')} className="mb-8" />

        <div className="w-full flex items-end justify-between font-medium text-sm mb-2 text-on-surface">
          <span>Step {step} of 3</span>
          <span className="text-primary">
            {step === 1 && "BVN Verification"}
            {step === 2 && "NIN Verification"}
            {step === 3 && "Liveness Check"}
          </span>
        </div>
        <div className="flex gap-1.5 w-full h-1">
          <div className={`flex-1 ${step >= 1 ? 'bg-primary' : 'bg-surface-variant'} rounded-full`}></div>
          <div className={`flex-1 ${step >= 2 ? 'bg-primary' : 'bg-surface-variant'} rounded-full`}></div>
          <div className={`flex-1 ${step >= 3 ? 'bg-primary' : 'bg-surface-variant'} rounded-full`}></div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col flex-1"
      >
        <div className="mb-6">
          <h1 className="text-4xl font-display font-bold text-on-background mb-3 tracking-tight">
            {step === 1 && "Verify your BVN"}
            {step === 2 && "Verify your NIN"}
            {step === 3 && "Take a Selfie"}
          </h1>
          <p className="text-on-surface-variant font-normal text-lg">
            {step === 1 && "Provide your Bank Verification Number to verify your identity."}
            {step === 2 && "Provide your National Identity Number for additional verification."}
            {step === 3 && "Position your face in the frame to complete the liveness check."}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface tracking-widest uppercase">
                  Bank Verification Number (BVN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Landmark size={18} className="text-on-surface-variant" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background"
                    placeholder="00000000000"
                  />
                </div>
                {bvn.length === 11 && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary mt-1.5">
                    <CheckCircle2 size={14} />
                    Valid BVN format
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface tracking-widest uppercase">
                  National Identity Number (NIN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IdCard size={18} className="text-on-surface-variant" />
                  </div>
                  <input
                    type="text"
                    maxLength={11}
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-background placeholder:text-on-surface-variant/60"
                    placeholder="e.g. 11122233344"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-surface-variant border-2 border-dashed border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant">
                  <Smile size={40} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-on-surface mb-1">
                    Ready for your scan?
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Make sure you are in a well-lit room.
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl font-semibold text-sm transition-colors w-full"
                >
                  Start Facial Scan
                </button>
              </div>
            )}

            <div className="bg-surface border border-outline-variant/30 rounded-xl p-3 flex items-start gap-3 mt-6">
              <Lock
                size={16}
                className="text-on-surface-variant shrink-0 mt-0.5"
              />
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                Your data is encrypted and securely stored. We never share your
                personal information with third parties.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {step === 3 ? "Complete Verification" : "Continue Verification"} <ArrowRight size={18} />
            </button>

            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-full text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Go Back
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="w-full text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors pt-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
