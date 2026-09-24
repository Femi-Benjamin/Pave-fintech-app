import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Transaction,
  SavingsGoal,
  ThriftProgram,
  Product,
  MessageItem,
  ChatMessage,
  MOCK_TRANSACTIONS,
  MOCK_SAVINGS,
  MOCK_PROGRAMS,
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
  role?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

export interface LocalStoreData {
  walletBalance: number;
  transactions: Transaction[];
  savings: SavingsGoal[];
  programs: ThriftProgram[];
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
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "current">) => SavingsGoal;
  depositToSavings: (
    goalId: string,
    amount: number,
  ) => { success: boolean; message?: string };
  contributeToThrift: (
    programId: string,
    amount: number,
  ) => { success: boolean; message?: string };
  joinProgram: (
    program: Omit<ThriftProgram, "id" | "current" | "myContrib">,
  ) => ThriftProgram;
  payProductInstallment: (
    productId: string,
    amount: number,
  ) => { success: boolean; message?: string };
  startSavingPlan: (
    productId: string,
    initialDeposit: number,
    frequency: string,
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
  savings: MOCK_SAVINGS,
  programs: MOCK_PROGRAMS,
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
        savings: Array.isArray(parsed.savings)
          ? parsed.savings
          : DEFAULT_STORE.savings,
        programs: Array.isArray(parsed.programs)
          ? parsed.programs
          : DEFAULT_STORE.programs,
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

  const addSavingsGoal = useCallback(
    (goal: Omit<SavingsGoal, "id" | "current">) => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: `goal_${Date.now()}`,
        current: 0,
      };
      setStore((prev) => ({
        ...prev,
        savings: [newGoal, ...prev.savings],
      }));
      return newGoal;
    },
    [],
  );

  const depositToSavings = useCallback(
    (goalId: string, amount: number) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const goal = store.savings.find((g) => g.id === goalId);
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `Deposit to ${goal ? goal.name : "Savings"}`,
        amount,
        date: "Just now",
        category: "savings",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
        savings: prev.savings.map((g) =>
          g.id === goalId ? { ...g, current: g.current + amount } : g,
        ),
      }));
      return { success: true };
    },
    [store.walletBalance, store.savings],
  );

  const contributeToThrift = useCallback(
    (programId: string, amount: number) => {
      if (amount <= 0) {
        return { success: false, message: "Invalid amount" };
      }
      if (amount > store.walletBalance) {
        return { success: false, message: "Insufficient wallet balance" };
      }
      const prog = store.programs.find((p) => p.id === programId);
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "debit",
        desc: `Thrift Contribution - ${prog ? prog.name : "Program"}`,
        amount,
        date: "Just now",
        category: "savings",
        status: "success",
      };
      setStore((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - amount,
        transactions: [newTx, ...prev.transactions],
        programs: prev.programs.map((p) =>
          p.id === programId
            ? {
                ...p,
                current: p.current + amount,
                myContrib: p.myContrib + amount,
              }
            : p,
        ),
      }));
      return { success: true };
    },
    [store.walletBalance, store.programs],
  );

  const joinProgram = useCallback(
    (program: Omit<ThriftProgram, "id" | "current" | "myContrib">) => {
      const newProgram: ThriftProgram = {
        ...program,
        id: `prog_${Date.now()}`,
        current: 0,
        myContrib: 0,
      };
      setStore((prev) => ({
        ...prev,
        programs: [newProgram, ...prev.programs],
      }));
      return newProgram;
    },
    [],
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

  const startSavingPlan = useCallback(
    (productId: string, initialDeposit: number, frequency: string) => {
      const prod = store.products.find((p) => p.id === productId);
      const newGoal: SavingsGoal = {
        id: `goal_prod_${Date.now()}`,
        name: `Product: ${prod ? prod.name : "Device"}`,
        goal: prod ? prod.price : initialDeposit * 2,
        current: 0,
        color: "#7C3AED",
        icon: "🛍️",
        daysLeft: 90,
        freq: frequency,
      };
      setStore((prev) => ({
        ...prev,
        savings: [newGoal, ...prev.savings],
      }));
      return { success: true };
    },
    [store.products],
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
    addSavingsGoal,
    depositToSavings,
    contributeToThrift,
    joinProgram,
    payProductInstallment,
    startSavingPlan,
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
