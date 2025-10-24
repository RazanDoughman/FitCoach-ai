import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabaseClient"
import { verifyPassword } from "@/utils/hash"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        // Get user from Supabase
        const { data: user, error } = await supabase
          .from("User")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (error || !user) {
          throw new Error("No user found with this email")
        }

        const isValid = await verifyPassword(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
  async redirect({ url, baseUrl }) {
    try {
      const safeUrl = new URL(url, baseUrl);
      // Prevent infinite redirects to /login or /api/auth/signin
      if (safeUrl.pathname.includes("/login") || safeUrl.pathname.includes("/signin")) {
        return baseUrl;
      }
      if (safeUrl.origin === baseUrl) return safeUrl.href;
    } catch {
      // fallback
    }
    return baseUrl;
  },
},
})

export { handler as GET, handler as POST }
