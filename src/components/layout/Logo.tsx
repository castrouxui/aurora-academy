import Image from 'next/image';

export function Logo() {
    return (
        <div className="relative w-[171px] h-[40px]">
            <Image
                src="/logo-full.png"
                alt="Aurora Academy"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
