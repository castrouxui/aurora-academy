import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Login de Prueba",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // MOCK LOGIN FOR DEVELOPMENT
                return {
                    id: "mock-user-1",
                    name: "Estudiante Demo",
                    email: "demo@aurora.com",
                    image: "https://ui-avatars.com/api/?name=Estudiante+Demo&background=random"
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            return session;
        },
    },
    theme: {
        colorScheme: "dark",
    },
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
