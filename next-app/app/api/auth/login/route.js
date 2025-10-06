import { NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Credenciales incompletas." }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ message: "Contrasena incorrecta." }, { status: 401 });
    }

    const { password_hash, ...publicUser } = user;
    return NextResponse.json({ message: "Acceso concedido", user: publicUser });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ message: "Error al iniciar sesion." }, { status: 500 });
  }
}
