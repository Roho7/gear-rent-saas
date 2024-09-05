import { ProductMetadataKeys } from "@/packages/types";
import { FaBagShopping } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import { PiUsersFill } from "react-icons/pi";
import { RiTentFill } from "react-icons/ri";

export const metadataOptions: ProductMetadataKeys[] = [
  "heights",
  "lengths",
  "widths",
  "colors",
];

export const genderMap = ["male", "female", "unisex"];
export const categoryMap = ["skiing", "snowboarding", "camping"];
export const expertiseMap = ["beginner", "intermediate", "advanced"];
export const styleMap = ["freestyle", "freeride", "all-mountain"];

export const servicesList = [
  {
    icon: RiTentFill,
    title: "Wide Range of Gear",
    description:
      "Access a diverse selection of high-quality outdoor equipment for all your adventures.",
  },
  {
    icon: FaBagShopping,
    title: "Easy Rentals",
    description:
      "Seamless online booking process to rent the gear you need with just a few clicks.",
  },
  {
    icon: PiUsersFill,
    title: "Local Shops",
    description:
      "Support local businesses by renting from nearby outdoor gear shops in your area.",
  },
  {
    icon: GoClockFill,
    title: "Flexible Durations",
    description:
      "Rent gear for as long as you need, from a few hours to several days or weeks.",
  },
];
