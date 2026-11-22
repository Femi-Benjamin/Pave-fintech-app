import React, { useEffect } from "react";
import { LEGAL, LEGAL_DOCUMENTS } from "../content/legal";
import { HelpCenterView, LegalDocumentView } from "../components/LegalViews";
import type { PublicInfoRoute } from "../lib/publicRoutes";

const LINKS: Array<{ route: PublicInfoRoute; label: string }> = [
  { route: "terms", label: "Terms of Service" },
  { route: "privacy", label: "Privacy Policy" },
  { route: "cookies", label: "Cookie Policy" },
  { route: "help", label: "Help & Support" },
];

const TITLES: Record<PublicInfoRoute, string> = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
  help: "Help & Support",
};

/** Public, signed-out pages for the legal documents and the Help Centre. */
export default function PublicInfoPage({ route }: { route: PublicInfoRoute }) {
  useEffect(() => {
    document.title = `${TITLES[route]} | ${LEGAL.brand}`;
    // Jump to a #section once the content is on screen.
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#0D0F1C]">
      <header className="border-b border-[#E8EAF4] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 font-extrabold">
            <img src="/icons/pave-192.png" alt="" className="h-8 w-8" />
            {LEGAL.brand}
          </a>
          <a href="/" className="text-sm font-semibold text-[#3730A3]">
            Open app
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl border border-[#E8EAF4] bg-white p-5 shadow-sm sm:p-8">
          {route === "help" ? (
            <>
              <h1 className="text-xl font-extrabold">Help & Support</h1>
              <p className="mt-1 mb-6 text-sm text-[#4B5563]">
                Answers to common questions about using {LEGAL.brand}.
              </p>
              <HelpCenterView />
            </>
          ) : (
            <LegalDocumentView doc={LEGAL_DOCUMENTS[route]} />
          )}
        </div>
        <nav
          aria-label="Legal and help"
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[#3730A3]"
        >
          {LINKS.filter((link) => link.route !== route).map((link) => (
            <a key={link.route} href={`/${link.route}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="mt-4 text-center text-xs text-[#6B7280]">
          © {new Date().getFullYear()} {LEGAL.entity} ({LEGAL.brand}). All
          rights reserved.
        </p>
      </main>
    </div>
  );
}
