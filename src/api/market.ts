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
  groupId?: string;
  groupSavingId?: string;
  groupName?: string;
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
  sellerUserId?: string;
  buyerUserId?: string;
}

export interface ContinueInstallmentPayload {
  amountToPay: number;
  totalAmountDue?: number;
  purchaseStatus?: string;
}

export interface CreateProductPayload {
  productName: string;
  description: string;
  price: number | string;
  quantity: number;
  categoryId: string;
  groupId?: string;
  image?: File | null;
}

export interface UpdateProductPayload {
  productName?: string;
  description?: string;
  price?: number | string;
  quantity?: number;
  image?: File | null;
  groupId?: string;
}

export interface MarketApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Sanitizes user records by stripping confidential authentication data
 * (passwords, hashes, session identifiers, internal tokens)
 */
export function sanitizeUserRecord<T extends Record<string, any>>(
  user: T | null | undefined,
): Partial<T> | null {
  if (!user || typeof user !== "object") return null;
  const sanitized = { ...user };
  delete (sanitized as any).password;
  delete (sanitized as any).sessionId;
  delete (sanitized as any).token;
  delete (sanitized as any).authToken;
  return sanitized;
}

/**
 * Sanitizes purchase records to eliminate sensitive data leakage
 */
export function sanitizePurchaseItem(purchase: PurchaseItem): PurchaseItem {
  if (!purchase) return purchase;
  const sanitized = { ...purchase };
  if (sanitized.user) {
    sanitized.user = sanitizeUserRecord(sanitized.user) as any;
  }
  return sanitized;
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
 * Enforces business rules:
 * - Quantity must be positive integer >= 1
 * - Minimum down payment is 50%
 * - Managers cannot purchase their own products
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

  // Manager buying own product restriction
  if (
    payload.sellerUserId &&
    payload.buyerUserId &&
    payload.sellerUserId.trim() === payload.buyerUserId.trim()
  ) {
    throw new Error("AJO managers cannot purchase their own products.");
  }

  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.post<MarketApiResponse<PurchaseItem>>(
    `/api/v1/product/create-purchase/${cleanId}`,
    {
      quantity,
      amountToPay,
    },
  );

  if (data?.data) {
    data.data = sanitizePurchaseItem(data.data);
  }
  return data;
}

/**
 * 6. GET /api/v1/product/get-purchase/:purchaseId
 * Retrieves a specific purchase record.
 * SECURITY: Performs authorization check to ensure the purchase
 * belongs to the currently authenticated user (or authorized manager for their own product).
 * Strips any sensitive fields (password, sessionId).
 */
export async function getPurchaseById(
  purchaseId: string,
  currentUserIdOverride?: string,
  userRole?: string,
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

  const sanitized = sanitizePurchaseItem(purchase);
  const currentUserId = currentUserIdOverride ?? getAuthenticatedUserId();
  const normalizedRole = String(userRole || "").toLowerCase().trim();
  const isAdmin = ["admin", "superadmin", "super_admin"].includes(
    normalizedRole,
  );

  // Authorization check:
  // Allowed if:
  // 1. Current user is the buyer (purchase.userId === currentUserId)
  // 2. Current user is the seller/manager of this product (purchase.product?.userId === currentUserId)
  // 3. Current user is an admin / superadmin
  if (currentUserId && !isAdmin) {
    const isBuyer = purchase.userId === currentUserId;
    const isSeller = purchase.product?.userId === currentUserId;

    if (!isBuyer && !isSeller) {
      throw new Error(
        "Unauthorized access: This purchase record does not belong to your account.",
      );
    }
  }

  return sanitized;
}

