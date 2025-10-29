import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeListResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const container = payload as Record<string, unknown>;
    const keysToInspect = ["data", "results", "items", "list", "value"];

    for (const key of keysToInspect) {
      if (!(key in container)) continue;
      const value = container[key];

      if (Array.isArray(value)) {
        return value as T[];
      }

      if (value && typeof value === "object") {
        const nested = normalizeListResponse<T>(value);
        if (nested.length) {
          return nested;
        }
      }
    }
  }

  return [];
}

export const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("mochi_token", token);
    document.cookie = `mochi_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  } else {
    localStorage.removeItem("mochi_token");
    document.cookie = "mochi_token=; Max-Age=0; path=/";
  }
};
