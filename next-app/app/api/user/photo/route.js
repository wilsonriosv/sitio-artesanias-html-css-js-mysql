import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { updateUserProfile, getUserById } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "users");

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo");
    const userId = formData.get("userId");

    if (!userId || !file) {
      return NextResponse.json({ message: "Faltan datos para actualizar la foto." }, { status: 400 });
    }

    if (typeof file === "string" || !file.name) {
      return NextResponse.json({ message: "El archivo de imagen no es valido." }, { status: 400 });
    }

    await ensureUploadDir();
    const extension = path.extname(file.name) || ".jpg";
    const fileName = `${userId}-${Date.now()}${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    const relativePath = `/images/users/${fileName}`;
    await updateUserProfile(userId, { photo_url: relativePath });
    const user = await getUserById(userId);

    return NextResponse.json({ message: "Foto actualizada", photoUrl: relativePath, user });
  } catch (error) {
    console.error("[POST /api/user/photo]", error);
    return NextResponse.json({ message: "No se pudo actualizar la foto." }, { status: 500 });
  }
}
