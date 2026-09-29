import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONTENT, DEFAULT_ADMIN } from "./mock-data";
import { getProducts, getCategories, getSiteContent } from "./index";

async function main() {
  console.log("🌱 Starting seeding process for Kukusan Gen Z...");

  try {
    const products = await getProducts();
    const categories = await getCategories();
    const siteContent = await getSiteContent();

    console.log(`✅ Seeded ${categories.length} categories.`);
    console.log(`✅ Seeded ${products.length} products (Jagung, Ubi Ungu, Ubi Oren, Kentang, Talas, Pisang, Singkong, Combo Mix Platter).`);
    console.log(`✅ Seeded site CMS content (Hero, Identity, About Us, Advantages, Testimonials, Location).`);
    console.log(`✅ Admin Account initialized: ${DEFAULT_ADMIN.email}`);
    console.log("🚀 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
