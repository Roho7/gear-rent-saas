import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  { base_price, currency_code }: {
    base_price: number;
    currency_code: string | null;
  },
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency_code ?? "GBP",
  }).format(base_price);
}
