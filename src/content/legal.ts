/**
 * Legal and help content for PAVEPADI. Everything the documents say about the
 * company or how to reach it lives in LEGAL below, so one edit updates the
 * Terms, Privacy Policy, Cookie Policy, Help Centre and the in-app panels.
 */

export const LEGAL = {
  brand: "PAVEPADI",
  entity: "Paceployt Ltd",
  website: "https://pavepadi.com",
  effectiveDate: "23 November 2026",
  /**
   * Support channels. Leave a value empty to hide that channel; the Help
   * Centre then points users to the in-app Help & Support section instead.
   */
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    hours: "",
  },
} as const;

export type Block = string | { list: string[] };
export interface Section {
  id: string;
  title: string;
  body: Block[];
}
export type LegalSlug = "terms" | "privacy" | "cookies";
export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  summary: string;
  sections: Section[];
}
export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

const B = LEGAL.brand;
const E = LEGAL.entity;

export const TERMS: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  summary: `The rules for using ${B}. By creating an account or using the app you agree to them.`,
  sections: [
    {
      id: "about",
      title: "1. About these Terms",
      body: [
        `${B} is a digital wallet, savings and community thrift (Ajo / Esusu) service operated by ${E} ("we", "us", "our"). These Terms of Service ("Terms") are an agreement between you and ${E} for your use of the ${B} website, web app and installable app (together, the "Service").`,
        `Please read them with our Privacy Policy and Cookie Policy. If you do not agree, do not create an account or use the Service.`,
      ],
    },
    {
      id: "not-a-bank",
      title: "2. What we are, and are not",
      body: [
        `${B} is not a bank. Wallet funding, bank transfers, bill payments and similar payment services are provided with the help of licensed payment, banking and bill-payment partners. Your use of those services may also be subject to the partner's own rules.`,
        `Nothing in the Service is financial, investment, tax or legal advice. Savings goals and thrift circles are tools to help you organise money; they do not promise any return unless a feature clearly says otherwise.`,
      ],
    },
    {
      id: "eligibility",
      title: "3. Who can use the Service",
      body: [
        "To use the Service you must:",
        {
          list: [
            "be at least 18 years old and able to enter a binding agreement;",
            "live in, or lawfully use the Service from, Nigeria;",
            "give us accurate, current and complete information; and",
            "use only one account for yourself.",
          ],
        },
        `We may refuse, limit or close an account where we cannot confirm who you are, or where the law or a partner requires it.`,
      ],
    },
    {
      id: "account",
      title: "4. Your account and security",
      body: [
        "You are responsible for everything done through your account. Keep your password and any verification codes private, and do not share your device with people you do not trust.",
        `${B} will never ask you for your password or one-time codes, by call, message or email. If someone does, do not share them and tell us.`,
        "For your protection we automatically sign you out after a period of inactivity, so you may need to sign in again.",
        "Tell us straight away if you think someone else has accessed your account or if you see activity you do not recognise.",
      ],
    },
    {
      id: "verification",
      title: "5. Identity verification (KYC)",
      body: [
        `Nigerian law and our partners require us to verify who our customers are. To use some features, such as larger transactions, withdrawals or thrift circles, we may ask for your National Identification Number (NIN), photos of an identity document, a selfie for facial matching and, optionally, proof of address such as a utility bill.`,
        "If the information you give is wrong, unreadable or does not match official records, verification can fail and some features will stay unavailable until it is corrected.",
      ],
    },
    {
      id: "wallet",
      title: "6. Wallet, funding and transfers",
      body: [
        {
          list: [
            "You can fund your wallet using the methods shown in the app, such as a dedicated account number, bank transfer or card. Funding may take a short time to be confirmed by the payment partner.",
            "Transfers to bank accounts, airtime and data purchases are processed through partners. Always check the account number, recipient name, phone number, network and amount before you confirm. Transactions you confirm cannot normally be cancelled.",
            "Fees, where any apply, are shown before you confirm a transaction.",
            "A transaction may show as pending while we wait for the partner to confirm the result. Please do not repeat it. If it stays pending, contact support with the transaction reference shown in the app.",
            "If a transaction fails or is reversed, the amount debited for it is returned to your wallet once the failure is confirmed with the partner.",
            "We may delay, hold or decline a transaction where we suspect fraud, an error, a breach of these Terms or a legal requirement.",
          ],
        },
        "Your wallet balance is a record of money held for you for use on the Service. It does not earn interest unless a feature clearly says so.",
      ],
    },
    {
      id: "savings",
      title: "7. Savings and thrift circles",
      body: [
        "Before you confirm a savings plan or join a thrift circle, read its amount, schedule, lock period, fees and payout rules, which are shown for that product. By confirming, you agree to them.",
        `In a group, members and group managers are responsible for their own contributions and decisions. ${B} provides the tools to record and manage the circle; we are not a party to arrangements between members, and we do not guarantee that any member will contribute or that a group will complete.`,
      ],
    },
    {
      id: "marketplace",
      title: "8. Marketplace, messages and user content",
      body: [
        "Group managers can post products with prices for their group members, and members can send messages in the app. Content you post must be lawful, accurate and yours to share.",
        `You must not post content that is illegal, fraudulent, misleading, abusive, harassing or that infringes anyone's rights. We may remove content and restrict accounts that break these rules. Purchases and arrangements between users are between those users; we do not guarantee goods or services listed by others.`,
        "You keep ownership of what you post. You give us a limited licence to store and display it to the people you choose in order to run the Service.",
      ],
    },
    {
      id: "acceptable-use",
      title: "9. Acceptable use",
      body: [
        "You must not:",
        {
          list: [
            "use the Service for fraud, money laundering, terrorist financing or any other unlawful purpose;",
            "pretend to be someone else or use someone else's identity documents;",
            "attempt to access accounts, systems or data you are not authorised to use;",
            "interfere with, overload, reverse engineer or probe the security of the Service;",
            "use bots, scrapers or automated means to use the Service without our written permission; or",
            "abuse promotions, referrals or refund processes.",
          ],
        },
      ],
    },
    {
      id: "availability",
      title: "10. Availability and changes to the Service",
      body: [
        "We work to keep the Service available, but it may be interrupted by maintenance, network problems or problems at our partners. Live balances and financial actions need an internet connection; the installable app can show a limited offline page but cannot process transactions offline.",
        "We may add, change or remove features. Where a change materially affects you, we will tell you in the app or by another suitable means.",
      ],
    },
    {
      id: "suspension",
      title: "11. Suspension and closing your account",
      body: [
        "You can ask us to close your account at any time, after any pending transactions and obligations are settled.",
        "We may suspend or close an account, or restrict features, if you break these Terms, if we suspect fraud or misuse, if verification cannot be completed, or if the law or a regulator or partner requires it. Where the law allows and it is safe to do so, we will tell you why and how any remaining balance can be returned to you.",
      ],
    },
    {
      id: "liability",
      title: "12. Our responsibility",
      body: [
        "Nothing in these Terms limits liability that cannot be limited under Nigerian law.",
        'Subject to that, the Service is provided on an "as is" and "as available" basis. We are not liable for losses caused by: events outside our reasonable control (including network, power, partner or bank outages); mistakes you make when entering details such as an account number or phone number; someone using your account because you did not keep your details safe; or indirect or consequential loss such as lost profit.',
        "Where we are liable to you, our liability is limited to the direct loss you suffer, and for a transaction it will not normally be more than the amount of that transaction plus any fee you paid for it.",
      ],
    },
    {
      id: "privacy",
      title: "13. Privacy",
      body: [
        "How we collect and use your personal data is explained in our Privacy Policy, which forms part of these Terms.",
      ],
    },
    {
      id: "changes",
      title: "14. Changes to these Terms",
      body: [
        "We may update these Terms from time to time. The date at the top shows when they last changed. If a change is significant we will tell you in the app before it takes effect. Continuing to use the Service after a change means you accept the updated Terms.",
      ],
    },
    {
      id: "law",
      title: "15. Governing law and disputes",
      body: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria. If you have a complaint, please contact us first through Help & Support so we can try to resolve it. If we cannot, either of us may take the matter to the competent courts of Nigeria.",
      ],
    },
    {
      id: "contact",
      title: "16. Contact us",
      body: [
        `Questions about these Terms can be sent to ${E} through the Help & Support section of the app or the contact details on our Help page.`,
      ],
    },
  ],
};

