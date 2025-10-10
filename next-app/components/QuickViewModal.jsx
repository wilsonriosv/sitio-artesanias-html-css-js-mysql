"use client";

import { useEffect, useMemo, useState } from "react";

const slugifyKey = (value, fallback = "") =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || fallback;

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

  const variantOptions = useMemo(() => {
    if (!product) {
      return [];
    }
    const raw = product.variantOptions;
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.options) ? raw.options : [];
    if (!Array.isArray(list)) {
      return [];
    }

    return list
      .map((option, index) => {
        if (!option) return null;
        const label = (option.label ?? option.name ?? option.id ?? `Opción ${index + 1}`)
          .toString()
          .trim();
        const id = (option.id ?? slugifyKey(label, `option-${index + 1}`)).toString().trim();
        const values = Array.isArray(option.values)
          ? option.values.map((value) => value?.toString().trim()).filter(Boolean)
          : [];
        if (!id || !label || values.length === 0) {
          return null;
        }
        return { id, label, values };
      })
      .filter(Boolean);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(() => imageSources[0] ?? "");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [validationError, setValidationError] = useState("");

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

  useEffect(() => {
    if (!product) return;
    setSelectedOptions(() => {
      const initial = {};
      variantOptions.forEach((option) => {
        const [firstValue = ""] = option.values;
        initial[option.id] = option.values.length === 1 ? firstValue : "";
      });
      return initial;
    });
    setValidationError("");
  }, [product, variantOptions]);

  const selectedOptionsArray = useMemo(
    () =>
      variantOptions.map((option) => ({
        id: option.id,
        label: option.label,
        value: selectedOptions[option.id] ?? ""
      })),
    [variantOptions, selectedOptions]
  );

  if (!product) {
    return null;
  }

  const handleContainerClick = (event) => {
    if (event.target.classList.contains("quick-view-modal")) {
      onClose();
    }
  };

  const handleOptionChange = (optionId, value) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
    setValidationError("");
  };

  const handleAddToCart = () => {
    if (variantOptions.length > 0) {
      const pending = selectedOptionsArray.filter((option) => !option.value);
      if (pending.length > 0) {
        setValidationError("Selecciona todas las opciones disponibles antes de continuar.");
        return;
      }
    }

    if (typeof onAddToCart === "function") {
      const optionsToSend = selectedOptionsArray.filter((option) => option.value);
      onAddToCart(product, optionsToSend);
    }
    onClose();
  };

  const hasOptions = variantOptions.length > 0;

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

            {hasOptions && (
              <div className="quick-view-options">
                {variantOptions.map((option) => (
                  <label key={option.id} className="quick-view-option">
                    <span className="quick-view-option-label">{option.label}</span>
                    <select
                      className="quick-view-option-select"
                      value={selectedOptions[option.id] ?? ""}
                      onChange={(event) => handleOptionChange(option.id, event.target.value)}
                    >
                      {option.values.length > 1 && <option value="">Selecciona una opción</option>}
                      {option.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}

            {validationError && <p className="quick-view-error">{validationError}</p>}

            <button className="add-to-cart-btn" type="button" onClick={handleAddToCart}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


