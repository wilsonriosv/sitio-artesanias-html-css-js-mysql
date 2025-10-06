import { getCustomersOverview } from "@/lib/admin";

export const metadata = {
  title: "Clientes | Artesanias Bella Vista"
};

export default async function DashboardCustomersPage() {
  const { customers, segments } = await getCustomersOverview();

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <h1>Clientes y segmentos</h1>
        <p>Analiza el comportamiento de tus clientes y mejora tus campanas.</p>
      </div>

      <div className="dashboard-grid">
        <article className="panel-card">
          <h2>Segmentos destacados</h2>
          <ul className="panel-list">
            {segments.length === 0 ? (
              <li className="empty-row">Sin segmentos definidos todavia.</li>
            ) : (
              segments.map((segment) => (
                <li key={segment.name}>
                  <div>
                    <strong>{segment.name}</strong>
                    <p className="panel-hint">{segment.description}</p>
                  </div>
                  <span className="badge neutral">{segment.count} clientes</span>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="panel-card">
          <h2>Clientes registrados</h2>
          <div className="table-wrapper">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Pedidos</th>
                  <th>Total comprado</th>
                  <th>Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      No hay clientes registrados aun.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.orders}</td>
                      <td>{customer.totalSpent}</td>
                      <td>{customer.joinedAt}</td>
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
