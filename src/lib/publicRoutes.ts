export type PublicInfoRoute = "terms" | "privacy" | "cookies" | "help";

const ROUTES: readonly PublicInfoRoute[] = [
  "terms",
  "privacy",
  "cookies",
  "help",
];

/** Maps /terms, /privacy, /cookies and /help (any case, optional trailing slash) to a route. */
export function getPublicInfoRoute(pathname: string): PublicInfoRoute | null {
  const clean = pathname.replace(/\/+$/, "").toLowerCase();
  const name = clean.startsWith("/") ? clean.slice(1) : clean;
  return (ROUTES as readonly string[]).includes(name)
    ? (name as PublicInfoRoute)
    : null;
}
