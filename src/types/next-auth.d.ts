import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            companyId?: string;
            isCompanyAdmin?: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string;
        companyId?: string;
        isCompanyAdmin?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        companyId?: string;
        isCompanyAdmin?: boolean;
    }
}
