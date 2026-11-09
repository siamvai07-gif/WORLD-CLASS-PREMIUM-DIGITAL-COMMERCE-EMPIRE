"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Truck,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-950 text-white pt-20 pb-32">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 text-xs font-semibold mb-6 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            New arrivals added weekly
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-balance">
            Digital goods,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              delivered instantly.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium marketplace for gaming top-ups, dollar exchange, gift cards,
            courses, and digital products. Secure coin wallet, instant delivery,
            and 24/7 support for Bangladesh, India &amp; Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/store" className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Explore Store
              </Link>
            </Button>
            <Button variant="premiumGhost" asChild size="lg" className="w-full sm:w-auto">
              <Link href="/wallet" className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" /> Top Up Wallet
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-wrap justify-center gap-8 md:gap-12 text-sm">
          {[
            { icon: ShieldCheck, label: "Secure Payments" },
            { icon: Truck, label: "Instant Delivery" },
            { icon: Zap, label: "24/7 Support" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-2 text-slate-400">
              <item.icon className="w-5 h-5 text-indigo-400" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
