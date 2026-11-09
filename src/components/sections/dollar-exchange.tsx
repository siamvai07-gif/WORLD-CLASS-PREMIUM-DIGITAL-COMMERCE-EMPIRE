"use client";

import { DollarSign, RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react";

export function DollarExchangeSection() {
  const rates = [
    { pair: "USD → BDT", buy: "114.50", sell: "117.20", change: "+0.15" },
    { pair: "USD → INR", buy: "83.40", sell: "84.10", change: "-0.05" },
    { pair: "USD → PKR", buy: "278.50", sell: "281.30", change: "+0.40" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Dollar Buy/Sell</h2>
          <p className="text-indigo-200">Competitive rates with instant wallet credit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {rates.map((r) => (
            <div key={r.pair} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-indigo-100">{r.pair}</span>
                <span className="text-[10px] font-bold text-white bg-green-500/20 px-2 py-0.5 rounded green-change">{Number(r.change) > 0 ? "▲" : "▼"} {Math.abs(Number(r.change))}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs text-indigo-300 uppercase tracking-wider">Buy</span>
                <span className="text-3xl font-bold">{r.buy}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-indigo-300 uppercase tracking-wider">Sell</span>
                <span className="text-3xl font-bold">{r.sell}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Buy Dollars</h3>
                <p className="text-sm text-indigo-200">Pay with bKash, Nagad or bank transfer. Dollars credited to your wallet instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Sell Dollars</h3>
                <p className="text-sm text-indigo-200">Exchange your wallet balance to BDT/INR/PKR and withdraw to your mobile wallet.</p>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img src="https://images.unsplash.com/photo-1605172800719-7b6a1e60d499?w=500&q=80" alt="Dollar exchange" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white font-bold text-xl">Best exchange rates</h3>
                <p className="text-indigo-100 text-sm">Live rates updated every 5 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm text-indigo-200">No hidden fees. What you see is what you get.</span>
        </div>
      </div>
    </section>
  );
}
