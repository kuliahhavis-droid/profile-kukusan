"use client";

import React, { useState } from "react";
import { Ticket, Copy, Check } from "lucide-react";
import { ScrollReveal, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/ScrollReveal";

interface PromoItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  description: string;
  isActive: boolean;
}

export default function PromosSection({ promos }: { promos: PromoItem[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activePromos = promos.filter((p) => p.isActive);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (activePromos.length === 0) return null;

  return (
    <section id="promos" className="py-20 bg-darkbrown text-cream-100 relative overflow-hidden border-b border-brown/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="px-3.5 py-1 rounded-full bg-brandorange text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-soft">
            <Ticket className="w-3.5 h-3.5" />
            Promo Spesial
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Voucher & Diskon Hemat</h2>
          <p className="text-sm text-cream-200/80 font-normal">Gunakan kode voucher berikut saat melakukan pemesanan via WhatsApp.</p>
        </ScrollReveal>

        <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto" staggerDelay={0.1}>
          {activePromos.map((promo) => (
            <ScrollStaggerItem
              key={promo.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-soft flex flex-col justify-between space-y-4 hover:border-brandorange/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-brandorange text-white font-bold text-xs rounded-lg shadow-soft">
                    {promo.discount}
                  </span>
                  <span className="text-[11px] text-cream-200/60">Pemesanan WhatsApp</span>
                </div>
                <h3 className="font-bold text-base text-white mt-2.5">{promo.title}</h3>
                <p className="text-xs text-cream-200/75 mt-1 leading-relaxed font-normal">{promo.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-dashed border-white/30">
                  <span className="font-mono font-bold text-xs tracking-wider text-brandorange-light">
                    {promo.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="px-3.5 py-1.5 bg-white text-darkbrown font-bold text-xs rounded-xl hover:bg-cream-100 transition-all flex items-center gap-1.5 shadow-soft active:scale-95"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brandgreen" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-brown" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>
      </div>
    </section>
  );
}
