"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Truck, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I top up my coin wallet?",
    a: "Select a coin package, choose bKash/Nagad, complete the payment, and submit your transaction reference. Our team approves it and credits your wallet.",
  },
  {
    q: "Is dollar exchange safe?",
    a: "Yes. All exchanges are processed through verified channels with live rates and wallet confirmation.",
  },
  {
    q: "How long does delivery take?",
    a: "Most digital products are delivered instantly after payment confirmation. Gaming top-ups are usually instant.",
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are reviewed case by case. Contact support with your order ID and we'll assist you.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-xl border border-border bg-white dark:bg-slate-900 overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    {faq.q}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground border-t border-border/50">{faq.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
