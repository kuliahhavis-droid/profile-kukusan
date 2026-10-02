"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Send,
  User,
  MapPin,
  Navigation,
  CreditCard,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerForm {
  name: string;
  address: string;
  paymentMethod: string;
  keterangan: string;
}

const PAYMENT_METHODS = [
  { id: "QRIS", label: "QRIS / E-Wallet", desc: "GoPay, OVO, Dana, ShopeePay" },
  { id: "Tunai", label: "Tunai / COD", desc: "Bayar tunai saat pesanan tiba" },
  { id: "Transfer", label: "Transfer Bank", desc: "BCA / BRI / Mandiri" },
];

export default function CartDrawer() {
  const {
    isOpen,
    setIsOpen,
    items,
    totalItems,
    updateQuantity,
    removeItem,
    subtotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState<CustomerForm>({
    name: "",
    address: "",
    paymentMethod: "QRIS / E-Wallet",
    keterangan: "",
  });

  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressInputRef.current) return;

    const initializeAutocomplete = () => {
      const googleMaps = (window as Window & { google?: any }).google;
      if (!googleMaps?.maps || !addressInputRef.current) return;

      setIsMapsReady(true);
      if (!googleMaps.maps.places) return;

      const autocomplete = new googleMaps.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: "id" },
        fields: ["formatted_address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setForm((prev) => ({ ...prev, address: place.formatted_address }));
          setErrors((prev) => ({ ...prev, address: undefined }));
        }
      });
    };

    const existingScript = document.getElementById("google-maps-places-script");
    if (existingScript) {
      if ((window as Window & { google?: any }).google?.maps) {
        initializeAutocomplete();
      } else {
        existingScript.addEventListener("load", initializeAutocomplete, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initializeAutocomplete;
    script.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        address: "Google Maps gagal dimuat. Periksa API key dan aktifkan Maps JavaScript API.",
      }));
    };
    document.head.appendChild(script);
  }, []);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Load saved customer info from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kukusan_customer_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({
          ...prev,
          name: parsed.name || "",
          address: parsed.address || "",
        }));
      }
    } catch (e) {
      console.error("Failed to load customer data", e);
    }
  }, []);

  const handleInputChange = (field: keyof CustomerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, address: "Browser tidak mendukung lokasi otomatis" }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const googleMaps = (window as Window & { google?: any }).google;
        if (!isMapsReady || !googleMaps?.maps?.Geocoder) {
          setErrors((prev) => ({
            ...prev,
            address: "Google Maps belum siap. Pastikan Maps JavaScript API aktif, lalu refresh halaman.",
          }));
          setIsLocating(false);
          return;
        }

        new googleMaps.maps.Geocoder().geocode(
          { location: { lat: coords.latitude, lng: coords.longitude } },
          (results: Array<{ formatted_address?: string }> | null, status: string) => {
            if (status === "OK" && results?.[0]?.formatted_address) {
              setForm((prev) => ({ ...prev, address: results[0].formatted_address || "" }));
              setErrors((prev) => ({ ...prev, address: undefined }));
            } else {
              setErrors((prev) => ({ ...prev, address: "Alamat tidak ditemukan, silakan tulis manual" }));
            }
            setIsLocating(false);
          }
        );
      },
      (error) => {
        const message =
          error.code === 1
            ? "Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini dari ikon kunci di address bar."
            : error.code === 2
              ? "Lokasi perangkat tidak tersedia. Nyalakan GPS atau periksa koneksi internet."
              : "Pencarian lokasi terlalu lama. Coba lagi atau tulis alamat manual.";
        setErrors((prev) => ({ ...prev, address: message }));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validateForm = () => {
    const newErrors: { name?: string; address?: string } = {};
    if (!form.name.trim()) {
      newErrors.name = "Mohon isi nama Anda";
    }
    if (!form.address.trim()) {
      newErrors.address = "Mohon isi alamat / lokasi antar";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) {
      return;
    }

    // Save name & address to localStorage for future visits
    try {
      localStorage.setItem(
        "kukusan_customer_data",
        JSON.stringify({
          name: form.name,
          address: form.address,
        })
      );
    } catch (e) {
      console.error("Failed to save customer data", e);
    }

    // Generate clean WhatsApp message
    let msg = `Halo Kukusan Gen Z! 🌿🍠\nSaya mau pesan aneka kukusan:\n\n`;
    msg += `📋 *RINCIAN PESANAN:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n`;
      msg += `   • Jumlah: ${item.quantity} pcs${item.product.price === 2000 ? " (harga promo dihitung gabungan)" : ` (Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")})`}\n`;
      if (item.notes && item.notes.trim()) {
        msg += `   • Catatan Item: _${item.notes.trim()}_\n`;
      }
    });

    msg += `\n📊 *Total Item:* ${totalItems} pcs\n`;
    msg += `💰 *Total Bayar:* Rp ${subtotal.toLocaleString("id-ID")}\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Nama Pemesan:* ${form.name.trim()}\n`;
    msg += `📍 *Alamat / Lokasi Antar:* ${form.address.trim()}\n`;
    msg += `💳 *Metode Pembayaran:* ${form.paymentMethod}\n`;
    if (form.keterangan && form.keterangan.trim()) {
      msg += `📝 *Keterangan:* ${form.keterangan.trim()}\n`;
    }
    msg += `\nMohon konfirmasi dan diproses ya kak. Terima kasih! 🙏✨`;

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    clearCart();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-darkbrown/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-cream-50 shadow-dropdown flex flex-col border-l border-brown/15"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-white border-b border-brown/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-brandgreen/10 text-brandgreen rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-darkbrown">
                        Keranjang Pesanan
                      </h3>
                      {totalItems > 0 && (
                        <span className="px-2 py-0.5 bg-brandorange text-white text-[11px] font-bold rounded-full">
                          {totalItems} item
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brown">Kukusan Sehat & Tradisional</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-brown/70 hover:text-darkbrown hover:bg-cream-100 transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-brown/70">
                    <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-3">
                      <ShoppingBag className="w-8 h-8 text-brown/40" />
                    </div>
                    <h4 className="font-bold text-darkbrown text-base">Keranjang Kosong</h4>
                    <p className="text-xs mt-1 text-brown max-w-xs leading-relaxed">
                      Pilih cemilan kukus favoritmu seperti Pisang, Ubi Oren, Ubi Ungu, Singkong, Talas, atau Jagung!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 1. Menu Items Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brown">
                          Menu Terpilih ({totalItems})
                        </h4>
                        <button
                          onClick={clearCart}
                          className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                        >
                          Kosongkan
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {items.map((item, idx) => {
                          return (
                            <div
                              key={`${item.product.id}-${item.selectedTopping}-${idx}`}
                              className="bg-white rounded-2xl p-3.5 border border-brown/10 shadow-soft flex gap-3 items-center hover:border-brandgreen/30 transition-colors"
                            >
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs sm:text-sm text-darkbrown truncate">
                                  {item.product.name}
                                </h4>
                                {item.notes && (
                                  <p className="text-[11px] text-brown/70 italic truncate">
                                    &quot;{item.notes}&quot;
                                  </p>
                                )}
                                <p className="font-bold text-brandgreen text-xs sm:text-sm mt-0.5">
                                  {item.product.price === 2000
                                    ? "Rp 2.000/pcs (promo gabungan)"
                                    : `Rp ${(item.product.price + (item.toppingPrice || 0)).toLocaleString("id-ID")}/pcs`}
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => removeItem(item.product.id, item.selectedTopping)}
                                  className="text-brown/40 hover:text-red-500 transition-colors p-1"
                                  title="Hapus"
                                  aria-label="Hapus item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Quantity Controller */}
                                <div className="flex items-center gap-1 bg-cream-100 rounded-xl p-1 border border-brown/10">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedTopping)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-darkbrown hover:bg-cream-200 transition-colors active:scale-95"
                                    aria-label="Kurangi jumlah"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-darkbrown">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedTopping)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-brandgreen text-white hover:bg-brandgreen-hover transition-colors active:scale-95"
                                    aria-label="Tambah jumlah"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Customer Information Form */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brown/10 shadow-soft space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-brown/10">
                        <Sparkles className="w-4 h-4 text-brandgreen" />
                        <h4 className="font-bold text-sm text-darkbrown">
                          Data Pengantaran
                        </h4>
                      </div>

                      {/* Nama Pemesan */}
                      <div>
                        <label className="block text-xs font-bold text-darkbrown mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-brandgreen" />
                          Nama Pemesan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Contoh: Kak Rian / Sarah"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-cream-50/50 text-darkbrown placeholder:text-brown/40 focus:outline-none focus:ring-2 focus:ring-brandgreen/30 transition-all ${
                            errors.name ? "border-red-400 bg-red-50/30" : "border-brown/20 focus:border-brandgreen"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Lokasi / Alamat Pengantaran */}
                      <div>
                        <label className="block text-xs font-bold text-darkbrown mb-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brandgreen" />
                          Alamat / Lokasi Antar <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocating}
                          className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-brandgreen hover:text-brandgreen-hover disabled:opacity-50"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          {isLocating ? "Mencari lokasi..." : "Gunakan lokasi saya"}
                        </button>
                        <input
                          ref={addressInputRef}
                          value={form.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Contoh: Kost Ketapang 2 Kamar 104 / Gerbang UMP 1 / Gedung FEB"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-cream-50/50 text-darkbrown placeholder:text-brown/40 focus:outline-none focus:ring-2 focus:ring-brandgreen/30 transition-all resize-none ${
                            errors.address ? "border-red-400 bg-red-50/30" : "border-brown/20 focus:border-brandgreen"
                          }`}
                        />
                        {errors.address && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Metode Pembayaran */}
                      <div>
                        <label className="block text-xs font-bold text-darkbrown mb-1.5 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-brandgreen" />
                          Metode Pembayaran
                        </label>
                        <div className="space-y-1.5">
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => handleInputChange("paymentMethod", method.label)}
                              className={`w-full p-2.5 text-left rounded-xl border flex items-center justify-between transition-all ${
                                form.paymentMethod === method.label
                                  ? "bg-brandgreen/10 border-brandgreen shadow-xs"
                                  : "border-brown/15 hover:bg-cream-100"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-darkbrown">{method.label}</p>
                                <p className="text-[10px] text-brown/70">{method.desc}</p>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  form.paymentMethod === method.label
                                    ? "border-brandgreen bg-brandgreen"
                                    : "border-brown/30"
                                }`}
                              >
                                {form.paymentMethod === method.label && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Keterangan / Catatan Tambahan */}
                      <div>
                        <label className="block text-xs font-bold text-darkbrown mb-1.5 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-brandgreen" />
                          Keterangan / Catatan <span className="text-brown/50 text-[10px] font-normal">(Opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={form.keterangan}
                          onChange={(e) => handleInputChange("keterangan", e.target.value)}
                          placeholder="Contoh: Titip di pos satpam / Minta sendok"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brown/20 bg-cream-50/50 text-xs sm:text-sm text-darkbrown placeholder:text-brown/40 focus:outline-none focus:border-brandgreen focus:ring-2 focus:ring-brandgreen/30 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Sticky Footer */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-brown/10 space-y-3.5 shadow-soft">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-brown">
                      <span>Total {totalItems} Item</span>
                      <span className="font-semibold text-darkbrown">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm sm:text-base text-darkbrown pt-2 border-t border-dashed border-brown/15">
                      <span>Subtotal Pesanan</span>
                      <span className="text-brandgreen font-black">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-3 py-2.5 rounded-xl border border-brown/20 text-brown hover:bg-cream-50 text-xs font-semibold transition-colors active:scale-95"
                    >
                      Kosongkan
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 py-3 px-4 bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-warm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Pesan via WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}





