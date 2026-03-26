import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendGeneralWelcomeEmail } from "@/lib/email";

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
                isRegister: { label: "Register", type: "hidden" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas");
                }

                const { email, password, isRegister } = credentials;

                const bcrypt = await import("bcryptjs");

                if (isRegister === "true") {
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (existingUser && !existingUser.password) {
                        // Usuario de Google sin contraseña — exigir verificación por email antes de asociarle una
                        const verifiedToken = await prisma.verificationToken.findFirst({
                            where: {
                                identifier: `checkout-verified:${email}`,
                                expires: { gt: new Date() },
                            },
                        });
                        if (!verifiedToken) {
                            throw new Error("Verificación requerida");
                        }
                        // Token de un solo uso
                        await prisma.verificationToken.delete({
                            where: { identifier_token: { identifier: verifiedToken.identifier, token: verifiedToken.token } },
                        });
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const updatedUser = await prisma.user.update({
                            where: { email },
                            data: { password: hashedPassword },
                        });
                        return {
                            id: updatedUser.id,
                            name: updatedUser.name,
                            email: updatedUser.email,
                            image: updatedUser.image,
                            role: updatedUser.role as any,
                        };
                    }

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

                    // Send General Welcome Email
                    // Note: This is async but we don't await to not block the login process,
                    // though for emails it's usually better to ensure they sent or at least handled.
                    // Given the context of "instant access", we want it fast.
                    sendGeneralWelcomeEmail(newUser.email!, newUser.name).catch(err =>
                        console.error("[AUTH_WELCOME_EMAIL_ERROR]", err)
                    );

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
                    token.role = user.role;

                    // Override role to ADMIN if email is in ADMIN_EMAILS env var
                    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) ?? [];
                    if (user.email && adminEmails.includes(user.email)) {
                        token.role = "ADMIN" as any;
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
    pages: {
        signIn: "/",
        error: "/",
    },
    theme: {
        colorScheme: "dark",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

// Conditionally append Google Provider if keys are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    authOptions.providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "ESTUDIANTE", // Default role for new users
                }
            },
        })
    );
}
