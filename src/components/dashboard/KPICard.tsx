import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming utils exists, standard shadcn
import { LucideIcon } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    subtext?: string;
    trend?: "up" | "down" | "neutral";
    className?: string;
    valueClassName?: string;
}

export function KPICard({ title, value, icon: Icon, subtext, trend, className, valueClassName }: KPICardProps) {
    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
                {subtext && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {subtext}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
