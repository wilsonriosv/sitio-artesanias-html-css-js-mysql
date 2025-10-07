"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

const INITIAL_PASSWORDS = { current: "", next: "", confirm: "" };

export default function ProfilePasswordForm() {
  const { user } = useAuth();
  const userId = user?.id;

  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId) return;
    setFeedback("");

    if (passwords.next !== passwords.confirm) {
      setFeedback("Las contrasenas nuevas no coinciden.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, current: passwords.current, next: passwords.next })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar la contrasena.");
      }
      setFeedback("Contrasena actualizada correctamente.");
      setPasswords(INITIAL_PASSWORDS);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="panel-card">
      <h2>Actualizar contrasena</h2>
      <form className="panel-form" onSubmit={handleSubmit}>
        <label className="panel-label" htmlFor="currentPassword">
          Contrasena actual
        </label>
        <input
          id="currentPassword"
          className="panel-input"
          type="password"
          value={passwords.current}
          onChange={handleChange("current")}
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
          onChange={handleChange("next")}
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
          onChange={handleChange("confirm")}
          autoComplete="new-password"
          required
        />

        <button className="panel-button" type="submit" disabled={isSaving}>
          {isSaving ? "Actualizando..." : "Actualizar contrasena"}
        </button>
        {feedback && <p className="panel-feedback">{feedback}</p>}
      </form>
    </article>
  );
}

