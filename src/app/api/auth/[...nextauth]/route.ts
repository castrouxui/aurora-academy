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
            name: "Credenciales",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                isRegister: { label: "Register", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas");
                }

                const { email, password, isRegister } = credentials;

                // --- REGISTRATION LOGIC ---
                if (isRegister === "true") {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (existingUser) {
                        throw new Error("El usuario ya existe");
                    }

                    // Hash password
                    // @ts-ignore
                    const bcrypt = await import("bcryptjs");
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Create new user
                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            name: email.split("@")[0], // Default name from email part
                            image: `https://ui-avatars.com/api/?name=${email}&background=random`,
                            role: "ESTUDIANTE"
                            // Password is NOT stored in User model in schema provided (Account model usually handles oauth, but for credentials we need password field)
                            // WAIT. The schema doesn't have a 'password' field on User model?!
                            // Let me check schema again.
                        }
                    });

                    // CRITICAL: Schema check shows User model has NO password field. Account is for OAuth.
                    // We need to store password somewhere. 
                    // Usually we add `password String?` to User model.
                    // Or we create a Credential/Account record.
                    // Given I cannot edit schema right now easily without migration flow (which requires DB access/reset), 
                    // I will check if I can use the 'Account' table to store a "credentials" provider entry with the hash as access_token or similar hack?
                    // NO. I MUST add password to schema to do this right. 
                    // OR I check if I missed the password field in my view_file of schema.

                    // Actually, if I look at previous view_file of schema:
                    // model User { ... email, name, image, role, accounts, sessions ... } -> NO PASSWORD field.

                    // Options:
                    // 1. Add `password` column to User table (Best practice). I can run `prisma db push` easily as I am in dev mode.
                    // 2. Mock it again? No, user wants real flow.

                    // Strategy:
                    // I will first attempt to find a User, if not found, I will THROW error saying "Schema missing password".
                    // Actually, I will pause this Edit to Add password field to Schema FIRST.
                    throw new Error("Schema update required");
                } else {
                    // --- LOGIN LOGIC ---
                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (!user || !(user as any).password) {
                        throw new Error("Usuario no encontrado o contraseña incorrecta");
                    }

                    // @ts-ignore
                    const bcrypt = await import("bcryptjs");
                    const isValid = await bcrypt.compare(password, (user as any).password);

                    if (!isValid) {
                        throw new Error("Contraseña incorrecta");
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role as "ADMIN" | "INSTRUCTOR" | "ESTUDIANTE",
                    };
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                // @ts-ignore
                token.companyId = user.companyId;
                // @ts-ignore
                token.isCompanyAdmin = user.isCompanyAdmin;
                // @ts-ignore
                token.telegram = user.telegram;
                // @ts-ignore
                token.telegramVerified = user.telegramVerified;
            }

            // Update session trigger
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
                session.user.companyId = token.companyId as string | undefined;
                session.user.isCompanyAdmin = token.isCompanyAdmin as boolean | undefined;
                session.user.telegram = token.telegram as string | undefined;
                session.user.telegramVerified = token.telegramVerified as boolean | undefined;
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
                    role: "ESTUDIANTE", // Default role for new users
                }
            },
            allowDangerousEmailAccountLinking: true,
        })
    );
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
