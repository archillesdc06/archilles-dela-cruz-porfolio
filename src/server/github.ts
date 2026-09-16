import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";
import type { Project } from "~/data/portfolio-data";
import rawEnrichmentData from "~/data/github-metadata.json";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "archillesdc06";

interface RepoEnrichment {
  name?: string;
  description?: string;
  image?: string;
  category?: string;
  featured?: boolean;
  techStack?: string;
  liveUrl?: string | null;
}

const enrichmentData = rawEnrichmentData as Record<string, RepoEnrichment>;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

function parseTopics(topics: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const topic of topics) {
    if (topic.startsWith("portfolio-category:")) {
      parsed.category = topic.replace("portfolio-category:", "");
    } else if (topic.startsWith("portfolio-demo:")) {
      parsed.demoUrl = topic.replace("portfolio-demo:", "");
    } else if (topic.startsWith("portfolio-image:")) {
      parsed.image = topic.replace("portfolio-image:", "");
    } else if (topic.startsWith("portfolio-description:")) {
      parsed.description = decodeURIComponent(topic.replace("portfolio-description:", ""));
    } else if (topic === "portfolio-featured") {
      parsed.featured = "true";
    }
  }
  return parsed;
}

function titleCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function repoToProject(repo: GitHubRepo): Project {
  const topicMeta = parseTopics(repo.topics);
  const enrichment = enrichmentData[repo.name];

  const name = enrichment?.name ?? titleCase(repo.name);

  const description = enrichment?.description
    ?? topicMeta.description
    ?? repo.description
    ?? "";

  const image = enrichment?.image ?? topicMeta.image ?? "/images/projects/budget-tracker.svg";

  const category = enrichment?.category ?? topicMeta.category ?? "web";

  const featured = enrichment?.featured ?? topicMeta.featured === "true";

  const techStack = enrichment?.techStack
    ?? repo.language
    ?? "";

  const liveUrl = enrichment?.liveUrl ?? topicMeta.demoUrl ?? null;

  return {
    id: 10000 + (repo.name.length % 100) + repo.stargazers_count,
    name,
    description,
    image,
    techStack,
    liveUrl,
    githubUrl: repo.html_url,
    category,
    featured,
    stars: repo.stargazers_count,
    language: repo.language ?? undefined,
    lastUpdated: repo.updated_at,
    source: "github",
  };
}

async function fetchGitHubProjects(): Promise<Project[]> {
  try {
    const repos: GitHubRepo[] = [];
    let page = 1;

    while (true) {
      const response = await octokit.rest.repos.listForUser({
        username: GITHUB_USERNAME,
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page,
      });

      const nonForked = response.data.filter(
        (r) => !r.fork && !r.archived,
      ) as unknown as GitHubRepo[];

      repos.push(...nonForked);

      if (response.data.length < 100) break;
      page++;
    }

    const projects = await Promise.all(
      repos.map(async (repo) => {
        try {
          const topicsResponse = await octokit.rest.repos.getAllTopics({
            owner: GITHUB_USERNAME,
            repo: repo.name,
          });
          repo.topics = topicsResponse.data.names;
        } catch {
          repo.topics = [];
        }
        return repoToProject(repo);
      }),
    );

    return projects;
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    return [];
  }
}

export const getGitHubProjects = unstable_cache(
  fetchGitHubProjects,
  ["github-projects", GITHUB_USERNAME],
  { revalidate: 300, tags: ["github-projects"] },
);