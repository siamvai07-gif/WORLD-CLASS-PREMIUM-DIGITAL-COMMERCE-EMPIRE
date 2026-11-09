"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mail, Lock, User, Phone, Flag, ArrowRight, ShieldCheck } from "lucide-react";

const COUNTRIES = [
  { code: "BD", label: "Bangladesh (+880)", flag: "🇧🇩" },
  { code: "IN", label: "India (+91)", flag: "🇮🇳" },
  { code: "PK", label: "Pakistan (+92)", flag: "🇵🇰" },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [country, setCountry] = useState("BD");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signUp(formData);
    setLoading(false);
    if (res.error) setError(res.error);
    else if (res.info) setInfo(res.info);
    else if (res.success) {
      setInfo("Account created! Redirecting...");
      setTimeout(() => (window.location.href = "/onboarding"), 800);
    }
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
          <a
            href="/login"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Already have an account?
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 p-8 shadow-card">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground">Join the premium digital marketplace</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required autoComplete="name" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required autoComplete="username" className="w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" required autoComplete="email" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required autoComplete="new-password" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" required autoComplete="new-password" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                required
                defaultValue="BD"
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">+{country === "BD" ? "880" : country === "IN" ? "91" : "92"}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <span className="px-3 py-2 text-muted-foreground border-r border-input bg-muted/50 rounded-l-md">
                  {country === "BD" ? "+880" : country === "IN" ? "+91" : "+92"}
                </span>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="01712345678"
                  className="flex-1 rounded-l-none rounded-r-md"
                />
              </div>
            </div>
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? (
                <>
                  <ArrowRight className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Create account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 p-3 rounded-xl border border-border bg-slate-50 text-xs">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              Secure signup — your password is never stored in plain text
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
