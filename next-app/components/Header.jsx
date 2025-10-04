"use client";

import { useEffect, useRef, useState } from "react";

export default function Header({ cartCount, cartBump, onOpenCart, onOpenSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userMenuOpen]);

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
            <span>Artesanias Bella Vista</span>
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
                  Categorias
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
            <div className={`user-menu${userMenuOpen ? " open" : ""}`} ref={userMenuRef}>
              <button
                className="icon-btn user-menu-btn"
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <i className="fas fa-user-circle" aria-hidden="true" />
                <span className="sr-only">Abrir menu de usuario</span>
              </button>
              <div className="user-menu-dropdown" role="menu">
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Iniciar sesion
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Registrarse
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Configuracion de tema
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Ver o actualizar perfil
                </button>
                <div className="user-menu-divider" role="separator" />
                <p className="user-menu-label">Accesos de administracion</p>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Panel de control
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Gestionar productos
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Gestionar pedidos
                </button>
                <button type="button" className="user-menu-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  Gestion general de tienda
                </button>
              </div>
            </div>
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
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

