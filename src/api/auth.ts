import axios from "axios";
import { api } from "../lib/api-client";

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
    if (status && status >= 500) return "The Pave server is unavailable. Please try again later.";
    if (!error.response) return "Unable to reach the Pave server. Check your connection.";
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
    if (!error.response) return "Unable to reach the Pave server. Check your connection.";
    if (error.response.status === 401) {
      return "Your session may have expired. Please sign in again.";
    }
    if (error.response.status >= 500) {
      return "The Pave server is unavailable. Please try again later.";
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
}

export async function verifyMfaToken(payload: VerifyMfaTokenPayload) {
  const { data } = await api.post("/api/v1/mfa/verify", payload);
  return data;
}

export async function uploadUserImage(file: File) {
  const formData = new FormData();
  formData.append("face", file);
  const { data } = await api.post(
    "/api/v1/auth/uploadImage",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function uploadNinImage(file: File) {
  const formData = new FormData();
  formData.append("nepaBill", file);
  const { data } = await api.post(
    "/api/v1/auth/uploadBillImage",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export interface VerifyNinPayload {
  nin: string;
  ninFrontId: File;
  ninBackId: File;
}

export async function verifyNin(payload: VerifyNinPayload) {
  const formData = new FormData();
  formData.append("nin", payload.nin);
  formData.append("ninFrontId", payload.ninFrontId);
  formData.append("ninBackId", payload.ninBackId);
  const { data } = await api.post(
    "/api/v1/auth/validateNIN",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function loginWithFinger(userId: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/api/v1/auth/loginWithFinger",
    null,
    { params: { userId } },
  );

  if (!data.token) {
    throw new Error(
      "The fingerprint login response did not include an authentication token.",
    );
  }

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
