"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/db/schema";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductStatusAction,
  toggleProductFeaturedAction,
} from "@/actions/product-actions";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Upload,
  X,
  Search,
  Sparkles,
  Check,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Custom Delete Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(2000);
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [badge, setBadge] = useState("2K / Pcs");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch(`/api/products?activeOnly=false&t=${Date.now()}`).then((res) => res.json());
      if (prodRes.products) setProducts(prodRes.products);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(2000);
    setOriginalPrice(2500);
    setImageUrl("/menu/pisang.jpg");
    setBadge("2K / Pcs");
    setIsActive(true);
    setIsFeatured(true);
    setDisplayOrder(products.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || "");
    setImageUrl(product.imageUrl);
    setBadge(product.badge || "");
    setIsActive(product.isActive);
    setIsFeatured(product.isFeatured);
    setDisplayOrder(product.displayOrder);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));
      if (originalPrice) formData.append("originalPrice", String(originalPrice));
      formData.append("categoryId", "cat-1");
      formData.append("imageUrl", imageUrl);
      formData.append("badge", badge);
      formData.append("isActive", String(isActive));
      formData.append("isFeatured", String(isFeatured));
      formData.append("displayOrder", String(displayOrder));

      let res;
      if (editingProduct) {
        res = await updateProductAction(editingProduct.id, formData);
      } else {
        res = await createProductAction(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
        if (res.product) {
          if (editingProduct) {
            setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.product! : p)));
            showToast(`Menu "${res.product.name}" berhasil diperbarui!`, "success");
          } else {
            setProducts((prev) => [res.product!, ...prev]);
            showToast(`Menu "${res.product.name}" berhasil ditambahkan & langsung tayang!`, "success");
          }
        } else {
          showToast("Menu berhasil disimpan!", "success");
        }
        await fetchProducts();
      } else {
        showToast(res.error || "Gagal menyimpan menu. Periksa kembali data input.", "error");
      }
    } catch (err: any) {
      showToast("Terjadi kesalahan: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    const res = await toggleProductStatusAction(id);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: Boolean(res.isActive) } : p))
      );
      showToast("Status tayang menu berhasil diperbarui!", "success");
    } else {
      showToast(res.error || "Gagal mengubah status tayang", "error");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const res = await toggleProductFeaturedAction(id);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: Boolean(res.isFeatured) } : p))
      );
      showToast("Status menu unggulan berhasil diperbarui!", "success");
    } else {
      showToast(res.error || "Gagal mengubah status unggulan", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(deleteConfirm.id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
        showToast(`Menu "${deleteConfirm.name}" berhasil dihapus.`, "success");
        setDeleteConfirm(null);
      } else {
        showToast(res.error || "Gagal menghapus menu", "error");
      }
    } catch (err: any) {
      showToast("Terjadi kesalahan saat menghapus: " + err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-darkbrown tracking-tight">Kelola Menu Kukusan</h2>
          <p className="text-xs text-brown mt-0.5">
            Tambah varian baru, atur harga serba 2K / paket hemat 5K, dan ketersediaan stok.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brandgreen text-white font-bold text-xs rounded-xl hover:bg-brandgreen-hover transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-soft active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {/* Styled Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 border rounded-2xl flex items-center justify-between gap-3 shadow-warm animate-in fade-in slide-in-from-top-2 duration-300 ${
            toast.type === "success"
              ? "bg-brandgreen/10 border-brandgreen/30 text-brandgreen"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {toast.type === "success" ? (
              <Check className="w-4 h-4 text-brandgreen flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-brown/15 shadow-soft">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-brown/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pisang, ubi, singkong, kentang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-xs font-semibold text-darkbrown placeholder:text-brown/40 focus:outline-none focus:border-brandgreen"
          />
        </div>
        <div className="text-xs text-brown font-semibold">
          Total: <span className="font-bold text-darkbrown">{products.length}</span> varian terdaftar
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brown/15 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-brown">Memuat data menu...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-xs text-brown">Tidak ada menu yang cocok dengan pencarian.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream-50 border-b border-brown/10 text-brown font-bold">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Menu Kukusan</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-center">Unggulan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/5">
                {filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-brown/60 font-semibold">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-brown/10">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-darkbrown truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-brown leading-tight truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-bold text-brandgreen">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[10px] text-brown/50 line-through">
                          Rp {product.originalPrice.toLocaleString("id-ID")}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {product.badge ? (
                        <span className="px-2 py-0.5 bg-brandorange/10 text-brandorange font-bold rounded-md text-[10px]">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-brown/30">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.isFeatured
                            ? "text-brandorange hover:text-brandorange-hover bg-brandorange/10"
                            : "text-brown/30 hover:text-brown hover:bg-cream-100"
                        }`}
                        title="Tandai menu unggulan"
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? "fill-brandorange" : ""}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(product.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                          product.isActive
                            ? "bg-brandgreen/10 text-brandgreen border-brandgreen/25 hover:bg-brandgreen/20"
                            : "bg-cream-100 text-brown border-brown/20 hover:bg-cream-200"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-brown hover:text-darkbrown hover:bg-cream-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: product.id, name: product.name })}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-darkbrown/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-warm border border-brown/15 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brown/10 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-darkbrown">
                {editingProduct ? "Edit Menu Kukusan" : "Tambah Menu Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-brown/70 hover:text-darkbrown rounded-xl hover:bg-cream-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-darkbrown">Nama Menu</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pisang Kukus Alami"
                  className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-semibold focus:outline-none focus:border-brandgreen"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-darkbrown">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan rasa, tekstur pulen, atau porsi..."
                  className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Harga Coret (Opsional)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Contoh: 2500"
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-darkbrown">Badge Promo / Highlight (Opsional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: 2K / Pcs atau Hemat 5K!"
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                  />
                </div>
              </div>

              {/* Upload Foto */}
              <div className="space-y-1">
                <label className="font-bold text-darkbrown">Foto Menu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL gambar atau upload..."
                    className="flex-1 px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-[11px] text-darkbrown focus:outline-none"
                  />
                  <label className="px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-darkbrown rounded-xl cursor-pointer text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0 border border-brown/15 active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-brandgreen" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {imageUrl && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-brown/15 mt-2 bg-cream-100">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Status checkboxes */}
              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-darkbrown">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-brandgreen focus:ring-brandgreen"
                  />
                  <span>Tayang di Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-darkbrown">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-brandgreen focus:ring-brandgreen"
                  />
                  <span>Menu Unggulan</span>
                </label>
              </div>

              <div className="pt-3 border-t border-brown/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-brown hover:bg-cream-100 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all shadow-soft active:scale-95"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styled Delete Confirmation Modal */}
      {deleteConfirm && deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-darkbrown/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-warm border border-brown/15 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-soft">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-darkbrown">Hapus Menu Ini?</h3>
              <p className="text-xs text-brown leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-bold text-darkbrown">&ldquo;{deleteConfirm.name}&rdquo;</span>? Menu ini akan langsung dihapus dari katalog website.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-cream-100 hover:bg-cream-200 text-darkbrown text-xs font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-soft active:scale-95"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
