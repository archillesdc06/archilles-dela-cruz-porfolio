import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CERTIFICATION_DRAFTS_PATH = path.join(
  ROOT,
  "src",
  "data",
  "certification-analysis-drafts.json",
);
const PROJECT_DRAFTS_PATH = path.join(
  ROOT,
  "src",
  "data",
  "project-analysis-drafts.json",
);
const CERTIFICATION_METADATA_PATH = path.join(
  ROOT,
  "src",
  "data",
  "certification-metadata.json",
);
const PROJECT_METADATA_PATH = path.join(
  ROOT,
  "src",
  "data",
  "github-metadata.json",
);

const proposedCertificationSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  issuer: z.string().trim(),
  year: z.string().trim(),
});

const proposedProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum(["web", "system", "research"]),
  techStack: z.string().trim().min(1),
});

interface DraftItem {
  status: string;
  fileName?: string;
  repository?: string;
  proposed?: unknown;
  [key: string]: unknown;
}

interface DraftFile {
  items: Record<string, DraftItem>;
}

type MetadataFile = Record<string, Record<string, unknown>>;

function getOption(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((argument) => argument.startsWith(prefix));

  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value && !value.startsWith("--") ? value : undefined;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(
    temporaryPath,
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
  fs.renameSync(temporaryPath, filePath);
}

function getDraftPaths(kind: string) {
  return kind === "certification"
    ? {
        drafts: CERTIFICATION_DRAFTS_PATH,
        metadata: CERTIFICATION_METADATA_PATH,
      }
    : kind === "project"
      ? {
          drafts: PROJECT_DRAFTS_PATH,
          metadata: PROJECT_METADATA_PATH,
        }
      : null;
}

function printPreview(
  kind: string,
  id: string,
  proposed: Record<string, unknown>,
) {
  console.log(`[ai-promote] ${kind} ${id}`);
  console.log(JSON.stringify(proposed, null, 2));
  console.log("[ai-promote] dry run; pass --apply to publish this draft.");
}

function promoteCertification(
  id: string,
  item: DraftItem,
  drafts: DraftFile,
  metadataPath: string,
  apply: boolean,
) {
  if (!item.fileName || !item.proposed) {
    throw new Error("The certification draft is incomplete.");
  }

  const proposed = proposedCertificationSchema.parse(item.proposed);
  if (!apply) {
    printPreview("certification", id, proposed);
    return;
  }

  if (item.status !== "pending") {
    throw new Error(`Certification ${id} is not pending review.`);
  }

  const metadata = readJson<MetadataFile>(metadataPath);
  metadata[item.fileName] = {
    ...(metadata[item.fileName] ?? {}),
    ...proposed,
  };
  writeJson(metadataPath, metadata);
  item.status = "approved";
  item.reviewedAt = new Date().toISOString();
  writeJson(CERTIFICATION_DRAFTS_PATH, drafts);
  console.log(`[ai-promote] published certification ${item.fileName}`);
}

function promoteProject(
  id: string,
  item: DraftItem,
  drafts: DraftFile,
  metadataPath: string,
  apply: boolean,
) {
  if (!item.proposed) {
    throw new Error("The project draft is incomplete.");
  }

  const proposed = proposedProjectSchema.parse(item.proposed);
  if (!apply) {
    printPreview("project", id, proposed);
    return;
  }

  if (item.status !== "pending") {
    throw new Error(`Project ${id} is not pending review.`);
  }

  const metadata = readJson<MetadataFile>(metadataPath);
  metadata[id] = {
    ...(metadata[id] ?? {}),
    ...proposed,
  };
  writeJson(metadataPath, metadata);
  item.status = "approved";
  item.reviewedAt = new Date().toISOString();
  writeJson(PROJECT_DRAFTS_PATH, drafts);
  console.log(`[ai-promote] published project ${id}`);
}

function run() {
  const kind = getOption("kind");
  const id = getOption("id");
  const apply = process.argv.includes("--apply");
  const paths = kind ? getDraftPaths(kind) : null;

  if (!kind || !paths) {
    throw new Error("Use --kind=certification or --kind=project.");
  }

  if (!id) {
    throw new Error(
      "Use --id=<draft-id>. Bulk promotion is intentionally disabled.",
    );
  }

  const drafts = readJson<DraftFile>(paths.drafts);
  const item = drafts.items[id];
  if (!item) throw new Error(`No ${kind} draft was found for ${id}.`);

  if (kind === "certification") {
    promoteCertification(id, item, drafts, paths.metadata, apply);
  } else {
    promoteProject(id, item, drafts, paths.metadata, apply);
  }
}

try {
  run();
} catch (error) {
  console.error(
    `[ai-promote] ${error instanceof Error ? error.message : "Promotion failed."}`,
  );
  process.exitCode = 1;
}
