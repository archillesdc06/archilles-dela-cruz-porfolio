import "./load-env";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  AnalysisConfigurationError,
  analyzeStructured,
  certificationAnalysisSchema,
  resolveAnalysisModel,
  type AnalysisImage,
  type CertificationAnalysis,
} from "../src/server/ai-analyzer";
import {
  fetchDriveFiles,
  isResumeFile,
  type DriveFile,
} from "../src/server/drive-files";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const OUTPUT_PATH = path.join(
  ROOT,
  "src",
  "data",
  "certification-analysis-drafts.json",
);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ANALYSIS_VERSION = "certification-v1";

type ProposedCertification = Pick<
  CertificationAnalysis,
  "title" | "description" | "issuer" | "year"
>;

interface CertificationDraft {
  fileId: string;
  fileName: string;
  sourceUrl: string;
  fingerprint: string;
  analyzedAt: string;
  status: "pending" | "approved" | "error";
  proposed?: ProposedCertification;
  confidence: number;
  evidence: string[];
  warnings: string[];
  error?: string;
}

interface DraftFile {
  schemaVersion: number;
  generatedAt: string | null;
  items: Record<string, CertificationDraft>;
}

function getOption(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((argument) => argument.startsWith(prefix));

  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value && !value.startsWith("--") ? value : undefined;
}

function readDrafts(): DraftFile {
  if (!fs.existsSync(OUTPUT_PATH)) {
    return { schemaVersion: 1, generatedAt: null, items: {} };
  }

  return JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8")) as DraftFile;
}

function writeDrafts(drafts: DraftFile) {
  const temporaryPath = `${OUTPUT_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(
    temporaryPath,
    `${JSON.stringify(drafts, null, 2)}\n`,
    "utf8",
  );
  fs.renameSync(temporaryPath, OUTPUT_PATH);
}

async function loadDriveImage(file: DriveFile): Promise<AnalysisImage> {
  const response = await fetch(
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(file.id)}&sz=w2000`,
    { signal: AbortSignal.timeout(30_000) },
  );

  if (!response.ok) {
    throw new Error(`Preview request returned HTTP ${response.status}.`);
  }

  const mimeType =
    (response.headers.get("content-type") ?? "").split(";")[0] ?? "";
  if (!mimeType.startsWith("image/")) {
    throw new Error(
      "Google Drive did not return an image preview for this file.",
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("The certification preview exceeds the 10 MB limit.");
  }

  return {
    data: bytes.toString("base64"),
    mimeType,
    name: file.name,
  };
}

function createFingerprint(file: DriveFile, image: AnalysisImage): string {
  return crypto
    .createHash("sha256")
    .update(ANALYSIS_VERSION)
    .update("\0")
    .update(resolveAnalysisModel())
    .update("\0")
    .update(`${file.id}\0${file.name}\0${image.data}`)
    .digest("hex");
}

async function analyzeImage(
  file: DriveFile,
  image: AnalysisImage,
  fingerprint: string,
): Promise<Omit<CertificationDraft, "analyzedAt">> {
  const result = await analyzeStructured({
    schema: certificationAnalysisSchema,
    images: [image],
    prompt: `Analyze this certification asset for a portfolio.
Filename: ${file.name}

Return JSON with these exact fields:
- title: concise certification title
- description: one or two factual sentences
- issuer: awarding organization, or an empty string when unreadable
- year: year shown on the document, or an empty string when unreadable
- confidence: number from 0 to 1
- evidence: short observations that support the result
- warnings: unclear, missing, or uncertain information

Do not guess text that is not visible.`,
  });

  return {
    fileId: file.id,
    fileName: file.name,
    sourceUrl: `https://drive.google.com/file/d/${file.id}/view`,
    fingerprint,
    status: "pending",
    proposed: {
      title: result.title,
      description: result.description,
      issuer: result.issuer,
      year: result.year,
    },
    confidence: result.confidence,
    evidence: result.evidence,
    warnings: result.warnings,
  };
}

export async function runCertificationAnalysis(): Promise<void> {
  const folderId = getOption("folder") ?? process.env.GOOGLE_DRIVE_FOLDER_ID;
  const selectedId = getOption("id");
  const force = process.argv.includes("--force");

  if (!folderId) {
    throw new Error("Set GOOGLE_DRIVE_FOLDER_ID or pass --folder=<id>.");
  }

  const files = (await fetchDriveFiles(folderId)).filter(
    (file) => !isResumeFile(file) && (!selectedId || file.id === selectedId),
  );

  if (files.length === 0) {
    throw new Error("No analyzable certification files were found.");
  }

  const drafts = readDrafts();
  let changed = false;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const existing = drafts.items[file.id];

    try {
      const image = await loadDriveImage(file);
      const fingerprint = createFingerprint(file, image);

      if (
        !force &&
        existing?.fileName === file.name &&
        existing.fingerprint === fingerprint &&
        (existing.status === "pending" || existing.status === "approved")
      ) {
        skipped += 1;
        continue;
      }

      const analysis = await analyzeImage(file, image, fingerprint);
      drafts.items[file.id] = {
        ...analysis,
        analyzedAt: new Date().toISOString(),
      };
      changed = true;
      console.log(`[certification-analysis] drafted ${file.name}`);
    } catch (error) {
      if (error instanceof AnalysisConfigurationError) throw error;

      failed += 1;
      const message =
        error instanceof Error ? error.message : "Unknown analysis error";
      if (existing) {
        console.error(
          `[certification-analysis] kept existing draft for ${file.name}: ${message}`,
        );
        continue;
      }

      drafts.items[file.id] = {
        fileId: file.id,
        fileName: file.name,
        sourceUrl: `https://drive.google.com/file/d/${file.id}/view`,
        fingerprint: "",
        analyzedAt: new Date().toISOString(),
        status: "error",
        confidence: 0,
        evidence: [],
        warnings: [],
        error: message,
      };
      changed = true;
      console.error(`[certification-analysis] failed ${file.name}: ${message}`);
    }
  }

  if (changed) {
    drafts.generatedAt = new Date().toISOString();
    writeDrafts(drafts);
  }

  console.log(
    `[certification-analysis] ${files.length} file(s), ${skipped} skipped, ${failed} failed`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  runCertificationAnalysis().catch((error: unknown) => {
    console.error(
      `[certification-analysis] ${error instanceof Error ? error.message : "Analysis failed."}`,
    );
    process.exitCode = 1;
  });
}
