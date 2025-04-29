import * as fs from "fs";
import * as path from "path";
import _ from "lodash";
import zodToJsonSchema from "zod-to-json-schema";
import { ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  updateTranslationSchema,
  type UpdateTranslationSchema,
} from "./schema.js";

// Convert Zod schema to JSON schema
const makeJsonSchema = (schema: any) => {
  const ToolInputSchema = ToolSchema.shape.inputSchema;
  return zodToJsonSchema(schema) as typeof ToolInputSchema._output;
};

/**
 * Updates a translation in a JSON file
 */
export const updateTranslation = async (
  args: UpdateTranslationSchema
): Promise<string> => {
  try {
    // Debug logging
    console.error(
      "Update translation called with args:",
      JSON.stringify(args, null, 2)
    );

    const {
      translationId,
      language,
      path: translationPath,
      translation,
    } = args;

    // Construct the file path
    const filePath = path.join(translationPath, `${language}.json`);
    console.error("Looking for file:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      throw new Error(`Translation file not found: ${filePath}`);
    }

    console.error("File exists, reading content");

    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let translationData;

    try {
      translationData = JSON.parse(fileContent);
    } catch (error) {
      console.error("JSON parsing error:", error);
      throw new Error(
        `Invalid JSON in file ${filePath}: ${(error as Error).message}`
      );
    }

    console.error("JSON parsed successfully");

    // Update the translation using lodash's set
    _.set(translationData, translationId, translation);
    console.error("Update successful, writing file back");

    // Write the updated JSON back to file
    fs.writeFileSync(
      filePath,
      JSON.stringify(translationData, null, "\t"),
      "utf-8"
    );

    console.error("File written successfully");

    return `Successfully updated translation for '${translationId}' in ${language}.json`;
  } catch (error) {
    console.error("Error in updateTranslation:", error);
    throw new Error(
      `Failed to update translation: ${(error as Error).message}`
    );
  }
};

export const updateTranslationTool = {
  name: "update-translation",
  description: "Updates a translation in the specified language file",
  inputSchema: makeJsonSchema(updateTranslationSchema),
  handler: async (args: UpdateTranslationSchema) => {
    try {
      console.error("Tool handler called with:", JSON.stringify(args, null, 2));
      const parsedArgs = updateTranslationSchema.parse(args);
      console.error("Args parsed successfully");
      const result = await updateTranslation(parsedArgs);
      console.error("Function returned result:", result);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("Error in updateTranslationTool handler:", error);
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
