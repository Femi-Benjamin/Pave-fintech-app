import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllCategories,
  getCategoryById,
  getAllProducts,
  getProductById,
  createPurchase,
  getPurchaseById,
  continueInstallment,
  getAllPurchases,
} from "../src/api/market";
import { formatMoney } from "../src/screens/MarketplaceScreens";
import { api } from "../src/lib/api-client";

test("Market API: formatMoney formats numeric and string currency values correctly", () => {
  assert.equal(formatMoney(200000), "₦200,000");
  assert.equal(formatMoney("200000.00"), "₦200,000");
  assert.equal(formatMoney(1500.5), "₦1,500.5");
  assert.equal(formatMoney(0), "₦0");
  assert.equal(formatMoney(null), "₦0");
  assert.equal(formatMoney(undefined), "₦0");
});

test("Market API: getCategoryById throws when categoryId is empty", async () => {
  await assert.rejects(
    async () => {
      await getCategoryById("");
    },
    { message: "Category ID is required" },
  );

  await assert.rejects(
    async () => {
      await getCategoryById("   ");
    },
    { message: "Category ID is required" },
  );
});

test("Market API: getProductById throws when productId is empty", async () => {
  await assert.rejects(
    async () => {
      await getProductById("");
    },
    { message: "Product ID is required" },
  );

  await assert.rejects(
    async () => {
      await getProductById("   ");
    },
    { message: "Product ID is required" },
  );
});

test("Market API: createPurchase validates quantity and amountToPay", async () => {
  // Empty productId
  await assert.rejects(
    async () => {
      await createPurchase("", { quantity: 1, amountToPay: 1000 });
    },
    { message: "Product ID is required to initiate purchase" },
  );

  // Invalid quantity
  await assert.rejects(
    async () => {
      await createPurchase("prod-123", { quantity: 0, amountToPay: 1000 });
    },
    { message: "Purchase quantity must be an integer of at least 1" },
  );

  await assert.rejects(
    async () => {
      await createPurchase("prod-123", { quantity: 1.5, amountToPay: 1000 });
    },
    { message: "Purchase quantity must be an integer of at least 1" },
  );

  // Invalid amountToPay
  await assert.rejects(
    async () => {
      await createPurchase("prod-123", { quantity: 1, amountToPay: 0 });
    },
    { message: "Initial payment amount must be greater than zero" },
  );

  await assert.rejects(
    async () => {
      await createPurchase("prod-123", { quantity: 1, amountToPay: -500 });
    },
    { message: "Initial payment amount must be greater than zero" },
  );
});

test("Market API: continueInstallment validates purchaseId and amountToPay", async () => {
  await assert.rejects(
    async () => {
      await continueInstallment("", { amountToPay: 1000 });
    },
    { message: "Purchase ID is required" },
  );

  await assert.rejects(
    async () => {
      await continueInstallment("purchase-123", { amountToPay: 0 });
    },
    { message: "Installment payment amount must be greater than zero" },
  );

  await assert.rejects(
    async () => {
      await continueInstallment("purchase-123", { amountToPay: -100 });
    },
    { message: "Installment payment amount must be greater than zero" },
  );
});

test("Market API: getPurchaseById rejects unauthorized purchase view", async () => {
  const originalGet = api.get;

  // Mock response returning purchase for user 'user-victim-123'
  (api as any).get = async (url: string) => {
    return {
      data: {
        success: true,
        message: "Purchases retrieved successfully",
        data: {
          id: "purchase-999",
          userId: "user-victim-123",
          productId: "prod-xyz",
          quantity: 1,
          price: "200000.00",
          totalPrice: "200000.00",
          totalAmountPaid: "25000.00",
          totalAmountDue: "175000.00",
          percentage: "12.50",
          purchaseStatus: "in-progress",
        },
      },
    };
  };

  try {
    await assert.rejects(
      async () => {
        // Authenticated user is 'user-attacker-456', which does not match 'user-victim-123'
        await getPurchaseById("purchase-999", "user-attacker-456");
      },
      (err: Error) => {
        return (
          err.message.includes("Unauthorized access") ||
          err.message.includes("does not belong to your account")
        );
      },
    );
  } finally {
    api.get = originalGet;
  }
});

test("Market API: getPurchaseById allows access when userId matches", async () => {
  const originalGet = api.get;
  (api as any).get = async (url: string) => {
    return {
      data: {
        success: true,
        message: "Purchases retrieved successfully",
        data: {
          id: "purchase-999",
          userId: "user-legit-123",
          productId: "prod-xyz",
          quantity: 1,
          price: "200000.00",
          totalPrice: "200000.00",
          totalAmountPaid: "25000.00",
          totalAmountDue: "175000.00",
          percentage: "12.50",
          purchaseStatus: "in-progress",
        },
      },
    };
  };

  try {
    const purchase = await getPurchaseById("purchase-999", "user-legit-123");
    assert.equal(purchase.id, "purchase-999");
    assert.equal(purchase.userId, "user-legit-123");
  } finally {
    api.get = originalGet;
  }
});

test("Market API: getAllPurchases filters list to current user", async () => {
  const originalGet = api.get;
  (api as any).get = async (url: string) => {
    return {
      data: {
        success: true,
        message: "Purchases retrieved successfully",
        data: [
          { id: "p1", userId: "user-alice" },
          { id: "p2", userId: "user-bob" },
          { id: "p3", userId: "user-alice" },
        ],
      },
    };
  };

  try {
    const list = await getAllPurchases("user-alice");
    assert.equal(list.length, 2);
    assert.ok(list.every((p) => p.userId === "user-alice"));
  } finally {
    api.get = originalGet;
  }
});

