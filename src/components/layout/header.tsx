"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  ShieldCheck,
  Video,
  MessageCircle,
  LayoutGrid,
  Play,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { name: "Store", href: "/store" },
    { name: "Community", href: "/community" },
    { name: "Wallet", href: "/wallet" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold text-sm shadow-glow">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">SiamVIP</span>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-3 hidden sm:flex">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="relative p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
            {searchOpen && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                3
              </span>
            )}
          </button>
          <button className="relative p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="Cart">
            <ShoppingBag size={18} />
          </button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link href="/messages">
              <MessageCircle size={18} />
            </Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <span className="font-semibold text-foreground">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-muted-foreground hover:bg-secondary"
            >
              <Menu size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function BottomNav({ active }: { active: string }) {
  const items = [
    { name: "Home", href: "/", icon: LayoutGrid, label: "Home" },
    { name: "Store", href: "/store", icon: ShoppingBag, label: "Store" },
    { name: "Community", href: "/community", icon: MessageCircle, label: "Community" },
    { name: "Messages", href: "/messages", icon: ShieldCheck, label: "Support" },
    { name: "Profile", href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-3">
        {items.map((item) => {
          const isActive = active === item.name;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors"
            >
              <Icon
                size={20}
                className={cn(
                  isActive ? "text-indigo-600" : "text-muted-foreground",
                  isActive && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-indigo-600" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Header;
