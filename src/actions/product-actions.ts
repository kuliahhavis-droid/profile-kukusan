"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  toggleProductStatus as dbToggleProductStatus,
  toggleProductFeatured as dbToggleProductFeatured,
  createCategory as dbCreateCategory,
} from "@/db";
import { z } from "zod";
import { requireAdminAuth } from "@/lib/auth-check";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(100, "Nama produk maksimal 100 karakter"),
  slug: z.string().optional(),
  description: z.string().optional().default("Varian kukusan hangat alami, lezat, dan sehat."),
  price: z.coerce.number().min(500, "Harga minimal Rp 500").max(1000000, "Harga tidak wajar"),
  originalPrice: z.coerce.number().optional().nullable(),
  categoryId: z.string().default("cat-1"),
  imageUrl: z.string().default("/menu/pisang.jpg"),
  badge: z.string().max(50).optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().default(0),
});

export async function createProductAction(formData: FormData) {
  try {
    await requireAdminAuth();
    const rawData = {
      name: formData.get("name") || "",
      description: formData.get("description") || "Varian kukusan hangat alami, lezat, dan sehat.",
      price: formData.get("price") || 2000,
      originalPrice: formData.get("originalPrice") || null,
      categoryId: formData.get("categoryId") || "cat-1",
      imageUrl: formData.get("imageUrl") || "/menu/pisang.jpg",
      badge: formData.get("badge") || null,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
      displayOrder: Number(formData.get("displayOrder")) || 0,
    };

    const validated = productSchema.parse(rawData);

    const slug =
      (validated.name || "menu")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const newProduct = await dbCreateProduct({
      name: validated.name,
      slug,
      description: validated.description || "Varian kukusan hangat alami, lezat, dan sehat.",
      price: validated.price,
      originalPrice: validated.originalPrice || null,
      categoryId: validated.categoryId || "cat-1",
      imageUrl: validated.imageUrl || "/menu/pisang.jpg",
      badge: validated.badge || null,
      isActive: validated.isActive,
      isFeatured: validated.isFeatured,
      displayOrder: validated.displayOrder || 0,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error("createProductAction error:", error);
    return { success: false, error: error.message || "Gagal menambah produk" };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    await requireAdminAuth();
    const rawData = {
      name: formData.get("name") || "",
      description: formData.get("description") || "Varian kukusan hangat alami, lezat, dan sehat.",
      price: formData.get("price") || 2000,
      originalPrice: formData.get("originalPrice") || null,
      categoryId: formData.get("categoryId") || "cat-1",
      imageUrl: formData.get("imageUrl") || "/menu/pisang.jpg",
      badge: formData.get("badge") || null,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "true" || formData.get("isFeatured") === "on",
      displayOrder: Number(formData.get("displayOrder")) || 0,
    };

    const validated = productSchema.parse(rawData);

    const updated = await dbUpdateProduct(id, {
      name: validated.name,
      description: validated.description || "Varian kukusan hangat alami, lezat, dan sehat.",
      price: validated.price,
      originalPrice: validated.originalPrice || null,
      categoryId: validated.categoryId || "cat-1",
      imageUrl: validated.imageUrl || "/menu/pisang.jpg",
      badge: validated.badge || null,
      isActive: validated.isActive,
      isFeatured: validated.isFeatured,
      displayOrder: validated.displayOrder || 0,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, product: updated };
  } catch (error: any) {
    console.error("updateProductAction error:", error);
    return { success: false, error: error.message || "Gagal memperbarui produk" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await requireAdminAuth();
    const res = await dbDeleteProduct(id);
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleProductStatusAction(id: string) {
  try {
    await requireAdminAuth();
    const updated = await dbToggleProductStatus(id);
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, isActive: updated?.isActive };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleProductFeaturedAction(id: string) {
  try {
    await requireAdminAuth();
    const updated = await dbToggleProductFeatured(id);
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, isFeatured: updated?.isFeatured };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategoryAction(name: string, description?: string) {
  try {
    await requireAdminAuth();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCat = await dbCreateCategory({
      name,
      slug,
      description: description || "",
      icon: "Utensils",
      displayOrder: 10,
      isActive: true,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, category: newCat };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

