"use client";

import { useEffect, useState } from "react";

export default function Header({ cartCount, cartBump, onOpenCart, onOpenSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [menuOpen]);

  const handleNavLinkClick = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-gem" aria-hidden="true" />
            <span>Artesanías Bella Vista</span>
          </div>
          <div className={`nav-menu${menuOpen ? " active" : ""}`} id="navMenu">
            <ul className="nav-list">
              <li>
                <a href="#home" className="nav-link" onClick={handleNavLinkClick}>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#categories" className="nav-link" onClick={handleNavLinkClick}>
                  Categorías
                </a>
              </li>
              <li>
                <a href="#products" className="nav-link" onClick={handleNavLinkClick}>
                  Productos
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link" onClick={handleNavLinkClick}>
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link" onClick={handleNavLinkClick}>
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div className="nav-icons">
            <button className="icon-btn search-btn" type="button" onClick={onOpenSearch}>
              <i className="fas fa-search" aria-hidden="true" />
              <span className="sr-only">Buscar productos</span>
            </button>
            <button
              className={`icon-btn cart-btn${cartBump ? " bounce" : ""}`}
              type="button"
              onClick={onOpenCart}
            >
              <i className="fas fa-shopping-cart" aria-hidden="true" />
              <span className="cart-count" id="cartCount">
                {cartCount}
              </span>
              <span className="sr-only">Abrir carrito</span>
            </button>
            <button
              className={`hamburger${menuOpen ? " active" : ""}`}
              id="hamburger"
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
              <span className="sr-only">Abrir menú</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}



