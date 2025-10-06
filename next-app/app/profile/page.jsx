"use client";

import { useState, useTransition } from "react";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: ""
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [feedback, setFeedback] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handleProfileChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setFeedback("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile)
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudieron actualizar los datos.");
        }
        setFeedback("Perfil actualizado correctamente.");
      } catch (submitError) {
        setFeedback(submitError.message);
      }
    });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordFeedback("");
    if (passwords.next !== passwords.confirm) {
      setPasswordFeedback("Las contrasenas nuevas no coinciden.");
      return;
    }

    startPasswordTransition(async () => {
      try {
        const response = await fetch("/api/user/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwords)
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudo actualizar la contrasena.");
        }
        setPasswordFeedback("Contrasena actualizada correctamente.");
        setPasswords({ current: "", next: "", confirm: "" });
      } catch (submitError) {
        setPasswordFeedback(submitError.message);
      }
    });
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <h1>Mi perfil</h1>
        <p>Actualiza tu informacion personal y credenciales de acceso.</p>
      </div>

      <div className="dashboard-grid two-columns">
        <article className="panel-card">
          <h2>Datos personales</h2>
          <form className="panel-form" onSubmit={handleProfileSubmit}>
            <label className="panel-label" htmlFor="name">
              Nombre completo
            </label>
            <input
              id="name"
              className="panel-input"
              type="text"
              placeholder="Nombre y apellido"
              value={profile.name}
              onChange={handleProfileChange("name")}
              required
            />

            <label className="panel-label" htmlFor="email">
              Correo electronico
            </label>
            <input
              id="email"
              className="panel-input"
              type="email"
              placeholder="tucorreo@dominio.com"
              value={profile.email}
              onChange={handleProfileChange("email")}
              required
            />

            <label className="panel-label" htmlFor="phone">
              Telefono de contacto
            </label>
            <input
              id="phone"
              className="panel-input"
              type="tel"
              placeholder="000 000 0000"
              value={profile.phone}
              onChange={handleProfileChange("phone")}
            />

            <label className="panel-label" htmlFor="address">
              Direccion de envio
            </label>
            <input
              id="address"
              className="panel-input"
              type="text"
              placeholder="Calle, numero y referencia"
              value={profile.address}
              onChange={handleProfileChange("address")}
            />

            <div className="form-inline">
              <div>
                <label className="panel-label" htmlFor="city">
                  Ciudad
                </label>
                <input
                  id="city"
                  className="panel-input"
                  type="text"
                  placeholder="Ciudad"
                  value={profile.city}
                  onChange={handleProfileChange("city")}
                />
              </div>
              <div>
                <label className="panel-label" htmlFor="country">
                  Pais
                </label>
                <input
                  id="country"
                  className="panel-input"
                  type="text"
                  placeholder="Pais"
                  value={profile.country}
                  onChange={handleProfileChange("country")}
                />
              </div>
            </div>

            <button className="panel-button" type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
            {feedback && <p className="panel-feedback">{feedback}</p>}
          </form>
        </article>

        <article className="panel-card">
          <h2>Actualizar contrasena</h2>
          <form className="panel-form" onSubmit={handlePasswordSubmit}>
            <label className="panel-label" htmlFor="currentPassword">
              Contrasena actual
            </label>
            <input
              id="currentPassword"
              className="panel-input"
              type="password"
              value={passwords.current}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, current: event.target.value }))
              }
              autoComplete="current-password"
              required
            />

            <label className="panel-label" htmlFor="newPassword">
              Nueva contrasena
            </label>
            <input
              id="newPassword"
              className="panel-input"
              type="password"
              value={passwords.next}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, next: event.target.value }))
              }
              autoComplete="new-password"
              required
            />

            <label className="panel-label" htmlFor="confirmPassword">
              Confirmar nueva contrasena
            </label>
            <input
              id="confirmPassword"
              className="panel-input"
              type="password"
              value={passwords.confirm}
              onChange={(event) =>
                setPasswords((prev) => ({ ...prev, confirm: event.target.value }))
              }
              autoComplete="new-password"
              required
            />

            <button className="panel-button" type="submit" disabled={isPasswordPending}>
              {isPasswordPending ? "Actualizando..." : "Actualizar contrasena"}
            </button>
            {passwordFeedback && <p className="panel-feedback">{passwordFeedback}</p>}
          </form>
        </article>
      </div>
    </section>
  );
}
