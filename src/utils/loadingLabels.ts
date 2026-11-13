const LABELS: Record<string, [string, string]> = {
  home: ["Loading your dashboard", "Getting your account ready"],
  wallet: ["Loading your wallet", "Fetching your balance and tools"],
  "fund-wallet": ["Opening Fund Wallet", "Preparing a secure funding form"],
  transfer: ["Opening Transfer", "Getting your transfer options ready"],
  bills: ["Loading Bill Payments", "Getting available services"],
  airtime: ["Loading Airtime & Data", "Fetching networks and plans"],
  transactions: ["Loading transactions", "Fetching your activity"],
  savings: ["Loading your savings", "Fetching your savings plans"],
  "group-savings": ["Loading Ajo groups", "Fetching your groups"],
  marketplace: ["Loading the marketplace", "Fetching products for you"],
  messages: ["Loading messages", "Fetching your conversations"],
  notifications: ["Loading notifications", "Checking for updates"],
  profile: ["Loading your profile", "Fetching your account details"],
};

export function loadingLabelFor(screen?: string): {
  title: string;
  subtitle: string;
} {
  const hit = screen ? LABELS[screen] : undefined;
  return hit
    ? { title: hit[0], subtitle: hit[1] }
    : { title: "Loading", subtitle: "Just a moment, this won't take long" };
}
