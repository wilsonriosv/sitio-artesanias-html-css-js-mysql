import BackBar from "@/components/BackBar";

export const metadata = {
  title: "Inventario y stock | Artesanias Bella Vista"
};

export default function InventoryPage() {
  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Inventario y stock</h1>
          <p>Controla existencias, niveles de alerta y movimientos de inventario.</p>
        </div>
        <article className="panel-card">
          <p>
            En una version futura aqui podras ajustar stock, registrar entradas y generar reportes de inventario.
          </p>
        </article>
      </div>
    </section>
  );
}
