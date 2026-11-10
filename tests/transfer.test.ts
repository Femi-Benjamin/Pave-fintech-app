import assert from "node:assert/strict";
import test from "node:test";
import {
  isAjoAdmin,
  validateAccountNumber,
  validateTransferAmount,
  validateTransferReason,
  markAccountVerified,
  clearVerifiedAccounts,
  makeTransfer,
} from "../src/api/transfer";
import { api } from "../src/lib/api-client";

test("Transfer Helper: isAjoAdmin correctly identifies admin / owner roles", () => {
  assert.equal(isAjoAdmin("admin", "u1"), true);
  assert.equal(isAjoAdmin("owner", "u1"), true);
  assert.equal(isAjoAdmin("user", "u1"), false);
  assert.equal(isAjoAdmin({ role: "admin" }, "u1"), true);
  assert.equal(isAjoAdmin({ userId: "u1" }, "u1"), true);
  assert.equal(
    isAjoAdmin(
      { members: [{ userId: "u1", role: "admin" }] },
      "u1",
    ),
    true,
  );
  assert.equal(
    isAjoAdmin(
      { members: [{ userId: "u1", role: "member" }] },
      "u1",
    ),
    false,
  );
  assert.equal(isAjoAdmin(null, "u1"), false);
  assert.equal(isAjoAdmin(undefined, "u1"), false);
  assert.equal(isAjoAdmin([], "u1"), false);
  assert.equal(isAjoAdmin([{ role: "member" }, { role: "admin" }], "u1"), true);
  assert.equal(isAjoAdmin([{ role: "member" }], "u1"), false);
});

test("Transfer Helper: validateAccountNumber enforces 10 digits only", () => {
  assert.equal(validateAccountNumber("0123456789").valid, true);
  assert.equal(validateAccountNumber("12345").valid, false);
  assert.equal(validateAccountNumber("01234567891").valid, false);
  assert.equal(validateAccountNumber("012345678a").valid, false);
  assert.equal(validateAccountNumber("").valid, false);
});

test("Transfer Helper: validateTransferAmount validates positivity, decimals, and wallet balance", () => {
  assert.equal(validateTransferAmount("5000", 10000).valid, true);
  assert.equal(validateTransferAmount("5000.50", 10000).valid, true);
  assert.equal(validateTransferAmount("0", 10000).valid, false);
  assert.equal(validateTransferAmount("-100", 10000).valid, false);
  assert.equal(validateTransferAmount("abc", 10000).valid, false);
  assert.equal(validateTransferAmount("5000.123", 10000).valid, false);
  assert.equal(validateTransferAmount("15000", 10000).valid, false); // exceeds wallet
});

test("Transfer Helper: validateTransferReason checks required text and max length", () => {
  assert.equal(validateTransferReason("Monthly payout").valid, true);
  assert.equal(validateTransferReason("   ").valid, false);
  assert.equal(
    validateTransferReason("a".repeat(101)).valid,
    false,
  );
});

test("Transfer API: verifyAccountName uses query params and no body", async () => {
  const originalPost = api.post;
  let requestedUrl = "";
  let requestConfig: any = null;

  (api as any).post = async (url: string, body: any, config: any) => {
    requestedUrl = url;
    requestConfig = config;
    return {
      data: {
        success: true,
        data: {
          account_number: "0123456789",
          account_name: "TEST USER",
          bank_id: 1,
        },
      },
    };
  };

  try {
    const { verifyAccountName } = await import("../src/api/transfer");
    const result = await verifyAccountName({
      accountNumber: "0123456789",
      bankCode: "044",
    });

    assert.equal(requestedUrl, "/api/v1/transfer/verifyAccountName");
    assert.equal(requestConfig?.params?.accountNumber, "0123456789");
    assert.equal(requestConfig?.params?.bankCode, "044");
    assert.equal(result.account_name, "TEST USER");
  } finally {
    api.post = originalPost;
  }
});

test("Transfer API: makeTransfer body has exact keys: amount, accountNumber, bankCode, reason with amount as string", async () => {
  const originalPost = api.post;
  let postedBody: any = null;

  (api as any).post = async (url: string, body: any) => {
    if (url.includes("make-transfer")) {
      postedBody = body;
    }
    return {
      data: {
        message: "Transfer initiated successfully",
        transaction: {
          id: "txn-1",
          status: "pending",
          reference: "ref-123",
          amount: 20000,
          transactionFees: "78.00",
          destination: "Access Bank 0123456789 TEST USER",
          currency: "NGN",
        },
      },
    };
  };

  try {
    clearVerifiedAccounts();
    markAccountVerified("044", "0123456789");

    const res = await makeTransfer({
      amount: 20000,
      accountNumber: "0123456789",
      bankCode: "044",
      reason: "Test transfer",
      walletBalance: 50000,
    });

    assert.ok(postedBody);
    const keys = Object.keys(postedBody).sort();
    assert.deepEqual(keys, ["accountNumber", "amount", "bankCode", "reason"]);
    assert.equal(typeof postedBody.amount, "string");
    assert.equal(postedBody.amount, "20000");
    assert.equal(postedBody.accountNumber, "0123456789");
    assert.equal(postedBody.bankCode, "044");
    assert.equal(postedBody.reason, "Test transfer");

    assert.equal(res.message, "Transfer initiated successfully");
    assert.equal(res.transaction.status, "pending");
  } finally {
    api.post = originalPost;
    clearVerifiedAccounts();
  }
});

test("Transfer API Guard: makeTransfer cannot be called before verification succeeded for the same bank + account", async () => {
  clearVerifiedAccounts();
  await assert.rejects(
    async () => {
      await makeTransfer({
        amount: 1000,
        accountNumber: "9876543210",
        bankCode: "035",
        reason: "Unverified transfer",
        walletBalance: 10000,
      });
    },
    { message: "Account must be verified before initiating transfer." },
  );
});

test("Transfer API: verifyAccountName never sends a literal null body on the wire", async () => {
  const originalAdapter = api.defaults.adapter;
  let sentData: any = "unset";
  let sentUrl = "";
  (api.defaults as any).adapter = async (config: any) => {
    sentData = config.data;
    sentUrl = String(config.url);
    return {
      data: { success: true, data: { account_number: "0123456789", account_name: "T", bank_id: 1 } },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  try {
    const { verifyAccountName } = await import("../src/api/transfer");
    await verifyAccountName({ accountNumber: "0123456789", bankCode: "044" });
    assert.notEqual(sentData, "null", "body must not be the JSON literal null");
    assert.notEqual(sentData, null);
    assert.equal(sentData, "{}");
    assert.ok(sentUrl.includes("verifyAccountName"));
  } finally {
    (api.defaults as any).adapter = originalAdapter;
  }
});
