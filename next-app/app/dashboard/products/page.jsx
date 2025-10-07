import BackBar from "@/components/BackBar";
import ProductsManager from "@/components/dashboard/ProductsManager";
import { getProductsOverview } from "@/lib/admin";

export const metadata = {
  title: "Administrar productos | Artesanias Bella Vista"
};

export default async function DashboardProductsPage() {
  const { products, categories } = await getProductsOverview();

  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Gestion de productos</h1>
          <p>Agrega, actualiza y controla el inventario de tu catalogo.</p>
        </div>

        <ProductsManager initialProducts={products} categories={categories} />
      </div>
    </section>
  );
}
