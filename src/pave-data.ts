// ─── Types ─────────────────────────────────────────────────────────────────
export type Screen =
  | "splash"
  | "onboarding"
  | "login"
  | "register"
  | "forgot-password"
  | "otp-verify"
  | "accept-invitation"
  | "kyc-welcome"
  | "kyc-nin"
  | "kyc-id-type"
  | "kyc-id-upload"
  | "kyc-selfie"
  | "kyc-pending"
  | "kyc-approved"
  | "home"
  | "notifications"
  | "wallet"
  | "fund-wallet"
  | "transfer"
  | "bills"
  | "airtime"
  | "savings"
  | "create-savings"
  | "savings-detail"
  | "savings-programs"
  | "join-program"
  | "marketplace"
  | "product-detail"
  | "payment-plan"
  | "messages"
  | "chat"
  | "group-chat"
  | "transactions"
  | "profile"
  | "settings";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  desc: string;
  amount: number;
  date: string;
  category: "wallet" | "bills" | "savings" | "airtime" | "transfer" | "marketplace";
  status: "success" | "pending" | "failed";
}

export interface SavingsGoal {
  id: string;
  name: string;
  goal: number;
  current: number;
  color: string;
  icon: string;
  daysLeft: number;
  freq: string;
}

export interface ThriftProgram {
  id: string;
  name: string;
  admin: string;
  members: number;
  target: number;
  current: number;
  myContrib: number;
  nextDue: string;
  freq: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  paid: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  description: string;
}

export interface MessageItem {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "credit",
    desc: "Wallet Funded",
    amount: 50000,
    date: "Jun 14",
    category: "wallet",
    status: "success",
  },
  {
    id: "2",
    type: "debit",
    desc: "Electricity Bill",
    amount: 8500,
    date: "Jun 13",
    category: "bills",
    status: "success",
  },
  {
    id: "3",
    type: "debit",
    desc: "Savings Deposit",
    amount: 20000,
    date: "Jun 12",
    category: "savings",
    status: "success",
  },
  {
    id: "4",
    type: "debit",
    desc: "MTN Airtime",
    amount: 2000,
    date: "Jun 11",
    category: "airtime",
    status: "success",
  },
  {
    id: "5",
    type: "credit",
    desc: "Transfer from Adewale",
    amount: 15000,
    date: "Jun 10",
    category: "transfer",
    status: "success",
  },
  {
    id: "6",
    type: "debit",
    desc: "Water Bill",
    amount: 3200,
    date: "Jun 9",
    category: "bills",
    status: "success",
  },
  {
    id: "7",
    type: "debit",
    desc: "Marketplace Installment",
    amount: 12000,
    date: "Jun 8",
    category: "marketplace",
    status: "success",
  },
  {
    id: "8",
    type: "credit",
    desc: "Wallet Funded",
    amount: 100000,
    date: "Jun 7",
    category: "wallet",
    status: "success",
  },
];

export const MOCK_SAVINGS = [
  {
    id: "1",
    name: "New iPhone",
    goal: 450000,
    current: 187500,
    color: "#3730A3",
    icon: "📱",
    daysLeft: 45,
    freq: "Weekly",
  },
  {
    id: "2",
    name: "School Fees",
    goal: 200000,
    current: 120000,
    color: "#059669",
    icon: "🎓",
    daysLeft: 22,
    freq: "Monthly",
  },
  {
    id: "3",
    name: "Emergency Fund",
    goal: 500000,
    current: 75000,
    color: "#D97706",
    icon: "🛡️",
    daysLeft: 90,
    freq: "Daily",
  },
];

