import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Hash,
  Upload,
  Camera,
  AlertCircle,
  Loader,
} from "lucide-react";
import { PaveBtn, Input, Badge, Avatar } from "../components/UI";
import { Screen } from "../pave-data";

export function KYCContainer({
  title,
  subtitle,
  step,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: number;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const steps = [
    { num: 1, label: "Overview" },
    { num: 2, label: "NIN" },
    { num: 3, label: "ID Type" },
    { num: 4, label: "Upload & Selfie" },
    { num: 5, label: "Status" },
  ];

  return (
    <div
      className="flex-1 w-full min-h-screen flex items-start justify-center overflow-x-hidden p-3 sm:items-center sm:p-6 md:p-10"
      style={{ background: "#F7F8FF" }}
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-[#F1F3FB] p-5 sm:p-10 flex flex-col min-h-0 sm:min-h-135">
        <div className="flex items-center justify-between pb-6 border-b border-[#F1F3FB] mb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer hover:bg-[#EEF2FF] transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="text-center">
              <h2
                className="text-xl sm:text-2xl font-bold text-[#0D0F1C]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {step && (
            <div className="hidden sm:flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.num ? "bg-[#3730A3] text-white" : "bg-[#F1F3FB] text-[#9CA3AF]"}`}
                  >
                    {step > s.num ? <Check size={14} /> : s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-1 transition-colors ${step > s.num ? "bg-[#3730A3]" : "bg-[#E5E7EB]"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">{children}</div>
      </div>
    </div>
  );
}

export function KYCWelcomeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <KYCContainer
      title="Verify Your Identity"
      subtitle="Complete your verification to unlock unrestricted withdrawals and group thrifts."
      step={1}
    >
      <div className="flex flex-col items-center justify-center text-center py-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-sm"
          style={{ background: "linear-gradient(135deg, #EEF2FF, #C7D2FE)" }}
        >
          🔐
        </div>
        <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
          We need to verify your identity to protect your funds and comply with
          Central Bank of Nigeria regulations. This takes about 3 minutes.
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          {[
            ["NIN Verification", "Your 11-digit National ID Number", "🪪"],
            ["ID Document", "Upload a valid government ID", "📄"],
            ["Selfie Check", "Quick selfie for facial match", "🤳"],
          ].map(([t, d, ic]) => (
            <div
              key={t}
              className="bg-[#F1F3FB] rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-transparent hover:border-[#3730A3]/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs">
                {ic}
              </div>
              <div>
                <div className="text-sm font-bold text-[#0D0F1C]">{t}</div>
                <div className="text-xs text-[#6B7280] mt-1">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#F1F3FB]">
        <div className="flex-1">
          <PaveBtn onClick={() => onNav("kyc-nin")}>Start Verification</PaveBtn>
        </div>
        <div className="sm:w-auto">
          <PaveBtn variant="ghost" onClick={() => onNav("home")}>
            Skip for now
          </PaveBtn>
        </div>
      </div>
    </KYCContainer>
  );
}

export function KYCNINScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const doVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNav("kyc-id-type");
    }, 2000);
  };
  return (
    <KYCContainer
      title="NIN Verification"
      subtitle="Step 1 of 3: Enter your National Identity Number"
      step={2}
      onBack={() => onNav("kyc-welcome")}
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-3 bg-[#EEF2FF] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">1/3</span>
          </div>
          <p className="text-sm text-[#374151]">
            Enter your 11-digit National Identification Number (NIN) issued by
            NIMC.
          </p>
        </div>

        <Input
          label="11-digit NIN"
          placeholder="e.g. 12345678901"
          value={nin}
          onChange={setNin}
          icon={<Hash size={16} />}
        />

        <div className="bg-[#FFFBEB] rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-xs text-[#92400E]">
            Your NIN is securely encrypted and will only be used for official
            identity verification purposes.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3FB]">
        <PaveBtn onClick={doVerify} disabled={nin.length !== 11 || loading}>
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Verifying NIN...
            </>
          ) : (
            "Verify NIN & Continue"
          )}
        </PaveBtn>
      </div>
    </KYCContainer>
  );
}

export function KYCIDTypeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selected, setSelected] = useState("");
  const types = [
    { id: "nin_card", label: "NIN Slip / Card", icon: "🪪" },
    { id: "pvc", label: "Voter's Card (PVC)", icon: "🗳️" },
    { id: "passport", label: "International Passport", icon: "📘" },
    { id: "drivers", label: "Driver's License", icon: "🚗" },
  ];
  return (
    <KYCContainer
      title="Select ID Document Type"
      subtitle="Step 2 of 3: Choose which government-issued ID you'll upload"
      step={3}
      onBack={() => onNav("kyc-nin")}
    >
      <div className="py-4">
        <div className="flex items-center gap-3 bg-[#EEF2FF] rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">2/3</span>
          </div>
          <p className="text-sm text-[#374151]">
            Ensure the ID is valid and not expired.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${selected === t.id ? "border-[#3730A3] bg-[#EEF2FF]/60 shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">{t.icon}</span>
                <span className="font-semibold text-sm text-[#0D0F1C]">
                  {t.label}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === t.id ? "border-[#3730A3] bg-[#3730A3]" : "border-[#D1D5DB]"}`}
              >
                {selected === t.id && (
                  <Check size={12} className="text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3FB]">
        <PaveBtn onClick={() => onNav("kyc-id-upload")} disabled={!selected}>
          Continue to Document Upload
        </PaveBtn>
      </div>
    </KYCContainer>
  );
}

export function KYCIDUploadScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  return (
    <KYCContainer
      title="Upload ID Document"
      subtitle="Step 2 of 3: Provide clear photos of both sides"
      step={4}
      onBack={() => onNav("kyc-id-type")}
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex items-center gap-3 bg-[#EEF2FF] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">2/3</span>
          </div>
          <p className="text-sm text-[#374151]">
            Upload clear photos of both the front and back of your selected
            document.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Front Side", front, () => setFront(true)],
            ["Back Side", back, () => setBack(true)],
          ].map(([label, done, action]: any) => (
            <button
              key={label}
              onClick={action}
              className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${done ? "border-[#059669] bg-[#ECFDF5]" : "border-[#D1D5DB] bg-[#F9FAFB] hover:bg-[#F1F3FB]"}`}
            >
              {done ? (
                <>
                  <CheckCircle size={36} className="text-[#059669]" />
                  <span className="text-sm font-semibold text-[#059669]">
                    {label} uploaded ✓
                  </span>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-[#9CA3AF]" />
                  <span className="text-sm font-semibold text-[#374151]">
                    Upload {label}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    JPG, PNG up to 5MB
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        <div className="bg-[#FFFBEB] rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-xs text-[#92400E]">
            Ensure the document is well-lit, not blurry, and all text and photo
            details are clearly visible.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3FB]">
        <PaveBtn onClick={() => onNav("kyc-selfie")} disabled={!front || !back}>
          Continue to Selfie Verification
        </PaveBtn>
      </div>
    </KYCContainer>
  );
}

