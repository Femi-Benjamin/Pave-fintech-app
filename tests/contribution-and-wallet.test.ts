import assert from "node:assert/strict";
import test from "node:test";
import {
  createSavingContribution,
  getSavingContributions,
  getContribution,
} from "../src/api/savings";

// Helper function that mirrors the extraction logic in WalletScreen
function extractVirtualAccountFromResponse(
  rawVAccount: any,
  potentialMessage?: string,
  savedAccountNum?: string,
  savedBankName?: string,
) {
  let parsedNumFromMsg = "";
  let parsedBankFromMsg = "";

  if (potentialMessage) {
    const numMatch = potentialMessage.match(/\b\d{10}\b/);
    if (numMatch) {
      parsedNumFromMsg = numMatch[0];
    }
    if (/wema/i.test(potentialMessage)) {
      parsedBankFromMsg = "Wema Bank";
    } else {
      const bankMatch = potentialMessage.match(/,\s*([A-Za-z0-9\s]+(?:Bank)?)/i);
      if (bankMatch && bankMatch[1] && bankMatch[1].trim().length < 30) {
        parsedBankFromMsg = bankMatch[1].trim();
      }
    }
  }

  const extractedAccountNumber =
    (typeof rawVAccount === "object" && rawVAccount !== null
      ? rawVAccount.accountNumber ||
        rawVAccount.account_number ||
        rawVAccount.accountNo ||
        rawVAccount.virtualAccountNumber
      : "") ||
    parsedNumFromMsg ||
    savedAccountNum ||
    "";

  const extractedBankName =
    (typeof rawVAccount === "object" && rawVAccount !== null
      ? rawVAccount.bankName || rawVAccount.bank_name
      : "") ||
    parsedBankFromMsg ||
    savedBankName ||
    "Wema Bank";

  return { extractedAccountNumber, extractedBankName };
}

test("Wallet: successfully extracts 10-digit NUBAN and Wema Bank from message 'You already had an account: 9817600139, Wema Bank'", () => {
  const result = extractVirtualAccountFromResponse(
    null,
    "You already had an account: 9817600139, Wema Bank",
  );
  assert.equal(result.extractedAccountNumber, "9817600139");
  assert.equal(result.extractedBankName, "Wema Bank");
});

test("Wallet: prioritizes structured account object fields if returned by backend", () => {
  const result = extractVirtualAccountFromResponse(
    { accountNumber: "1234567890", bankName: "Wema Bank" },
    "Some secondary message",
  );
  assert.equal(result.extractedAccountNumber, "1234567890");
  assert.equal(result.extractedBankName, "Wema Bank");
});

test("Wallet: falls back to cached account number when message is empty and no object present", () => {
  const result = extractVirtualAccountFromResponse(
    null,
    "",
    "9817600139",
    "Wema Bank",
  );
  assert.equal(result.extractedAccountNumber, "9817600139");
  assert.equal(result.extractedBankName, "Wema Bank");
});

test("Savings API: createSavingContribution, getSavingContributions, and getContribution functions are exported", () => {
  assert.equal(typeof createSavingContribution, "function");
  assert.equal(typeof getSavingContributions, "function");
  assert.equal(typeof getContribution, "function");
});

test("Savings API: validate that missing parameters throw errors appropriately", async () => {
  await assert.rejects(
    () => createSavingContribution("", { amount: 1000, remarks: "Test" }),
    /A saving ID is required/,
  );
  await assert.rejects(
    () => getSavingContributions(""),
    /A saving ID is required/,
  );
  await assert.rejects(
    () => getContribution(""),
    /A contribution ID is required/,
  );
});
