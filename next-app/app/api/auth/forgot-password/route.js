import { NextResponse } from "next/server";
import { createPasswordResetRequest } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Correo requerido." }, { status: 400 });
    }

    const { token, user } = await createPasswordResetRequest(email);

    if (!token || !user) {
      return NextResponse.json({ message: "Si el correo existe, enviaremos instrucciones." });
    }

    // TODO: enviar email real con el token
    return NextResponse.json({
      message: "Solicitud registrada. Revisa tu correo para continuar.",
      resetToken: token
    });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json({ message: "No se pudo generar la solicitud." }, { status: 500 });
  }
}
