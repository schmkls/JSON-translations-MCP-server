// prebuild.ts - Runs before the build process to prepare the environment

import { mkdir } from "fs/promises";

async function prebuild() {
  console.log("Running prebuild script...");

  try {
    // Ensure dist directory exists
    await mkdir("dist", { recursive: true });
    console.log("Ensured dist directory exists");
  } catch (error) {
    console.error("Error in prebuild:", error);
    process.exit(1);
  }
}

prebuild();
