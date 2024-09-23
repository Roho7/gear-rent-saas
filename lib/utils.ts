import { GenderType, PriceGranularityType } from "@/src/entities/models/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const PLATFORM_FEE_PERCENT = 0.1;
const PLATFORM_FEE_CAP = 15;

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

export function formatProductName(
  { product_group_name, sport, gender, size, type }: {
    product_group_name?: string | null;
    sport?: string | null;
    gender?: GenderType;
    size?: string | null;
    type?: string | null;
  },
) {
  return !product_group_name
    ? "-"
    : `${product_group_name} - ${type ? type : ""} ${gender ? gender : ""}${
      size ? ` ${size} | ` : ""
    } ${sport ? `${sport}` : ""}`;
}

export function getTotalPriceWithPlatformFee(
  price: number,
): { total: number; platformFee: number } {
  let returnedPrice = price;
  let totalPlatformFee = price * PLATFORM_FEE_PERCENT;
  if (totalPlatformFee > PLATFORM_FEE_CAP) {
    totalPlatformFee = PLATFORM_FEE_CAP;
  }
  returnedPrice = price + totalPlatformFee;
  return { total: returnedPrice, platformFee: totalPlatformFee };
}
