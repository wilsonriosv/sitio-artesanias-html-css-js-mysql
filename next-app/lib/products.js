import { query } from "@/lib/db";

const CATEGORY_MAP = {
    pulseras: "joyeria",
    collares: "joyeria",
    anillos: "joyeria",
    cadenas: "accesorios",
    accesorios: "accesorios",
    ropa: "ropa"
};

const GENDER_MAP = {
    unisex: "todos",
    mujer: "mujer",
    hombre: "hombre",
    "niños": "nino",
    nina: "nino"
};

export async function getProducts() {
    const rows = await query(
        `SELECT id, slug, name, description, price_cents, category, gender, stock, image_url
       FROM products
      WHERE stock > 0
      ORDER BY created_at DESC`
    );

    return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        price: row.price_cents / 100,
        category: CATEGORY_MAP[row.category] ?? row.category ?? "accesorios",
        gender: GENDER_MAP[row.gender] ?? row.gender ?? "todos",
        stock: row.stock,
        image: row.image_url
    }));
}
