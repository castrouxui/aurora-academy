import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0B0F19] pt-8">
            <Container>
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 bg-gray-800" />
                        <Skeleton className="h-4 w-64 bg-gray-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl bg-gray-800" />
                            <Skeleton className="h-4 w-3/4 bg-gray-800" />
                            <Skeleton className="h-4 w-1/2 bg-gray-800" />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
