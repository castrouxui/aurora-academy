import { CreditCard } from "lucide-react";

export function CardsIcons() {
    return (
        <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="h-6 w-9 bg-[#1F2330] rounded border border-white/10 flex items-center justify-center transition-colors hover:bg-[#2A2E3D]">
                <span className="text-[10px] font-bold text-white/90 font-serif italic tracking-tighter">VISA</span>
            </div>

            {/* Mastercard */}
            <div className="h-6 w-9 bg-[#1F2330] rounded border border-white/10 flex items-center justify-center relative overflow-hidden transition-colors hover:bg-[#2A2E3D]">
                <div className="flex items-center justify-center -space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/60 mix-blend-screen"></div>
                    <div className="w-3 h-3 rounded-full bg-white/60 mix-blend-screen"></div>
                </div>
            </div>

            {/* Amex */}
            <div className="h-6 w-9 bg-[#1F2330] rounded border border-white/10 flex items-center justify-center transition-colors hover:bg-[#2A2E3D]">
                <span className="text-[6px] font-extrabold text-white/80 uppercase tracking-widest leading-none text-center">
                    AMEX
                </span>
            </div>
        </div>
    );
}
