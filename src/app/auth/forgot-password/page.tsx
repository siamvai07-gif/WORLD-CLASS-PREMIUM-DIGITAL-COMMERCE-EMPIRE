"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setInfo(res.info || "Reset instructions sent.");
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent password reset instructions to your email address.
          </p>
          <Button asChild onClick={() => setSent(false)}>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="ghost" size="sm" className="ml-2">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 p-8 shadow-card">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Forgot password</h2>
            <p className="text-muted-foreground">
              Enter your email and we'll send reset instructions
            </p>
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
              <Input id="email" type="email" required autoComplete="email" className="w-full" />
            </div>
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send reset link
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
