import { unstable_cache } from "next/cache";
import type { Certification } from "~/data/portfolio-data";
import enrichmentData from "~/data/certification-metadata.json";
import {
  fetchDriveFiles,
  isResumeFile,
  type DriveFile,
} from "~/server/drive-files";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

function fileToCertification(file: DriveFile): Certification {
  const enrichment = enrichmentData[file.name as keyof typeof enrichmentData];

  const title =
    enrichment?.title ??
    file.name
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
    const files = await fetchDriveFiles(FOLDER_ID);

    return files
      .filter((file) => !isResumeFile(file))
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
