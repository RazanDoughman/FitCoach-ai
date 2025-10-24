import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";
import { verifyPassword } from "@/utils/hash";

// ✅ Define and export your authOptions properly
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Get user from Supabase
        const { data: user, error } = await supabase
          .from("User")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("No user found with this email");
        }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
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
  // @ts-expect-error NextAuth runtime option
  trustHost: true,

  callbacks: {
    async redirect({
      url,
      baseUrl,
    }: {
      url: string;
      baseUrl: string;
    }): Promise<string> {
      try {
        const safeUrl = new URL(url, baseUrl);

        // prevent infinite loop between login/signin
        if (
          safeUrl.pathname.includes("/login") ||
          safeUrl.pathname.includes("/signin")
        ) {
          return baseUrl;
        }

        if (safeUrl.origin === baseUrl) return safeUrl.href;
      } catch {
        // fallback
      }

      return baseUrl;
    },
  },
};

// ✅ Create the NextAuth handler using the same options
const handler = NextAuth(authOptions);

// ✅ Export both for app routes and reusability
export { handler as GET, handler as POST };
