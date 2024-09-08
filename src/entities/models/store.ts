import { Tables } from "@/packages/supabase.types";
import { z } from "zod";

export type Store = Tables<"tbl_stores">;

export const RegisterShopFormSchema = z.object({
  store_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  country_code: z.string().min(2, {
    message: "Country code must be at least 2 characters.",
  }),
  business_number: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  business_email: z.string().email({
    message: "Please enter a valid email.",
  }),
  country: z.string().min(2, {
    message: "Please enter a valid country.",
  }),
  address_line1: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  address_line2: z.string().optional(),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  postcode: z.string().min(5, {
    message: "Please enter a valid postcode.",
  }),
});
