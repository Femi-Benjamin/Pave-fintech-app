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

export interface AuthUser {
  id?: string;
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}
