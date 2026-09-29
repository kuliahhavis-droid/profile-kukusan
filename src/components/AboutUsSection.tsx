"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string;
}

export default function AboutUsSection({ about }: { about: AboutData }) {
  return (
    <section id="about" className="py-20 bg-cream-50 relative border-b border-brown/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Image Column - Optimized for portrait photo of the real stall */}
          <ScrollReveal direction="left" distance={30} className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-warm border border-brown/15 bg-white">
              <Image
                src={about.imageUrl || "/banners/about-banner.jpg"}
                alt="Lapak Kukusan Gen Z Ketapang Kost 2"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />

              {/* Real Stall Location Badge */}
              <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-soft border border-brown/10 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brandgreen" />
                <span className="text-xs font-bold text-darkbrown">Lapak Ketapang Kost 2</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Content Column with smooth scroll entrance */}
          <ScrollReveal direction="right" distance={30} delay={0.15} className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-cream-200 text-brown font-bold text-xs uppercase tracking-wider inline-block">
                Lapak & Cerita Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-darkbrown tracking-tight leading-tight">
                {about.title}
              </h2>
              <p className="text-sm text-brown leading-relaxed">{about.subtitle}</p>
            </div>

            <p className="text-sm text-brown leading-relaxed font-normal">
              {about.description}
            </p>

            {/* Bullet Points */}
            <div className="space-y-2 pt-1">
              {about.bulletPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white px-3.5 py-2.5 rounded-xl border border-brown/10 shadow-soft">
                  <CheckCircle2 className="w-4 h-4 text-brandgreen flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-darkbrown">{point}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
