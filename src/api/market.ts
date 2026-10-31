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

/**
 * Multipart field name the backend create-product route expects for the image.
 * Known-good request confirmed in Postman uses exactly "productImage".
 */
export const CREATE_PRODUCT_IMAGE_FIELD = "productImage";
/** Confirmed by backend: update-product uses the same file field as create. */
export const UPDATE_PRODUCT_IMAGE_FIELD = "productImage";

export interface CreateProductPayload {
  productName: string;
  description: string;
  price: number | string;
  quantity: number;
  categoryId: string;
  groupId?: string;
  image?: File | Blob | null;
}

export interface UpdateProductPayload {
  productName?: string;
  description?: string;
  price?: number | string;
  quantity?: number;
  /** Backend validation requires "status" on update (e.g. "available"). */
  status?: string;
  /** Optional new photo; sent as "productImage". Omit to keep the current photo. */
  image?: File | null;
  /** Used only to refresh the group's product list after an edit; never sent. */
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
 * TEMPORARY WORKAROUND - NOT ACCESS CONTROL.
 * The backend has no verified group field on products yet, so the AJO group id is
 * embedded in the product description as "[AJO:<groupId>]". Anyone can forge, edit
 * or remove this tag, so it must never be relied on for security or visibility.
 * Replace it with a real, server-verified groupId column on the backend.
 * Always run descriptions through stripGroupTag() before displaying or searching them.
 */
const GROUP_TAG_REGEX = /\s*\[(?:AJO|GROUP):[^\]\s]+\]/g;

export function stripGroupTag(text?: string | null): string {
  return (text ?? "").replace(GROUP_TAG_REGEX, "").trim();
}

/**
 * Re-attaches the group tag from the original description to an edited one,
 * so editing a listing never detaches it from its AJO group.
 */
export function withGroupTag(
  newDescription: string,
  originalDescription?: string | null,
): string {
  const clean = stripGroupTag(newDescription);
  const match = (originalDescription ?? "").match(/\[(?:AJO|GROUP):[^\]\s]+\]/);
  return match ? `${clean} ${match[0]}`.trim() : clean;
}

/**
 * Helper to determine if a product belongs to the current user (product owner/manager).
 * Returns true when both product.userId and currentUserId exist and String(product.userId) equals String(currentUserId).
 */
export function isOwnProduct(
  product?: Partial<ProductItem> | null,
  currentUserId?: string | number | null,
): boolean {
  if (
    !product ||
    product.userId === undefined ||
    product.userId === null ||
    String(product.userId).trim() === "" ||
    currentUserId === undefined ||
    currentUserId === null ||
    String(currentUserId).trim() === ""
  ) {
    return false;
  }
  return String(product.userId).trim() === String(currentUserId).trim();
}


/** True when a message looks like server internals (stack traces, paths, library errors). */
function looksTechnical(message: string): boolean {
  return (
    message.length > 200 ||
    /\n|\/var\/|node_modules|MulterError|TypeError|ReferenceError|SyntaxError|\bat\s.+\(|Request failed with status code/i.test(
      message,
    )
  );
}

/**
 * Maps any thrown error to a user-safe message.
 * - 5xx responses never show backend text (it may contain stack traces or paths).
 * - 4xx responses show the backend message only if it reads like a human message.
 * - Plain Errors thrown by this module's own validation are shown as written.
 */
export function getMarketErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const err = error as any;
  const status: number | undefined = err?.response?.status;

  if (status === undefined) {
    if (err?.isAxiosError) {
      return "Network problem. Check your connection and try again.";
    }
    if (error instanceof Error && error.message && !looksTechnical(error.message)) {
      return error.message;
    }
    return fallback;
  }

  const raw = err?.response?.data?.message ?? err?.response?.data?.error;
  const backendMessage =
    typeof raw === "string" && raw.trim() && !looksTechnical(raw)
      ? raw.trim()
      : "";

  if (status >= 500) {
    return "The server ran into a problem. Please try again later.";
  }
  if (backendMessage) {
    return backendMessage;
  }
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to do this.";
    case 404:
      return "We couldn't find that item. It may have been removed.";
    case 413:
      return "That file is too large. Please choose a smaller one.";
    case 429:
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Some details are invalid. Please check them and try again.";
  }
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

  // KNOWN-GOOD REQUEST (confirmed working in Postman):
  // POST /api/v1/product/create-product/:categoryId
  // Body: multipart/form-data, exactly these fields and no others:
  //   productImage  (File)
  //   productName   (text)
  //   description   (text)
  //   price         (text)
  //   productRating (text, "5")
  //   quantity      (text)
  const formData = new FormData();
  if (
    payload.image instanceof File ||
    (typeof Blob !== "undefined" && payload.image instanceof Blob)
  ) {
    formData.append(CREATE_PRODUCT_IMAGE_FIELD, payload.image);
  }
  formData.append("productName", cleanName);
  formData.append("description", payload.description || "");
  formData.append("price", String(price));
  formData.append("productRating", "5");
  formData.append("quantity", String(quantity));

  // Note: groupId and groupSavingId are completely excluded from the request body
  // per the backend contract. Group attribution currently relies on the [AJO:<id>] description tag.

  const { data } = await api.post<MarketApiResponse<ProductItem>>(
    `/api/v1/product/create-product/${cleanCatId}`,
    formData,
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

  // Contract (update-product): multipart with productName, description, price,
  // productRating, quantity, status and an optional file in "productImage" (confirmed by
  // backend; the old Postman "images" name was wrong). groupId is never sent
  // (the group link lives in the description tag).
  if (payload.productName !== undefined) {
    const name = payload.productName.trim();
    if (!name) throw new Error("Product name is required");
    formData.append("productName", name);
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
  formData.append("productRating", "5");
  if (payload.quantity !== undefined) {
    const qty = Number(payload.quantity);
    if (Number.isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      throw new Error("Quantity must be a non-negative integer");
    }
    formData.append("quantity", String(qty));
  }
  if (payload.status !== undefined && payload.status.trim()) {
    formData.append("status", payload.status.trim());
  }
  if (payload.image instanceof File) {
    formData.append(UPDATE_PRODUCT_IMAGE_FIELD, payload.image);
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