export function KYCSelfieScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [taken, setTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const doSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNav("kyc-pending");
    }, 2500);
  };
  return (
    <KYCContainer
      title="Selfie Verification"
      subtitle="Step 3 of 3: Take a quick selfie for facial recognition"
      step={4}
      onBack={() => onNav("kyc-id-upload")}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 py-4">
        <div
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-dashed flex items-center justify-center relative overflow-hidden shrink-0"
          style={{
            borderColor: taken ? "#059669" : "#D1D5DB",
            background: taken ? "#ECFDF5" : "#F9FAFB",
          }}
        >
          {taken ? (
            <CheckCircle size={64} className="text-[#059669]" />
          ) : (
            <Camera size={48} className="text-[#9CA3AF]" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-3 w-full">
          <h3
            className="font-semibold text-sm text-[#0D0F1C]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Tips for a successful selfie:
          </h3>
          {[
            "Remove sunglasses, hats, or masks",
            "Face the camera directly in a well-lit area",
            "Keep a neutral expression",
          ].map((tip) => (
            <div
              key={tip}
              className="flex items-center gap-2.5 text-xs sm:text-sm text-[#6B7280]"
            >
              <Check size={14} className="text-[#059669] shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
          <div className="pt-4">
            {!taken ? (
              <PaveBtn onClick={() => setTaken(true)} variant="outline">
                <Camera size={18} />
                Take Live Selfie
              </PaveBtn>
            ) : (
              <PaveBtn variant="ghost" onClick={() => setTaken(false)}>
                Retake Selfie
              </PaveBtn>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3FB]">
        <PaveBtn onClick={doSubmit} disabled={!taken || loading}>
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Submitting KYC Documents...
            </>
          ) : (
            "Submit for Verification"
          )}
        </PaveBtn>
      </div>
    </KYCContainer>
  );
}

export function KYCPendingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <KYCContainer
      title="Documents Under Review"
      subtitle="Your verification has been submitted successfully"
      step={5}
    >
      <div className="flex flex-col items-center justify-center text-center py-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-6xl mb-4"
        >
          ⏳
        </motion.div>
        <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
          Your KYC documents are currently being processed by our compliance
          team. Review usually completes within 1–24 hours.
        </p>

        <div className="w-full max-w-md bg-[#F1F3FB] rounded-2xl p-5 flex flex-col gap-3.5 my-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">NIN Verification</span>
            <Badge color="green">Done</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">ID Upload</span>
            <Badge color="green">Done</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Selfie Check</span>
            <Badge color="green">Done</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Admin Review</span>
            <Badge color="gold">In Progress</Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#F1F3FB]">
        <div className="flex-1">
          <PaveBtn onClick={() => onNav("home")}>Go to Dashboard</PaveBtn>
        </div>
        <div className="sm:w-auto">
          <PaveBtn variant="ghost" onClick={() => onNav("kyc-approved")}>
            Preview Approved State
          </PaveBtn>
        </div>
      </div>
    </KYCContainer>
  );
}

export function KYCApprovedScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <KYCContainer
      title="Account Verified! 🎉"
      subtitle="You now have full access to all PAVE features"
      step={5}
    >
      <div className="flex flex-col items-center justify-center text-center py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
            <CheckCircle size={56} className="text-[#059669]" />
          </div>
        </motion.div>

        <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
          Your identity has been verified. You can now participate in community
          thrift rounds, request marketplace installment plans, and withdraw
          without limits.
        </p>

        <div className="w-full max-w-md bg-[#F1F3FB] rounded-2xl p-5 my-6 border border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            <Avatar name="Joe " size={48} color="#3730A3" />
            <div className="text-left">
              <div className="font-semibold text-[#0D0F1C]">Joe Adeyemi</div>
              <div className="text-xs text-[#6B7280]">
                joe@email.com • Member ID: PAV-20240614
              </div>
              <div className="mt-1">
                <Badge color="green">KYC Verified</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3FB]">
        <PaveBtn onClick={() => onNav("home")} variant="green">
          Start Using PAVE Dashboard
        </PaveBtn>
      </div>
    </KYCContainer>
  );
}
