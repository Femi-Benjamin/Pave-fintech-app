import React, { useState } from "react";
import { ChevronRight, Mail, MessageCircle, Phone } from "lucide-react";
import {
  CONTACT_TIPS,
  FAQ_GROUPS,
  LEGAL,
  getContactChannels,
} from "../content/legal";
import type { Block, LegalDocument } from "../content/legal";

function renderBlock(block: Block, index: number) {
  if (typeof block === "string") {
    return (
      <p key={index} className="text-sm leading-relaxed text-[#4B5563]">
        {block}
      </p>
    );
  }
  return (
    <ul
      key={index}
      className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#4B5563]"
    >
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  return (
    <article>
      <h2 className="text-xl font-extrabold text-[#0D0F1C]">{doc.title}</h2>
      <p className="mt-1 text-xs font-semibold text-[#6B7280]">
        {LEGAL.entity} · Effective {LEGAL.effectiveDate}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
        {doc.summary}
      </p>
      <nav
        aria-label={`${doc.title} sections`}
        className="mt-4 rounded-2xl border border-[#E8EAF4] bg-[#F7F8FF] p-4"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Contents
        </p>
        <ul className="mt-2 space-y-1">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${doc.slug}-${section.id}`}
                className="text-sm font-medium text-[#3730A3] hover:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 space-y-6">
        {doc.sections.map((section) => (
          <section
            key={section.id}
            id={`${doc.slug}-${section.id}`}
            className="scroll-mt-20 space-y-3"
          >
            <h3 className="text-base font-bold text-[#0D0F1C]">
              {section.title}
            </h3>
            {section.body.map(renderBlock)}
          </section>
        ))}
      </div>
    </article>
  );
}

export function ContactCard() {
  const channels = getContactChannels();
  const icons = { email: Mail, whatsapp: MessageCircle, phone: Phone };
  return (
    <section
      id="contact"
      className="scroll-mt-20 rounded-2xl border border-[#E8EAF4] bg-white p-4"
    >
      <h3 className="text-sm font-bold text-[#0D0F1C]">Contact support</h3>
      {channels.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {channels.map((channel) => {
            const Icon = icons[channel.id];
            return (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  className="flex items-center gap-3 rounded-xl bg-[#F7F8FF] px-3 py-3 text-sm font-semibold text-[#3730A3]"
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 break-words">
                    {channel.label}: {channel.value}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
          Our support contact details will be shown here shortly. Until then,
          keep the details below ready so we can help you quickly.
        </p>
      )}
      {LEGAL.contact.hours && (
        <p className="mt-3 text-xs text-[#6B7280]">
          Support hours: {LEGAL.contact.hours}
        </p>
      )}
      <p className="mt-3 text-sm font-semibold text-[#0D0F1C]">
        Please include:
      </p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#4B5563]">
        {CONTACT_TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        {LEGAL.brand} will never ask for your password or one-time codes. Do not
        share them with anyone, including people claiming to be from{" "}
        {LEGAL.brand}.
      </p>
    </section>
  );
}

export function HelpCenterView() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      {FAQ_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`faq-${group.id}`}>
          <h3
            id={`faq-${group.id}`}
            className="mb-3 text-sm font-bold text-[#0D0F1C]"
          >
            {group.title}
          </h3>
          <div className="overflow-hidden rounded-2xl border border-[#E8EAF4] bg-white">
            {group.items.map((item) => {
              const key = `${group.id}:${item.q}`;
              const isOpen = open === key;
              return (
                <div
                  key={key}
                  className="border-b border-[#E2E6F3] last:border-0"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-[#0D0F1C]"
                  >
                    {item.q}
                    <ChevronRight
                      size={16}
                      className={`shrink-0 text-[#6B7280] transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-sm leading-relaxed text-[#4B5563]">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <ContactCard />
    </div>
  );
}
