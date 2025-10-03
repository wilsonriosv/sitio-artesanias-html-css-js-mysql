"use client";

import { useState } from "react";

export default function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    onSubscribe(email.trim());
    setEmail("");
  };

  return (
    <section className="newsletter" id="contact">
      <div className="container">
        <div className="newsletter-content">
          <h2>Suscríbete a nuestro Newsletter</h2>
          <p>Recibe las últimas novedades y ofertas exclusivas</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>
    </section>
  );
}



