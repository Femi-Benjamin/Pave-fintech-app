const fs = require("fs");

const files = [
  "src/components/SavingsHubScreen.tsx",
  "src/components/ThriftScreen.tsx",
  "src/components/AddThriftScreen.tsx",
  "src/components/DepositScreen.tsx",
  "src/components/OTPScreen.tsx",
  "src/components/AirtimeScreen.tsx",
];

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/bg-\[\#0f141e\]/g, "bg-background");
  content = content.replace(/bg-\[\#111827\]/g, "bg-background");
  content = content.replace(/bg-\[\#1a1f2c\]/g, "bg-surface");
  content = content.replace(/bg-\[\#2a3041\]/g, "bg-surface-variant");
  content = content.replace(/text-white/g, "text-on-background");
  content = content.replace(/text-\[\#bfdbfe\]/g, "text-primary");
  content = content.replace(/bg-\[\#3b82f6\]/g, "bg-primary");
  content = content.replace(/text-\[\#3b82f6\]/g, "text-primary");
  content = content.replace(/border-\[\#3b82f6\]/g, "border-primary");
  content = content.replace(/hover:bg-\[\#2563eb\]/g, "hover:bg-primary/90");
  content = content.replace(/hover:text-\[\#2563eb\]/g, "hover:text-primary");
  
  fs.writeFileSync(file, content, "utf8");
});
