"use client";

export default function Categories({ categories, activeCategory, onSelect }) {
  return (
    <section className="categories" id="categories">
      <div className="container">
        <h2 className="section-title">Nuestras Categorías</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`category-card${activeCategory === category.id ? " active" : ""}`}
              data-category={category.id}
              onClick={() => onSelect(category.id)}
            >
              <div className="category-icon">
                <i className={category.icon} aria-hidden="true" />
              </div>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}



