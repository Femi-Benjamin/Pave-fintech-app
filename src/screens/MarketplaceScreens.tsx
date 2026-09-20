import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  Badge,
  PaveBtn,
  ScreenHeader,
  ImageWithFallback,
} from "../components/UI";
import { Screen, fmt, pct, MOCK_PRODUCTS } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { MarketplaceScreenSkeleton } from "../components/Skeleton";

export function MarketplaceScreen({
  onNav,
  setSelectedProduct,
}: {
  onNav: (s: Screen) => void;
  setSelectedProduct: (p: any) => void;
}) {
  const { products } = useLocalStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const categories = ["All", "Electronics", "Fashion", "Home", "Kitchen"];
  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <MarketplaceScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #7C3AED 0%, #6D28D9 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <h2
          className="text-white mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          PAVE Marketplace
        </h2>
        <p className="text-white/70 text-sm mb-4">
          Save now, own it later. Pay 50% to secure.
        </p>
        <div className="bg-white/15 rounded-xl px-4 py-3 flex items-center gap-2 backdrop-blur-sm border border-white/20">
          <Search size={16} className="text-white/60" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
          />
        </div>
      </div>
      <div className="px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${category === c ? "bg-[#7C3AED] text-white" : "bg-white text-[#374151] border border-[#E5E7EB]"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <ShoppingBag size={40} className="text-[#E5E7EB]" />
            <p className="text-[#9CA3AF] text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  onNav("product-detail");
                }}
                className="bg-white rounded-2xl overflow-hidden border border-[#F1F3FB] shadow-sm text-left cursor-pointer"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#F1F3FB]">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {p.paid > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge color="indigo">Paying</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-[#9CA3AF] mb-1">
                    {p.category}
                  </div>
                  <div className="text-sm font-semibold text-[#0D0F1C] leading-tight mb-2 line-clamp-2">
                    {p.name}
                  </div>
                  <div
                    className="font-bold text-[#0D0F1C]"
                    style={{
                      fontFamily: "var(--font-family-display)",
                      fontSize: 15,
                    }}
                  >
                    {fmt(p.price)}
                  </div>
                  <div className="text-xs text-[#7C3AED]">
                    Start from {fmt(p.price / 2)}
                  </div>
                  {p.paid > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-[#F1F3FB] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#7C3AED]"
                          style={{ width: `${pct(p.paid, p.price)}%` }}
                        />
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1">
                        {pct(p.paid, p.price)}% paid
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ProductDetailScreen({
  onNav,
  product,
}: {
  onNav: (s: Screen) => void;
  product: any;
}) {
  const { products } = useLocalStore();
  const p = product || products[0] || MOCK_PRODUCTS[0];
  const isPaying = p.paid > 0;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        <ImageWithFallback
          src={p.image}
          alt={p.name}
          className="w-full aspect-4/3 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <button
          onClick={() => onNav("marketplace")}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <button className="absolute top-12 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md cursor-pointer">
          <Heart size={18} className="text-[#DC2626]" />
        </button>
      </div>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge color="indigo">{p.category}</Badge>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-medium">{p.rating}</span>
              <span className="text-xs text-[#9CA3AF]">({p.reviews})</span>
            </div>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.3,
            }}
          >
            {p.name}
          </h2>
          <p className="text-[#6B7280] text-sm mt-2">{p.description}</p>
        </div>

        <div className="bg-[#F5F3FF] rounded-2xl p-5 border border-[#DDD6FE]">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#7C3AED]" />
            <span className="text-sm font-semibold text-[#7C3AED]">
              Save-to-Own Plan
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ["Full Price", fmt(p.price)],
              ["50% to Secure (Pay Now)", fmt(p.price / 2)],
              ["Balance (on Delivery)", fmt(p.price / 2)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{k}</span>
                <span className="font-semibold text-[#0D0F1C]">{v}</span>
              </div>
            ))}
          </div>
          {isPaying && (
            <div className="mt-3 pt-3 border-t border-[#DDD6FE]">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#7C3AED] font-medium">Already Paid</span>
                <span className="font-bold text-[#7C3AED]">{fmt(p.paid)}</span>
              </div>
              <div className="h-2 bg-[#DDD6FE] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7C3AED]"
                  style={{ width: `${pct(p.paid, p.price)}%` }}
                />
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1">
                {pct(p.paid, p.price)}% of full price paid
              </div>
            </div>
          )}
        </div>

        {isPaying ? (
          <>
            <div className="bg-[#ECFDF5] rounded-xl p-4 flex gap-3">
              <Truck size={16} className="text-[#059669] shrink-0 mt-0.5" />
              <div className="text-sm text-[#065F46]">
                You've reached 50%! Your order will ship soon. Continue paying
                the balance.
              </div>
            </div>
            <PaveBtn variant="green">Continue Paying Balance</PaveBtn>
          </>
        ) : (
          <PaveBtn onClick={() => onNav("payment-plan")}>
            Start Saving — {fmt(p.price / 2)} to Secure
          </PaveBtn>
        )}
        <PaveBtn variant="ghost" onClick={() => onNav("marketplace")}>
          Back to Marketplace
        </PaveBtn>
      </div>
    </div>
  );
}

