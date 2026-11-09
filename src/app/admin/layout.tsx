import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/admin-actions";
import { ShieldCheck, LayoutGrid, ShoppingCart, CreditCard, Users, FileText, Settings, Play } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutGrid },
    { name: "Products", href: "/admin/products", icon: ShoppingCart },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Promo Videos", href: "/admin/promo-videos", icon: Play },
    { name: "Staff", href: "/admin/staff", icon: Users },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold text-sm shadow-glow">
              S
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">SiamVIP Admin</span>
          </Link>
          <form action={logoutAdmin} className="flex items-center gap-2">
            <Button variant="destructive" size="sm" type="submit">
              Logout
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Visit Store</Link>
            </Button>
          </form>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden w-64 border-r border-border bg-background flex-col lg:flex">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-muted/50 hover:text-indigo-600"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
