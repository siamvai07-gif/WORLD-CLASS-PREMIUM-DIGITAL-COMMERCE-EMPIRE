"use server";

import { createClientServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) return {};
  const settings: Record<string, string> = {};
  for (const row of data || []) {
    settings[row.key] = String(row.value);
  }
  return settings;
}

export async function getPromoVideos() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("promo_videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getCategories() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getProducts({
  limit = 24,
  featured = false,
  category,
  search,
}: {
  limit?: number;
  featured?: boolean;
  category?: string;
  search?: string;
} = {}) {
  const supabase = await createClientServer();
  let q = supabase
    .from("products")
    .select(
      "*, product_categories(name, slug)",
    )
    .eq("is_active", true);
  if (featured) q = q.eq("is_featured", true);
  if (category) q = q.eq("product_categories.slug", category);
  if (search) q = q.ilike("title", `%${search}%`);
  const { data, error } = await q
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function getProduct(id: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(name, slug)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getCoinPackages() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("coin_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getPaymentMethods() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getWallet(userId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return { user_id: userId, balance: "0" };
  return data || { user_id: userId, balance: "0" };
}

export async function getWalletTransactions(userId: string, limit = 20) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function getPaymentRequests(userId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return data || [];
}

export async function getOrders(userId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return data || [];
}

export async function getNotifications(userId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) return [];
  return data || [];
}

export async function markNotificationRead(id: string) {
  const supabase = await createClientServer();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/dashboard");
}

export async function getCommunities() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getCommunityPosts(communityId?: string, limit = 30) {
  const supabase = await createClientServer();
  let q = supabase
    .from("community_posts")
    .select("*, profiles(full_name, username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (communityId) q = q.eq("community_id", communityId);
  const { data, error } = await q;
  if (error) return [];
  return data || [];
}

export async function getPostReactions(postId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("post_reactions")
    .select("*")
    .eq("post_id", postId);
  if (error) return [];
  return data || [];
}

export async function getPostComments(postId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("post_comments")
    .select("*, profiles(full_name, username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getAdminStats() {
  const supabase = await createClientServer();
  const [users, orders, products, payments] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("orders").select("id", { count: "exact" }),
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("payment_requests").select("id", { count: "exact" }),
  ]);
  return {
    users: users.count ?? 0,
    orders: orders.count ?? 0,
    products: products.count ?? 0,
    pendingPayments: payments.count ?? 0,
  };
}
