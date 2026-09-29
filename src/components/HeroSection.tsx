"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame, Truck, PhoneCall } from "lucide-react";

interface HeroData {
  title: string;
  subtitle: string;
  badgeText: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  heroImageUrl: string;
  whatsappNumber?: string;
}

export default function HeroSection({ hero }: { hero: HeroData }) {
  const waNumber = hero.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749";

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-cream-100 border-b border-brown/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Minimalist Organic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brandgreen/20 text-brandgreen text-xs font-bold shadow-soft"
            >
              <span className="w-2 h-2 rounded-full bg-brandgreen animate-pulse" />
              <span>{hero.badgeText || "Cemilan Kukus Sehat & Segar Dukuhwaluh"}</span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-darkbrown tracking-tight leading-[1.18]"
            >
              {hero.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base text-brown leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
            >
              {hero.subtitle}
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <a
                href={`https://wa.me/${waNumber}?text=Halo%20Kukusan%20Gen%20Z!%20%F0%9F%8C%BF%20Saya%20mau%20pesan%20aneka%20kukusan%20sehat%20untuk%20area%20Kampus%20UMP%201%20%2F%20Ketapang%20Kost%202.%20Boleh%20minta%20info%20menu%20yang%20ready%20hari%20ini%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-warm transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{hero.ctaPrimaryText || "Order via WhatsApp"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#menu"
                className="w-full sm:w-auto px-6 py-3 bg-white text-darkbrown border border-brown/20 font-semibold text-xs sm:text-sm rounded-xl hover:bg-cream-50 transition-all flex items-center justify-center gap-2 shadow-soft hover:scale-[1.02] active:scale-95"
              >
                <span>{hero.ctaSecondaryText || "Lihat Menu"}</span>
              </a>
            </motion.div>

            {/* Minimalist 3-Pill Value Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-brown"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-lg border border-brown/10 shadow-soft">
                <Truck className="w-3.5 h-3.5 text-brandgreen" />
                <span className="font-semibold text-darkbrown">Siap Antar Kampus UMP 1</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-lg border border-brown/10 shadow-soft">
                <Flame className="w-3.5 h-3.5 text-brandorange" />
                <span className="font-semibold text-darkbrown">100% Bebas Minyak</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-lg border border-brown/10 shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-brandgreen" />
                <span className="font-semibold text-darkbrown">5K Dapet 3 Pcs</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Banner Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-warm border border-brown/15 bg-white">
              <Image
                src={hero.heroImageUrl || "/banners/header-banner.jpg"}
                alt="Kukusan Gen Z"
                fill
                priority
                className="object-cover"
              />

              {/* Minimalist Floating Overlay Pill */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-brown/10 shadow-soft flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-darkbrown">Lapak Ketapang Kost 2</p>
                  <p className="text-[11px] text-brown font-medium">Buka 06.00 WIB - Habis</p>
                </div>
                <span className="px-2.5 py-1 bg-brandorange text-white text-[11px] font-bold rounded-lg shadow-soft">
                  5K Dapet 3
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
