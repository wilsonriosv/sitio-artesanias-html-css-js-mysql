export function slugifyKey(value, fallback = "") {
  if (value == null) return fallback;
  const base = value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return base || fallback;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

export function buildVariantKey(optionOrder, valuesMap) {
  if (!Array.isArray(optionOrder) || optionOrder.length === 0) {
    return "";
  }
  return optionOrder
    .map((option) => {
      const id = option?.id ?? option;
      const value = valuesMap?.[id];
      return `${id}:${value ?? ""}`;
    })
    .join("|");
}

export function normalizeVariantOptions(raw) {
  const fallback = { enabled: false, options: [], variants: [], totalStock: 0 };

  if (raw == null || raw === "" || (typeof raw === "object" && Object.keys(raw).length === 0)) {
    return fallback;
  }

  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  // Allow legacy format where raw is an array of options only
  const rawOptions = Array.isArray(parsed?.options)
    ? parsed.options
    : Array.isArray(parsed)
    ? parsed
    : [];

  const optionIdSet = new Set();
  const options = rawOptions
    .map((option, index) => {
      if (!option) return null;
      const label = (option.label ?? option.name ?? option.id ?? `Opción ${index + 1}`)
        .toString()
        .trim();
      const id = slugifyKey(option.id ?? option.key ?? label, `option-${index + 1}`);
      const values = ensureArray(option.values)
        .map((value, valueIndex) => {
          if (value == null) return "";
          if (typeof value === "string") return value.trim();
          if (typeof value === "object" && value.value != null) return String(value.value).trim();
          return String(value).trim();
        })
        .filter(Boolean)
        .filter((value, valueIndex, array) => array.indexOf(value) === valueIndex);

      if (!label || values.length === 0) {
        return null;
      }

      const uniqueId = optionIdSet.has(id) ? `${id}-${index + 1}` : id;
      optionIdSet.add(uniqueId);

      return {
        id: uniqueId,
        label,
        values
      };
    })
    .filter(Boolean);

  if (options.length === 0) {
    return fallback;
  }

  const optionOrder = options.map((option) => option.id);

  const rawVariants = Array.isArray(parsed?.variants)
    ? parsed.variants
    : Array.isArray(parsed?.variantCombinations)
    ? parsed.variantCombinations
    : [];

  const variantMap = new Map();

  rawVariants.forEach((variant) => {
    if (!variant) return;
    const valuesSource = variant.values ?? variant.options ?? variant.attributes;
    if (!valuesSource || typeof valuesSource !== "object") return;

    const values = {};
    let valid = true;
    options.forEach((option) => {
      const valueFromId = valuesSource[option.id];
      const valueFromLabel = valuesSource[option.label];
      const value = valueFromId ?? valueFromLabel;
      const normalizedValue = value != null ? String(value).trim() : "";
      if (!normalizedValue || !option.values.includes(normalizedValue)) {
        valid = false;
      } else {
        values[option.id] = normalizedValue;
      }
    });

    if (!valid) return;

    const stockValue = Number(variant.stock ?? variant.quantity ?? variant.available ?? 0);
    const stock = Number.isFinite(stockValue) ? Math.max(0, Math.floor(stockValue)) : 0;

    const key = buildVariantKey(options, values);
    if (!key) return;

    const existing = variantMap.get(key);
    if (existing) {
      existing.stock += stock;
      return;
    }

    variantMap.set(key, {
      id: key,
      values,
      stock
    });
  });

  const variants = Array.from(variantMap.values());
  const totalStock = variants.reduce((sum, variant) => sum + (variant.stock ?? 0), 0);
  const enabled = Boolean(parsed?.enabled) && variants.length > 0;

  return {
    enabled,
    options,
    variants,
    totalStock
  };
}
