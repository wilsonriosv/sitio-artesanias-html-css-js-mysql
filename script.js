// Variables globales
let cart = [];
let products = [];

// Productos de ejemplo
const sampleProducts = [
    {
        id: 1,
        name: "Pulsera de Plata Artesanal",
        price: 45.99,
        category: "joyeria",
        gender: "mujer",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
        description: "Pulsera hecha a mano con plata 925"
    },
    {
        id: 2,
        name: "Reloj de Madera Natural",
        price: 89.99,
        category: "relojes",
        gender: "hombre",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
        description: "Reloj ecológico de bambú"
    },
    {
        id: 3,
        name: "Collar con Piedras Naturales",
        price: 35.50,
        category: "joyeria",
        gender: "mujer",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
        description: "Collar con cuarzo rosa natural"
    },
    {
        id: 4,
        name: "Anillo de Cobre Martillado",
        price: 25.00,
        category: "joyeria",
        gender: "todos",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        description: "Anillo unisex hecho a mano"
    },
    {
        id: 5,
        name: "Zapatos Artesanales de Cuero",
        price: 120.00,
        category: "zapatos",
        gender: "hombre",
        image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400",
        description: "Zapatos 100% cuero genuino"
    },
    {
        id: 6,
        name: "Bolso Tejido a Mano",
        price: 65.00,
        category: "accesorios",
        gender: "mujer",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
        description: "Bolso artesanal de fibras naturales"
    },
    {
        id: 7,
        name: "Camisa Bordada Infantil",
        price: 40.00,
        category: "ropa",
        gender: "nino",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
        description: "Camisa con bordados tradicionales"
    },
    {
        id: 8,
        name: "Sombrero de Paja Artesanal",
        price: 55.00,
        category: "accesorios",
        gender: "todos",
        image: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400",
        description: "Sombrero tejido a mano"
    }
];

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Cargar productos
    products = sampleProducts;
    renderProducts(products);

    // Event listeners
    setupEventListeners();

    // Cargar carrito desde localStorage
    loadCartFromStorage();

    // Inicializar animaciones
    initAnimations();
});

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Carrito
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');

    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCart();
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterProducts(filter);

            // Actualizar botón activo
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Cards de categorías
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category === 'todos') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }

            // Scroll a productos
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // CTA Button
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });

    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showNotification('¡Gracias por suscribirte! Te enviaremos las últimas novedades.');
        e.target.reset();
    });
}

// Renderizar productos
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToRender.forEach((product, index) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);

        // Animación de entrada
        setTimeout(() => {
            productCard.classList.add('show');
        }, index * 100);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name} loading="lazy"">
            <div class="product-overlay">
                <button class="quick-view" onclick="quickView(${product.id})">
                    <i class="fas fa-eye"></i> Vista Rápida
                </button>
            </div>
        </div>
        <div class="product-info">
            <h4>${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

// Filtrar productos
function filterProducts(filter) {
    let filtered;

    if (filter === 'todos') {
        filtered = products;
    } else {
        filtered = products.filter(p => p.gender === filter || p.gender === 'todos');
    }

    renderProducts(filtered);
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} agregado al carrito`);

    // Animación del botón de carrito
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 600);
}

// Actualizar contador del carrito
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Renderizar carrito
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Actualizar cantidad en el carrito
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartCount();
        renderCart();
        saveCartToStorage();
    }
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    saveCartToStorage();
    showNotification('Producto eliminado del carrito');
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('artesaniasCart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('artesaniasCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Vista rápida del producto
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Crear modal de vista rápida
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">
                &times;
            </button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name} loading="lazy"">
                </div>
                <div class="quick-view-info">
                    <h2>${product.name}</h2>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); this.closest('.quick-view-modal').remove()">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Inicializar animaciones
function initAnimations() {
    // Animación de elementos flotantes en el hero
    const floatingItems = document.querySelectorAll('.floating-item');
    floatingItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.5}s`;
    });

    // Intersection Observer para animaciones al scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos
    document.querySelectorAll('.category-card, .product-card, .about-content, .newsletter').forEach(el => {
        observer.observe(el);
    });
}

// Efecto parallax en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Cambiar estilo del header al hacer scroll
    const header = document.querySelector('.header');
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Funcionalidad de búsqueda
document.querySelector('.search-btn').addEventListener('click', () => {
    createSearchModal();
});

