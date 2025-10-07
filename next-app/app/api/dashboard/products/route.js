import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { saveProduct, deleteProduct } from "@/lib/admin";

const PRODUCT_UPLOAD_DIR = path.join(process.cwd(), "public", "images", "products");

async function ensureProductUploadDir() {
  try {
    await fs.access(PRODUCT_UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(PRODUCT_UPLOAD_DIR, { recursive: true });
  }
}

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

async function persistProductImage(file, baseSlug, label) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }

  await ensureProductUploadDir();
  const extension = path.extname(file.name || "");
  const suffix = extension || ".jpg";
  const safeBase = slugify(baseSlug) || `producto-${Date.now()}`;
  const fileName = `${safeBase}-${label}-${Date.now()}-${randomUUID()}${suffix}`.replace(/-{2,}/g, "-");
  const filePath = path.join(PRODUCT_UPLOAD_DIR, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return `/images/products/${fileName}`;
}

function normalizeImagePath(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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
    let product;
    let images = { mainImage: null, gallery: [null, null, null] };

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const textEntries = {};
      const files = { main: null, gallery: [null, null, null] };

      formData.forEach((value, key) => {
        if (typeof File !== "undefined" && value instanceof File) {
          if (value.size === 0) {
            return;
          }
          if (key === "mainImage") {
            files.main = value;
            return;
          }
          if (key.startsWith("galleryImage")) {
            const index = Number(key.replace("galleryImage", "")) - 1;
            if (Number.isInteger(index) && index >= 0 && index < files.gallery.length) {
              files.gallery[index] = value;
            }
            return;
          }
        }
        textEntries[key] = typeof value === "string" ? value : String(value ?? "");
      });

      product = normalizePayload(textEntries);
      const baseSlug = product.slug || product.name || product.sku || `producto-${Date.now()}`;

      let mainImagePath = normalizeImagePath(textEntries.mainImageUrl);
      if (files.main) {
        mainImagePath = await persistProductImage(files.main, baseSlug, "principal");
      }

      const savedGallery = await Promise.all(
        files.gallery.map(async (file, index) => {
          const existingKey = `galleryImageUrl${index + 1}`;
          if (file) {
            return persistProductImage(file, baseSlug, `galeria-${index + 1}`);
          }
          return normalizeImagePath(textEntries[existingKey]);
        })
      );

      images = { mainImage: mainImagePath, gallery: savedGallery };
    } else {
      const body = await request.json();
      product = normalizePayload(body);
      const galleryInput = Array.isArray(body.gallery) ? body.gallery : [];
      images = {
        mainImage: normalizeImagePath(body.mainImage || body.image || body.imageUrl),
        gallery: [
          normalizeImagePath(galleryInput[0]),
          normalizeImagePath(galleryInput[1]),
          normalizeImagePath(galleryInput[2])
        ]
      };
    }

    const result = await saveProduct(product, images);

    const mergedGallery = Array.from({ length: 3 }, (_, index) => {
      const resultValue = result.gallery?.[index];
      const requestValue = images.gallery?.[index];
      return resultValue ?? requestValue ?? null;
    });
    const mainImage = result.image ?? images.mainImage ?? null;

    return NextResponse.json({
      message: "Producto guardado",
      product: {
        ...product,
        id: result.id ?? product.id,
        slug: result.slug ?? product.slug,
        sku: result.sku ?? product.sku,
        mainImage: mainImage ?? "",
        image: mainImage ?? "",
        gallery: mergedGallery
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
