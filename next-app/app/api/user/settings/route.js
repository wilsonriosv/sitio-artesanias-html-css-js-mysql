import { NextResponse } from "next/server";
import { updateUserSettings } from "@/lib/auth";

export async function PUT(request) {
  try {
    const { userId, ...settings } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: "Falta el identificador de usuario." }, { status: 400 });
    }

    const result = await updateUserSettings(userId, settings);
    return NextResponse.json({ message: "Preferencias guardadas", ...result });
  } catch (error) {
    console.error("[PUT /api/user/settings]", error);
    return NextResponse.json({ message: error.message || "Error al guardar preferencias." }, { status: 500 });
  }
}
