import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
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
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    theme: {
        colorScheme: "dark",
    },
    debug: true, // Force debug logs to help diagnose production issues
    secret: process.env.NEXTAUTH_SECRET, // Explicitly load secret
    // @ts-ignore - trustHost is valid for NextAuth header handling behind proxies but missing in some type definitions
    trustHost: true, // Crucial for Render/Vercel deployments behind proxies
};

// Conditionally append Google Provider if keys are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    authOptions.providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
