import { FaSkiing, FaSnowboarding } from "react-icons/fa";
import { FaTent } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { ProductMetadataKeys } from "./types";

export const metadataOptions: ProductMetadataKeys[] = [
  "heights",
  "lengths",
  "widths",
  "colors",
];

export const genderMap = ["male", "female", "unisex"];
export const sportMap: Record<string, { name: string; icon: IconType }> = {
  "skiing": {
    name: "Skiing",
    icon: FaSkiing,
  },
  "snowboarding": {
    name: "Snowboarding",
    icon: FaSnowboarding,
  },
  "camping": {
    name: "Camping",
    icon: FaTent,
  },
};
export const expertiseMap = ["beginner", "intermediate", "advanced"];
export const styleMap = ["freestyle", "freeride", "all-mountain"];
