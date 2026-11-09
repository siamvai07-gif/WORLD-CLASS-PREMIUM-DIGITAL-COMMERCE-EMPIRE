"use server";

import { createClientServer } from "@/lib/supabase";
import { createClientService } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPaymentRequest(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const packageId = String(formData.get("packageId") || "");
  const method = String(formData.get("method") || "");
  const trxId = String(formData.get("trxId") || "").trim();
  const receiptUrl = String(formData.get("receiptUrl") || "").trim();

  if (!method || !trxId) {
    return { error: "Payment method and transaction reference are required." };
  }

  // Get amount from coin package if provided
  let amount = "0";
  if (packageId) {
    const { data: pkg } = await supabase
      .from("coin_packages")
      .select("price")
      .eq("id", packageId)
      .single();
    if (pkg) amount = pkg.price;
  }

  const { error } = await supabase.from("payment_requests").insert({
    user_id: user.id,
    method: method as any,
    kind: "deposit",
    amount,
    transaction_id: trxId,
    receipt_url: receiptUrl || null,
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath("/wallet");
  return { success: true };
}

export async function createOrder(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const productId = String(formData.get("productId") || "");
  const qty = Number(formData.get("qty") || 1);
  const price = String(formData.get("price") || "0");
  const total = String(Number(price.replace(/[^\d.]/g, "")) * qty);

  const orderId = "SIAM-" + Date.now().toString(36).toUpperCase();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_id: orderId,
      total,
      status: "pending",
    })
    .select()
    .single();
  if (orderError) return { error: orderError.message };

  const { data: product } = await supabase
    .from("products")
    .select("title")
    .eq("id", productId)
    .single();

  await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productId || null,
    product_title: product?.title || "Product",
    qty,
    price,
  });

  revalidatePath("/orders");
  return { success: true, orderId };
}

export async function createCommunityPost(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const communityId = String(formData.get("communityId") || "");
  const content = String(formData.get("content") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  if (!communityId || !content) return { error: "Community and content are required." };

  const { error } = await supabase.from("community_posts").insert({
    community_id: communityId,
    user_id: user.id,
    content,
    image_url: imageUrl || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function createPostPlain(communityId: string, content: string, imageUrl: string) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  if (!content.trim()) return { error: "Content required." };
  const { error } = await supabase.from("community_posts").insert({
    community_id: communityId || null,
    user_id: user.id,
    content: content.trim(),
    image_url: imageUrl || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function joinCommunityPlain(communityId: string) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: user.id,
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function createCommentPlain(postId: string, content: string, parentId: string | null) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  if (!content.trim()) return { error: "Content required." };
  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    parent_id: parentId,
    content: content.trim(),
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function reactToPost(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const postId = String(formData.get("postId") || "");
  const type = String(formData.get("type") || "like");
  if (!postId) return { error: "Post required." };

  const { error } = await supabase.from("post_reactions").upsert(
    { post_id: postId, user_id: user.id, type },
    { onConflict: "post_id,user_id" }
  );
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleReaction(postId: string, type: string) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  if (!postId) return { error: "Post required." };
  const existing = await supabase
    .from("post_reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();
  if (existing.data && existing.data.type === type) {
    await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id);
  } else {
    await supabase.from("post_reactions").upsert(
      { post_id: postId, user_id: user.id, type },
      { onConflict: "post_id,user_id" }
    );
  }
  return { success: true };
}

export async function removeReaction(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const postId = String(formData.get("postId") || "");
  await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id);
  return { success: true };
}

export async function createComment(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const postId = String(formData.get("postId") || "");
  const content = String(formData.get("content") || "").trim();
  const parentId = String(formData.get("parentId") || "") || null;
  if (!postId || !content) return { error: "Content required." };

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    parent_id: parentId,
    content,
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function joinCommunity(formData: FormData) {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };
  const communityId = String(formData.get("communityId") || "");
  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: user.id,
  });
  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

// --- Admin actions (service role) ---
export async function approvePayment(formData: FormData) {
  const supabase = await createClientService();
  const paymentId = String(formData.get("paymentId") || "");
  const adminId = String(formData.get("adminId") || "");
  if (!paymentId || !adminId) return { error: "Missing fields." };
  const { error } = await supabase.rpc("approve_payment", {
    p_payment_request_id: paymentId,
    p_admin_id: adminId,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function rejectPayment(formData: FormData) {
  const supabase = await createClientService();
  const paymentId = String(formData.get("paymentId") || "");
  const adminId = String(formData.get("adminId") || "");
  const note = String(formData.get("note") || "");
  const { error } = await supabase
    .from("payment_requests")
    .update({ status: "rejected", reviewed_by: adminId, reviewed_at: new Date().toISOString(), review_note: note })
    .eq("id", paymentId);
  if (error) return { error: error.message };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClientService();
  const id = String(formData.get("id") || "");
  const data: any = {
    category_id: String(formData.get("categoryId") || "") || null,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || null,
    price: String(formData.get("price") || "0"),
    coin_price: String(formData.get("coinPrice") || "0"),
    image_url: String(formData.get("imageUrl") || "") || null,
    video_url: String(formData.get("videoUrl") || "") || null,
    is_active: formData.get("isActive") === "true",
    is_featured: formData.get("isFeatured") === "true",
    stock: Number(formData.get("stock") || 0),
  };
  if (id) {
    const { error } = await supabase.from("products").update(data).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(data);
    if (error) return { error: error.message };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClientService();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function upsertPromoVideo(formData: FormData) {
  const supabase = await createClientService();
  const data: any = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || null,
    thumbnail_url: String(formData.get("thumbnailUrl") || "") || null,
    video_url: String(formData.get("videoUrl") || "") || null,
    duration: String(formData.get("duration") || "") || null,
    is_active: formData.get("isActive") === "true",
    sort_order: Number(formData.get("sortOrder") || 0),
  };
  const { error } = await supabase.from("promo_videos").upsert(data);
  if (error) return { error: error.message };
  revalidatePath("/admin/promo-videos");
  return { success: true };
}

export async function upsertSetting(formData: FormData) {
  const supabase = await createClientService();
  const key = String(formData.get("key") || "");
  const value = String(formData.get("value") || "");
  const { error } = await supabase.from("site_settings").upsert({ key, value });
  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return { success: true };
}


