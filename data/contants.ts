import { ProductMetadataKeys } from "@/supabase/types";

export const metadataOptions: ProductMetadataKeys[] = [
  "heights",
  "lengths",
  "widths",
  "colors",
  "experience",
  "style",
];

export const genderMap = ["male", "female", "unisex"];
export const categoryMap = ["skiing", "snowboarding", "camping"];
export const expertiseMap = ["beginner", "intermediate", "advanced"];
export const styleMap = ["freestyle", "freeride", "all-mountain"];
