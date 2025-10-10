"use client";

const genderFilters = [
  { id: "todos", label: "Todos" },
  { id: "mujer", label: "Mujer" },
  { id: "hombre", label: "Hombre" },
  { id: "nino", label: "Niños" }
];

export default function Products({ products, selectedGender, onGenderChange, onAddToCart, onQuickView, isLoading }) {
  return (
    <section className="products" id="products">
      <div className="container">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="filter-buttons">
          {genderFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-btn${selectedGender === filter.id ? " active" : ""}`}
              data-filter={filter.id}
              onClick={() => onGenderChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="products-grid" id="productsGrid">
          {isLoading ? (
            <p className="no-results">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="no-results">No hay productos disponibles.</p>
          ) : (
            products.map((product) => (
              <div className="product-card show" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="product-overlay">
                    <button
                      className="quick-view"
                      type="button"
                      onClick={() => onQuickView(product)}
                    >
                      <i className="fas fa-eye" aria-hidden="true" /> Vista Rápida
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <button
                      className="add-to-cart"
                      type="button"
                      onClick={() => {
                        if ((Array.isArray(product.variantOptions) && product.variantOptions.length > 0) || (product.variantOptions && product.variantOptions.enabled)) {
                          onQuickView(product);
                          return;
                        }
                        onAddToCart(product);
                      }}
                    >
                      <i className="fas fa-shopping-cart" aria-hidden="true" />
                      <span className="sr-only">Agregar al carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

