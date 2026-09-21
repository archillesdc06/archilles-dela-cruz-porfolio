import { unstable_cache } from "next/cache";
import type { Certification } from "~/data/portfolio-data";
import enrichmentData from "~/data/certification-metadata.json";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

const RESUME_FILE_ID = "1B_SUzyxYlfLNFyxFPnwc1sdiEooLr6rb";
const RESUME_CV_PATTERN = /(^|[^a-z])cv([^a-z]|$)|resume|curriculum[\s_-]*vitae/i;

interface DriveFile {
  id: string;
  name: string;
  thumbnail: string;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function fetchDriveFiles(): Promise<DriveFile[]> {
  if (!FOLDER_ID) return [];

  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#grid`;
    const response = await fetch(url, { cache: "no-store" });
    const html = await response.text();

    const files: DriveFile[] = [];

    const entryRegex =
      /flip-entry(?:-\w+)+[\s\S]*?file\/d\/([^/]+)\/view[\s\S]*?flip-entry-thumb"><img src="([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

    let match: RegExpExecArray | null;
    while ((match = entryRegex.exec(html)) !== null) {
      const id = match[1]!;
      const rawName = decodeHtmlEntities(match[3]!);

      files.push({
        id,
        name: rawName,
        thumbnail: "",
      });
    }

    return files;
  } catch (error) {
    console.error("Failed to fetch Google Drive files:", error);
    return [];
  }
}

function fileToCertification(file: DriveFile): Certification {
  const enrichment = enrichmentData[file.name as keyof typeof enrichmentData];

  const title = enrichment?.title
    ?? file.name
        .replace(/^(Copy of )?/i, "")
        .replace(/\.(jpg|jpeg|png|gif|webp|pdf)$/i, "")
        .replace(/[-_]/g, " ");

  return {
    id: file.id,
    title,
    issuer: enrichment?.issuer ?? "",
    year: enrichment?.year ?? "",
    description: enrichment?.description ?? "",
    image: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
    driveUrl: `https://drive.google.com/file/d/${file.id}/view`,
  };
}

async function fetchCertifications(): Promise<Certification[]> {
  if (!FOLDER_ID) return [];

  try {
    const files = await fetchDriveFiles();

    return files
      .filter(
        (file) => file.id !== RESUME_FILE_ID && !RESUME_CV_PATTERN.test(file.name),
      )
      .map(fileToCertification)
      .sort((a, b) => b.year.localeCompare(a.year));
  } catch (error) {
    console.error("Failed to build certifications:", error);
    return [];
  }
}

export const getCertifications = unstable_cache(
  fetchCertifications,
  ["certifications", FOLDER_ID ?? "empty"],
  { revalidate: 300, tags: ["certifications"] },
);