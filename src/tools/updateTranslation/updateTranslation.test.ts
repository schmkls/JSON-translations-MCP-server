import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { updateTranslation } from "./index";
import {
  setupTestTranslations,
  cleanupTestTranslations,
  readTestFile,
} from "../../lib/test/translationTestUtils";

describe("updateTranslation", () => {
  let testDir: string;
  let enFilePath: string;
  let svFilePath: string;

  beforeEach(() => {
    // Setup test translations
    const setup = setupTestTranslations();
    testDir = setup.testDir;
    enFilePath = setup.enFilePath;
    svFilePath = setup.svFilePath;
  });

  afterEach(() => {
    // Clean up test files
    cleanupTestTranslations(testDir);
  });

  it("should update existing translation", async () => {
    const result = await updateTranslation({
      translationId: "common.buttons.save",
      language: "en",
      path: testDir,
      translation: "Save Changes",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(enFilePath);
    expect(updatedContent.common.buttons.save).toBe("Save Changes");
  });

  it("should update nested translation", async () => {
    const result = await updateTranslation({
      translationId: "homepage.welcome.message",
      language: "sv",
      path: testDir,
      translation: "Välkommen till vår nya applikation",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(svFilePath);
    expect(updatedContent.homepage.welcome.message).toBe(
      "Välkommen till vår nya applikation"
    );
  });

  it("should create missing parent objects", async () => {
    const result = await updateTranslation({
      translationId: "navigation.main-menu.home",
      language: "en",
      path: testDir,
      translation: "Home",
    });

    expect(result).toContain("Successfully updated");

    const updatedContent = readTestFile(enFilePath);
    expect(updatedContent.navigation["main-menu"].home).toBe("Home");
  });

  it("should throw error when file not found", async () => {
    await expect(
      updateTranslation({
        translationId: "common.buttons.save",
        language: "fr",
        path: testDir,
        translation: "Sauvegarder",
      })
    ).rejects.toThrow("Translation file not found");
  });
});
