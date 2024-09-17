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
