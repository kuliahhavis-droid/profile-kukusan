"use server";

import { revalidatePath } from "next/cache";
import { updateSiteContent as dbUpdateSiteContent } from "@/db";
import { requireAdminAuth } from "@/lib/auth-check";

export async function updateHeroContentAction(data: {
  title: string;
  subtitle: string;
  badgeText: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  heroImageUrl: string;
}) {
  try {
    await requireAdminAuth();
    const updated = await dbUpdateSiteContent("hero", data);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengupdate Hero content" };
  }
}

export async function updateIdentityContentAction(data: {
  brandName: string;
  tagline: string;
  logoText: string;
  whatsappNumber: string;
}) {
  try {
    await requireAdminAuth();
    const updated = await dbUpdateSiteContent("identity", data);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengupdate Identitas brand" };
  }
}

export async function updateAboutContentAction(data: {
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  imageUrl: string;
}) {
  try {
    await requireAdminAuth();
    const updated = await dbUpdateSiteContent("about", data);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengupdate tentang kami" };
  }
}

export async function updateLocationContentAction(data: {
  address: string;
  openingHours: string;
  phone: string;
  mapsEmbedUrl: string;
}) {
  try {
    await requireAdminAuth();
    const updated = await dbUpdateSiteContent("location", data);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengupdate lokasi" };
  }
}

