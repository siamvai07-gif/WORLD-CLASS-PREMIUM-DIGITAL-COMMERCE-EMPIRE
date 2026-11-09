import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "SiamVIP — Premium Digital Commerce",
  description:
    "Marketplace · Gaming top-up · Dollar exchange · Coin wallet · Communities · Master Admin Center",
  openGraph: {
    title: "SiamVIP — Premium Digital Commerce Empire",
    description: "World-class digital commerce platform serving Bangladesh, India & Pakistan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
