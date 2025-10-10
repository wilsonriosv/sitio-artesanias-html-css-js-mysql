"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  loaded: false,
  lastAddedId: null
};

const slugifyKey = (value) =>
  value
    ?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "";

function buildOptionArray(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((option, index) => {
        if (!option) return null;
        const rawValue = option.value ?? option.selected ?? option.optionValue ?? "";
        const value = rawValue?.toString().trim();
        if (!value) {
          return null;
        }
        const label = (option.label ?? option.name ?? option.id ?? option.key ?? `Opción ${index + 1}`)
          .toString()
          .trim();
        const id = (option.id ?? option.key ?? slugifyKey(label) ?? `option-${index + 1}`)
          .toString()
          .trim();
        return {
          id: id || `option-${index + 1}`,
          label: label || id || `Opción ${index + 1}`,
          value
        };
      })
      .filter(Boolean);
  }

  if (typeof input === "object") {
    return Object.entries(input)
      .map(([key, value]) => {
        const normalizedValue = value?.toString().trim();
        if (!normalizedValue) {
          return null;
        }
        const label = key.toString().trim();
        return {
          id: slugifyKey(key) || label,
          label: label || key,
          value: normalizedValue
        };
      })
      .filter(Boolean);
  }

  return [];
}

function buildVariantKey(productId, options) {
  const base = productId != null ? String(productId) : "producto";
  if (!options || options.length === 0) {
    return base;
  }
  const suffix = options
    .map((option) => `${option.id || slugifyKey(option.label)}:${option.value}`)
    .sort()
    .join("|");
  return `${base}__${suffix}`;
}

function ensureCartItemShape(rawItem) {
  if (!rawItem || rawItem.id == null) {
    return null;
  }

  const selectedOptions = buildOptionArray(rawItem.selectedOptions ?? rawItem.options);
  const uid = rawItem.uid || buildVariantKey(rawItem.id, selectedOptions);
  const quantity = Number(rawItem.quantity ?? 1);
  const price = Number(rawItem.price ?? 0);

  return {
    uid,
    id: rawItem.id,
    slug: rawItem.slug ?? "",
    name: rawItem.name ?? "",
    price: Number.isFinite(price) ? price : 0,
    image: rawItem.image ?? "",
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    selectedOptions
  };
}

function migrateStoredItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => ensureCartItemShape(item))
    .filter(Boolean);
}

function createCartItem(payload) {
  if (!payload) {
    throw new Error("No se proporcionó el artículo a agregar al carrito.");
  }

  if (payload.item) {
    const shaped = ensureCartItemShape(payload.item);
    if (!shaped) {
      throw new Error("El artículo del carrito no es válido.");
    }
    const quantity = Number(payload.quantity ?? payload.item.quantity ?? 1);
    return {
      ...shaped,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1
    };
  }

  const product = payload.product ?? payload;
  if (!product || product.id == null) {
    throw new Error("Faltan datos del producto para el carrito.");
  }

  const selectedOptions = buildOptionArray(payload.selectedOptions ?? payload.options ?? []);
  const uid = buildVariantKey(product.id, selectedOptions);
  const quantity = Number(payload.quantity ?? 1);
  const price = Number(product.price ?? 0);

  return {
    uid,
    id: product.id,
    slug: product.slug ?? "",
    name: product.name ?? "Producto",
    price: Number.isFinite(price) ? price : 0,
    image: product.image ?? "",
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    selectedOptions
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const items = migrateStoredItems(action.payload);
      return { ...state, items, loaded: true };
    }
    case "ADD": {
      const item = createCartItem(action.payload);
      const existingIndex = state.items.findIndex((cartItem) => cartItem.uid === item.uid);

      if (existingIndex >= 0) {
        const items = state.items.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
        return { ...state, items, lastAddedId: item.uid };
      }

      return {
        ...state,
        items: [...state.items, item],
        lastAddedId: item.uid
      };
    }
    case "REMOVE": {
      const uid = action.payload;
      const items = state.items.filter((item) => item.uid !== uid);
      return { ...state, items };
    }
    case "UPDATE_QTY": {
      const { uid, delta } = action.payload;
      const numericDelta = Number(delta ?? 0);
      if (!Number.isFinite(numericDelta) || numericDelta === 0) {
        return state;
      }

      const items = state.items
        .map((item) =>
          item.uid === uid ? { ...item, quantity: item.quantity + numericDelta } : item
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
    try {
      const stored = window.localStorage.getItem("artesaniasCart");
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "INIT", payload: parsed });
      } else {
        dispatch({ type: "INIT", payload: [] });
      }
    } catch (error) {
      console.error("[CartProvider] No se pudo leer el carrito almacenado", error);
      dispatch({ type: "INIT", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.loaded || typeof window === "undefined") return;
    try {
      window.localStorage.setItem("artesaniasCart", JSON.stringify(state.items));
    } catch (error) {
      console.error("[CartProvider] No se pudo persistir el carrito", error);
    }
  }, [state.items, state.loaded]);

  const cartCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity * item.price, 0),
    [state.items]
  );

  const addToCart = (input, maybeSelectedOptions, extra = {}) => {
    if (input && typeof input === "object" && "product" in input) {
      dispatch({ type: "ADD", payload: input });
      return;
    }
    dispatch({
      type: "ADD",
      payload: {
        product: input,
        selectedOptions: maybeSelectedOptions,
        quantity: extra.quantity ?? 1
      }
    });
  };

  const removeFromCart = (uid) => dispatch({ type: "REMOVE", payload: uid });

  const updateQuantity = (uid, delta) => dispatch({ type: "UPDATE_QTY", payload: { uid, delta } });

  const value = {
    cart: state.items,
    cartCount,
    cartTotal,
    lastAddedId: state.lastAddedId,
    addToCart,
    removeFromCart,
    updateQuantity,
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


