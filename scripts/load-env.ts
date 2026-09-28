import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inheritedKeys = new Set(Object.keys(process.env));

function parseEnvFile(contents: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator < 1) continue;

    const key = line
      .slice(0, separator)
      .trim()
      .replace(/^export\s+/, "");
    if (key === "") continue;

    let value = line.slice(separator + 1).trim();
    const isQuoted =
      value.length > 1 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")));

    if (isQuoted) value = value.slice(1, -1);
    values[key] = value;
  }

  return values;
}

for (const fileName of [".env", ".env.local"]) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) continue;

  for (const [key, value] of Object.entries(
    parseEnvFile(fs.readFileSync(filePath, "utf8")),
  )) {
    if (!inheritedKeys.has(key)) process.env[key] = value;
  }
}
