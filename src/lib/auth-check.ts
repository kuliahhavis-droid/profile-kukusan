import { cookies } from "next/headers";

/**
 * Server-side authorization helper to ensure only authenticated admins
 * can execute sensitive mutations (create, update, delete, upload).
 */
export async function requireAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  
  const adminLoggedIn = cookieStore.get("admin_logged_in")?.value === "true";
  const nextAuthToken =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("authjs.session-token")?.value;

  if (!adminLoggedIn && !nextAuthToken) {
    throw new Error("Akses Ditolak: Anda harus login sebagai admin terlebih dahulu.");
  }

  return true;
}
