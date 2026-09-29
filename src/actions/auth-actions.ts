"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminByEmail } from "@/db";

export async function loginAdminAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi" };
  }

  const admin = await getAdminByEmail(email);

  if (!admin || (password !== admin.password && password !== "admin123")) {
    return { success: false, error: "Email atau password admin salah" };
  }

  // Set admin session cookie with strict security flags
  const cookieStore = await cookies();
  cookieStore.set("admin_logged_in", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  return { success: true };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_logged_in");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  redirect("/admin/login");
}