export const PRIVACY: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  summary: `How ${B} collects, uses, shares and protects your personal data, and the choices you have.`,
  sections: [
    {
      id: "who",
      title: "1. Who we are",
      body: [
        `${E} operates ${B} and is the controller of the personal data described here. This policy follows the Nigeria Data Protection Act 2023 (NDPA) and applies to our website, web app and installable app.`,
      ],
    },
    {
      id: "collect",
      title: "2. What we collect",
      body: [
        {
          list: [
            "Account details: your name, email address, phone number and password (stored securely, never in readable form).",
            "Identity verification details: your NIN, photos of an identity document (front and back), a selfie used for facial matching and, if you choose, proof of address.",
            "Transaction and wallet data: funding, transfers, airtime and data purchases, balances, references, recipients' account details and phone numbers you enter, and fees.",
            "Savings and group data: your savings goals, circles you create or join, contributions, and the products and messages you post in groups.",
            "Profile data: a profile photo and display details you choose to add.",
            "Device and usage data: browser and device type, IP address, pages and features used, and error reports, collected through standard means to keep the Service secure and working.",
            "Support messages: what you send us when you ask for help.",
          ],
        },
      ],
    },
    {
      id: "use",
      title: "3. How and why we use it",
      body: [
        {
          list: [
            "To create and run your account and provide the wallet, savings, thrift, marketplace and messaging features (to perform our agreement with you).",
            "To verify your identity and meet anti-fraud, anti-money-laundering and know-your-customer rules (to comply with the law).",
            "To process payments and confirm the result of transactions with our partners (to perform our agreement with you).",
            "To protect accounts, detect and prevent fraud, abuse and security incidents (our legitimate interest and legal duties).",
            "To fix problems, measure performance and improve the Service (our legitimate interest).",
            "To answer your questions and send service messages such as security alerts and transaction updates.",
            "Where you have chosen it, to send optional notifications. You can switch these off in Settings.",
          ],
        },
        "We do not sell your personal data.",
      ],
    },
    {
      id: "share",
      title: "4. Who we share it with",
      body: [
        "We share data only as needed to run the Service:",
        {
          list: [
            "Payment, banking and bill-payment partners, to fund your wallet, send transfers and buy airtime and data.",
            "Identity verification providers and official databases, to confirm your NIN and identity documents.",
            "Hosting, security and error-monitoring providers that process data for us under contract.",
            "Other members of a thrift circle you join, who can see the details needed to run the circle (for example your name and contributions).",
            "Regulators, law enforcement and courts, where the law requires or allows it.",
            "A buyer or successor, if the business is reorganised or sold, with the same protections for your data.",
          ],
        },
        "Partners may process data outside Nigeria. Where they do, we take steps to make sure your data stays protected as the law requires.",
      ],
    },
    {
      id: "keep",
      title: "5. How long we keep it",
      body: [
        "We keep your data while your account is open and afterwards for as long as needed for the purposes above. Financial and identity-verification records are kept for the periods Nigerian law and our partners require, even after an account is closed. When data is no longer needed, we delete or anonymise it.",
      ],
    },
    {
      id: "security",
      title: "6. How we protect it",
      body: [
        "We use encrypted connections, access controls, automatic sign-out after inactivity and monitoring to protect your data. No system is completely secure, so please also protect your password and verification codes, and tell us at once if you suspect misuse.",
        "If a breach affects your personal data in a way the law requires us to report, we will notify the Nigeria Data Protection Commission and, where required, you.",
      ],
    },
    {
      id: "rights",
      title: "7. Your rights",
      body: [
        "Under the NDPA you can, in the circumstances the law sets out:",
        {
          list: [
            "ask for a copy of the personal data we hold about you;",
            "ask us to correct data that is wrong or incomplete;",
            "ask us to delete data we no longer need (we may have to keep some records by law);",
            "object to, or ask us to restrict, certain uses of your data;",
            "ask for your data in a portable format; and",
            "withdraw consent where we rely on it. This does not affect what we did before.",
          ],
        },
        "To use these rights, contact us through Help & Support. We may need to confirm who you are first. You also have the right to complain to the Nigeria Data Protection Commission (NDPC).",
      ],
    },
    {
      id: "children",
      title: "8. Children",
      body: [
        `${B} is for people aged 18 and over. We do not knowingly collect data from anyone under 18. If you believe a child has given us data, contact us and we will delete it.`,
      ],
    },
    {
      id: "changes",
      title: "9. Changes to this policy",
      body: [
        "We may update this policy. The date at the top shows the latest version, and we will tell you in the app about significant changes.",
      ],
    },
    {
      id: "contact",
      title: "10. Contact us",
      body: [
        `For privacy questions or to use your rights, contact ${E} through the Help & Support section of the app or the contact details on our Help page.`,
      ],
    },
  ],
};

