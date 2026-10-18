import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import {
  uploadUserImage,
  uploadNinImage,
  verifySecurityAnswer,
  verifyMfaToken,
  forgotPassword,
  resetPassword,
  deleteUserAccount,
  loginWithFinger,
  verifyNin,
  extractUserIdFromToken,
  getAuthenticatedUserId,
  getApiErrorMessage,
} from "../src/api/auth";

test("API 1: User Image Upload validates file format and size", async () => {
  // Reject missing file
  await assert.rejects(
    () => uploadUserImage(null as any),
    /Please select an image file to upload/i,
  );

  // Reject unsupported mime type
  const textFile = new File(["dummy text"], "test.txt", { type: "text/plain" });
  await assert.rejects(
    () => uploadUserImage(textFile),
    /Only JPEG, PNG, and WebP image formats are supported/i,
  );

  // Reject oversized file (> 5MB)
  const largeBlob = new Uint8Array(6 * 1024 * 1024);
  const oversizedFile = new File([largeBlob], "huge.png", { type: "image/png" });
  await assert.rejects(
    () => uploadUserImage(oversizedFile),
    /Profile image size must not exceed 5MB/i,
  );
});

test("API 2: NIN Image Upload validates document format and size", async () => {
  await assert.rejects(
    () => uploadNinImage(null as any),
    /Please select a document image to upload/i,
  );

  const exeFile = new File(["binary"], "file.exe", { type: "application/x-msdownload" });
  await assert.rejects(
    () => uploadNinImage(exeFile),
    /Only JPEG, PNG, WebP, or PDF files are supported/i,
  );

  const largeBlob = new Uint8Array(6 * 1024 * 1024);
  const oversizedFile = new File([largeBlob], "huge.pdf", { type: "application/pdf" });
  await assert.rejects(
    () => uploadNinImage(oversizedFile),
    /Document file size must not exceed 5MB/i,
  );
});

test("API 3: Security Question & Answer verification signature and exports", () => {
  assert.equal(typeof verifySecurityAnswer, "function");
});

test("API 4: User Deletes Account (toggleBlockUser) export and contract", () => {
  assert.equal(typeof deleteUserAccount, "function");
});

test("API 5: Verify MFA Token (TOTP) validates token string", async () => {
  await assert.rejects(
    () => verifyMfaToken({ token: "" }),
    /A valid MFA token is required/i,
  );

  await assert.rejects(
    () => verifyMfaToken({ token: "   " }),
    /A valid MFA token is required/i,
  );
});

test("API 6: Forgot Password export and contract", () => {
  assert.equal(typeof forgotPassword, "function");
});

test("API 7: Reset Password export and contract", () => {
  assert.equal(typeof resetPassword, "function");
});

test("API 8: Login with Fingerprint validates user ID presence", async () => {
  await assert.rejects(
    () => loginWithFinger(""),
    /A valid User ID is required/i,
  );
  await assert.rejects(
    () => loginWithFinger("   "),
    /A valid User ID is required/i,
  );
});

test("API 9: Verify NIN validates 11-digit NIN and required front ID", async () => {
  const dummyFront = new File(["front"], "front.jpg", { type: "image/jpeg" });

  // Missing or invalid NIN
  await assert.rejects(
    () => verifyNin({ nin: "12345", ninFrontId: dummyFront }),
    /A valid 11-digit NIN is required/i,
  );

  await assert.rejects(
    () => verifyNin({ nin: "1234567890a", ninFrontId: dummyFront }),
    /A valid 11-digit NIN is required/i,
  );

  // Missing front image
  await assert.rejects(
    () => verifyNin({ nin: "12345678901", ninFrontId: null as any }),
    /Front ID photo is required/i,
  );
});

test("Rebranding: metadata.json and index.html reflect PAVEPADI branding", () => {
  const metadata = JSON.parse(fs.readFileSync("metadata.json", "utf8"));
  assert.equal(metadata.name, "PAVEPADI Digital Wallet");

  const indexHtml = fs.readFileSync("index.html", "utf8");
  assert.ok(indexHtml.includes("<title>PAVEPADI Digital Wallet</title>"));
  assert.ok(indexHtml.includes("PAVEPADI - Smart digital wallet"));

  const manifest = JSON.parse(fs.readFileSync("public/manifest.json", "utf8"));
  assert.equal(manifest.short_name, "PAVEPADI");
  assert.equal(manifest.name, "PAVEPADI Digital Wallet");
});

test("Rebranding: Logo and key application components use PAVEPADI", () => {
  const logoContent = fs.readFileSync("src/components/Logo.tsx", "utf8");
  assert.ok(logoContent.includes("PAVEPADI"));
  assert.ok(!logoContent.includes('>PAVE<'));

  const protectedRoute = fs.readFileSync("src/components/ProtectedRoute.tsx", "utf8");
  assert.ok(protectedRoute.includes("PAVEPADI"));
});
