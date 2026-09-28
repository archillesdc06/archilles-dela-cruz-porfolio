import "./load-env";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  AnalysisConfigurationError,
  analyzeStructured,
  projectAnalysisSchema,
  resolveAnalysisModel,
  type AnalysisImage,
  type ProjectAnalysis,
} from "../src/server/ai-analyzer";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const CONFIG_PATH = path.join(ROOT, "src", "data", "screenshot-sources.json");
const METADATA_PATH = path.join(ROOT, "src", "data", "github-metadata.json");
const OUTPUT_PATH = path.join(
  ROOT,
  "src",
  "data",
  "project-analysis-drafts.json",
);
const PUBLIC_ROOT = path.resolve(ROOT, "public");
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_README_LENGTH = 12_000;
const ANALYSIS_VERSION = "project-v1";

type ProposedProject = Pick<
  ProjectAnalysis,
  "name" | "description" | "category" | "techStack"
>;

interface ProjectMetadata {
  name?: string;
  description?: string;
  category?: string;
  techStack?: string;
  screenshots?: string[];
  fullScreenshots?: string[];
  _repoPushedAt?: string;
  _processed?: string;
}

interface ScreenshotProjectConfig {
  enabled?: boolean;
  subdir?: string;
}

interface ScreenshotConfig {
  settings?: {
    username?: string;
  };
  projects?: Record<string, ScreenshotProjectConfig>;
}

interface GithubRepository {
  description: string | null;
  language: string | null;
  default_branch: string;
  pushed_at: string;
}

interface GithubContent {
  type: string;
  name: string;
  path: string;
  content?: string;
  encoding?: string;
  download_url?: string | null;
}

interface ProjectDraft {
  repository: string;
  analyzedAt: string;
  status: "pending" | "approved" | "error";
  source: {
    commit: string;
    readmePath: string | null;
    screenshots: string[];
    fingerprint: string;
  };
  current: {
    name: string;
    description: string;
    category: string;
    techStack: string;
  };
  proposed?: ProposedProject;
  confidence: number;
  evidence: string[];
  warnings: string[];
  error?: string;
}

interface DraftFile {
  schemaVersion: number;
  generatedAt: string | null;
  items: Record<string, ProjectDraft>;
}

function getOption(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((argument) => argument.startsWith(prefix));

  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value && !value.startsWith("--") ? value : undefined;
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
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

function encodePath(value: string): string {
  return value
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

async function githubRequest<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-ai-analyzer",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`GitHub returned HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

function decodeContent(content: GithubContent): string {
  if (content.encoding !== "base64" || !content.content) {
    throw new Error("GitHub did not return README content.");
  }

  return Buffer.from(content.content.replace(/\s/g, ""), "base64").toString(
    "utf8",
  );
}

async function fetchReadme(
  owner: string,
  repository: string,
  branch: string,
  subdir?: string,
): Promise<{ path: string; text: string } | null> {
  const repositoryRoot = `/repos/${owner}/${repository}`;

  if (subdir) {
    const directoryUrl = `${repositoryRoot}/contents/${encodePath(subdir)}?ref=${encodeURIComponent(branch)}`;
    try {
      const entries = await githubRequest<GithubContent[]>(directoryUrl);
      const readme = entries.find(
        (entry) =>
          entry.type === "file" && /^readme(?:\.[a-z0-9]+)?$/i.test(entry.name),
      );
      if (readme) {
        const content = await githubRequest<GithubContent>(
          `${repositoryRoot}/contents/${encodePath(readme.path)}?ref=${encodeURIComponent(branch)}`,
        );
        return {
          path: readme.path,
          text: decodeContent(content).slice(0, MAX_README_LENGTH),
        };
      }
    } catch {
      const fallbackUrl = `${repositoryRoot}/contents/${encodePath(`${subdir}/README.md`)}?ref=${encodeURIComponent(branch)}`;
      try {
        const content = await githubRequest<GithubContent>(fallbackUrl);
        return {
          path: `${subdir}/README.md`,
          text: decodeContent(content).slice(0, MAX_README_LENGTH),
        };
      } catch {
        return null;
      }
    }
  }

  try {
    const content = await githubRequest<GithubContent>(
      `${repositoryRoot}/readme?ref=${encodeURIComponent(branch)}`,
    );
    return {
      path: content.path,
      text: decodeContent(content).slice(0, MAX_README_LENGTH),
    };
  } catch {
    return null;
  }
}

function getMimeType(filePath: string): string | null {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  return mimeTypes[extension] ?? null;
}

function loadLocalImage(imagePath: string): AnalysisImage | null {
  const resolved = path.resolve(PUBLIC_ROOT, imagePath.replace(/^\/+/, ""));
  if (!resolved.startsWith(`${PUBLIC_ROOT}${path.sep}`)) return null;

  const mimeType = getMimeType(resolved);
  if (!mimeType || !fs.existsSync(resolved)) return null;

  const bytes = fs.readFileSync(resolved);
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`Screenshot ${imagePath} exceeds the 10 MB limit.`);
  }

  return {
    data: bytes.toString("base64"),
    mimeType,
    name: path.basename(resolved),
  };
}

