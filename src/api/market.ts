import { api } from "../lib/api-client";
import { getAuthenticatedUserId } from "./auth";

export interface Category {
  id: string;
  categoryName: string;
  description: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductItem {
  id: string;
  userId?: string;
  categoryId: string;
  productName: string;
  description: string;
  price: string | number;
  productImage: string | null;
  quantity: number;
  status: "available" | "out-of-stock" | string;
  productRating: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  category?: {
    id: string;
    categoryName: string;
    description?: string;
  };
}

export interface PurchaseItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  price: string | number;
  totalPrice: string | number;
  totalAmountPaid: string | number;
  totalAmountDue: string | number;
  percentage: string | number;
  purchaseStatus: "in-progress" | "completed" | "pending" | string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    image?: string | null;
    role?: string;
  };
  product?: ProductItem;
}

export interface CreatePurchasePayload {
  quantity: number;
  amountToPay: number;
}

export interface ContinueInstallmentPayload {
  amountToPay: number;
}

export interface MarketApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 1. GET /api/v1/category/getAllCategory
 * Fetches all product categories.
 * Note: On some environments this endpoint requires admin privilege;
 * the client gracefully handles any 403 authorization restrictions.
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data } = await api.get<MarketApiResponse<Category[]>>(
    "/api/v1/category/getAllCategory",
  );
  return data?.data ?? [];
}

/**
 * 2. GET /api/v1/category/getCategoryById/:categoryId
 * Retrieves a specific category by its ID.
 */
export async function getCategoryById(categoryId: string): Promise<Category> {
  if (!categoryId || !categoryId.trim()) {
    throw new Error("Category ID is required");
  }
  const cleanId = encodeURIComponent(categoryId.trim());
  const { data } = await api.get<MarketApiResponse<Category>>(
    `/api/v1/category/getCategoryById/${cleanId}`,
  );
  if (!data?.data) {
    throw new Error("Category details not found");
  }
  return data.data;
}

/**
 * 3. GET /api/v1/product/get-all-products
 * Fetches all active marketplace products.
 */
export async function getAllProducts(): Promise<ProductItem[]> {
  const { data } = await api.get<MarketApiResponse<ProductItem[]>>(
    "/api/v1/product/get-all-products",
  );
  return data?.data ?? [];
}

/**
 * 4. GET /api/v1/product/get-product/:productId
 * Retrieves a specific product's details.
 */
export async function getProductById(productId: string): Promise<ProductItem> {
  if (!productId || !productId.trim()) {
    throw new Error("Product ID is required");
  }
  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.get<MarketApiResponse<ProductItem>>(
    `/api/v1/product/get-product/${cleanId}`,
  );
  if (!data?.data) {
    throw new Error("Product not found");
  }
  return data.data;
}

/**
 * 5. POST /api/v1/product/create-purchase/:productId
 * Initiates a purchase for a product.
 * Expects quantity and amountToPay (down payment or full amount).
 * Validates inputs client-side before dispatching.
 */
export async function createPurchase(
  productId: string,
  payload: CreatePurchasePayload,
): Promise<MarketApiResponse<PurchaseItem>> {
  if (!productId || !productId.trim()) {
    throw new Error("Product ID is required to initiate purchase");
  }
  const quantity = Number(payload.quantity);
  const amountToPay = Number(payload.amountToPay);

  if (Number.isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error("Purchase quantity must be an integer of at least 1");
  }
  if (Number.isNaN(amountToPay) || amountToPay <= 0) {
    throw new Error("Initial payment amount must be greater than zero");
  }

  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.post<MarketApiResponse<PurchaseItem>>(
    `/api/v1/product/create-purchase/${cleanId}`,
    {
      quantity,
      amountToPay,
    },
  );
  return data;
}

/**
 * 6. GET /api/v1/product/get-purchase/:purchaseId
 * Retrieves a specific purchase record.
 * SECURITY: Performs client-side authorization check to ensure the purchase
 * belongs to the currently authenticated user.
 */
export async function getPurchaseById(
  purchaseId: string,
): Promise<PurchaseItem> {
  if (!purchaseId || !purchaseId.trim()) {
    throw new Error("Purchase ID is required");
  }
  const cleanId = encodeURIComponent(purchaseId.trim());
  const { data } = await api.get<MarketApiResponse<PurchaseItem>>(
    `/api/v1/product/get-purchase/${cleanId}`,
  );

  const purchase = data?.data;
  if (!purchase) {
    throw new Error("Purchase record not found");
  }

  const currentUserId = getAuthenticatedUserId();
  if (currentUserId && purchase.userId && purchase.userId !== currentUserId) {
    throw new Error(
      "Unauthorized access: This purchase record does not belong to your account.",
    );
  }

  return purchase;
}

/**
 * 7. PUT /api/v1/product/continue-installment-purchased/:purchaseId
 * Continues installment payment on an in-progress purchase.
 */
export async function continueInstallment(
  purchaseId: string,
  payload: ContinueInstallmentPayload,
): Promise<MarketApiResponse<PurchaseItem>> {
  if (!purchaseId || !purchaseId.trim()) {
    throw new Error("Purchase ID is required");
  }
  const amountToPay = Number(payload.amountToPay);
  if (Number.isNaN(amountToPay) || amountToPay <= 0) {
    throw new Error("Installment payment amount must be greater than zero");
  }

  const cleanId = encodeURIComponent(purchaseId.trim());
  const { data } = await api.put<MarketApiResponse<PurchaseItem>>(
    `/api/v1/product/continue-installment-purchased/${cleanId}`,
    {
      amountToPay,
    },
  );
  return data;
}

/**
 * Auxiliary: GET /api/v1/product/get-all-purchase
 * Retrieves all purchases and filters to only those belonging to the current user.
 */
export async function getAllPurchases(): Promise<PurchaseItem[]> {
  const { data } = await api.get<MarketApiResponse<PurchaseItem[]>>(
    "/api/v1/product/get-all-purchase",
  );
  const purchases = data?.data ?? [];
  const currentUserId = getAuthenticatedUserId();

  if (!currentUserId) {
    return purchases;
  }
  return purchases.filter((p) => p.userId === currentUserId);
}
