import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    type UserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: UserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    }
}
