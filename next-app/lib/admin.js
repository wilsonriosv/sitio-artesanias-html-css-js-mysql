import { query } from "@/lib/db";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value ?? 0);
}

function safeMetric(metric) {
  return {
    metrics: metric.metrics ?? [],
    recentOrders: metric.recentOrders ?? [],
    lowStock: metric.lowStock ?? []
  };
}

export async function getAdminOverview() {
  try {
    const [ordersCount] = await query("SELECT COUNT(*) AS total FROM orders", []);
    const [usersCount] = await query("SELECT COUNT(*) AS total FROM users", []);
    const [productsCount] = await query("SELECT COUNT(*) AS total FROM products", []);
    const topOrders = await query(
      `SELECT o.id, u.name AS customer, o.status, o.total_amount, o.created_at
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );
    const lowStock = await query(
      `SELECT id, name, sku, stock
       FROM products
       WHERE stock <= 5
       ORDER BY stock ASC
       LIMIT 5`
    );

    return safeMetric({
      metrics: [
        {
          label: "Pedidos",
          value: ordersCount.total,
          hint: "Registrados en la ultima semana",
          icon: "fas fa-receipt"
        },
        {
          label: "Clientes",
          value: usersCount.total,
          hint: "Usuarios activos",
          icon: "fas fa-user-friends"
        },
        {
          label: "Productos",
          value: productsCount.total,
          hint: "Publicados en catalogo",
          icon: "fas fa-box"
        }
      ],
      recentOrders: topOrders.map((order) => ({
        id: order.id,
        customer: order.customer,
        date: new Date(order.created_at).toLocaleDateString("es-MX"),
        total: formatCurrency(Number(order.total_amount ?? 0)),
        status: order.status ?? "Pendiente"
      })),
      lowStock: lowStock.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        stock: item.stock
      }))
    });
  } catch (error) {
    console.error("[admin.getAdminOverview]", error);
    return safeMetric({
      metrics: [
        { label: "Pedidos", value: 0, hint: "Sin datos", icon: "fas fa-receipt" },
        { label: "Clientes", value: 0, hint: "Sin datos", icon: "fas fa-user-friends" },
        { label: "Productos", value: 0, hint: "Sin datos", icon: "fas fa-box" }
      ],
      recentOrders: [],
      lowStock: []
    });
  }
}

export async function getProductsOverview() {
  try {
    const products = await query(
      `SELECT id, name, sku, price_cents, stock, category, active
       FROM products
       ORDER BY created_at DESC`
    );
    const categories = await query(
      "SELECT DISTINCT category FROM products ORDER BY category ASC"
    ).then((rows) => rows.map((row) => row.category));

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: (product.price_cents ?? 0) / 100,
        stock: product.stock ?? 0,
        active: Boolean(product.active)
      })),
      categories
    };
  } catch (error) {
    console.error("[admin.getProductsOverview]", error);
    return {
      products: [],
      categories: ["joyeria", "accesorios", "ropa"]
    };
  }
}

export async function getOrdersOverview() {
  try {
    const statsRows = await query(
      `SELECT
          SUM(total_amount) AS revenue,
          SUM(CASE WHEN status = 'Completado' THEN 1 ELSE 0 END) AS completed,
          SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS cancelled
        FROM orders`
    );
    const stats = statsRows[0] ?? {};

    const orders = await query(
      `SELECT o.id, u.name AS customer, u.email, o.status, o.total_amount, o.created_at, o.payment_method
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );

    return {
      stats: [
        { label: "Ingresos", value: formatCurrency(Number(stats.revenue ?? 0)), icon: "fas fa-sack-dollar" },
        { label: "Completados", value: stats.completed ?? 0, icon: "fas fa-check-circle" },
        { label: "Pendientes", value: stats.pending ?? 0, icon: "fas fa-hourglass-half" },
        { label: "Cancelados", value: stats.cancelled ?? 0, icon: "fas fa-times-circle" }
      ],
      orders: orders.map((order) => ({
        id: order.id,
        customer: order.customer,
        email: order.email,
        status: order.status ?? "Pendiente",
        total: formatCurrency(Number(order.total_amount ?? 0)),
        date: new Date(order.created_at).toLocaleString("es-MX"),
        paymentMethod: order.payment_method ?? "N/D"
      }))
    };
  } catch (error) {
    console.error("[admin.getOrdersOverview]", error);
    return {
      stats: [
        { label: "Ingresos", value: formatCurrency(0), icon: "fas fa-sack-dollar" },
        { label: "Completados", value: 0, icon: "fas fa-check-circle" },
        { label: "Pendientes", value: 0, icon: "fas fa-hourglass-half" },
        { label: "Cancelados", value: 0, icon: "fas fa-times-circle" }
      ],
      orders: []
    };
  }
}

export async function getCustomersOverview() {
  try {
    const customers = await query(
      `SELECT u.id, u.name, u.email, u.created_at,
              COUNT(o.id) AS orders,
              COALESCE(SUM(o.total_amount), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    const segments = await query(
      `SELECT name, description, customer_count
       FROM customer_segments
       ORDER BY customer_count DESC`
    ).catch(() => []);

    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        orders: customer.orders,
        totalSpent: formatCurrency(Number(customer.total_spent ?? 0)),
        joinedAt: new Date(customer.created_at).toLocaleDateString("es-MX")
      })),
      segments: segments.map((segment) => ({
        name: segment.name,
        description: segment.description,
        count: segment.customer_count
      }))
    };
  } catch (error) {
    console.error("[admin.getCustomersOverview]", error);
    return {
      customers: [],
      segments: []
    };
  }
}

export async function saveProduct(product) {
  try {
    const {
      id,
      name,
      sku,
      price,
      stock,
      category,
      description = "",
      active = true
    } = product;

    const priceCents = Math.round(Number(price ?? 0) * 100);
    const now = new Date();

    if (id) {
      await query(
        `UPDATE products
         SET name = ?, sku = ?, price_cents = ?, stock = ?, category = ?, description = ?, active = ?, updated_at = ?
         WHERE id = ?`,
        [name, sku, priceCents, stock, category, description, active ? 1 : 0, now, id]
      );
      return { updated: true };
    }

    const result = await query(
      `INSERT INTO products (name, sku, price_cents, stock, category, description, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, priceCents, stock, category, description, active ? 1 : 0, now, now]
    );
    return { created: true, id: result.insertId };
  } catch (error) {
    console.error("[admin.saveProduct]", error);
    throw new Error("No se pudo guardar el producto.");
  }
}
