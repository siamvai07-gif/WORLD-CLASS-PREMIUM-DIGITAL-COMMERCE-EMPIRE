import { getAdminStats, logAdminAction } from "@/lib/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, CreditCard, Clock, TrendingUp, DollarSign, ShieldCheck, PlayCircle, Settings } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Users", icon: Users, value: "--", color: "text-indigo-600" },
  { label: "Total Orders", icon: ShoppingCart, value: "--", color: "text-blue-600" },
  { label: "Total Revenue", icon: DollarSign, value: "--", color: "text-green-600" },
  { label: "Pending Payments", icon: Clock, value: "--", color: "text-amber-600" },
  { label: "Total Products", icon: ShoppingCart, value: "--", color: "text-purple-600" },
  { label: "Coin Circulation", icon: CreditCard, value: "--", color: "text-rose-600" },
];

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  await logAdminAction(null, "view_dashboard", "admin_dashboard", {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and controls</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold {s.color}">{formatValue(s.label, stats)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/payments" className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-foreground">Review Payments</div>
                <div className="text-xs text-muted-foreground">Approve or reject coin top-up requests</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-foreground">Manage Products</div>
                <div className="text-xs text-muted-foreground">Add, edit, or disable marketplace items</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/admin/promo-videos" className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-foreground">Promo Videos</div>
                <div className="text-xs text-muted-foreground">Manage homepage video carousel</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <PlayCircle className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-indigo-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-foreground">Website Settings</div>
                <div className="text-xs text-muted-foreground">Brand, SEO, maintenance mode</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Settings className="w-4 h-4" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              Audit log activity appears here. <Link href="/admin/audit-logs">View all logs</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatValue(label: string, stats: any) {
  switch (label) {
    case "Total Users": return stats.totalUsers;
    case "Total Orders": return stats.totalOrders;
    case "Total Revenue": return `৳${stats.totalRevenue.toLocaleString()}`;
    case "Pending Payments": return stats.pendingPayments;
    case "Total Products": return stats.totalProducts;
    case "Coin Circulation": return stats.totalCoins.toLocaleString();
    default: return "--";
  }
}
