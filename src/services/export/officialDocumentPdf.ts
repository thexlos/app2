import type {
  BusinessProfile,
  Customer,
  DocumentStyleTemplate,
  DocumentTemplate,
  Estimate,
  EstimateLineItem,
} from "../../types/models";

function safeName(value: string) {
  return value
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
const dollars = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export async function downloadEstimatePdf(
  estimate: Estimate,
  business: BusinessProfile,
  customer?: Customer,
  template?: DocumentTemplate,
  documentStyle?: DocumentStyleTemplate,
) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const fontFamily = documentStyle?.pageStyle.fontFamily?.toLowerCase() ?? "";
  const regularName = fontFamily.includes("times")
    ? StandardFonts.TimesRoman
    : fontFamily.includes("courier")
      ? StandardFonts.Courier
      : StandardFonts.Helvetica;
  const boldName = fontFamily.includes("times")
    ? StandardFonts.TimesRomanBold
    : fontFamily.includes("courier")
      ? StandardFonts.CourierBold
      : StandardFonts.HelveticaBold;
  const regular = await pdf.embedFont(regularName);
  const bold = await pdf.embedFont(boldName);
  const color = (value: string | undefined, fallback: string) => {
    const hex = (value ?? fallback).replace("#", "");
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((part) => `${part}${part}`)
            .join("")
        : hex.padEnd(6, "0").slice(0, 6);
    return rgb(
      Number.parseInt(normalized.slice(0, 2), 16) / 255,
      Number.parseInt(normalized.slice(2, 4), 16) / 255,
      Number.parseInt(normalized.slice(4, 6), 16) / 255,
    );
  };
  const navy = color(documentStyle?.pageStyle.textColor, "#0f1c3b");
  const blue = color(documentStyle?.headerStyle.documentTitleColor, "#2957e8");
  const muted = color(
    documentStyle?.businessInfoStyle.bodyTextColor,
    "#616f8c",
  );
  const border = color(documentStyle?.tableStyle.rowLineColor, "#d4dbe8");
  const pageBackground = color(
    documentStyle?.pageStyle.backgroundColor,
    "#ffffff",
  );
  let page = pdf.addPage([612, 792]);
  let y = 0;
  let itemRowIndex = 0;
  const columnStyle = (key: string) =>
    documentStyle?.columnStyles.find((column) => column.columnKey === key);
  const columnVisible = (key: string) =>
    (template?.columnSettings.find((column) => column.key === key)?.visible ??
      true) &&
    columnStyle(key)?.visibleOnPdf !== false &&
    !columnStyle(key)?.internalOnly;

  const drawPageHeader = (continued = false) => {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 612,
      height: 792,
      color: pageBackground,
    });
    page.drawRectangle({
      x: 0,
      y: 752,
      width: 612,
      height: 40,
      color: color(
        documentStyle?.headerStyle.backgroundColor,
        documentStyle?.headerStyle.showBackground ? "#2957e8" : "#ffffff",
      ),
    });
    page.drawText(business.name, {
      x: 42,
      y: 728,
      size: documentStyle?.headerStyle.businessNameFontSize ?? 18,
      font: bold,
      color: color(documentStyle?.headerStyle.businessNameColor, "#0f1c3b"),
    });
    page.drawText(
      (estimate.title ?? estimate.deliverySettings?.documentTitle ?? "ESTIMATE")
        .toUpperCase()
        .slice(0, 28),
      {
        x: 362,
        y: 728,
        size: documentStyle?.headerStyle.documentTitleFontSize ?? 14,
        font: bold,
        color: blue,
      },
    );
    page.drawText(`${business.phone} | ${business.email}`, {
      x: 42,
      y: 708,
      size: 8.5,
      font: regular,
      color: muted,
    });
    page.drawText(
      `Estimate #${estimate.number}${continued ? " - Continued" : ""}`,
      { x: 420, y: 708, size: 9, font: bold, color: navy },
    );
    y = 680;
  };
  const newPage = () => {
    page = pdf.addPage([612, 792]);
    drawPageHeader(true);
  };
  const ensureSpace = (needed: number) => {
    if (y - needed < 76) newPage();
  };
  const drawColumnHeader = () => {
    ensureSpace(34);
    const cells = [
      ["description", 42, 320],
      ["quantity", 362, 58],
      ["rate", 420, 80],
      ["total", 500, 70],
    ] as const;
    cells.forEach(([key, x, width]) => {
      if (!columnVisible(key)) return;
      page.drawRectangle({
        x,
        y: y - 5,
        width,
        height: 26,
        color: color(
          columnStyle(key)?.headerBackgroundColor ??
            documentStyle?.tableStyle.headerRowBackgroundColor,
          "#edf2ff",
        ),
        borderColor: color(
          columnStyle(key)?.borderColor ??
            documentStyle?.tableStyle.columnLineColor,
          "#d4dbe8",
        ),
        borderWidth: documentStyle?.tableStyle.tableBorderWidth ?? 0.5,
      });
    });
    if (columnVisible("description"))
      page.drawText(columnStyle("description")?.columnLabel ?? "DESCRIPTION", {
        x: 52,
        y: y + 4,
        size: columnStyle("description")?.fontSize ?? 8,
        font: bold,
        color: color(
          columnStyle("description")?.headerTextColor ??
            documentStyle?.tableStyle.headerRowTextColor,
          "#0f1c3b",
        ),
      });
    if (columnVisible("quantity"))
      page.drawText(columnStyle("quantity")?.columnLabel ?? "QTY", {
        x: 372,
        y: y + 4,
        size: 8,
        font: bold,
        color: color(columnStyle("quantity")?.headerTextColor, "#0f1c3b"),
      });
    if (columnVisible("rate"))
      page.drawText(columnStyle("rate")?.columnLabel ?? "RATE", {
        x: 430,
        y: y + 4,
        size: 8,
        font: bold,
        color: color(columnStyle("rate")?.headerTextColor, "#0f1c3b"),
      });
    if (columnVisible("total"))
      page.drawText(columnStyle("total")?.columnLabel ?? "TOTAL", {
        x: 510,
        y: y + 4,
        size: 8,
        font: bold,
        color: color(columnStyle("total")?.headerTextColor, "#0f1c3b"),
      });
    y -= 28;
  };
  const drawItem = (item: EstimateLineItem) => {
    ensureSpace(27);
    page.drawRectangle({
      x: 42,
      y: y - 6,
      width: 528,
      height: 22,
      color: color(
        itemRowIndex % 2 && documentStyle?.rowStyle.useAlternatingRows
          ? documentStyle.rowStyle.alternatingRowBackgroundColor
          : documentStyle?.rowStyle.standardRowBackgroundColor,
        "#ffffff",
      ),
    });
    if (columnVisible("description"))
      page.drawText(item.name.slice(0, 48), {
        x: 52,
        y,
        size: columnStyle("description")?.fontSize ?? 9,
        font: regular,
        color: color(columnStyle("description")?.bodyTextColor, "#0f1c3b"),
      });
    if (columnVisible("quantity"))
      page.drawText(String(item.quantity), {
        x: 382,
        y,
        size: 9,
        font: regular,
        color: color(columnStyle("quantity")?.bodyTextColor, "#0f1c3b"),
      });
    if (columnVisible("rate"))
      page.drawText(dollars(item.unitPrice), {
        x: 430,
        y,
        size: 9,
        font: regular,
        color: color(columnStyle("rate")?.bodyTextColor, "#0f1c3b"),
      });
    if (columnVisible("total"))
      page.drawText(dollars(item.quantity * item.unitPrice), {
        x: 505,
        y,
        size: 9,
        font: bold,
        color: color(columnStyle("total")?.bodyTextColor, "#0f1c3b"),
      });
    y -= 22;
    page.drawLine({
      start: { x: 42, y: y + 9 },
      end: { x: 570, y: y + 9 },
      thickness: 0.5,
      color: border,
    });
    itemRowIndex += 1;
  };
  const drawWrapped = (
    text: string,
    x: number,
    widthChars: number,
    size = 8.5,
    textColor = muted,
  ) => {
    const lines = text.match(
      new RegExp(`.{1,${widthChars}}(?:\\s|$)`, "g"),
    ) ?? [text];
    for (const line of lines) {
      ensureSpace(14);
      page.drawText(line.trim(), {
        x,
        y,
        size,
        font: regular,
        color: textColor,
      });
      y -= 13;
    }
  };

  drawPageHeader();
  page.drawText("PREPARED FOR", { x: 42, y, size: 8, font: bold, color: blue });
  page.drawText("PROJECT", { x: 320, y, size: 8, font: bold, color: blue });
  y -= 18;
  page.drawText(customer?.businessName || customer?.name || "Customer", {
    x: 42,
    y,
    size: 11,
    font: bold,
    color: navy,
  });
  page.drawText(estimate.projectName, {
    x: 320,
    y,
    size: 11,
    font: bold,
    color: navy,
  });
  y -= 17;
  if (customer?.address && template?.customerInfoSettings.address !== false)
    page.drawText(customer.address.slice(0, 54), {
      x: 42,
      y,
      size: 8.5,
      font: regular,
      color: muted,
    });
  page.drawText(
    estimate.estimateDate
      ? new Date(`${estimate.estimateDate}T12:00:00`).toLocaleDateString()
      : new Date().toLocaleDateString(),
    { x: 320, y, size: 8.5, font: regular, color: muted },
  );
  y -= 38;
  drawColumnHeader();

  const visibleSections = (estimate.sections ?? []).filter(
    (section) => section.pdfVisible && !section.internalOnly,
  );
  if (visibleSections.length) {
    for (const section of visibleSections) {
      ensureSpace(48);
      page.drawText(section.title.toUpperCase().slice(0, 58), {
        x: 52,
        y,
        size: 9.5,
        font: bold,
        color: navy,
      });
      y -= 20;
      for (const item of estimate.lineItems.filter(
        (line) =>
          line.sectionId === section.id &&
          line.visibleToCustomer &&
          line.pdfVisible !== false &&
          !line.internalOnly,
      ))
        drawItem(item);
      y -= 7;
    }
  } else {
    for (const item of estimate.lineItems.filter(
      (line) => line.visibleToCustomer,
    ))
      drawItem(item);
  }

  ensureSpace(92);
  page.drawLine({
    start: { x: 360, y: y + 10 },
    end: { x: 570, y: y + 10 },
    thickness: 1,
    color: color(documentStyle?.totalsBoxStyle.borderColor, "#0f1c3b"),
  });
  page.drawText("Subtotal", {
    x: 410,
    y: y - 8,
    size: 9,
    font: regular,
    color: color(documentStyle?.totalsBoxStyle.secondaryTextColor, "#616f8c"),
  });
  page.drawText(dollars(estimate.subtotal ?? estimate.total), {
    x: 500,
    y: y - 8,
    size: 9,
    font: bold,
    color: color(documentStyle?.totalsBoxStyle.amountColor, "#0f1c3b"),
  });
  y -= 23;
  if (estimate.discount) {
    page.drawText("Discount", {
      x: 410,
      y,
      size: 9,
      font: regular,
      color: color(documentStyle?.totalsBoxStyle.secondaryTextColor, "#616f8c"),
    });
    page.drawText(`-${dollars(estimate.discount)}`, {
      x: 500,
      y,
      size: 9,
      font: bold,
      color: color(documentStyle?.totalsBoxStyle.amountColor, "#0f1c3b"),
    });
    y -= 18;
  }
  if (estimate.tax) {
    page.drawText("Tax", {
      x: 410,
      y,
      size: 9,
      font: regular,
      color: color(documentStyle?.totalsBoxStyle.secondaryTextColor, "#616f8c"),
    });
    page.drawText(dollars(estimate.tax), {
      x: 500,
      y,
      size: 9,
      font: bold,
      color: color(documentStyle?.totalsBoxStyle.amountColor, "#0f1c3b"),
    });
    y -= 18;
  }
  page.drawText("TOTAL", {
    x: 410,
    y,
    size: 11,
    font: bold,
    color: color(documentStyle?.totalsBoxStyle.labelColor, "#2957e8"),
  });
  page.drawText(dollars(estimate.total), {
    x: 486,
    y: y - 3,
    size: documentStyle?.totalsBoxStyle.finalTotalFontSize ?? 15,
    font: bold,
    color: color(documentStyle?.totalsBoxStyle.amountColor, "#0f1c3b"),
  });
  y -= 42;

  const numberedNotes = estimate.numberedNotes ?? [];
  const terms = estimate.termsData
    ? `${estimate.termsData.paymentTerms}. ${estimate.termsData.expirationText}. ${estimate.termsData.changeOrderPolicy}`
    : (estimate.deliverySettings?.terms ??
      "Work and payment terms are subject to the approved estimate and accepted change orders.");
  if (
    template?.notesSettings.showNotes !== false ||
    template?.termsSettings.showTerms !== false
  ) {
    ensureSpace(80);
    page.drawText("NOTES & TERMS", {
      x: 42,
      y,
      size: 9,
      font: bold,
      color: color(documentStyle?.notesStyle.headingColor, "#2957e8"),
    });
    y -= 17;
    if (template?.notesSettings.showNotes !== false)
      numberedNotes.forEach((note, index) =>
        drawWrapped(
          `${index + 1}. ${note}`,
          42,
          92,
          documentStyle?.notesStyle.bodyFontSize ?? 8.5,
          color(documentStyle?.notesStyle.bodyTextColor, "#616f8c"),
        ),
      );
    if (template?.termsSettings.showTerms !== false)
      drawWrapped(
        terms,
        42,
        92,
        documentStyle?.termsStyle.bodyFontSize ?? 8.5,
        color(documentStyle?.termsStyle.bodyTextColor, "#616f8c"),
      );
  }
  if (template?.signatureSettings.showApprovalArea !== false) {
    ensureSpace(54);
    page.drawLine({
      start: { x: 42, y: y - 14 },
      end: { x: 250, y: y - 14 },
      thickness: 0.8,
      color: color(documentStyle?.signatureStyle.lineColor, "#616f8c"),
    });
    page.drawText("Customer approval / signature", {
      x: 42,
      y: y - 28,
      size: documentStyle?.signatureStyle.signatureFontSize ?? 8,
      font: regular,
      color: color(documentStyle?.signatureStyle.labelColor, "#616f8c"),
    });
  }

  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({
      start: { x: 42, y: 52 },
      end: { x: 570, y: 52 },
      thickness: 0.5,
      color: color(documentStyle?.footerStyle.borderColor, "#d4dbe8"),
    });
    if (template?.footerSettings.showFooter !== false)
      pdfPage.drawText(
        String(
          template?.footerSettings.footerText ??
            estimate.deliverySettings?.documentFooter ??
            `Thank you for choosing ${business.name}.`,
        ),
        {
          x: 42,
          y: 36,
          size: documentStyle?.footerStyle.fontSize ?? 7.5,
          font: regular,
          color: color(documentStyle?.footerStyle.textColor, "#616f8c"),
        },
      );
    pdfPage.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: 520,
      y: 36,
      size: 7.5,
      font: regular,
      color: muted,
    });
  });

  const bytes = await pdf.save();
  const pdfBuffer = new Uint8Array(bytes.length);
  pdfBuffer.set(bytes);
  const blob = new Blob([pdfBuffer.buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName(business.name)}-estimate-${safeName(estimate.number)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
