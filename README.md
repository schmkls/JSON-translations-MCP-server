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

## Tool: update-translation

### Parameters

- `translationId` - The translation ID using dot notation (e.g., "calendar.days.monday")
- `language` - The language code for the translation file (e.g., "sv", "en", ...)
- `path` - Path to the folder containing translation files
- `translation` - The new translation value to be inserted

### Example

```json
{
  "translationId": "calendar.days.today",
  "language": "en",
  "path": "./translations",
  "translation": "Today"
}
```

## Setup and Usage

### Prerequisites

- Node.js 16+
- Bun (for development)

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
bun start
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
2. Add to your Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "babeledit": {
         "command": "node",
         "args": ["/path/to/your/project/dist/main.js"]
       }
     }
   }
   ```

## License

MIT
