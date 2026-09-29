import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT, DEFAULT_ADMIN } from "./mock-data";
import { Product, Category, Promo, User } from "./schema";

// Initialize Neon Client safely
const connectionString = process.env.DATABASE_URL;
const isNeonConnected = Boolean(connectionString && !connectionString.includes("sample_url"));

export const sql = isNeonConnected ? neon(connectionString!) : null;
export const db = isNeonConnected && sql ? drizzle(sql, { schema }) : null;

// Shared Global Store across Server Actions, Route Handlers, and Server Components
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

// Data Access Layer with Shared Persistence

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  let result = store.memoryProducts;

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

  // Sort by display order or newest first
  return [...result].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProductById(id: string): Promise<Product | null> {
  const prod = store.memoryProducts.find((p) => p.id === id);
  return prod || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
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

  store.memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
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
  const initialLength = store.memoryProducts.length;
  store.memoryProducts = store.memoryProducts.filter((p) => p.id !== id);
  return store.memoryProducts.length < initialLength;
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

export async function getCategories(): Promise<Category[]> {
  return [...store.memoryCategories].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createCategory(catData: Omit<Category, "id">): Promise<Category> {
  const newCat: Category = {
    ...catData,
    id: `cat-${Date.now()}`,
  };
  store.memoryCategories.push(newCat);
  return newCat;
}

export async function getSiteContent(key?: string): Promise<any> {
  if (key) {
    return (store.memorySiteContent as any)[key] || null;
  }
  return store.memorySiteContent;
}

export async function updateSiteContent(sectionKey: string, data: any): Promise<any> {
  (store.memorySiteContent as any)[sectionKey] = {
    ...(store.memorySiteContent as any)[sectionKey],
    ...data,
  };
  return (store.memorySiteContent as any)[sectionKey];
}

export async function getAdminByEmail(email: string): Promise<User | null> {
  const user = store.memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}
