"use client";

import { Star, CheckCircle2, ShieldCheck } from "lucide-react";

const REVIEWS = [
  {
    name: "Rahim Ahmed",
    location: "Dhaka, BD",
    rating: 5,
    text: "Best dollar exchange rates I've found. Instant wallet credit and great support.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1272a8e396?w=100&q=80",
  },
  {
    name: "Priya Sharma",
    location: "Delhi, IN",
    rating: 5,
    text: "PUBG UC top-up was delivered in seconds. Really impressed with the service.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    name: "Ayesha Khan",
    location: "Karachi, PK",
    rating: 4,
    text: "Easy to use platform. Gift cards work perfectly every time.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Customer Reviews</h2>
          <p className="text-muted-foreground">Trusted by thousands across BD, IN &amp; PK</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.location}</div>
                </div>
              </div>
              <div className="flex text-amber-500 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4" fill={star <= r.rating ? "currentColor" : "none"} stroke={star <= r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">“{r.text}”</p>
              <div className="mt-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
