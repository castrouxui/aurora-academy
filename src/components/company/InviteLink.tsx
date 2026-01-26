"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function InviteLink({ accessCode }: { accessCode: string }) {
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const link = `${origin}/join/${accessCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 bg-[#0B0F19] border border-gray-700 p-2 rounded-lg">
            <code className="flex-1 text-sm text-gray-300 truncate font-mono px-2">
                {link}
            </code>
            <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                title="Copiar Link"
            >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
        </div>
    );
}
