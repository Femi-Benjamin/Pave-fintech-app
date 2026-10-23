import assert from "node:assert/strict";
import test from "node:test";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getGroupProducts,
  createPurchase,
  getPurchaseById,
  continueInstallment,
  getAllPurchases,
  sanitizeUserRecord,
  sanitizePurchaseItem,
} from "../src/api/market";
import type { ProductItem, PurchaseItem } from "../api/market";
import { api } from "../src/lib/api-client";

// Report the base URL used for testing fixtures
const TEST_BASE_URL = api.defaults.baseURL || "https://pave-snowy.vercel.app";
console.log(`[TEST RUNNER] Using configured test base URL: ${TEST_BASE_URL}`);

// Fixtures
const M1_ID = "user-m1-manager";
const M2_ID = "user-m2-manager";
const MEMBER_A_ID = "user-member-a";
const MEMBER_B_ID = "user-member-b";
const NON_MEMBER_C_ID = "user-non-member-c";
const ADMIN_ID = "user-admin";

const G1_ID = "group-g1";
const G2_ID = "group-g2";

const PROD_G1_ID = "prod-g1-100";
const PROD_G2_ID = "prod-g2-200";

const PURCHASE_B_ID = "purchase-b-999";

test("AJO Marketplace: Manager M1 can create products for G1, but not for G2", async () => {
  const originalPost = api.post;

  (api as any).post = async (url: string, data: any) => {
    return {
      data: {
        success: true,
        message: "Product created successfully",
        data: {
          id: PROD_G1_ID,
          userId: M1_ID,
          categoryId: "cat-1",
          productName: "Solar Inverter 5kVA",
          description: "Exclusive for Group G1 [AJO:group-g1]",
          price: "350000.00",
          quantity: 5,
          groupId: G1_ID,
          status: "available",
          productRating: 5,
        },
      },
    };
  };

  try {
    // M1 creating in G1 succeeds
    const res = await createProduct("cat-1", {
      productName: "Solar Inverter 5kVA",
      description: "Exclusive for Group G1",
      price: 350000,
      quantity: 5,
      categoryId: "cat-1",
      groupId: G1_ID,
    });
    assert.equal(res.success, true);
    assert.equal(res.data.id, PROD_G1_ID);
    assert.equal(res.data.groupId, G1_ID);

    // M1 attempting to update product in G2 is blocked by isProductOwner check
    await assert.rejects(
      async () => {
        await updateProduct(
          PROD_G2_ID,
          { productName: "Unauthorized Edit" },
          false, // Not the product owner/manager of G2
        );
      },
      { message: "Unauthorized: You can only edit products belonging to groups you manage." },
    );

    // M1 attempting to delete product in G2 is blocked
    await assert.rejects(
      async () => {
        await deleteProduct(
          PROD_G2_ID,
          0,
          false, // Not the product owner/manager
        );
      },
      { message: "Unauthorized: You can only delete products belonging to groups you manage." },
    );
  } finally {
    api.post = originalPost;
  }
});

test("AJO Marketplace: Non-member C cannot see G1 products", async () => {
  await assert.rejects(
    async () => {
      // Non-member access is rejected
      await getGroupProducts(G1_ID, false, M1_ID);
    },
    { message: "Access Denied: You must be an active member of this AJO group to view its marketplace products." },
  );
});

test("AJO Marketplace: Active member A in G1 can discover products for G1", async () => {
  const originalGet = api.get;

  (api as any).get = async (url: string) => {
    return {
      data: {
        success: true,
        message: "Products retrieved successfully",
        data: [
          {
            id: PROD_G1_ID,
            userId: M1_ID,
            categoryId: "cat-1",
            productName: "Solar Inverter 5kVA",
            description: "Exclusive for Group G1 [AJO:group-g1]",
            price: "350000.00",
            quantity: 5,
            groupId: G1_ID,
            status: "available",
          },
          {
            id: PROD_G2_ID,
            userId: M2_ID,
            categoryId: "cat-2",
            productName: "MacBook Air M2",
            description: "Exclusive for Group G2 [AJO:group-g2]",
            price: "900000.00",
            quantity: 2,
            groupId: G2_ID,
            status: "available",
          },
        ],
      },
    };
  };

  try {
    const products = await getGroupProducts(G1_ID, true, M1_ID);
    assert.equal(products.length, 1);
    assert.equal(products[0].id, PROD_G1_ID);
    assert.equal(products[0].groupId, G1_ID);
  } finally {
    api.get = originalGet;
  }
});

test("AJO Marketplace: Manager M1 cannot purchase own product", async () => {
  await assert.rejects(
    async () => {
      await createPurchase(PROD_G1_ID, {
        quantity: 1,
        amountToPay: 175000,
        sellerUserId: M1_ID,
        buyerUserId: M1_ID, // Buyer is seller
      });
    },
    { message: "AJO managers cannot purchase their own products." },
  );
});

