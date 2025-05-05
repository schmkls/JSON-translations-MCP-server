import * as z from "zod";

export const getTranslationSchema = z.object({
  translationId: z
    .string()
    .describe(
      "Translation ID, for example 'common.buttons.save' or 'homepage.welcome.message'"
    ),
  language: z
    .string()
    .describe("Language code for the translation file (e.g., 'sv', 'en')"),
  path: z
    .string()
    .describe("Path to the folder containing translation files")
    .optional(),
});

export type GetTranslationSchema = z.infer<typeof getTranslationSchema>;
