import * as z from "zod";

export const updateTranslationSchema = z.object({
  translationId: z
    .string()
    .describe(
      "Translation ID, for example 'resources.work-order.completed-before-registration'"
    ),
  language: z
    .string()
    .describe("Language code for the translation file (e.g., 'sv', 'en')"),
  path: z
    .string()
    .describe("Path to the folder containing translation files")
    .optional(),
  translation: z.string().describe("New translation value to be inserted"),
});

export type UpdateTranslationSchema = z.infer<typeof updateTranslationSchema>;
