"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Por favor completa tu correo y contrasena.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudo iniciar sesion.");
        }

        setSuccess("Inicio de sesion exitoso. Redirigiendo...");
        // TODO: integrar navegacion real tras implementar sesiones
      } catch (submitError) {
        setError(submitError.message);
      }
    });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Inicia sesion</h1>
        <p className="auth-subtitle">
          Accede a tu cuenta para continuar comprando o administrar tu tienda.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="email">
            Correo electronico
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="tucorreo@dominio.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label className="auth-label" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="Ingresa tu contrasena"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="auth-button" type="submit" disabled={isPending}>
            {isPending ? "Validando..." : "Ingresar"}
          </button>
        </form>

        {error && <p className="auth-feedback error">{error}</p>}
        {success && <p className="auth-feedback success">{success}</p>}

        <div className="auth-links">
          <Link href="/forgot-password">Olvidaste tu contrasena?</Link>
          <Link href="/register">Crear una cuenta nueva</Link>
        </div>
      </div>
    </section>
  );
}
