"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/db/schema";
import { createCategoryAction } from "@/actions/product-actions";
import { Plus, Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then(() => {
        setCategories([
          { id: "cat-1", name: "Kukusan Ori", slug: "kukusan-ori", description: "Kukusan otentik alami", icon: "Wheat", displayOrder: 1, isActive: true },
          { id: "cat-2", name: "Kukusan Special Topping", slug: "kukusan-special-topping", description: "Kukusan dengan topping lumer", icon: "Sparkles", displayOrder: 2, isActive: true },
          { id: "cat-3", name: "Paket Gen Z Combo", slug: "paket-gen-z-combo", description: "Paket hemat komplit", icon: "PackageCheck", displayOrder: 3, isActive: true },
        ]);
      });
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const res = await createCategoryAction(name, description);
    setSubmitting(false);

    if (res.success && res.category) {
      setCategories((prev) => [...prev, res.category!]);
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900">Kelola Kategori</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Atur pengelompokan menu makanan untuk mengorganisir katalog website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Tambah */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-stone-200 space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="font-bold text-sm text-stone-900">Tambah Kategori Baru</h3>
            <p className="text-xs text-stone-500 mt-0.5">Buat kelompok menu baru</p>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Nama Kategori</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Minuman Sehat"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Deskripsi Singkat</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan singkat tentang kelompok menu ini..."
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-darkbrown text-white font-semibold rounded-lg hover:bg-darkbrown-hover transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? "Menyimpan..." : "Tambah Kategori"}</span>
            </button>
          </form>
        </div>

        {/* Daftar Kategori */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Daftar Kategori</h3>
              <p className="text-xs text-stone-500 mt-0.5">Kategori yang aktif digunakan di katalog</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-md border border-stone-200">
              {categories.length} Kategori
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-stone-900 truncate">{cat.name}</h4>
                    <p className="text-[11px] text-stone-500 truncate">{cat.description || "Tanpa deskripsi"}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold rounded-md flex-shrink-0">
                  Aktif
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
