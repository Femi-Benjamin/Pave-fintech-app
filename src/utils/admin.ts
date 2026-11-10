/**
 * UX-only helper to detect whether a user is an AJO group admin.
 * NOTE: This is UX only; the backend must enforce authorization on transfer endpoints.
 */
export function isAjoAdmin(
  target?:
    | string
    | {
        role?: string | null;
        userRole?: string | null;
        isAdmin?: boolean | null;
        createdBy?: string | null;
        userId?: string | null;
        adminId?: string | null;
        ownerId?: string | null;
        creatorId?: string | null;
        members?: Array<{ role?: string | null; userId?: string | null; id?: string | null }>;
      }
    | Array<any>
    | null,
  currentUserId?: string | null,
): boolean {
  if (!target) return false;

  // If string passed directly (e.g. role string "admin", "member", "")
  if (typeof target === "string") {
    const normalized = target.toLowerCase().trim();
    return normalized === "admin" || normalized === "owner";
  }

  // If array of groups passed
  if (Array.isArray(target)) {
    return target.some((g) => isAjoAdmin(g, currentUserId));
  }

  // Object checks
  if (target.isAdmin === true) {
    return true;
  }

  if (target.role) {
    const r = String(target.role).toLowerCase().trim();
    if (r === "admin" || r === "owner") return true;
  }

  if (target.userRole) {
    const r = String(target.userRole).toLowerCase().trim();
    if (r === "admin" || r === "owner") return true;
  }

  if (currentUserId) {
    const uid = String(currentUserId).trim();
    if (uid) {
      const ownerId = String(
        target.createdBy ||
          target.userId ||
          target.adminId ||
          target.ownerId ||
          target.creatorId ||
          "",
      ).trim();
      if (ownerId && ownerId === uid) {
        return true;
      }
      if (Array.isArray(target.members)) {
        const matchingMember = target.members.find(
          (m) => String(m.userId || m.id).trim() === uid,
        );
        if (matchingMember && matchingMember.role) {
          const mr = String(matchingMember.role).toLowerCase().trim();
          if (mr === "admin" || mr === "owner") {
            return true;
          }
        }
      }
    }
  }

  return false;
}