function createFingerprint(
  repository: GithubRepository,
  readme: { path: string; text: string } | null,
  images: AnalysisImage[],
): string {
  return crypto
    .createHash("sha256")
    .update(ANALYSIS_VERSION)
    .update("\0")
    .update(resolveAnalysisModel())
    .update("\0")
    .update(repository.pushed_at)
    .update("\0")
    .update(readme?.text ?? "")
    .update("\0")
    .update(images.map((image) => image.data).join("\0"))
    .digest("hex");
}

interface RepositorySource {
  repository: GithubRepository;
  readme: { path: string; text: string } | null;
  screenshotPaths: string[];
  images: AnalysisImage[];
  fingerprint: string;
}

async function collectRepositorySource(
  owner: string,
  repositoryName: string,
  config: ScreenshotProjectConfig,
  metadata: ProjectMetadata | undefined,
  maxImages: number,
): Promise<RepositorySource> {
  const repository = await githubRequest<GithubRepository>(
    `https://api.github.com/repos/${owner}/${repositoryName}`,
  );
  const readme = await fetchReadme(
    owner,
    repositoryName,
    repository.default_branch,
    config.subdir,
  );
  const screenshotPaths = (metadata?.screenshots ?? [])
    .filter((imagePath) => typeof imagePath === "string")
    .slice(0, maxImages);
  const images = screenshotPaths
    .map((imagePath) => loadLocalImage(imagePath))
    .filter((image): image is AnalysisImage => image !== null);

  if (!readme && images.length === 0) {
    throw new Error("No README or screenshots were available for analysis.");
  }

  return {
    repository,
    readme,
    screenshotPaths,
    images,
    fingerprint: createFingerprint(repository, readme, images),
  };
}

async function proposeProjectMetadata(
  owner: string,
  repositoryName: string,
  source: RepositorySource,
  metadata: ProjectMetadata | undefined,
): Promise<Omit<ProjectDraft, "analyzedAt">> {
  const { repository, readme, screenshotPaths, images, fingerprint } = source;
  const current = {
    name: metadata?.name ?? "",
    description: metadata?.description ?? "",
    category: metadata?.category ?? "",
    techStack: metadata?.techStack ?? "",
  };
  const result = await analyzeStructured({
    schema: projectAnalysisSchema,
    images,
    prompt: `Analyze this software project for a portfolio.
Repository: ${owner}/${repositoryName}
Repository description: ${repository.description ?? "Not provided"}
Primary language: ${repository.language ?? "Not provided"}
Current approved title: ${current.name || "Not provided"}
Current approved description: ${current.description || "Not provided"}
Current category: ${current.category || "Not provided"}
Current technology stack: ${current.techStack || "Not provided"}
README:
${readme?.text ?? "No README was found."}

Return JSON with these exact fields:
- name: concise project title
- description: one or two factual sentences describing the system
- category: web, system, or research
- techStack: comma-separated technologies visible in the README or screenshots
- confidence: number from 0 to 1
- evidence: short observations that support the result
- warnings: unclear or unsupported information

Do not repeat claims that are not supported by the source.`,
  });

  return {
    repository: repositoryName,
    status: "pending",
    source: {
      commit: repository.pushed_at,
      readmePath: readme?.path ?? null,
      screenshots: screenshotPaths,
      fingerprint,
    },
    current,
    proposed: {
      name: result.name,
      description: result.description,
      category: result.category,
      techStack: result.techStack,
    },
    confidence: result.confidence,
    evidence: result.evidence,
    warnings: [
      ...result.warnings,
      ...(readme
        ? []
        : [
            "No README was found; the proposal relies on repository metadata and screenshots.",
          ]),
    ],
  };
}

