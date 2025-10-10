"use client";

import { useEffect, useMemo, useState } from "react";

const slugifyKey = (value, fallback = "") =>
  (value ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || fallback;

const ensureGallery = (values = []) =>
  Array.from({ length: 3 }, (_, index) => {
    const value = values[index];
    return value ?? "";
  });

const formatProduct = (product = {}) => {
  const gallery = ensureGallery(product.gallery);
  const mainImage = product.mainImage ?? product.image ?? "";
  return {
    ...product,
    mainImage,
    image: product.image ?? mainImage,
    gallery
  };
};

const emptyProduct = (categories) => ({
  id: null,
  name: "",
  slug: "",
  price: "",
  stock: "",
  category: categories[0] ?? "",
  description: "",
  mainImage: "",
  mainImageFile: null,
  gallery: ["", "", ""],
  galleryFiles: [null, null, null],
  variantEnabled: false,
  variantOptions: {
    options: [
      { id: "talla", label: "Talla", values: [] },
      { id: "color", label: "Color", values: [] }
    ],
    variants: []
  },
  variantStockMap: {}
});

export default function ProductsManager({ initialProducts, categories }) {
  const [products, setProducts] = useState(() => initialProducts.map(formatProduct));
  const [form, setForm] = useState(() => emptyProduct(categories));
  const [status, setStatus] = useState("");
  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  useEffect(() => {
    setProducts(initialProducts.map(formatProduct));
  }, [initialProducts]);

  const mainImagePreview = useMemo(() => {
    if (form.mainImageFile) {
      return URL.createObjectURL(form.mainImageFile);
    }
    return form.mainImage;
  }, [form.mainImageFile, form.mainImage]);

  useEffect(() => {
    if (!form.mainImageFile || !mainImagePreview || !mainImagePreview.startsWith("blob:")) {
      return () => {};
    }
    return () => {
      URL.revokeObjectURL(mainImagePreview);
    };
  }, [mainImagePreview, form.mainImageFile]);

  const galleryPreviews = useMemo(
    () =>
      form.galleryFiles.map((file, index) => {
        if (file) {
          return URL.createObjectURL(file);
        }
        return form.gallery[index] || "";
      }),
    [form.galleryFiles, form.gallery]
  );

  useEffect(() => {
    const urls = galleryPreviews.filter(
      (preview, index) => form.galleryFiles[index] && preview && preview.startsWith("blob:")
    );
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews, form.galleryFiles]);

  const handleSelect = (product) => {
    const mapped = formatProduct(product);
    // Normalize variant options from product (if any)
    const existingVariant = product?.variantOptions && typeof product.variantOptions === "object"
      ? product.variantOptions
      : { enabled: false, options: [], variants: [] };
    const options = Array.isArray(existingVariant.options) && existingVariant.options.length > 0
      ? existingVariant.options.slice(0, 2).map((opt, idx) => ({
          id: opt.id || slugifyKey(opt.label, `option-${idx + 1}`),
          label: opt.label || `Opción ${idx + 1}`,
          values: Array.isArray(opt.values) ? opt.values : []
        }))
      : [
          { id: "talla", label: "Talla", values: [] },
          { id: "color", label: "Color", values: [] }
        ];
    const variantStockMap = {};
    if (Array.isArray(existingVariant.variants)) {
      existingVariant.variants.forEach((v) => {
        const key = options
          .map((o) => `${o.id}:${v?.values?.[o.id] ?? ""}`)
          .join("|");
        variantStockMap[key] = Number(v?.stock ?? 0) || 0;
      });
    }
    setForm({
      id: mapped.id,
      name: mapped.name,
      slug: mapped.slug ?? "",
      price: mapped.price?.toString() ?? "",
      stock: mapped.stock?.toString() ?? "",
      category: mapped.category,
      description: mapped.description ?? "",
      mainImage: mapped.mainImage ?? "",
      mainImageFile: null,
      gallery: ensureGallery(mapped.gallery),
      galleryFiles: [null, null, null],
      variantEnabled: Boolean(existingVariant.enabled) && Array.isArray(existingVariant.variants) && existingVariant.variants.length > 0,
      variantOptions: { options, variants: existingVariant.variants || [] },
      variantStockMap
    });
    setStatus("");
    setModalOpen(true);
  };

  const handleField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleNew = () => {
    setForm(emptyProduct(categories));
    setStatus("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setStatus("");
  };

  const handleMainImageChange = (event) => {
    const [file] = event.target.files ?? [];
    if (!file) {
      return;
    }
    setForm((prev) => ({ ...prev, mainImageFile: file }));
  };

  const handleClearMainImage = () => {
    setForm((prev) => ({ ...prev, mainImage: "", mainImageFile: null }));
  };

  const handleGalleryImageChange = (index) => (event) => {
    const [file] = event.target.files ?? [];
    if (!file) {
      return;
    }
    setForm((prev) => {
      const next = [...prev.galleryFiles];
      next[index] = file;
      return { ...prev, galleryFiles: next };
    });
  };

  const handleClearGalleryImage = (index) => {
    setForm((prev) => {
      const gallery = ensureGallery(prev.gallery);
      const galleryFiles = [...prev.galleryFiles];
      gallery[index] = "";
      galleryFiles[index] = null;
      return { ...prev, gallery, galleryFiles };
    });
  };

  const handleToggleVariants = (event) => {
    const enabled = event.target.checked;
    setForm((prev) => ({ ...prev, variantEnabled: enabled }));
  };

  const handleOptionLabelChange = (index) => (event) => {
    const label = event.target.value;
    setForm((prev) => {
      const options = [...(prev.variantOptions?.options ?? [])];
      const current = { ...(options[index] ?? {}) };
      const id = slugifyKey(current.id || label || `option-${index + 1}`, `option-${index + 1}`);
      options[index] = { id, label, values: Array.isArray(current.values) ? current.values : [] };
      return { ...prev, variantOptions: { ...prev.variantOptions, options } };
    });
  };

  const handleOptionValuesChange = (index) => (event) => {
    const raw = event.target.value || "";
    const values = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
    setForm((prev) => {
      const options = [...(prev.variantOptions?.options ?? [])];
      const current = { ...(options[index] ?? {}) };
      const id = slugifyKey(current.id || current.label || `option-${index + 1}`, `option-${index + 1}`);
      options[index] = { id, label: current.label || `Opción ${index + 1}`, values };
      return { ...prev, variantOptions: { ...prev.variantOptions, options } };
    });
  };

  const getOptionValuesCSV = (index) => {
    const options = form.variantOptions?.options ?? [];
    const current = options[index];
    return Array.isArray(current?.values) ? current.values.join(", ") : "";
  };

  const listCombinations = () => {
    const options = form.variantOptions?.options ?? [];
    const [optA = null, optB = null] = options;
    const valuesA = Array.isArray(optA?.values) ? optA.values : [];
    const valuesB = Array.isArray(optB?.values) ? optB.values : [];
    const combos = [];
    if (valuesA.length > 0 && valuesB.length > 0) {
      valuesA.forEach((a) => {
        valuesB.forEach((b) => {
          combos.push({ key: `${optA.id}:${a}|${optB.id}:${b}`, parts: [{ label: optA.label, value: a }, { label: optB.label, value: b }] });
        });
      });
    } else if (valuesA.length > 0) {
      valuesA.forEach((a) => {
        combos.push({ key: `${optA.id}:${a}`, parts: [{ label: optA.label, value: a }] });
      });
    }
    return combos;
  };

  const computedTotalVariantStock = useMemo(() => {
    if (!form.variantEnabled) return 0;
    return Object.values(form.variantStockMap || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }, [form.variantEnabled, form.variantStockMap]);

  const handleVariantStockChange = (key) => (event) => {
    const value = Math.max(0, Math.floor(Number(event.target.value || 0)));
    setForm((prev) => ({ ...prev, variantStockMap: { ...(prev.variantStockMap || {}), [key]: value } }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const formData = new FormData();
      if (form.id) {
        formData.append("id", String(form.id));
      }
      formData.append("name", form.name);
      formData.append("slug", form.slug ?? "");
      formData.append("price", form.price ?? "0");
      // Build variant options payload if enabled
      let totalVariantStock = 0;
      if (form.variantEnabled) {
        const opts = Array.isArray(form.variantOptions?.options)
          ? form.variantOptions.options.filter((o) => Array.isArray(o.values) && o.values.length > 0)
          : [];
        // Generate combinations
        const [optA = null, optB = null] = opts;
        const valuesA = optA ? optA.values : [];
        const valuesB = optB ? optB.values : [];
        const variants = [];
        if (valuesA.length > 0 && valuesB.length > 0) {
          valuesA.forEach((a) => {
            valuesB.forEach((b) => {
              const key = `${optA.id}:${a}|${optB.id}:${b}`;
              const stock = Number(form.variantStockMap?.[key] ?? 0) || 0;
              if (stock > 0) {
                variants.push({ values: { [optA.id]: a, [optB.id]: b }, stock });
                totalVariantStock += stock;
              }
            });
          });
        } else if (valuesA.length > 0) {
          valuesA.forEach((a) => {
            const key = `${optA.id}:${a}`;
            const stock = Number(form.variantStockMap?.[key] ?? 0) || 0;
            if (stock > 0) {
              variants.push({ values: { [optA.id]: a }, stock });
              totalVariantStock += stock;
            }
          });
        }

        const variantOptionsPayload = {
          enabled: variants.length > 0,
          options: opts,
          variants
        };
        formData.append("variantOptionsJson", JSON.stringify(variantOptionsPayload));
        formData.append("stock", String(totalVariantStock));
      } else {
        formData.append("stock", form.stock ?? "0");
      }
      formData.append("category", form.category ?? "");
      formData.append("description", form.description ?? "");

      if (form.mainImageFile) {
        formData.append("mainImage", form.mainImageFile);
      } else if (form.mainImage) {
        formData.append("mainImageUrl", form.mainImage);
      }

      form.gallery.forEach((value, index) => {
        const file = form.galleryFiles[index];
        if (file) {
          formData.append(`galleryImage${index + 1}`, file);
        } else if (value) {
          formData.append(`galleryImageUrl${index + 1}`, value);
        }
      });

      const response = await fetch("/api/dashboard/products", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo guardar el producto.");
      }

      const normalizedGallery = ensureGallery(data.product.gallery);
      const saved = {
        id: data.product.id,
        name: form.name,
        slug: data.product.slug,
        price: Number(form.price ?? 0),
        stock: form.variantEnabled ? (Number(data.product?.variantOptions?.variants?.reduce?.((s, v) => s + (v?.stock ?? 0), 0) ?? 0)) : Number(form.stock ?? 0),
        category: form.category,
        description: form.description,
        mainImage: data.product.mainImage ?? "",
        image: data.product.image ?? data.product.mainImage ?? "",
        gallery: normalizedGallery,
        sku: data.product.sku ?? data.product.slug ?? String(data.product.id)
      };

      setProducts((prev) => {
        const exists = prev.findIndex((item) => item.id === saved.id);
        if (exists >= 0) {
          const clone = [...prev];
          clone[exists] = { ...prev[exists], ...saved };
          return clone;
        }
        return [...prev, saved];
      });

      setForm((prev) => ({
        ...prev,
        id: saved.id,
        slug: saved.slug,
        price: saved.price.toString(),
        stock: saved.stock.toString(),
        mainImage: saved.mainImage,
        mainImageFile: null,
        gallery: saved.gallery,
        galleryFiles: [null, null, null]
      }));
      setStatus("Producto guardado correctamente.");
      setModalOpen(false);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!product?.id) return;
    const confirmDelete = window.confirm(`Eliminar el producto "${product.name}"?`);
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/dashboard/products?id=${product.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo eliminar el producto.");
      }
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      if (form.id === product.id) {
        setForm(emptyProduct(categories));
        setModalOpen(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="toolbar">
        <button type="button" className="panel-button" onClick={handleNew}>
          <i className="fas fa-plus" aria-hidden="true" /> Nuevo producto
        </button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table className="panel-table interactive">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    Aun no tienes productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-thumb">
                        {product.mainImage ? (
                          <img src={product.mainImage} alt={`Foto de ${product.name}`} loading="lazy" />
                        ) : (
                          <span>Sin foto</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <p className="panel-hint">Slug: {product.slug ?? product.id}</p>
                    </td>
                    <td>{product.category}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td className="actions">
                      <button type="button" className="icon-action" onClick={() => handleSelect(product)}>
                        <i className="fas fa-pen" aria-hidden="true" />
                        <span className="sr-only">Editar</span>
                      </button>
                      <button type="button" className="icon-action danger" onClick={() => handleDelete(product)}>
                        <i className="fas fa-trash" aria-hidden="true" />
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <h2>{isEditing ? "Actualizar producto" : "Nuevo producto"}</h2>
              <button type="button" className="close-modal" onClick={closeModal}>
                <i className="fas fa-times" aria-hidden="true" />
                <span className="sr-only">Cerrar</span>
              </button>
            </header>

            <form className="panel-form" onSubmit={handleSubmit}>
              <label className="panel-label" htmlFor="product-name">
                Nombre del producto
              </label>
              <input
                id="product-name"
                className="panel-input"
                value={form.name}
                onChange={handleField("name")}
                required
              />

              <label className="panel-label" htmlFor="product-slug">
                Identificador (slug)
              </label>
              <input
                id="product-slug"
                className="panel-input"
                value={form.slug}
                onChange={handleField("slug")}
                placeholder="ej: collar-perlas-naturales"
              />
              <p className="panel-hint">Se usa en la URL del producto. Se genera automaticamente si lo dejas vacio.</p>

              <label className="panel-label" htmlFor="product-price">
                Precio (USD)
              </label>
              <input
                id="product-price"
                className="panel-input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleField("price")}
                required
              />

              <label className="panel-label" htmlFor="product-stock">
                Stock disponible
              </label>
              <input
                id="product-stock"
                className="panel-input"
                type="number"
                min="0"
                step="1"
                value={form.variantEnabled ? computedTotalVariantStock : form.stock}
                onChange={handleField("stock")}
                disabled={form.variantEnabled}
                required
              />

              <div className="variant-section">
                <div className="variant-header">
                  <label className="panel-checkbox">
                    <input type="checkbox" checked={form.variantEnabled} onChange={handleToggleVariants} />
                    <span>Administrar stock por tallas y colores</span>
                  </label>
                  {form.variantEnabled && (
                    <p className="panel-hint">Define valores y stock por combinación. El stock total se calcula automáticamente.</p>
                  )}
                </div>

                {form.variantEnabled && (
                  <div className="variant-editor">
                    <div className="variant-options-grid">
                      <div className="variant-option">
                        <label className="panel-label">Opción 1 (por ejemplo, Talla)</label>
                        <input
                          className="panel-input"
                          value={form.variantOptions?.options?.[0]?.label ?? "Talla"}
                          onChange={handleOptionLabelChange(0)}
                          placeholder="Talla"
                        />
                        <label className="panel-label">Valores (separados por coma)</label>
                        <input
                          className="panel-input"
                          value={getOptionValuesCSV(0)}
                          onChange={handleOptionValuesChange(0)}
                          placeholder="XS, S, M, L, XL"
                        />
                      </div>

                      <div className="variant-option">
                        <label className="panel-label">Opción 2 (por ejemplo, Color)</label>
                        <input
                          className="panel-input"
                          value={form.variantOptions?.options?.[1]?.label ?? "Color"}
                          onChange={handleOptionLabelChange(1)}
                          placeholder="Color"
                        />
                        <label className="panel-label">Valores (separados por coma)</label>
                        <input
                          className="panel-input"
                          value={getOptionValuesCSV(1)}
                          onChange={handleOptionValuesChange(1)}
                          placeholder="Rojo, Azul, Negro"
                        />
                      </div>
                    </div>

                    <div className="variant-combinations">
                      <h3 className="product-media-title">Stock por combinación</h3>
                      {listCombinations().length === 0 ? (
                        <p className="panel-hint">Agrega valores en las opciones para generar combinaciones.</p>
                      ) : (
                        <div className="variant-table">
                          {listCombinations().map((combo) => (
                            <div key={combo.key} className="variant-row">
                              <div className="variant-labels">
                                {combo.parts.map((p) => (
                                  <span key={`${combo.key}-${p.label}-${p.value}`} className="variant-chip">{p.label}: {p.value}</span>
                                ))}
                              </div>
                              <input
                                type="number"
                                className="panel-input variant-stock-input"
                                min="0"
                                step="1"
                                value={form.variantStockMap?.[combo.key] ?? 0}
                                onChange={handleVariantStockChange(combo.key)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="panel-hint">Stock total: {computedTotalVariantStock}</p>
                    </div>
                  </div>
                )}
              </div>

              <label className="panel-label" htmlFor="product-category">
                Categoria
              </label>
              <select
                id="product-category"
                className="panel-input"
                value={form.category}
                onChange={handleField("category")}
                required
              >
                <option value="">Selecciona una categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label className="panel-label" htmlFor="product-description">
                Descripcion
              </label>
              <textarea
                id="product-description"
                className="panel-input"
                rows={4}
                value={form.description}
                onChange={handleField("description")}
                placeholder="Describe los materiales, dimensiones y cuidados"
              />

              <div className="product-media-section">
                <h3 className="product-media-title">Imagen principal</h3>
                <div className="product-media-main">
                  <div className="upload-thumb">
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt={form.name || "Imagen del producto"} />
                    ) : (
                      <span className="upload-thumb__placeholder">Sin imagen</span>
                    )}
                  </div>
                  <div className="product-media-actions">
                    <label className="panel-button secondary">
                      Seleccionar imagen
                      <input type="file" accept="image/*" onChange={handleMainImageChange} hidden />
                    </label>
                    {(form.mainImageFile || form.mainImage) && (
                      <button type="button" className="panel-link" onClick={handleClearMainImage}>
                        Quitar imagen
                      </button>
                    )}
                    <p className="panel-hint">Formatos recomendados: JPG o PNG, minimo 600px por lado.</p>
                  </div>
                </div>
              </div>

              <div className="product-media-section">
                <h3 className="product-media-title">Galeria (hasta 3 fotos)</h3>
                <div className="product-media-gallery">
                  {galleryPreviews.map((preview, index) => (
                    <div key={`gallery-${index}`} className="product-media-item">
                      <div className="upload-thumb">
                        {preview ? (
                          <img src={preview} alt={`Galeria ${index + 1}`} />
                        ) : (
                          <span className="upload-thumb__placeholder">Sin foto</span>
                        )}
                      </div>
                      <div className="product-media-actions">
                        <label className="panel-button secondary">
                          {preview ? "Cambiar" : "Agregar"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryImageChange(index)}
                            hidden
                          />
                        </label>
                        {preview && (
                          <button
                            type="button"
                            className="panel-link"
                            onClick={() => handleClearGalleryImage(index)}
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="panel-hint">Las imagenes complementarias ayudan a mostrar detalles del producto.</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="panel-button secondary" onClick={closeModal} disabled={isSaving}>
                  Cancelar
                </button>
                <button className="panel-button" type="submit" disabled={isSaving}>
                  {isSaving ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
                </button>
              </div>
              {status && <p className="panel-feedback">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

