"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudo crear la cuenta.");
        }

        setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesion.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } catch (submitError) {
        setError(submitError.message);
      }
    });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Crea tu cuenta</h1>
        <p className="auth-subtitle">
          Registrate para disfrutar de pedidos rapidos y gestionar tu perfil.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="name">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            className="auth-input"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

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
            placeholder="Elige una contrasena segura"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <label className="auth-label" htmlFor="confirmPassword">
            Confirmar contrasena
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="auth-input"
            placeholder="Repite tu contrasena"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="auth-button" type="submit" disabled={isPending}>
            {isPending ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        {error && <p className="auth-feedback error">{error}</p>}
        {success && <p className="auth-feedback success">{success}</p>}

        <div className="auth-links">
          <Link href="/login">Ya tienes cuenta? Inicia sesion</Link>
        </div>
      </div>
    </section>
  );
}
