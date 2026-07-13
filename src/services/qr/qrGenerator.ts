import QRCode from "qrcode";
import type { QRCodeToDataURLOptions, QRCodeToStringOptions } from "qrcode";

export const qrTypes = [
  "Website / Link",
  "Google Review",
  "Booking Link",
  "Payment Link",
  "Lead Form",
  "Menu",
  "Contact Card",
  "Facebook Page",
  "Instagram Page",
  "Event Signup",
  "Estimate Request",
  "Custom URL",
] as const;

export type QrType = (typeof qrTypes)[number];
export type QrPayloadType = "url" | "vcard" | "text";

export interface QrContactInput {
  contactName?: string;
  businessName?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface QrBuilderInput {
  qrType: QrType | "";
  destination?: string;
  qrName?: string;
  shortLabel?: string;
  contact?: QrContactInput;
}

export interface QrGenerationOptions {
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  size?: number;
  margin?: number;
}

export interface QrValidationResult {
  valid: boolean;
  message?: string;
  payload?: string;
  payloadType?: QrPayloadType;
  normalizedUrl?: string;
}

function nonEmpty(value?: string) {
  return Boolean(value?.trim());
}

export function sanitizeQrFileName(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "qr-code";
}

export function normalizeUrlInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const parsed = new URL(candidate);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("QR links must use http or https.");
  }
  return parsed.toString();
}

function vcardLine(key: string, value?: string) {
  return value?.trim() ? `${key}:${value.trim()}` : undefined;
}

export function buildVCardPayload(contact: QrContactInput = {}) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    vcardLine("FN", contact.contactName),
    vcardLine("ORG", contact.businessName),
    vcardLine("TEL", contact.phone),
    vcardLine("EMAIL", contact.email),
    vcardLine("URL", contact.website),
    contact.address?.trim() ? `ADR:;;${contact.address.trim()}` : undefined,
    vcardLine("NOTE", contact.notes),
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\n");
}

export function validateQrInput(input: QrBuilderInput): QrValidationResult {
  if (!input.qrType) {
    return { valid: false, message: "Choose what this QR code is for." };
  }

  if (input.qrType === "Contact Card") {
    const contact = input.contact ?? {};
    const hasMethod =
      nonEmpty(contact.phone) ||
      nonEmpty(contact.email) ||
      nonEmpty(contact.website) ||
      nonEmpty(contact.address);
    if (!hasMethod) {
      return {
        valid: false,
        message: "Add a phone, email, website, or address for this contact card.",
      };
    }
    return {
      valid: true,
      payloadType: "vcard",
      payload: buildVCardPayload(contact),
    };
  }

  if (!input.destination?.trim()) {
    return {
      valid: false,
      message: "Add a destination link so the QR code knows where to send people.",
    };
  }

  try {
    const normalizedUrl = normalizeUrlInput(input.destination);
    return {
      valid: true,
      payloadType: "url",
      payload: normalizedUrl,
      normalizedUrl,
    };
  } catch {
    return {
      valid: false,
      message: "Use a valid link starting with http:// or https://.",
    };
  }
}

export function buildQrPayload(input: QrBuilderInput): QrValidationResult {
  return validateQrInput(input);
}

function baseQrOptions(
  options: QrGenerationOptions = {},
): Omit<QRCodeToStringOptions, "type"> & Omit<QRCodeToDataURLOptions, "type"> {
  return {
    width: options.size ?? 320,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    color: {
      dark: options.foregroundColor ?? "#101c3b",
      light: options.backgroundColor ?? "#ffffff",
    },
  };
}

export async function generateQrSvg(
  payload: string,
  options: QrGenerationOptions = {},
) {
  return QRCode.toString(payload, { ...baseQrOptions(options), type: "svg" });
}

export async function generateQrDataUrl(
  payload: string,
  options: QrGenerationOptions = {},
) {
  return QRCode.toDataURL(payload, {
    ...baseQrOptions(options),
    type: "image/png",
  });
}

function triggerDownload(filename: string, href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function downloadQrSvg(filename: string, svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  triggerDownload(filename, url);
  URL.revokeObjectURL(url);
}

export function downloadQrPng(filename: string, dataUrl: string) {
  triggerDownload(filename, dataUrl);
}

export async function createQrPdfSign(input: {
  title: string;
  label?: string;
  dataUrl: string;
}) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const title = input.label ?? input.title;
  page.drawText(title, {
    x: 72,
    y: 704,
    size: 34,
    font,
    color: rgb(0.06, 0.11, 0.23),
  });
  const pngBytes = Uint8Array.from(
    atob(input.dataUrl.split(",")[1] ?? ""),
    (character) => character.charCodeAt(0),
  );
  const qrImage = await pdf.embedPng(pngBytes);
  page.drawImage(qrImage, {
    x: 156,
    y: 288,
    width: 300,
    height: 300,
  });
  page.drawText("Scan with your phone camera", {
    x: 172,
    y: 246,
    size: 22,
    font: bodyFont,
    color: rgb(0.12, 0.17, 0.29),
  });
  const bytes = await pdf.save();
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return `data:application/pdf;base64,${btoa(binary)}`;
}
