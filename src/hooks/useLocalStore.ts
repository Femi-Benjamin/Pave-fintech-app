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

export interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export interface PaymentTrack {
  id: string;
  amount: number;
  date: string;
}

export interface ItemSaving {
  id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemImageUrl: string;
  savedAmount: number;
  status: 'saving' | 'completed' | 'disbursed';
  payments: PaymentTrack[];
  createdAt: string;
  completedAt?: string;
  disbursedAt?: string;
}

export interface LocalStore {
  walletBalance: number;
  savingsGoals: SavingsGoal[];
  customThriftGroups: ThriftGroup[];
  airtimeTransactions: AirtimeTransaction[];
  items?: Item[];
  itemSavings?: ItemSaving[];
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

const DEFAULT_ITEMS: Item[] = [
  {
    id: 'item_1',
    name: 'iPhone 16 Pro Max (256GB)',
    price: 220000, // Reduced price slightly so simulating saving is faster & easier to test!
    description: 'Latest Apple iPhone with Titanium design, action button, and Camera Control.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_2',
    name: 'MacBook Air M3 (13-inch)',
    price: 160000,
    description: 'Supercharged by Apple M3 chip, with 16GB unified memory and silent, fanless design.',
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_3',
    name: 'Samsung 55" QLED 4K Smart TV',
    price: 75000,
    description: 'Quantum Dot technology for 100% Color Volume and smart TV capabilities.',
    category: 'Home Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_4',
    name: 'Sony WH-1000XM5 Headphones',
    price: 45000,
    description: 'Industry-leading noise canceling headphones with dual processors and exceptional sound quality.',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_5',
    name: 'PlayStation 5 Pro',
    price: 95000,
    description: 'Sony gaming console with advanced ray tracing, custom GPU, and immersive 3D audio.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_6',
    name: 'iPad Pro M4 (11-inch)',
    price: 140000,
    description: 'Ultra thin design powered by the revolutionary M4 chip with stunning Tandem OLED display.',
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_7',
    name: 'AirPods Pro 2',
    price: 30000,
    description: 'Active Noise Cancellation, Adaptive Audio, and personalized spatial sound experience.',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_8',
    name: 'Dell XPS 15 Laptop',
    price: 190000,
    description: 'Premium business and creator laptop with stunning InfinityEdge display and Intel Core i9.',
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  },
  {
    id: 'item_9',
    name: 'Dyson V15 Detect Vacuum',
    price: 85000,
    description: 'Smart cordless vacuum cleaner with laser dust detection and high suction power.',
    category: 'Home Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=60',
    createdAt: '2026-05-19'
  }
];

const DEFAULT_STORE: LocalStore = {
  walletBalance: 250000, // Starting wallet balance of 250,000 NGN
  savingsGoals: DEFAULT_SAVINGS_GOALS,
  customThriftGroups: [],
  airtimeTransactions: [],
  items: DEFAULT_ITEMS,
  itemSavings: []
};

const STORAGE_KEY = 'pave_local_store';

// ─── Hook ────────────────────────────────────────────────────────────────────

function loadStore(): LocalStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalStore;
      
      // One-time migration to 250,000 NGN for the user
      let walletBalance = parsed.walletBalance;
      if (!localStorage.getItem('pave_wallet_migrated_250k')) {
        walletBalance = 250000;
        localStorage.setItem('pave_wallet_migrated_250k', 'true');
      } else if (walletBalance === undefined) {
        walletBalance = 250000;
      }

      return {
        ...DEFAULT_STORE,
        ...parsed,
        walletBalance,
        savingsGoals: parsed.savingsGoals?.length ? parsed.savingsGoals : DEFAULT_SAVINGS_GOALS,
        items: (() => {
          const userItems = parsed.items || [];
          const defaultIds = new Set(DEFAULT_ITEMS.map(i => i.id));
          const customItems = userItems.filter(i => !defaultIds.has(i.id));
          return [...DEFAULT_ITEMS, ...customItems];
        })(),
        itemSavings: parsed.itemSavings || []
      };
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem('pave_wallet_migrated_250k', 'true');
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

  const addItem = useCallback((item: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...item,
      id: `item_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStore(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
    return newItem;
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setStore(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== itemId)
    }));
  }, []);

  const startItemSaving = useCallback((item: Item) => {
    const existing = (store.itemSavings || []).find(s => s.itemId === item.id && s.status !== 'disbursed');
    if (existing) {
      return { success: false, message: 'You are already saving for this item!' };
    }
    const newPlan: ItemSaving = {
      id: `item_save_${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price,
      itemImageUrl: item.imageUrl,
      savedAmount: 0,
      status: 'saving',
      payments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStore(prev => ({
      ...prev,
      itemSavings: [...(prev.itemSavings || []), newPlan]
    }));
    return { success: true, message: `Started saving for ${item.name}!`, plan: newPlan };
  }, [store.itemSavings]);

  const saveForItem = useCallback((planId: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, message: 'Invalid payment amount.' };
    }
    if (amount > store.walletBalance) {
      return { success: false, message: 'Insufficient wallet balance' };
    }
    
    let message = '';
    let success = true;

    setStore(prev => {
      const updatedSavings = (prev.itemSavings || []).map(plan => {
        if (plan.id === planId) {
          const newSaved = plan.savedAmount + amount;
          const isCompleted = newSaved >= plan.itemPrice;
          message = isCompleted 
            ? `₦${amount.toLocaleString()} saved! Plan completed - awaiting disbursement.` 
            : `₦${amount.toLocaleString()} saved towards ${plan.itemName}!`;
          
          return {
            ...plan,
            savedAmount: newSaved,
            status: (isCompleted ? 'completed' : 'saving') as 'saving' | 'completed' | 'disbursed',
            completedAt: isCompleted ? new Date().toISOString().split('T')[0] : plan.completedAt,
            payments: [
              ...plan.payments,
              {
                id: `pay_${Date.now()}`,
                amount,
                date: new Date().toISOString()
              }
            ]
          };
        }
        return plan;
      });

      return {
        ...prev,
        walletBalance: prev.walletBalance - amount,
        itemSavings: updatedSavings
      };
    });

    return { success, message };
  }, [store.walletBalance]);

  const disburseItem = useCallback((planId: string) => {
    let success = false;
    let message = '';
    setStore(prev => {
      const updated = (prev.itemSavings || []).map(p => {
        if (p.id === planId) {
          if (p.status !== 'completed') {
            message = 'Item cannot be disbursed yet (payment not cleared).';
            return p;
          }
          success = true;
          message = 'Item disbursed successfully!';
          return {
            ...p,
            status: 'disbursed' as const,
            disbursedAt: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      });
      return { ...prev, itemSavings: updated };
    });
    return { success, message };
  }, []);

  const removeSavingPlan = useCallback((planId: string) => {
    let refundedAmount = 0;
    setStore(prev => {
      const plan = (prev.itemSavings || []).find(p => p.id === planId);
      if (!plan) return prev;
      refundedAmount = plan.savedAmount;
      return {
        ...prev,
        walletBalance: prev.walletBalance + refundedAmount,
        itemSavings: (prev.itemSavings || []).filter(p => p.id !== planId)
      };
    });
    return { success: true, message: refundedAmount > 0 ? `Plan deleted! ₦${refundedAmount.toLocaleString()} refunded to your wallet.` : 'Plan deleted successfully.' };
  }, []);

  return {
    ...store,
    addSavingsGoal,
    addThriftGroup,
    buyAirtime,
    depositToGoal,
    addItem,
    deleteItem,
    startItemSaving,
    saveForItem,
    disburseItem,
    removeSavingPlan,
  };
}
