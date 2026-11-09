export const dynamic = "force-dynamic";

import Link from "next/link";
import { getProduct } from "@/lib/data";
import { createOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ShieldCheck, Truck, Play, MessageCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export async function placeOrder(formData: FormData) {
  "use server";
  await createOrder(formData);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <Button asChild>
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const images = [product.image_url, ...(product.video_url ? [] : [])].filter(Boolean);
  const price = product.price || "0";
  const coinPrice = product.coin_price || "0";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/store" className="text-sm text-indigo-600 inline-flex items-center mb-6">
        <ShoppingCart className="w-4 h-4 mr-1" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
            <img
              src={product.image_url || "https://placehold.co/600x600?text=Product"}
              alt={product.title}
              className="w-full h-[400px] object-cover"
            />
            {product.video_url && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-colors">
                  <Play className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                {Array.isArray(product.product_categories)
                  ? product.product_categories[0]?.name
                  : product.product_categories?.name ||
                    "Digital Products"}
              </span>
              <h1 className="text-3xl font-bold text-foreground mt-1 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews_count} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-foreground">{price}</span>
              <span className="text-sm text-muted-foreground">({coinPrice} coins)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {product.description || "No description available."}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Stock: {product.stock === 0 ? "Out of stock" : product.stock + " available"}
            </p>

            <form action={placeOrder} className="space-y-4">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="price" value={price} />
              <input type="hidden" name="qty" value="1" />
              <Button
                type="submit"
                disabled={product.stock === 0}
                className="w-full py-4 bg-gradient-premium text-white font-semibold hover:opacity-90 transition-colors shadow-lg shadow-indigo-500/30"
              >
                Buy Now — {price}
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-white">
              <span className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white">24/7</span>
              <span className="text-muted-foreground">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
