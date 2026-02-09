import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CareerRoadmapView } from "@/components/dashboard/CareerRoadmapView";

export default async function CareerRoadmapPage({ params }: { params: Promise<{ referenceId: string }> }) {
    const session = await getServerSession(authOptions);
    const { referenceId } = await params;

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#0B0F19] py-12">
            <CareerRoadmapView userId={session.user.id} careerReferenceId={referenceId} />
        </main>
    );
}
