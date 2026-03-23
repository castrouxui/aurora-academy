"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked: "Ya tenés una cuenta con otro método. Probá con email y contraseña.",
  default: "Error al iniciar sesión. Intentá de nuevo.",
};

export function AuthErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(errorMessages[error] || errorMessages.default);
      router.replace("/", { scroll: false });
    }
  }, [error, router]);

  return null;
}
