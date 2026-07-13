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
  downloadDataUrl,
  downloadSvgFile,
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
    createQrFileVaultCopy,
    openCreateTask,
    openHelpRequest,
    setCurrentScreen,
    recordWorkshopAction,
    saveRecoveryDraft,
    clearRecoveryDraftForBuilder,
    selectedRecoveryDraftId,
    recoveryDrafts,
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
  const recoveryDraft =
    selectedRecoveryDraftId
      ? recoveryDrafts.find(
          (draft) =>
            draft.id === selectedRecoveryDraftId &&
            draft.builderId === "qr-code-builder",
        )
      : undefined;
  const savedBuilderData = selectedWorkshopItem?.builderData;
  const initialQrType =
    (recoveryDraft?.builderData.qrType as QrType | undefined) ??
    (savedBuilderData?.qrType as QrType | undefined) ??
    (selectedQr?.type as QrType | undefined) ??
    (qrBuilderPrefill?.qrType as QrType | undefined) ??
    (guided?.qrType as QrType | undefined) ??
    "";
  const initialDestination =
    String(
      recoveryDraft?.builderData.destination ??
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
      recoveryDraft?.builderData.qrName ??
        savedBuilderData?.qrName ??
        selectedQr?.name ??
        qrBuilderPrefill?.qrName ??
        guided?.qrName ??
        "",
    ),
  );
  const [shortLabel, setShortLabel] = useState(
    String(
      recoveryDraft?.builderData.shortLabel ??
        savedBuilderData?.shortLabel ??
        selectedQr?.label ??
        qrBuilderPrefill?.shortLabel ??
        guided?.shortLabel ??
        "",
    ),
  );
  const [contact, setContact] = useState({
    contactName: String(recoveryDraft?.builderData.contactName ?? savedBuilderData?.contactName ?? ""),
    businessName: String(recoveryDraft?.builderData.businessName ?? savedBuilderData?.businessName ?? currentBusiness.name),
    phone: String(recoveryDraft?.builderData.phone ?? savedBuilderData?.phone ?? currentBusiness.phone),
    email: String(recoveryDraft?.builderData.email ?? savedBuilderData?.email ?? currentBusiness.email),
    website: String(recoveryDraft?.builderData.website ?? savedBuilderData?.website ?? savedLinks.website),
    address: String(recoveryDraft?.builderData.address ?? savedBuilderData?.address ?? ""),
    notes: String(recoveryDraft?.builderData.notes ?? savedBuilderData?.notes ?? ""),
  });
  const [tested, setTested] = useState<"idle" | "valid" | "invalid">("idle");
  const [created, setCreated] = useState(false);
  const [savedItemId, setSavedItemId] = useState("");
  const [savedQrId, setSavedQrId] = useState(selectedQr?.id ?? "");
  const [actionMessage, setActionMessage] = useState("");
  const [previewSvg, setPreviewSvg] = useState(selectedQr?.svg ?? "");
  const [previewDataUrl, setPreviewDataUrl] = useState(selectedQr?.dataUrl ?? "");
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [pendingVaultCopy, setPendingVaultCopy] = useState<{
    context: "created" | "download";
    fileName: string;
    type: string;
    format: "png" | "svg" | "pdf";
    dataUrl?: string;
    generatedContent?: string;
    qrDataUrl?: string;
    svg?: string;
  }>();
  const [advanced, setAdvanced] = useState({
    qrColor: selectedQr?.foregroundColor ?? "#101c3b",
    backgroundColor: selectedQr?.backgroundColor ?? "#ffffff",
    addLogo: false,
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
          recoveryDraft?.builderData.qrName ??
          savedBuilderData?.qrName ??
          selectedQr?.name ??
          qrBuilderPrefill?.qrName ??
          guided?.qrName ??
          "",
      ),
    );
    setShortLabel(
      String(
          recoveryDraft?.builderData.shortLabel ??
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
    setHasUserEdited(false);
    setPendingVaultCopy(undefined);
  }, [
    guided,
    initialDestination,
    initialQrType,
    qrBuilderPrefill,
    recoveryDraft,
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
    setHasUserEdited(true);
    setPendingVaultCopy(undefined);
    setActionMessage("");
    if (value === "Contact Card") setDestination("");
  };

  const chooseLeadForm = (id: string) => {
    setLeadFormId(id);
    const form = workspace.leadForms.find((item) => item.id === id);
    setDestination(form ? `${window.location.origin}${form.publicPath}` : "");
    setHasUserEdited(true);
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

  const hasMeaningfulQrInput = Boolean(
    qrType ||
      destination.trim() ||
      qrName.trim() ||
      shortLabel.trim() ||
      contact.contactName.trim() ||
      (contact.businessName.trim() &&
        contact.businessName.trim() !== currentBusiness.name.trim()) ||
      (contact.phone.trim() &&
        contact.phone.trim() !== currentBusiness.phone.trim()) ||
      (contact.email.trim() &&
        contact.email.trim() !== currentBusiness.email.trim()) ||
      (contact.website.trim() &&
        contact.website.trim() !== savedLinks.website.trim()) ||
      contact.address.trim() ||
      contact.notes.trim(),
  );

  useEffect(() => {
    if (!hasUserEdited || !hasMeaningfulQrInput) return;
    const timeout = window.setTimeout(() => {
      saveRecoveryDraft({
        builderId: "qr-code-builder",
        sourceTool: "Create QR Code",
        selectedCreateTask: "Create QR Code",
        selectedWorkshopItemId: savedItemId || selectedWorkshopItem?.id,
        selectedQrId: savedQrId || selectedQrId,
        builderData: buildBuilderData(),
      });
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [
    advanced.backgroundColor,
    advanced.errorCorrectionLevel,
    advanced.qrColor,
    contact,
    destination,
    hasMeaningfulQrInput,
    hasUserEdited,
    qrName,
    qrType,
    savedItemId,
    savedQrId,
    selectedQrId,
    selectedWorkshopItem?.id,
    shortLabel,
  ]);

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
    clearRecoveryDraftForBuilder("qr-code-builder", saved.workshopItemId);
    setSavedItemId(saved.workshopItemId);
    setSavedQrId(saved.qrCodeId);
    if (svg) setPreviewSvg(svg);
    if (dataUrl) setPreviewDataUrl(dataUrl);
    if (status === "Ready") {
      setCreated(true);
    setPendingVaultCopy({
        context: "created",
        fileName: `${sanitizeQrFileName(qrName)}.png`,
        type: "image/png",
        format: "png",
        dataUrl,
        qrDataUrl: dataUrl,
        svg,
      });
      setActionMessage("QR code generated and saved. Saved to My Creations.");
    } else
      setActionMessage(
        "Draft saved. You can finish the destination and name later.",
      );
  };

  const savePendingCopyToFileVault = () => {
    if (!pendingVaultCopy) return;
    const qrCodeId = savedQrId || selectedQr?.id;
    if (!qrCodeId) return;
    void createQrFileVaultCopy(qrCodeId, pendingVaultCopy.format).then(
      (result) => {
        setPendingVaultCopy(undefined);
        setActionMessage(result.message);
      },
    );
  };

  const createDownload = async (format: "png" | "svg" | "pdf") => {
    if (!qrName.trim()) {
      setActionMessage("Name this QR code so you can find it later.");
      return;
    }
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
      downloadSvgFile(fileName, svg);
    } else if (format === "pdf") {
      fileName = `${baseName}-sign.pdf`;
      type = "application/pdf";
      fileDataUrl = await createQrPdfSign({
        title: qrName,
        label: shortLabel || qrName,
        dataUrl,
      });
      downloadDataUrl(fileName, fileDataUrl);
    } else {
      downloadDataUrl(fileName, dataUrl);
    }
    setPendingVaultCopy({
      context: "download",
      fileName,
      type,
      format,
      dataUrl: format === "svg" ? undefined : fileDataUrl,
      generatedContent,
      qrDataUrl: dataUrl,
      svg,
    });
    setActionMessage(
      format === "pdf"
        ? "PDF sign downloaded to your device."
        : `${format.toUpperCase()} downloaded to your device.`,
    );
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
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({
                        ...contact,
                        contactName: event.target.value,
                      });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-business">Business name</label>
                  <input
                    id="contact-business"
                    className="input"
                    value={contact.businessName}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({
                        ...contact,
                        businessName: event.target.value,
                      });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-phone">Phone</label>
                  <input
                    id="contact-phone"
                    className="input"
                    value={contact.phone}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({ ...contact, phone: event.target.value });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input"
                    value={contact.email}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({ ...contact, email: event.target.value });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    className="input"
                    value={contact.website}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({ ...contact, website: event.target.value });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-address">Address</label>
                  <input
                    id="contact-address"
                    className="input"
                    value={contact.address}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({ ...contact, address: event.target.value });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-notes">Notes, optional</label>
                  <input
                    id="contact-notes"
                    className="input"
                    value={contact.notes}
                    onChange={(event) => {
                      setHasUserEdited(true);
                      setContact({ ...contact, notes: event.target.value });
                    }}
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
                      setHasUserEdited(true);
                      setPendingVaultCopy(undefined);
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
                      setHasUserEdited(true);
                      setPendingVaultCopy(undefined);
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
                  setHasUserEdited(true);
                  setPendingVaultCopy(undefined);
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
                onChange={(event) => {
                  setShortLabel(event.target.value);
                  setHasUserEdited(true);
                  setPendingVaultCopy(undefined);
                }}
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
                <span>
                  Show logo/initials in preview only
                  <small className="field-help">
                    Logo embedding in exported QR files is not connected yet.
                  </small>
                </span>
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
                placeholders stay behind advanced controls until those systems are connected.
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
      {pendingVaultCopy && (
        <section className="card panel section stack" aria-live="polite">
          <div>
            <h2 className="section-heading">
              {pendingVaultCopy.context === "created"
                ? "Save a copy to File Vault?"
                : "Save this downloaded file to File Vault?"}
            </h2>
            <p className="section-copy">
              {pendingVaultCopy.context === "created"
                ? "My Creations keeps the editable QR. File Vault keeps chosen files and exports."
                : "File Vault keeps a copy or reference inside this app."}
            </p>
          </div>
          <div className="row wrap">
            <Button
              variant="primary"
              onClick={savePendingCopyToFileVault}
            >
              {pendingVaultCopy.context === "created"
                ? "Yes, save copy"
                : "Save Copy to File Vault"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPendingVaultCopy(undefined);
                setActionMessage(
                  pendingVaultCopy.context === "created"
                    ? "No File Vault copy was saved. Your QR is still saved in My Creations."
                    : "No File Vault copy was saved.",
                );
              }}
            >
              {pendingVaultCopy.context === "created"
                ? "No, not now"
                : "No thanks"}
            </Button>
          </div>
        </section>
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
