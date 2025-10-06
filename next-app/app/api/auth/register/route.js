import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
    }

    const user = await createUser({ name, email, password });
    return NextResponse.json({ message: "Usuario creado", user }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ message: error.message || "Error al registrar." }, { status: 400 });
  }
}
