```
import Link from "next/link";
import { Triangle } from "lucide-react";

export function Logo({ iconOnly = false }: { iconOnly?: boolean }) {
    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="bg-gradient-to-tr from-[#5D5CDE] to-cyan-400 p-2 rounded-lg">
                <Triangle className="fill-white stroke-none transform rotate-180" size={24} />
            </div>
            {!iconOnly && (
                <div className="flex flex-col leading-none">
                    <span className="tracking-widest text-[#E2E8F0]">AURORA</span>
                    <span className="text-[10px] text-gray-400 tracking-[0.2em] font-medium">ACADEMY</span>
                </div>
            )}
        </Link>
    );
}
```
