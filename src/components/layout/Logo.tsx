import Link from "next/link";
import Image from "next/image";

export function Logo({ iconOnly = false }: { iconOnly?: boolean }) {
    if (iconOnly) {
        return (
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                <Image src="/icon.png" alt="Aurora Academy" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            </Link>
        )
    }

    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            {/* Logo Image */}
            <Image
                src="/logo-new.png"
                alt="Aurora Academy"
                width={180}
                height={50}
                className="h-8 md:h-10 w-auto object-contain"
                priority
            />
        </Link>
    );
}
