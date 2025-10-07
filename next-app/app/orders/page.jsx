import BackBar from "@/components/BackBar";

export default function OrdersPage() {
  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Mis pedidos</h1>
          <p>Consulta el estado de tus pedidos recientes y su historial.</p>
        </div>
        <article className="panel-card">
          <p>
            Aun no hemos conectado esta vista a la base de datos. Cuando se integre, aqui veras tus pedidos, estados y
            detalles de entrega.
          </p>
        </article>
      </div>
    </section>
  );
}


