import { FaChessRook, FaSkiing } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { PiUsersFill } from "react-icons/pi";
import { SearchLocationType } from "./types";

export const popularLocations: SearchLocationType[] = [
  {
    id: "chamonix",
    name: "Chamonix, France",
    lat: 45.9237,
    lng: 6.8694,
    radius: 10, // 10km radius
  },
  {
    id: "whistler",
    name: "Whistler, Canada",
    lat: 50.1162,
    lng: -122.9535,
    radius: 15, // 15km radius
  },
  {
    id: "zermatt",
    name: "Zermatt, Switzerland",
    lat: 46.0207,
    lng: 7.7491,
    radius: 8, // 8km radius
  },
  {
    id: "aspen",
    name: "Aspen, USA",
    lat: 39.1911,
    lng: -106.8175,
    radius: 12, // 12km radius
  },
  {
    id: "st-anton",
    name: "St. Anton, Austria",
    lat: 47.1284,
    lng: 10.2687,
    radius: 10, // 10km radius
  },
  {
    id: "niseko",
    name: "Niseko, Japan",
    lat: 42.8048,
    lng: 140.6874,
    radius: 20, // 20km radius
  },
  {
    id: "verbier",
    name: "Verbier, Switzerland",
    lat: 46.0969,
    lng: 7.2285,
    radius: 10, // 10km radius
  },
  {
    id: "vail",
    name: "Vail, USA",
    lat: 39.6433,
    lng: -106.3781,
    radius: 15, // 15km radius
  },
  {
    id: "cortina",
    name: "Cortina d'Ampezzo, Italy",
    lat: 46.5404,
    lng: 12.1356,
    radius: 10, // 10km radius
  },
  {
    id: "kitzbuhel",
    name: "Kitzbühel, Austria",
    lat: 47.4449,
    lng: 12.3918,
    radius: 8, // 8km radius
  },
];

export const servicesList = [
  {
    icon: FaSkiing,
    title: "Wide Range of Gear",
    description:
      "From skis to surfboards, find the gear you need for every sport.",
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
    icon: FaChessRook,
    title: "Trusted Sellers",
    description: "Gear you trust, from sellers you trust – anytime, anywhere.",
  },
];
