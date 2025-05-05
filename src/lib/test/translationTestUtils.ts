import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Helper function to create a test JSON file
 */
export const createTestFile = (
  filePath: string,
  data: Record<string, unknown>
) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"), "utf-8");
};

/**
 * Helper function to read a test JSON file
 */
export const readTestFile = (filePath: string): Record<string, any> => {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

/**
 * Helper function to setup test translations directory with sample data
 */
export const setupTestTranslations = () => {
  const testDir = path.join(process.cwd(), "test-translations");
  const enFilePath = path.join(testDir, "en.json");
  const svFilePath = path.join(testDir, "sv.json");

  // Create test directory and files
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Sample English translations
  createTestFile(enFilePath, {
    common: {
      buttons: {
        save: "Save",
        cancel: "Cancel",
      },
      labels: {
        name: "Name",
        email: "Email",
      },
    },
    homepage: {
      welcome: {
        title: "Welcome",
        message: "Welcome to our application",
      },
    },
  });

  // Sample Swedish translations
  createTestFile(svFilePath, {
    common: {
      buttons: {
        save: "Spara",
        cancel: "Avbryt",
      },
      labels: {
        name: "Namn",
        email: "E-post",
      },
    },
    homepage: {
      welcome: {
        title: "Välkommen",
        message: "Välkommen till vår applikation",
      },
    },
  });

  return { testDir, enFilePath, svFilePath };
};

/**
 * Helper function to clean up test directory
 */
export const cleanupTestTranslations = (testDir: string) => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
};
