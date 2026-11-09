export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "preferences", title: "Your Interests" },
  { id: "rewards", title: "Welcome Reward" },
];

export default async function OnboardingPage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await getProfile();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground">Welcome to SiamVIP</h1>
        <p className="text-muted-foreground mt-2">
          Let's personalize your experience. Tell us a little about your interests.
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-2 relative z-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 border ${i === 0 ? "bg-indigo-600 text-white border-indigo-600" : "bg-background text-muted-foreground border-border"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i === 0 ? "font-semibold text-indigo-600" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground mb-6">What interests you?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Free Fire",
            "PUBG",
            "Dollar Exchange",
            "Gift Cards",
            "Online Courses",
            "Digital Products",
          ].map((interest) => (
            <button
              key={interest}
              className="px-4 py-3 rounded-xl border border-border bg-white hover:bg-indigo-50 hover:border-indigo-200 text-sm text-foreground transition-colors"
            >
              {interest}
            </button>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">Skip</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          You'll receive a welcome bonus after your first purchase.
        </p>
      </div>
    </div>
  );
}
