import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Transaction,
  Product,
  MessageItem,
  ChatMessage,
  MOCK_TRANSACTIONS,
  MOCK_PRODUCTS,
  MOCK_MESSAGES,
  MOCK_CHAT,
} from "../pave-data";

export interface AuthUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  kycStatus?: string;
  isKycVerified?: boolean;
  role?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

export interface LocalStoreData {
  walletBalance: number;
  transactions: Transaction[];
  products: Product[];
  messages: MessageItem[];
  chatMessages: ChatMessage[];
  authUser: AuthUser | null;
}

export interface StoreContextType extends LocalStoreData {
  fundWallet: (amount: number, method: string) => boolean;
  transferMoney: (
    amount: number,
    recipientName: string,
    bank: string,
    note?: string,
  ) => { success: boolean; message?: string };
  payBill: (
    category: string,
    biller: string,
    amount: number,
    accountOrMeter: string,
  ) => { success: boolean; message?: string };
  buyAirtime: (
    phone: string,
    network: string,
    amount: number,
  ) => { success: boolean; message?: string };
  payProductInstallment: (
    productId: string,
    amount: number,
  ) => { success: boolean; message?: string };
  sendMessage: (to: string, text: string) => void;
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => void;
  resetStore: () => void;
}

const STORAGE_KEY = "pave_wallet_store_v2";
const AUTH_USER_KEY = "pave_auth_user";

const DEFAULT_STORE: LocalStoreData = {
  walletBalance: 247500,
  transactions: MOCK_TRANSACTIONS,
  products: MOCK_PRODUCTS,
  messages: MOCK_MESSAGES,
  chatMessages: MOCK_CHAT,
  authUser: null,
};

function getInitialStore(): LocalStoreData {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        walletBalance:
          typeof parsed.walletBalance === "number"
            ? parsed.walletBalance
            : DEFAULT_STORE.walletBalance,
        transactions: Array.isArray(parsed.transactions)
          ? parsed.transactions
          : DEFAULT_STORE.transactions,
        products: Array.isArray(parsed.products)
          ? parsed.products
          : DEFAULT_STORE.products,
        messages: Array.isArray(parsed.messages)
          ? parsed.messages
          : DEFAULT_STORE.messages,
        chatMessages: Array.isArray(parsed.chatMessages)
          ? parsed.chatMessages
          : DEFAULT_STORE.chatMessages,
        authUser:
          parsed.authUser && typeof parsed.authUser === "object"
            ? parsed.authUser
            : null,
      };
    }
  } catch (e) {
    console.error("Error reading localStorage:", e);
  }

  try {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && typeof parsedUser === "object") {
        return { ...DEFAULT_STORE, authUser: parsedUser };
      }
    }
  } catch (e) {
    console.error("Error reading saved user:", e);
  }

  return DEFAULT_STORE;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<LocalStoreData>(getInitialStore);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(store.authUser ?? null),
      );
    } catch (e) {
      console.error("Error writing to localStorage:", e);
    }
  }, [store]);

  const setAuthUser = useCallback((user: AuthUser | null) => {
    setStore((prev) => ({ ...prev, authUser: user }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pave_token");
    localStorage.removeItem(AUTH_USER_KEY);
    setStore((prev) => ({ ...prev, authUser: null }));
  }, []);

  const fundWallet = useCallback((amount: number, method: string) => {
    if (amount <= 0) return false;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: "credit",
      desc: method === "card" ? "Card Top-up" : "Virtual Account Transfer",
      amount,
      date: "Just now",
      category: "wallet",
      status: "success",
    };
    setStore((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
      transactions: [newTx, ...prev.transactions],
    }));
    return true;
  }, []);

  const transferMoney = useCallback(
    (amount: number, recipientName: string, bank: string, note?: string) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `Transfer to ${recipientName} (${bank})${note ? ` - ${note}` : ""}`,
        amount,
        date: "Just now",
        category: "transfer",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
      }));
      return { success: true };
    },
    [store.walletBalance],
  );

  const payBill = useCallback(
    (
      category: string,
      biller: string,
      amount: number,
      accountOrMeter: string,
    ) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid bill amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `${biller} Bill Payment (${accountOrMeter})`,
        amount,
        date: "Just now",
        category: "bills",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
      }));
      return { success: true };
    },
    [store.walletBalance],
  );

  const buyAirtime = useCallback(
    (phone: string, network: string, amount: number) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `${network.toUpperCase()} Airtime (${phone})`,
        amount,
        date: "Just now",
        category: "airtime",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
      }));
      return { success: true };
    },
    [store.walletBalance],
  );

  const payProductInstallment = useCallback(
    (productId: string, amount: number) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const prod = store.products.find((p) => p.id === productId);
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `Marketplace Installment - ${prod ? prod.name : "Product"}`,
        amount,
        date: "Just now",
        category: "marketplace",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
        products: prev.products.map((p) =>
          p.id === productId
            ? { ...p, paid: Math.min(p.price, p.paid + amount) }
            : p,
        ),
      }));
      return { success: true };
    },
    [store.walletBalance, store.products],
  );

  const sendMessage = useCallback((to: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      from: "me",
      text,
      time: "Just now",
    };
    setStore((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg],
      messages: prev.messages.map((m) =>
        m.name === to ? { ...m, lastMsg: text, time: "Now" } : m,
      ),
    }));
  }, []);

  const resetStore = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem("pave_token");
    setStore(DEFAULT_STORE);
  }, []);

  const value: StoreContextType = {
    ...store,
    fundWallet,
    transferMoney,
    payBill,
    buyAirtime,
    payProductInstallment,
    sendMessage,
    setAuthUser,
    logout,
    resetStore,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useLocalStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useLocalStore must be used within a StoreProvider");
  }
  return context;
}
