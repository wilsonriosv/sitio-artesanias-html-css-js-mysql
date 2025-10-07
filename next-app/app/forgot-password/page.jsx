"use client";

import { useState } from "react";
import Link from "next/link";
import BackBar from "@/components/BackBar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo procesar la solicitud.");
      }
      setMessage("Te hemos enviado un enlace para restablecer tu contrasena.");
      setEmail("");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <BackBar />
      <div className="narrow-container auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Recupera tu acceso</h1>
          <p className="auth-subtitle">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contrasena.
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

            <button className="auth-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          {message && <p className="auth-feedback success">{message}</p>}
          {error && <p className="auth-feedback error">{error}</p>}

          <div className="auth-links">
            <Link href="/login">Volver a iniciar sesion</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
