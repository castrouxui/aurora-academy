import { AuthOptions } from "next-auth";
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

                // EMERGENCY BYPASS: Access for admin@aurora.com
                if (email === "admin@aurora.com" && password === "admin123") {
                    console.log("[AUTH] Emergency bypass triggered for admin@aurora.com");
                    return {
                        id: "emergency-admin",
                        name: "Admin Aurora",
                        email: "admin@aurora.com",
                        role: "ADMIN" as any,
                        image: "https://ui-avatars.com/api/?name=Admin+Aurora&background=0D8ABC&color=fff"
                    };
                }

                const bcrypt = await import("bcryptjs");

                if (isRegister === "true") {
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (existingUser) {
                        throw new Error("El usuario ya existe");
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            name: email.split("@")[0],
                            image: `https://ui-avatars.com/api/?name=${email}&background=random`,
                            role: "ESTUDIANTE",
                            password: hashedPassword
                        }
                    });

                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        image: newUser.image,
                        role: newUser.role as any,
                    };
                } else {
                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (!user || !user.password) {
                        throw new Error("Usuario no encontrado o contraseña incorrecta");
                    }

                    const isValid = await bcrypt.compare(password, user.password);

                    if (!isValid) {
                        throw new Error("Contraseña incorrecta");
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role as any,
                    };
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            try {
                if (user) {
                    token.id = user.id;
                    // EMERGENCY HOTFIX: Force Admin Role for specific emails
                    const adminEmails = ["aurora@admin.com", "admin@aurora.com"];
                    if (user.email && adminEmails.includes(user.email)) {
                        token.role = "ADMIN";
                    } else {
                        token.role = user.role;
                    }

                    token.companyId = user.companyId;
                    token.isCompanyAdmin = user.isCompanyAdmin;
                    token.telegram = (user as any).telegram;
                    token.telegramVerified = (user as any).telegramVerified;
                    token.notificationPrefs = (user as any).notificationPrefs;
                }

                if (trigger === "update" && session) {
                    return { ...token, ...session };
                }

                return token;
            } catch (error) {
                console.error("[NEXT-AUTH] JWT Callback Error:", error);
                return token;
            }
        },
        async session({ session, token }) {
            try {
                if (token && session.user) {
                    session.user.id = token.id;
                    session.user.role = token.role;
                    session.user.companyId = token.companyId;
                    session.user.isCompanyAdmin = token.isCompanyAdmin;
                    session.user.telegram = token.telegram;
                    session.user.telegramVerified = token.telegramVerified;
                    session.user.notificationPrefs = token.notificationPrefs;
                }
                return session;
            } catch (error) {
                console.error("[NEXT-AUTH] Session Callback Error:", error);
                return session;
            }
        },
    },
    theme: {
        colorScheme: "dark",
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
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
