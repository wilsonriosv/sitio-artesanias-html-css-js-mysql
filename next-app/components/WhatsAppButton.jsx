"use client";

import { useCart } from "@/components/CartContext";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_PHONE = "1234567890";

export default function WhatsAppButton({ phoneNumber = DEFAULT_PHONE }) {
  const { cart, cartTotal, cartCount } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartCount === 0) {
      return;
    }
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 3000);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const whatsappMessage = useMemo(() => {
    if (cart.length === 0) {
      return "¡Hola! Me interesa conocer más sobre sus productos.";
    }
    const lines = ["¡Hola! Me gustaría realizar el siguiente pedido:", ""];
    cart.forEach((item) => {
      const subtotal = (item.price * item.quantity).toFixed(2);
      lines.push(`• ${item.name} x${item.quantity} - $${subtotal}`);
    });
    lines.push("", `TOTAL: $${cartTotal.toFixed(2)}`, "", "Por favor, quisiera coordinar el pago y envío.");
    return lines.join("\n");
  }, [cart, cartTotal]);

  const whatsappHref = useMemo(() => {
    const encoded = encodeURIComponent(whatsappMessage);
    return `https://wa.me/${phoneNumber}?text=${encoded}`;
  }, [phoneNumber, whatsappMessage]);

  return (
    <a
      href={whatsappHref}
      className={`whatsapp-float${animate ? " has-items" : ""}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <i className="fab fa-whatsapp" aria-hidden="true" />
      <span className="whatsapp-status" aria-hidden="true" />
    </a>
  );
}



