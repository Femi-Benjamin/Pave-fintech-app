import axios from "axios";
import { api } from "../lib/api-client";
import { getToken } from "../lib/authStorage";

export interface StartRegisterPayload {
  email?: string;
  phoneNumber?: string;
}

// NOTE: The deployed Pave backend uses a single-step registration endpoint.
// The legacy startRegister/verifyToken flow is not part of the live contract.

export interface StartRegisterResponse {
  message: string;
}

export async function startRegister(payload: StartRegisterPayload) {
  // Backward-compatible shim for older frontend flows.
  // The live API contract accepts the full signup payload directly at
  // /api/v1/auth/completeRegistration.
  throw new Error(
    "Legacy startRegister flow is not supported by the live Pave backend. Use completeRegistration instead.",
  );
}

export interface VerifyAccountResponse {
  message?: string;
}

export async function verifyAccount(token: string) {
  throw new Error(
    "Legacy verifyAccount flow is not supported by the live Pave backend. Use completeRegistration directly.",
  );
}

export interface CompleteRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  state?: string;
}

export async function completeRegistration(
  payload: CompleteRegistrationPayload,
) {
  const { data } = await api.post("/api/v1/auth/completeRegistration", payload);
  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/api/v1/auth/login", payload);

  if (!data.token) {
    throw new Error("The login response did not include an authentication token.");
  }

  return data;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const message = responseData?.message || responseData?.error;

    if (message) return message;
    if (status === 400) return "The email or password is invalid.";
    if (status === 401) return "The email or password is incorrect.";
    if (status === 403) return "This account is not allowed to sign in.";
    if (status === 404) return "The login endpoint is unavailable on the configured backend.";
    if (status && status >= 500) return "The PAVEPADI server is unavailable. Please try again later.";
    if (!error.response) return "Unable to reach the PAVEPADI server. Check your connection.";
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const message = responseData?.message || responseData?.error;

    if (message) return message;
    if (!error.response) return "Unable to reach the PAVEPADI server. Check your connection.";
    if (error.response.status === 401) {
      return "Your session may have expired. Please sign in again.";
    }
    if (error.response.status >= 500) {
      return "The PAVEPADI server is unavailable. Please try again later.";
    }
    return fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/api/v1/auth/forgotPassword", { email });
  return data;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await api.post("/api/v1/auth/resetPassword", payload);
  return data;
}

export interface VerifySecurityAnswerPayload {
  userId: string;
  answer: string;
}

export async function verifySecurityAnswer(
  payload: VerifySecurityAnswerPayload,
) {
  const { data } = await api.post(
    "/api/v1/auth/verifySecurityAnswer",
    payload,
  );
  return data;
}

export interface VerifyMfaTokenPayload {
  token: string;
  userId?: string;
}

export async function verifyMfaToken(payload: VerifyMfaTokenPayload) {
  if (!payload.token || !payload.token.trim()) {
    throw new Error("A valid MFA token is required.");
  }

  const userId =
    (payload.userId && payload.userId.trim()) || getAuthenticatedUserId();

  if (userId) {
    const { data } = await api.post("/api/v1/auth/verifyMfaToken", {
      userId,
      token: payload.token.trim(),
    });
    return data;
  }

  // Fallback to the dedicated TOTP endpoint
  const { data } = await api.post("/api/v1/mfa/verify", {
    token: payload.token.trim(),
  });
  return data;
}

export async function uploadUserImage(file: File) {
  if (!file) {
    throw new Error("Please select an image file to upload.");
  }
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP image formats are supported.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Profile image size must not exceed 5MB.");
  }

  const formData = new FormData();
  formData.append("face", file);
  const { data } = await api.post("/api/v1/auth/uploadImage", formData);
  return data;
}

/**
 * Nepa Bill Image uploading (Proof of Address / Utility Bill)
 * POST /api/v1/auth/uploadBillImage
 * Documented in Postman as "Nepa Bill Image uploading" with multipart field "nepaBill".
 */
export async function uploadBillImage(file: File) {
  if (!file) {
    throw new Error("Please select a utility bill document image to upload.");
  }
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf",
  ];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or PDF files are supported.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Document file size must not exceed 5MB.");
  }

  const formData = new FormData();
  formData.append("nepaBill", file);
  const { data } = await api.post("/api/v1/auth/uploadBillImage", formData);
  return data;
}

