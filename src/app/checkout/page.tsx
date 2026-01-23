"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    // Params
    const bundleId = searchParams.get("bundleId");
    const courseId = searchParams.get("courseId");

    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // If no ID provided, redirect back
        if (!bundleId && !courseId) {
            router.push("/courses");
            return;
        }

        const fetchItem = async () => {
            try {
                let url = "";
                if (bundleId) url = `/api/bundles/${bundleId}`;
                else if (courseId) url = `/api/courses/${courseId}`;

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setItem(data);
                    setIsModalOpen(true); // Auto-open modal
                } else {
                    console.error("Item not found");
                    router.push("/courses");
                }
            } catch (error) {
                console.error(error);
                router.push("/courses");
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchItem();
        } else if (status === "unauthenticated") {
            // Redirect to login if not logged in, preserving return URL
            router.push(`/login?callbackUrl=/checkout?${searchParams.toString()}`);
        }

    }, [bundleId, courseId, router, status, searchParams]);

    const handleClose = () => {
        setIsModalOpen(false);
        router.back(); // Go back when closing modal
    };

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="min-h-screen bg-[#0B0F19]">
            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleClose}
                courseTitle={item.title}
                coursePrice={item.price.toString()} // Ensure string
                courseId={courseId || undefined}
                bundleId={bundleId || undefined}
                userId={session?.user?.id}
            />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F19]" />}>
            <CheckoutContent />
        </Suspense>
    );
}
