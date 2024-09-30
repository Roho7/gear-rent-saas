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
  height: z.number().int().min(0),
  weight: z.number().int().min(0),
  gender: GenderSchema,
  skillLevel: SkillLevelSchema,
  ridingStyle: SnowboardStyleSchema,
});

export const UserInputforSkiRecommendationSchema = z.object({
  height: z.number().int().min(0),
  weight: z.number().int().min(0),
  gender: GenderSchema,
  skillLevel: SkillLevelSchema,
  skiingStyle: SkiStyleSchema,
});

/**
 * * - Types
 */

// Snowboard Recommendation Type
export type SnowboardRecommendationType = {
  length: number; // in cm
  style: z.infer<typeof SnowboardStyleSchema>;
  flexibility: z.infer<typeof SnowboardFlexibilitySchema>;
};

/**
 * * - Functions
 */

export const recommendSnowboard: (
  input: typeof UserInputforSnowboardRecommendationSchema["_output"],
) => SnowboardRecommendationType = (
  input: typeof UserInputforSnowboardRecommendationSchema["_output"],
): SnowboardRecommendationType => {
  let length: number;
  let style: SnowboardRecommendationType["style"];
  let flexibility: SnowboardRecommendationType["flexibility"];

  // Determine base length based on height
  if (input.height < 150) length = 140;
  else if (input.height < 160) length = 150;
  else if (input.height < 170) length = 160;
  else if (input.height < 180) length = 165;
  else length = 170;

  // Adjust length based on weight
  const weightAdjustment = Math.floor((input.weight - 70) / 10) * 2;
  length += weightAdjustment;

  // Adjust length and style based on riding style
  switch (input.ridingStyle) {
    case "freestyle":
      length -= 5;
      style = "freestyle";
      break;
    case "powder":
      length += 5;
      style = "powder";
      break;
    case "backcountry":
      style = "splitboard";
      break;
    default:
      style = "all-mountain";
  }

  // Adjust flexibility based on skill level
  switch (input.skillLevel) {
    case "beginner":
      flexibility = "soft";
      length -= 2; // Beginners often benefit from slightly shorter boards
      break;
    case "intermediate":
      flexibility = "medium";
      break;
    case "advanced":
      flexibility = "stiff";
      length += 2; // Advanced riders can handle longer boards
      break;
  }

  // Fine-tune based on gender (on average, women's boards are slightly shorter)
  if (input.gender === "female") {
    length -= 3;
  }

  // Ensure length stays within reasonable bounds
  length = Math.max(140, Math.min(175, length));

  return { length, style, flexibility };
};
