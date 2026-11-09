import Link from "next/link";
import { verifyAdminKey } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    await verifyAdminKey(formData);
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold text-sm shadow-glow">
              S
            </div>
            <span className="font-bold text-xl text-foreground">SiamVIP</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 p-8 shadow-card">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Admin Access</h2>
            <p className="text-muted-foreground">Master Admin Control Center</p>
          </div>

          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Access Key</Label>
              <Input
                id="adminKey"
                name="adminKey"
                type="password"
                required
                autoComplete="current-password"
                className="w-full"
                placeholder="Enter bootstrap key"
              />
              <p className="text-xs text-muted-foreground">
                Initial key: SIAMVIP (change after setup)
              </p>
            </div>
            <Button type="submit" className="w-full py-3">
              <>
                <Lock className="w-4 h-4 mr-2" />
                Enter Admin Panel
              </>
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-2 p-3 rounded-xl border border-border bg-slate-50 text-xs">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span className="text-muted-foreground">
              Admin access is verified server-side. The bootstrap key can be rotated in Settings.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
