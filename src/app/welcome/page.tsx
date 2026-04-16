"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const isPurchase = from === "purchase";

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;

    if (isPurchase) {
      window.fbq("track", "Purchase");
    } else {
      window.fbq("track", "CompleteRegistration");
    }
  }, [isPurchase]);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="bg-[#1F2937]/50 border border-gray-800 p-10 rounded-2xl max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-400" />
        </div>

        <div className="space-y-2">
          {isPurchase ? (
            <>
              <h1 className="text-3xl font-bold text-white">¡Compra exitosa!</h1>
              <p className="text-gray-400">
                Tu acceso fue activado. Ya podés empezar a aprender.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">¡Bienvenido a Aurora Academy!</h1>
              <p className="text-gray-400">
                Tu cuenta fue creada con éxito. Ya podés empezar a explorar todos nuestros cursos.
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white font-bold py-3 rounded-xl transition-colors"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeContent />
    </Suspense>
  );
}
