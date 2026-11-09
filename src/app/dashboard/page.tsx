export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth-actions";
import { getNotifications, markNotificationRead } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Wallet, ShoppingBag, Users, MessageCircle, CreditCard, TrendingUp, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  const notifications = await getNotifications(user.id);
  const balance = 0; // wallet wired in Phase 5

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.profile?.full_name || "Customer"}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/wallet">Add Coins</Link>
          </Button>
          <Button variant="premiumGhost" asChild>
            <Link href="/store">Shop</Link>
          </Button>
        </div>
      </div>

      {/* Wallet card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 mb-8 shadow-lg shadow-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm">Coin Wallet Balance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{balance.toLocaleString()}</span>
              <span className="text-lg font-medium opacity-90">coins</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium">
            <CreditCard className="w-4 h-4" /> Secure
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="premiumGhost" asChild className="flex-1">
            <Link href="/wallet#add-coins">
              <Wallet className="w-4 h-4 mr-2" /> Add Coins
            </Link>
          </Button>
          <Button variant="outline" className="border-white/20 bg-white/5 text-white flex-1">
            <TrendingUp className="w-4 h-4 mr-2" /> History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Featured Products</h3>
              <Link href="/store" className="text-sm text-indigo-600 hover:text-indigo-500">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Free Fire Diamonds", price: "৳120", cat: "Gaming" },
                { title: "PUBG UC 6000", price: "৳850", cat: "Gaming" },
                { title: "$50 USD Buy", price: "৳5,400", cat: "Dollar" },
                { title: "Google Play $25", price: "৳2,700", cat: "Gift Card" },
              ].map((p, i) => (
                <div key={i} className="rounded-xl border border-border bg-white dark:bg-slate-900 p-4 shadow-sm">
                  <span className="text-xs text-muted-foreground uppercase">{p.cat}</span>
                  <h4 className="text-sm font-semibold text-foreground mt-1">{p.title}</h4>
                  <p className="text-sm font-bold text-indigo-600 mt-2">{p.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent notifications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <Link href="/notifications" className="text-sm text-indigo-600 hover:text-indigo-500">View all</Link>
            </div>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn("flex items-start gap-3 p-3 rounded-xl border border-border bg-white dark:bg-slate-900 cursor-pointer hover:bg-muted/50 transition-colors", n.read_at ? "opacity-70" : "border-indigo-50/50")}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body || ""}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No new notifications.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar - quick stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-muted-foreground">Wallet Balance</p>
                <p className="text-lg font-bold text-foreground">{balance.toLocaleString()} coins</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Your Orders</p>
                <p className="text-lg font-bold text-foreground">0</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Community</p>
                <p className="text-lg font-bold text-foreground">Join</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-3 text-xs">
              <Link href="/community">Explore Communities</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
