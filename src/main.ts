#!/usr/bin/env node

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
const debug = (message: string, ...args: any[]) => {
  console.error(`[DEBUG] ${message}`, ...args);
};

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
  const transport = new StdioServerTransport();
  debug("Connecting to transport...");
  await server.connect(transport);
  debug("BabelEdit Translation MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
