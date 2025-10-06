import { getProductsOverview } from "@/lib/admin";

export const metadata = {
  title: "Administrar productos | Artesanias Bella Vista"
};

export default async function DashboardProductsPage() {
  const { products, categories } = await getProductsOverview();

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <h1>Gestion de productos</h1>
        <p>Agrega, actualiza y controla el inventario de tu catalogo.</p>
      </div>

      <div className="dashboard-grid">
        <article className="panel-card">
          <header className="panel-header">
            <h2>Inventario actual</h2>
            <span className="panel-hint">Total de productos: {products.length}</span>
          </header>
          <div className="table-wrapper">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Visible</th>
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
                        <p className="panel-hint">SKU: {product.sku}</p>
                      </td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge ${product.active ? "success" : "warning"}`}>
                          {product.active ? "Publicado" : "Oculto"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel-card">
          <h2>Crear o actualizar producto</h2>
          <form className="panel-form" method="POST" action="/api/dashboard/products">
            <label className="panel-label" htmlFor="product-name">
              Nombre del producto
            </label>
            <input id="product-name" name="name" className="panel-input" required />

            <label className="panel-label" htmlFor="product-sku">
              SKU
            </label>
            <input id="product-sku" name="sku" className="panel-input" required />

            <label className="panel-label" htmlFor="product-price">
              Precio (USD)
            </label>
            <input
              id="product-price"
              name="price"
              className="panel-input"
              type="number"
              min="0"
              step="0.01"
              required
            />

            <label className="panel-label" htmlFor="product-stock">
              Stock disponible
            </label>
            <input
              id="product-stock"
              name="stock"
              className="panel-input"
              type="number"
              min="0"
              step="1"
              required
            />

            <label className="panel-label" htmlFor="product-category">
              Categoria
            </label>
            <select id="product-category" name="category" className="panel-input" required>
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
              name="description"
              className="panel-input"
              rows={4}
              placeholder="Describe los materiales, dimensiones y cuidados"
            />

            <label className="toggle">
              <input type="checkbox" name="active" defaultChecked />
              <span>Publicar inmediatamente</span>
            </label>

            <button className="panel-button" type="submit">
              Guardar producto
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
