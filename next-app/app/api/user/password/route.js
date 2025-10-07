import { NextResponse } from "next/server";
import { updateUserPassword } from "@/lib/auth";

export async function PUT(request) {
  try {
    const { userId, current, next } = await request.json();
    if (!userId || !current || !next) {
      return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
    }

    const result = await updateUserPassword(userId, current, next);
    return NextResponse.json({ message: "Contrasena actualizada", ...result });
  } catch (error) {
    console.error("[PUT /api/user/password]", error);
    return NextResponse.json({ message: error.message || "Error al actualizar contrasena." }, { status: 500 });
  }
}