export function PaymentPlanScreen({
  onNav,
  product,
}: {
  onNav: (s: Screen) => void;
  product?: any;
}) {
  const { products, startSavingPlan } = useLocalStore();
  const p = product || products[0] || MOCK_PRODUCTS[0];
  const [freq, setFreq] = useState("Weekly");
  const [success, setSuccess] = useState(false);
  const freqs = ["Daily", "Weekly", "Monthly"];
  const installment = {
    Daily: Math.ceil(p.price / 2 / 90),
    Weekly: Math.ceil(p.price / 2 / 13),
    Monthly: Math.ceil(p.price / 2 / 3),
  };

  const handleStartPlan = () => {
    startSavingPlan(p.id, Math.round(p.price / 2), freq);
    setSuccess(true);
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader
        title="Payment Plan"
        onBack={() => onNav("product-detail")}
      />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 bg-[#F5F3FF] rounded-2xl p-4">
            <ImageWithFallback
              src={p.image}
              alt={p.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="font-semibold text-sm text-[#0D0F1C]">
                {p.name}
              </div>
              <div className="text-[#7C3AED] font-semibold">{fmt(p.price)}</div>
              <div className="text-xs text-[#9CA3AF]">
                Pay {fmt(p.price / 2)} now to secure
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#374151] block mb-2">
              Payment Frequency
            </label>
            <div className="flex gap-2">
              {freqs.map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${freq === f ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED]" : "border-[#E5E7EB] text-[#374151]"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#F1F3FB] p-5 flex flex-col gap-3">
            <div className="text-sm font-semibold text-[#0D0F1C] mb-1">
              Installment Breakdown
            </div>
            {[
              ["Total to Save (50%)", fmt(p.price / 2)],
              ["Installment Amount", fmt((installment as any)[freq])],
              ["Frequency", freq],
              [
                "Estimated Completion",
                freq === "Daily"
                  ? "~3 months"
                  : freq === "Weekly"
                    ? "~3 months"
                    : "~3 months",
              ],
              ["Balance on Delivery", fmt(p.price / 2)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#9CA3AF]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#FFFBEB] rounded-xl p-4 flex gap-3">
            <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#92400E]">
              Once you reach 50% of the full price, your product will be
              delivered. You continue paying the balance afterward.
            </p>
          </div>
          <PaveBtn onClick={handleStartPlan} variant="gold">
            Start Saving Plan
          </PaveBtn>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl"
          >
            🛍️
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Plan Activated!
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              Your payment plan for {p.name} is now active. Your first
              installment will be on{" "}
              {freq === "Daily"
                ? "tomorrow"
                : freq === "Weekly"
                  ? "next week"
                  : "next month"}
              .
            </p>
          </div>
          <PaveBtn onClick={() => onNav("savings")}>View in My Savings</PaveBtn>
        </div>
      )}
    </div>
  );
}
