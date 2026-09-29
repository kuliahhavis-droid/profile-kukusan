import React from "react";
import Link from "next/link";
import { getProducts } from "@/db";
import { Plus, ArrowRight, Package, CheckCircle2, Star, MapPin, Edit2 } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const products = await getProducts({ activeOnly: false });

  const activeProductsCount = products.filter((p) => p.isActive).length;
  const featuredProductsCount = products.filter((p) => p.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brown/15 shadow-soft">
        <div>
          <span className="px-2.5 py-1 bg-brandgreen/10 text-brandgreen font-bold text-[11px] rounded-lg inline-block mb-1.5">
            Lapak Ketapang Kost 2 Dukuhwaluh
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-darkbrown tracking-tight">
            Ringkasan Toko
          </h2>
          <p className="text-xs text-brown mt-1 max-w-xl leading-relaxed">
            Kelola ketersediaan menu kukusan serba Rp 2.000, paket hemat 5K, dan informasi kontak toko.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-brandgreen text-white font-bold text-xs rounded-xl hover:bg-brandgreen-hover transition-all flex items-center gap-1.5 shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Kelola Menu</span>
          </Link>
          <Link
            href="/admin/content"
            className="px-3.5 py-2.5 bg-cream-50 text-darkbrown border border-brown/15 font-bold text-xs rounded-xl hover:bg-cream-100 transition-all shadow-soft"
          >
            Edit Info Lapak
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brown/15 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brown">Total Menu</p>
            <p className="text-2xl font-black text-darkbrown mt-0.5">{products.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-brown border border-brown/10">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brown/15 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brown">Menu Aktif</p>
            <p className="text-2xl font-black text-brandgreen mt-0.5">{activeProductsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brandgreen/10 flex items-center justify-center text-brandgreen border border-brandgreen/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brown/15 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brown">Menu Unggulan</p>
            <p className="text-2xl font-black text-brandorange mt-0.5">{featuredProductsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brandorange/10 flex items-center justify-center text-brandorange border border-brandorange/20">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brown/15 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brown">Jam Lapak</p>
            <p className="text-xs font-bold text-darkbrown mt-1">06.00 WIB - Habis</p>
            <p className="text-[10px] text-brandgreen font-semibold">Siap Antar UMP 1</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-brandgreen border border-brown/10">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-brown/15 shadow-soft overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-brown/10">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-darkbrown">Daftar Menu Kukusan</h3>
            <p className="text-xs text-brown mt-0.5">Menu yang tayang di katalog website</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-brandgreen hover:text-brandgreen-hover flex items-center gap-1"
          >
            <span>Buka Pengelola ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream-50 border-b border-brown/10 text-brown font-bold">
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brown">
                    Belum ada menu yang ditambahkan.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-brown/10">
                          <Image
                            src={prod.imageUrl}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-darkbrown truncate max-w-[200px] sm:max-w-xs">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-brown leading-tight truncate max-w-[200px] sm:max-w-xs">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-brandgreen whitespace-nowrap">
                      Rp {prod.price.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 bg-brandorange/10 text-brandorange font-bold rounded-md text-[10px]">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-brown/40 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                          prod.isActive
                            ? "bg-brandgreen/10 text-brandgreen border-brandgreen/25"
                            : "bg-cream-100 text-brown border-brown/20"
                        }`}
                      >
                        {prod.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-cream-100 hover:bg-cream-200 text-darkbrown rounded-lg text-xs font-bold transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-brown" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