export async function runProjectAnalysis(): Promise<void> {
  const config = readJson<ScreenshotConfig>(CONFIG_PATH, {});
  const metadata = readJson<Record<string, ProjectMetadata>>(METADATA_PATH, {});
  const projects = config.projects ?? {};
  const selectedRepository = getOption("repo");
  const force = process.argv.includes("--force");
  const maxImagesOption = Number(getOption("max-images") ?? "3");
  const maxImages = Number.isFinite(maxImagesOption)
    ? Math.min(Math.max(Math.floor(maxImagesOption), 1), 5)
    : 3;
  const owner =
    config.settings?.username ?? process.env.GITHUB_USERNAME ?? "archillesdc06";
  const drafts = readJson<DraftFile>(OUTPUT_PATH, {
    schemaVersion: 1,
    generatedAt: null,
    items: {},
  });
  const configuredProjects = Object.entries(projects).filter(
    ([, projectConfig]) => projectConfig.enabled !== false,
  );

  if (configuredProjects.length === 0) {
    throw new Error("No configured projects were found.");
  }

  const selectedProjects = selectedRepository
    ? configuredProjects.filter(([name]) => name === selectedRepository)
    : configuredProjects;

  if (selectedRepository && selectedProjects.length === 0) {
    throw new Error(
      `${selectedRepository} is not an enabled project in screenshot-sources.json.`,
    );
  }

  let changed = false;
  let skipped = 0;
  let failed = 0;

  for (const [repositoryName, projectConfig] of selectedProjects) {
    const existing = drafts.items[repositoryName];

    try {
      const source = await collectRepositorySource(
        owner,
        repositoryName,
        projectConfig,
        metadata[repositoryName],
        maxImages,
      );

      if (
        !force &&
        existing &&
        (existing.status === "pending" || existing.status === "approved") &&
        existing.source.fingerprint === source.fingerprint
      ) {
        skipped += 1;
        continue;
      }

      const analysis = await proposeProjectMetadata(
        owner,
        repositoryName,
        source,
        metadata[repositoryName],
      );
      drafts.items[repositoryName] = {
        ...analysis,
        analyzedAt: new Date().toISOString(),
      };
      changed = true;
      console.log(`[project-analysis] drafted ${repositoryName}`);
    } catch (error) {
      if (error instanceof AnalysisConfigurationError) throw error;

      failed += 1;
      const message =
        error instanceof Error ? error.message : "Unknown analysis error";
      if (existing) {
        console.error(
          `[project-analysis] kept existing draft for ${repositoryName}: ${message}`,
        );
        continue;
      }

      drafts.items[repositoryName] = {
        repository: repositoryName,
        analyzedAt: new Date().toISOString(),
        status: "error",
        source: {
          commit: "",
          readmePath: null,
          screenshots: [],
          fingerprint: "",
        },
        current: {
          name: metadata[repositoryName]?.name ?? "",
          description: metadata[repositoryName]?.description ?? "",
          category: metadata[repositoryName]?.category ?? "",
          techStack: metadata[repositoryName]?.techStack ?? "",
        },
        confidence: 0,
        evidence: [],
        warnings: [],
        error: message,
      };
      changed = true;
      console.error(`[project-analysis] failed ${repositoryName}: ${message}`);
    }
  }

  if (changed) {
    drafts.generatedAt = new Date().toISOString();
    writeDrafts(drafts);
  }

  console.log(
    `[project-analysis] ${selectedProjects.length} project(s), ${skipped} skipped, ${failed} failed`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  runProjectAnalysis().catch((error: unknown) => {
    console.error(
      `[project-analysis] ${error instanceof Error ? error.message : "Analysis failed."}`,
    );
    process.exitCode = 1;
  });
}
