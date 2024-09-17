import { DateRange } from "react-day-picker";
import { date, z } from "zod";
import { SearchLocationType } from "./types";

export const MainSearchFormSchema = z.object({
  sport: z.string().optional(),
  experience: z.string().optional(),
  rentPeriod: z
    .object({
      from: date().optional(),
      to: date().optional(),
    })
    .optional() as z.ZodType<DateRange, any>,
  location: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    radius: z.number().optional(),
  }).optional() as z.ZodType<SearchLocationType, any>,
});

export type MainSearchFormOutputType = typeof MainSearchFormSchema["_output"];

export const AddListingFormSchema = z.object({
  product_id: z.string().min(1, { message: "Please select a product" }),
  description: z.string().min(10, { message: "Please enter a description" }),
  base_price: z.coerce.number().min(1, { message: "Please enter a price" }),
  price_granularity: z.enum(["daily", "hourly"]).default("daily"),
  currency_code: z.string().min(1, { message: "Please select a currency" }),
  discount_1: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_2: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_3: z.number().min(0, { message: "Please enter a valid discount" }),
  product_metadata: z
    .object({
      sizes: z.array(z.string()).nullable(),
      colors: z.array(z.string()).nullable(),
      lengths: z.array(z.string()).nullable(),
      widths: z.array(z.string()).nullable(),
    })
    .passthrough(),
  total_units: z.number().nullable(),
});
