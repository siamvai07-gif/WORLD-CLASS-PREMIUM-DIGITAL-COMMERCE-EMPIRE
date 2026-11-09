export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase";
import Link from "next/link";
import { Search, Filter, Star, Play, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts, getCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

export default async function StorePage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [products, categories] = await Promise.all([getProducts({ limit: 24 }), getCategories()]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Store</h1>
          <p className="text-muted-foreground">Browse premium digital products</p>
        </div>
        <div className="flex w-full lg:w-auto gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 px-1">
        <Button variant="outline" asChild className="whitespace-nowrap px-4">
          <Link href="/store">All Categories</Link>
        </Button>
        {categories.map((c) => (
          <Button key={c.id} variant="outline" asChild className="whitespace-nowrap px-4">
            <Link href={`/store?category=${c.slug}`}>{c.name}</Link>
          </Button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted/50 p-12 text-center">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
            const cat = Array.isArray(p.product_categories) ? p.product_categories[0] : p.product_categories;
            return (
              <Link key={p.id} href={`/store/product/${p.id}`} className="group block">
                <div className="relative aspect-[0.82] rounded-2xl overflow-hidden border border-border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  {p.is_featured && (
                    <span className="absolute top-2 right-2 flex h-6 items-center rounded-full bg-indigo-500 px-2 text-xs font-bold text-white">Featured</span>
                  )}
                  <div className="relative h-full">
                    <img
                      src={p.image_url || "https://placehold.co/400x400?text=Product"}
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
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {cat?.name || "Digital Products"}
                      </span>
                      <span className="text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                        {p.rating} <Star className="w-3 h-3 fill-current ml-0.5" />
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight mb-2">{p.title}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-foreground">{p.price}</span>
                      {p.coin_price && (
                        <span className="text-xs text-muted-foreground">({p.coin_price} coins)</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
