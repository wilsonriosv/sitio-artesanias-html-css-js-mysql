"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchModal({ isOpen, products, onClose, onSelectProduct }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (query.trim().length < 2) {
      return [];
    }
    const lower = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower)
    );
  }, [products, query]);

  const handleContainerClick = (event) => {
    if (event.target.classList.contains("search-modal")) {
      onClose();
    }
  };

  const handleSelect = (product) => {
    onClose();
    onSelectProduct(product);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="search-modal active" onClick={handleContainerClick}>
      <div className="search-content">
        <div className="search-header">
          <input
            id="searchInput"
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="close-search" type="button" onClick={onClose}>
            <i className="fas fa-times" aria-hidden="true" />
            <span className="sr-only">Cerrar busqueda</span>
          </button>
        </div>
        <div className="search-results" id="searchResults">
          {query.trim().length === 0 && <p className="search-hint">Escribe al menos 2 caracteres para buscar</p>}
          {query.trim().length > 0 && query.trim().length < 2 && (
            <p className="search-hint">Sigue escribiendo para ver resultados.</p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="no-results">No se encontraron productos</p>
          )}
          {results.map((product) => (
            <button
              key={product.id}
              className="search-result-item"
              type="button"
              onClick={() => handleSelect(product)}
            >
              <img src={product.image} alt={product.name} loading="lazy" />
              <div className="result-info">
                <h4>{product.name}</h4>
                <p>${product.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
