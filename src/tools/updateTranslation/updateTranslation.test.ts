import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { updateTranslation } from "./index";
import * as fs from "fs";
import * as path from "path";

// Helper function to create test JSON file
const createTestFile = (filePath: string, data: Record<string, any>) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"), "utf-8");
};

// Helper function to read test JSON file
const readTestFile = (filePath: string): Record<string, any> => {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

describe("updateTranslation", () => {
  const testDir = path.join(process.cwd(), "test-translations");
  const enFilePath = path.join(testDir, "en.json");
  const svFilePath = path.join(testDir, "sv.json");

  beforeEach(() => {
    // Create test directory and files
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Sample English translations
    createTestFile(enFilePath, {
      calendar: {
        monday: "Monday",
        tuesday: "Tuesday",
        today: "Today",
      },
      components: {
        "activate-partial-delivery-modal": {
          title: "Activate partial deliveries",
        },
      },
    });

    // Sample Swedish translations
    createTestFile(svFilePath, {
      calendar: {
        monday: "Måndag",
        tuesday: "Tisdag",
        today: "Idag",
      },
      components: {
        "activate-partial-delivery-modal": {
          title: "Aktivera delleveranser",
        },
      },
    });
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should update existing translation", async () => {
    const result = await updateTranslation({
      translationId: "calendar.today",
      language: "en",
      path: testDir,
      translation: "Right now",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(enFilePath);
    expect(updatedContent.calendar.today).toBe("Right now");
  });

  it("should update nested translation", async () => {
    const result = await updateTranslation({
      translationId: "components.activate-partial-delivery-modal.title",
      language: "sv",
      path: testDir,
      translation: "Ny aktivering av delleveranser",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(svFilePath);
    expect(
      updatedContent.components["activate-partial-delivery-modal"].title
    ).toBe("Ny aktivering av delleveranser");
  });

  it("should create missing parent objects", async () => {
    const result = await updateTranslation({
      translationId: "resources.new-category.title",
      language: "en",
      path: testDir,
      translation: "New Category",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(enFilePath);
    expect(updatedContent.resources["new-category"].title).toBe("New Category");
  });

  it("should throw error when file not found", async () => {
    await expect(
      updateTranslation({
        translationId: "calendar.today",
        language: "fr",
        path: testDir,
        translation: "Aujourd'hui",
      })
    ).rejects.toThrow("Translation file not found");
  });
});
