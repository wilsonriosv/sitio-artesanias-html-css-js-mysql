"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  loaded: false,
  lastAddedId: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const items = action.payload || [];
      return { ...state, items, loaded: true };
    }
    case "ADD": {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        const items = state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { ...state, items, lastAddedId: product.id };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
        lastAddedId: product.id
      };
    }
    case "REMOVE": {
      const items = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items };
    }
    case "UPDATE_QTY": {
      const { id, delta } = action.payload;
      const items = state.items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, items };
    }
    case "CLEAR": {
      return { ...state, items: [], lastAddedId: null };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("artesaniasCart");
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch({ type: "INIT", payload: parsed });
    } else {
      dispatch({ type: "INIT", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.loaded || typeof window === "undefined") return;
    window.localStorage.setItem("artesaniasCart", JSON.stringify(state.items));
  }, [state.items, state.loaded]);

  const cartCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity * item.price, 0),
    [state.items]
  );

  const value = {
    cart: state.items,
    cartCount,
    cartTotal,
    lastAddedId: state.lastAddedId,
    addToCart: (product) => dispatch({ type: "ADD", payload: product }),
    removeFromCart: (id) => dispatch({ type: "REMOVE", payload: id }),
    updateQuantity: (id, delta) => dispatch({ type: "UPDATE_QTY", payload: { id, delta } }),
    clearCart: () => dispatch({ type: "CLEAR" })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}



