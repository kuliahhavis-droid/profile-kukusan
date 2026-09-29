"use client";

import React from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import { MessageCircle, Instagram, Music2, ArrowUp } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749";

  return (
    <footer className="bg-darkbrown text-cream-100 pt-14 pb-10 relative border-t border-brown/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3.5">
            <BrandLogo showTagline variant="light" />
            <p className="text-xs text-cream-200/90 leading-relaxed max-w-sm font-normal">
              Aneka kukusan sehat serba Rp 2.000: Pisang, Ubi Oren, Ubi Ungu, Kentang, Singkong, Talas, & Jagung. Paket Hemat 5K Dapet 3 Pcs. Siap Antar Area Kampus UMP 1 Dukuhwaluh.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.instagram.com/kukusangenz._?stkn=N2JhYW85bml3czJu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all text-white hover:text-brandorange shadow-xs hover:scale-105"
                aria-label="Instagram Kukusan Gen Z"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@kukusangenz_?_r=1&_t=ZS-9A8P0eyM0If"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all text-white hover:text-brandorange shadow-xs hover:scale-105"
                aria-label="TikTok Kukusan Gen Z"
              >
                <Music2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-1.5 text-xs text-cream-200/80 font-normal">
              <li>
                <a href="#hero" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Menu Kukusan
                </a>
              </li>
              <li>
                <a href="#advantages" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Lapak Kami
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Lokasi Kedai
                </a>
              </li>
            </ul>
          </div>

          {/* Menu Highlights */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Menu Kukusan</h4>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {["Pisang (2k)", "Ubi Oren (2k)", "Ubi Ungu (2k)", "Kentang (2k)", "Singkong (2k)", "Talas (2k)", "Jagung (2k)", "Paket 5K Dapet 3"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white/10 border border-white/10 text-cream-100 text-[11px] font-medium rounded-lg hover:bg-white/15 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Copyright & Back To Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200/70">
          <p className="font-normal">
            © {new Date().getFullYear()} Kukusan Gen Z • Ketapang Kost 2 Dukuhwaluh Banyumas
          </p>

          <button
            onClick={scrollToTop}
            className="p-1.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs active:scale-95"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${waNumber}?text=Halo%20Kukusan%20Gen%20Z!%20%F0%9F%8C%BF%20Saya%20mau%20pesan%20aneka%20kukusan%20sehat%20untuk%20area%20Kampus%20UMP%201%20%2F%20Ketapang%20Kost%202.%20Boleh%20minta%20info%20menu%20yang%20ready%20hari%20ini%3F`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 bg-brandgreen hover:bg-brandgreen-hover text-white rounded-full shadow-warm hover:shadow-dropdown transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs font-bold">Chat WA</span>
      </a>
    </footer>
  );
}


