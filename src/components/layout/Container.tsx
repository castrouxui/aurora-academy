import clsx from "clsx";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={clsx("w-full max-w-7xl mx-auto px-6 md:px-8", className)}>
            {children}
        </div>
    );
}