function createSearchModal() {
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-content">
            <div class="search-header">
                <input type="text" id="searchInput" placeholder="Buscar productos..." autofocus>
                <button class="close-search" onclick="this.closest('.search-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results" id="searchResults"></div>
        </div>
    `;

    document.body.appendChild(searchModal);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.remove();
        }
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');

    if (query.length < 2) {
        searchResults.innerHTML = '<p class="search-hint">Escribe al menos 2 caracteres para buscar</p>';
        return;
    }

    const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No se encontraron productos</p>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name} loading="lazy"">
            <div class="result-info">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    document.querySelector('.search-modal').remove();
    quickView(productId);
}

// Checkout simulado
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }

    // Mostrar modal de checkout con WhatsApp
    showCheckoutModal();
});

// Animación de carga de página
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy loading de imágenes
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyImageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => lazyImageObserver.observe(img));


// Agregar al final del script.js existente

// Lazy loading mejorado con fallback
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback para navegadores que no soportan lazy loading nativo
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// Mejorar rendimiento con debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce al scroll
const debouncedScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    const header = document.querySelector('.header');
    if (scrolled > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 16);

window.addEventListener('scroll', debouncedScroll);

// Mejorar la experiencia móvil
function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (detectMobile()) {
    document.body.classList.add('is-mobile');
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();

    // Prevenir el zoom en inputs en iOS
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
        input.style.fontSize = '16px';
    });
});

// Nueva función para mostrar el modal de checkout
function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const checkoutDetails = document.getElementById('checkoutDetails');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const whatsappBtn = document.getElementById('whatsappCheckoutBtn');

    // Limpiar detalles anteriores
    checkoutDetails.innerHTML = '';

    // Generar mensaje para WhatsApp
    let whatsappMessage = '¡Hola! Me gustaría realizar el siguiente pedido:\n\n';
    let total = 0;

    // Mostrar productos en el modal y construir mensaje
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // Agregar al modal
        const productDiv = document.createElement('div');
        productDiv.className = 'checkout-product';
        productDiv.innerHTML = `
            <span class="checkout-product-name">${item.name}</span>
            <span class="checkout-product-qty">x${item.quantity}</span>
            <span class="checkout-product-price">$${itemTotal.toFixed(2)}</span>
        `;
        checkoutDetails.appendChild(productDiv);

        // Agregar al mensaje de WhatsApp
        whatsappMessage += `• ${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
    });

    // Agregar total al mensaje
    whatsappMessage += `\n*TOTAL: $${total.toFixed(2)}*\n\n`;
    whatsappMessage += 'Por favor, quisiera coordinar el pago y envío.';

    // Mostrar total en el modal
    checkoutTotal.innerHTML = `Total a pagar: <strong>$${total.toFixed(2)}</strong>`;

    // Configurar enlace de WhatsApp
    const phoneNumber = '1234567890'; // Cambiar por tu número real
    const encodedMessage = encodeURIComponent(whatsappMessage);
    whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Mostrar modal
    modal.classList.add('active');

    // Cerrar el carrito si está abierto
    document.getElementById('cartModal').classList.remove('active');
}

// Event listener para cerrar el modal de checkout
document.getElementById('closeCheckoutModal').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('active');
});

// Cerrar modal al hacer clic fuera
document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('active');
    }
});

// Event listener para el botón de WhatsApp del checkout
document.getElementById('whatsappCheckoutBtn').addEventListener('click', () => {
    // Opcional: Limpiar el carrito después de redirigir a WhatsApp
    setTimeout(() => {
        if (confirm('¿Ya completaste tu pedido por WhatsApp?')) {
            cart = [];
            updateCartCount();
            renderCart();
            saveCartToStorage();
            document.getElementById('checkoutModal').classList.remove('active');
            showNotification('¡Gracias por tu compra! Te contactaremos pronto.');
        }
    }, 1000);
});

// Agregar animación al botón de WhatsApp cuando hay items en el carrito
function updateWhatsAppButton() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (cartCount > 0) {
        whatsappFloat.classList.add('has-items');

        // Remover la animación después de 3 segundos
        setTimeout(() => {
            whatsappFloat.classList.remove('has-items');
        }, 3000);
    }
}

// Modificar la función addToCart existente para incluir la animación de WhatsApp
const originalAddToCart = addToCart;
addToCart = function (productId) {
    originalAddToCart(productId);
    updateWhatsAppButton();
};

// Modificar la función updateQuantity para incluir la animación
const originalUpdateQuantity = updateQuantity;
updateQuantity = function (productId, change) {
    originalUpdateQuantity(productId, change);
    updateWhatsAppButton();
};

// Configurar el número de WhatsApp desde una variable global
const WHATSAPP_NUMBER = '1234567890'; // CAMBIAR POR TU NÚMERO REAL (sin + ni espacios)

// Actualizar el href del botón flotante de WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        const defaultMessage = 'Hola! Me interesa conocer más sobre sus productos artesanales.';
        whatsappFloat.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;
    }
});

// Función para formatear el número de teléfono (opcional)
function formatPhoneNumber(number) {
    // Eliminar caracteres no numéricos
    return number.replace(/\D/g, '');
}

