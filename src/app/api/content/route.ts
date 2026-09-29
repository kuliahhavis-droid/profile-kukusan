import { NextRequest, NextResponse } from "next/server";
import { getSiteContent } from "@/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key") || undefined;
    const content = await getSiteContent(key);
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
  }
}
