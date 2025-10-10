"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import CheckoutModal from "@/components/CheckoutModal";
import SearchModal from "@/components/SearchModal";
import QuickViewModal from "@/components/QuickViewModal";
import NotificationStack from "@/components/NotificationStack";
import VirtualAgentButton from "@/components/VirtualAgentButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider, useCart } from "@/components/CartContext";
import { categories } from "@/data/products";

function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedGender, setSelectedGender] = useState("todos");
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [cartBump, setCartBump] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const { addToCart, cart, cartCount, clearCart, removeFromCart, updateQuantity } = useCart();

  const bumpTimerRef = useRef(null);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "todos") {
      list = list.filter((product) => product.category === selectedCategory);
    }

    if (selectedGender !== "todos") {
      list = list.filter(
        (product) => product.gender === selectedGender || product.gender === "todos"
      );
    }

    return list;
  }, [products, selectedCategory, selectedGender]);

  const addNotification = useCallback((message, duration = 3200) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((prev) => [...prev, { id, message, duration }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const triggerCartBump = useCallback(() => {
    setCartBump(true);
    if (bumpTimerRef.current) {
      clearTimeout(bumpTimerRef.current);
    }
    bumpTimerRef.current = setTimeout(() => {
      setCartBump(false);
      bumpTimerRef.current = null;
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (bumpTimerRef.current) {
        clearTimeout(bumpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        if (mounted) {
          setIsLoadingProducts(true);
        }
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("No se pudieron obtener los productos");
        const data = await response.json();
        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error(error);
        addNotification("No se pudieron cargar los productos.");
      } finally {
        if (mounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [addNotification]);

  const handleAddToCart = useCallback(
    (product, selectedOptions = []) => {
      addToCart(product, selectedOptions);
      const optionsSummary =
        Array.isArray(selectedOptions) && selectedOptions.length > 0
          ? ` (${selectedOptions.map((option) => `${option.label}: ${option.value}`).join(', ')})`
          : "";
      addNotification(`${product.name}${optionsSummary} agregado al carrito`);
      triggerCartBump();
    },
    [addToCart, addNotification, triggerCartBump]
  );

  const handleRemoveItem = useCallback(
    (uid) => {
      removeFromCart(uid);
      addNotification("Producto eliminado del carrito");
    },
    [removeFromCart, addNotification]
  );

  const handleQuantityChange = useCallback(
    (uid, delta) => {
      const item = cart.find((product) => product.uid === uid);
      if (!item) return;

      if (delta < 0 && item.quantity === 1) {
        removeFromCart(uid);
        addNotification("Producto eliminado del carrito");
        return;
      }

      updateQuantity(uid, delta);
    },
    [cart, removeFromCart, updateQuantity, addNotification]
  );

  const scrollToProducts = useCallback(() => {
    const section = document.getElementById("products");
    section?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setSelectedCategory(categoryId);
      scrollToProducts();
    },
    [scrollToProducts]
  );

  const handleGenderChange = useCallback((genderId) => {
    setSelectedGender(genderId);
  }, []);

  const handleCheckout = useCallback(() => {
    if (cartCount === 0) {
      addNotification("Tu carrito está vacío");
      return;
    }
    setCheckoutOpen(true);
    setCartOpen(false);
  }, [cartCount, addNotification]);

  const handleConfirmPurchase = useCallback(() => {
    clearCart();
    setCheckoutOpen(false);
    addNotification("¡Gracias por tu compra! Te contactaremos pronto por WhatsApp.", 4000);
  }, [clearCart, addNotification]);

  const handleVirtualAgent = useCallback(() => {
    alert("¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?");
  }, []);

  const handleSearchSelect = useCallback(
    (product) => {
      setQuickViewProduct(product);
    },
    []
  );

  useEffect(() => {
    document.body.classList.add("loaded");
    return () => {
      document.body.classList.remove("loaded");
    };
  }, []);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      document.body.classList.add("is-mobile");
    }
    return () => {
      document.body.classList.remove("is-mobile");
    };
  }, []);

  useEffect(() => {
    const floatingItems = document.querySelectorAll(".floating-item");
    floatingItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const elements = document.querySelectorAll(
      ".category-card, .product-card, .about-content, .newsletter"
    );
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [filteredProducts]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const hero = document.querySelector(".hero");
          if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if ("loading" in HTMLImageElement.prototype) {
      const lazyImages = document.querySelectorAll("img[loading=\"lazy\"]");
      lazyImages.forEach((image) => {
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [filteredProducts]);

  return (
    <>
      <Header
        cartCount={cartCount}
        cartBump={cartBump}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <main>
        <Hero onExplore={scrollToProducts} />
        <Categories
          categories={categories}
          activeCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
        <Products
          products={filteredProducts}
          selectedGender={selectedGender}
          onGenderChange={handleGenderChange}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          isLoading={isLoadingProducts}
        />
        <AboutSection />
        <Newsletter
          onSubscribe={(email) =>
            addNotification(`¡Gracias por suscribirte, ${email}! Te enviaremos las últimas novedades.`)
          }
        />
      </main>
      <Footer />

      <WhatsAppButton />
      <VirtualAgentButton onClick={handleVirtualAgent} />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        onRemoveItem={handleRemoveItem}
        onChangeQuantity={handleQuantityChange}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirmPurchase={handleConfirmPurchase}
      />

      <SearchModal
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={handleSearchSelect}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <NotificationStack notifications={notifications} onDismiss={removeNotification} />
    </>
  );
}

export default function Page() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
