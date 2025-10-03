"use client";

import { useCart } from "@/components/CartContext";
import { useEffect } from "react";

export default function CartModal({
  isOpen,
  onClose,
  onCheckout,
  onRemoveItem,
  onChangeQuantity
}) {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleContainerClick = (event) => {
    if (event.target.classList.contains("cart-modal")) {
      onClose();
    }
  };

  const handleQuantityChange = (id, delta) => {
    if (onChangeQuantity) {
      onChangeQuantity(id, delta);
    } else {
      updateQuantity(id, delta);
    }
  };

  const handleRemove = (id) => {
    if (onRemoveItem) {
      onRemoveItem(id);
    } else {
      removeFromCart(id);
    }
  };

  return (
    <div className={`cart-modal${isOpen ? " active" : ""}`} onClick={handleContainerClick}>
      <div className="cart-content" role="dialog" aria-modal="true">
        <div className="cart-header">
          <h3>Tu Carrito</h3>
          <button className="close-cart" type="button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button type="button" onClick={() => handleQuantityChange(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => handleQuantityChange(item.id, 1)}>
                    +
                  </button>
                </div>
                <button className="remove-item" type="button" onClick={() => handleRemove(item.id)}>
                  <i className="fas fa-trash" aria-hidden="true" />
                  <span className="sr-only">Eliminar</span>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span id="cartTotal">${cartTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" type="button" onClick={onCheckout}>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}



