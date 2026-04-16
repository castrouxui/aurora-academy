import { devOnly } from "@/lib/dev-only";
import { NextResponse } from "next/server";
import { sendQuickRefundEmail } from "@/lib/email";

export async function GET() {
    const guard = devOnly(); if (guard) return guard;
    try {
        const email = 'federicolopez.0023@gmail.com';
        const name = 'Jose Federico Lopez';
        
        console.log(`Enviando correo de reembolso rápido a ${name} (${email})...`);
        
        const result = await sendQuickRefundEmail(email, name);
        
        if (result) {
            console.log("¡Correo enviado exitosamente!");
            return NextResponse.json({ success: true, message: "Correo enviado exitosamente" });
        } else {
            console.log("Error al enviar el correo.");
            return NextResponse.json({ success: false, message: "Error al enviar el correo" }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
