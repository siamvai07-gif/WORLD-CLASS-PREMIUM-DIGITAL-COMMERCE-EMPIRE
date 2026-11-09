"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Gamepad2,
  Gift,
  GraduationCap,
  Smartphone,
  Film,
  BookOpen,
  CreditCard,
  Settings,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ElementType;
  color: string;
  count?: number;
}

const CATEGORIES: Category[] = [
  { id: "1", name: "Dollar Buy/Sell", slug: "dollar", icon: DollarSign, color: "bg-green-500/10 text-green-500", count: 12 },
  { id: "2", name: "Free Fire Diamonds", slug: "free-fire", icon: Gamepad2, color: "bg-red-500/10 text-red-500", count: 8 },
  { id: "3", name: "PUBG UC", slug: "pubg", icon: Gamepad2, color: "bg-blue-500/10 text-blue-500", count: 7 },
  { id: "4", name: "Gift Cards", slug: "gift-cards", icon: Gift, color: "bg-purple-500/10 text-purple-500", count: 15 },
  { id: "5", name: "Premium Accounts", slug: "premium-accounts", icon: Smartphone, color: "bg-indigo-500/10 text-indigo-500", count: 6 },
  { id: "6", name: "Software & Tools", slug: "software", icon: Settings, color: "bg-teal-500/10 text-teal-500", count: 9 },
  { id: "7", name: "Premium Subscriptions", slug: "subscriptions", icon: CreditCard, color: "bg-pink-500/10 text-pink-500", count: 5 },
  { id: "8", name: "Online Courses", slug: "courses", icon: GraduationCap, color: "bg-orange-500/10 text-orange-500", count: 11 },
  { id: "9", name: "YouTube Learning", slug: "youtube", icon: Film, color: "bg-red-500/10 text-red-500", count: 7 },
  { id: "10", name: "E-books", slug: "ebooks", icon: BookOpen, color: "bg-amber-500/10 text-amber-500", count: 13 },
  { id: "11", name: "Digital Files", slug: "digital-files", icon: Film, color: "bg-violet-500/10 text-violet-500", count: 6 },
  { id: "12", name: "Other Digital Products", slug: "other", icon: Settings, color: "bg-slate-500/10 text-slate-500", count: 10 },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">Explore all digital products and services</p>
          </div>
          <Link href="/store" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/store?category=${cat.slug}`}
              className="group relative block aspect-square rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 group-hover:from-white/80 group-hover:to-white/40 transition-all" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors group-hover:scale-110", cat.color)}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-indigo-600 transition-colors leading-tight">
                  {cat.name}
                </span>
                {cat.count && (
                  <span className="text-xs text-muted-foreground mt-0.5">{cat.count} items</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
