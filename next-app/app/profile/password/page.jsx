"use client";

import Link from "next/link";
import BackBar from "@/components/BackBar";
import ProfilePasswordForm from "@/components/profile/ProfilePasswordForm";

export default function ProfilePasswordPage() {
  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Cambiar contrasena</h1>
          <p>Actualiza tu contrasena para mantener segura tu cuenta.</p>
        </div>

        <div className="dashboard-grid">
          <ProfilePasswordForm />
        </div>

        <div className="panel-card info-card">
          <h2>Accesos rapidos</h2>
          <div className="profile-links">
            <Link href="/profile">Volver al perfil</Link>
            <Link href="/orders">Ver mis pedidos</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
