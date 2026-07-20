export function isBinaryLikeObject(value: unknown): value is Record<string, number> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  if (keys.length === 0) {
    return false;
  }

  return keys.every((key) => /^\d+$/.test(key) && Number.isInteger(value[key]) && value[key] >= 0 && value[key] <= 255);
}

export function serializeKeyForQuery(value: unknown): string | number | boolean {
  if (!isBinaryLikeObject(value)) {
    return value as string | number | boolean;
  }

  const bytes = Object.keys(value)
    .map(Number)
    .sort((a, b) => a - b)
    .map((index) => value[String(index)]);

  return btoa(String.fromCharCode(...bytes));
}

export function formatCellDisplay(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
