"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/db/schema";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTopping?: string;
  toppingPrice?: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, topping?: string, notes?: string) => void;
  removeItem: (productId: string, topping?: string) => void;
  updateQuantity: (productId: string, quantity: number, topping?: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  formattedWhatsAppMessage: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kukusan_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kukusan_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, topping: string = "Kukusan Alami", notes: string = "") => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.notes === notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedTopping: topping,
          toppingPrice: 0,
          notes,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (productId: string, topping: string = "Kukusan Alami") => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number, topping: string = "Kukusan Alami") => {
    if (quantity <= 0) {
      removeItem(productId, topping);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.toppingPrice || 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  // Format WhatsApp order message with clean, professional structure
  const generateWhatsAppMessage = () => {
    if (items.length === 0) return "";

    let msg = `Halo Kukusan Gen Z! 🌿🍠\nSaya mau pesan aneka kukusan sehat:\n\n`;
    msg += `📋 *RINCIAN PESANAN:*\n`;

    items.forEach((item, idx) => {
      const unitPrice = item.product.price + (item.toppingPrice || 0);
      const itemTotal = unitPrice * item.quantity;
      msg += `${idx + 1}. *${item.product.name}*\n`;
      msg += `   • Jumlah: ${item.quantity} pcs (Rp ${itemTotal.toLocaleString("id-ID")})\n`;
      if (item.notes && item.notes.trim()) {
        msg += `   • Catatan: _${item.notes.trim()}_\n`;
      }
    });

    msg += `\n📊 *Total Item:* ${totalItems} pcs\n`;
    msg += `💰 *Subtotal:* Rp ${subtotal.toLocaleString("id-ID")}\n`;
    msg += `------------------------------------\n\n`;

    msg += `📍 *FORMAT PENGIRIMAN:*\n`;
    msg += `• *Nama Pemesan:* \n`;
    msg += `• *Lokasi Antar:* (Contoh: Kost Ketapang 2 / Gerbang UMP 1 / Gedung Fakultas)\n`;
    msg += `• *Waktu Pengantaran:* (Contoh: Sekarang / Jam 07.30 WIB)\n`;
    msg += `• *Metode Bayar:* (Cash Tunai / QRIS / Transfer)\n\n`;

    msg += `Mohon konfirmasi total dan ketersediaan menu ya kak. Terima kasih! 🙏✨`;

    return encodeURIComponent(msg);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        subtotal,
        formattedWhatsAppMessage: generateWhatsAppMessage(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
