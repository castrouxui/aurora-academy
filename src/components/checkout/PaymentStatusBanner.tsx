"use client";

import { AlertCircle, Clock } from "lucide-react";

interface PaymentStatusBannerProps {
  status?: string;
}

export function PaymentStatusBanner({ status }: PaymentStatusBannerProps) {
  if (!status || status === "approved") return null;

  if (status === "failure" || status === "rejected") {
    return (
      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3 flex items-center justify-center gap-3 text-sm text-red-300">
        <AlertCircle size={16} className="shrink-0" />
        <span>
          El pago no pudo procesarse. Podés intentarlo nuevamente o elegir otro método de pago.
        </span>
      </div>
    );
  }

  if (status === "pending" || status === "in_process") {
    return (
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex items-center justify-center gap-3 text-sm text-yellow-300">
        <Clock size={16} className="shrink-0" />
        <span>
          Tu pago está siendo procesado. Te avisaremos por email cuando se confirme.
        </span>
      </div>
    );
  }

  return null;
}
