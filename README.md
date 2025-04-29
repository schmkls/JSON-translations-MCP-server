# BabelEdit Translation MCP Server

A Model Context Protocol (MCP) server for updating translations in JSON files with BabelEdit.

## Overview

This MCP server provides a single tool: `update-translation`. The tool allows you to update translations in JSON files for different languages. It's designed to work with nested translation structures where keys are separated by dots.

## Features

- Update translations in JSON files using a dot-notation path
- Support for multiple language files
- Preserves JSON structure and formatting
- Handles nested translation keys
- Graceful error handling
- Optional default translations path

## Tool: update-translation

### Parameters

- `translationId` - The translation ID using dot notation (e.g., "calendar.days.monday")
- `language` - The language code for the translation file (e.g., "sv", "en", ...)
- `path` - (Optional) Path to the folder containing translation files. If not provided, the default path set during server initialization will be used.
- `translation` - The new translation value to be inserted

### Example

```json
{
  "translationId": "calendar.days.today",
  "language": "en",
  "translation": "Today"
}
```

## Setup and Usage

### Prerequisites

- Bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

### Build

```bash
bun run build
```

### Run

```bash
# Run without default path
bun start

# Run with default translations path
bun start --path /path/to/translations
# or
bun start -p /path/to/translations
```

## Development

### Testing

```bash
bun test
```

## Project Structure

```
BabelEdit-MCP-server/
├── src/
│   ├── main.ts                         # Server entry point
│   └── tools/
│       └── updateTranslation/
│           ├── index.ts                # Tool implementation
│           └── schema.ts               # Tool schema
├── tests/                              # Test files
├── biome.json                          # Linting configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Project dependencies
```

## Adding to Claude Desktop

To add your development MCP server to Claude Desktop:

1. Build the project:
   ```bash
   bun run build
   ```
2. Add to your Claude Desktop config with default path:

   ```json
   {
     "mcpServers": {
       "json-translations-mcp-server": {
         "command": "bun",
         "args": [
           "/path/to/your/project/dist/main.js",
           "--path",
           "/path/to/translations"
         ]
       }
     }
   }
   ```

3. Or without default path (will require path in each tool call):
   ```json
   {
     "mcpServers": {
       "json-translations-mcp-server": {
         "command": "bun",
         "args": ["/path/to/your/project/dist/main.js"]
       }
     }
   }
   ```

## License

MIT
