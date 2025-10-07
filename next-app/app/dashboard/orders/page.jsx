import BackBar from "@/components/BackBar";
import { getOrdersOverview } from "@/lib/admin";

export const metadata = {
  title: "Gestionar pedidos | Artesanias Bella Vista"
};

export default async function DashboardOrdersPage() {
  const { orders, stats } = await getOrdersOverview();

  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Pedidos</h1>
          <p>Consulta el estado y progreso de los pedidos realizados en la tienda.</p>
        </div>

        <div className="metrics-grid">
          {stats.map((item) => (
            <article key={item.label} className="metric-card small">
              <div className="metric-icon" aria-hidden="true">
                <i className={item.icon} />
              </div>
              <div>
                <p className="metric-label">{item.label}</p>
                <p className="metric-value">{item.value}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="panel-card">
          <header className="panel-header">
            <h2>Listado de pedidos</h2>
            <p className="panel-hint">Actualizado en tiempo real cuando se confirmen pagos.</p>
          </header>
          <div className="table-wrapper">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Metodo</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-row">
                      Aun no hay pedidos registrados.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <strong>{order.customer}</strong>
                        <p className="panel-hint">{order.email}</p>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.total}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.paymentMethod}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
