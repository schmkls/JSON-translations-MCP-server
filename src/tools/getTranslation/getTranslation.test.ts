import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { getTranslation } from "./index";
import {
  setupTestTranslations,
  cleanupTestTranslations,
} from "../../lib/test/translationTestUtils";

describe("getTranslation", () => {
  let testDir: string;

  beforeEach(() => {
    // Setup test translations
    const setup = setupTestTranslations();
    testDir = setup.testDir;
  });

  afterEach(() => {
    // Clean up test files
    cleanupTestTranslations(testDir);
  });

  it("should get existing translation", async () => {
    const result = await getTranslation({
      translationId: "common.buttons.save",
      language: "en",
      path: testDir,
    });

    expect(result).toBe("Save");
  });

  it("should get nested translation", async () => {
    const result = await getTranslation({
      translationId: "homepage.welcome.message",
      language: "sv",
      path: testDir,
    });

    expect(result).toBe("Välkommen till vår applikation");
  });

  it("should return a message when translation not found", async () => {
    const result = await getTranslation({
      translationId: "navigation.main-menu.home",
      language: "en",
      path: testDir,
    });

    expect(result).toContain("not found");
  });

  it("should throw error when file not found", async () => {
    await expect(
      getTranslation({
        translationId: "common.buttons.save",
        language: "fr",
        path: testDir,
      })
    ).rejects.toThrow("Translation file not found");
  });
});
