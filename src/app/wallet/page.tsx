export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, History, ArrowRight, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { createPaymentRequest } from "@/lib/actions";
import { getWallet, getWalletTransactions, getCoinPackages, getPaymentMethods } from "@/lib/data";

export async function submitPaymentRequest(formData: FormData) {
  "use server";
  await createPaymentRequest(formData);
}

export default async function WalletPage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [wallet, transactions, packages, methods] = await Promise.all([
    getWallet(user.id),
    getWalletTransactions(user.id, 10),
    getCoinPackages(),
    getPaymentMethods(),
  ]);

  const balance = Number(wallet?.balance || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coin Wallet</h1>
          <p className="text-muted-foreground">Securely manage your coins and transactions</p>
        </div>
        <Link href="/store" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
          <ArrowRight className="w-3 h-3 mr-1" /> Browse Store
        </Link>
      </div>

      {/* Balance */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-8 mb-8 shadow-lg shadow-indigo-500/25">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-5xl font-bold">{balance.toLocaleString()}</span>
              <span className="text-xl font-medium opacity-90">coins</span>
            </div>
            <p className="text-xs text-indigo-200 mt-3">
              {balance === 0 ? "Wallet not yet funded" : "Ready to spend"}
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur border border-white/20">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="premiumGhost" className="flex-1" onClick={() => { window.location.hash = "add-coins"; }}>
            <CreditCard className="w-4 h-4 mr-2" /> Add Coins
          </Button>
          <Button variant="outline" className="flex-1 border-white/20 bg-white/5">
            <History className="w-4 h-4 mr-2" /> History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add coins section */}
        <div className="lg:col-span-2 space-y-6" id="add-coins">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6">Add Coins</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Purchase coin packages using bKash or Nagad. Coins are credited after our team verifies your payment.
            </p>

            <form action={submitPaymentRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {packages.map((p) => (
                  <label key={p.id} className="group relative rounded-xl border p-4 transition-all cursor-pointer flex flex-col">
                    <input
                      type="radio"
                      name="packageId"
                      value={p.id}
                      defaultChecked={p.id === packages[0]?.id}
                      className="peer sr-only"
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-indigo-600">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.coins.toLocaleString()} coins{p.bonus > 0 ? ` + ${p.bonus} bonus` : ""}</span>
                    <span className="mt-auto text-lg font-bold text-foreground">{p.price}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Payment Method</label>
                  <select name="method" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {methods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.number})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Transaction Reference / TrxID</label>
                  <input
                    name="trxId"
                    type="text"
                    placeholder="e.g. TRX123456789"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Payment Proof (image link)</label>
                  <input
                    name="receiptUrl"
                    type="text"
                    placeholder="Paste screenshot link (optional)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  After payment, submit your transaction ID. Our team verifies and credits coins within 24 hours.
                </div>
                <Button type="submit" className="w-full py-3 bg-gradient-premium text-white font-semibold shadow-lg shadow-indigo-500/30">
                  Submit Payment Request
                </Button>
              </div>
            </form>
          </div>

          {/* Payment instructions */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Instructions</h3>
            <div className="space-y-4">
              {methods.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.id === "bkash" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                      {m.id === "bkash" ? "b" : "N"}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-sm text-muted-foreground">Send to: {m.number}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    After payment, submit your transaction ID and a screenshot of the receipt.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - recent transactions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">+</div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {t.type === "credit" ? "Coin top-up" : t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.reason || "Wallet credit"}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="ml-auto text-sm font-semibold text-foreground">+{Number(t.amount).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">No transactions yet.</div>
              )}
              <div className="text-center pt-3 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full">
                  View All History
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground mb-4">Security</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Server-verified</div>
                  <div>All transactions verified server-side before crediting.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Manual review</div>
                  <div>Payments reviewed within 24 hours.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
