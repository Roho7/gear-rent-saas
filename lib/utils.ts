import { PriceGranularityType } from "@/src/entities/models/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  { base_price, currency_code }: {
    base_price?: number | null;
    currency_code?: string | null;
  },
) {
  if (!base_price || !currency_code) {
    return null;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency_code ?? "GBP",
  }).format(base_price);
}

export function formatPriceGranularity(
  priceGranularity: PriceGranularityType | null,
) {
  if (!priceGranularity) {
    return null;
  }
  return priceGranularity === "daily" ? "/ day" : "/ hour";
}