export const uploadNepaBillImage = uploadBillImage;

/**
 * Backward compatibility helper for uploadNinImage.
 * Note: In the Postman collection, "NIN Image uploading" maps directly to
 * POST /api/v1/auth/validateNIN with fields nin, ninFrontId, and optional ninBackId.
 * For proof-of-address documents, use uploadBillImage instead.
 */
export async function uploadNinImage(file: File) {
  return uploadBillImage(file);
}

export interface VerifyNinPayload {
  nin: string;
  ninFrontId: File;
  ninBackId?: File | null;
}

/**
 * NIN Image uploading and identity verification
 * POST /api/v1/auth/validateNIN
 * Documented in Postman as "NIN Image uploading" and "Verify NIN".
 * Expects multipart/form-data with fields:
 * - nin (11-digit string)
 * - ninFrontId (File, front of NIN document or live face)
 * - ninBackId (File, optional back of document)
 */
export async function verifyNin(payload: VerifyNinPayload) {
  const cleanNin = payload.nin?.trim() ?? "";
  if (!cleanNin || cleanNin.length !== 11 || !/^\d{11}$/.test(cleanNin)) {
    throw new Error("A valid 11-digit NIN is required.");
  }
  if (!payload.ninFrontId) {
    throw new Error("Front ID photo is required for NIN verification.");
  }

  const formData = new FormData();
  formData.append("nin", cleanNin);
  formData.append("ninFrontId", payload.ninFrontId);
  if (payload.ninBackId) {
    formData.append("ninBackId", payload.ninBackId);
  }

  const { data } = await api.post("/api/v1/auth/validateNIN", formData);
  return data;
}

export interface UpdateProfilePayload {
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}

export interface ProfileResponse {
  user?: AuthUser;
  message?: string;
}

export async function getProfile(email: string): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>("/api/v1/auth/getProfile", {
    params: { email },
  });
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  const { data } = await api.put<ProfileResponse>(
    "/api/v1/auth/updateProfile",
    payload,
  );
  return data;
}

export async function deleteUserAccount(email: string) {
  const { data } = await api.put<ProfileResponse>(
    "/api/v1/auth/toggleBlockUser",
    { email },
  );
  return data;
}

export interface UserAccountDetailsResponse {
  success?: boolean;
  message?: string;
  user?: {
    accountName?: string;
    accountNumber?: string;
    [key: string]: unknown;
  };
}

export async function getUserAccountDetails(): Promise<UserAccountDetailsResponse> {
  const { data } = await api.get<UserAccountDetailsResponse>(
    "/api/v1/auth/getUserAccountDetails",
  );
  return data;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  kycStatus?: string;
  isKycVerified?: boolean;
  role?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

export function extractUserIdFromToken(token?: string | null): string | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    const id =
      parsed?.id ??
      parsed?._id ??
      parsed?.userId ??
      parsed?.user_id ??
      parsed?.sub;
    return id ? String(id).trim() : null;
  } catch {
    return null;
  }
}

export function extractEmailFromToken(token?: string | null): string | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed?.email ? String(parsed.email).trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

export function getAuthenticatedUserId(
  authUser?: AuthUser | null,
  token?: string | null,
): string {
  if (authUser) {
    const directId =
      authUser.id ??
      authUser._id ??
      (authUser as any).userId ??
      (authUser as any).user_id ??
      (authUser as any).sub;
    if (directId) return String(directId).trim();
  }

  const storedToken = token || getToken();
  const tokenUserId = extractUserIdFromToken(storedToken);
  if (tokenUserId) return tokenUserId;

  return "";
}

export function getAuthenticatedUserEmail(
  authUser?: AuthUser | null,
  token?: string | null,
): string {
  if (authUser?.email && typeof authUser.email === "string") {
    return authUser.email.trim().toLowerCase();
  }
  const storedToken = token || getToken();
  const tokenEmail = extractEmailFromToken(storedToken);
  if (tokenEmail) return tokenEmail;

  return "";
}
