import { query } from "@/lib/db";
import { normalizeVariantOptions } from "@/lib/variants";

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

const normalizeImage = (value) => (typeof value === "string" ? value.trim() : "");

export async function getProducts() {
    const rows = await query(
        `SELECT id, slug, name, description, price_cents, category, gender, stock, image_url, gallery_image_1, gallery_image_2, gallery_image_3, variant_options
       FROM products
      WHERE stock > 0 OR variant_options IS NOT NULL
      ORDER BY created_at DESC`
    );

    return rows.map((row) => {
        const galleryValues = [
            normalizeImage(row.gallery_image_1),
            normalizeImage(row.gallery_image_2),
            normalizeImage(row.gallery_image_3)
        ];

        const variantOptions = normalizeVariantOptions(row.variant_options);
        const effectiveStock = variantOptions.enabled ? variantOptions.totalStock : row.stock;

        return {
            id: row.id,
            slug: row.slug,
            name: row.name,
            description: row.description,
            price: row.price_cents / 100,
            category: CATEGORY_MAP[row.category] ?? row.category ?? "accesorios",
            gender: GENDER_MAP[row.gender] ?? row.gender ?? "todos",
            stock: effectiveStock,
            image: normalizeImage(row.image_url),
            gallery_image_1: galleryValues[0],
            gallery_image_2: galleryValues[1],
            gallery_image_3: galleryValues[2],
            gallery: galleryValues.filter(Boolean),
            variantOptions
        };
    });
}
