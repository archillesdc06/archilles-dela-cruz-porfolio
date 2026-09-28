import { runCertificationAnalysis } from "./analyze-certifications";
import { runProjectAnalysis } from "./analyze-projects";

let failed = false;

try {
  await runCertificationAnalysis();
} catch (error) {
  failed = true;
  console.error(
    `[ai-analysis] certifications: ${error instanceof Error ? error.message : "Analysis failed."}`,
  );
}

try {
  await runProjectAnalysis();
} catch (error) {
  failed = true;
  console.error(
    `[ai-analysis] projects: ${error instanceof Error ? error.message : "Analysis failed."}`,
  );
}

if (failed) process.exitCode = 1;
