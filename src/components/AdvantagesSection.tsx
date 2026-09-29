"use client";

import React from "react";
import { Flame, Leaf, HeartHandshake, Sparkles } from "lucide-react";
import { ScrollReveal, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/ScrollReveal";

interface AdvantageItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function AdvantagesSection({ advantages }: { advantages: AdvantageItem[] }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-5 h-5 text-brandorange" />;
      case "Leaf":
        return <Leaf className="w-5 h-5 text-brandgreen" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-brown" />;
      default:
        return <Sparkles className="w-5 h-5 text-brandgreen" />;
    }
  };

  return (
    <section id="advantages" className="py-20 bg-cream-100 relative border-b border-brown/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="px-3.5 py-1 rounded-full bg-brandgreen/10 text-brandgreen font-bold text-xs uppercase tracking-wider inline-block">
            Keunggulan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-darkbrown tracking-tight">
            Mengapa Memilih Kukusan Sehat?
          </h2>
          <p className="text-sm text-brown font-normal leading-relaxed">
            Menyajikan cemilan sehat alami tanpa minyak dan tanpa pengawet dengan bahan segar pilihan.
          </p>
        </ScrollReveal>

        <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
          {advantages.map((item) => (
            <ScrollStaggerItem
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-brown/10 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center border border-brown/10">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-darkbrown">{item.title}</h3>
                <p className="text-xs text-brown leading-relaxed font-normal">{item.description}</p>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>
      </div>
    </section>
  );
}
