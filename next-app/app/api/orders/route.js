import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const data = await request.json();
    const { waPhone, waMessage, totalCents } = data;

    await query(
      `INSERT INTO orders (wa_phone, wa_message, total_cents, created_at)
       VALUES (?, ?, ?, NOW())`,
      [waPhone, waMessage, totalCents]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ message: "Error guardando pedido" }, { status: 500 });
  }
}
