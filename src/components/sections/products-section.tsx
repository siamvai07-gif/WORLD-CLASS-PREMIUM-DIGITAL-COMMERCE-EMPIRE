"use client";

import Link from "next/link";
import { Play, Star, Tag, ShieldCheck, ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  price: string;
  coinPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  discount?: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Free Fire Diamonds 1000",
    price: "৳120",
    coinPrice: "1200",
    image: "https://images.unsplash.com/photo-1627843488610-70113880438b?w=400&q=80",
    category: "Free Fire",
    rating: 4.9,
    reviews: 128,
    isBestSeller: true,
    discount: 10,
  },
  {
    id: "p2",
    title: "PUBG UC 6000",
    price: "৳850",
    coinPrice: "8500",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05f?w=400&q=80",
    category: "PUBG",
    rating: 4.8,
    reviews: 94,
    isFeatured: true,
  },
  {
    id: "p3",
    title: "$50 USD Buy",
    price: "৳5,400",
    coinPrice: "54000",
    image: "https://images.unsplash.com/photo-1605172800719-7b6a1e60d499?w=400&q=80",
    category: "Dollar Exchange",
    rating: 5.0,
    reviews: 210,
    isFeatured: true,
  },
  {
    id: "p4",
    title: "Google Play Gift Card $25",
    price: "৳2,700",
    coinPrice: "27000",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80",
    category: "Gift Cards",
    rating: 4.7,
    reviews: 67,
  },
  {
    id: "p5",
    title: "Netflix Premium 1 Month",
    price: "৳450",
    coinPrice: "4500",
    image: "https://images.unsplash.com/photo-1604906069927-74e7475f428a?w=400&q=80",
    category: "Subscriptions",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "p6",
    title: "Digital Commerce Course",
    price: "৳1,200",
    coinPrice: "12000",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    category: "Courses",
    rating: 4.6,
    reviews: 43,
  },
];

export function ProductsSection({ title = "Trending Products", products }: { title?: string; products?: Product[] }) {
  const items = (products && products.length > 0 ? products : PRODUCTS) as Product[];
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
            <p className="text-muted-foreground">Handpicked for you</p>
          </div>
          <Link href="/store" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Browse all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((p) => (
            <Link key={p.id} href={`/store/product/${p.id}`} className="group block">
              <div className="relative aspect-[0.82] rounded-2xl overflow-hidden border border-border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                {p.isBestSeller && (
                  <span className="absolute top-2 left-2 flex h-6 items-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                    Best Seller
                  </span>
                )}
                {p.isFeatured && (
                  <span className="absolute top-2 right-2 flex h-6 items-center rounded-full bg-indigo-500 px-2 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
                {p.discount && (
                  <span className="absolute top-2 left-10 flex h-6 items-center rounded-full bg-amber-500 px-2 text-xs font-bold text-white">
                    -{p.discount}%
                  </span>
                )}
                <div className="relative h-full">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-lg hover:bg-indigo-600 hover:text-white transition-colors">
                      <Play className="w-4 h-4" /> Quick View
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{p.category}</span>
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                      {p.rating} <Star className="w-3 h-3 fill-current ml-0.5" />
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-tight mb-2">{p.title}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-foreground">{p.price}</span>
                    {p.coinPrice && (
                      <span className="text-xs text-muted-foreground">({p.coinPrice} coins)</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="flex-1">
                      Add to Cart
                    </Button>
                    <Button size="sm" variant="premiumGhost" className="ml-2 w-10" aria-label="Wishlist">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GamingTopupSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Gaming Top-Up</h2>
            <p className="text-muted-foreground mb-6">Instant diamonds, UC, and credits for your favorite games.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white/50">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Free Fire Diamonds</div>
                  <div className="text-xs text-muted-foreground">Instant delivery to your ID</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">PUBG UC</div>
                  <div className="text-xs text-muted-foreground">Best rates in BD</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl border border-border">
            <img src="https://images.unsplash.com/photo-1627843488610-70113880438b?w=600&q=80" alt="Gaming" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white font-bold text-xl">Top up now</h3>
                <p className="text-indigo-100 text-sm">Instant delivery • Secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
