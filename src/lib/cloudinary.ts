import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "kukusangenz",
  api_key: process.env.CLOUDINARY_API_KEY || "123456789",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sample_secret",
});

export async function uploadToCloudinary(fileBuffer: Buffer, folder: string = "kukusan-genz"): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  // If Cloudinary credentials aren't configured yet, fallback to data URL string
  if (!cloudName || cloudName === "your_cloud_name" || !apiKey) {
    const base64 = fileBuffer.toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            // Graceful fallback to data URL on Cloudinary API failure
            const base64 = fileBuffer.toString("base64");
            resolve(`data:image/jpeg;base64,${base64}`);
          } else {
            resolve(result?.secure_url || "");
          }
        }
      )
      .end(fileBuffer);
  });
}