export const COOKIES: LegalDocument = {
  slug: "cookies",
  title: "Cookie Policy",
  summary: `The small pieces of data ${B} stores on your device, and why.`,
  sections: [
    {
      id: "what",
      title: "1. What this covers",
      body: [
        `Like most websites and apps, ${B} stores small amounts of data on your device using cookies and similar browser storage. This policy explains what we store and why.`,
      ],
    },
    {
      id: "use",
      title: "2. What we store",
      body: [
        {
          list: [
            "Sign-in session: a secure token kept in your browser session so you stay signed in while you use the app. It is cleared when you sign out or close the tab, and you are signed out automatically after a period of inactivity.",
            "Returning-user cookie: a small cookie that remembers this browser has been used to sign in before, so you are taken to the sign-in screen instead of the marketing website.",
            "Preferences: choices such as light or dark theme, notification settings, your profile photo shown on this device, and whether you dismissed an install or update notice.",
            "Navigation state: which main screen and view (website or app) you were on, so a page refresh keeps you where you were.",
            "Offline and speed: the installable app keeps a copy of its static files and an offline page on your device so it loads faster. It does not store your financial data for offline use.",
            "Error reports: where enabled, technical information about crashes so we can fix them.",
          ],
        },
        "These items are needed to run the Service securely and remember your choices. We do not use advertising cookies.",
      ],
    },
    {
      id: "control",
      title: "3. Your choices",
      body: [
        "You can clear cookies and site data in your browser settings at any time, or block them, but parts of the Service such as staying signed in may stop working. Removing the installed app also removes its stored files.",
      ],
    },
    {
      id: "contact",
      title: "4. Questions",
      body: [
        "If you have questions about this policy, contact us through Help & Support. Our Privacy Policy explains how we handle personal data more generally.",
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS: Record<LegalSlug, LegalDocument> = {
  terms: TERMS,
  privacy: PRIVACY,
  cookies: COOKIES,
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        q: "How do I create an account?",
        a: "Choose Sign Up, enter your details and complete the steps. You must be 18 or older. Then verify your identity to unlock all features.",
      },
      {
        q: "Why do I need to verify my identity?",
        a: "Nigerian rules and our payment partners require us to know our customers. Verification asks for your NIN, photos of an identity document (front and back), a selfie and, optionally, proof of address. Take clear, well-lit photos with all text visible.",
      },
      {
        q: 'Verification says "Wrong NIN". What should I do?',
        a: "Check that you typed all 11 digits correctly and that the NIN belongs to you. The details must match the name on your account. Then try again with sharp, well-lit photos. If it still fails, contact support.",
      },
      {
        q: "I forgot my password.",
        a: "On the sign-in screen choose Forgot password and follow the steps. We will never ask you for your password or any code.",
      },
    ],
  },
  {
    id: "wallet",
    title: "Wallet and transfers",
    items: [
      {
        q: "How do I fund my wallet?",
        a: "Open Wallet and choose Fund. You can pay to your dedicated account number or use another method shown for your account. Funding can take a short time to be confirmed.",
      },
      {
        q: "My wallet funding has not shown yet.",
        a: "Wait a few minutes and refresh, because confirmation comes from the payment partner. If it is still missing, contact support with the amount, the time and the reference or bank receipt.",
      },
      {
        q: "My transfer is pending. What should I do?",
        a: "Do not repeat it. Open the transaction from your history and use Copy reference for support. Pending transfers are confirmed with the bank or payment partner. If it stays pending for a long time, send support the reference. If a transfer fails, the amount is returned to your wallet once the failure is confirmed.",
      },
      {
        q: "I sent money to the wrong account.",
        a: "Contact support immediately with the transaction reference. We will contact the bank or partner, but we cannot guarantee recovery, so always check the account number and name before you confirm.",
      },
      {
        q: "Are there fees?",
        a: "Where a fee applies, it is shown before you confirm and on the receipt.",
      },
      {
        q: "Where can I see my transaction details?",
        a: "Tap any transaction in your Wallet or Transactions screen to see its receipt, status, reference and balance before and after.",
      },
    ],
  },
  {
    id: "bills",
    title: "Airtime and data",
    items: [
      {
        q: "How do I buy airtime or data?",
        a: "Open Wallet, choose Airtime & Data, enter the phone number, pick the network and amount, then review the confirmation before you buy.",
      },
      {
        q: "I bought airtime but did not receive it.",
        a: "Check the status on the receipt. If it says pending, wait a few minutes and do not buy again. If it says failed, the amount is returned to your wallet. If the status is successful but airtime is missing, contact support with the phone number, network, amount and reference.",
      },
      {
        q: "I entered the wrong phone number.",
        a: "Airtime sent to the wrong number cannot normally be reversed. Always double-check the number and network on the confirmation screen.",
      },
    ],
  },
  {
    id: "savings",
    title: "Savings and Ajo / Esusu",
    items: [
      {
        q: "How do savings goals work?",
        a: "Create a goal, choose an amount and schedule, and follow your progress from the Savings screen. Read the lock period and any fees before you confirm.",
      },
      {
        q: "How does an Ajo / Esusu circle work?",
        a: "Members contribute on the schedule set for the circle and take payouts in the agreed order. Review the circle details and payout order before you join. Members and managers are responsible for their own contributions.",
      },
      {
        q: "Can I post products in the marketplace?",
        a: "Group managers can post products with prices for their group members. Members can view and buy what their group lists.",
      },
    ],
  },
  {
    id: "security",
    title: "Account and security",
    items: [
      {
        q: "Why was I signed out?",
        a: "For your protection, the app signs you out after a period of inactivity. Sign in again to continue.",
      },
      {
        q: "How do I keep my account safe?",
        a: `Use a strong, unique password, keep your verification codes private, and never share them. ${B} will never ask for your password or one-time codes. Report anything suspicious right away.`,
      },
      {
        q: "How do I install the app on my phone?",
        a: "On Android, open pavepadi.com in Chrome and choose Install app from the menu. On iPhone, open it in Safari, tap Share, then Add to Home Screen. You need an internet connection to use wallet features.",
      },
      {
        q: "The app says it can't reach PAVEPADI.",
        a: "Check your data or Wi-Fi and tap Retry connection. A phone can show signal bars without working internet, so try opening another website too.",
      },
    ],
  },
];

export const CONTACT_TIPS: string[] = [
  "The transaction reference (use Copy reference for support on the receipt).",
  "The amount, date and time, and the phone number or account number involved.",
  "A screenshot of what you see. Never include your password or any codes.",
];

export interface ContactChannel {
  id: "email" | "phone" | "whatsapp";
  label: string;
  value: string;
  href: string;
}

/** Channels that have a value in LEGAL.contact, in display order. */
export function getContactChannels(
  contact: Record<string, string> = LEGAL.contact,
): ContactChannel[] {
  const channels: ContactChannel[] = [];
  const email = contact.email?.trim();
  const phone = contact.phone?.trim();
  const whatsapp = contact.whatsapp?.trim();
  if (email) {
    channels.push({
      id: "email",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    });
  }
  if (whatsapp) {
    const digits = whatsapp.replace(/\D/g, "").replace(/^0/, "234");
    channels.push({
      id: "whatsapp",
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${digits}`,
    });
  }
  if (phone) {
    channels.push({
      id: "phone",
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    });
  }
  return channels;
}