export const MOCK_PROGRAMS: ThriftProgram[] = [
  {
    id: "1",
    name: "PAVE Community Thrift",
    admin: "Okonkwo Group",
    members: 24,
    target: 1000000,
    current: 680000,
    myContrib: 45000,
    nextDue: "Jun 20",
    freq: "Monthly",
  },
  {
    id: "2",
    name: "Staff Cooperative",
    admin: "Lagos Tech Circle",
    members: 18,
    target: 500000,
    current: 220000,
    myContrib: 25000,
    nextDue: "Jun 25",
    freq: "Bi-weekly",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Samsung Galaxy S25 Ultra",
    price: 850000,
    paid: 425000,
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
    category: "Electronics",
    inStock: true,
    rating: 4.8,
    reviews: 234,
    description: "Flagship smartphone with 200MP camera and S-Pen",
  },
  {
    id: "2",
    name: 'LG 55" OLED Smart TV',
    price: 680000,
    paid: 0,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=400&h=300&fit=crop",
    category: "Electronics",
    inStock: true,
    rating: 4.6,
    reviews: 187,
    description: "Crystal clear 4K OLED display with Dolby Vision",
  },
  {
    id: "3",
    name: "Dyson V15 Vacuum",
    price: 185000,
    paid: 92500,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: "Home",
    inStock: true,
    rating: 4.9,
    reviews: 412,
    description: "Cordless vacuum with laser dust detection",
  },
  {
    id: "4",
    name: "MacBook Air M3",
    price: 1200000,
    paid: 0,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "Electronics",
    inStock: false,
    rating: 4.9,
    reviews: 567,
    description: "Ultra-thin laptop with M3 chip",
  },
  {
    id: "5",
    name: "Nike Air Jordan 1",
    price: 75000,
    paid: 37500,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "Fashion",
    inStock: true,
    rating: 4.7,
    reviews: 892,
    description: "Classic high-top basketball sneaker",
  },
  {
    id: "6",
    name: "Instant Pot Duo 7-in-1",
    price: 45000,
    paid: 0,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    category: "Kitchen",
    inStock: true,
    rating: 4.5,
    reviews: 321,
    description: "Multi-function electric pressure cooker",
  },
];

export const MOCK_MESSAGES: MessageItem[] = [
  {
    id: "1",
    name: "Chinwe Okonkwo",
    avatar: "CO",
    lastMsg: "Thanks for the contribution!",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "PAVE Community Thrift",
    avatar: "PCT",
    lastMsg: "Admin: Next contribution due Friday",
    time: "1h",
    unread: 5,
    online: false,
    isGroup: true,
  },
  {
    id: "3",
    name: "Emeka Adeyemi",
    avatar: "EA",
    lastMsg: "When is the next payout?",
    time: "3h",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Staff Cooperative",
    avatar: "SC",
    lastMsg: "Welcome to the group!",
    time: "1d",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: "5",
    name: "Fatima Hassan",
    avatar: "FH",
    lastMsg: "Got it, will transfer today",
    time: "2d",
    unread: 0,
    online: false,
  },
];

export const MOCK_CHAT: ChatMessage[] = [
  {
    id: "1",
    from: "them",
    text: "Hi! Your savings goal is coming along great 🎉",
    time: "10:22 AM",
  },
  {
    id: "2",
    from: "me",
    text: "Thank you! I'm trying to stay consistent",
    time: "10:24 AM",
  },
  {
    id: "3",
    from: "them",
    text: "Your next weekly deposit is due on Saturday. Will you be ready?",
    time: "10:25 AM",
  },
  {
    id: "4",
    from: "me",
    text: "Yes, I've set a reminder already",
    time: "10:27 AM",
  },
  {
    id: "5",
    from: "them",
    text: "Perfect! You're 42% of the way to your iPhone goal 📱",
    time: "10:28 AM",
  },
];

export const SPEND_DATA = [
  { day: "Mon", amount: 12000 },
  { day: "Tue", amount: 8500 },
  { day: "Wed", amount: 22000 },
  { day: "Thu", amount: 5000 },
  { day: "Fri", amount: 18000 },
  { day: "Sat", amount: 35000 },
  { day: "Sun", amount: 9000 },
];

export const PIE_DATA = [
  { name: "Savings", value: 45, color: "#3730A3" },
  { name: "Bills", value: 20, color: "#059669" },
  { name: "Transfers", value: 15, color: "#D97706" },
  { name: "Airtime", value: 10, color: "#7C3AED" },
  { name: "Others", value: 10, color: "#DB2777" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export const fmt = (n: number) => `₦${n.toLocaleString()}`;
export const pct = (current: number, goal: number) =>
  Math.min(100, Math.round((current / goal) * 100));
