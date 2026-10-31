/**
 * Helpers for the profile photo flow.
 * Only real http(s) URLs may be shown as "saved" or persisted; blob: URLs
 * die on reload and must never be stored.
 */
export function isHttpUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

/** Finds the hosted image URL in an upload/profile response, or null. */
export function extractImageUrl(res: any): string | null {
  const candidates = [
    res?.user?.image,
    res?.user?.face,
    res?.user?.profileImage,
    res?.data?.image,
    res?.data?.face,
    res?.data?.profileImage,
    res?.data?.user?.image,
    res?.data?.user?.face,
    res?.image,
    res?.imageUrl,
    res?.url,
  ];
  for (const c of candidates) {
    if (isHttpUrl(c)) return c.trim();
  }
  return null;
}
