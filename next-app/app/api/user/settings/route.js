import { NextResponse } from "next/server";
import { getUserSettings, updateUserSettings } from "@/lib/auth";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Falta el identificador de usuario." }, { status: 400 });
    }

    const preferences = await getUserSettings(userId);
    return NextResponse.json({ preferences: preferences ?? null });
  } catch (error) {
    console.error("[GET /api/user/settings]", error);
    return NextResponse.json({ message: "No se pudieron obtener las preferencias." }, { status: 500 });
  }
}

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


