import { DateRange } from "react-day-picker";
import { date, z } from "zod";
import { SearchLocationType } from "./types";

export const MainSearchFormSchema = z.object({
  sport: z.string().optional(),
  experience: z.string().optional(),
  storeId: z.string().optional(),
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
  }).optional() as z.ZodType<SearchLocationType | null, any>,
});

export type MainSearchFormOutputType = typeof MainSearchFormSchema["_output"];

export const AddListingFormSchema = z.object({
  product_group_id: z.string().min(1, { message: "Product ID is required" }),
  description: z.string().min(10, { message: "Please enter a description" }),
  base_price: z.coerce.number().min(1, { message: "Please enter a price" }),
  price_granularity: z.enum(["daily", "hourly"]).default("daily"),
  currency_code: z.string().min(1, { message: "Please select a currency" }),
  discount_1: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_2: z.number().min(0, { message: "Please enter a valid discount" }),
  discount_3: z.number().min(0, { message: "Please enter a valid discount" }),
  total_units: z.number().nullable(),
  size: z.string().min(1, { message: "Please enter a size" }),
  brands: z.array(z.string()).optional(),
  gender: z.string().optional(),
});

const CheckoutUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Please select a gender"),
  age: z.string().min(1, "Please enter the age"),
  height: z.string().min(1, "Please enter the height"),
  weight: z.string().min(1, "Please enter the weight"),
  shoeSize: z.string().optional(),
});

export const CheckoutUserFormSchema = z.object({
  users: z.array(CheckoutUserSchema),
});