// Agregar tooltips al botón de WhatsApp
const style = document.createElement('style');
style.textContent = `
    .whatsapp-float::before {
        content: 'Chatea con nosotros';
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: #333;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        font-size: 0.9rem;
    }
    
    .whatsapp-float::after {
        content: '';
        position: absolute;
        right: 65px;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-left-color: #333;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    
    .whatsapp-float:hover::before,
    .whatsapp-float:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Función para verificar si WhatsApp está disponible en el dispositivo
function isWhatsAppAvailable() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod/i.test(userAgent);
}

// Mejorar la experiencia en dispositivos móviles
if (isWhatsAppAvailable()) {
    // En móviles, usar el protocolo whatsapp:// en lugar de wa.me
    document.addEventListener('DOMContentLoaded', () => {
        const whatsappLinks = document.querySelectorAll('[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const message = new URL(href).searchParams.get('text') || '';
                window.location.href = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${message}`;
            });
        });
    });
}

// Función para rastrear clicks en WhatsApp (para analytics)
function trackWhatsAppClick(action) {
    // Si tienes Google Analytics instalado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'WhatsApp',
            'event_label': action
        });
    }

    // O si prefieres usar un sistema propio
    console.log(`WhatsApp click: ${action}`);
}

// Agregar tracking a los botones de WhatsApp
document.querySelector('.whatsapp-float').addEventListener('click', () => {
    trackWhatsAppClick('floating_button');
});

// Función para mostrar un mensaje de confirmación mejorado
function showCheckoutConfirmation() {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal';
    confirmModal.innerHTML = `
        <div class="confirm-content">
            <i class="fas fa-check-circle"></i>
            <h3>¿Completaste tu pedido?</h3>
            <p>Si ya enviaste tu pedido por WhatsApp, podemos limpiar tu carrito.</p>
            <div class="confirm-buttons">
                <button class="confirm-yes">Sí, limpiar carrito</button>
                <button class="confirm-no">No, mantener items</button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmModal);

    // Agregar estilos para el modal de confirmación
    const confirmStyles = document.createElement('style');
    confirmStyles.textContent = `
        .confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .confirm-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            animation: slideUpModal 0.3s ease;
        }
        
        .confirm-content i {
            font-size: 3rem;
            color: #25D366;
            margin-bottom: 1rem;
        }
        
        .confirm-content h3 {
            margin-bottom: 1rem;
            color: var(--secondary-color);
        }
        
        .confirm-content p {
            color: #666;
            margin-bottom: 1.5rem;
        }
        
        .confirm-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .confirm-buttons button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .confirm-yes {
            background: var(--primary-color);
            color: white;
        }
        
        .confirm-yes:hover {
            background: var(--secondary-color);
        }
        
        .confirm-no {
            background: #e0e0e0;
            color: #666;
        }
        
        .confirm-no:hover {
            background: #ccc;
        }
    `;
    document.head.appendChild(confirmStyles);

    // Event listeners para los botones
    confirmModal.querySelector('.confirm-yes').addEventListener('click', () => {
        cart = [];
        updateCartCount();
        renderCart();
        saveCartToStorage();
        document.getElementById('checkoutModal').classList.remove('active');
        showNotification('¡Gracias por tu compra! Te contactaremos pronto por WhatsApp.');
        confirmModal.remove();
    });

    confirmModal.querySelector('.confirm-no').addEventListener('click', () => {
        confirmModal.remove();
    });
}

// Reemplazar el setTimeout del whatsappCheckoutBtn con esta versión mejorada
document.getElementById('whatsappCheckoutBtn').addEventListener('click', () => {
    trackWhatsAppClick('checkout_button');

    // Mostrar confirmación después de 3 segundos
    setTimeout(() => {
        showCheckoutConfirmation();
    }, 3000);
});

// Agregar indicador de estado online/offline para WhatsApp
function addWhatsAppStatus() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const statusDot = document.createElement('span');
    statusDot.className = 'whatsapp-status';
    whatsappFloat.appendChild(statusDot);

    // Agregar estilos para el indicador
    const statusStyles = document.createElement('style');
    statusStyles.textContent = `
        .whatsapp-status {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 12px;
            height: 12px;
            background: #4FCE5D;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(79, 206, 93, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(79, 206, 93, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(79, 206, 93, 0);
            }
        }
    `;
    document.head.appendChild(statusStyles);
}

// Inicializar el indicador de estado cuando cargue la página
document.addEventListener('DOMContentLoaded', addWhatsAppStatus);

document.addEventListener('DOMContentLoaded', () => {
    const virtualAgentBtn = document.getElementById('virtualAgentBtn');

    virtualAgentBtn.addEventListener('click', () => {
        // Aquí puedes implementar la lógica para abrir el chat del agente virtual
        alert('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?');
    });
});