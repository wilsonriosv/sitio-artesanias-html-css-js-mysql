import { NextResponse } from "next/server";
import { saveProduct, deleteProduct } from "@/lib/admin";

function slugify(value) {
  if (!value) return "";
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizePayload(payload) {
  const name = payload.name?.trim() ?? "";
  const rawSlug = payload.slug?.trim();
  const rawSku = payload.sku?.trim();
  const slugFromInput = slugify(rawSlug ?? "");
  const fallbackSlug = slugify(name || rawSku || "");
  const slug = slugFromInput || fallbackSlug;
  const sku = rawSku || slug || fallbackSlug;
  return {
    id: payload.id ? Number(payload.id) : null,
    name,
    slug,
    sku,
    price: payload.price,
    stock: Number(payload.stock ?? 0),
    category: payload.category?.trim() ?? "",
    description: payload.description ?? ""
  };
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }

    const product = normalizePayload(payload);
    const result = await saveProduct(product);

    return NextResponse.json({
      message: "Producto guardado",
      product: {
        ...product,
        id: result.id ?? product.id,
        slug: result.slug ?? product.slug,
        sku: result.sku ?? product.sku
      }
    });
  } catch (error) {
    console.error("[POST /api/dashboard/products]", error);
    return NextResponse.json({ message: error.message || "No se pudo guardar el producto." }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        if (body && body.id) {
          id = body.id;
        }
      } catch (err) {
        // ignore: no JSON body provided
      }
    }

    const numericId = id ? Number(id) : null;
    if (!numericId) {
      return NextResponse.json({ message: "Falta el identificador de producto." }, { status: 400 });
    }

    await deleteProduct(numericId);
    return NextResponse.json({ message: "Producto eliminado", id: numericId });
  } catch (error) {
    console.error("[DELETE /api/dashboard/products]", error);
    return NextResponse.json({ message: error.message || "No se pudo eliminar el producto." }, { status: 500 });
  }
}





