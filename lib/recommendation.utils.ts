import { GenderSchema } from "@/src/entities/models/formSchemas";
import { z } from "zod";
/**
 * * - Schemas
 */

export const SkillLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const SnowboardStyleSchema = z.enum([
  "freestyle",
  "all-mountain",
  "powder",
  "backcountry",
  "splitboard",
]);

const SkiStyleSchema = z.enum([
  "all-mountain",
  "powder",
  "park",
  "racing",
  "touring",
]);

export const SnowboardFlexibilitySchema = z.enum(["soft", "medium", "stiff"]);

export const UserInputforSnowboardRecommendationSchema = z.object({
  height: z.number().min(0).nonnegative(),
  weight: z.number().min(0).nonnegative(),
  gender: GenderSchema,
  skillLevel: SkillLevelSchema,
  ridingStyle: SnowboardStyleSchema,
});

export const UserInputforSkiRecommendationSchema = z.object({
  height: z.number().min(0),
  weight: z.number().min(0),
  gender: GenderSchema,
  skillLevel: SkillLevelSchema,
  skiingStyle: SkiStyleSchema,
});

/**
 * * - Types
 */

// Snowboard Recommendation Type
export type SnowboardRecommendationType = {
  lengthRange: { min: number; max: number }; // in cm
  style: z.infer<typeof SnowboardStyleSchema>;
  flexibility: z.infer<typeof SnowboardFlexibilitySchema>;
};

/**
 * * - Functions
 */

const sizeChart = [
  { height: 147, weight: [50, 54], size: [128, 136] },
  { height: 152, weight: [52, 59], size: [133, 141] },
  { height: 158, weight: [57, 61], size: [139, 147] },
  { height: 163, weight: [61, 66], size: [144, 152] },
  { height: 168, weight: [63, 70], size: [149, 157] },
  { height: 173, weight: [68, 75], size: [154, 162] },
  { height: 178, weight: [73, 79], size: [159, 167] },
  { height: 183, weight: [77, 84], size: [160, Infinity] },
  { height: 188, weight: [82, 88], size: [160, Infinity] },
  { height: 193, weight: [86, 93], size: [160, Infinity] },
];

export const recommendSnowboard = (
  input: z.infer<typeof UserInputforSnowboardRecommendationSchema>,
): SnowboardRecommendationType => {
  let lengthRange: { min: number; max: number };
  let style: SnowboardRecommendationType["style"] = "all-mountain";
  let flexibility: SnowboardRecommendationType["flexibility"] = "medium";

  // Find the appropriate size range based on height and weight
  const sizeRow = sizeChart.find((row) => input.height <= row.height);
  if (sizeRow) {
    if (
      input.weight >= sizeRow.weight[0] && input.weight <= sizeRow.weight[1]
    ) {
      lengthRange = { min: sizeRow.size[0], max: sizeRow.size[1] };
    } else if (input.weight < sizeRow.weight[0]) {
      // If weight is below the range, use the lower end of the size range
      lengthRange = { min: sizeRow.size[0], max: sizeRow.size[0] };
    } else {
      // If weight is above the range, use the upper end of the size range
      lengthRange = { min: sizeRow.size[1], max: sizeRow.size[1] };
    }
  } else {
    // If height is above the chart, use the largest size
    lengthRange = { min: 160, max: Infinity };
  }

  switch (input.ridingStyle) {
    case "freestyle":
      style = "freestyle";
      // Freestyle riders often prefer shorter boards
      lengthRange.min = Math.max(lengthRange.min - 5, 128);
      lengthRange.max = Math.max(lengthRange.max - 5, lengthRange.min);
      break;
    case "powder":
      style = "powder";
      // Powder riders often prefer longer boards
      lengthRange.min = Math.min(lengthRange.min + 5, 175);
      lengthRange.max = Math.min(lengthRange.max + 5, 175);
      break;
    case "backcountry":
      style = "splitboard";
      break;
      // "all-mountain" is already the default
  }

  // Adjust flexibility based on skill level
  switch (input.skillLevel) {
    case "beginner":
      flexibility = "soft";
      // Beginners often benefit from slightly shorter boards
      lengthRange.min = Math.max(lengthRange.min - 2, 128);
      lengthRange.max = Math.max(lengthRange.max - 2, lengthRange.min);
      break;
    case "advanced":
      flexibility = "stiff";
      // Advanced riders can handle longer boards
      lengthRange.min = Math.min(lengthRange.min + 2, 175);
      lengthRange.max = Math.min(lengthRange.max + 2, 175);
      break;
      // "intermediate" is already the default
  }

  // Fine-tune based on gender (on average, women's boards are slightly shorter)
  if (input.gender === "female") {
    lengthRange.min = Math.max(lengthRange.min - 3, 128);
    lengthRange.max = Math.max(lengthRange.max - 3, lengthRange.min);
  }

  return { lengthRange, style, flexibility };
};
