"use client";

import { useEffect, useState } from "react";
import BackBar from "@/components/BackBar";
import { useAuth } from "@/components/AuthContext";

const defaultPreferences = {
  theme: "light",
  language: "es",
  notifications: true,
  marketing: false
};

export default function SettingsPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/settings?userId=${userId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;
        if (data.preferences) {
          setPreferences((prev) => ({ ...prev, ...data.preferences }));
        }
      } catch (error) {
        console.error("[SettingsPage]", error);
      }
    }
    loadSettings();
    return () => {
      active = false;
    };
  }, [userId]);

  const updatePreference = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!userId) {
      setStatus("Falta el identificador de usuario");
      return;
    }
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...preferences })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudieron guardar los cambios.");
      }
      setStatus("Preferencias guardadas correctamente.");
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <section className="dashboard-page">
      <BackBar />
      <div className="narrow-container">
        <div className="dashboard-header">
          <h1>Preferencias de la cuenta</h1>
          <p>Personaliza la apariencia y notificaciones de tu experiencia en la tienda.</p>
        </div>

        <form className="panel-card preferences-card" onSubmit={handleSubmit}>
          <h2>Apariencia</h2>
          <label className="panel-label" htmlFor="theme">
            Tema de la interfaz
          </label>
          <select
            id="theme"
            className="panel-input"
            value={preferences.theme}
            onChange={updatePreference("theme")}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="system">Usar tema del sistema</option>
          </select>

          <h2>Idioma</h2>
          <label className="panel-label" htmlFor="language">
            Idioma preferido
          </label>
          <select
            id="language"
            className="panel-input"
            value={preferences.language}
            onChange={updatePreference("language")}
          >
            <option value="es">Espanol</option>
            <option value="en">Ingles</option>
          </select>

          <h2>Notificaciones</h2>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={updatePreference("notifications")}
            />
            <span>Recibir notificaciones sobre pedidos y envios</span>
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={updatePreference("marketing")}
            />
            <span>Recibir novedades y promociones exclusivas</span>
          </label>

          <button className="panel-button" type="submit">
            Guardar preferencias
          </button>
          {status && <p className="panel-feedback">{status}</p>}
        </form>
      </div>
    </section>
  );
}
