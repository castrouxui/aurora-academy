import { CreditCard } from "lucide-react";

export function CardsIcons() {
    return (
        <div className="flex items-center gap-2">
            {/* Visa-ish */}
            <div className="h-6 px-2 bg-white/10 rounded border border-white/5 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white font-serif italic">VISA</span>
            </div>
            {/* Master-ish */}
            <div className="h-6 px-2 bg-white/10 rounded border border-white/5 flex items-center justify-center gap-[-4px]">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-orange-500/80 -ml-1.5"></div>
            </div>
            {/* Amex-ish */}
            <div className="h-6 px-2 bg-blue-500/20 rounded border border-blue-500/30 flex items-center justify-center">
                <span className="text-[8px] font-bold text-blue-400 uppercase">AMEX</span>
            </div>
        </div>
    );
}
