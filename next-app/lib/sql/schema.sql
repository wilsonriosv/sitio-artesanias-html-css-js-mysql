-- Esquema base para autenticación y administración de la tienda

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
    status ENUM('active','blocked') NOT NULL DEFAULT 'active',
    phone VARCHAR(45) NULL,
    address VARCHAR(180) NULL,
    city VARCHAR(90) NULL,
    country VARCHAR(90) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT UNSIGNED NOT NULL PRIMARY KEY,
    preferences JSON NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS password_resets (
    user_id INT UNSIGNED NOT NULL PRIMARY KEY,
    token CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    sku VARCHAR(90) NOT NULL UNIQUE,
    description TEXT,
    price_cents INT UNSIGNED NOT NULL,
    category VARCHAR(90) NOT NULL,
    gender VARCHAR(45) DEFAULT 'todos',
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    gallery_image_1 VARCHAR(255) NULL,
    gallery_image_2 VARCHAR(255) NULL,
    gallery_image_3 VARCHAR(255) NULL,
    variant_options JSON NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    status ENUM('Pendiente','Procesando','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(60) NULL,
    shipping_address JSON NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    selected_options JSON NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customer_segments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255) NULL,
    customer_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

