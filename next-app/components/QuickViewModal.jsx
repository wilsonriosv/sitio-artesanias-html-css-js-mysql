"use client";

import { useEffect } from "react";

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    if (!product) return;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const handleContainerClick = (event) => {
    if (event.target.classList.contains("quick-view-modal")) {
      onClose();
    }
  };

  return (
    <div className="quick-view-modal show" onClick={handleContainerClick}>
      <div className="quick-view-content">
        <button className="close-modal" type="button" onClick={onClose}>
          &times;
        </button>
        <div className="quick-view-grid">
          <div className="quick-view-image">
            <img src={product.image} alt={product.name} loading="lazy" />
          </div>
          <div className="quick-view-info">
            <h2>{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            <button
              className="add-to-cart-btn"
              type="button"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



