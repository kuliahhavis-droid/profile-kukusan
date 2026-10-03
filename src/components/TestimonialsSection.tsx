"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { ScrollReveal, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/ScrollReveal";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export default function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section className="py-20 bg-cream-100 relative border-b border-brown/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="px-3.5 py-1 rounded-full bg-brandgreen/10 text-brandgreen font-bold text-xs uppercase tracking-wider inline-block">
            Kata Pelanggan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-darkbrown tracking-tight">
            Cerita & Testimoni Pelanggan
          </h2>
          <p className="text-sm text-brown font-normal">Pengalaman menikmati jajanan kukus sehat setiap hari.</p>
        </ScrollReveal>

        <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" staggerDelay={0.1}>
          {testimonials.map((testi) => (
            <ScrollStaggerItem
              key={testi.id}
              className="bg-white rounded-2xl p-5 border border-brown/10 shadow-soft flex flex-col justify-between relative hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="w-7 h-7 text-cream-300 absolute top-4 right-4 pointer-events-none opacity-60" />

              <div className="space-y-2.5">
                <div className="flex items-center gap-1">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brandorange text-brandorange" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-brown leading-relaxed font-normal">
                  &ldquo;{testi.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-brown/10">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-cream-200 border border-brown/10 flex-shrink-0">
                  <Image src={testi.avatar} alt={testi.name} fill sizes="36px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-darkbrown">{testi.name}</h4>
                  <p className="text-[11px] text-brown font-medium">{testi.role}</p>
                </div>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>
      </div>
    </section>
  );
}