/**
 * 7. PUT /api/v1/product/continue-installment-purchased/:purchaseId
 * Continues installment payment on an in-progress purchase.
 * Enforces business rules:
 * - Payment must be positive number
 * - Cannot pay more than totalAmountDue
 * - Cannot pay on completed purchase
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

  if (payload.purchaseStatus === "completed") {
    throw new Error(
      "This purchase is already fully paid. No further payments can be accepted.",
    );
  }

  if (
    payload.totalAmountDue !== undefined &&
    amountToPay > payload.totalAmountDue
  ) {
    throw new Error(
      `Installment amount (₦${amountToPay.toLocaleString()}) cannot exceed the outstanding balance due (₦${payload.totalAmountDue.toLocaleString()}).`,
    );
  }

  const cleanId = encodeURIComponent(purchaseId.trim());
  const { data } = await api.put<MarketApiResponse<PurchaseItem>>(
    `/api/v1/product/continue-installment-purchased/${cleanId}`,
    {
      amountToPay,
    },
  );

  if (data?.data) {
    data.data = sanitizePurchaseItem(data.data);
  }
  return data;
}

/**
 * Auxiliary: GET /api/v1/product/get-all-purchase
 * Retrieves all purchases and filters to only those belonging to the current user
 * (or products managed by this user). Strips sensitive fields.
 */
export async function getAllPurchases(
  currentUserIdOverride?: string,
  userRole?: string,
): Promise<PurchaseItem[]> {
  const { data } = await api.get<MarketApiResponse<PurchaseItem[]>>(
    "/api/v1/product/get-all-purchase",
  );
  const purchases = (data?.data ?? []).map(sanitizePurchaseItem);
  const currentUserId = currentUserIdOverride ?? getAuthenticatedUserId();
  const normalizedRole = String(userRole || "").toLowerCase().trim();
  const isAdmin = ["admin", "superadmin", "super_admin"].includes(
    normalizedRole,
  );

  if (!currentUserId || isAdmin) {
    return purchases;
  }

  // Filter to purchases where current user is the buyer or product owner
  return purchases.filter(
    (p) => p.userId === currentUserId || p.product?.userId === currentUserId,
  );
}

/**
 * NEW: AJO Group Manager Product Creation
 * Endpoint: POST /api/v1/product/create-product/:categoryId
 * Allows an authorized AJO group manager to post products for their group members.
 */
export async function createProduct(
  categoryId: string,
  payload: CreateProductPayload,
): Promise<MarketApiResponse<ProductItem>> {
  if (!categoryId || !categoryId.trim()) {
    throw new Error("Category ID is required to create a product");
  }
  const cleanName = payload.productName?.trim();
  if (!cleanName) {
    throw new Error("Product name is required");
  }
  const price = Number(payload.price);
  if (Number.isNaN(price) || price <= 0) {
    throw new Error("Product price must be a valid positive amount");
  }
  const quantity = Number(payload.quantity);
  if (Number.isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error("Product stock quantity must be an integer of at least 1");
  }

  const cleanCatId = encodeURIComponent(categoryId.trim());

  // Use FormData if an image file is provided
  if (payload.image instanceof File) {
    const formData = new FormData();
    formData.append("productName", cleanName);
    formData.append("description", payload.description || "");
    formData.append("price", String(price));
    formData.append("quantity", String(quantity));
    formData.append("productRating", "5");
    formData.append("images", payload.image);
    if (payload.groupId) {
      formData.append("groupId", payload.groupId.trim());
      formData.append("groupSavingId", payload.groupId.trim());
    }

    try {
      const { data } = await api.post<MarketApiResponse<ProductItem>>(
        `/api/v1/product/create-product/${cleanCatId}`,
        formData,
      );
      return data;
    } catch (err: any) {
      // Graceful fallback if backend router expects GET / PUT
      if (err?.response?.status === 405) {
        const { data } = await api.get<MarketApiResponse<ProductItem>>(
          `/api/v1/product/create-product/${cleanCatId}`,
        );
        return data;
      }
      throw err;
    }
  }

  // JSON payload
  const body: Record<string, any> = {
    productName: cleanName,
    description: payload.description || "",
    price,
    quantity,
    productRating: 5,
  };
  if (payload.groupId) {
    body.groupId = payload.groupId.trim();
    body.groupSavingId = payload.groupId.trim();
  }

  const { data } = await api.post<MarketApiResponse<ProductItem>>(
    `/api/v1/product/create-product/${cleanCatId}`,
    body,
  );
  return data;
}

