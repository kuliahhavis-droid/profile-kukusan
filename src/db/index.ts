import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql as drizzleSql } from "drizzle-orm";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT, DEFAULT_ADMIN } from "./mock-data";
import { Product, Category, Promo, User } from "./schema";

// Initialize Neon Client safely
const connectionString = process.env.DATABASE_URL;
const isNeonConnected = Boolean(connectionString && !connectionString.includes("sample_url"));

export const sql = isNeonConnected ? neon(connectionString!) : null;
export const db = isNeonConnected && sql ? drizzle(sql, { schema }) : null;

// ============================================================
// In-memory fallback store (only for local dev without DATABASE_URL)
// ============================================================
interface KukusanGlobalStore {
  memoryProducts: Product[];
  memoryCategories: Category[];
  memorySiteContent: any;
  memoryUsers: User[];
}

const globalForKukusan = globalThis as unknown as {
  __kukusan_store__?: KukusanGlobalStore;
};

if (!globalForKukusan.__kukusan_store__) {
  globalForKukusan.__kukusan_store__ = {
    memoryProducts: [...INITIAL_PRODUCTS],
    memoryCategories: [...INITIAL_CATEGORIES],
    memorySiteContent: JSON.parse(JSON.stringify(INITIAL_SITE_CONTENT)),
    memoryUsers: [DEFAULT_ADMIN],
  };
}

const store = globalForKukusan.__kukusan_store__;

// ============================================================
// PRODUCTS - DB-first with memory fallback
// ============================================================

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  let result: Product[];

  if (db) {
    try {
      result = await db.select().from(schema.products);
    } catch (e) {
      console.warn("DB getProducts error, using memory fallback:", e);
      result = store.memoryProducts;
    }
  } else {
    result = store.memoryProducts;
  }

  if (options?.activeOnly !== false) {
    result = result.filter((p) => p.isActive);
  }

  if (options?.featuredOnly) {
    result = result.filter((p) => p.isFeatured);
  }

  if (options?.categoryId && options.categoryId !== "all") {
    result = result.filter((p) => p.categoryId === options.categoryId);
  }

  if (options?.search) {
    const query = options.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query))
    );
  }

  return [...result].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (db) {
    try {
      const rows = await db.select().from(schema.products).where(eq(schema.products.id, id));
      return rows[0] || null;
    } catch (e) {
      console.warn("DB getProductById error:", e);
    }
  }
  const prod = store.memoryProducts.find((p) => p.id === id);
  return prod || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (db) {
    try {
      const rows = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
      return rows[0] || null;
    } catch (e) {
      console.warn("DB getProductBySlug error:", e);
    }
  }
  const prod = store.memoryProducts.find((p) => p.slug === slug);
  return prod || null;
}

export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (db) {
    try {
      await db.insert(schema.products).values(newProduct);
    } catch (e) {
      console.warn("DB createProduct error:", e);
    }
  }

  store.memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (db) {
    try {
      const updateData: any = { ...updates };
      updateData.updatedAt = new Date();
      await db.update(schema.products).set(updateData).where(eq(schema.products.id, id));
      // Read back updated row from DB
      const rows = await db.select().from(schema.products).where(eq(schema.products.id, id));
      if (rows[0]) {
        // Also update local memory for consistency
        const idx = store.memoryProducts.findIndex((p) => p.id === id);
        if (idx !== -1) store.memoryProducts[idx] = rows[0];
        return rows[0];
      }
    } catch (e) {
      console.warn("DB updateProduct error:", e);
    }
  }

  // Memory fallback
  const index = store.memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.memoryProducts[index] = {
    ...store.memoryProducts[index],
    ...updates,
    updatedAt: new Date(),
  };

  return store.memoryProducts[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  let deleted = false;

  if (db) {
    try {
      const result = await db.delete(schema.products).where(eq(schema.products.id, id));
      deleted = true;
    } catch (e) {
      console.warn("DB deleteProduct error:", e);
    }
  }

  const initialLength = store.memoryProducts.length;
  store.memoryProducts = store.memoryProducts.filter((p) => p.id !== id);
  if (!deleted) {
    deleted = store.memoryProducts.length < initialLength;
  }
  return deleted;
}

export async function toggleProductStatus(id: string): Promise<Product | null> {
  const prod = await getProductById(id);
  if (!prod) return null;
  return updateProduct(id, { isActive: !prod.isActive });
}

export async function toggleProductFeatured(id: string): Promise<Product | null> {
  const prod = await getProductById(id);
  if (!prod) return null;
  return updateProduct(id, { isFeatured: !prod.isFeatured });
}

// ============================================================
// CATEGORIES - DB-first with memory fallback
// ============================================================

export async function getCategories(): Promise<Category[]> {
  if (db) {
    try {
      const rows = await db.select().from(schema.categories);
      if (rows.length > 0) return [...rows].sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (e) {
      console.warn("DB getCategories error:", e);
    }
  }
  return [...store.memoryCategories].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createCategory(catData: Omit<Category, "id">): Promise<Category> {
  const newCat: Category = {
    ...catData,
    id: `cat-${Date.now()}`,
  };

  if (db) {
    try {
      await db.insert(schema.categories).values(newCat);
    } catch (e) {
      console.warn("DB createCategory error:", e);
    }
  }

  store.memoryCategories.push(newCat);
  return newCat;
}

// ============================================================
// SITE CONTENT - DB-first with memory fallback
// This is the critical fix for the CMS CRUD issue on Vercel
// ============================================================

export async function getSiteContent(key?: string): Promise<any> {
  if (db) {
    try {
      if (key) {
        // Fetch specific section from DB
        const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, key));
        if (rows.length > 0) {
          return rows[0].data;
        }
        // Fall back to memory if not in DB
        return (store.memorySiteContent as any)[key] || null;
      }

      // Fetch all sections from DB
      const rows = await db.select().from(schema.siteContent);
      if (rows.length > 0) {
        const content: Record<string, any> = {};
        for (const row of rows) {
          content[row.key] = row.data;
        }
        // Merge with initial content for any sections not yet in DB
        return { ...store.memorySiteContent, ...content };
      }
    } catch (e) {
      console.warn("DB getSiteContent error, using memory fallback:", e);
    }
  }

  // Memory-only fallback
  if (key) {
    return (store.memorySiteContent as any)[key] || null;
  }
  return store.memorySiteContent;
}

export async function updateSiteContent(sectionKey: string, data: any): Promise<any> {
  // Merge with existing data
  const existingData = await getSiteContent(sectionKey);
  const mergedData = existingData ? { ...existingData, ...data } : data;

  // Always update memory store for current instance consistency
  (store.memorySiteContent as any)[sectionKey] = mergedData;

  // Persist to DB (primary storage)
  if (db) {
    try {
      await db
        .insert(schema.siteContent)
        .values({
          id: `content-${sectionKey}`,
          key: sectionKey,
          data: mergedData,
        })
        .onConflictDoUpdate({
          target: schema.siteContent.key,
          set: {
            data: mergedData,
          },
        });
      console.log(`✅ DB: Updated site_content[${sectionKey}]`);
    } catch (e) {
      console.error(`❌ DB updateSiteContent error for [${sectionKey}]:`, e);
      throw new Error(`Gagal menyimpan ke database: ${(e as any).message}`);
    }
  }

  return mergedData;
}

// ============================================================
// USERS
// ============================================================

export async function getAdminByEmail(email: string): Promise<User | null> {
  if (db) {
    try {
      const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
      if (rows[0]) return rows[0];
    } catch (e) {
      console.warn("DB getAdminByEmail error:", e);
    }
  }
  const user = store.memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}
