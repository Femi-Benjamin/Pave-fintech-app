import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllCategories,
  getCategoryById,
  getAllProducts,
  getProductById,
  createPurchase,
  getPurchaseById,
  continueInstallment,
  getAllPurchases,
  createProduct,
  updateProduct,
  deleteProduct,
  getGroupProducts,
} from "../api/market";
import type {
  Category,
  ProductItem,
  PurchaseItem,
  CreatePurchasePayload,
  ContinueInstallmentPayload,
  CreateProductPayload,
  UpdateProductPayload,
} from "../api/market";
import { transactionQueryKeys } from "./usePaveApi";

export const marketQueryKeys = {
  all: ["market"] as const,
  categories: () => [...marketQueryKeys.all, "categories"] as const,
  category: (categoryId: string) =>
    [...marketQueryKeys.all, "category", categoryId] as const,
  products: () => [...marketQueryKeys.all, "products"] as const,
  product: (productId: string) =>
    [...marketQueryKeys.all, "product", productId] as const,
  groupProducts: (groupId: string) =>
    [...marketQueryKeys.all, "group-products", groupId] as const,
  purchases: () => [...marketQueryKeys.all, "purchases"] as const,
  purchase: (purchaseId: string) =>
    [...marketQueryKeys.all, "purchase", purchaseId] as const,
};

/**
 * Hook to fetch all product categories.
 * Stale time is set to 5 minutes.
 * If the endpoint returns 403 (due to backend user role restrictions),
 * the error is captured so the UI can gracefully fallback to categories
 * derived from loaded products.
 */
export function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: marketQueryKeys.categories(),
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch a single category by ID.
 */
export function useCategoryQuery(categoryId?: string) {
  return useQuery<Category, Error>({
    queryKey: marketQueryKeys.category(categoryId || ""),
    queryFn: () => getCategoryById(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all marketplace products.
 */
export function useProductsQuery() {
  return useQuery<ProductItem[], Error>({
    queryKey: marketQueryKeys.products(),
    queryFn: getAllProducts,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch products specific to an AJO group.
 */
export function useGroupProductsQuery(
  groupId?: string,
  isMember = true,
  managerUserId?: string,
) {
  return useQuery<ProductItem[], Error>({
    queryKey: marketQueryKeys.groupProducts(groupId || ""),
    queryFn: () => getGroupProducts(groupId!, isMember, managerUserId),
    enabled: !!groupId && isMember,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a single product by ID.
 */
export function useProductQuery(productId?: string) {
  return useQuery<ProductItem, Error>({
    queryKey: marketQueryKeys.product(productId || ""),
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch customer's purchase history / installments.
 */
export function usePurchasesQuery() {
  return useQuery<PurchaseItem[], Error>({
    queryKey: marketQueryKeys.purchases(),
    queryFn: () => getAllPurchases(),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a specific purchase record.
 */
export function usePurchaseQuery(purchaseId?: string) {
  return useQuery<PurchaseItem, Error>({
    queryKey: marketQueryKeys.purchase(purchaseId || ""),
    queryFn: () => getPurchaseById(purchaseId!),
    enabled: !!purchaseId,
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation for AJO group managers to create a product for their group
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: CreateProductPayload;
    }) => createProduct(categoryId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.products(),
      });
      if (variables.payload.groupId) {
        void queryClient.invalidateQueries({
          queryKey: marketQueryKeys.groupProducts(variables.payload.groupId),
        });
      }
    },
  });
}

/**
 * Mutation for AJO group managers to update a product
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
      isProductOwner = true,
    }: {
      productId: string;
      payload: UpdateProductPayload;
      isProductOwner?: boolean;
    }) => updateProduct(productId, payload, isProductOwner),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.product(variables.productId),
      });
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.products(),
      });
      if (variables.payload.groupId) {
        void queryClient.invalidateQueries({
          queryKey: marketQueryKeys.groupProducts(variables.payload.groupId),
        });
      }
    },
  });
}

/**
 * Mutation for AJO group managers to delete a product
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      inProgressPurchasesCount = 0,
      isProductOwner = true,
      groupId,
    }: {
      productId: string;
      inProgressPurchasesCount?: number;
      isProductOwner?: boolean;
      groupId?: string;
    }) => deleteProduct(productId, inProgressPurchasesCount, isProductOwner),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.products(),
      });
      if (variables.groupId) {
        void queryClient.invalidateQueries({
          queryKey: marketQueryKeys.groupProducts(variables.groupId),
        });
      }
    },
  });
}

/**
 * Mutation to initiate a product purchase.
 */
export function useCreatePurchaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: CreatePurchasePayload;
    }) => createPurchase(productId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.purchases(),
      });
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.products(),
      });
      void queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.walletBalance,
      });
    },
  });
}

/**
 * Mutation to continue installment payment on a purchase.
 */
export function useContinueInstallmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      purchaseId,
      payload,
    }: {
      purchaseId: string;
      payload: ContinueInstallmentPayload;
    }) => continueInstallment(purchaseId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.purchase(variables.purchaseId),
      });
      void queryClient.invalidateQueries({
        queryKey: marketQueryKeys.purchases(),
      });
      void queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.walletBalance,
      });
    },
  });
}