test("AJO Marketplace: Member A cannot view, pay, or access Member B's purchase (IDOR protection)", async () => {
  const originalGet = api.get;

  (api as any).get = async (url: string) => {
    return {
      data: {
        success: true,
        message: "Purchases retrieved successfully",
        data: {
          id: PURCHASE_B_ID,
          userId: MEMBER_B_ID,
          productId: PROD_G2_ID,
          quantity: 1,
          price: "900000.00",
          totalPrice: "900000.00",
          totalAmountPaid: "450000.00",
          totalAmountDue: "450000.00",
          percentage: "50.00",
          purchaseStatus: "in-progress",
          product: {
            id: PROD_G2_ID,
            userId: M2_ID, // Owned by M2
          },
          user: {
            id: MEMBER_B_ID,
            firstName: "Bob",
            email: "bob@example.com",
            password: "$2b$10$LEAKED_HASH_SHOULD_BE_STRIPPED",
            sessionId: "LEAKED_SESSION_ID",
          },
        },
      },
    };
  };

  try {
    // Member A attempting to access Member B's purchase is blocked
    await assert.rejects(
      async () => {
        await getPurchaseById(PURCHASE_B_ID, MEMBER_A_ID);
      },
      (err: Error) => {
        return (
          err.message.includes("Unauthorized access") ||
          err.message.includes("does not belong to your account")
        );
      },
    );

    // Buyer B can access their own purchase
    const bPurchase = await getPurchaseById(PURCHASE_B_ID, MEMBER_B_ID);
    assert.equal(bPurchase.id, PURCHASE_B_ID);
    assert.equal(bPurchase.userId, MEMBER_B_ID);

    // Assert sensitive fields are stripped
    assert.equal((bPurchase.user as any)?.password, undefined);
    assert.equal((bPurchase.user as any)?.sessionId, undefined);

    // Admin can access in read-only mode
    const adminPurchase = await getPurchaseById(PURCHASE_B_ID, ADMIN_ID, "admin");
    assert.equal(adminPurchase.id, PURCHASE_B_ID);
  } finally {
    api.get = originalGet;
  }
});

test("AJO Marketplace: Financial Integrity - Installment cannot exceed totalAmountDue", async () => {
  await assert.rejects(
    async () => {
      await continueInstallment("purchase-123", {
        amountToPay: 200000,
        totalAmountDue: 150000,
      });
    },
    (err: Error) => err.message.includes("cannot exceed the outstanding balance due"),
  );
});

test("AJO Marketplace: Financial Integrity - Installment rejected on completed purchase", async () => {
  await assert.rejects(
    async () => {
      await continueInstallment("purchase-123", {
        amountToPay: 50000,
        totalAmountDue: 0,
        purchaseStatus: "completed",
      });
    },
    { message: "This purchase is already fully paid. No further payments can be accepted." },
  );
});

test("AJO Marketplace: Financial Integrity - Product deletion blocked with in-progress purchases", async () => {
  await assert.rejects(
    async () => {
      await deleteProduct(
        PROD_G1_ID,
        2, // 2 active in-progress purchases exist
        true,
      );
    },
    (err: Error) =>
      err.message.includes("Cannot delete product: There are 2 active in-progress installment purchase(s)"),
  );
});

test("AJO Marketplace: Response Hygiene - No password, sessionId, or token in sanitized responses", () => {
  const dirtyUser = {
    id: "user-123",
    email: "user@example.com",
    firstName: "Alice",
    password: "$2b$10$SuperSecretHash123456789",
    sessionId: "sess-abc-xyz-456",
    token: "eyJhbGciOiJIUzI1Ni...",
    authToken: "bearer-token-123",
  };

  const cleanUser = sanitizeUserRecord(dirtyUser);
  assert.equal(cleanUser?.id, "user-123");
  assert.equal(cleanUser?.email, "user@example.com");
  assert.equal((cleanUser as any)?.password, undefined);
  assert.equal((cleanUser as any)?.sessionId, undefined);
  assert.equal((cleanUser as any)?.token, undefined);
  assert.equal((cleanUser as any)?.authToken, undefined);

  const dirtyPurchase: PurchaseItem = {
    id: "pur-1",
    userId: "user-123",
    productId: "prod-1",
    quantity: 1,
    price: "100000.00",
    totalPrice: "100000.00",
    totalAmountPaid: "50000.00",
    totalAmountDue: "50000.00",
    percentage: "50.00",
    purchaseStatus: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: dirtyUser as any,
  };

  const cleanPurchase = sanitizePurchaseItem(dirtyPurchase);
  assert.equal((cleanPurchase.user as any)?.password, undefined);
  assert.equal((cleanPurchase.user as any)?.sessionId, undefined);
  assert.equal((cleanPurchase.user as any)?.token, undefined);
});
