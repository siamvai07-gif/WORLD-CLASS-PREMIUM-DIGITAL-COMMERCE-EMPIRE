"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState<number>(0);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold text-xl text-white tracking-tight">SiamVIP</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Premium digital commerce marketplace serving Bangladesh, India &amp; Pakistan.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/store" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/store?category=free-fire" className="hover:text-white transition-colors">Free Fire</Link></li>
              <li><Link href="/store?category=pubg" className="hover:text-white transition-colors">PUBG</Link></li>
              <li><Link href="/store?category=dollar" className="hover:text-white transition-colors">Dollar Exchange</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Wallet</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/wallet" className="hover:text-white transition-colors">Coin Wallet</Link></li>
              <li><Link href="/wallet#add-coins" className="hover:text-white transition-colors">Add Coins</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/community" className="hover:text-white transition-colors">Forums</Link></li>
              <li><Link href="/messages" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-xs text-slate-500 text-center">
          SiamVIP Digital Commerce &copy; {year}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
