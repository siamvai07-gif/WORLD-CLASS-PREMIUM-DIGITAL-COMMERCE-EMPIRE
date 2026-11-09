import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "SiamVIP — Account",
  description: "Sign in, register, or recover your SiamVIP account.",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-background">{children}</body>
    </html>
  );
}
