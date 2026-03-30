import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: { label: string; href: string };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="bg-surface-1 rounded-2xl border border-dashed border-border-subtle py-16 text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-surface-1 p-4 rounded-full">
                    <Icon className="h-8 w-8 text-gray-600" />
                </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-gray-400 font-light mb-6 max-w-sm mx-auto">{description}</p>
            {action && (
                <Link href={action.href}>
                    <Button className="bg-[#5D5CDE] text-white hover:bg-[#4B4AC0]">
                        {action.label}
                    </Button>
                </Link>
            )}
        </div>
    );
}
