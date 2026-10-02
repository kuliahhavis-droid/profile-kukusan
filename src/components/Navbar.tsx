"use client";

import React, { useState, useEffect } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Menu,
  X,
  PhoneCall,
  Home,
  UtensilsCrossed,
  Sparkles,
  Store,
  MapPin,
  ChevronRight,
  Clock,
} from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

export default function Navbar({ identity }: { identity?: { brandName?: string; tagline?: string; whatsappNumber?: string } }) {
  const { totalItems, setIsOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Beranda", href: "#hero", icon: Home, desc: "Halaman Utama" },
    { name: "Menu Kukusan", href: "#menu", icon: UtensilsCrossed, desc: "Pilihan Cemilan Sehat" },
    { name: "Keunggulan", href: "#advantages", icon: Sparkles, desc: "Kenapa Pilih Kami" },
    { name: "Tentang Kami", href: "#about", icon: Store, desc: "Cerita Kukusan Gen Z" },
    { name: "Lokasi Outlet", href: "#location", icon: MapPin, desc: "Area Kampus UMP 1" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-header py-3 shadow-soft"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        {/* Subtle Top Scroll Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] bg-brandgreen origin-left z-50"
          style={{ scaleX }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <BrandLogo showTagline={!isScrolled} brandName={identity?.brandName} tagline={identity?.tagline} />

          {/* Desktop Nav - Minimalist Clean Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brown/10 shadow-soft">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-darkbrown/80 hover:text-darkbrown hover:bg-cream-100 transition-all active:scale-95"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 bg-white/90 hover:bg-white rounded-full border border-brown/15 shadow-soft text-darkbrown hover:border-brandgreen/40 transition-all active:scale-95"
              aria-label="Keranjang Pesanan"
            >
              <ShoppingBag className="w-4 h-4 text-darkbrown" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brandorange text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-soft leading-none animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={`https://wa.me/${identity?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749"}?text=Halo%20Kukusan%20Gen%20Z!%20%F0%9F%8C%BF%20Saya%20mau%20pesan%20aneka%20kukusan%20sehat%20untuk%20area%20Kampus%20UMP%201%20%2F%20Ketapang%20Kost%202.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs rounded-full shadow-soft transition-all hover:scale-[1.02] active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Order WA</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 bg-white/90 rounded-2xl border border-brown/15 text-darkbrown shadow-soft active:scale-95 transition-all"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Mobile Slide-in Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-darkbrown/45 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-12">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="w-screen max-w-xs sm:max-w-sm bg-white shadow-xl flex flex-col border-l border-brown/15 overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-4 bg-white border-b border-brown/10 flex items-center justify-between">
                  <BrandLogo showTagline={false} brandName={identity?.brandName} tagline={identity?.tagline} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-brown hover:text-darkbrown transition-colors active:scale-95"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Nav Links Body */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                  <p className="text-[10px] font-bold text-brown/50 uppercase tracking-widest px-1 pb-3">
                    Navigasi Cepat
                  </p>

                  <div>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-3 border-b border-brown/10 hover:bg-cream-50 text-darkbrown transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-brandgreen flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-darkbrown leading-snug">
                                {link.name}
                              </p>
                              <p className="text-[10px] text-brown/60">
                                {link.desc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-brown/30 group-hover:text-brandgreen group-hover:translate-x-0.5 transition-all" />
                        </a>
                      );
                    })}
                  </div>

                  {/* Operational Status Card */}
                </div>

                {/* Drawer Footer CTA */}
                <div className="p-4 bg-white border-t border-brown/10 space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOpen(true);
                    }}
                    className="w-full py-3 px-4 rounded-md bg-cream-100 hover:bg-cream-200 text-darkbrown font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-brown/15 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-brandgreen" />
                    <span>Lihat Keranjang {totalItems > 0 ? `(${totalItems})` : ""}</span>
                  </button>

                  <a
                    href={`https://wa.me/${identity?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749"}?text=Halo%20Kukusan%20Gen%20Z!%20%F0%9F%8C%BF%20Saya%20mau%20pesan%20aneka%20kukusan%20sehat%20area%20Kampus%20UMP%201.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-md bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}


