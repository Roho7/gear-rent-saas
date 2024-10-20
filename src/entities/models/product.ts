import { FaSkiing, FaSnowboarding } from "react-icons/fa";
import { FaTent } from "react-icons/fa6";
import { GiPaddles } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import { MdSurfing } from "react-icons/md";
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
  "surfing": {
    name: "Surfing",
    icon: MdSurfing,
  },
  "paddleboarding": {
    name: "Paddle-boarding",
    icon: GiPaddles,
  },
};
export const expertiseMap = ["beginner", "intermediate", "advanced"];
export const styleMap = ["freestyle", "freeride", "all-mountain"];
