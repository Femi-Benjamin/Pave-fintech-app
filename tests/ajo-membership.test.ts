import assert from "node:assert/strict";
import test from "node:test";

import {
  extractUserIdFromToken,
  extractEmailFromToken,
  getAuthenticatedUserId,
  getAuthenticatedUserEmail,
  type AuthUser,
} from "../src/api/auth";

import {
  isGroupSavingMember,
  extractEntityId,
  isAlreadyMemberMessage,
  normalizeGroupSavingsList,
  type GroupSaving,
  type GroupSavingMember,
} from "../src/api/groupSaving";

// Helper to create a fake base64url JWT payload
function createMockJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = "fake_signature_for_test";
  return `${header}.${body}.${signature}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OWNER MEMBERSHIP TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: identifies group owner via string userId", () => {
  const group: Partial<GroupSaving> = {
    userId: "user-owner-001",
    name: "Tech Savers",
    members: [],
  };
  assert.equal(isGroupSavingMember(group as GroupSaving, "user-owner-001"), true);
  assert.equal(isGroupSavingMember(group as GroupSaving, "user-stranger-999"), false);
});

test("isGroupSavingMember: identifies group owner via numeric or object ID variations", () => {
  // Numeric ID
  const groupNum: any = { userId: 12345, members: [] };
  assert.equal(isGroupSavingMember(groupNum, "12345"), true);

  // Nested object ID
  const groupObj: any = { userId: { id: "user-owner-002" }, members: [] };
  assert.equal(isGroupSavingMember(groupObj, "user-owner-002"), true);

  // MongoDB _id format
  const groupMongo: any = { userId: { _id: "mongo-owner-003" }, members: [] };
  assert.equal(isGroupSavingMember(groupMongo, "mongo-owner-003"), true);
});

test("isGroupSavingMember: identifies group owner via creator/admin alias fields", () => {
  assert.equal(
    isGroupSavingMember({ creatorId: "creator-456" } as any, "creator-456"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ createdBy: "creator-789" } as any, "creator-789"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ adminId: "admin-101" } as any, "admin-101"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ ownerId: "owner-202" } as any, "owner-202"),
    true,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONFIRMED MEMBER TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: identifies confirmed member via members array userId", () => {
  const member: GroupSavingMember = {
    id: "mem-1",
    groupSavingId: "grp-1",
    userId: "user-member-001",
    role: "member",
    totalContribution: 50000,
    joinedAt: "2026-01-01T00:00:00Z",
    status: "active",
  };
  const group: Partial<GroupSaving> = {
    userId: "user-owner-001",
    members: [member],
  };

  assert.equal(isGroupSavingMember(group as GroupSaving, "user-member-001"), true);
});

test("isGroupSavingMember: identifies member via nested User object id / _id", () => {
  const memberWithUser: any = {
    id: "mem-2",
    groupSavingId: "grp-1",
    role: "member",
    status: "active",
    User: { id: "user-nested-002", email: "nested@example.com" },
  };
  const group: any = {
    userId: "user-owner-001",
    members: [memberWithUser],
  };

  assert.equal(isGroupSavingMember(group, "user-nested-002"), true);
});

test("isGroupSavingMember: matches member via email case-insensitively when ID is unmapped", () => {
  const memberWithEmail: any = {
    id: "mem-3",
    role: "member",
    status: "active",
    User: { email: "Jane.Doe@PaveFintech.com" },
  };
  const group: any = {
    userId: "user-owner-001",
    members: [memberWithEmail],
  };

  assert.equal(
    isGroupSavingMember(group, "unknown-id", "jane.doe@pavefintech.com"),
    true,
  );
  assert.equal(
    isGroupSavingMember(group, "", "JANE.DOE@PAVEFINTECH.COM"),
    true,
  );
});

test("isGroupSavingMember: recognizes direct group membership flags & userRole", () => {
  assert.equal(
    isGroupSavingMember({ userId: "other-user", isMember: true } as any, "user-1"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ userId: "other-user", hasJoined: true } as any, "user-1"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ userId: "other-user", userRole: "member" } as any, "user-1"),
    true,
  );
  assert.equal(
    isGroupSavingMember({ userId: "other-user", role: "admin" } as any, "user-1"),
    true,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. UNRELATED USER TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: denies access to unrelated user", () => {
  const group: Partial<GroupSaving> = {
    userId: "owner-999",
    members: [
      {
        id: "mem-1",
        groupSavingId: "grp-1",
        userId: "member-111",
        role: "member",
        totalContribution: 1000,
        joinedAt: "2026-01-01",
        status: "active",
        User: { email: "member1@example.com" },
      },
    ],
  };

  assert.equal(isGroupSavingMember(group as GroupSaving, "unrelated-user-222"), false);
  assert.equal(
    isGroupSavingMember(group as GroupSaving, "unrelated-user-222", "unrelated@example.com"),
    false,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. MISSING USER IDS / MISSING DATA TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: denies access when current user identity is completely missing", () => {
  const group: Partial<GroupSaving> = {
    userId: "owner-123",
    members: [
      {
        id: "mem-1",
        groupSavingId: "grp-1",
        userId: "member-456",
        role: "member",
        totalContribution: 0,
        joinedAt: "2026-01-01",
        status: "active",
      },
    ],
  };

  // Missing userId and missing userEmail MUST NEVER grant access
  assert.equal(isGroupSavingMember(group as GroupSaving, ""), false);
  assert.equal(isGroupSavingMember(group as GroupSaving, "", ""), false);
  assert.equal(isGroupSavingMember(null, "some-user"), false);
  assert.equal(isGroupSavingMember(undefined, "some-user"), false);
});

test("isGroupSavingMember: denies access if group record has no members and no matching owner", () => {
  const groupWithoutMembers: Partial<GroupSaving> = {
    userId: "owner-123",
    name: "Private Group",
    members: [],
  };

  assert.equal(isGroupSavingMember(groupWithoutMembers as GroupSaving, "user-456"), false);
  assert.equal(
    isGroupSavingMember({ userId: "owner-123" } as GroupSaving, "user-456"),
    false,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. MALFORMED / INACTIVE MEMBERSHIP DATA TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: safely handles malformed member entries in array", () => {
  const groupWithMalformedMembers: any = {
    userId: "owner-123",
    members: [
      null,
      undefined,
      {},
      { userId: null },
      { userId: undefined, status: "active" },
      { invalidField: 12345 },
    ],
  };

  assert.equal(isGroupSavingMember(groupWithMalformedMembers, "user-789"), false);
});

test("isGroupSavingMember: rejects members with inactive, pending, or revoked statuses", () => {
  const inactiveStatuses = [
    "pending",
    "rejected",
    "declined",
    "removed",
    "inactive",
    "left",
    "cancelled",
  ];

  for (const status of inactiveStatuses) {
    const groupWithInactiveMember: any = {
      userId: "owner-123",
      members: [
        {
          userId: "user-applicant",
          status,
          User: { email: "applicant@example.com" },
        },
      ],
    };

    assert.equal(
      isGroupSavingMember(groupWithInactiveMember, "user-applicant"),
      false,
      `Should deny access when member status is '${status}'`,
    );
    assert.equal(
      isGroupSavingMember(groupWithInactiveMember, "user-applicant", "applicant@example.com"),
      false,
      `Should deny access by email when member status is '${status}'`,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. ALREADY-MEMBER BACKEND MESSAGE CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────
test("isAlreadyMemberMessage: correctly identifies documented already-member messages", () => {
  assert.equal(isAlreadyMemberMessage("You are already a member"), true);
  assert.equal(isAlreadyMemberMessage("User is already a member of this group"), true);
  assert.equal(isAlreadyMemberMessage("Already a member"), true);
  assert.equal(isAlreadyMemberMessage("You have already joined this AJO group"), true);
  assert.equal(isAlreadyMemberMessage("Already member"), true);
});

test("isAlreadyMemberMessage: rejects non-member error messages (does NOT convert to success)", () => {
  assert.equal(isAlreadyMemberMessage("Invalid invitation code"), false);
  assert.equal(isAlreadyMemberMessage("Group not found"), false);
  assert.equal(isAlreadyMemberMessage("This group is full"), false);
  assert.equal(isAlreadyMemberMessage("Contribution cycle has already started"), false);
  assert.equal(isAlreadyMemberMessage("Unauthorized: please log in"), false);
  assert.equal(isAlreadyMemberMessage("Internal server error"), false);
  assert.equal(isAlreadyMemberMessage(""), false);
  assert.equal(isAlreadyMemberMessage(undefined), false);
  assert.equal(isAlreadyMemberMessage(null as any), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. JWT IDENTIFIER EXTRACTION AND TOKEN CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("extractUserIdFromToken: extracts user ID from various JWT claim contracts", () => {
  // 1. { id: "usr_1" }
  const t1 = createMockJwt({ id: "usr_1", email: "u1@test.com" });
  assert.equal(extractUserIdFromToken(t1), "usr_1");

  // 2. { _id: "usr_2" } (MongoDB)
  const t2 = createMockJwt({ _id: "usr_2", email: "u2@test.com" });
  assert.equal(extractUserIdFromToken(t2), "usr_2");

  // 3. { userId: "usr_3" }
  const t3 = createMockJwt({ userId: "usr_3" });
  assert.equal(extractUserIdFromToken(t3), "usr_3");

  // 4. { sub: "usr_4" } (Standard JWT subject)
  const t4 = createMockJwt({ sub: "usr_4" });
  assert.equal(extractUserIdFromToken(t4), "usr_4");
});

test("extractEmailFromToken: extracts sanitized email from JWT claims", () => {
  const token = createMockJwt({ id: "u1", email: "  User.Name@Domain.COM  " });
  assert.equal(extractEmailFromToken(token), "user.name@domain.com");
});

test("extractUserIdFromToken: safely handles malformed or non-token strings", () => {
  assert.equal(extractUserIdFromToken(null), null);
  assert.equal(extractUserIdFromToken(undefined), null);
  assert.equal(extractUserIdFromToken(""), null);
  assert.equal(extractUserIdFromToken("not-a-jwt"), null);
  assert.equal(extractUserIdFromToken("header.corrupted-base64!@#.sig"), null);
  assert.equal(extractUserIdFromToken("header.bm90LWpzb24.sig"), null); // valid base64 but not JSON
});

test("getAuthenticatedUserId: prioritizes authUser object and falls back to JWT token", () => {
  const mockToken = createMockJwt({ id: "jwt-user-id" });

  // Priority 1: AuthUser with direct id
  const user1: AuthUser = { id: "auth-user-id", email: "user@example.com" };
  assert.equal(getAuthenticatedUserId(user1, mockToken), "auth-user-id");

  // Priority 2: AuthUser with _id
  const user2: AuthUser = { _id: "mongo-user-id" };
  assert.equal(getAuthenticatedUserId(user2, mockToken), "mongo-user-id");

  // Priority 3: AuthUser with userId property
  const user3: AuthUser = { userId: "alt-user-id" } as any;
  assert.equal(getAuthenticatedUserId(user3, mockToken), "alt-user-id");

  // Priority 4: No AuthUser or empty id -> extracts from token
  assert.equal(getAuthenticatedUserId(null, mockToken), "jwt-user-id");
  assert.equal(getAuthenticatedUserId({}, mockToken), "jwt-user-id");

  // No authUser and no token -> returns empty string
  assert.equal(getAuthenticatedUserId(null, null), "");
});

test("extractEntityId: safely handles primitive and object IDs", () => {
  assert.equal(extractEntityId("id-123"), "id-123");
  assert.equal(extractEntityId(456), "456");
  assert.equal(extractEntityId({ id: "obj-id-789" }), "obj-id-789");
  assert.equal(extractEntityId({ _id: "mongo-id-101" }), "mongo-id-101");
  assert.equal(extractEntityId({ userId: "nested-usr-202" }), "nested-usr-202");
  assert.equal(extractEntityId(null), "");
  assert.equal(extractEntityId(undefined), "");
  assert.equal(extractEntityId({}), "");
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXTENDED MEMBER SHAPES & LIST NORMALIZATION TESTS
// ─────────────────────────────────────────────────────────────────────────────
test("isGroupSavingMember: recognizes member when members array contains primitive string/numeric IDs", () => {
  const groupWithStrings: any = {
    userId: "owner-100",
    members: ["member-200", "member-300"],
  };
  assert.equal(isGroupSavingMember(groupWithStrings, "member-200"), true);
  assert.equal(isGroupSavingMember(groupWithStrings, "member-999"), false);

  const groupWithNums: any = {
    userId: "owner-100",
    members: [200, 300],
  };
  assert.equal(isGroupSavingMember(groupWithNums, "200"), true);
});

test("isGroupSavingMember: recognizes member when member.user is a string ID", () => {
  const group: any = {
    userId: "owner-100",
    members: [{ user: "user-str-id-400", role: "member" }],
  };
  assert.equal(isGroupSavingMember(group, "user-str-id-400"), true);
});

test("isGroupSavingMember: recognizes member when member.memberId is used", () => {
  const group: any = {
    userId: "owner-100",
    members: [{ memberId: "member-id-500", role: "member" }],
  };
  assert.equal(isGroupSavingMember(group, "member-id-500"), true);
});

test("isGroupSavingMember: recognizes member when memberIds or participants aliases are used", () => {
  const groupMemberIds: any = {
    userId: "owner-100",
    memberIds: ["user-600"],
  };
  assert.equal(isGroupSavingMember(groupMemberIds, "user-600"), true);

  const groupParticipants: any = {
    userId: "owner-100",
    participants: [{ userId: "user-700", status: "active" }],
  };
  assert.equal(isGroupSavingMember(groupParticipants, "user-700"), true);
});

test("normalizeGroupSavingsList: unwraps various API response wrapper envelopes", () => {
  const sampleGroup = { id: "g1", name: "Savings 1", userId: "u1" };

  // Direct array: { data: [ ... ] }
  assert.deepEqual(normalizeGroupSavingsList({ data: [sampleGroup] }), [sampleGroup]);

  // Nested: { data: { groupSavings: [ ... ] } }
  assert.deepEqual(
    normalizeGroupSavingsList({ data: { groupSavings: [sampleGroup] } }),
    [sampleGroup],
  );

  // Nested: { data: { groups: [ ... ] } }
  assert.deepEqual(
    normalizeGroupSavingsList({ data: { groups: [sampleGroup] } }),
    [sampleGroup],
  );

  // Direct: { groups: [ ... ] }
  assert.deepEqual(normalizeGroupSavingsList({ groups: [sampleGroup] }), [sampleGroup]);

  // Empty / null cases
  assert.deepEqual(normalizeGroupSavingsList(null), []);
  assert.deepEqual(normalizeGroupSavingsList(undefined), []);
  assert.deepEqual(normalizeGroupSavingsList({}), []);
  assert.deepEqual(normalizeGroupSavingsList({ data: null }), []);
});
