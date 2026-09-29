import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import AdvantagesSection from "@/components/AdvantagesSection";
import AboutUsSection from "@/components/AboutUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import { getProducts, getCategories, getSiteContent } from "@/db";

export const revalidate = 0; // Dynamic rendering from database

export default async function HomePage() {
  // Fetch dynamic data from database layer
  const products = await getProducts();
  const categories = await getCategories();
  const siteContent = await getSiteContent();

  const heroData = siteContent?.hero || {
    title: "Kukusan Hangat Alami, Rasa Nikmat Setiap Hari.",
    subtitle: "Aneka kukusan sehat tanpa minyak: Pisang, Ubi Oren, Ubi Ungu, Kentang, Singkong, Talas, & Jagung. Buka Jam 06.00 - Habis. Serba Rp 2.000/pcs & Promo 5K Dapet 3 Pcs! Siap antar daerah Kampus UMP 1.",
    badgeText: "🛵 Siap Antar Kampus UMP 1 | Buka Jam 06.00 - Habis",
    ctaPrimaryText: "Order via WhatsApp",
    ctaSecondaryText: "Lihat Menu",
    heroImageUrl: "/banners/header-banner.jpg",
  };

  const aboutData = siteContent?.about || {
    title: "Tentang Kukusan Gen Z",
    subtitle: "Lapak Nyata di Ketapang Kost 2 Dukuhwaluh",
    description: "Kukusan Gen Z adalah usaha kuliner kukusan murni yang hadir langsung di depan gerbang Ketapang Kost 2, Dukuhwaluh, Kembaran, Banyumas. Kami menyajikan aneka kukusan sehat serba Rp 2.000 (Pisang, Ubi Oren, Ubi Ungu, Kentang, Singkong, Talas, Jagung) yang dikukus hangat setiap hari mulai jam 6 pagi. Menerima pesanan porsi besar & kecil serta siap antar ke area Kampus UMP 1 dan kos-kosan sekitarnya!",
    bulletPoints: [
      "Lapak Stand Nyata di Depan Ketapang Kost 2 Dukuhwaluh",
      "Buka Setiap Pagi Mulai Jam 06.00 WIB - Sampai Habis",
      "Aneka Kukusan Sehat Serba 2.000 & Paket Hemat 5K Dapet 3 Pcs",
      "Menerima Pesanan Porsi Besar & Kecil (Siap Antar Kampus UMP 1)",
    ],
    imageUrl: "/banners/about-banner.jpg",
  };

  const advantagesData = siteContent?.advantages || [];
  const testimonialsData = siteContent?.testimonials || [];
  const identityData = siteContent?.identity || {};
  const heroWithIdentity = { ...heroData, whatsappNumber: identityData.whatsappNumber };
  const locationData = siteContent?.location || {
    address: "Ketapang Kost 2, Dusun III, Dukuhwaluh, Kec. Kembaran, Kabupaten Banyumas, Jawa Tengah (Buka Pagi 06.00 - Habis | Siap Antar UMP 1)",
    weekdayLocation: "H7QG+945, Dusun III, Dukuhwaluh, Kec. Kembaran, Kabupaten Banyumas, Jawa Tengah (di depan Lare Cost_Food Corner)",
    weekendLocation: "H7QF+33X, Dusun III, Dukuhwaluh, Kec. Kembaran, Kabupaten Banyumas, Jawa Tengah 53182",
    openingHours: "06.00 WIB - Sampai Habis",
    phone: "08818584749",
    mapsEmbedUrl: "https://maps.google.com/maps?q=H7QG%2B945%2C+Dusun+III%2C+Dukuhwaluh%2C+Kec.+Kembaran%2C+Kabupaten+Banyumas%2C+Jawa+Tengah&t=&z=15&ie=UTF8&iwloc=&output=embed",
  };
  const locationWithIdentity = { ...locationData, whatsappNumber: identityData.whatsappNumber };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar identity={identityData} />

      <main className="flex-1">
        <HeroSection hero={heroWithIdentity} />
        <ProductCatalog initialProducts={products} categories={categories} />
        <AdvantagesSection advantages={advantagesData} />
        <AboutUsSection about={aboutData} />
        <TestimonialsSection testimonials={testimonialsData} />
        <LocationSection location={locationWithIdentity} />
      </main>

      <Footer />
    </div>
  );
}
