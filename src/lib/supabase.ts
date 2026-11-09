import { createBrowserClient, isBrowser, parse as parseCookie } from "@supabase/ssr";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseUrlPublic = supabaseUrl;
export const supabaseAnonKeyPublic = supabaseAnonKey;

export function createClientBrowser() {
  if (!isBrowser()) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function createClientServer() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // `setAll` was called from a Server Component
        }
      },
    },
  });
}

// Service-role client (server-only). NEVER expose to browser.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export function createClientService() {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured on the server.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Typed schema helpers
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          username: string | null;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          role: "customer" | "advertiser" | "promoter" | "super_admin";
          created_at: string;
          updated_at: string;
          reply_frozen: boolean;
          reply_notice: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          username?: string | null;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          role?: "customer" | "advertiser" | "promoter" | "super_admin";
          reply_frozen?: boolean;
          reply_notice?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          username?: string | null;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          role?: "customer" | "advertiser" | "promoter" | "super_admin";
          reply_frozen?: boolean;
          reply_notice?: string | null;
        };
      };
      wallets: {
        Row: { user_id: string; balance: string; updated_at: string };
        Insert: { user_id: string; balance?: string };
        Update: { user_id?: string; balance?: string };
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "deposit" | "credit" | "bet" | "debit" | "cashout" | "adjustment" | "seed";
          amount: string;
          balance_after: string;
          status: "pending" | "completed" | "approved" | "failed" | "rejected" | "reversed";
          reason: string | null;
          ref_kind: string | null;
          ref_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "deposit" | "credit" | "bet" | "debit" | "cashout" | "adjustment" | "seed";
          amount: string;
          balance_after: string;
          status?: "pending" | "completed" | "approved" | "failed" | "rejected" | "reversed";
          reason?: string | null;
          ref_kind?: string | null;
          ref_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "deposit" | "credit" | "bet" | "debit" | "cashout" | "adjustment" | "seed";
          amount?: string;
          balance_after?: string;
          status?: "pending" | "completed" | "approved" | "failed" | "rejected" | "reversed";
          reason?: string | null;
          ref_kind?: string | null;
          ref_id?: string | null;
        };
      };
      payment_requests: {
        Row: {
          id: string;
          user_id: string;
          method: "bkash" | "nagad" | "other";
          kind: "deposit" | "withdraw";
          amount: string;
          sender_number: string | null;
          transaction_id: string | null;
          note: string | null;
          receipt_url: string | null;
          status: "pending" | "approved" | "rejected" | "cancelled";
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          method: "bkash" | "nagad" | "other";
          kind: "deposit" | "withdraw";
          amount: string;
          sender_number?: string | null;
          transaction_id?: string | null;
          note?: string | null;
          receipt_url?: string | null;
          status?: "pending" | "approved" | "rejected" | "cancelled";
        };
        Update: {
          id?: string;
          user_id?: string;
          method?: "bkash" | "nagad" | "other";
          kind?: "deposit" | "withdraw";
          amount?: string;
          sender_number?: string | null;
          transaction_id?: string | null;
          note?: string | null;
          receipt_url?: string | null;
          status?: "pending" | "approved" | "rejected" | "cancelled";
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_note?: string | null;
        };
      };
      site_settings: {
        Row: { id: string; key: string; value: string; updated_at: string };
        Insert: { id?: string; key: string; value: string };
        Update: { id?: string; key?: string; value?: string };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          kind: string;
          link: string | null;
          read_at: string | null;
          sender_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          kind?: string;
          link?: string | null;
          sender_label?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string | null;
          kind?: string;
          link?: string | null;
          read_at?: string | null;
          sender_label?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          last_message_at: string | null;
          last_message_preview: string | null;
          created_at: string;
        };
        Insert: { id?: string; user_a: string; user_b: string };
        Update: {
          id?: string;
          user_a?: string;
          user_b?: string;
          last_message_at?: string | null;
          last_message_preview?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string | null;
          media_url: string | null;
          media_type: string | null;
          created_at: string;
          sender_label: string | null;
          sender_kind: string;
          edited_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          sender_label?: string | null;
          sender_kind?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          sender_label?: string | null;
          sender_kind?: string;
          edited_at?: string | null;
        };
      };
      campaigns: {
        Row: {
          id: string;
          advertiser_id: string;
          title: string;
          description: string | null;
          category: string | null;
          media_url: string | null;
          media_type: string | null;
          video_url: string | null;
          link_url: string | null;
          budget: string;
          spent: string;
          prepaid: boolean;
          target_audience: any;
          package_id: string | null;
          status: "draft" | "pending" | "active" | "paused" | "completed" | "rejected";
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          advertiser_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          video_url?: string | null;
          link_url?: string | null;
          budget?: string;
          spent?: string;
          prepaid?: boolean;
          target_audience?: any;
          package_id?: string | null;
          status?: "draft" | "pending" | "active" | "paused" | "completed" | "rejected";
          start_date?: string | null;
          end_date?: string | null;
        };
        Update: {
          id?: string;
          advertiser_id?: string;
          title?: string;
          description?: string | null;
          category?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          video_url?: string | null;
          link_url?: string | null;
          budget?: string;
          spent?: string;
          prepaid?: boolean;
          target_audience?: any;
          package_id?: string | null;
          status?: "draft" | "pending" | "active" | "paused" | "completed" | "rejected";
          start_date?: string | null;
          end_date?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          promoter_id: string;
          reviewer_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          promoter_id: string;
          reviewer_id: string;
          rating: number;
          title?: string | null;
          comment?: string | null;
        };
        Update: {
          id?: string;
          promoter_id?: string;
          reviewer_id?: string;
          rating?: number;
          title?: string | null;
          comment?: string | null;
        };
      };
      admin_actions: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target: string | null;
          meta: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target?: string | null;
          meta?: any;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          target?: string | null;
          meta?: any;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "customer" | "advertiser" | "promoter" | "super_admin";
      payment_status: "pending" | "approved" | "rejected" | "cancelled";
      payment_kind: "deposit" | "withdraw";
      campaign_status: "draft" | "pending" | "active" | "paused" | "completed" | "rejected";
      tx_status: "pending" | "completed" | "approved" | "failed" | "rejected" | "reversed";
      tx_type: "deposit" | "credit" | "bet" | "debit" | "cashout" | "adjustment" | "seed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables = Database["public"]["Tables"];
export type TablesInsert = Database["public"]["Tables"][keyof Database["public"]["Tables"]]["Insert"];
export type TablesUpdate = Database["public"]["Tables"][keyof Database["public"]["Tables"]]["Update"];
