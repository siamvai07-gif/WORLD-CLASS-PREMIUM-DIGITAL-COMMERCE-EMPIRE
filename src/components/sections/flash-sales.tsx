"use client";

import { useEffect, useState } from "react";
import { Tag, Clock, Zap } from "lucide-react";

export function FlashSalesSection() {
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 32, s: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t.s > 0) return { ...t, s: t.s - 1 };
        if (t.m > 0) return { h: t.h, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return t;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = [
    { id: "1", title: "Free Fire Diamonds 500", price: "৳60", old: "৳70", image: "https://images.unsplash.com/photo-1627843488610-70113880438b?w=300&q=80" },
    { id: "2", title: "PUBG UC 3000", price: "৳420", old: "৳480", image: "https://images.unsplash.com/photo-1542751371-adc38448a05f?w=300&q=80" },
    { id: "3", title: "$20 USD Buy", price: "৳2,150", old: "৳2,300", image: "https://images.unsplash.com/photo-1605172800719-7b6a1e60d499?w=300&q=80" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Flash Sale</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Limited time offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold">
            <Clock className="w-3 h-3 mr-1" />
            {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s left
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((d) => (
            <div key={d.id} className="group relative rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-video relative">
                <img src={d.image} alt={d.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-2 left-2 inline-flex h-6 items-center rounded-full bg-red-500 px-2 text-xs font-bold text-white uppercase">Flash</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"></div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{d.title}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-foreground">{d.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{d.old}</span>
                </div>
                <button className="w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
