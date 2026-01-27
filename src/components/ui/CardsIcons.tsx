import { CreditCard } from "lucide-react";

export function CardsIcons() {
    return (
        <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center">
                <img src="/payment-icons/visa.png" alt="Visa" className="h-2.5 w-auto object-contain" />
            </div>

            {/* Mastercard */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center">
                <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-4 w-auto object-contain" />
            </div>

            {/* Amex */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center">
                <img src="/payment-icons/amex.png" alt="Amex" className="h-3.5 w-auto object-contain" />
            </div>
        </div>
    );
}
