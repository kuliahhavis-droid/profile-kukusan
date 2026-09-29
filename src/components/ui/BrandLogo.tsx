import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "default" | "light";
  brandName?: string;
  tagline?: string;
}

export default function BrandLogo({
  className = "",
  showTagline = false,
  variant = "default",
  brandName = "Kukusan Gen Z",
  tagline = "Kukusan Sehat, Rasa Hebat",
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-brown/15 shadow-soft group-hover:scale-105 transition-transform duration-200 bg-white flex-shrink-0">
        <Image
          src="/logo.jpg"
          alt="Logo Kukusan Gen Z"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <div
          className={`flex items-center gap-1.5 font-black text-lg sm:text-xl tracking-tight leading-tight ${
            isLight ? "text-white" : "text-darkbrown"
          }`}
        >
          <span>{brandName}</span>
        </div>
        {showTagline && (
          <span
            className={`text-[11px] font-semibold tracking-wide ${
              isLight ? "text-cream-200" : "text-brown"
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </Link>
  );
}




