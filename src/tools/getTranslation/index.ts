import * as fs from "node:fs";
import * as path from "node:path";
import _ from "lodash";
import zodToJsonSchema from "zod-to-json-schema";
import { ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { getTranslationSchema, type GetTranslationSchema } from "./schema.js";
import type { z } from "zod";

// Convert Zod schema to JSON schema
const makeJsonSchema = (schema: z.ZodType) => {
  const ToolInputSchema = ToolSchema.shape.inputSchema;
  return zodToJsonSchema(schema) as typeof ToolInputSchema._output;
};

/**
 * Gets a translation from a JSON file
 */
export const getTranslation = async (
  args: GetTranslationSchema
): Promise<string> => {
  try {
    const { translationId, language, path: translationPath } = args;

    // Check if path is provided
    if (!translationPath) {
      throw new Error(
        "Translation path is required. Either specify it in the tool parameters or provide a default path when starting the server."
      );
    }

    // Construct the file path
    const filePath = path.join(translationPath, `${language}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Translation file not found: ${filePath}`);
    }

    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let translationData: Record<string, unknown>;

    try {
      translationData = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(
        `Invalid JSON in file ${filePath}: ${(error as Error).message}`
      );
    }

    // Get the translation using lodash's get
    const translationValue = _.get(translationData, translationId);

    if (translationValue === undefined) {
      return `Translation for '${translationId}' not found in ${language}.json`;
    }

    if (typeof translationValue !== "string") {
      return `Value for '${translationId}' is not a string but ${typeof translationValue}`;
    }

    return translationValue;
  } catch (error) {
    throw new Error(`Failed to get translation: ${(error as Error).message}`);
  }
};

export const getTranslationTool = {
  name: "get-translation",
  description: "Gets a translation from the specified language file",
  inputSchema: makeJsonSchema(getTranslationSchema),
  handler: async (args: GetTranslationSchema) => {
    try {
      const parsedArgs = getTranslationSchema.parse(args);
      const result = await getTranslation(parsedArgs);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
};
