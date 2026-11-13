import { Screen, KNOWN_SCREENS } from "../pave-data";

/**
 * Resolves a return screen name. Returns the value if it is a known valid screen,
 * otherwise falls back to "marketplace".
 */
export function resolveReturnScreen(value?: string | null): Screen {
  if (value && (KNOWN_SCREENS as readonly string[]).includes(value)) {
    return value as Screen;
  }
  return "marketplace";
}


/**
 * Restores only top-level destinations after a full page reload. Detail routes
 * depend on transient in-memory selections and must fall back to Home.
 */
export function resolveRestoredMainScreen(
  value: string | null,
  hasSession: boolean,
): Screen {
  const mainTabs: readonly string[] = [
    "wallet",
    "savings",
    "group-savings",
    "marketplace",
    "messages",
    "profile",
  ];
  return hasSession && value && mainTabs.includes(value)
    ? (value as Screen)
    : "home";
}
