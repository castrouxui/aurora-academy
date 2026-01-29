
import Image from "next/image";

export function CardsIcons() {
    return (
        <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center relative w-10">
                <Image
                    src="/payment-icons/visa.png"
                    alt="Visa"
                    fill
                    className="object-contain p-0.5"
                />
            </div>

            {/* Mastercard */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center relative w-10">
                <Image
                    src="/payment-icons/mastercard.png"
                    alt="Mastercard"
                    fill
                    className="object-contain p-0.5"
                />
            </div>

            {/* Amex */}
            <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center relative w-10">
                <Image
                    src="/payment-icons/amex.png"
                    alt="Amex"
                    fill
                    className="object-contain p-0.5"
                />
            </div>
        </div>
    );
}
