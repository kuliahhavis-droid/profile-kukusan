"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, Category } from "@/db/schema";
import { useCart } from "@/context/CartContext";
import { Plus, Eye, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/ScrollReveal";

interface ProductCatalogProps {
  initialProducts: Product[];
  categories?: Category[];
}

export default function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [modalNotes, setModalNotes] = useState<string>("");

  const activeProducts = initialProducts.filter((p) => p.isActive);

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalNotes("");
  };

  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;
    addItem(selectedProduct, modalQuantity, "Kukusan Alami", modalNotes);
    setSelectedProduct(null);
  };

  return (
    <section id="menu" className="py-16 sm:py-20 bg-cream-50 relative border-b border-brown/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-12">
          <span className="px-3.5 py-1 rounded-full bg-cream-200 text-brown font-bold text-xs uppercase tracking-wider inline-block">
            Menu Kukusan
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-darkbrown tracking-tight">
            Varian Kukusan Hangat Alami
          </h2>
          <p className="text-xs sm:text-sm text-brown font-normal leading-relaxed">
            Kukusan segar murni tanpa minyak. Satuan Rp 2.000 / pcs atau Paket Hemat 5K Dapet 3 Pcs.
          </p>
        </ScrollReveal>

        {/* Product Cards Grid: 2 Columns on Mobile, 4 Columns on Desktop */}
        <ScrollStaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5" staggerDelay={0.05}>
          {activeProducts.map((product) => (
            <ScrollStaggerItem
              key={product.id}
              className="group bg-white rounded-2xl border border-brown/10 overflow-hidden shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Product Image Box */}
                <div className="relative w-full aspect-[4/3] bg-cream-100 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 sm:px-2.5 py-0.5 bg-brandorange text-white text-[9px] sm:text-[10px] font-bold rounded-md shadow-soft flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {product.badge}
                    </span>
                  )}

                  {/* Quick View Button */}
                  <button
                    onClick={() => handleOpenQuickView(product)}
                    className="absolute inset-0 bg-darkbrown/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-[11px] sm:text-xs backdrop-blur-[2px]"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Detail</span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-4 space-y-1">
                  <h3 className="font-bold text-darkbrown text-xs sm:text-base group-hover:text-brandgreen transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-brown leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Price & Add to Cart Footer */}
              <div className="p-3 sm:p-4 pt-2 sm:pt-3 border-t border-brown/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-bold text-xs sm:text-base text-brandgreen">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-[11px] text-brown/50 line-through">
                      Rp {product.originalPrice.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addItem(product, 1, "Kukusan Alami")}
                  className="w-full sm:w-auto px-2.5 sm:px-3.5 py-1.5 bg-brandgreen hover:bg-brandgreen-hover text-white rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-soft transition-all active:scale-95 hover:scale-105"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pesan</span>
                </button>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>
      </div>

      {/* Quick View / Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-darkbrown/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-dropdown border border-brown/10"
            >
              {/* Modal Image Box - Matching 4:3 Aspect Ratio */}
              <div className="relative aspect-[4/3] bg-cream-100 w-full overflow-hidden">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  className="object-cover"
                  priority
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-darkbrown hover:bg-white transition-colors shadow-soft"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-brandgreen bg-brandgreen/10 px-2 py-0.5 rounded-md">
                    100% Kukusan Alami
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-darkbrown mt-1">{selectedProduct.name}</h3>
                  <p className="text-xs text-brown mt-1 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Catatan Tambahan (Opsional) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-darkbrown">
                    Catatan Khusus (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tolong pilih yang empuk / campur varian..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-xs text-darkbrown placeholder:text-brown/40 focus:outline-none focus:border-brandgreen"
                  />
                </div>

                {/* Quantity & Action Button */}
                <div className="pt-3 border-t border-brown/10 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-xl border border-brown/15">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white font-bold text-xs text-darkbrown hover:bg-cream-200"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-xs text-darkbrown">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-7 h-7 rounded-lg bg-brandgreen text-white font-bold text-xs hover:bg-brandgreen-hover"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartFromModal}
                    className="flex-1 py-2.5 px-3 sm:px-4 bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs rounded-xl shadow-soft transition-all active:scale-95 text-center"
                  >
                    Tambah ke Keranjang (Rp {(selectedProduct.price * modalQuantity).toLocaleString("id-ID")})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
