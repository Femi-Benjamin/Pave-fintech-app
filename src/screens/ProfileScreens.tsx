import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Camera,
  User,
  Shield,
  Landmark,
  Bell,
  Lock,
  HelpCircle,
  BookOpen,
  ChevronRight,
  X,
  CheckCircle2,
  FileText,
  Mail,
  ShieldCheck,
  LogOut,
  Loader,
} from "lucide-react";
import { Avatar, Badge, Input, PaveBtn, ScreenHeader } from "../components/UI";
import { Screen } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { ProfileScreenSkeleton } from "../components/Skeleton";
import { getApiErrorMessage } from "../api/auth";
import {
  useDeleteUserAccountMutation,
  useProfileQuery,
  useSavingsQuery,
  useUpdateProfileMutation,
  useUserAccountDetailsQuery,
  useUploadUserImageMutation,
  useVerifyMfaTokenMutation,
  useVerifySecurityAnswerMutation,
} from "../hooks/usePaveApi";
import type { UpdateProfilePayload } from "../api/auth";

type ProfilePanel =
  | "personal"
  | "kyc"
  | "bank"
  | "notifications"
  | "security"
  | "help"
  | "terms";

export function ProfileScreen({
  onNav,
  onBackToWebsite,
}: {
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const { products, authUser, setAuthUser, logout } = useLocalStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const uploadImageMutation = useUploadUserImageMutation();
  const email = authUser?.email?.trim() || "";
  const profileQuery = useProfileQuery(
    email,
    Boolean(localStorage.getItem("pave_token")),
  );
  const updateProfileMutation = useUpdateProfileMutation(email);
  const accountDetailsQuery = useUserAccountDetailsQuery(false);
  const savingsQuery = useSavingsQuery(
    Boolean(localStorage.getItem("pave_token")),
  );
  const [activePanel, setActivePanel] = useState<ProfilePanel | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem("pave_notifications_enabled") !== "false",
  );
  const [biometricEnabled, setBiometricEnabled] = useState(
    () => localStorage.getItem("pave_biometric_enabled") === "true",
  );
  const [savingsRemindersEnabled, setSavingsRemindersEnabled] = useState(
    () => localStorage.getItem("pave_savings_reminders_enabled") !== "false",
  );
  const [openHelpTopic, setOpenHelpTopic] = useState<number | null>(null);
  const [openLegalTopic, setOpenLegalTopic] = useState<number | null>(null);
  const [profileForm, setProfileForm] = useState<UpdateProfilePayload>({
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const profileUser = profileQuery.data?.user ?? authUser;

  const payingProductsCount = products.filter((p) => p.paid > 0).length;
  const fullName =
    [profileUser?.firstName, profileUser?.lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ") ||
    profileUser?.fullName?.trim() ||
    "PAVE Member";
  const profileEmail =
    profileUser?.email?.trim() || email || "Email not available";
  const kycStatus = profileUser?.kycStatus?.toLowerCase();
  const isKycVerified = kycStatus
    ? kycStatus === "approved" || kycStatus === "verified"
    : (profileUser?.isKycVerified ?? profileUser?.isVerified ?? false);
  const verificationLabel = kycStatus
    ? `KYC ${kycStatus.charAt(0).toUpperCase()}${kycStatus.slice(1)}`
    : isKycVerified
      ? "KYC Verified"
      : "KYC Pending";

  useEffect(() => {
    if (!activePanel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePanel(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePanel]);

  if (profileQuery.isLoading && !authUser) {
    return <ProfileScreenSkeleton />;
  }

  const openProfileEditor = () => {
    setProfileSuccess("");
    setProfileForm({
      phoneNumber:
        typeof profileUser?.phoneNumber === "string"
          ? profileUser.phoneNumber
          : "",
      address:
        typeof profileUser?.address === "string" ? profileUser.address : "",
      city: typeof profileUser?.city === "string" ? profileUser.city : "",
      state: typeof profileUser?.state === "string" ? profileUser.state : "",
    });
    setActivePanel("personal");
  };

  const saveProfile = () => {
    setProfileSuccess("");
    updateProfileMutation.mutate(profileForm, {
      onSuccess: (response) => {
        const updatedUser = response.user ?? {
          ...profileUser,
          ...profileForm,
        };
        setAuthUser(updatedUser);
        setProfileSuccess(response.message || "Profile updated successfully.");
        setActivePanel(null);
      },
    });
  };

  const panelTitles: Record<ProfilePanel, string> = {
    personal: "Personal Information",
    kyc: "KYC & Verification",
    bank: "Bank Accounts",
    notifications: "Notifications",
    security: "Security & Password",
    help: "Help & Support",
    terms: "Terms & Privacy",
  };
  const panelDescriptions: Record<ProfilePanel, string> = {
    personal: "Review and update your contact details",
    kyc: "Check your identity verification status",
    bank: "View account details for transfers",
    notifications: "Choose which reminders you receive",
    security: "Manage sign-in protections",
    help: "Answers and guidance for using PAVE",
    terms: "Important information about PAVE services",
  };
  const helpTopics = [
    {
      question: "How do I fund my PAVE wallet?",
      answer:
        "Open Wallet and choose Fund Wallet to see the funding methods available to your account.",
    },
    {
      question: "How do savings goals work?",
      answer:
        "Create a savings goal, choose an amount and schedule, then follow your progress from the Savings screen.",
    },
    {
      question: "How does an Ajo / Esusu circle work?",
      answer:
        "Members contribute on the schedule set for their circle. Review the circle details and payout order before joining.",
    },
    {
      question: "Where can I get help with my account?",
      answer:
        "For account-specific help, contact PAVE through the official support channel provided with your account. Never share your password or verification codes.",
    },
  ];
  const legalTopics = [
    {
      title: "Using your account",
      description:
        "Keep your account details accurate and protect your sign-in credentials. PAVE features are available according to your account status and the terms shown for each service.",
    },
    {
      title: "Savings and thrift",
      description:
        "Review the amount, schedule, lock period, fees, and payout rules shown for a savings plan or thrift circle before confirming participation.",
    },
    {
      title: "Your information",
      description:
        "PAVE uses account and verification information to provide wallet, savings, security, and support features. Share only information requested through official in-app flows.",
    },
    {
      title: "Security and privacy",
      description:
        "Use a unique password, keep verification codes private, and contact official support if you notice activity you do not recognize.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
        }}
        className="px-6 pt-14 pb-8 flex flex-col items-center"
      >
        <div className="relative mb-4">
          <Avatar name={fullName} size={80} color="#6366F1" />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) uploadImageMutation.mutate(file);
              event.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            aria-label="Upload profile image"
            disabled={uploadImageMutation.isPending}
            onClick={() => imageInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50"
          >
            <Camera size={12} className="text-[#3730A3]" />
          </button>
        </div>
        {uploadImageMutation.isPending && (
          <p className="text-white/80 text-xs mb-2" role="status">
            Uploading profile image...
          </p>
        )}
        {uploadImageMutation.isSuccess && (
          <p className="text-white/80 text-xs mb-2" role="status">
            Profile image uploaded.
          </p>
        )}
        {uploadImageMutation.isError && (
          <p className="text-red-200 text-xs mb-2" role="alert">
            {getApiErrorMessage(
              uploadImageMutation.error,
              "Unable to upload your profile image.",
            )}
          </p>
        )}
        <h2
          className="text-white"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {fullName}
        </h2>
        <p className="text-white/70 text-sm">{profileEmail}</p>
        {profileQuery.isError && (
          <p role="alert" className="mt-2 text-center text-xs text-red-200">
            Profile refresh failed:{" "}
            {getApiErrorMessage(
              profileQuery.error,
              "Unable to load your latest profile.",
            )}
          </p>
        )}
        {profileSuccess && (
          <p role="status" className="mt-2 text-center text-xs text-green-200">
            {profileSuccess}
          </p>
        )}
        <div className="mt-3">
          <Badge color={isKycVerified ? "green" : "gold"}>
            {verificationLabel}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          {[
            [
              "Goals",
              savingsQuery.isLoading
                ? "..."
                : String(savingsQuery.data?.data.savings.length ?? 0),
            ],
            ["Products", String(payingProductsCount || 1)],
          ].map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-white font-bold text-xl">{v}</div>
              <div className="text-white/60 text-xs">{k}</div>
            </div>
          ))}
        </div>
        {savingsQuery.isError && (
          <p role="alert" className="mt-3 text-center text-xs text-red-200">
            {getApiErrorMessage(
              savingsQuery.error,
              "Unable to load your savings summary.",
            )}
          </p>
        )}
      </div>

      <div className="px-6 py-5 flex flex-col gap-2">
        {[
          {
            icon: <User size={18} />,
            label: "Personal Information",
            color: "#3730A3",
            bg: "#EEF2FF",
            panel: "personal" as const,
          },
          {
            icon: <Shield size={18} />,
            label: "KYC & Verification",
            color: "#059669",
            bg: "#ECFDF5",
            panel: "kyc" as const,
          },
          {
            icon: <Landmark size={18} />,
            label: "Bank Accounts",
            color: "#D97706",
            bg: "#FFFBEB",
            panel: "bank" as const,
          },
          {
            icon: <Bell size={18} />,
            label: "Notifications",
            color: "#7C3AED",
            bg: "#F5F3FF",
            panel: "notifications" as const,
          },
          {
            icon: <Lock size={18} />,
            label: "Security & Password",
            color: "#0891B2",
            bg: "#ECFEFF",
            panel: "security" as const,
          },
          {
            icon: <HelpCircle size={18} />,
            label: "Help & Support",
            color: "#374151",
            bg: "#F3F4F6",
            panel: "help" as const,
          },
          {
            icon: <BookOpen size={18} />,
            label: "Terms & Privacy",
            color: "#374151",
            bg: "#F3F4F6",
            panel: "terms" as const,
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.panel === "personal") {
                openProfileEditor();
              } else {
                setActivePanel(item.panel);
                setOpenHelpTopic(null);
                setOpenLegalTopic(null);
                if (item.panel === "bank") void accountDetailsQuery.refetch();
              }
            }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#F1F3FB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <span className="flex-1 text-left text-sm font-medium text-[#0D0F1C]">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-[#D1D5DB]" />
          </button>
        ))}
        <button
          onClick={() => {
            logout();
            if (onBackToWebsite) onBackToWebsite();
            else onNav("login");
          }}
          className="flex items-center gap-4 p-4 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5] mt-2 hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <LogOut size={18} className="text-[#DC2626]" />
          </div>
          <span className="text-sm font-medium text-[#DC2626]">Sign Out</span>
        </button>
        <div className="h-4" />
      </div>
      <AnimatePresence>
        {activePanel && (
          <motion.div
            className="fixed inset-0 z-`100` flex justify-end bg-slate-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActivePanel(null);
            }}
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-panel-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.24 }}
              className="flex h-full w-full max-w-xl flex-col bg-[#F7F8FF] shadow-2xl"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-[#E8EAF4] bg-white px-5 py-4 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#3730A3]">
                    {activePanel === "personal" && <User size={19} />}
                    {activePanel === "kyc" && <ShieldCheck size={19} />}
                    {activePanel === "bank" && <Landmark size={19} />}
                    {activePanel === "notifications" && <Bell size={19} />}
                    {activePanel === "security" && <Lock size={19} />}
                    {activePanel === "help" && <HelpCircle size={19} />}
                    {activePanel === "terms" && <FileText size={19} />}
                  </div>
                  <div className="min-w-0">
                    <h2
                      id="profile-panel-title"
                      className="truncate text-base font-bold text-[#0D0F1C] sm:text-lg"
                      style={{ fontFamily: "var(--font-family-display)" }}
                    >
                      {panelTitles[activePanel]}
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      {panelDescriptions[activePanel]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close panel"
                  onClick={() => setActivePanel(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F3FB] text-[#374151] transition-colors hover:bg-[#E7E9F4]"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
                {activePanel === "personal" && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                        Account details
                      </p>
                      <p className="mt-2 font-semibold text-[#0D0F1C]">
                        {fullName}
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        {profileEmail}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <h3 className="mb-4 text-sm font-bold text-[#0D0F1C]">
                        Contact information
                      </h3>
                      <div className="flex flex-col gap-4">
                        {(
                          [
                            ["phoneNumber", "Phone number"],
                            ["address", "Address"],
                            ["city", "City"],
                            ["state", "State"],
                          ] as const
                        ).map(([field, label]) => (
                          <Input
                            key={field}
                            label={label}
                            value={profileForm[field]}
                            onChange={(value: string) =>
                              setProfileForm((previous) => ({
                                ...previous,
                                [field]: value,
                              }))
                            }
                            placeholder={label}
                          />
                        ))}
                      </div>
                      {updateProfileMutation.isError && (
                        <p role="alert" className="mt-3 text-sm text-red-600">
                          {getApiErrorMessage(
                            updateProfileMutation.error,
                            "Unable to update your profile.",
                          )}
                        </p>
                      )}
                      <div className="mt-5">
                        <PaveBtn
                          onClick={saveProfile}
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save changes"
                          )}
                        </PaveBtn>
                      </div>
                    </div>
                  </div>
                )}

                {activePanel === "kyc" && (
                  <div className="space-y-4">
                    <section className="rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isKycVerified
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {isKycVerified ? (
                            <CheckCircle2 size={21} />
                          ) : (
                            <ShieldCheck size={21} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">
                            Verification status
                          </p>
                          <p className="mt-0.5 font-bold text-[#0D0F1C]">
                            {verificationLabel}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                        Identity verification helps protect your account and
                        unlocks access to PAVE services that require verified
                        details.
                      </p>
                    </section>
                    <section className="rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <h3 className="font-semibold text-[#0D0F1C]">
                        Verification steps
                      </h3>
                      <ul className="mt-4 space-y-3 text-sm text-[#4B5563]">
                        {[
                          "Identity details",
                          "Identity document",
                          "Selfie check",
                        ].map((step, index) => (
                          <li key={step} className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-[#3730A3]">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <PaveBtn
                      onClick={() => {
                        setActivePanel(null);
                        onNav(isKycVerified ? "kyc-approved" : "kyc-welcome");
                      }}
                    >
                      {isKycVerified
                        ? "View verification"
                        : "Continue verification"}
                    </PaveBtn>
                  </div>
                )}

                {activePanel === "bank" && (
                  <section
                    className="rounded-2xl border border-[#E8EAF4] bg-white p-5"
                    aria-live="polite"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Landmark size={21} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0D0F1C]">
                          PAVE account
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          Account details for transfers
                        </p>
                      </div>
                    </div>
                    {accountDetailsQuery.isFetching && (
                      <p role="status" className="text-sm text-[#6B7280]">
                        Loading account details...
                      </p>
                    )}
                    {accountDetailsQuery.isError && (
                      <p role="alert" className="text-sm text-red-600">
                        {getApiErrorMessage(
                          accountDetailsQuery.error,
                          "Unable to load account details.",
                        )}
                      </p>
                    )}
                    {accountDetailsQuery.data && (
                      <dl className="divide-y divide-[#F1F3FB]">
                        <div className="flex justify-between gap-4 py-3">
                          <dt className="text-sm text-[#6B7280]">
                            Account name
                          </dt>
                          <dd className="text-right text-sm font-semibold text-[#0D0F1C]">
                            {accountDetailsQuery.data.user?.accountName ||
                              "Not available"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4 py-3">
                          <dt className="text-sm text-[#6B7280]">
                            Account number
                          </dt>
                          <dd className="text-right font-mono text-sm font-semibold text-[#0D0F1C]">
                            {accountDetailsQuery.data.user?.accountNumber ||
                              "Not available"}
                          </dd>
                        </div>
                      </dl>
                    )}
                    {!accountDetailsQuery.isFetching &&
                      !accountDetailsQuery.isError &&
                      !accountDetailsQuery.data && (
                        <p className="text-sm text-[#6B7280]">
                          No account details are available yet.
                        </p>
                      )}
                  </section>
                )}

                {activePanel === "notifications" && (
                  <div className="space-y-3">
                    {[
                      {
                        label: "Push notifications",
                        description:
                          "Receive updates about account activity and transactions.",
                        value: notificationsEnabled,
                        toggle: () =>
                          setNotificationsEnabled((previous) => {
                            const next = !previous;
                            localStorage.setItem(
                              "pave_notifications_enabled",
                              String(next),
                            );
                            return next;
                          }),
                      },
                      {
                        label: "Savings reminders",
                        description:
                          "Get reminders when scheduled savings contributions are due.",
                        value: savingsRemindersEnabled,
                        toggle: () =>
                          setSavingsRemindersEnabled((previous) => {
                            const next = !previous;
                            localStorage.setItem(
                              "pave_savings_reminders_enabled",
                              String(next),
                            );
                            return next;
                          }),
                      },
                    ].map((setting) => (
                      <div
                        key={setting.label}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8EAF4] bg-white p-5"
                      >
                        <div>
                          <h3 className="text-sm font-semibold text-[#0D0F1C]">
                            {setting.label}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                            {setting.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={setting.value}
                          aria-label={setting.label}
                          onClick={setting.toggle}
                          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                            setting.value ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                              setting.value ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                    <p className="px-1 text-xs leading-relaxed text-[#6B7280]">
                      These preferences are saved on this device.
                    </p>
                  </div>
                )}

                {activePanel === "security" && (
                  <div className="space-y-4">
                    <section className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <div>
                        <h3 className="text-sm font-semibold text-[#0D0F1C]">
                          Biometric login
                        </h3>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          Use fingerprint or Face ID when supported.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={biometricEnabled}
                        aria-label="Biometric login"
                        onClick={() => {
                          const next = !biometricEnabled;
                          setBiometricEnabled(next);
                          if (!next) {
                            localStorage.removeItem("pave_biometric_enabled");
                            localStorage.removeItem("pave_finger_user_id");
                          } else {
                            localStorage.setItem(
                              "pave_biometric_enabled",
                              "true",
                            );
                            const currentUserId =
                              (typeof profileUser?.id === "string" &&
                                profileUser.id) ||
                              (typeof profileUser?._id === "string" &&
                                profileUser._id) ||
                              "";
                            if (currentUserId) {
                              localStorage.setItem(
                                "pave_finger_user_id",
                                currentUserId,
                              );
                            }
                          }
                        }}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                          biometricEnabled ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            biometricEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </section>
                    <section className="rounded-2xl border border-[#E8EAF4] bg-white p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                          <Lock size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#0D0F1C]">
                            Password
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                            Reset your password using the email associated with
                            your account.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <PaveBtn
                          variant="outline"
                          onClick={() => {
                            setActivePanel(null);
                            onNav("forgot-password");
                          }}
                        >
                          Reset password
                        </PaveBtn>
                      </div>
                    </section>
                    <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-relaxed text-indigo-900">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                      Never share your password or one-time verification codes.
                    </div>
                  </div>
                )}

                {activePanel === "help" && (
                  <div className="space-y-5">
                    <section className="rounded-2xl bg-linear-to-br from-[#1E1B4B] to-[#3730A3] p-5 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                          <HelpCircle size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold">How can we help?</h3>
                          <p className="mt-1 text-xs text-white/75">
                            Find quick answers about using PAVE.
                          </p>
                        </div>
                      </div>
                    </section>
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-[#0D0F1C]">
                        Frequently asked questions
                      </h3>
                      <div className="overflow-hidden rounded-2xl border border-[#E8EAF4] bg-white">
                        {helpTopics.map((topic, index) => (
                          <div
                            key={topic.question}
                            className="border-b border-[#F1F3FB] last:border-0"
                          >
                            <button
                              type="button"
                              aria-expanded={openHelpTopic === index}
                              onClick={() =>
                                setOpenHelpTopic((open) =>
                                  open === index ? null : index,
                                )
                              }
                              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-[#0D0F1C]"
                            >
                              {topic.question}
                              <ChevronRight
                                size={16}
                                className={`shrink-0 text-[#9CA3AF] transition-transform ${
                                  openHelpTopic === index ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                            {openHelpTopic === index && (
                              <p className="px-4 pb-4 text-sm leading-relaxed text-[#6B7280]">
                                {topic.answer}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-[#E8EAF4] bg-white p-4">
                      <Mail
                        size={18}
                        className="mt-0.5 shrink-0 text-[#3730A3]"
                      />
                      <p className="text-xs leading-relaxed text-[#6B7280]">
                        For account-specific support, use the official support
                        contact provided by PAVE. PAVE will never ask you to
                        share your password or one-time codes.
                      </p>
                    </div>
                  </div>
                )}

                {activePanel === "terms" && (
                  <div className="space-y-5">
                    <section className="rounded-2xl bg-linear-to-br from-[#1E1B4B] to-[#3730A3] p-5 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                          <BookOpen size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold">Terms & Privacy</h3>
                          <p className="mt-1 text-xs text-white/75">
                            Key information for using PAVE.
                          </p>
                        </div>
                      </div>
                    </section>
                    <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                      <FileText
                        size={18}
                        className="mt-0.5 shrink-0 text-[#3730A3]"
                      />
                      <p className="text-xs leading-relaxed text-indigo-950">
                        Review the terms and any fees, schedules, or conditions
                        shown in a product before you confirm it. This overview
                        does not replace the full terms for a specific service.
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-[#E8EAF4] bg-white">
                      {legalTopics.map((topic, index) => (
                        <div
                          key={topic.title}
                          className="border-b border-[#F1F3FB] last:border-0"
                        >
                          <button
                            type="button"
                            aria-expanded={openLegalTopic === index}
                            onClick={() =>
                              setOpenLegalTopic((open) =>
                                open === index ? null : index,
                              )
                            }
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-[#0D0F1C]"
                          >
                            {topic.title}
                            <ChevronRight
                              size={16}
                              className={`shrink-0 text-[#9CA3AF] transition-transform ${
                                openLegalTopic === index ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {openLegalTopic === index && (
                            <p className="px-4 pb-4 text-sm leading-relaxed text-[#6B7280]">
                              {topic.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <section className="rounded-2xl border border-[#E8EAF4] bg-white p-4">
                      <h3 className="text-sm font-semibold text-[#0D0F1C]">
                        Need more detail?
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                        Refer to the official PAVE terms and privacy notice
                        provided for your account and the relevant financial
                        service.
                      </p>
                    </section>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { authUser, logout } = useLocalStore();
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("pave_notifications_enabled") !== "false",
  );
  const [biometric, setBiometric] = useState(
    () => localStorage.getItem("pave_biometric_enabled") === "true",
  );
  const [savingsReminder, setSavingsReminder] = useState(
    () => localStorage.getItem("pave_savings_reminders_enabled") !== "false",
  );
  const [mfaToken, setMfaToken] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityAnswerOpen, setSecurityAnswerOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [mfaMessage, setMfaMessage] = useState("");
  const mfaMutation = useVerifyMfaTokenMutation();
  const securityAnswerMutation = useVerifySecurityAnswerMutation();
  const deleteAccountMutation = useDeleteUserAccountMutation();
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const userId =
    (typeof authUser?.id === "string" && authUser.id) ||
    (typeof authUser?._id === "string" && authUser._id) ||
    "";

  const toggleBiometric = () => {
    const next = !biometric;
    setBiometric(next);
    if (next) {
      localStorage.setItem("pave_biometric_enabled", "true");
      if (userId) localStorage.setItem("pave_finger_user_id", userId);
    } else {
      localStorage.removeItem("pave_biometric_enabled");
      localStorage.removeItem("pave_finger_user_id");
    }
  };

  const verifyAnswer = () => {
    setSecurityMessage("");
    securityAnswerMutation.mutate(
      { userId, answer: securityAnswer.trim() },
      {
        onSuccess: () => setSecurityMessage("Security answer verified."),
      },
    );
  };

  const verifyMfa = () => {
    setMfaMessage("");
    mfaMutation.mutate(
      { token: mfaToken.trim() },
      {
        onSuccess: () => {
          setMfaToken("");
          setMfaMessage("MFA token verified.");
        },
      },
    );
  };

  const deleteAccount = () => {
    const email = authUser?.email?.trim();
    if (!email) {
      setDeleteAccountError(
        "Your account email is unavailable. Sign in again before deleting your account.",
      );
      return;
    }
    if (
      !window.confirm(
        "Delete your account? This will change your account's delete status.",
      )
    ) {
      return;
    }

    setDeleteAccountError("");
    deleteAccountMutation.mutate(email, {
      onSuccess: () => {
        logout();
        onNav("login");
      },
      onError: (error) =>
        setDeleteAccountError(
          getApiErrorMessage(error, "Unable to update account delete status."),
        ),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <ScreenHeader title="Settings" onBack={() => onNav("profile")} />
      <div className="flex-1 px-6 py-5 flex flex-col gap-4">
        {[
          {
            label: "Push Notifications",
            desc: "Get alerts for transactions & reminders",
            val: notifications,
            set: setNotifications,
          },
          {
            label: "Biometric Login",
            desc: "Use fingerprint or Face ID to login",
            val: biometric,
            set: setBiometric,
          },
          {
            label: "Savings Reminders",
            desc: "Get notified when deposits are due",
            val: savingsReminder,
            set: setSavingsReminder,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#F1F3FB]"
          >
            <div>
              <div className="text-sm font-medium text-[#0D0F1C]">
                {s.label}
              </div>
              <div className="text-xs text-[#9CA3AF]">{s.desc}</div>
            </div>
            <button
              onClick={() => {
                if (s.label === "Biometric Login") {
                  toggleBiometric();
                } else {
                  const next = !s.val;
                  s.set(next);
                  localStorage.setItem(
                    s.label === "Push Notifications"
                      ? "pave_notifications_enabled"
                      : "pave_savings_reminders_enabled",
                    String(next),
                  );
                }
              }}
              aria-pressed={s.val}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${s.val ? "bg-emerald-600" : "bg-slate-300"}`}
            >
              <div
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.val ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-[#F1F3FB] overflow-hidden">
          {[
            ["Change PIN", "#3730A3"],
            ["Change Password", "#3730A3"],
            ["Two-Factor Auth", "#059669"],
            ["Question & Answer Security", "#059669"],
            ["Active Sessions", "#374151"],
          ].map(([label, color]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === "Two-Factor Auth") {
                  setMfaOpen((open) => !open);
                  setMfaMessage("");
                } else if (label === "Question & Answer Security") {
                  setSecurityAnswerOpen((open) => !open);
                  setSecurityMessage("");
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F9FAFB] border-b border-[#F9FAFB] last:border-0 cursor-pointer"
            >
              <span
                className="text-sm font-medium"
                style={{ color: color as string }}
              >
                {label}
              </span>
              <ChevronRight size={16} className="text-[#D1D5DB]" />
            </button>
          ))}
        </div>
        {mfaOpen && (
          <section className="rounded-xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-1 text-sm font-semibold text-[#0D0F1C]">
              Verify MFA token
            </h3>
            <p className="mb-3 text-xs text-[#6B7280]">
              Enter the TOTP code from your authenticator app.
            </p>
            <Input
              label="MFA token"
              value={mfaToken}
              onChange={setMfaToken}
              placeholder="Enter your TOTP code"
            />
            {mfaMutation.isError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {getApiErrorMessage(
                  mfaMutation.error,
                  "Unable to verify the MFA token.",
                )}
              </p>
            )}
            {mfaMessage && (
              <p role="status" className="mt-2 text-sm text-green-700">
                {mfaMessage}
              </p>
            )}
            <div className="mt-3">
              <PaveBtn
                onClick={verifyMfa}
                disabled={!mfaToken.trim() || mfaMutation.isPending}
              >
                {mfaMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify MFA Token"
                )}
              </PaveBtn>
            </div>
          </section>
        )}
        {securityAnswerOpen && (
          <section className="rounded-xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-1 text-sm font-semibold text-[#0D0F1C]">
              Verify security answer
            </h3>
            <p className="mb-3 text-xs text-[#6B7280]">
              Enter the answer to the security question on your account.
            </p>
            <Input
              label="Security answer"
              value={securityAnswer}
              onChange={setSecurityAnswer}
              placeholder="Enter your answer"
            />
            {!userId && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                Your account ID is unavailable. Sign in again before verifying.
              </p>
            )}
            {securityAnswerMutation.isError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {getApiErrorMessage(
                  securityAnswerMutation.error,
                  "Unable to verify the security answer.",
                )}
              </p>
            )}
            {securityMessage && (
              <p role="status" className="mt-2 text-sm text-green-700">
                {securityMessage}
              </p>
            )}
            <div className="mt-3">
              <PaveBtn
                onClick={verifyAnswer}
                disabled={
                  !userId ||
                  !securityAnswer.trim() ||
                  securityAnswerMutation.isPending
                }
              >
                {securityAnswerMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Security Answer"
                )}
              </PaveBtn>
            </div>
          </section>
        )}
        <section className="rounded-xl border border-red-200 bg-white p-4">
          <h3 className="mb-1 text-sm font-semibold text-red-700">
            Delete account
          </h3>
          <p className="mb-3 text-xs text-[#6B7280]">
            The documented endpoint toggles your account's delete status.
          </p>
          {deleteAccountError && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {deleteAccountError}
            </p>
          )}
          <PaveBtn
            variant="danger"
            onClick={deleteAccount}
            disabled={deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? (
              <>
                <Loader size={16} className="animate-spin" />
                Updating account...
              </>
            ) : (
              "Delete Account"
            )}
          </PaveBtn>
        </section>
        <div className="bg-[#F1F3FB] rounded-xl p-3 text-center text-xs text-[#9CA3AF]">
          PAVE v2.0.1 · Member ID: PAV-20240614
        </div>
      </div>
    </div>
  );
}
