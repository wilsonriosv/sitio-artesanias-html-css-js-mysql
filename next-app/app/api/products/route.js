import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error("[GET /api/products]", error);
        return NextResponse.json({ message: "Error obteniendo productos" }, { status: 500 });
    }
}
