import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
