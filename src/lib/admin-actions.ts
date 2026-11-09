"use server";

import { createClientServer } from "@/lib/supabase";
import { createClientService } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const ADMIN_SESSION_COOKIE = "siamvip_admin_session";

export async function verifyAdminKey(formData: FormData) {
  const key = String(formData.get("adminKey") || "").trim();
  if (key !== process.env.ADMIN_BOOTSTRAP_KEY) {
    return { error: "Invalid admin access key." };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  redirect("/admin/login");
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  return !!cookieStore.get(ADMIN_SESSION_COOKIE);
}

export async function getAdminStats() {
  const supabase = await createClientService();
  const [users, orders, products, payments, wallet] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("orders").select("id", { count: "exact" }),
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("payment_requests").select("id, status, amount"),
    supabase.from("wallets").select("balance"),
  ]);
  const pendingPayments = (payments.data || []).filter(
    (p: any) => p.status === "pending"
  ).length;
  const totalRevenue = Number(
    (orders.data || []).reduce((acc: number, o: any) => acc + Number(o.total || 0), 0)
  );
  const totalCoins = Number(
    (wallet.data || []).reduce((acc: number, w: any) => acc + Number(w.balance || 0), 0)
  );
  return {
    totalUsers: users.count ?? 0,
    totalOrders: orders.count ?? 0,
    totalProducts: products.count ?? 0,
    totalRevenue,
    pendingPayments,
    totalCoins,
  };
}

export async function getAllPaymentRequests() {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*, profiles(full_name, username)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getAllProducts() {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getAllCategories() {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getAllPromoVideos() {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("promo_videos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getAllSettings() {
  const supabase = await createClientService();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) return [];
  return data || [];
}

export async function getAdminActions(limit = 50) {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("admin_actions")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

export async function logAdminAction(adminId: string | null, action: string, target: string | null, meta: any) {
  const supabase = await createClientService();
  await supabase.from("admin_actions").insert({
    admin_id: adminId,
    action,
    target,
    meta,
  });
}

export async function upsertPromoVideo(formData: FormData) {
  const supabase = await createClientService();
  const id = formData.get("id") as string;
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const thumbnail_url = String(formData.get("thumbnailUrl") || "").trim();
  const video_url = String(formData.get("videoUrl") || "").trim();
  const duration = String(formData.get("duration") || "").trim();
  const sort_order = Number(formData.get("sortOrder") || 0);
  const is_active = formData.get("is_active") === "on";

  if (!title || !video_url) return { error: "Title and video URL are required." };

  if (id) {
    await supabase.from("promo_videos").update({ title, description, thumbnail_url, video_url, duration, sort_order, is_active }).eq("id", id);
  } else {
    await supabase.from("promo_videos").insert({ title, description, thumbnail_url, video_url, duration, sort_order, is_active });
  }
  return { success: true };
}

export async function upsertSetting(formData: FormData) {
  const supabase = await createClientService();
  const key = String(formData.get("key") || "").trim();
  const value = String(formData.get("value") || "");

  if (!key) return { error: "Setting key is required." };

  await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  return { success: true };
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClientService();
  const id = formData.get("id") as string;
  const title = String(formData.get("title") || "").trim();
  const price = Number(formData.get("price") || 0);
  const category_id = String(formData.get("category_id") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title) return { error: "Title is required." };

  if (id) {
    await supabase.from("products").update({ title, price, category_id, description }).eq("id", id);
  } else {
    await supabase.from("products").insert({ title, price, category_id, description });
  }
  return { success: true };
}

export async function upsertCategory(formData: FormData) {
  const supabase = await createClientService();
  const id = formData.get("id") as string;
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!name || !slug) return { error: "Name and slug are required." };

  if (id) {
    await supabase.from("product_categories").update({ name, slug }).eq("id", id);
  } else {
    await supabase.from("product_categories").insert({ name, slug });
  }
  return { success: true };
}

export async function approvePayment(formData: FormData) {
  const supabase = await createClientService();
  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "Payment request id is required." };
  await supabase.from("payment_requests").update({ status: "approved", updated_at: new Date().toISOString() }).eq("id", id);
  return { success: true };
}

export async function rejectPayment(formData: FormData) {
  const supabase = await createClientService();
  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "Payment request id is required." };
  await supabase.from("payment_requests").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("id", id);
  return { success: true };
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClientService();
  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "Product id is required." };
  await supabase.from("products").delete().eq("id", id);
  return { success: true };
}

export async function getAllStaff() {
  const supabase = await createClientService();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, role, created_at")
    .order("role", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function updateStaffRole(formData: FormData) {
  const supabase = await createClientService();
  const userId = String(formData.get("userId") || "").trim();
  const role = String(formData.get("role") || "").trim();
  if (!userId || !role) return { error: "userId and role are required." };
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: error.message };
  await logAdminAction("admin", "change_staff_role", userId, { role });
  return { success: true };
}
