import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FinancialPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <FinancialDashboard />
        </div>
    );
}
