import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").default("Utensils"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in IDR (e.g., 15000)
  originalPrice: integer("original_price"), // for promo cross-out pricing
  categoryId: text("category_id").notNull(),
  imageUrl: text("image_url").notNull(),
  badge: text("badge"), // e.g. "Best Seller", "Healthy Choice", "Favorit Gen Z"
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteContent = pgTable("site_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'hero', 'identity', 'about', 'advantages', 'promos', 'testimonials', 'contact'
  data: jsonb("data").notNull(), // Structured content object
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promos = pgTable("promos", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  discount: text("discount").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  validUntil: text("valid_until"),
});

// TypeScript interfaces derived from Schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type SiteContent = typeof siteContent.$inferSelect;
export type NewSiteContent = typeof siteContent.$inferInsert;

export type Promo = typeof promos.$inferSelect;
export type NewPromo = typeof promos.$inferInsert;
