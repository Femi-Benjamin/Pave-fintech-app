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
  content = content.replace(/bg-primary text-on-background/g, "bg-primary text-on-primary");
  fs.writeFileSync(file, content, "utf8");
});
