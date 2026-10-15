import type { AuthUser } from "../api/auth";

export const TOKEN_KEY = "pave_token";
export const AUTH_USER_KEY = "pave_auth_user";
export const EXPIRES_AT_KEY = "pave_token_expires_at";
export const LAST_ACTIVITY_KEY = "pave_last_activity";
export const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const AUTH_LOGOUT_EVENT = "pave_auth_logout";

/**
 * Safely decodes base64url or standard base64 string
 */
function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  }
}

/**
 * Parses JWT payload without signature verification
 */
export function decodeJwtPayload(token: string): Record<string, any> | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  try {
    const jsonStr = base64UrlDecode(parts[1]);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Returns true only if a token exists AND has not expired.
 * - For JWTs, inspects payload `exp` claim against current Unix timestamp.
 * - For non-JWTs, inspects stored `expiresAt` timestamp in sessionStorage.
 */
export function isTokenValid(token?: string | null): boolean {
  if (!token || typeof token !== "string" || !token.trim()) {
    return false;
  }

  const cleanToken = token.trim();
  const jwtPayload = decodeJwtPayload(cleanToken);

  if (jwtPayload && typeof jwtPayload.exp === "number") {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    return jwtPayload.exp > currentUnixTime;
  }

  // If not a JWT, check stored expiresAt timestamp
  if (typeof window !== "undefined" && window.sessionStorage) {
    const storedExpiresAt = sessionStorage.getItem(EXPIRES_AT_KEY);
    if (storedExpiresAt) {
      const expMs = Number(storedExpiresAt);
      if (!Number.isNaN(expMs) && expMs > 0) {
        return expMs > Date.now();
      }
    }
  }

  // Fallback: If not JWT and no explicit expiry, treat as valid only for active tab session
  return true;
}

/**
 * Returns expiry timestamp in milliseconds, or null if unknown
 */
export function getTokenExpiry(token?: string | null): number | null {
  if (!token || typeof token !== "string") return null;
  const payload = decodeJwtPayload(token.trim());
  if (payload && typeof payload.exp === "number") {
    return payload.exp * 1000;
  }
  if (typeof window !== "undefined" && window.sessionStorage) {
    const storedExpiresAt = sessionStorage.getItem(EXPIRES_AT_KEY);
    if (storedExpiresAt) {
      const expMs = Number(storedExpiresAt);
      if (!Number.isNaN(expMs) && expMs > 0) return expMs;
    }
  }
  return null;
}

/**
 * Retrieves token strictly from sessionStorage.
 * Automatically clears legacy localStorage tokens to prevent silent auto-login.
 */
export function getToken(): string | null {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  // Remove any stale token from localStorage to guarantee no cross-tab or persistent leaks
  try {
    if (localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (localStorage.getItem(AUTH_USER_KEY)) {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch {}

  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token || !isTokenValid(token)) {
    return null;
  }
  return token;
}

/**
 * Stores token in sessionStorage (session ends when tab/browser closes).
 */
export function setToken(token: string, expiresAt?: number): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;

  const cleanToken = token.trim();
  sessionStorage.setItem(TOKEN_KEY, cleanToken);

  // Determine expiry
  let finalExpiresAt = expiresAt;
  if (!finalExpiresAt) {
    const payload = decodeJwtPayload(cleanToken);
    if (payload && typeof payload.exp === "number") {
      finalExpiresAt = payload.exp * 1000;
    }
  }

  if (finalExpiresAt) {
    sessionStorage.setItem(EXPIRES_AT_KEY, String(finalExpiresAt));
  } else {
    sessionStorage.removeItem(EXPIRES_AT_KEY);
  }

  recordActivity();

  // Clear any legacy localStorage tokens
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {}
}

/**
 * Clears all auth session data from sessionStorage and localStorage.
 */
export function clearToken(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(EXPIRES_AT_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {}

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem("pave_finger_user_id");
  } catch {}
}

/**
 * Retrieves authenticated user data from sessionStorage.
 */
export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Stores authenticated user data in sessionStorage.
 */
export function setStoredAuthUser(user: AuthUser | null): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    if (user) {
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(AUTH_USER_KEY);
    }
  } catch {}
}

/**
 * Records timestamp of user interaction for 15-minute inactivity tracking
 */
export function recordActivity(): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch {}
}

/**
 * Returns true if user has been inactive for more than 15 minutes
 */
export function isInactiveTimeout(): boolean {
  if (typeof window === "undefined" || !window.sessionStorage) return false;
  try {
    const lastActiveStr = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActiveStr) return false;
    const lastActive = Number(lastActiveStr);
    if (Number.isNaN(lastActive) || lastActive <= 0) return false;
    return Date.now() - lastActive > INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
}

/**
 * Triggers auth logout across the entire application and dispatches a window event
 */
export function triggerAuthLogout(reason = "session_expired"): void {
  clearToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_LOGOUT_EVENT, { detail: { reason } }),
    );
  }
}

/**
 * Subscribes to logout events (e.g. from axios 401/403 interceptors or timeout)
 */
export function subscribeToAuthLogout(
  callback: (reason: string) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ reason?: string }>;
    callback(customEvent.detail?.reason || "session_expired");
  };

  window.addEventListener(AUTH_LOGOUT_EVENT, handler);
  return () => {
    window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
  };
}
