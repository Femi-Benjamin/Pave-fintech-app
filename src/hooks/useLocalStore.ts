import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavingsGoal {
  id: string;
  name: string;
  type: 'flexible' | 'fixed';
  targetAmount: number;
  currentAmount: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  maturityDate: string;
  createdAt: string;
  apy?: number;
  autoSave: boolean;
  streak: number; // consecutive deposit count
}

export interface ThriftGroup {
  id: string;
  name: string;
  isAdmin: boolean;
  amount: string;
  frequency: string;
  members: number;
  contributionStr: string;
  status: string;
  statusType: 'error' | 'success' | 'warning' | 'primary';
}

export interface AirtimeTransaction {
  id: string;
  type: 'airtime' | 'data';
  network: string;
  phone: string;
  amount: number;
  planSize?: string;
  status: 'success' | 'failed' | 'pending';
  date: string;
}

export interface LocalStore {
  walletBalance: number;
  savingsGoals: SavingsGoal[];
  customThriftGroups: ThriftGroup[];
  airtimeTransactions: AirtimeTransaction[];
}

// ─── Default Data ────────────────────────────────────────────────────────────

const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    name: 'Lagos Vacation Fund',
    type: 'flexible',
    targetAmount: 8000000,
    currentAmount: 5200000,
    frequency: 'Monthly',
    maturityDate: '2025-06-30',
    createdAt: '2024-01-15',
    autoSave: true,
    streak: 12,
  },
  {
    id: 'goal_2',
    name: 'Emergency Fund',
    type: 'fixed',
    targetAmount: 20000000,
    currentAmount: 15000000,
    frequency: 'Monthly',
    maturityDate: '2024-10-31',
    createdAt: '2024-04-01',
    apy: 4.5,
    autoSave: true,
    streak: 6,
  },
  {
    id: 'goal_3',
    name: 'Wedding Fund',
    type: 'flexible',
    targetAmount: 5000000,
    currentAmount: 2250000,
    frequency: 'Weekly',
    maturityDate: '2025-12-20',
    createdAt: '2024-06-01',
    autoSave: true,
    streak: 8,
  },
  {
    id: 'goal_4',
    name: 'MacBook Pro M4',
    type: 'fixed',
    targetAmount: 3500000,
    currentAmount: 2800000,
    frequency: 'Monthly',
    maturityDate: '2025-03-15',
    createdAt: '2024-07-01',
    apy: 5.0,
    autoSave: false,
    streak: 4,
  },
  {
    id: 'goal_5',
    name: 'Rent 2025',
    type: 'flexible',
    targetAmount: 4000000,
    currentAmount: 800000,
    frequency: 'Monthly',
    maturityDate: '2025-11-01',
    createdAt: '2024-09-01',
    autoSave: true,
    streak: 2,
  },
  {
    id: 'goal_6',
    name: 'Business Capital',
    type: 'fixed',
    targetAmount: 10000000,
    currentAmount: 5500000,
    frequency: 'Monthly',
    maturityDate: '2025-08-01',
    createdAt: '2024-03-15',
    apy: 6.0,
    autoSave: true,
    streak: 10,
  },
];

const DEFAULT_STORE: LocalStore = {
  walletBalance: 45250,
  savingsGoals: DEFAULT_SAVINGS_GOALS,
  customThriftGroups: [],
  airtimeTransactions: [],
};

const STORAGE_KEY = 'pave_local_store';

// ─── Hook ────────────────────────────────────────────────────────────────────

function loadStore(): LocalStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalStore;
      // Merge defaults for new fields added after first save
      return {
        ...DEFAULT_STORE,
        ...parsed,
        savingsGoals: parsed.savingsGoals?.length ? parsed.savingsGoals : DEFAULT_SAVINGS_GOALS,
      };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_STORE };
}

export function useLocalStore() {
  const [store, setStore] = useState<LocalStore>(loadStore);

  // Persist whenever store changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'streak'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      currentAmount: 0,
      streak: 0,
    };
    setStore(prev => ({ ...prev, savingsGoals: [...prev.savingsGoals, newGoal] }));
    return newGoal;
  }, []);

  const addThriftGroup = useCallback((group: Omit<ThriftGroup, 'id'>) => {
    const newGroup: ThriftGroup = {
      ...group,
      id: `thrift_${Date.now()}`,
    };
    setStore(prev => ({ ...prev, customThriftGroups: [...prev.customThriftGroups, newGroup] }));
    return newGroup;
  }, []);

  const buyAirtime = useCallback((tx: Omit<AirtimeTransaction, 'id' | 'date' | 'status'>) => {
    if (tx.amount > store.walletBalance) {
      return { success: false, message: 'Insufficient wallet balance' };
    }
    const newTx: AirtimeTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'success',
    };
    setStore(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - tx.amount,
      airtimeTransactions: [newTx, ...prev.airtimeTransactions],
    }));
    return { success: true, message: 'Purchase successful!' };
  }, [store.walletBalance]);

  const depositToGoal = useCallback((goalId: string, amount: number) => {
    if (amount > store.walletBalance) {
      return { success: false, message: 'Insufficient wallet balance' };
    }
    setStore(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      savingsGoals: prev.savingsGoals.map(g =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amount, streak: g.streak + 1 }
          : g
      ),
    }));
    return { success: true, message: `₦${amount.toLocaleString()} deposited!` };
  }, [store.walletBalance]);

  return {
    ...store,
    addSavingsGoal,
    addThriftGroup,
    buyAirtime,
    depositToGoal,
  };
}
