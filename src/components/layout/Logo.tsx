import Link from "next/link";
import Image from "next/image";

export function Logo({ iconOnly = false }: { iconOnly?: boolean }) {
    if (iconOnly) {
        return (
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                <Image src="/icon.png" alt="Aurora Academy" width={40} height={40} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            </Link>
        )
    }

    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            {/* Logo Image */}
            <Image
                src="/logo-new.png"
                alt="Aurora Academy"
                width={150}
                height={40}
                className="h-6 md:h-8 w-auto object-contain"
                priority
            />
        </Link>
    );
}
