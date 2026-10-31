import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Star,
  Package,
  Truck,
  AlertCircle,
  RotateCw,
  CheckCircle2,
  Wallet,
  Clock,
  ShieldCheck,
  CreditCard,
  Plus,
  Minus,
  Sparkles,
  Trash2,
  Loader,
  X,
} from "lucide-react";
import Logo, { BrandText } from "../components/Logo";
import {
  Badge,
  PaveBtn,
  ScreenHeader,
  ImageWithFallback,
} from "../components/UI";
import { Screen, fmt, pct } from "../pave-data";
import {
  useProductsQuery,
  useProductQuery,
  useCategoriesQuery,
  useCategoryQuery,
  usePurchasesQuery,
  usePurchaseQuery,
  useCreatePurchaseMutation,
  useContinueInstallmentMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "../hooks/useMarketApi";
import { useWalletBalanceQuery } from "../hooks/usePaveApi";
import { getAuthenticatedUserId } from "../api/auth";
import { getMarketErrorMessage, stripGroupTag, isOwnProduct, withGroupTag } from "../api/market";
import type { ProductItem, PurchaseItem } from "../api/market";
import { resolveReturnScreen } from "../utils/navigation";
import { validateProductImageFile } from "./GroupSaving";

/**
 * Robust currency formatter for numbers and string values
 */
export function formatMoney(val: number | string | null | undefined): string {
  const num = typeof val === "number" ? val : parseFloat(String(val || 0));
  if (Number.isNaN(num)) return "₦0";
  return `₦${num.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * 1. Marketplace Screen:
 * Displays live categories (GET /api/v1/category/getAllCategory)
 * and live marketplace products (GET /api/v1/product/get-all-products),
 * along with a dedicated "My Purchases & Plans" tab.
 */
export function MarketplaceScreen({
  onNav,
  setSelectedProduct,
  setSelectedPurchaseId,
  onSetReturnScreen,
}: {
  onNav: (s: Screen) => void;
  setSelectedProduct: (p: ProductItem) => void;
  setSelectedPurchaseId?: (id: string) => void;
  onSetReturnScreen?: (s: Screen) => void;
}) {
  const [tab, setTab] = useState<"products" | "purchases">("products");
  const [search, setSearch] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All");

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useProductsQuery();

  const {
    data: rawCategories = [],
    isError: isCategoriesError,
  } = useCategoriesQuery();

  const {
    data: purchases = [],
    isLoading: isPurchasesLoading,
    isError: isPurchasesError,
    error: purchasesError,
    refetch: refetchPurchases,
  } = usePurchasesQuery();

  // Deduplicate categories from both the dedicated endpoint and the products list
  const categoryNames = useMemo(() => {
    const list = new Set<string>(["All"]);
    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      rawCategories.forEach((c) => {
        if (c?.categoryName) list.add(c.categoryName.trim());
      });
    }
    // Also include any categories dynamically present on products
    products.forEach((p) => {
      if (p.category?.categoryName) {
        list.add(p.category.categoryName.trim());
      }
    });
    return Array.from(list);
  }, [rawCategories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pCat = p.category?.categoryName || "";
      const matchesCategory =
        selectedCategoryName === "All" ||
        pCat.toLowerCase() === selectedCategoryName.toLowerCase();
      const matchesSearch =
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        (p.description &&
          stripGroupTag(p.description)
            .toLowerCase()
            .includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryName, search]);

  const activePurchasesCount = useMemo(() => {
    return purchases.filter((p) => p.purchaseStatus === "in-progress").length;
  }, [purchases]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Header */}
      <div
        style={{
          background: "linear-gradient(145deg, #7C3AED 0%, #6D28D9 100%)",
        }}
        className="px-6 pt-12 pb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-white flex items-center gap-2"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            <BrandText variant="light" /> Market
          </h2>
          <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
            Save-to-Own
          </span>
        </div>
        <p className="text-white/80 text-sm mb-4">
          Save now, own it later. Secure by paying small small.
        </p>

        {/* Tab switch */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-4">
          <button
            onClick={() => setTab("products")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === "products"
                ? "bg-white text-[#7C3AED] shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Browse Products ({products.length})
          </button>
          <button
            onClick={() => setTab("purchases")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "purchases"
                ? "bg-white text-[#7C3AED] shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            <span>My Purchases</span>
            {activePurchasesCount > 0 && (
              <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {activePurchasesCount}
              </span>
            )}
          </button>
        </div>

        {tab === "products" && (
          <div className="bg-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm border border-white/20">
            <Search size={16} className="text-white/70" />
            <input
              placeholder="Search products or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/60 text-sm outline-none"
            />
          </div>
        )}
      </div>

      {tab === "products" ? (
        <>
          {/* Category Chips */}
          <div className="px-4 -mt-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categoryNames.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategoryName(c)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-xs ${
                    selectedCategoryName === c
                      ? "bg-[#7C3AED] text-white ring-2 ring-[#7C3AED]/30"
                      : "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Products Content Area */}
          <div className="px-4 pt-4 pb-8">
            {isProductsLoading ? (
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-hidden">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-3 border border-[#F1F3FB] animate-pulse flex flex-col gap-2"
                  >
                    <div className="aspect-4/3 bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : isProductsError ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <AlertCircle size={40} className="text-[#DC2626] mb-3" />
                <h3 className="font-bold text-gray-800 text-base mb-1">
                  Unable to load marketplace products
                </h3>
                <p className="text-xs text-gray-500 mb-4 max-w-xs">
                  {getMarketErrorMessage(
                    productsError,
                    "Could not connect to the marketplace catalog.",
                  )}
                </p>
                <button
                  onClick={() => void refetchProducts()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-[#6D28D9] cursor-pointer"
                >
                  <RotateCw size={14} />
                  <span>Try Again</span>
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED]">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="font-semibold text-gray-800">
                  No products found
                </h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  {search
                    ? `No products match "${search}". Try a different keyword.`
                    : "No products are currently available in this category."}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-xs text-[#7C3AED] font-semibold underline mt-1 cursor-pointer"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid grid-cols-2 gap-3 ${filteredProducts.length > 2 ? 'max-h-[520px] overflow-y-auto scrollbar-hide pr-1' : ''}`}>
                {filteredProducts.map((p) => {
                  const priceNum =
                    typeof p.price === "number"
                      ? p.price
                      : parseFloat(String(p.price || 0));
                  const isAvailable =
                    p.status === "available" && p.quantity > 0;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (onSetReturnScreen) {
                          onSetReturnScreen("marketplace");
                        }
                        setSelectedProduct(p);
                        onNav("product-detail");
                      }}
                      className="bg-white rounded-2xl overflow-hidden border border-[#F1F3FB] shadow-xs hover:shadow-md transition-all text-left flex flex-col cursor-pointer group"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-[#F8F9FE]">
                        <ImageWithFallback
                          src={
                            p.productImage ||
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60"
                          }
                          alt={p.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white text-[11px] font-semibold bg-red-600/90 px-2 py-0.5 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {p.productRating > 0 && (
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Star
                              size={10}
                              className="text-amber-400 fill-amber-400"
                            />
                            <span>{p.productRating}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[12px] text-[#3730A3] font-bold uppercase tracking-wider mb-1.5">
                            {p.category?.categoryName || "Marketplace"}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug line-clamp-2 mb-3">
                            {p.productName}
                          </h4>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                          <div
                            className="font-extrabold text-[#0F172A]"
                            style={{
                              fontFamily: "var(--font-family-display)",
                              fontSize: 17,
                            }}
                          >
                            {formatMoney(priceNum)}
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              isAvailable
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {isAvailable ? "Available" : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* My Purchases & Installments Tab */
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">
              Your Layaway & Purchases
            </h3>
            <button
              onClick={() => void refetchPurchases()}
              className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          {isPurchasesLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-[#F1F3FB] animate-pulse h-28"
                />
              ))}
            </div>
          ) : isPurchasesError ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs flex flex-col gap-2">
              <p className="font-semibold">Unable to load your purchases</p>
              <p>
                {getMarketErrorMessage(
                  purchasesError,
                  "Could not retrieve purchase history.",
                )}
              </p>
              <button
                onClick={() => void refetchPurchases()}
                className="self-start text-[#7C3AED] font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#F1F3FB] text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED]">
                <Package size={24} />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">
                No purchases yet
              </h4>
              <p className="text-xs text-gray-500 max-w-xs">
                You haven't initiated any product purchases or installment plans
                yet. Browse our catalog to get started.
              </p>
              <button
                onClick={() => setTab("products")}
                className="mt-2 px-4 py-2 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {purchases.map((purchase) => {
                const isCompleted = purchase.purchaseStatus === "completed";
                const totalPaidNum = parseFloat(
                  String(purchase.totalAmountPaid || 0),
                );
                const totalPriceNum = parseFloat(
                  String(purchase.totalPrice || 0),
                );
                const percentNum =
                  totalPriceNum > 0
                    ? Math.min(
                        100,
                        Math.round((totalPaidNum / totalPriceNum) * 100),
                      )
                    : 0;

                return (
                  <div
                    key={purchase.id}
                    className="bg-white rounded-2xl p-4 border border-[#F1F3FB] shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-[11px] text-gray-400">
                          Ref: #{purchase.id.slice(0, 8)}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {purchase.product?.productName || "Product Purchase"}
                        </h4>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Qty: {purchase.quantity} • Total:{" "}
                          {formatMoney(purchase.totalPrice)}
                        </div>
                      </div>
                      <Badge color={isCompleted ? "green" : "indigo"}>
                        {purchase.purchaseStatus}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Paid: {formatMoney(purchase.totalAmountPaid)}</span>
                        <span>{percentNum}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? "bg-[#059669]" : "bg-[#7C3AED]"
                          }`}
                          style={{ width: `${percentNum}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <div className="text-[11px] text-gray-400">
                          Outstanding Balance
                        </div>
                        <div className="text-xs font-bold text-gray-900">
                          {formatMoney(purchase.totalAmountDue)}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (setSelectedPurchaseId) {
                            setSelectedPurchaseId(purchase.id);
                          }
                          onNav("purchase-detail");
                        }}
                        className="px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-semibold rounded-lg hover:bg-[#6D28D9] cursor-pointer"
                      >
                        {isCompleted ? "View Details" : "Manage & Pay"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 2. Product Detail Screen:
 * Retrieves a single product via GET /api/v1/product/get-product/:productId
 * and displays full specifications, stock status, and save-to-own plan breakdown.
 */
export function ProductDetailScreen({
  onNav,
  product,
  setSelectedProduct,
  returnScreen,
}: {
  onNav: (s: Screen) => void;
  product?: ProductItem | any;
  setSelectedProduct?: (p: any) => void;
  returnScreen?: Screen | string | null;
}) {
  const targetReturnScreen = resolveReturnScreen(returnScreen);
  const productId = product?.id || "";

  const {
    data: liveProduct,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductQuery(productId);

  const activeProduct = liveProduct || product;

  // Fetch live category details if categoryId is available (GET /api/v1/category/getCategoryById/:categoryId)
  const categoryId = activeProduct?.categoryId;
  const { data: categoryData } = useCategoryQuery(categoryId);

  // Owner actions. These hooks must stay above the early returns below.
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deleteMutation = useDeleteProductMutation();
  const updateMutation = useUpdateProductMutation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  if (isLoading && !activeProduct) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <RotateCw size={32} className="text-[#7C3AED] animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (isError && !activeProduct) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <h3 className="font-bold text-gray-800 text-base mb-1">
          Product Not Found
        </h3>
        <p className="text-xs text-gray-500 mb-4 max-w-xs">
          {getMarketErrorMessage(error, "Unable to retrieve this product.")}
        </p>
        <div className="flex gap-2">
          <PaveBtn variant="secondary" onClick={() => onNav(targetReturnScreen)}>
            Back
          </PaveBtn>
          <PaveBtn onClick={() => void refetch()}>Try Again</PaveBtn>
        </div>
      </div>
    );
  }

  const p = activeProduct;
  const currentUserId = getAuthenticatedUserId();
  const isOwner = isOwnProduct(p, currentUserId);

  const openEditModal = () => {
    setEditError("");
    setEditSuccess("");
    setEditName(p.productName || "");
    setEditDescription(stripGroupTag(p.description));
    setEditPrice(String(p.price ?? ""));
    setEditQuantity(String(p.quantity ?? 0));
    setEditImage(null);
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    setEditError("");
    const name = editName.trim();
    const priceValue = Number(editPrice);
    const qtyValue = Number(editQuantity);
    if (!name) return setEditError("Product name is required.");
    if (!editPrice.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      return setEditError("Enter a price greater than zero.");
    }
    if (
      editQuantity.trim() === "" ||
      Number.isNaN(qtyValue) ||
      qtyValue < 0 ||
      !Number.isInteger(qtyValue)
    ) {
      return setEditError("Quantity must be a whole number, 0 or more.");
    }
    if (editImage) {
      const imageError = validateProductImageFile(editImage);
      if (imageError) return setEditError(imageError);
    }
    // Backend requires "status" on update. Keep the current status; only flip a
    // sold-out listing back to "available" when stock is added.
    const currentStatus = String(p.status || "available");
    const nextStatus =
      currentStatus === "out-of-stock" && qtyValue > 0 ? "available" : currentStatus;
    try {
      await updateMutation.mutateAsync({
        productId: p.id,
        payload: {
          status: nextStatus,
          image: editImage,
          productName: name,
          description: withGroupTag(editDescription, p.description),
          price: priceValue,
          quantity: qtyValue,
          groupId: p.groupId,
        },
        isProductOwner: true,
      });
      setShowEditModal(false);
      setEditSuccess("Listing updated.");
    } catch (err) {
      setEditError(getMarketErrorMessage(err, "Unable to update this listing."));
    }
  };
  const priceNum =
    typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0));
  const isAvailable = p.status === "available" && p.quantity > 0;
  const categoryName =
    categoryData?.categoryName ||
    p.category?.categoryName ||
    p.category ||
    "Marketplace";

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top Banner & Images */}
      <div className="relative">
        <ImageWithFallback
          src={
            p.productImage ||
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
          }
          alt={p.productName}
          className="w-full aspect-4/3 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <button
          onClick={() => onNav(targetReturnScreen)}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#3730A3] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#E0E7FF] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Main Body */}
      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge color="indigo">{categoryName}</Badge>
            {/* Show only real data: no default rating and no made-up review count. */}
            {Number(p.productRating) > 0 && (
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-sm font-semibold text-gray-800">
                  {p.productRating}
                </span>
                {Number(p.reviews) > 0 && (
                  <span className="text-xs text-[#9CA3AF]">
                    ({p.reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.3,
            }}
            className="text-gray-900"
          >
            {p.productName}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? `${p.quantity} units available` : "Out of stock"}
            </span>
          </div>

          <p className="text-[#4B5563] text-sm mt-3 leading-relaxed">
            {stripGroupTag(p.description) ||
              "High-quality item available for layaway plan."}
          </p>
        </div>

        {isOwner ? (
          /* Owner View Panel */
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md">
                Your listing
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAvailable ? "Available" : "Out of stock"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-slate-600 font-medium">Listing Price</span>
              <span className="font-bold text-slate-900 text-base">
                {formatMoney(priceNum)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Available Stock</span>
              <span className="font-semibold text-slate-800">
                {p.quantity ?? 0} units
              </span>
            </div>

            {editSuccess && (
              <p role="status" className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {editSuccess}
              </p>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={openEditModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#3730A3] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] transition-colors cursor-pointer"
              >
                <span>Edit listing</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete this Listing</span>
              </button>
            </div>
          </div>
        ) : (
          /* Buyer Installment Plan Breakdown */
          <>
            <div className="bg-[#F5F3FF] rounded-2xl p-5 border border-[#DDD6FE]">
              <div className="flex items-center gap-2 mb-3">
                <Package size={18} className="text-[#7C3AED]" />
                <span className="text-sm font-bold text-[#7C3AED]">
                  Save-to-Own Installment Plan
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Full Price</span>
                  <span className="font-bold text-[#0D0F1C]">
                    {formatMoney(priceNum)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Secure by paying small small</span>
                  <span className="font-bold text-[#7C3AED]">
                    {formatMoney(priceNum * 0.5)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Balance on Delivery</span>
                  <span className="font-medium text-[#0D0F1C]">
                    {formatMoney(priceNum * 0.5)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#DDD6FE] text-xs text-[#6D28D9] flex items-center gap-1.5">
                <Sparkles size={14} className="shrink-0" />
                <span>Secure by paying small small or enter a custom amount to start!</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isAvailable ? (
              <PaveBtn
                onClick={() => {
                  if (setSelectedProduct) {
                    setSelectedProduct(p);
                  }
                  onNav("payment-plan");
                }}
              >
                Proceed to Payment
              </PaveBtn>
            ) : (
              <div className="bg-gray-100 rounded-xl p-4 text-center text-xs text-gray-500 font-medium">
                This item is currently out of stock. Please check back later.
              </div>
            )}
          </>
        )}

        <PaveBtn variant="secondary" onClick={() => onNav(targetReturnScreen)}>
          Back
        </PaveBtn>
      </div>

      {/* Edit Listing Modal (owner only, text fields) */}
      {showEditModal && isOwner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Edit listing"
        >
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit listing</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={updateMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-gray-700">
                Product name
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3730A3]"
                />
              </label>
              <label className="text-xs font-semibold text-gray-700">
                Description
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3730A3]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-700">
                  Price (₦)
                  <input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    inputMode="decimal"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3730A3]"
                  />
                </label>
                <label className="text-xs font-semibold text-gray-700">
                  Quantity
                  <input
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    inputMode="numeric"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3730A3]"
                  />
                </label>
              </div>
              <label className="text-xs font-semibold text-gray-700">
                Change photo (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      const err = validateProductImageFile(file);
                      if (err) {
                        setEditError(err);
                        setEditImage(null);
                        e.target.value = "";
                        return;
                      }
                    }
                    setEditError("");
                    setEditImage(file);
                  }}
                  className="mt-1 block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#EEF2FF] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#3730A3]"
                />
              </label>
              <p className="text-[11px] text-gray-500">
                Leave empty to keep the current photo. JPEG, PNG or WebP, up to 2 MB.
              </p>
            </div>

            {editError && (
              <p role="alert" className="mt-3 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {editError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={updateMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitEdit()}
                disabled={updateMutation.isPending}
                className="px-4 py-2.5 rounded-xl bg-[#3730A3] text-sm font-semibold text-white hover:bg-[#312E81] cursor-pointer disabled:opacity-60"
              >
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#F1F3FB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shrink-0">
                <Trash2 size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Listing?
                </h3>
                <p className="text-xs text-gray-500">
                  Permanently remove this product
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-gray-900">{p.productName}</span>? Members will no longer be able to purchase or initiate installment plans for this item.
            </p>

            {deleteError && (
              <p role="alert" className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setDeleteError("");
                  try {
                    await deleteMutation.mutateAsync({
                      productId: p.id,
                      inProgressPurchasesCount: 0,
                      isProductOwner: true,
                      groupId: p.groupId,
                    });
                    setShowDeleteModal(false);
                    onNav(targetReturnScreen);
                  } catch (err) {
                    setDeleteError(getMarketErrorMessage(err, "Unable to delete product."));
                  }
                }}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Listing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 3. Payment Plan Screen:
 * Handles purchase initiation via POST /api/v1/product/create-purchase/:productId
 * Allows quantity selection and down payment amount validation against live wallet balance.
 */
export function PaymentPlanScreen({
  onNav,
  product,
  setSelectedPurchaseId,
}: {
  onNav: (s: Screen) => void;
  product?: ProductItem | any;
  setSelectedPurchaseId?: (id: string) => void;
}) {
  const p = product;
  const productId = p?.id || "";
  const unitPrice =
    typeof p?.price === "number"
      ? p.price
      : parseFloat(String(p?.price || 0));

  const [quantity, setQuantity] = useState<number>(1);
  const [downPaymentType, setDownPaymentType] = useState<"50" | "100" | "custom">("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [createdPurchase, setCreatedPurchase] = useState<PurchaseItem | null>(null);

  const { data: walletData } = useWalletBalanceQuery();
  const walletBalance = parseFloat(String(walletData?.balance ?? 0));

  const createPurchaseMutation = useCreatePurchaseMutation();

  const totalPrice = unitPrice * quantity;
  const default50Percent = Math.round(totalPrice * 0.5);

  const amountToPay = useMemo(() => {
    if (downPaymentType === "50") return default50Percent;
    if (downPaymentType === "100") return totalPrice;
    const parsed = parseFloat(customAmount);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [downPaymentType, default50Percent, totalPrice, customAmount]);

  const hasSufficientBalance = walletBalance >= amountToPay;

  const handleStartPurchase = async () => {
    setErrorMsg("");

    if (!productId) {
      setErrorMsg("Missing product identification. Please go back and select a product.");
      return;
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      setErrorMsg("Please enter a valid quantity of 1 or more.");
      return;
    }
    if (p?.quantity && quantity > p.quantity) {
      setErrorMsg(`Only ${p.quantity} units are available in stock.`);
      return;
    }
    if (amountToPay <= 0) {
      setErrorMsg("Payment amount must be greater than zero.");
      return;
    }
    if (amountToPay > totalPrice) {
      setErrorMsg(`Payment amount cannot exceed total order price (${formatMoney(totalPrice)}).`);
      return;
    }
    if (!hasSufficientBalance) {
      setErrorMsg(`Insufficient wallet balance (${formatMoney(walletBalance)}). Please fund your wallet first.`);
      return;
    }

    const currentUserId = getAuthenticatedUserId();
    const sellerUserId = p?.userId;
    if (sellerUserId && currentUserId && String(sellerUserId).trim() === String(currentUserId).trim()) {
      setErrorMsg("AJO managers cannot purchase their own products.");
      return;
    }

    if (amountToPay < default50Percent && amountToPay < totalPrice) {
      setErrorMsg(`A minimum down payment of 50% (${formatMoney(default50Percent)}) is required to secure this product.`);
      return;
    }

    try {
      const response = await createPurchaseMutation.mutateAsync({
        productId,
        payload: {
          quantity,
          amountToPay,
          sellerUserId: sellerUserId ? String(sellerUserId) : undefined,
          buyerUserId: currentUserId ? String(currentUserId) : undefined,
        },
      });

      if (response.data) {
        setCreatedPurchase(response.data);
        if (setSelectedPurchaseId) {
          setSelectedPurchaseId(response.data.id);
        }
      }
    } catch (err) {
      setErrorMsg(getMarketErrorMessage(err, "Unable to initiate product purchase."));
    }
  };

  if (!p) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={40} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-4">No product selected.</p>
        <PaveBtn onClick={() => onNav("marketplace")}>Go to Marketplace</PaveBtn>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <ScreenHeader
        title="Initiate Purchase"
        onBack={() => onNav("product-detail")}
      />

      {!createdPurchase ? (
        <div className="flex-1 px-6 pt-4 pb-8 flex flex-col gap-5">
          {/* Product Header Card */}
          <div className="flex items-center gap-4 bg-[#F5F3FF] rounded-2xl p-4 border border-[#DDD6FE]">
            <ImageWithFallback
              src={
                p.productImage ||
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80"
              }
              alt={p.productName}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-[#0D0F1C] truncate">
                {p.productName}
              </div>
              <div className="text-[#7C3AED] font-bold text-sm">
                {formatMoney(unitPrice)} <span className="text-xs font-normal text-gray-500">/ unit</span>
              </div>
              <div className="text-xs text-green-700">
                In Stock ({p.quantity || 1} available)
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="bg-white rounded-2xl border border-[#F1F3FB] p-4">
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Select Quantity
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || createPurchaseMutation.isPending}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 disabled:opacity-30 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-base min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      p?.quantity ? Math.min(p.quantity, q + 1) : q + 1,
                    )
                  }
                  disabled={
                    (p?.quantity ? quantity >= p.quantity : false) ||
                    createPurchaseMutation.isPending
                  }
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 disabled:opacity-30 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Payment Plan Options */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Down Payment Option
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDownPaymentType("50")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  downPaymentType === "50"
                    ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] font-bold"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="text-xs font-semibold">50% Down</div>
                <div className="text-[11px] mt-0.5">{formatMoney(default50Percent)}</div>
              </button>

              <button
                type="button"
                onClick={() => setDownPaymentType("100")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  downPaymentType === "100"
                    ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] font-bold"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="text-xs font-semibold">Full (100%)</div>
                <div className="text-[11px] mt-0.5">{formatMoney(totalPrice)}</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDownPaymentType("custom");
                  if (!customAmount) setCustomAmount(String(default50Percent));
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  downPaymentType === "custom"
                    ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] font-bold"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="text-xs font-semibold">Custom</div>
                <div className="text-[11px] mt-0.5">Any amount</div>
              </button>
            </div>

            {downPaymentType === "custom" && (
              <div className="mt-3">
                <label className="text-xs text-gray-500 block mb-1">
                  Enter Custom Down Payment Amount (₦)
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalPrice}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`e.g. ${default50Percent}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}
          </div>

          {/* Installment Breakdown Summary */}
          <div className="bg-white rounded-2xl border border-[#F1F3FB] p-5 flex flex-col gap-2.5">
            <div className="text-xs font-bold text-gray-900 mb-1">
              Order Breakdown
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Unit Price</span>
              <span className="font-medium text-gray-900">{formatMoney(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium text-gray-900">{quantity}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-100 pt-2 font-semibold">
              <span className="text-gray-700">Total Order Price</span>
              <span className="text-gray-900">{formatMoney(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#7C3AED] font-bold">
              <span>Amount Due Now</span>
              <span>{formatMoney(amountToPay)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Remaining Balance</span>
              <span>{formatMoney(Math.max(0, totalPrice - amountToPay))}</span>
            </div>
          </div>

          {/* Wallet Balance Status */}
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs ${
              hasSufficientBalance
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Wallet size={16} />
              <div>
                <div className="font-semibold">Wallet Balance</div>
                <div>{formatMoney(walletBalance)}</div>
              </div>
            </div>
            {!hasSufficientBalance && (
              <button
                type="button"
                onClick={() => onNav("fund-wallet")}
                className="underline font-bold text-red-900 cursor-pointer"
              >
                Fund Wallet
              </button>
            )}
          </div>

          {/* Error Message */}
          {(errorMsg || createPurchaseMutation.isError) && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                {errorMsg ||
                  getMarketErrorMessage(
                    createPurchaseMutation.error,
                    "Unable to create purchase.",
                  )}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <PaveBtn
            onClick={() => void handleStartPurchase()}
            disabled={
              createPurchaseMutation.isPending ||
              !hasSufficientBalance ||
              amountToPay <= 0
            }
          >
            {createPurchaseMutation.isPending
              ? "Processing purchase..."
              : `Confirm & Pay ${formatMoney(amountToPay)}`}
          </PaveBtn>
        </div>
      ) : (
        /* Purchase Confirmation Success State */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600"
          >
            <CheckCircle2 size={36} />
          </motion.div>

          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
              className="text-gray-900"
            >
              Purchase Initiated!
            </h2>
            <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
              Your layaway purchase has been registered. You can complete payments anytime.
            </p>
          </div>

          <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Purchase ID</span>
              <span className="font-mono text-gray-800">
                #{createdPurchase.id.slice(0, 8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge
                color={
                  createdPurchase.purchaseStatus === "completed"
                    ? "green"
                    : "indigo"
                }
              >
                {createdPurchase.purchaseStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Price</span>
              <span className="font-bold">
                {formatMoney(createdPurchase.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-green-700">
                {formatMoney(createdPurchase.totalAmountPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Balance Due</span>
              <span className="font-bold text-[#7C3AED]">
                {formatMoney(createdPurchase.totalAmountDue)}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <PaveBtn
              onClick={() => {
                if (setSelectedPurchaseId) {
                  setSelectedPurchaseId(createdPurchase.id);
                }
                onNav("purchase-detail");
              }}
            >
              View Purchase & Installments
            </PaveBtn>
            <PaveBtn variant="ghost" onClick={() => onNav("marketplace")}>
              Back to Marketplace
            </PaveBtn>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 4. Purchase Detail & Installment Management Screen:
 * Retrieves purchase via GET /api/v1/product/get-purchase/:purchaseId
 * Enforces client authorization check (purchase belongs to current user).
 * Allows continuing installment payments via PUT /api/v1/product/continue-installment-purchased/:purchaseId
 */
export function PurchaseDetailScreen({
  onNav,
  purchaseId,
}: {
  onNav: (s: Screen) => void;
  purchaseId: string;
}) {
  const [payAmount, setPayAmount] = useState<string>("");
  const [successNotice, setSuccessNotice] = useState<string>("");
  const [errorNotice, setErrorNotice] = useState<string>("");

  const {
    data: purchase,
    isLoading,
    isError,
    error,
    refetch,
  } = usePurchaseQuery(purchaseId);

  const { data: walletData } = useWalletBalanceQuery();
  const walletBalance = parseFloat(
    String(walletData?.balance ?? 0),
  );

  const continueInstallmentMutation = useContinueInstallmentMutation();

  const handlePayInstallment = async () => {
    setErrorNotice("");
    setSuccessNotice("");

    if (!purchaseId) {
      setErrorNotice("Invalid purchase reference.");
      return;
    }

    const amountNum = parseFloat(payAmount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setErrorNotice("Please enter a valid payment amount greater than zero.");
      return;
    }

    const dueNum = parseFloat(String(purchase?.totalAmountDue || 0));
    if (amountNum > dueNum) {
      setErrorNotice(
        `Amount cannot exceed outstanding balance of ${formatMoney(dueNum)}.`,
      );
      return;
    }

    if (walletBalance < amountNum) {
      setErrorNotice(
        `Insufficient wallet balance (${formatMoney(walletBalance)}). Please fund your wallet.`,
      );
      return;
    }

    try {
      const response = await continueInstallmentMutation.mutateAsync({
        purchaseId,
        payload: {
          amountToPay: amountNum,
          totalAmountDue: dueNum,
          purchaseStatus: purchase?.purchaseStatus,
        },
      });

      setSuccessNotice(
        response.message || "Installment payment processed successfully!",
      );
      setPayAmount("");
    } catch (err) {
      setErrorNotice(
        getMarketErrorMessage(err, "Failed to submit installment payment."),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <RotateCw size={32} className="text-[#7C3AED] animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading purchase details...</p>
      </div>
    );
  }

  if (isError || !purchase) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <h3 className="font-bold text-gray-800 text-base mb-1">
          Purchase Unavailable
        </h3>
        <p className="text-xs text-gray-500 mb-4 max-w-xs">
          {getMarketErrorMessage(
            error,
            "Could not retrieve this purchase record or you are not authorized to view it.",
          )}
        </p>
        <PaveBtn onClick={() => onNav("marketplace")}>
          Back to Marketplace
        </PaveBtn>
      </div>
    );
  }

  const isCompleted = purchase.purchaseStatus === "completed";
  const dueAmount = parseFloat(String(purchase.totalAmountDue || 0));
  const paidAmount = parseFloat(String(purchase.totalAmountPaid || 0));
  const totalAmount = parseFloat(String(purchase.totalPrice || 0));
  const percentNum =
    totalAmount > 0
      ? Math.min(100, Math.round((paidAmount / totalAmount) * 100))
      : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <ScreenHeader
        title="Purchase & Installments"
        onBack={() => onNav("marketplace")}
      />

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Product Info Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#F1F3FB] shadow-xs flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED] shrink-0 overflow-hidden">
            <ImageWithFallback
              src={
                purchase.product?.productImage ||
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80"
              }
              alt={purchase.product?.productName || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-mono">
                #{purchase.id.slice(0, 8)}
              </span>
              <Badge color={isCompleted ? "green" : "indigo"}>
                {purchase.purchaseStatus}
              </Badge>
            </div>
            <h4 className="font-bold text-sm text-gray-900 truncate">
              {purchase.product?.productName || "Market Product"}
            </h4>
            <div className="text-xs text-gray-500">
              Quantity: {purchase.quantity} • Total: {formatMoney(purchase.totalPrice)}
            </div>
          </div>
        </div>

        {/* Payment Progress Card */}
        <div className="bg-[#F5F3FF] rounded-2xl p-5 border border-[#DDD6FE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7C3AED]">
              Payment Progress
            </span>
            <span className="text-xs font-bold text-[#7C3AED]">
              {percentNum}% Paid
            </span>
          </div>

          <div className="h-3 bg-[#DDD6FE] rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-[#059669]" : "bg-[#7C3AED]"
              }`}
              style={{ width: `${percentNum}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDD6FE] text-xs">
            <div>
              <span className="text-gray-500 block">Total Paid</span>
              <span className="font-bold text-gray-900">
                {formatMoney(paidAmount)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Remaining Due</span>
              <span className="font-bold text-[#7C3AED]">
                {formatMoney(dueAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Notice */}
        {errorNotice && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* If In Progress: Continue Installment Payment Form */}
        {!isCompleted && dueAmount > 0 ? (
          <div className="bg-white rounded-2xl p-5 border border-[#F1F3FB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#7C3AED]" />
              <h4 className="font-bold text-sm text-gray-900">
                Make Installment Payment
              </h4>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                <span>Enter Amount (₦)</span>
                <button
                  type="button"
                  onClick={() => setPayAmount(String(dueAmount))}
                  className="text-[#7C3AED] font-semibold underline cursor-pointer"
                >
                  Pay Full Balance ({formatMoney(dueAmount)})
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={dueAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder={`Max ${formatMoney(dueAmount)}`}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#7C3AED]"
              />
            </div>

            {/* Wallet balance display */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
              <span className="flex items-center gap-1.5">
                <Wallet size={14} /> Wallet Balance:
              </span>
              <span className="font-semibold text-gray-800">
                {formatMoney(walletBalance)}
              </span>
            </div>

            <PaveBtn
              onClick={() => void handlePayInstallment()}
              disabled={
                continueInstallmentMutation.isPending ||
                !payAmount ||
                parseFloat(payAmount) <= 0
              }
            >
              {continueInstallmentMutation.isPending
                ? "Processing installment..."
                : `Pay ${payAmount ? formatMoney(payAmount) : "Installment"}`}
            </PaveBtn>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-5 border border-green-200 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 size={22} />
            </div>
            <h4 className="font-bold text-green-900 text-sm">
              Purchase Fully Paid!
            </h4>
            <p className="text-xs text-green-700 max-w-xs">
              All installments for this item are complete. Your order is scheduled for fulfillment and delivery.
            </p>
          </div>
        )}

        <PaveBtn variant="ghost" onClick={() => onNav("marketplace")}>
          Back to Marketplace
        </PaveBtn>
      </div>
    </div>
  );
}