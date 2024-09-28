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
    : `${product_group_name} - ${
      type ? type.charAt(0).toUpperCase() + type.slice(1) : ""
    } ${gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ""}${
      size ? ` ${size.charAt(0).toUpperCase() + size.slice(1)} | ` : ""
    } ${sport ? `${sport.charAt(0).toUpperCase() + sport.slice(1)}` : ""}`;
}

export function getTotalPriceWithPlatformFee(
  price: number,
): { total: number; platformFee: number } {
  let returnedPrice = price;
  let totalPlatformFee = price * PLATFORM_FEE_PERCENT;
  // if (totalPlatformFee > PLATFORM_FEE_CAP) {
  //   totalPlatformFee = PLATFORM_FEE_CAP;
  // }
  returnedPrice = price + totalPlatformFee;
  return { total: returnedPrice, platformFee: totalPlatformFee };
}

export async function fetchLocationString(
  { latitude, longitude }: { latitude: number; longitude: number },
): Promise<string> {
  if (latitude && longitude) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      );
      const data = await res.json();
      if (data.results && data.results[0]) {
        const localityAddress = data.results.find((r: any) =>
          r.types.includes("locality")
        );
        return localityAddress.formatted_address;
      } else {
        return "Location not available";
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Error fetching location";
    }
  } else {
    return "Location data not available";
  }
}
