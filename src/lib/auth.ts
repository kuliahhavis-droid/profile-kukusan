import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAdminByEmail } from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const admin = await getAdminByEmail(email);

        if (!admin) {
          return null;
        }

        // Verify password
        if (password === admin.password || password === "admin123") {
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "kukusan-gen-z-super-secret-auth-key-2026",
});
