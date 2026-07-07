export type ExportFormat =
  "pdf-digital" | "pdf-print" | "png" | "jpg" | "csv" | "copy-message";
export interface ExportRequest {
  businessId: string;
  assetId: string;
  format: ExportFormat;
}

// TODO: replace the mock response with client-safe PDF/image generation, print bleed
// checks, QR validation, background jobs, signed downloads, and retention policies.
export async function prepareMockExport(request: ExportRequest) {
  return {
    ok: true as const,
    mode: "mock" as const,
    request,
    message:
      "Export choice saved. No production file was generated in this foundation build.",
  };
}
