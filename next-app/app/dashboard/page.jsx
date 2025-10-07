import Link from "next/link";
import BackBar from "@/components/BackBar";
import { getAdminOverview } from "@/lib/admin";

export const metadata = {
  title: "Panel de administracion | Artesanias Bella Vista"
};

export default async function DashboardPage() {
  const overview = await getAdminOverview();
  const { metrics, recentOrders, lowStock } = overview;

  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Panel de administracion</h1>
          <p>Gestiona productos, pedidos y la actividad de la tienda desde un solo lugar.</p>
        </div>

        <div className="metrics-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <div className="metric-icon" aria-hidden="true">
                <i className={metric.icon} />
              </div>
              <div>
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
                <p className="metric-hint">{metric.hint}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="dashboard-grid">
          <article className="panel-card">
            <header className="panel-header">
              <h2>Pedidos recientes</h2>
              <Link href="/dashboard/orders" className="panel-link">
                Ver todos
              </Link>
            </header>
            <div className="table-wrapper">
              <table className="panel-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        No hay pedidos recientes.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{order.total}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel-card">
            <header className="panel-header">
              <h2>Inventario bajo</h2>
              <Link href="/dashboard/products" className="panel-link">
                Revisar inventario
              </Link>
            </header>
            <ul className="panel-list">
              {lowStock.length === 0 ? (
                <li className="empty-row">No se detectaron productos con inventario bajo.</li>
              ) : (
                lowStock.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p className="panel-hint">Slug: {item.slug ?? item.id}</p>
                    </div>
                    <span className="badge warning">{item.stock} uds</span>
                  </li>
                ))
              )}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}


