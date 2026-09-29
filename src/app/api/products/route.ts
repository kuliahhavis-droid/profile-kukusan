import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const products = await getProducts({ categoryId, search, activeOnly });
    return NextResponse.json({ products, count: products.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}
