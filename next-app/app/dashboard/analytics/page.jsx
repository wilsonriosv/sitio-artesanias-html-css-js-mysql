import BackBar from "@/components/BackBar";

export const metadata = {
  title: "Estadisticas y reportes | Artesanias Bella Vista"
};

export default function AnalyticsPage() {
  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Estadisticas y reportes</h1>
          <p>Visualiza el rendimiento de ventas, clientes y productos.</p>
        </div>
        <article className="panel-card">
          <p>
            Pronto mostraremos graficos y reportes conectados a tus datos reales para entender mejor la tienda.
          </p>
        </article>
      </div>
    </section>
  );
}
