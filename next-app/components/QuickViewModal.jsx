"use client";

import { useEffect, useMemo, useState } from "react";

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const imageSources = useMemo(() => {
    if (!product) return [];

    const sources = [];
    const seen = new Set();

    const addSource = (value) => {
      if (typeof value !== "string") return;
      const trimmed = value.trim();
      if (!trimmed || seen.has(trimmed)) return;
      seen.add(trimmed);
      sources.push(trimmed);
    };

    addSource(product.image);

    [product.gallery_image_1, product.gallery_image_2, product.gallery_image_3].forEach(addSource);

    if (Array.isArray(product.gallery)) {
      product.gallery.forEach(addSource);
    }

    return sources;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(() => imageSources[0] ?? "");

  useEffect(() => {
    if (imageSources.length === 0) {
      setSelectedImage(product?.image ?? "");
      return;
    }

    setSelectedImage(imageSources[0]);
  }, [imageSources, product?.image]);

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
          <div className="quick-view-media">
            {imageSources.length > 1 && (
              <div className="quick-view-thumbnails">
                {imageSources.map((imageSrc) => (
                  <button
                    key={imageSrc}
                    type="button"
                    className={`quick-view-thumbnail${selectedImage === imageSrc ? " active" : ""}`}
                    onClick={() => setSelectedImage(imageSrc)}
                  >
                    <img
                      src={imageSrc}
                      alt={`Miniatura de ${product.name}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="quick-view-image">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                loading="lazy"
              />
            </div>
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
