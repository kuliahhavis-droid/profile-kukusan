"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  updateHeroContentAction,
  updateIdentityContentAction,
  updateAboutContentAction,
  updateLocationContentAction,
} from "@/actions/content-actions";
import { Check, PhoneCall, MapPin, Sparkles, Store, Upload, AlertCircle, X } from "lucide-react";

export default function AdminContentCMSPage() {
  const [activeTab, setActiveTab] = useState<"identity" | "location" | "hero" | "about">("identity");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Identity Fields
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Location Fields
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [phone, setPhone] = useState("");
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState("");

  // Hero Fields
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBadgeText, setHeroBadgeText] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");

  // About Fields
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");

  const loadContent = async () => {
    try {
      const res = await fetch(`/api/content?t=${Date.now()}`);
      const data = await res.json();
      const c = data.content;
      if (c?.identity) {
        setBrandName(c.identity.brandName || "");
        setTagline(c.identity.tagline || "");
        setWhatsappNumber(c.identity.whatsappNumber || "");
      }
      if (c?.location) {
        setAddress(c.location.address || "");
        setOpeningHours(c.location.openingHours || "");
        setPhone(c.location.phone || "");
        setMapsEmbedUrl(c.location.mapsEmbedUrl || "");
      }
      if (c?.hero) {
        setHeroTitle(c.hero.title || "");
        setHeroSubtitle(c.hero.subtitle || "");
        setHeroBadgeText(c.hero.badgeText || "");
        setHeroImageUrl(c.hero.heroImageUrl || "");
      }
      if (c?.about) {
        setAboutTitle(c.about.title || "");
        setAboutSubtitle(c.about.subtitle || "");
        setAboutDescription(c.about.description || "");
        setAboutImageUrl(c.about.imageUrl || "");
      }
    } catch (e) {
      console.error("Failed to load content:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageSetter: (url: string) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageSetter(data.url);
        showToast("Foto berhasil diupload!", "success");
      } else {
        showToast(data.error || "Gagal mengunggah foto", "error");
      }
    } catch (err: any) {
      showToast("Terjadi kesalahan upload: " + err.message, "error");
    } finally {
      setLoadingState(false);
    }
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateIdentityContentAction({
      brandName,
      tagline,
      logoText: brandName,
      whatsappNumber,
    });
    setSaving(false);
    if (res.success) {
      showToast("Nomor WhatsApp & Identitas berhasil disimpan!", "success");
    } else {
      showToast(res.error || "Gagal menyimpan identitas", "error");
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateLocationContentAction({
      address,
      openingHours,
      phone,
      mapsEmbedUrl,
    });
    setSaving(false);
    if (res.success) {
      showToast("Lokasi & Jam Buka berhasil disimpan!", "success");
    } else {
      showToast(res.error || "Gagal menyimpan lokasi", "error");
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateHeroContentAction({
      title: heroTitle,
      subtitle: heroSubtitle,
      badgeText: heroBadgeText,
      ctaPrimaryText: "Order via WhatsApp",
      ctaSecondaryText: "Lihat Menu",
      heroImageUrl,
    });
    setSaving(false);
    if (res.success) {
      showToast("Banner Utama berhasil disimpan!", "success");
    } else {
      showToast(res.error || "Gagal menyimpan banner", "error");
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAboutContentAction({
      title: aboutTitle,
      subtitle: aboutSubtitle,
      description: aboutDescription,
      bulletPoints: [
        "Lapak Stand Nyata di Depan Ketapang Kost 2 Dukuhwaluh",
        "Buka Setiap Pagi Mulai Jam 06.00 WIB - Sampai Habis",
        "Aneka Kukusan Sehat Serba 2.000 & Paket Hemat 5K Dapet 3 Pcs",
        "Menerima Pesanan Porsi Besar & Kecil (Siap Antar Kampus UMP 1)",
      ],
      imageUrl: aboutImageUrl,
    });
    setSaving(false);
    if (res.success) {
      showToast("Informasi Lapak Kami berhasil disimpan!", "success");
    } else {
      showToast(res.error || "Gagal menyimpan tentang lapak", "error");
    }
  };

  const tabs = [
    { id: "identity", label: "Kontak WhatsApp & Brand", icon: PhoneCall },
    { id: "location", label: "Lokasi & Jam Buka", icon: MapPin },
    { id: "hero", label: "Banner Utama (Hero)", icon: Sparkles },
    { id: "about", label: "Cerita Lapak (About)", icon: Store },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-darkbrown tracking-tight">Info Toko & Pengaturan WA</h2>
        <p className="text-xs text-brown mt-0.5">
          Atur nomor WhatsApp tujuan pesanan, alamat lapak Ketapang Kost 2, dan teks informasi toko.
        </p>
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

      {/* Tabs */}
      <div className="flex border-b border-brown/10 overflow-x-auto space-x-1.5 pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? "bg-darkbrown text-white shadow-soft"
                  : "bg-white text-brown hover:bg-cream-50 border border-brown/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-brown/15 p-5 sm:p-6 shadow-soft">
        {loading ? (
          <div className="p-8 text-center text-xs text-brown">Memuat data konten...</div>
        ) : (
          <>
            {/* IDENTITY FORM */}
            {activeTab === "identity" && (
              <form onSubmit={handleSaveIdentity} className="space-y-4 text-xs">
                <div className="border-b border-brown/10 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-darkbrown">Nomor WhatsApp & Identitas Brand</h3>
                  <p className="text-xs text-brown mt-0.5">Nomor ini menjadi tujuan langsung pengiriman pesan checkout dari pembeli</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Nomor WhatsApp Pemesanan</label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Contoh: 628818584749"
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                    />
                    <p className="text-[10px] text-brown/60">Gunakan format angka awal 62 (contoh: 628818584749)</p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Nama Brand / Usaha</label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-darkbrown">Slogan / Tagline</label>
                    <input
                      type="text"
                      required
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-semibold focus:outline-none focus:border-brandgreen"
                    />
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all shadow-soft"
                  >
                    {saving ? "Menyimpan..." : "Simpan Kontak WA"}
                  </button>
                </div>
              </form>
            )}

            {/* LOCATION FORM */}
            {activeTab === "location" && (
              <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
                <div className="border-b border-brown/10 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-darkbrown">Lokasi Lapak & Jam Operasional</h3>
                  <p className="text-xs text-brown mt-0.5">Informasi alamat lapak di Ketapang Kost 2 untuk pembeli yang ingin datang langsung</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-semibold focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Jam Operasional</label>
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="06.00 WIB - Sampai Habis"
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Telepon / WhatsApp Stand</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={mapsEmbedUrl}
                    onChange={(e) => setMapsEmbedUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown text-[11px] focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all shadow-soft"
                  >
                    {saving ? "Menyimpan..." : "Simpan Lokasi"}
                  </button>
                </div>
              </form>
            )}

            {/* HERO FORM */}
            {activeTab === "hero" && (
              <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
                <div className="border-b border-brown/10 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-darkbrown">Banner Utama (Hero Section)</h3>
                  <p className="text-xs text-brown mt-0.5">Teks headline pembuka pada bagian atas website</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Headline Utama</label>
                  <input
                    type="text"
                    required
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Subtitle / Deskripsi</label>
                  <textarea
                    required
                    rows={3}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Badge Text</label>
                    <input
                      type="text"
                      value={heroBadgeText}
                      onChange={(e) => setHeroBadgeText(e.target.value)}
                      className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-darkbrown">Foto Banner Utama</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={heroImageUrl}
                        onChange={(e) => setHeroImageUrl(e.target.value)}
                        placeholder="URL foto banner atau upload..."
                        className="flex-1 px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown text-[11px] focus:outline-none focus:border-brandgreen"
                      />
                      <label className="px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-darkbrown rounded-xl cursor-pointer text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0 border border-brown/15">
                        <Upload className="w-3.5 h-3.5 text-brandgreen" />
                        <span>{uploadingHero ? "Uploading..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadFile(e, setHeroImageUrl, setUploadingHero)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {heroImageUrl && (
                      <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-brown/15 mt-2 bg-cream-100">
                        <Image src={heroImageUrl} alt="Hero Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all shadow-soft"
                  >
                    {saving ? "Menyimpan..." : "Simpan Banner"}
                  </button>
                </div>
              </form>
            )}

            {/* ABOUT FORM */}
            {activeTab === "about" && (
              <form onSubmit={handleSaveAbout} className="space-y-4 text-xs">
                <div className="border-b border-brown/10 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-darkbrown">Tentang Lapak Kami (About Section)</h3>
                  <p className="text-xs text-brown mt-0.5">Kisah dan informasi lapak nyata di Ketapang Kost 2</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Judul Section</label>
                  <input
                    type="text"
                    required
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-bold focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Deskripsi Lengkap</label>
                  <textarea
                    rows={4}
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown focus:outline-none focus:border-brandgreen"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-darkbrown">Foto Lapak / Toko</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aboutImageUrl}
                      onChange={(e) => setAboutImageUrl(e.target.value)}
                      placeholder="URL foto lapak atau upload..."
                      className="flex-1 px-3 py-2 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown text-[11px] focus:outline-none focus:border-brandgreen"
                    />
                    <label className="px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-darkbrown rounded-xl cursor-pointer text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0 border border-brown/15">
                      <Upload className="w-3.5 h-3.5 text-brandgreen" />
                      <span>{uploadingAbout ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFile(e, setAboutImageUrl, setUploadingAbout)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {aboutImageUrl && (
                    <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-brown/15 mt-2 bg-cream-100">
                      <Image src={aboutImageUrl} alt="About Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all shadow-soft"
                  >
                    {saving ? "Menyimpan..." : "Simpan Cerita Lapak"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
