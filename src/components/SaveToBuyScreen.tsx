import React, { useState } from "react";
import { useLocalStore, Item, ItemSaving } from "../hooks/useLocalStore";
import {
  ShoppingCart,
  Plus,
  Tag,
  Search,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  History,
  Info,
  X,
  Trash2,
  Camera,
  Upload,
} from "lucide-react";

interface SaveToBuyScreenProps {
  onNavigate: (screen: string) => void;
}

export default function SaveToBuyScreen({ onNavigate }: SaveToBuyScreenProps) {
  const {
    walletBalance,
    items = [],
    itemSavings = [],
    addItem,
    deleteItem,
    startItemSaving,
    saveForItem,
    disburseItem,
    removeSavingPlan,
  } = useLocalStore();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
  const [selectedPlanToPay, setSelectedPlanToPay] = useState<ItemSaving | null>(
    null,
  );

  // New Item Form State
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Electronics");
  const [newItemImageUrl, setNewItemImageUrl] = useState("");

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Notifications/Errors
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemDesc) {
      showToast("error", "Please fill all required fields.");
      return;
    }
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("error", "Please enter a valid price.");
      return;
    }

    // Assign image based on input or category fallback
    let imageUrl = newItemImageUrl.trim();
    if (!imageUrl) {
      imageUrl =
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60";
      if (newItemCategory === "Electronics") {
        imageUrl =
          "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&auto=format&fit=crop&q=60";
      } else if (newItemCategory === "Computers") {
        imageUrl =
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60";
      } else if (newItemCategory === "Home Appliances") {
        imageUrl =
          "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60";
      } else if (newItemCategory === "Accessories") {
        imageUrl =
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";
      }
    }

    addItem({
      name: newItemName,
      price: priceNum,
      description: newItemDesc,
      category: newItemCategory,
      imageUrl,
    });

    showToast("success", `${newItemName} added to cooperative shop!`);
    setIsAddItemOpen(false);
    // Reset Form
    setNewItemName("");
    setNewItemPrice("");
    setNewItemDesc("");
    setNewItemCategory("Electronics");
    setNewItemImageUrl("");
  };

  const handleStartSaving = (product: Item) => {
    const res = startItemSaving(product);
    if (res.success) {
      showToast("success", res.message);
      setSelectedProduct(null);
    } else {
      showToast("error", res.message || "Failed to start saving.");
    }
  };

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanToPay) return;
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("error", "Please enter a valid amount.");
      return;
    }

    if (walletBalance < amountNum) {
      showToast("error", "Insufficient wallet balance.");
      return;
    }

    // Cap at remaining amount
    const remaining =
      selectedPlanToPay.itemPrice - selectedPlanToPay.savedAmount;
    const actualPay = Math.min(amountNum, remaining);

    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setAuthSuccess(true);

      setTimeout(() => {
        const res = saveForItem(selectedPlanToPay.id, actualPay);
        if (res.success) {
          showToast("success", res.message);
        } else {
          showToast("error", res.message || "Payment failed.");
        }
        setAuthSuccess(false);
        setSelectedPlanToPay(null);
        setPaymentAmount("");
      }, 1000);
    }, 1500);
  };

  const handleDisburse = (planId: string) => {
    const res = disburseItem(planId);
    if (res.success) {
      showToast("success", res.message);
    } else {
      showToast("error", res.message);
    }
  };

  // Filter products
  const filteredProducts = items.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Electronics",
    "Computers",
    "Home Appliances",
    "Accessories",
  ];

  // Specification details based on the item category/name
  const getProductSpecs = (product: Item) => {
    if (
      product.category === "Electronics" ||
      product.name.includes("iPhone") ||
      product.name.includes("PlayStation")
    ) {
      return [
        {
          label: "Brand/Manufacturer",
          value: product.name.includes("iPhone")
            ? "Apple Inc."
            : product.name.includes("PlayStation")
              ? "Sony Interactive Entertainment"
              : "Premium Brand",
        },
        {
          label: "Model/Edition",
          value: product.name.includes("iPhone")
            ? "iPhone 16 Pro Max"
            : "Standard / Pro Edition",
        },
        {
          label: "Processor/Chipset",
          value: product.name.includes("iPhone")
            ? "Apple A18 Pro (3nm)"
            : "Custom AMD CPU",
        },
        { label: "Storage / Capacity", value: "256GB NVMe SSD" },
        { label: "Warranty Period", value: "1 Year Manufacturer Warranty" },
        { label: "Condition", value: "Brand New (Sealed Box)" },
      ];
    } else if (
      product.category === "Computers" ||
      product.name.includes("MacBook") ||
      product.name.includes("Laptop") ||
      product.name.includes("iPad")
    ) {
      return [
        {
          label: "Processor",
          value: product.name.includes("MacBook")
            ? "Apple M3 Chip (8-Core CPU)"
            : product.name.includes("iPad")
              ? "Apple M4 Chip"
              : "Intel Core i9 / AMD Ryzen 9",
        },
        {
          label: "Memory (RAM)",
          value: product.name.includes("MacBook")
            ? "16GB Unified Memory"
            : "8GB RAM",
        },
        { label: "Storage", value: "512GB Superfast SSD" },
        { label: "Display Resolution", value: "Liquid Retina / QHD Display" },
        {
          label: "Operating System",
          value:
            product.name.includes("MacBook") || product.name.includes("iPad")
              ? "macOS / iPadOS"
              : "Windows 11 Home",
        },
        { label: "Battery Life", value: "Up to 18 Hours video playback" },
      ];
    } else if (
      product.category === "Home Appliances" ||
      product.name.includes("TV") ||
      product.name.includes("Vacuum")
    ) {
      return [
        { label: "Power Consumption", value: "120W Eco Saver Mode" },
        { label: "Dimensions", value: "Standard Product Size" },
        {
          label: "In the Box",
          value: "Main unit, user manual, power adapter, remote controller",
        },
        { label: "Smart Integration", value: "Yes (SmartThings / Apple Home)" },
        { label: "Warranty", value: "2 Years Home Service Warranty" },
      ];
    } else {
      return [
        { label: "Category Type", value: product.category },
        { label: "Package Weight", value: "1.2 kg" },
        { label: "Condition", value: "100% Original Brand New" },
        {
          label: "Color Options",
          value: "Space Gray, Titanium Silver, Onyx Black",
        },
      ];
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border animate-in fade-in slide-in-from-top-4 duration-300 ${
            toastMsg.type === "success"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-linear-to-r from-primary to-primary-container p-6 rounded-3xl text-on-primary shadow-card relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <ShoppingCart size={200} />
        </div>
        <div className="relative z-10 max-w-md space-y-2">
          <span className="text-xs font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full uppercase">
            Cooperative Shop
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display">
            Save up for quality items & electronics!
          </h1>
          <p className="text-xs text-on-primary/80 font-normal leading-relaxed">
            Choose any product from the catalog. Click the product cards to view
            detailed technical specifications. Save up in flexible deposits.
            Once your payments clear off the price, the seller admin will
            disburse it directly to you!
          </p>
        </div>
      </div>

      {/* Role Toggle Switcher */}
      <div className="flex items-center justify-between bg-surface border border-outline-variant/20 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <UserCheck size={20} className="text-primary" />
          <div>
            <div className="text-sm font-bold text-on-surface">
              Interactive Role Toggle
            </div>
            <div className="hidden md:block text-xs text-on-surface-variant">
              Switch roles to test admin and member flows
            </div>
          </div>
        </div>
        <div className="flex bg-surface-variant/40 p-1 rounded-full">
          <button
            onClick={() => setIsAdminMode(false)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              !isAdminMode
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Member View
          </button>
          <button
            onClick={() => setIsAdminMode(true)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              isAdminMode
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Seller Admin
          </button>
        </div>
      </div>

      {/* MEMBER VIEW */}
      {!isAdminMode && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-outline-variant/10 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-on-surface-variant font-medium">
                Wallet Balance
              </div>
              <div className="text-xl font-extrabold text-on-surface mt-1.5 flex items-baseline font-display">
                <span className="text-sm mr-0.5 font-sans">₦</span>
                {walletBalance.toLocaleString()}
              </div>
            </div>
            <div className="bg-surface border border-outline-variant/10 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-on-surface-variant font-medium">
                Active Plans
              </div>
              <div className="text-xl font-extrabold text-on-surface mt-1.5 flex items-baseline">
                {itemSavings.filter((p) => p.status !== "disbursed").length}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-surface border border-outline-variant/10 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-on-surface-variant font-medium">
                Total Saved
              </div>
              <div className="text-xl font-extrabold text-primary mt-1.5 flex items-baseline font-display">
                <span className="text-sm mr-0.5 font-sans">₦</span>
                {itemSavings
                  .reduce((acc, curr) => acc + curr.savedAmount, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>

          {/* Active Item Savings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-on-surface">
                My Active Saving Plans
              </h2>
            </div>

            {itemSavings.length === 0 ? (
              <div className="bg-surface border border-dashed border-outline-variant/30 rounded-2xl p-8 text-center text-on-surface-variant">
                <Info
                  size={32}
                  className="mx-auto mb-2 text-on-surface-variant/40"
                />
                <div className="text-sm font-semibold">
                  No active saving plans yet
                </div>
                <p className="text-xs text-on-surface-variant/70 mt-1 max-w-xs mx-auto">
                  Browse products in our shop catalog below and start a plan to
                  lock down yours!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemSavings.map((plan) => {
                  const progress = Math.min(
                    100,
                    Math.round((plan.savedAmount / plan.itemPrice) * 100),
                  );
                  const isCompleted = plan.status === "completed";
                  const isDisbursed = plan.status === "disbursed";

                  return (
                    <div
                      key={plan.id}
                      className="bg-surface border border-outline-variant/15 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:border-outline-variant/35 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-variant border border-outline-variant/20 shrink-0">
                          <img
                            src={plan.itemImageUrl}
                            alt={plan.itemName}
                            className="w-full h-full object-cover animate-pulse-slow"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-on-surface text-sm truncate">
                            {plan.itemName}
                          </h3>
                          <div className="text-xs text-on-surface-variant mt-0.5 flex items-baseline font-semibold">
                            Target:{" "}
                            <span className="text-on-surface ml-1 font-display">
                              ₦{plan.itemPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Badge */}
                          <div className="mt-2.5">
                            {isDisbursed ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-full">
                                <CheckCircle2 size={12} /> DISBURSED & DELIVERED
                              </span>
                            ) : isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full">
                                <CheckCircle2 size={12} /> AWAITING DISBURSEMENT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                                <Plus size={12} /> SAVING ACTIVE
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-on-surface-variant">
                            Savings Goal Progress
                          </span>
                          <span className="text-on-surface">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDisbursed
                                ? "bg-blue-500"
                                : isCompleted
                                  ? "bg-green-500"
                                  : "bg-primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold">
                          <span>
                            Saved: ₦{plan.savedAmount.toLocaleString()}
                          </span>
                          <span>
                            Left: ₦
                            {Math.max(
                              0,
                              plan.itemPrice - plan.savedAmount,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Payment History Tracker */}
                      {plan.payments.length > 0 && (
                        <div className="bg-surface-variant/20 rounded-xl p-3 space-y-1.5">
                          <div className="text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant flex items-center gap-1.5">
                            <History size={12} /> Payment History Track
                          </div>
                          <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-hide">
                            {plan.payments.map((p) => (
                              <div
                                key={p.id}
                                className="flex justify-between text-xs text-on-surface-variant"
                              >
                                <span>
                                  {new Date(p.date).toLocaleDateString()}
                                </span>
                                <span className="font-semibold text-on-surface">
                                  +₦{p.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Make Payment & Cancel buttons */}
                      {!isCompleted && !isDisbursed && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to cancel this saving plan? ₦${plan.savedAmount.toLocaleString()} will be refunded to your wallet balance.`,
                                )
                              ) {
                                const res = removeSavingPlan(plan.id);
                                if (res.success) {
                                  showToast("success", res.message);
                                } else {
                                  showToast("error", res.message);
                                }
                              }
                            }}
                            className="bg-error/10 hover:bg-error/20 text-error font-bold text-xs px-3.5 py-3 rounded-xl transition-colors flex items-center gap-1.5"
                            title="Cancel Saving Plan"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                          <button
                            onClick={() => setSelectedPlanToPay(plan)}
                            className="flex-1 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1"
                          >
                            Fund Saving Goal <ArrowRight size={14} />
                          </button>
                        </div>
                      )}

                      {/* Cancel option for completed but not yet disbursed plans */}
                      {isCompleted && !isDisbursed && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel this plan? ₦${plan.savedAmount.toLocaleString()} will be refunded to your wallet balance.`,
                              )
                            ) {
                              const res = removeSavingPlan(plan.id);
                              if (res.success) {
                                showToast("success", res.message);
                              } else {
                                showToast("error", res.message);
                              }
                            }
                          }}
                          className="w-full bg-error/10 hover:bg-error/20 text-error font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={14} /> Cancel Goal & Refund Wallet
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Browse Store Catalog */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-on-surface">
                  Browse Shop Catalog
                </h2>
              </div>
              <div className="text-xs font-semibold text-on-surface-variant">
                {filteredProducts.length} items available
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-surface border border-outline-variant/25 rounded-2xl px-4 py-3 flex items-center gap-2.5 focus-within:border-primary/50 transition-colors">
                <Search size={18} className="text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search products (click cards to view specs)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none text-on-surface placeholder:text-on-surface-variant/50"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        : "bg-surface border border-outline-variant/10 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-surface border border-outline-variant/10 rounded-2xl p-8 text-center text-on-surface-variant">
                <div className="text-sm font-semibold">No products found</div>
                <p className="text-xs text-on-surface-variant/70 mt-1">
                  Try resetting the filter or typing another search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const hasPlan = itemSavings.some(
                    (s) => s.itemId === product.id && s.status !== "disbursed",
                  );

                  return (
                    <div
                      key={product.id}
                      className="group bg-surface border border-outline-variant/15 rounded-3xl overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image section (Clickable to view Specs) */}
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="relative aspect-video bg-surface-variant overflow-hidden cursor-pointer"
                        title="Click to view specifications"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {product.category}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                            View Specifications
                          </span>
                          {/* <Info size={14} /> */}
                        </div>
                      </div>

                      {/* Body details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div
                          onClick={() => setSelectedProduct(product)}
                          className="space-y-1.5 cursor-pointer"
                          title="Click to view specifications"
                        >
                          <h3 className="font-bold text-on-surface text-base line-clamp-1 group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {product.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed font-normal">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                              Item Price
                            </span>
                            <span className="text-lg font-extrabold text-on-surface font-display">
                              ₦{product.price.toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors bg-primary text-on-primary hover:bg-primary/95 shadow-sm"
                          >
                            View Specs
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* SELLER ADMIN VIEW */}
      {isAdminMode && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface border border-outline-variant/20 p-5 rounded-2xl shadow-sm gap-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Store Admin Catalog Management
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Post cooperative shopping items and verify member payments
              </p>
            </div>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus size={16} /> Add Shop Item
            </button>
          </div>

          {/* Member Savings plans Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-on-surface">
                Member Saving Plan Tracker & Disbursement
              </h2>
            </div>

            {itemSavings.length === 0 ? (
              <div className="bg-surface border border-dashed border-outline-variant/30 rounded-2xl p-8 text-center text-on-surface-variant">
                <Info
                  size={32}
                  className="mx-auto mb-2 text-on-surface-variant/40"
                />
                <div className="text-sm font-semibold">No member plans yet</div>
                <p className="text-xs text-on-surface-variant/70 mt-1">
                  When members start saving for items, they will appear here for
                  payment tracking.
                </p>
              </div>
            ) : (
              <div className="bg-surface border border-outline-variant/15 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-variant/30 text-on-surface-variant uppercase font-extrabold tracking-wider border-b border-outline-variant/20">
                        <th className="p-4">Member</th>
                        <th className="p-4">Item Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Saved Amount</th>
                        <th className="p-4">Progress</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 font-semibold text-on-surface">
                      {itemSavings.map((plan) => {
                        const progress = Math.min(
                          100,
                          Math.round((plan.savedAmount / plan.itemPrice) * 100),
                        );
                        return (
                          <tr
                            key={plan.id}
                            className="hover:bg-surface-variant/10 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                  JD
                                </div>
                                <div>
                                  <div className="text-xs font-bold">
                                    John Doe
                                  </div>
                                  <div className="text-[10px] text-on-surface-variant font-medium">
                                    Coop Member
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-bold">{plan.itemName}</td>
                            <td className="p-4 font-display">
                              ₦{plan.itemPrice.toLocaleString()}
                            </td>
                            <td className="p-4 font-mono">
                              ₦{plan.savedAmount.toLocaleString()}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${plan.status === "disbursed" ? "bg-blue-500" : plan.status === "completed" ? "bg-green-500" : "bg-primary"}`}
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span>{progress}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {plan.status === "disbursed" ? (
                                <span className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border border-blue-500/20">
                                  DISBURSED
                                </span>
                              ) : plan.status === "completed" ? (
                                <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border border-green-500/20">
                                  PAYMENT CLEARED
                                </span>
                              ) : (
                                <span className="bg-yellow-500/10 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border border-yellow-500/20">
                                  SAVING
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              {plan.status === "completed" ? (
                                <button
                                  onClick={() => handleDisburse(plan.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                                >
                                  Disburse Item
                                </button>
                              ) : plan.status === "disbursed" ? (
                                <span className="text-blue-500 text-[11px] font-bold">
                                  Completed & Delivered
                                </span>
                              ) : (
                                <span className="text-on-surface-variant text-[11px] font-medium">
                                  Tracking Payments...
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Catalog Listing Table */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-on-surface">
              Manage Store Items ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-outline-variant/15 p-4 rounded-2xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surface-variant rounded-lg overflow-hidden border border-outline-variant/10 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-on-surface">
                        {item.name}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5 font-display font-semibold">
                        ₦{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deleteItem(item.id);
                      showToast(
                        "success",
                        `${item.name} removed from catalog.`,
                      );
                    }}
                    className="text-error hover:bg-error/10 p-2.5 rounded-xl transition-colors text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* MODAL: Save For Item Details & Specifications */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant/20 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full bg-surface-variant/30 hover:bg-surface-variant transition-colors z-10"
              title="Close Specifications Overlay"
            >
              <X size={20} />
            </button>

            <div className="space-y-5 max-h-[85vh] overflow-y-auto pr-1 scrollbar-hide">
              <div className="aspect-video w-full rounded-2xl bg-surface-variant overflow-hidden border border-outline-variant/10 relative">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-[10px] text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedProduct.category}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-on-surface">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-normal">
                  {selectedProduct.description}
                </p>
              </div>

              {/* TECHNICAL SPECIFICATIONS GRID */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <Tag size={14} className="text-primary" /> Full Specifications
                  & details
                </h4>
                <div className="bg-surface-variant/20 rounded-2xl border border-outline-variant/10 divide-y divide-outline-variant/10 overflow-hidden text-xs">
                  {getProductSpecs(selectedProduct).map((spec, index) => (
                    <div key={index} className="flex justify-between p-3">
                      <span className="text-on-surface-variant font-medium">
                        {spec.label}
                      </span>
                      <span className="text-on-surface font-semibold text-right max-w-[60%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-variant/30 rounded-2xl p-4 flex justify-between items-center border border-outline-variant/10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                    Installment Target
                  </span>
                  <div className="text-xl font-extrabold text-on-surface font-display mt-0.5">
                    ₦{selectedProduct.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant font-sans">
                    Lock Frequency
                  </span>
                  <div className="text-xs font-bold text-primary mt-1">
                    Flexible Deposits
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-surface-variant/50 hover:bg-surface-variant/80 text-on-surface font-bold text-xs py-3.5 rounded-xl transition-colors border border-outline-variant/10"
                >
                  Close
                </button>
                {(() => {
                  const hasPlan = itemSavings.some(
                    (s) =>
                      s.itemId === selectedProduct.id &&
                      s.status !== "disbursed",
                  );
                  return (
                    <button
                      onClick={() => handleStartSaving(selectedProduct)}
                      disabled={hasPlan}
                      className={`flex-1 font-bold text-xs py-3.5 rounded-xl transition-colors shadow-sm active:scale-95 ${
                        hasPlan
                          ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default"
                          : "bg-primary hover:bg-primary/95 text-on-primary"
                      }`}
                    >
                      {hasPlan ? "Already Saving" : "Start Saving Now"}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Make simulated Payment */}
      {selectedPlanToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant/20 rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPlanToPay(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleMakePayment} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Fund Saving Target
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Make payment from your wallet balance to buy{" "}
                  {selectedPlanToPay.itemName}
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="bg-surface-variant/30 rounded-2xl p-4 border border-outline-variant/10 space-y-2">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Available Wallet Balance:</span>
                  <span className="font-bold text-on-surface">
                    ₦{walletBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Total Item Price:</span>
                  <span className="font-bold text-on-surface font-display">
                    ₦{selectedPlanToPay.itemPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Saved So Far:</span>
                  <span className="font-bold text-green-500">
                    ₦{selectedPlanToPay.savedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-on-surface border-t border-outline-variant/20 pt-2">
                  <span>Remaining Payment:</span>
                  <span>
                    ₦
                    {(
                      selectedPlanToPay.itemPrice -
                      selectedPlanToPay.savedAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Input field */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant">
                  Payment Amount (₦)
                </label>
                <div className="bg-surface border border-outline-variant/35 rounded-xl px-4 py-3 flex items-center focus-within:border-primary transition-colors">
                  <span className="text-on-surface-variant/70 font-semibold mr-1.5 font-sans">
                    ₦
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="Enter amount to pay"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-on-surface placeholder:text-on-surface-variant/40 font-semibold"
                  />
                </div>
              </div>

              {/* Quick selectors */}
              <div className="flex gap-2">
                {[
                  { label: "₦10k", val: 10000 },
                  { label: "₦50k", val: 50000 },
                  { label: "₦100k", val: 100000 },
                  {
                    label: "Full Pay",
                    val:
                      selectedPlanToPay.itemPrice -
                      selectedPlanToPay.savedAmount,
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPaymentAmount(item.val.toString())}
                    className="flex-1 bg-surface-variant/40 hover:bg-surface-variant/80 border border-outline-variant/10 text-on-surface text-[11px] font-bold py-2 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isAuthorizing || authSuccess}
                  onClick={() => setSelectedPlanToPay(null)}
                  className="flex-1 bg-surface-variant/50 hover:bg-surface-variant/80 text-on-surface font-bold text-xs py-3.5 rounded-xl transition-colors border border-outline-variant/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizing || authSuccess}
                  className="flex-1 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs py-3.5 rounded-xl transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-85 disabled:cursor-not-allowed"
                >
                  {isAuthorizing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Authorizing...
                    </>
                  ) : authSuccess ? (
                    <>
                      <CheckCircle2 size={14} className="text-white" />
                      Approved!
                    </>
                  ) : (
                    "Authorize Payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Admin Add Item */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-outline-variant/20 rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddItemOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Add Shop Product
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Post an item for cooperative purchase
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPad Pro M4"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/35 rounded-xl px-4 py-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Target Price (₦)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1100000"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/35 rounded-xl px-4 py-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/35 rounded-xl px-4 py-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Computers">Computers</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant flex items-center justify-between">
                  <span>Product Image</span>
                  <span className="text-[9px] text-primary lowercase font-medium">
                    snap photo or paste URL
                  </span>
                </label>

                {newItemImageUrl ? (
                  <div className="relative border border-outline-variant/35 rounded-2xl overflow-hidden bg-surface-variant/20 p-2 flex items-center gap-3">
                    <img
                      src={newItemImageUrl}
                      alt="Product preview"
                      className="w-16 h-16 object-cover rounded-xl border border-outline-variant/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {newItemImageUrl.startsWith("data:") ? "Snapped Photo" : "Custom Image URL"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {newItemImageUrl.substring(0, 45)}...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewItemImageUrl("")}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Snap Photo Button */}
                    <label className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-variant/10 hover:bg-primary/5 rounded-2xl p-4 cursor-pointer transition-all active:scale-98 text-center">
                      <Camera size={20} className="text-primary" />
                      <span className="text-xs font-bold text-on-surface">Snap Photo</span>
                      <span className="text-[9px] text-on-surface-variant">Use device camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setNewItemImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Choose File / Paste URL section */}
                    <label className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-variant/10 hover:bg-primary/5 rounded-2xl p-4 cursor-pointer transition-all active:scale-98 text-center">
                      <Upload size={20} className="text-on-surface-variant" />
                      <span className="text-xs font-bold text-on-surface">Upload File</span>
                      <span className="text-[9px] text-on-surface-variant">Select from library</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setNewItemImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {!newItemImageUrl && (
                  <div className="relative flex items-center justify-center my-1.5">
                    <span className="absolute bg-surface px-3 text-[10px] text-on-surface-variant/50 font-bold uppercase">
                      or paste url
                    </span>
                    <hr className="w-full border-outline-variant/20" />
                  </div>
                )}

                {!newItemImageUrl && (
                  <input
                    type="url"
                    placeholder="Paste product image web link..."
                    value={newItemImageUrl}
                    onChange={(e) => setNewItemImageUrl(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/35 rounded-xl px-4 py-2.5 text-sm outline-none text-on-surface focus:border-primary transition-colors"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter detailed description of specifications, packaging, and shipping rules..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/35 rounded-xl px-4 py-3 text-sm outline-none text-on-surface focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddItemOpen(false);
                    setNewItemName("");
                    setNewItemPrice("");
                    setNewItemDesc("");
                    setNewItemCategory("Electronics");
                    setNewItemImageUrl("");
                  }}
                  className="flex-1 bg-surface-variant/50 hover:bg-surface-variant/80 text-on-surface font-bold text-xs py-3.5 rounded-xl transition-colors border border-outline-variant/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs py-3.5 rounded-xl transition-colors shadow-sm active:scale-95"
                >
                  Post Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
