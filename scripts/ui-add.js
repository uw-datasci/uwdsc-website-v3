#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the component name from command line arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error("❌ Error: Please specify a component name");
  console.log("Usage: pnpm ui:add <component-name>");
  console.log("Example: pnpm ui:add button");
  process.exit(1);
}

// Change to packages/ui directory
const uiDir = join(__dirname, "..", "packages", "ui");
const componentsDir = join(uiDir, "src", "components");
const indexPath = join(uiDir, "src", "index.ts");

function getComponentFiles() {
  if (!existsSync(componentsDir)) return [];
  return readdirSync(componentsDir).filter(
    (f) => f.endsWith(".tsx") || f.endsWith(".ts")
  );
}

function updateIndexExports(newFiles) {
  if (newFiles.length === 0) return;

  const exports = newFiles.map(
    (f) => `export * from "./components/${f.replace(/\.(tsx?|jsx?)$/, "")}"`
  );
  let content = readFileSync(indexPath, "utf-8").trimEnd();
  if (!content.endsWith("\n")) content += "\n";
  content += "\n" + exports.join("\n") + "\n";
  writeFileSync(indexPath, content);
  console.log(`📝 Updated index.ts with: ${exports.join(", ")}`);
}

// Capture existing component files before running shadcn
const filesBefore = new Set(getComponentFiles());

console.log(`🔧 Adding shadcn component: ${componentName}`);
console.log(`📁 Working directory: ${uiDir}`);

// Run the shadcn command
const child = spawn("pnpm", ["dlx", "shadcn@canary", "add", componentName], {
  cwd: uiDir,
  stdio: "inherit",
  shell: true,
});

child.on("error", (error) => {
  console.error("❌ Error running command:", error.message);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code === 0) {
    console.log(`✅ Successfully added ${componentName} component!`);

    const filesAfter = getComponentFiles();
    const newFiles = filesAfter.filter((f) => !filesBefore.has(f));

    if (newFiles.length > 0) {
      updateIndexExports(newFiles);
    } else {
      console.log("");
      console.log(
        "⚠️  Could not detect new component file(s). Please add the export(s) manually to packages/ui/src/index.ts:"
      );
      console.log(
        `   export * from "./components/<component-file-name-without-extension>"`
      );
      console.log("");
    }
  } else {
    console.error(`❌ Command failed with exit code ${code}`);
    process.exit(code);
  }
});
