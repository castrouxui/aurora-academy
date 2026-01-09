import Link from "next/link";
import Image from "next/image";

export function Logo({ iconOnly = false }: { iconOnly?: boolean }) {
    if (iconOnly) {
        return (
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                <Image src="/logo.png" alt="Aurora Academy" width={40} height={40} className="w-10 h-10 object-contain" />
            </Link>
        )
    }

    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <Image src="/logo-full.png" alt="Aurora Academy" width={170} height={40} className="h-10 w-auto object-contain" />
        </Link>
    );
}
