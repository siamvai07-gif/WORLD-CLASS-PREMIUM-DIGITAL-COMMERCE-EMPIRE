"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mail, Lock, ArrowRight, Monitor, Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn(formData);
    setLoading(false);
    if (res.error) setError(res.error);
    else if (res.success) {
      setInfo("Welcome back!");
      setTimeout(() => (window.location.href = "/dashboard"), 600);
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
            href="/register"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Create account
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 p-8 shadow-card">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
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
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required autoComplete="current-password" className="w-full" />
            </div>
            <Button
              type="submit"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground text-center">
              New to SiamVIP?{" "}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Secure login</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-slate-50">
              <Monitor className="w-4 h-4 text-indigo-500" />
              <span className="text-xs text-muted-foreground">24/7 access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
