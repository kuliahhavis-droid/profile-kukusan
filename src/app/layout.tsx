import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kukusan-genz.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kukusan Gen Z - Aneka Jajanan Kukus Sehat Murah UMP Dukuhwaluh",
    template: "%s | Kukusan Gen Z",
  },
  description:
    "Jajanan kukus sehat & alami serba Rp 2.000: Pisang, Ubi Oren, Ubi Ungu, Singkong, Talas, & Jagung Manis. Promo Paket Hemat 5K Dapet 3 Pcs. Siap antar area Kampus UMP 1 Dukuhwaluh, Ketapang Kost 2 Banyumas.",
  keywords: [
    "kukusan gen z",
    "jajanan sehat banyumas",
    "pisang kukus purwokerto",
    "ubi ungu kukus dukuhwaluh",
    "singkong kukus ump",
    "cemilan sehat mahasiswa ump",
    "jajanan murah ketapang kost",
    "kuliner dukuhwaluh kembaran",
    "kuliner sehat purwokerto",
  ],
  authors: [{ name: "Kukusan Gen Z" }],
  creator: "Kukusan Gen Z",
  publisher: "Kukusan Gen Z",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "Kukusan Gen Z - Kukusan Sehat, Rasa Hebat",
    description:
      "Jajanan kukus biasa alami serba Rp 2.000/pcs & Promo 5K Dapet 3 Pcs! Area Kampus UMP 1 & Ketapang Kost 2 Dukuhwaluh.",
    siteName: "Kukusan Gen Z",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Logo Kukusan Gen Z - Kukusan Sehat & Alami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kukusan Gen Z - Kukusan Sehat, Rasa Hebat",
    description:
      "Aneka cemilan kukus sehat serba Rp 2.000 (Pisang, Ubi, Singkong, Talas, Jagung). Siap antar area Kampus UMP 1 Dukuhwaluh.",
    images: ["/logo.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD Structured Data for Google Local Business & Food Establishment
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FastFoodRestaurant",
  name: "Kukusan Gen Z",
  image: `${siteUrl}/logo.jpg`,
  description:
    "Aneka jajanan kukusan sehat & alami: Pisang, Ubi Oren, Ubi Ungu, Singkong, Talas, dan Jagung Manis. Mulai Rp 2.000/pcs.",
  servesCuisine: ["Indonesian", "Healthy Food", "Traditional Snacks"],
  priceRange: "Rp 2.000 - Rp 15.000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ketapang Kost 2, Jl. Raden Patah, Dukuhwaluh",
    addressLocality: "Kembaran",
    addressRegion: "Jawa Tengah",
    postalCode: "53182",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -7.4208,
    longitude: 109.2612,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "06:30",
      closes: "21:00",
    },
  ],
  telephone: "+628818584749",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream-100 text-darkbrown antialiased selection:bg-brandorange selection:text-white min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

