"use client";

import { Logo } from "@/components/layout/Logo";
import { TelegramVerification } from "@/components/dashboard/TelegramVerification";
import { Send, LogOut, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";


export function TelegramBlockingOverlay({ user }: { user: { name?: string | null, email?: string | null, telegram?: string | null, telegramVerified?: boolean } }) {
    return null; // FORCE DISABLED FOR DEBUGGING
}
