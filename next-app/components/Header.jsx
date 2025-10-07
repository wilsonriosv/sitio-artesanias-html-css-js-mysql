"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  const [first, second] = parts;
  const initials = [first?.[0], second?.[0]].filter(Boolean).join("").toUpperCase();
  return initials || "U";
}

export default function Header({ cartCount, cartBump, onOpenCart, onOpenSearch }) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
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
    document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.replace("/login");
  };

  const closeUserMenu = () => setUserMenuOpen(false);
  const initials = getInitials(user?.name);
  const avatarUrl = user?.avatarUrl || user?.avatar_url || user?.image || user?.photoUrl;
  const isAdmin = user?.role === "admin";

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
                className={`icon-btn user-menu-btn${isAuthenticated ? " authenticated" : ""}`}
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                {isAuthenticated ? (
                  avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name || "Usuario"} className="user-avatar" />
                  ) : (
                    <span className="user-badge" aria-hidden="true">{initials}</span>
                  )
                ) : (
                  <i className="fas fa-user-circle" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {isAuthenticated ? "Abrir menu de cuenta" : "Abrir menu de usuario"}
                </span>
              </button>
              <div className="user-menu-dropdown" role="menu">
                {isAuthenticated ? (
                  <>
                    <p className="user-menu-label">
                      {user?.name ? `Hola, ${user.name.split(" ")[0]}` : "Tu cuenta"}
                    </p>
                    <Link
                      href="/profile"
                      className="user-menu-item"
                      role="menuitem"
                      onClick={closeUserMenu}
                    >
                      Ver o actualizar perfil
                    </Link>
                    <Link
                      href="/orders"
                      className="user-menu-item"
                      role="menuitem"
                      onClick={closeUserMenu}
                    >
                      Mis pedidos
                    </Link>
                    <Link
                      href="/settings"
                      className="user-menu-item"
                      role="menuitem"
                      onClick={closeUserMenu}
                    >
                      Preferencias y tema
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="user-menu-divider" role="separator" />
                        <p className="user-menu-label">Administracion</p>
                        <Link
                          href="/dashboard"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Panel principal
                        </Link>
                        <Link
                          href="/dashboard/products"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Gestionar productos
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Gestionar pedidos
                        </Link>
                        <Link
                          href="/dashboard/customers"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Gestionar clientes
                        </Link>
                        <Link
                          href="/dashboard/inventory"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Inventario y stock
                        </Link>
                        <Link
                          href="/dashboard/analytics"
                          className="user-menu-item"
                          role="menuitem"
                          onClick={closeUserMenu}
                        >
                          Estadisticas y reportes
                        </Link>
                      </>
                    )}
                    <div className="user-menu-divider" role="separator" />
                    <button type="button" className="user-menu-item logout" onClick={handleLogout}>
                      Cerrar sesion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="user-menu-item"
                      role="menuitem"
                      onClick={closeUserMenu}
                    >
                      Iniciar sesion
                    </Link>
                    <Link
                      href="/register"
                      className="user-menu-item"
                      role="menuitem"
                      onClick={closeUserMenu}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
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


