"use client";

import { useMemo, useState } from "react";

const emptyProduct = (categories) => ({
  id: null,
  name: "",
  slug: "",
  price: "",
  stock: "",
  category: categories[0] ?? "",
  description: ""
});

export default function ProductsManager({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(() => emptyProduct(categories));
  const [status, setStatus] = useState("");
  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const handleSelect = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug ?? "",
      price: product.price?.toString() ?? "",
      stock: product.stock?.toString() ?? "",
      category: product.category,
      description: product.description ?? ""
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price,
          stock: Number(form.stock ?? 0)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo guardar el producto.");
      }
      const saved = {
        id: data.product.id,
        name: form.name,
        slug: data.product.slug,
        price: Number(form.price ?? 0),
        stock: Number(form.stock ?? 0),
        category: form.category,
        description: form.description
      };
      setProducts((prev) => {
        const exists = prev.findIndex((item) => item.id === saved.id);
        if (exists >= 0) {
          const clone = [...prev];
          clone[exists] = { ...prev[exists], ...saved, sku: saved.slug ?? String(saved.id) };
          return clone;
        }
        return [...prev, { ...saved, sku: saved.slug ?? String(saved.id) }];
      });
      setForm((prev) => ({
        ...prev,
        id: saved.id,
        slug: saved.slug,
        price: saved.price.toString(),
        stock: saved.stock.toString()
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
    const confirmDelete = window.confirm(`¿Eliminar el producto "${product.name}"?`);
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
                  <td colSpan={5} className="empty-row">
                    Aun no tienes productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
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
                value={form.stock}
                onChange={handleField("stock")}
                required
              />

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

