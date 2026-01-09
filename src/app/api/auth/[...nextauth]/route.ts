import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Login de Prueba",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // MOCK LOGIN FOR DEVELOPMENT
                // Accept any credentials for the demo
                const role = credentials?.email.includes("admin") ? "ADMIN" : "STUDENT";
                const isStudent = role === "STUDENT";

                // If no email provided (empty credentials), default to student
                const email = credentials?.email || "alumno@aurora.com";

                return {
                    id: isStudent ? "student-1" : "admin-1",
                    name: isStudent ? "Alumno Demo" : "Admin User",
                    email: email,
                    image: `https://ui-avatars.com/api/?name=${isStudent ? "Alumno+Demo" : "Admin+User"}&background=random`,
                    role: role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
            }
            return session;
        },
    },
    theme: {
        colorScheme: "dark",
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
    // @ts-ignore
    trustHost: true,
};

// Conditionally append Google Provider if keys are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    authOptions.providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Explicitly map role if needed, though Adapter handles creation.
            // We can use profile callback to default role if not set by adapter default
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "STUDENT", // Default role for new users
                }
            },
        })
    );
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
