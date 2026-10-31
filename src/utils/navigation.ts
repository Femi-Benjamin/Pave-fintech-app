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
