import { NextResponse } from "next/server";
import { saveProduct } from "@/lib/admin";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());
    const product = {
      id: payload.id || null,
      name: payload.name,
      sku: payload.sku,
      price: payload.price,
      stock: Number(payload.stock ?? 0),
      category: payload.category,
      description: payload.description,
      active: payload.active === "on" || payload.active === "true"
    };

    await saveProduct(product);
    return NextResponse.redirect(new URL("/dashboard/products", request.url), {
      status: 303
    });
  } catch (error) {
    console.error("[POST /api/dashboard/products]", error);
    return NextResponse.json({ message: error.message || "No se pudo guardar el producto." }, { status: 500 });
  }
}
