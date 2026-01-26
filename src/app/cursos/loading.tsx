import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";

export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-[#0B0F19] pt-24 pb-12">
            <Container>
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-10 w-64 bg-gray-800" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-24 rounded-full bg-gray-800" />
                        <Skeleton className="h-8 w-24 rounded-full bg-gray-800" />
                        <Skeleton className="h-8 w-24 rounded-full bg-gray-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                            <Skeleton className="h-48 w-full bg-gray-800" />
                            <div className="p-6 space-y-3">
                                <Skeleton className="h-6 w-full bg-gray-800" />
                                <Skeleton className="h-4 w-2/3 bg-gray-800" />
                                <div className="pt-4 flex justify-between items-center">
                                    <Skeleton className="h-8 w-20 bg-gray-800" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
