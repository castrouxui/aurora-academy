export function ChatSkeleton() {
    return (
        <div className="flex w-full items-start gap-3 mb-4 animate-in fade-in duration-300">
            <div className="h-8 w-8 shrink-0 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-2 w-full max-w-[70%]">
                <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                    <div className="h-4 w-[85%] bg-muted/30 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}
