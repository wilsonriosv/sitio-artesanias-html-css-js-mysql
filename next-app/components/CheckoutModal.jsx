"use client";

import { useCart } from "@/components/CartContext";
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_PHONE = "1234567890";

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirmPurchase,
  phoneNumber = DEFAULT_PHONE
}) {
  const { cart, cartTotal } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const whatsappMessage = useMemo(() => {
    if (cart.length === 0) {
      return "¡Hola! Me gustaría conocer más sobre sus productos.";
    }

    const lines = ["¡Hola! Me gustaría realizar el siguiente pedido:", ""];

    cart.forEach((item) => {
      const unitPrice = item.price.toFixed(2);
      const subtotal = (item.price * item.quantity).toFixed(2);
      lines.push(`- ${item.name}`);
      if (item.selectedOptions?.length) {
        item.selectedOptions.forEach((option) => {
          lines.push(`   * ${option.label}: ${option.value}`);
        });
      }
      lines.push(`   * Cantidad: ${item.quantity}`);
      lines.push(`   * Precio unitario: $${unitPrice}`);
      lines.push(`   * Subtotal: $${subtotal}`);
      lines.push("");
    });

    lines.push(`Total: $${cartTotal.toFixed(2)}`);
    lines.push("");
    lines.push("¿Me ayudas con el pago y envío?");

    return lines.join("\n");
  }, [cart, cartTotal]);

  const whatsappHref = useMemo(() => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, [phoneNumber, whatsappMessage]);

  const handleWhatsappClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setShowConfirmation(true);
      timerRef.current = null;
    }, 3000);
  };

  const handleContainerClick = (event) => {
    if (event.target.classList.contains("checkout-modal")) {
      onClose();
    }
  };

  return (
    <div className={`checkout-modal${isOpen ? " active" : ""}`} onClick={handleContainerClick}>
      <div className="checkout-modal-content" role="dialog" aria-modal="true">
        <button className="close-modal" id="closeCheckoutModal" type="button" onClick={onClose}>
          &times;
        </button>
        <div className="checkout-icon">
          <i className="fab fa-whatsapp" aria-hidden="true" />
        </div>
        <h2>¡Ya casi es tuyo!</h2>
        <p className="checkout-message">
          Para completar tu compra y coordinar el envío, por favor contáctanos por WhatsApp.
        </p>
        <div className="checkout-details" id="checkoutDetails">
          {cart.map((item) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            return (
              <div className="checkout-product" key={item.uid}>
                <div className="checkout-product-row">
                  <span className="checkout-product-name">{item.name}</span>
                  <span className="checkout-product-qty">x{item.quantity}</span>
                  <span className="checkout-product-price">${itemTotal}</span>
                </div>
                {item.selectedOptions?.length > 0 && (
                  <ul className="checkout-product-options">
                    {item.selectedOptions.map((option) => (
                      <li key={`${item.uid}-${option.id}`}>
                        <span className="checkout-product-option-label">{option.label}:</span> {option.value}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="checkout-total" id="checkoutTotal">
          Total a pagar: <strong>${cartTotal.toFixed(2)}</strong>
        </div>
        <a
          href={whatsappHref}
          id="whatsappCheckoutBtn"
          className="whatsapp-checkout-btn"
          target="_blank"
          rel="noreferrer"
          onClick={handleWhatsappClick}
        >
          <i className="fab fa-whatsapp" aria-hidden="true" />
          Continuar en WhatsApp
        </a>
        <p className="checkout-note">
          <i className="fas fa-lock" aria-hidden="true" /> Pago seguro y envío garantizado
        </p>

        {showConfirmation && (
          <div className="confirm-overlay">
            <div className="confirm-content">
              <i className="fas fa-check-circle" aria-hidden="true" />
              <h3>¿Completaste tu pedido?</h3>
              <p>Confírmanos para preparar tu paquete lo antes posible.</p>
              <div className="confirm-buttons">
                <button className="confirm-yes" type="button" onClick={onConfirmPurchase}>
                  Sí, listo
                </button>
                <button className="confirm-no" type="button" onClick={() => setShowConfirmation(false)}>
                  Aún no
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
