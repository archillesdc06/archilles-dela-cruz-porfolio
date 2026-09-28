export interface DriveFile {
  id: string;
  name: string;
  thumbnail: string;
}

export const RESUME_FILE_ID = "1pgqUdQ2MrWypLjC0-7X7L4zFioolB-34";
export const RESUME_CV_PATTERN =
  /(^|[^a-z])cv([^a-z]|$)|resume|curriculum[\s_-]*vitae/i;

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function isResumeFile(file: DriveFile): boolean {
  return file.id === RESUME_FILE_ID || RESUME_CV_PATTERN.test(file.name);
}

export async function fetchDriveFiles(folderId: string): Promise<DriveFile[]> {
  const url = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Google Drive returned HTTP ${response.status}.`);
  }

  const html = await response.text();
  const files: DriveFile[] = [];
  const entryRegex =
    /flip-entry(?:-\w+)+[\s\S]*?file\/d\/([^/]+)\/view[\s\S]*?flip-entry-thumb"><img src="([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(html)) !== null) {
    files.push({
      id: match[1]!,
      name: decodeHtmlEntities(match[3]!),
      thumbnail: match[2]!,
    });
  }

  return files;
}
