import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/auth-check";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/avif",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Admin Authorization
    try {
      await requireAdminAuth();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login sebagai admin terlebih dahulu." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan" }, { status: 400 });
    }

    // 2. Validate File MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Hanya gambar (JPG, PNG, WebP, GIF, AVIF) yang diizinkan." },
        { status: 400 }
      );
    }

    // 3. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await uploadToCloudinary(buffer);

    return NextResponse.json({ url: imageUrl, success: true });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengupload gambar" },
      { status: 500 }
    );
  }
}

