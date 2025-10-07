import { NextResponse } from "next/server";
import { getUserById, updateUserProfile } from "@/lib/auth";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Falta el identificador de usuario." }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[GET /api/user/profile]", error);
    return NextResponse.json({ message: "No se pudo obtener el perfil." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, ...data } = body;

    if (!userId) {
      return NextResponse.json({ message: "Falta el identificador de usuario." }, { status: 400 });
    }

    await updateUserProfile(userId, data);
    const user = await getUserById(userId);
    return NextResponse.json({ message: "Perfil actualizado", user });
  } catch (error) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ message: error.message || "Error al actualizar perfil." }, { status: 500 });
  }
}
