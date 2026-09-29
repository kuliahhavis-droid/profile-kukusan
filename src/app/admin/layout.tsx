"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { logoutAdminAction } from "@/actions/auth-actions";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Skip layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Streamlined nav items: Only what's actively used
  const navItems = [
    { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
    { name: "Menu Kukusan", href: "/admin/products", icon: UtensilsCrossed },
    { name: "Info Toko & WA", href: "/admin/content", icon: Sliders },
  ];

  const currentNav = navItems.find((item) => {
    if (item.href === "/admin") return pathname === "/admin";
    return pathname.startsWith(item.href);
  });

  const pageTitle = currentNav?.name || "Ringkasan";

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="pb-4 border-b border-brown/10">
          <BrandLogo showTagline={false} />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          <p className="text-[10px] font-bold text-brown/50 uppercase tracking-widest px-3 mb-2">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-darkbrown text-white shadow-soft"
                    : "text-brown hover:bg-cream-100 hover:text-darkbrown"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brandorange" : "text-brown/70"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User / Footer Card */}
      <div className="pt-4 border-t border-brown/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl text-xs font-bold text-darkbrown hover:bg-cream-100 transition-all border border-brown/15 shadow-xs"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-brandgreen" />
            <span>Lihat Website</span>
          </span>
        </Link>

        <div className="flex items-center justify-between px-3 py-2.5 bg-white rounded-xl border border-brown/15 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brandgreen text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              K
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-darkbrown truncate leading-tight">Admin Toko</p>
              <p className="text-[10px] text-brown/70 truncate">Kukusan Gen Z</p>
            </div>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="p-1.5 text-brown/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-cream-100 flex font-sans">
      {/* 1. DESKTOP LEFT SIDEBAR */}
      <aside className="w-64 bg-cream-50 border-r border-brown/15 hidden lg:flex flex-col p-5 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {renderNavContent()}
      </aside>

      {/* 2. MOBILE OFF-CANVAS DRAWER */}
      <div
        className={`fixed inset-0 bg-darkbrown/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-cream-50 z-50 lg:hidden flex flex-col p-5 shadow-dropdown transition-transform duration-200 ease-in-out transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-brown/10 mb-4">
          <span className="text-xs font-bold text-darkbrown uppercase tracking-wider">
            Menu Navigasi
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-brown hover:text-darkbrown hover:bg-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderNavContent()}
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-cream-50/90 backdrop-blur-md border-b border-brown/10 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-darkbrown hover:bg-cream-100 bg-white border border-brown/15 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-bold text-darkbrown">
              <span className="text-brown/50 hidden sm:inline">Admin /</span>
              <span>{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-darkbrown hover:text-brandgreen py-1.5 px-3 rounded-full bg-white border border-brown/15 shadow-soft transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brandgreen" />
              <span>Buka Website</span>
            </Link>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex sm:hidden p-2 text-brown hover:text-brandorange rounded-xl bg-white border border-brown/15 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