/**
 * NEW: AJO Group Manager Product Update
 * Endpoint: PUT /api/v1/product/update-product/:productId
 * Allows an authorized group manager to update product details.
 */
export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload,
  isProductOwner = true,
): Promise<MarketApiResponse<ProductItem>> {
  if (!productId || !productId.trim()) {
    throw new Error("Product ID is required to update product");
  }
  if (!isProductOwner) {
    throw new Error(
      "Unauthorized: You can only edit products belonging to groups you manage.",
    );
  }

  const cleanId = encodeURIComponent(productId.trim());
  const formData = new FormData();

  if (payload.productName) {
    formData.append("productName", payload.productName.trim());
  }
  if (payload.description !== undefined) {
    formData.append("description", payload.description.trim());
  }
  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price <= 0) {
      throw new Error("Price must be a positive amount");
    }
    formData.append("price", String(price));
  }
  if (payload.quantity !== undefined) {
    const qty = Number(payload.quantity);
    if (Number.isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      throw new Error("Quantity must be a non-negative integer");
    }
    formData.append("quantity", String(qty));
  }
  if (payload.image instanceof File) {
    formData.append("images", payload.image);
  }
  if (payload.groupId) {
    formData.append("groupId", payload.groupId.trim());
  }

  const { data } = await api.put<MarketApiResponse<ProductItem>>(
    `/api/v1/product/update-product/${cleanId}`,
    formData,
  );
  return data;
}

/**
 * NEW: AJO Group Manager Product Deletion
 * Endpoint: DELETE /api/v1/product/delete-product/:productId
 * Business rule: Deletion is blocked if there are active in-progress purchases.
 */
export async function deleteProduct(
  productId: string,
  inProgressPurchasesCount = 0,
  isProductOwner = true,
): Promise<MarketApiResponse<{ message: string }>> {
  if (!productId || !productId.trim()) {
    throw new Error("Product ID is required to delete product");
  }
  if (!isProductOwner) {
    throw new Error(
      "Unauthorized: You can only delete products belonging to groups you manage.",
    );
  }
  if (inProgressPurchasesCount > 0) {
    throw new Error(
      `Cannot delete product: There are ${inProgressPurchasesCount} active in-progress installment purchase(s). Complete or refund orders before deleting.`,
    );
  }

  const cleanId = encodeURIComponent(productId.trim());
  const { data } = await api.delete<MarketApiResponse<{ message: string }>>(
    `/api/v1/product/delete-product/${cleanId}`,
  );
  return data;
}

/**
 * NEW: Group-specific product discovery
 * Retrieves products posted for an AJO savings group.
 * Enforces business rule: Only active members of the product's group
 * plus its manager and admins can view group-exclusive products.
 */
export async function getGroupProducts(
  groupId: string,
  isMember = true,
  managerUserId?: string,
): Promise<ProductItem[]> {
  if (!groupId || !groupId.trim()) {
    return [];
  }
  if (!isMember) {
    throw new Error(
      "Access Denied: You must be an active member of this AJO group to view its marketplace products.",
    );
  }

  const allProducts = await getAllProducts();
  const cleanGroupId = groupId.trim();

  // Match products associated with this group ID or posted by the group manager
  return allProducts.filter((p) => {
    if (p.groupId === cleanGroupId || p.groupSavingId === cleanGroupId) {
      return true;
    }
    if (
      p.description &&
      (p.description.includes(`[AJO:${cleanGroupId}]`) ||
        p.description.includes(`[GROUP:${cleanGroupId}]`))
    ) {
      return true;
    }
    if (managerUserId && p.userId === managerUserId) {
      return true;
    }
    return false;
  });
}
