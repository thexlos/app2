import {
  Check,
  CheckCircle2,
  CircleHelp,
  Download,
  ExternalLink,
  FileImage,
  FileText,
  Link2,
  Plus,
  QrCode,
  Save,
  Send,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { getBuilderContract } from "../config/builderContracts";
import { businessSavedLinks } from "../data/mock/businessLinks";
import {
  buildQrPayload,
  buildVCardPayload,
  createQrPdfSign,
  downloadQrPng,
  downloadQrSvg,
  generateQrDataUrl,
  generateQrSvg,
  normalizeUrlInput,
  qrTypes,
  sanitizeQrFileName,
  validateQrInput,
  type QrType,
} from "../services/qr/qrGenerator";
import { useAppState } from "../state/AppState";

const savedLinkKeys: Partial<
  Record<QrType, keyof (typeof businessSavedLinks)[string]>
> = {
  "Website / Link": "website",
  "Google Review": "googleReview",
  "Booking Link": "booking",
  "Payment Link": "payment",
  "Facebook Page": "facebook",
  "Instagram Page": "instagram",
};

const nextActions = [
  { label: "Open in My Creations", icon: ExternalLink },
  { label: "Download PNG", icon: FileImage },
  { label: "Download SVG", icon: FileImage },
  { label: "Download PDF Sign", icon: FileText },
  { label: "Add to Flyer", icon: Plus },
  { label: "Add to Business Card", icon: WalletCards },
  { label: "Add to Lead Form", icon: Plus },
  { label: "Add to Estimate/Invoice", icon: FileText },
  { label: "Send to Customers", icon: Send },
  { label: "Request Start Here Help", icon: CircleHelp },
];

export function QRCodeBuilderScreen() {
  const {
    currentBusiness,
    currentBusinessId,
    workspace,
    createQrCode,
    saveWorkshopItem,
    addFileMetadata,
    openCreateTask,
    openHelpRequest,
    setCurrentScreen,
    recordWorkshopAction,
    guidedDraft,
    clearGuidedDraft,
    selectedWorkshopItemId,
    selectedQrId,
    qrBuilderPrefill,
  } = useAppState();
  const contract = getBuilderContract("Create QR Code")!;
  const savedLinks = businessSavedLinks[currentBusinessId];
  const selectedWorkshopItem = selectedWorkshopItemId
    ? workspace.workshopItems.find((item) => item.id === selectedWorkshopItemId)
    : undefined;
  const selectedQr =
    (selectedQrId
      ? workspace.qrCodes.find((item) => item.id === selectedQrId)
      : undefined) ??
    (selectedWorkshopItem?.qrCodeIds[0]
      ? workspace.qrCodes.find((item) => item.id === selectedWorkshopItem.qrCodeIds[0])
      : undefined);
  const guided =
    guidedDraft?.builderId === "qr-code-builder"
      ? guidedDraft.answers
      : undefined;
  const savedBuilderData = selectedWorkshopItem?.builderData;
  const initialQrType =
    (savedBuilderData?.qrType as QrType | undefined) ??
    (selectedQr?.type as QrType | undefined) ??
    (qrBuilderPrefill?.qrType as QrType | undefined) ??
    (guided?.qrType as QrType | undefined) ??
    "";
  const initialDestination =
    String(
      savedBuilderData?.destination ??
        selectedQr?.url ??
        (selectedQr?.payloadType === "url" ? selectedQr.payload : "") ??
        qrBuilderPrefill?.destination ??
        guided?.destination ??
        "",
    );
  const [qrType, setQrType] = useState<QrType | "">(initialQrType);
  const [destination, setDestination] = useState(initialDestination);
  const [leadFormId, setLeadFormId] = useState("");
  const [qrName, setQrName] = useState(
    String(
      savedBuilderData?.qrName ??
        selectedQr?.name ??
        qrBuilderPrefill?.qrName ??
        guided?.qrName ??
        "",
    ),
  );
  const [shortLabel, setShortLabel] = useState(
    String(
      savedBuilderData?.shortLabel ??
        selectedQr?.label ??
        qrBuilderPrefill?.shortLabel ??
        guided?.shortLabel ??
        "",
    ),
  );
  const [contact, setContact] = useState({
    contactName: String(savedBuilderData?.contactName ?? ""),
    businessName: String(savedBuilderData?.businessName ?? currentBusiness.name),
    phone: String(savedBuilderData?.phone ?? currentBusiness.phone),
    email: String(savedBuilderData?.email ?? currentBusiness.email),
    website: String(savedBuilderData?.website ?? savedLinks.website),
    address: String(savedBuilderData?.address ?? ""),
    notes: String(savedBuilderData?.notes ?? ""),
  });
  const [tested, setTested] = useState<"idle" | "valid" | "invalid">("idle");
  const [created, setCreated] = useState(false);
  const [savedItemId, setSavedItemId] = useState("");
  const [savedQrId, setSavedQrId] = useState(selectedQr?.id ?? "");
  const [actionMessage, setActionMessage] = useState("");
  const [previewSvg, setPreviewSvg] = useState(selectedQr?.svg ?? "");
  const [previewDataUrl, setPreviewDataUrl] = useState(selectedQr?.dataUrl ?? "");
  const [advanced, setAdvanced] = useState({
    qrColor: selectedQr?.foregroundColor ?? "#101c3b",
    backgroundColor: selectedQr?.backgroundColor ?? "#ffffff",
    addLogo: false,
    saveToVault: true,
    exportSize: "1024 × 1024 PNG",
    errorCorrectionLevel: (selectedQr?.errorCorrectionLevel ?? "M") as
      | "L"
      | "M"
      | "Q"
      | "H",
  });

  useEffect(() => {
    setQrType(initialQrType);
    setDestination(initialDestination);
    setQrName(
      String(
        savedBuilderData?.qrName ??
          selectedQr?.name ??
          qrBuilderPrefill?.qrName ??
          guided?.qrName ??
          "",
      ),
    );
    setShortLabel(
      String(
        savedBuilderData?.shortLabel ??
          selectedQr?.label ??
          qrBuilderPrefill?.shortLabel ??
          guided?.shortLabel ??
          "",
      ),
    );
    setSavedItemId(selectedWorkshopItem?.id ?? selectedQr?.workshopItemId ?? "");
    setSavedQrId(selectedQr?.id ?? "");
    setPreviewSvg(selectedQr?.svg ?? "");
    setPreviewDataUrl(selectedQr?.dataUrl ?? "");
  }, [
    guided,
    initialDestination,
    initialQrType,
    qrBuilderPrefill,
    savedBuilderData,
    selectedQr,
    selectedWorkshopItem?.id,
  ]);

  const isContact = qrType === "Contact Card";
  const hasContactMethod = Boolean(
    contact.phone.trim() ||
      contact.email.trim() ||
      contact.website.trim() ||
      contact.address.trim(),
  );
  const validation = useMemo(
    () =>
      validateQrInput({
        qrType,
        destination,
        contact,
      }),
    [contact, destination, qrType],
  );
  const canCreate = Boolean(qrType && qrName.trim() && validation.valid);
  const savedLinkKey = qrType ? savedLinkKeys[qrType] : undefined;
  const encodedContact = useMemo(() => buildVCardPayload(contact), [contact]);
  const previewDestination = isContact
    ? encodedContact
    : validation.normalizedUrl ?? destination;

  const validationStatus = created
    ? "Created and saved"
    : !qrType
      ? "Choose a QR code type"
      : !qrName.trim()
        ? contract.validationMessages.qrName
        : !validation.valid
          ? (validation.message ?? "Complete the QR destination.")
          : tested === "invalid"
            ? "Check the destination link format"
            : tested === "valid"
              ? "Link looks good"
              : "Ready to create";
  const statusTone =
    created || tested === "valid" ? "success" : canCreate ? "info" : "warning";

  useEffect(() => {
    let ignore = false;
    const next = buildQrPayload({ qrType, destination, contact });
    if (!next.valid || !next.payload) {
      if (!selectedQr?.svg) setPreviewSvg("");
      return;
    }
    void generateQrSvg(next.payload, {
      foregroundColor: advanced.qrColor,
      backgroundColor: advanced.backgroundColor,
      errorCorrectionLevel: advanced.errorCorrectionLevel,
      size: 300,
    }).then((svg) => {
      if (!ignore) setPreviewSvg(svg);
    });
    return () => {
      ignore = true;
    };
  }, [
    advanced.backgroundColor,
    advanced.errorCorrectionLevel,
    advanced.qrColor,
    contact,
    destination,
    qrType,
    selectedQr?.svg,
  ]);

  const chooseType = (value: QrType) => {
    setQrType(value);
    setCreated(false);
    setTested("idle");
    setActionMessage("");
    if (value === "Contact Card") setDestination("");
  };

  const chooseLeadForm = (id: string) => {
    setLeadFormId(id);
    const form = workspace.leadForms.find((item) => item.id === id);
    setDestination(form ? `${window.location.origin}${form.publicPath}` : "");
    setTested("idle");
  };

  const testLink = () => {
    if (isContact) return;
    try {
      const normalized = normalizeUrlInput(destination);
      setDestination(normalized);
      setTested("valid");
      window.open(normalized, "_blank", "noopener,noreferrer");
      setActionMessage("The destination link opened in a new tab.");
    } catch {
      setTested("invalid");
      setActionMessage("Use a valid link starting with http:// or https://.");
    }
  };

  const buildBuilderData = () => ({
    qrType,
    destination,
    qrName,
    shortLabel,
    contactName: contact.contactName,
    businessName: contact.businessName,
    phone: contact.phone,
    email: contact.email,
    website: contact.website,
    address: contact.address,
    notes: contact.notes,
    foregroundColor: advanced.qrColor,
    backgroundColor: advanced.backgroundColor,
    errorCorrectionLevel: advanced.errorCorrectionLevel,
  });

  const save = async (status: "Draft" | "Ready") => {
    if (!qrName.trim()) {
      setActionMessage("Name this QR code so you can find it later.");
      return;
    }
    if (!qrType) {
      setActionMessage("Choose what this QR code is for.");
      return;
    }
    const payloadResult = buildQrPayload({ qrType, destination, contact });
    if (status === "Ready" && (!payloadResult.valid || !payloadResult.payload)) {
      setActionMessage(
        payloadResult.message ??
          "Add a destination link so the QR code knows where to send people.",
      );
      return;
    }
    const payload = payloadResult.payload ?? (isContact ? encodedContact : destination);
    const svg =
      status === "Ready" && payload
        ? await generateQrSvg(payload, {
            foregroundColor: advanced.qrColor,
            backgroundColor: advanced.backgroundColor,
            errorCorrectionLevel: advanced.errorCorrectionLevel,
            size: 320,
          })
        : undefined;
    const dataUrl =
      status === "Ready" && payload
        ? await generateQrDataUrl(payload, {
            foregroundColor: advanced.qrColor,
            backgroundColor: advanced.backgroundColor,
            errorCorrectionLevel: advanced.errorCorrectionLevel,
            size: 1024,
          })
        : undefined;
    const saved = createQrCode({
      id: savedQrId || selectedQr?.id,
      workshopItemId: savedItemId || selectedWorkshopItem?.id,
      name: qrName.trim() || "Untitled QR Draft",
      type: qrType || "Not selected",
      url: payloadResult.normalizedUrl,
      payloadType: payloadResult.payloadType ?? (isContact ? "vcard" : "url"),
      payload,
      svg,
      dataUrl,
      foregroundColor: advanced.qrColor,
      backgroundColor: advanced.backgroundColor,
      errorCorrectionLevel: advanced.errorCorrectionLevel,
      size: 1024,
      margin: 2,
      label: shortLabel.trim() || undefined,
      status,
      fileAssetIds: selectedQr?.fileAssetIds ?? [],
      createdFrom: guided ? "Guided Wizard" : "Manual Builder",
      builderData: buildBuilderData(),
      previewData: {
        qrName,
        qrType,
        destination: previewDestination,
        shortLabel,
      },
    });
    if (guided) clearGuidedDraft();
    setSavedItemId(saved.workshopItemId);
    setSavedQrId(saved.qrCodeId);
    if (svg) setPreviewSvg(svg);
    if (dataUrl) setPreviewDataUrl(dataUrl);
    if (status === "Ready") {
      setCreated(true);
      setActionMessage(
        "Your QR code was created, generated, and saved to this business profile.",
      );
    } else
      setActionMessage(
        "Draft saved. You can finish the destination and name later.",
      );
  };

  const createDownload = async (format: "png" | "svg" | "pdf") => {
    const payloadResult = buildQrPayload({ qrType, destination, contact });
    if (!payloadResult.valid || !payloadResult.payload) {
      setActionMessage(payloadResult.message ?? "Complete the QR before download.");
      return;
    }
    const baseName = sanitizeQrFileName(qrName);
    const options = {
      foregroundColor: advanced.qrColor,
      backgroundColor: advanced.backgroundColor,
      errorCorrectionLevel: advanced.errorCorrectionLevel,
      size: format === "png" ? 1024 : 320,
    };
    const svg =
      previewSvg || (await generateQrSvg(payloadResult.payload, options));
    const dataUrl =
      previewDataUrl || (await generateQrDataUrl(payloadResult.payload, options));
    let fileName = `${baseName}.png`;
    let type = "image/png";
    let fileDataUrl = dataUrl;
    let generatedContent: string | undefined;
    if (format === "svg") {
      fileName = `${baseName}.svg`;
      type = "image/svg+xml";
      generatedContent = svg;
      downloadQrSvg(fileName, svg);
    } else if (format === "pdf") {
      fileName = `${baseName}-sign.pdf`;
      type = "application/pdf";
      fileDataUrl = await createQrPdfSign({
        title: qrName,
        label: shortLabel || qrName,
        dataUrl,
      });
      downloadQrPng(fileName, fileDataUrl);
    } else {
      downloadQrPng(fileName, dataUrl);
    }
    const fileId = addFileMetadata({
      name: fileName,
      type,
      workshopItemId: savedItemId || selectedWorkshopItem?.id,
      qrCodeId: savedQrId || selectedQr?.id,
      source: "QR Generator",
      dataUrl: format === "svg" ? undefined : fileDataUrl,
      generatedContent,
      metadataOnly: false,
    });
    if (savedQrId || selectedQr?.id) {
      createQrCode({
        id: savedQrId || selectedQr?.id,
        workshopItemId: savedItemId || selectedWorkshopItem?.id,
        name: qrName.trim() || "Untitled QR Draft",
        type: qrType || "Custom URL",
        label: shortLabel.trim() || undefined,
        status: "Ready",
        payloadType: payloadResult.payloadType,
        payload: payloadResult.payload,
        url: payloadResult.normalizedUrl,
        svg,
        dataUrl,
        foregroundColor: advanced.qrColor,
        backgroundColor: advanced.backgroundColor,
        errorCorrectionLevel: advanced.errorCorrectionLevel,
        fileAssetIds: Array.from(
          new Set([fileId, ...(selectedQr?.fileAssetIds ?? [])]),
        ),
        createdFrom: guided ? "Guided Wizard" : "Manual Builder",
        builderData: buildBuilderData(),
        previewData: {
          qrName,
          qrType,
          destination: previewDestination,
          shortLabel,
        },
      });
    }
    if (savedItemId || selectedWorkshopItem?.id) {
      saveWorkshopItem({
        ...(selectedWorkshopItem ?? {
          itemType: "qr_code",
          title: qrName,
          description: shortLabel || previewDestination,
          status: "Ready",
          createdFrom: "Manual Builder",
          tags: [qrType || "QR Code"],
          exportFormats: ["PNG", "SVG", "PDF Sign"],
        }),
        id: savedItemId || selectedWorkshopItem?.id,
        fileAssetIds: Array.from(
          new Set([fileId, ...(selectedWorkshopItem?.fileAssetIds ?? [])]),
        ),
        qrCodeIds: Array.from(
          new Set([
            savedQrId || selectedQr?.id || "",
            ...(selectedWorkshopItem?.qrCodeIds ?? []),
          ].filter(Boolean)),
        ),
      });
    }
    setActionMessage(`${fileName} downloaded and saved to File Vault.`);
  };

  const runNextAction = async (label: string) => {
    if (label === "Open in My Creations") {
      setCurrentScreen("workshop-library");
      return;
    }
    if (label === "Request Start Here Help") {
      openHelpRequest(contract.helpHandoffType);
      return;
    }
    if (label === "Download PNG") {
      await createDownload("png");
      return;
    }
    if (label === "Download SVG") {
      await createDownload("svg");
      return;
    }
    if (label === "Download PDF Sign") {
      await createDownload("pdf");
      return;
    }
    if (label === "Add to Flyer") return openCreateTask("Make a Flyer");
    if (label === "Add to Business Card")
      return openCreateTask("Business Cards");
    if (label === "Add to Lead Form") return openCreateTask("Lead Forms");
    if (label === "Add to Estimate/Invoice") {
      if (savedItemId) recordWorkshopAction(savedItemId, label);
      setCurrentScreen("money");
      return;
    }
    if (label === "Send to Customers") {
      if (savedItemId) recordWorkshopAction(savedItemId, label);
      setCurrentScreen("customers");
      return;
    }
    if (savedItemId) recordWorkshopAction(savedItemId, label);
    setActionMessage(`${label} is ready as the next mock workflow step.`);
  };

  return (
    <section className="screen screen--detail qr-builder-screen">
      <DetailHeader title="QR Code Builder" backTo="create-mode" />
      <div className="section qr-builder-intro">
        <div className="icon-box">
          <QrCode size={23} />
        </div>
        <div>
          <h1 className="page-title">Create QR Code</h1>
          <p className="page-subtitle">{contract.purpose}</p>
        </div>
      </div>
      <div className="qr-builder-layout section">
        <div className="stack qr-builder-form">
          <section
            className="card panel stack"
            aria-labelledby="qr-type-heading"
          >
            <div>
              <h2 id="qr-type-heading" className="section-heading">
                1. QR Code Type
              </h2>
              <p className="section-copy">What is this QR code for?</p>
            </div>
            <div className="qr-type-grid">
              {qrTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={
                    qrType === type
                      ? "qr-type-option qr-type-option--active"
                      : "qr-type-option"
                  }
                  onClick={() => chooseType(type)}
                >
                  <span>{type}</span>
                  {qrType === type && <Check size={17} />}
                </button>
              ))}
            </div>
          </section>

          <section
            className="card panel stack"
            aria-labelledby="qr-destination-heading"
          >
            <div>
              <h2 id="qr-destination-heading" className="section-heading">
                2. Destination
              </h2>
              <p className="section-copy">
                This is where people will go when they scan the QR code.
              </p>
            </div>
            {isContact ? (
              <div className="contact-card-fields">
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    className="input"
                    value={contact.contactName}
                    onChange={(event) =>
                      setContact({
                        ...contact,
                        contactName: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-business">Business name</label>
                  <input
                    id="contact-business"
                    className="input"
                    value={contact.businessName}
                    onChange={(event) =>
                      setContact({
                        ...contact,
                        businessName: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-phone">Phone</label>
                  <input
                    id="contact-phone"
                    className="input"
                    value={contact.phone}
                    onChange={(event) =>
                      setContact({ ...contact, phone: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input"
                    value={contact.email}
                    onChange={(event) =>
                      setContact({ ...contact, email: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    className="input"
                    value={contact.website}
                    onChange={(event) =>
                      setContact({ ...contact, website: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-address">Address</label>
                  <input
                    id="contact-address"
                    className="input"
                    value={contact.address}
                    onChange={(event) =>
                      setContact({ ...contact, address: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-notes">Notes, optional</label>
                  <input
                    id="contact-notes"
                    className="input"
                    value={contact.notes}
                    onChange={(event) =>
                      setContact({ ...contact, notes: event.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                {qrType === "Lead Form" && (
                  <div className="field">
                    <label htmlFor="lead-form">
                      Choose an existing lead form
                    </label>
                    <select
                      id="lead-form"
                      className="select"
                      value={leadFormId}
                      onChange={(event) => chooseLeadForm(event.target.value)}
                    >
                      <option value="">Choose a lead form</option>
                      {workspace.leadForms.map((form) => (
                        <option key={form.id} value={form.id}>
                          {form.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="inline-link"
                      onClick={() => openCreateTask("Lead Forms")}
                    >
                      <Plus size={16} /> Create a new lead form
                    </button>
                  </div>
                )}
                <div className="field">
                  <label htmlFor="destination-link">Destination link</label>
                  <input
                    id="destination-link"
                    type="url"
                    className="input"
                    value={destination}
                    onChange={(event) => {
                      setDestination(event.target.value);
                      setTested("idle");
                      setCreated(false);
                    }}
                    placeholder="Paste the link people should open"
                  />
                  <small className="field-help">
                    This is where people will go when they scan the QR code.
                  </small>
                </div>
                {savedLinkKey && (
                  <button
                    type="button"
                    className="saved-link-button"
                    onClick={() => {
                      setDestination(savedLinks[savedLinkKey]);
                      setTested("idle");
                    }}
                  >
                    <Link2 size={18} />
                    <span>
                      <strong>Use saved {qrType.toLowerCase()} link</strong>
                      <small>{currentBusiness.name}</small>
                    </span>
                  </button>
                )}
              </>
            )}
          </section>

          <section className="card panel stack">
            <div>
              <h2 className="section-heading">3. Save Details</h2>
              <p className="section-copy">
                Use a clear internal name so this QR code is easy to find later.
              </p>
            </div>
            <div className="field">
              <label htmlFor="qr-name">QR code name</label>
              <input
                id="qr-name"
                className="input"
                value={qrName}
                onChange={(event) => {
                  setQrName(event.target.value);
                  setCreated(false);
                }}
                placeholder="Example: Free Quote QR, Menu QR, Review QR"
              />
              <small className="field-help">
                This name is for saving and tracking inside the app.
              </small>
            </div>
            <div className="field">
              <label htmlFor="qr-label">Short label, optional</label>
              <input
                id="qr-label"
                className="input"
                value={shortLabel}
                onChange={(event) => setShortLabel(event.target.value)}
                placeholder="Example: Scan to book, Scan for menu, Leave us a review"
              />
              <small className="field-help">
                This can appear under the QR code when added to signs or flyers.
              </small>
            </div>
          </section>

          <details className="qr-more-options card panel">
            <summary>More Options</summary>
            <div className="qr-advanced-grid">
              <div className="field">
                <label htmlFor="qr-color">QR color</label>
                <input
                  id="qr-color"
                  type="color"
                  value={advanced.qrColor}
                  onChange={(event) =>
                    setAdvanced({ ...advanced, qrColor: event.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="qr-bg">Background color</label>
                <input
                  id="qr-bg"
                  type="color"
                  value={advanced.backgroundColor}
                  onChange={(event) =>
                    setAdvanced({
                      ...advanced,
                      backgroundColor: event.target.value,
                    })
                  }
                />
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={advanced.addLogo}
                  onChange={(event) =>
                    setAdvanced({ ...advanced, addLogo: event.target.checked })
                  }
                />{" "}
                Add logo in center
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={advanced.saveToVault}
                  onChange={(event) =>
                    setAdvanced({
                      ...advanced,
                      saveToVault: event.target.checked,
                    })
                  }
                />{" "}
                Save to File Vault
              </label>
              <div className="field">
                <label htmlFor="export-size">Export size</label>
                <select
                  id="export-size"
                  className="select"
                  value={advanced.exportSize}
                  onChange={(event) =>
                    setAdvanced({ ...advanced, exportSize: event.target.value })
                  }
                >
                  <option>512 × 512 PNG</option>
                  <option>1024 × 1024 PNG</option>
                  <option>Print PDF Sign</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="qr-error-correction">
                  Error correction level
                </label>
                <select
                  id="qr-error-correction"
                  className="select"
                  value={advanced.errorCorrectionLevel}
                  onChange={(event) =>
                    setAdvanced({
                      ...advanced,
                      errorCorrectionLevel: event.target.value as
                        | "L"
                        | "M"
                        | "Q"
                        | "H",
                    })
                  }
                >
                  <option value="L">L — smallest</option>
                  <option value="M">M — standard</option>
                  <option value="Q">Q — stronger</option>
                  <option value="H">H — strongest</option>
                </select>
              </div>
              <p className="small muted qr-advanced-note">
                Add to customer/project · Add to campaign/promo · Scan tracking
                and error correction are planned placeholders.
              </p>
            </div>
          </details>
        </div>

        <aside className="qr-preview-card" aria-label="QR code preview">
          <div className="qr-preview-top">
            <span>QR Preview</span>
            <span className={`status status--${statusTone}`}>
              {created ? "Saved" : "Simple Mode"}
            </span>
          </div>
          <div
            className="qr-placeholder"
            style={{
              color: advanced.qrColor,
              background: advanced.backgroundColor,
            }}
          >
            {previewSvg ? (
              <span
                className="qr-generated-preview"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
            ) : (
              <QrCode size={132} strokeWidth={1.7} />
            )}
            {advanced.addLogo && (
              <span className="qr-logo">{currentBusiness.initials}</span>
            )}
          </div>
          <div className="qr-preview-copy">
            <h2>{qrName || "Your QR code name"}</h2>
            <strong>{qrType || "Choose a QR type"}</strong>
            <p>
              {previewDestination || "The destination link will appear here."}
            </p>
            {shortLabel && <div className="qr-short-label">{shortLabel}</div>}
          </div>
          <div className={`qr-status qr-status--${statusTone}`}>
            <CheckCircle2 size={19} />
            <span>{validationStatus}</span>
          </div>
        </aside>
      </div>

      <section
        className="qr-primary-actions section"
        aria-label="QR code actions"
      >
        <Button
          variant="outline"
          icon={<ExternalLink size={18} />}
          disabled={isContact || !destination.trim()}
          onClick={testLink}
        >
          Test Link
        </Button>
        <Button
          variant="primary"
          icon={<QrCode size={18} />}
          disabled={!canCreate}
          onClick={() => void save("Ready")}
        >
          Create QR Code
        </Button>
        <Button
          variant="neutral"
          icon={<Save size={18} />}
          onClick={() => void save("Draft")}
        >
          Save Draft
        </Button>
      </section>
      {actionMessage && (
        <div
          className={
            tested === "invalid"
              ? "alert alert--danger section"
              : "alert alert--info section"
          }
          aria-live="polite"
        >
          <CheckCircle2 size={20} />
          <div>
            <strong>{actionMessage}</strong>
          </div>
        </div>
      )}

      {created && (
        <section className="section">
          <div>
            <h2 className="section-heading">What do you want to do next?</h2>
            <p className="section-copy">
              Reuse this QR code without rebuilding it.
            </p>
          </div>
          <div className="qr-next-actions">
            {nextActions.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => void runNextAction(label)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {!created && (
        <button
          type="button"
          className="qr-help-link section"
          onClick={() => openHelpRequest(contract.helpHandoffType)}
        >
          <UserRound size={19} /> Need help creating this QR code?
        </button>
      )}
    </section>
  );
}
