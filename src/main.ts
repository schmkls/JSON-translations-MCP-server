#!/usr/bin/env node

// Version is automatically updated during release process
export const VERSION = '0.1.1';

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  updateTranslationSchema,
  type UpdateTranslationSchema,
} from "./tools/updateTranslation/schema.js";
import { updateTranslation } from "./tools/updateTranslation/index.js";
import {
  getTranslationSchema,
  type GetTranslationSchema,
} from "./tools/getTranslation/schema.js";
import { getTranslation } from "./tools/getTranslation/index.js";

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

const server = new McpServer({
  name: "JSON Translations MCP Server",
  version: VERSION,
});

server.tool(
  "update-translation",
  "Updates a translation in the specified language file",
  updateTranslationSchema.shape,
  async (args: UpdateTranslationSchema) => {
    try {
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

server.tool(
  "get-translation",
  "Gets a translation from the specified language file",
  getTranslationSchema.shape,
  async (args: GetTranslationSchema) => {
    try {
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

      const result = await getTranslation(args);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      debug("Error in get-translation tool:", error);
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
  await server.connect(transport);
  debug("JSON Translations MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
