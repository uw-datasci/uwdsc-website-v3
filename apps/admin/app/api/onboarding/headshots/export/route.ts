import JSZip from "jszip";
import { ApiResponse } from "@uwdsc/common/utils";
import { onboardingService } from "@uwdsc/admin";
import { createHeadshotService } from "@/lib/services";
import { withVpAccess } from "@/guards/withVpAccess";

const DEFAULT_FILENAME = "dsc-exec-headshots";

function getFileName(key: string): string {
  const name = key.split("/").pop() ?? key;
  return name;
}

export const GET = withVpAccess(async (request) => {
  try {
    const termId = new URL(request.url).searchParams.get("termId");

    if (!termId) {
      return ApiResponse.badRequest("termId is required");
    }

    const [rows, headshotService] = await Promise.all([
      onboardingService.getTeamSubmissions(termId),
      createHeadshotService(),
    ]);

    const zip = new JSZip();
    const folder = zip.folder(DEFAULT_FILENAME);
    let addedCount = 0;

    for (const row of rows) {
      const key = row.submission?.headshot_url;
      if (!key || key.includes("team.png")) continue;

      const data = await headshotService.downloadHeadshot(key);
      if (!data) continue;

      folder!.file(getFileName(key), data);
      addedCount += 1;
    }

    if (addedCount === 0) {
      return ApiResponse.badRequest("No custom headshots found for this term");
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBody = new Uint8Array(zipBuffer);
    const filename = `${DEFAULT_FILENAME}-${termId}.zip`;

    return new Response(zipBody, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error exporting headshots:", error);
    return ApiResponse.serverError(error, "Failed to export headshots");
  }
});
