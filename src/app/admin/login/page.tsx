"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { loginAdminAction } from "@/actions/auth-actions";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAdminAction(formData);

    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Login gagal. Periksa email dan password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 sm:p-8 border border-brown/15 shadow-warm space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo className="justify-center" showTagline={false} />
          <div className="pt-1">
            <h2 className="text-lg font-black text-darkbrown">Masuk Panel Admin</h2>
            <p className="text-xs text-brown">Kelola menu kukusan dan informasi toko</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-darkbrown">Email Admin</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brown/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-semibold focus:outline-none focus:border-brandgreen"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-darkbrown">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brown/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-cream-50 rounded-xl border border-brown/15 text-darkbrown font-semibold focus:outline-none focus:border-brandgreen"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brandgreen text-white font-bold rounded-xl hover:bg-brandgreen-hover transition-all flex items-center justify-center gap-1.5 shadow-soft active:scale-95"
            >
              <span>{loading ? "Memproses..." : "Masuk"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

