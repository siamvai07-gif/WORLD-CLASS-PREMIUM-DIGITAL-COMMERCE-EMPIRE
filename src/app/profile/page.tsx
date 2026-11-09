export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getProfile, upsertProfile, getCountryCode } from "@/lib/auth-actions";

export async function saveProfile(formData: FormData) {
  "use server";
  await upsertProfile(formData);
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Flag, ShieldCheck, Wallet, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await getProfile();
  const profile = data?.profile;
  const countryCode = await getCountryCode(profile?.country || "BD");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowRight className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-3 border border-border">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground">{profile?.full_name || user.email}</p>
                <p className="text-xs text-muted-foreground">@{profile?.username || "user"}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {profile?.country === "BD" ? "🇧🇩 Bangladesh" : profile?.country === "IN" ? "🇮🇳 India" : "🇵🇰 Pakistan"}
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-xs text-indigo-600 font-medium">Verified member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings form */}
        <div className="lg:col-span-2 space-y-6">
          <form action={saveProfile} className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ""} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" defaultValue={profile?.username || ""} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 text-muted-foreground border-r border-input bg-muted/50 rounded-l-md">
                      {countryCode}
                    </span>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ""} className="flex-1 rounded-l-none rounded-r-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <select id="country" name="country" defaultValue={profile?.country || "BD"} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="BD">🇧🇩 Bangladesh (+880)</option>
                    <option value="IN">🇮🇳 India (+91)</option>
                    <option value="PK">🇵🇰 Pakistan (+92)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" name="bio" defaultValue={profile?.bio || ""} className="w-full" />
              </div>
              <Button type="submit" className="w-auto">Save Changes</Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/reset-password">Change</Link>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/wallet" className="flex items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <Wallet className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-foreground">Coin Wallet</span>
        </Link>
        <Link href="/orders" className="flex items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-foreground">My Orders</span>
        </Link>
        <Link href="/community" className="flex items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">C</span>
          <span className="text-sm font-medium text-foreground">Community</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">M</span>
          <span className="text-sm font-medium text-foreground">Messages</span>
        </Link>
      </div>
    </div>
  );
}
