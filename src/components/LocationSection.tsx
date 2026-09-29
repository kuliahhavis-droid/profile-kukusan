"use client";

import React, { useState } from "react";
import { MapPin, Clock, Phone, Navigation, Calendar, ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface LocationData {
  address: string;
  weekdayLocation?: string;
  weekendLocation?: string;
  openingHours: string;
  phone: string;
  mapsEmbedUrl: string;
}

export default function LocationSection({ location }: { location: LocationData }) {
  const [activeTab, setActiveTab] = useState<"weekday" | "weekend">("weekday");

  const weekdayEmbed = "https://maps.google.com/maps?q=H7QG%2B945%2C+Dusun+III%2C+Dukuhwaluh%2C+Kec.+Kembaran%2C+Kabupaten+Banyumas%2C+Jawa+Tengah&t=&z=16&ie=UTF8&iwloc=&output=embed";
  const weekendEmbed = "https://maps.google.com/maps?q=H7QF%2B33X%2C+Dusun+III%2C+Dukuhwaluh%2C+Kec.+Kembaran%2C+Kabupaten+Banyumas%2C+Jawa+Tengah+53182&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const weekdayMapsUrl = "https://www.google.com/maps/search/?api=1&query=H7QG%2B945,+Dusun+III,+Dukuhwaluh,+Kec.+Kembaran,+Kabupaten+Banyumas,+Jawa+Tengah";
  const weekendMapsUrl = "https://www.google.com/maps/search/?api=1&query=H7QF%2B33X,+Dusun+III,+Dukuhwaluh,+Kec.+Kembaran,+Kabupaten+Banyumas,+Jawa+Tengah+53182";

  return (
    <section id="location" className="py-20 bg-cream-50 relative border-b border-brown/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="px-3.5 py-1 rounded-full bg-cream-200 text-brown font-bold text-xs uppercase tracking-wider inline-block">
            Lokasi Kedai
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-darkbrown tracking-tight">
            Lokasi & Jam Operasional
          </h2>
          <p className="text-sm text-brown font-normal">
            Ketapang Kost 2, Dukuhwaluh, Kembaran, Banyumas (Dekat Kampus UMP 1)
          </p>
        </ScrollReveal>

        {/* Schedule Selector Tabs */}
        <ScrollReveal delay={0.1} className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white rounded-xl border border-brown/15 shadow-soft">
            <button
              onClick={() => setActiveTab("weekday")}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === "weekday"
                  ? "bg-darkbrown text-white shadow-soft"
                  : "text-brown hover:text-darkbrown"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekday (Senin - Jumat)</span>
            </button>
            <button
              onClick={() => setActiveTab("weekend")}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === "weekend"
                  ? "bg-darkbrown text-white shadow-soft"
                  : "text-brown hover:text-darkbrown"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekend (Sabtu - Minggu)</span>
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Info Column */}
          <ScrollReveal direction="left" distance={25} delay={0.15} className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {/* Active Location Details */}
              <div className="p-4 bg-white rounded-2xl border border-brown/15 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brandgreen/10 text-brandgreen rounded-xl flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-darkbrown">
                      {activeTab === "weekday" ? "Lapak Weekday (Senin - Jumat)" : "Lapak Weekend (Sabtu - Minggu)"}
                    </h4>
                    <p className="text-xs text-darkbrown font-semibold mt-0.5">Ketapang Kost 2</p>
                    <p className="text-xs text-brown mt-0.5 leading-relaxed">
                      Plus Code: <strong className="text-darkbrown">{activeTab === "weekday" ? "H7QG+945" : "H7QF+33X"}</strong>, Dukuhwaluh
                    </p>
                    <a
                      href={activeTab === "weekday" ? weekdayMapsUrl : weekendMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brandgreen hover:underline mt-2"
                    >
                      <span>Buka Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours Card */}
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-brown/15 shadow-soft">
                <div className="p-2 bg-brandorange/10 text-brandorange rounded-xl flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-darkbrown">Jam Buka</h4>
                  <p className="text-xs text-darkbrown font-semibold mt-0.5">06.00 WIB - Habis</p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-brown/15 shadow-soft">
                <div className="p-2 bg-brandgreen/10 text-brandgreen rounded-xl flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-darkbrown">Pemesanan WhatsApp</h4>
                  <p className="text-xs text-darkbrown font-bold mt-0.5">08818584749</p>
                </div>
              </div>
            </div>

            {/* Direct WA Action */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628818584749"}?text=Halo%20Kukusan%20Gen%20Z!%20%F0%9F%8C%BF%20Saya%20mau%20pesan%20antar%20ke%20area%20Kampus%20UMP%201%20%2F%20Dukuhwaluh.%20Boleh%20minta%20info%20menu%20yang%20ready%20kak%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-brandgreen hover:bg-brandgreen-hover text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-warm transition-all hover:scale-[1.01] active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Chat WA & Pesan Antar</span>
            </a>
          </ScrollReveal>

          {/* Right Map Embed Column */}
          <ScrollReveal direction="right" distance={25} delay={0.2} className="lg:col-span-7 flex flex-col">
            <div className="w-full h-72 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-warm border border-brown/15 bg-white relative">
              <iframe
                src={activeTab === "weekday" ? weekdayEmbed : weekendEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location Kukusan Gen Z"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
