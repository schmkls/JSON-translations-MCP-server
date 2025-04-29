#!/usr/bin/env bun

// Version is automatically updated during release process
export const VERSION = "0.1.0";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  updateTranslationSchema,
  type UpdateTranslationSchema,
} from "./tools/updateTranslation/schema.js";
import { updateTranslation } from "./tools/updateTranslation/index.js";

// Debug logging to stderr
const debug = (message: string, ...args: unknown[]) => {
  console.error(`[DEBUG] ${message}`, ...args);
};

// Parse command line arguments
const args = process.argv.slice(2);
let defaultTranslationsPath: string | undefined = undefined;

// Look for --path or -p argument
for (let i = 0; i < args.length; i++) {
  if ((args[i] === "--path" || args[i] === "-p") && i + 1 < args.length) {
    defaultTranslationsPath = args[i + 1];
    break;
  }
}

if (defaultTranslationsPath) {
  debug(`Using default translations path: ${defaultTranslationsPath}`);
}

// Initialize server
const server = new McpServer({
  name: "BabelEdit Translation Update Server",
  version: VERSION,
});

// Register the update-translation tool using the higher-level tool API
server.tool(
  "update-translation",
  "Updates a translation in the specified language file",
  updateTranslationSchema.shape,
  async (args: UpdateTranslationSchema) => {
    try {
      debug("Tool handler called with:", JSON.stringify(args, null, 2));

      // Use default path if not provided in args
      if (!args.path && defaultTranslationsPath) {
        args.path = defaultTranslationsPath;
        debug(`Using default path: ${defaultTranslationsPath}`);
      }

      // Check if path is still missing
      if (!args.path) {
        throw new Error(
          "Translation path not provided. Either specify it in the tool parameters or provide a default path when starting the server."
        );
      }

      const result = await updateTranslation(args);
      debug("Function returned result:", result);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      debug("Error in update-translation tool:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start server
async function runServer() {
  debug("Starting server...");
  if (defaultTranslationsPath) {
    debug(`Default translations path set to: ${defaultTranslationsPath}`);
  } else {
    debug(
      "No default translations path provided. Path must be specified in each tool call."
    );
  }
  const transport = new StdioServerTransport();
  debug("Connecting to transport...");
  await server.connect(transport);
  debug("BabelEdit Translation MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
