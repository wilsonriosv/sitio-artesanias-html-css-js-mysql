import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata = {
  title: "Artesanías Bella Vista - Tienda Online",
  description:
    "Descubre piezas de joyería y accesorios artesanales únicos de Artesanías Bella Vista. Compra online con confianza."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
