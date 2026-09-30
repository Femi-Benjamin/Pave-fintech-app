import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
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
  useUpdateProfileMutation,
  useUserAccountDetailsQuery,
  useUploadUserImageMutation,
  useVerifyMfaTokenMutation,
  useVerifySecurityAnswerMutation,
} from "../hooks/usePaveApi";
import type { UpdateProfilePayload } from "../api/auth";

export function ProfileScreen({
  onNav,
  onBackToWebsite,
}: {
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const { savings, programs, products, authUser, setAuthUser, logout } =
    useLocalStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const uploadImageMutation = useUploadUserImageMutation();
  const email = authUser?.email?.trim() || "";
  const profileQuery = useProfileQuery(
    email,
    Boolean(localStorage.getItem("pave_token")),
  );
  const updateProfileMutation = useUpdateProfileMutation(email);
  const accountDetailsQuery = useUserAccountDetailsQuery(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState(false);
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
  const profileEmail = profileUser?.email?.trim() || email || "Email not available";
  const kycStatus = profileUser?.kycStatus?.toLowerCase();
  const isKycVerified = kycStatus
    ? kycStatus === "approved" || kycStatus === "verified"
    : profileUser?.isKycVerified ?? profileUser?.isVerified ?? false;
  const verificationLabel = kycStatus
    ? `KYC ${kycStatus.charAt(0).toUpperCase()}${kycStatus.slice(1)}`
    : isKycVerified
      ? "KYC Verified"
      : "KYC Pending";

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
    setIsProfileEditorOpen((open) => !open);
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
        setIsProfileEditorOpen(false);
      },
    });
  };

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
        <div className="grid grid-cols-3 gap-4 mt-6 w-full">
          {[
            ["Goals", String(savings.length)],
            ["Groups", String(programs.length)],
            ["Products", String(payingProductsCount || 1)],
          ].map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-white font-bold text-xl">{v}</div>
              <div className="text-white/60 text-xs">{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2">
        {[
          {
            icon: <User size={18} />,
            label: "Personal Information",
            color: "#3730A3",
            bg: "#EEF2FF",
          },
          {
            icon: <Shield size={18} />,
            label: "KYC & Verification",
            color: "#059669",
            bg: "#ECFDF5",
          },
          {
            icon: <Landmark size={18} />,
            label: "Bank Accounts",
            color: "#D97706",
            bg: "#FFFBEB",
          },
          {
            icon: <Bell size={18} />,
            label: "Notifications",
            color: "#7C3AED",
            bg: "#F5F3FF",
          },
          {
            icon: <Lock size={18} />,
            label: "Security & Password",
            color: "#0891B2",
            bg: "#ECFEFF",
          },
          {
            icon: <HelpCircle size={18} />,
            label: "Help & Support",
            color: "#374151",
            bg: "#F3F4F6",
          },
          {
            icon: <BookOpen size={18} />,
            label: "Terms & Privacy",
            color: "#374151",
            bg: "#F3F4F6",
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.label === "Personal Information") {
                openProfileEditor();
              } else if (item.label === "Bank Accounts") {
                const shouldOpen = !isAccountDetailsOpen;
                setIsAccountDetailsOpen(shouldOpen);
                if (shouldOpen) void accountDetailsQuery.refetch();
              } else if (item.label === "KYC & Verification") {
                onNav("kyc-welcome");
              } else {
                onNav("settings");
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
        {isProfileEditorOpen && (
          <section className="my-2 rounded-xl border border-[#F1F3FB] bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#0D0F1C]">
              Personal information
            </h3>
            <div className="flex flex-col gap-3">
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
            <div className="mt-4 flex gap-2">
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
                  "Save Profile"
                )}
              </PaveBtn>
              <PaveBtn
                variant="ghost"
                onClick={() => setIsProfileEditorOpen(false)}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </PaveBtn>
            </div>
          </section>
        )}
        {isAccountDetailsOpen && (
          <section
            className="my-2 rounded-xl border border-[#F1F3FB] bg-white p-4"
            aria-live="polite"
          >
            <h3 className="mb-2 text-sm font-semibold text-[#0D0F1C]">
              Account details
            </h3>
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
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#6B7280]">Account name</dt>
                  <dd className="text-right font-medium text-[#0D0F1C]">
                    {accountDetailsQuery.data.user?.accountName || "Not available"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#6B7280]">Account number</dt>
                  <dd className="text-right font-medium text-[#0D0F1C]">
                    {accountDetailsQuery.data.user?.accountNumber || "Not available"}
                  </dd>
                </div>
              </dl>
            )}
          </section>
        )}
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
    </motion.div>
  );
}

export function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { authUser, logout } = useLocalStore();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(
    () => localStorage.getItem("pave_biometric_enabled") === "true",
  );
  const [savingsReminder, setSavingsReminder] = useState(true);
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
              onClick={() =>
                s.label === "Biometric Login"
                  ? toggleBiometric()
                  : s.set(!s.val)
              }
              aria-pressed={s.val}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${s.val ? "bg-[#3730A3]" : "bg-[#D1D5DB]"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.val ? "translate-x-6" : "translate-x-1"}`}
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
