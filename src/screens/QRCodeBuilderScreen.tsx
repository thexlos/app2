import {
  Check,
  CheckCircle2,
  ExternalLink,
  Link2,
  Plus,
  QrCode,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { getBuilderContract } from "../config/builderContracts";
import { businessSavedLinks } from "../data/mock/businessLinks";
import {
  buildQrPayload,
  buildVCardPayload,
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
    saveRecoveryDraft,
    clearRecoveryDraftForBuilder,
    selectedRecoveryDraftId,
    recoveryDrafts,
    guidedDraft,
    clearGuidedDraft,
    selectedWorkshopItemId,
    selectedFileId,
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
  const sourceFile =
    selectedFileId && selectedQr
      ? workspace.files.find(
          (file) => file.id === selectedFileId && file.qrCodeId === selectedQr.id,
        )
      : undefined;
  const sourceFileId = sourceFile?.id ?? selectedFileId;
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
    context: "created" | "updated";
    fileName: string;
    type: string;
    format: "png" | "svg" | "pdf";
    dataUrl?: string;
    generatedContent?: string;
    qrDataUrl?: string;
    svg?: string;
  }>();
  const [overwritePromptOpen, setOverwritePromptOpen] = useState(false);
  const [copyNamePromptOpen, setCopyNamePromptOpen] = useState(false);
  const [copyName, setCopyName] = useState("");
  const [copyNameError, setCopyNameError] = useState("");
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
  const isEditingExistingQr = Boolean(selectedQr || savedQrId);
  const generateVersionName = (name: string) => {
    const base =
      name.trim().replace(/\s+-\s+Version\s+\d+$/i, "") || "QR Code";
    const existingNames = new Set(
      [
        ...workspace.qrCodes.map((item) => item.name),
        ...workspace.workshopItems.map((item) => item.title),
      ].map((value) => value.trim().toLowerCase()),
    );
    let version = 2;
    let candidate = `${base} - Version ${version}`;
    while (existingNames.has(candidate.toLowerCase())) {
      version += 1;
      candidate = `${base} - Version ${version}`;
    }
    return candidate;
  };

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

  const validateBeforeSave = (status: "Draft" | "Ready", name = qrName) => {
    if (!name.trim()) {
      setActionMessage("Name this QR code so you can find it later.");
      return false;
    }
    if (!qrType) {
      setActionMessage("Choose what this QR code is for.");
      return false;
    }
    const payloadResult = buildQrPayload({ qrType, destination, contact });
    if (status === "Ready" && (!payloadResult.valid || !payloadResult.payload)) {
      setActionMessage(
        payloadResult.message ??
          "Add a destination link so the QR code knows where to send people.",
      );
      return false;
    }
    return true;
  };

  const applySave = async (
    status: "Draft" | "Ready",
    options: {
      forceNew?: boolean;
      overrideName?: string;
      editedExisting?: boolean;
      sourceFileId?: string;
      saveAsNewCopy?: boolean;
    } = {},
  ) => {
    const effectiveName = options.overrideName ?? qrName;
    if (!validateBeforeSave(status, effectiveName)) return;
    const payloadResult = buildQrPayload({ qrType, destination, contact });
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
      id: options.forceNew ? undefined : savedQrId || selectedQr?.id,
      workshopItemId: options.forceNew
        ? undefined
        : savedItemId || selectedWorkshopItem?.id,
      forceNew: options.forceNew,
      name: effectiveName.trim() || "Untitled QR Draft",
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
      fileAssetIds: options.forceNew ? [] : selectedQr?.fileAssetIds ?? [],
      createdFrom: guided ? "Guided Wizard" : "Manual Builder",
      builderData: buildBuilderData(),
      previewData: {
        qrName: effectiveName,
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
      if (options.sourceFileId && options.saveAsNewCopy) {
        await createQrFileVaultCopy(saved.qrCodeId, "png", {
          fileNameOverride: `${sanitizeQrFileName(effectiveName)}.png`,
        });
        setPendingVaultCopy(undefined);
        setActionMessage(`New QR copy saved as ${effectiveName}.`);
        return;
      }
      if (options.sourceFileId) {
        await createQrFileVaultCopy(saved.qrCodeId, "png", {
          sourceFileId: options.sourceFileId,
          replaceExisting: true,
          fileNameOverride: `${sanitizeQrFileName(effectiveName)}.png`,
        });
        setPendingVaultCopy(undefined);
        setActionMessage("Saved QR and File Vault copy updated.");
        return;
      }
      setPendingVaultCopy({
        context: options.editedExisting ? "updated" : "created",
        fileName: `${sanitizeQrFileName(effectiveName)}.png`,
        type: "image/png",
        format: "png",
        dataUrl,
        qrDataUrl: dataUrl,
        svg,
      });
      setActionMessage(
        options.saveAsNewCopy
          ? `New QR copy saved as ${effectiveName}.`
          : options.editedExisting
            ? "QR changes saved."
            : "QR code generated and saved to My Creations.",
      );
    } else
      setActionMessage(
        "Draft saved. You can finish the destination and name later.",
      );
  };

  const requestSave = async (status: "Draft" | "Ready") => {
    if (!validateBeforeSave(status)) return;
    if (status === "Ready" && isEditingExistingQr) {
      setOverwritePromptOpen(true);
      return;
    }
    await applySave(status);
  };

  const openSaveAsNewCopyPrompt = () => {
    setCopyName(generateVersionName(qrName || selectedQr?.name || "QR Code"));
    setCopyNameError("");
    setOverwritePromptOpen(false);
    setCopyNamePromptOpen(true);
  };

  const saveAsNewCopy = async () => {
    const normalized = copyName.trim().toLowerCase();
    const exists = [
      ...workspace.qrCodes.map((item) => item.name),
      ...workspace.workshopItems.map((item) => item.title),
    ].some((name) => name.trim().toLowerCase() === normalized);
    if (!copyName.trim() || exists) {
      setCopyNameError(
        "That name already exists. Use a different name or save changes to the existing item.",
      );
      return;
    }
    setCopyNamePromptOpen(false);
    await applySave("Ready", {
      forceNew: true,
      overrideName: copyName,
      saveAsNewCopy: true,
      sourceFileId,
    });
  };

  const savePendingCopyToFileVault = () => {
    if (!pendingVaultCopy) return;
    const context = pendingVaultCopy.context;
    const qrCodeId = savedQrId || selectedQr?.id;
    if (!qrCodeId) return;
    void createQrFileVaultCopy(qrCodeId, pendingVaultCopy.format).then(
      (result) => {
        setPendingVaultCopy(undefined);
        setActionMessage(
          context === "updated" ? "File Vault copy updated." : result.message,
        );
      },
    );
  };

  const dismissPendingVaultCopy = () => {
    if (!pendingVaultCopy) return;
    const context = pendingVaultCopy.context;
    setPendingVaultCopy(undefined);
    setActionMessage(
      context === "created"
        ? "No File Vault copy was saved. Your QR is still saved in My Creations."
        : "No File Vault copy was saved. Your QR changes are still saved in My Creations.",
    );
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
          onClick={() => void requestSave("Ready")}
        >
          {isEditingExistingQr ? "Save Changes" : "Create QR Code"}
        </Button>
        {isEditingExistingQr ? (
          <>
            <Button
              variant="neutral"
              icon={<Save size={18} />}
              onClick={openSaveAsNewCopyPrompt}
            >
              Save as New Copy
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentScreen("qr-detail")}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="neutral"
            icon={<Save size={18} />}
            onClick={() => void requestSave("Draft")}
          >
            Save Draft
          </Button>
        )}
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
            {created && savedQrId && (
              <div style={{ marginTop: "0.75rem" }}>
                <Button
                  variant="outline"
                  icon={<ExternalLink size={18} />}
                  onClick={() => setCurrentScreen("qr-detail")}
                >
                  View QR
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {pendingVaultCopy && (
        <Modal
          title={
            pendingVaultCopy.context === "created"
              ? "Save a copy to File Vault?"
              : "Save updated copy to File Vault?"
          }
          onClose={dismissPendingVaultCopy}
        >
          <div className="stack">
          <div>
            <p className="section-copy">
              {pendingVaultCopy.context === "created"
                ? "My Creations keeps the editable QR. File Vault keeps chosen files and exports."
                : "My Creations keeps the editable QR. File Vault keeps the chosen export copy."}
            </p>
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={savePendingCopyToFileVault}
            >
              {pendingVaultCopy.context === "created"
                ? "Yes, save copy"
                : "Save updated copy"}
            </Button>
            <Button
              variant="outline"
              onClick={dismissPendingVaultCopy}
            >
              No, not now
            </Button>
          </div>
          </div>
        </Modal>
      )}

      {overwritePromptOpen && (
        <Modal
          title={
            sourceFileId ? "Overwrite saved File Vault copy?" : "Save changes to this QR?"
          }
          onClose={() => setOverwritePromptOpen(false)}
        >
          <div className="stack">
            <p>
              {sourceFileId
                ? "This will update the saved QR and replace the existing File Vault copy."
                : "This will update the existing saved QR. The previous version may be replaced."}
            </p>
            <div className="modal-actions">
              <Button
                variant="primary"
                onClick={() => {
                  setOverwritePromptOpen(false);
                  void applySave("Ready", {
                    editedExisting: true,
                    sourceFileId,
                  });
                }}
              >
                {sourceFileId ? "Yes, overwrite saved file" : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOverwritePromptOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="neutral" onClick={openSaveAsNewCopyPrompt}>
                Save as New Copy
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {copyNamePromptOpen && (
        <Modal
          title="Name this new copy"
          onClose={() => setCopyNamePromptOpen(false)}
        >
          <div className="stack">
            <p>The original will stay unchanged.</p>
            <div className="field">
              <label>Original name</label>
              <input
                className="input"
                value={selectedQr?.name ?? qrName}
                readOnly
              />
            </div>
            <div className="field">
              <label htmlFor="qr-copy-name">New name</label>
              <input
                id="qr-copy-name"
                className="input"
                value={copyName}
                onChange={(event) => {
                  setCopyName(event.target.value);
                  setCopyNameError("");
                }}
              />
              {copyNameError && (
                <small className="field-help" role="alert">
                  {copyNameError}
                </small>
              )}
            </div>
            <div className="modal-actions">
              <Button variant="primary" onClick={() => void saveAsNewCopy()}>
                Save New Copy
              </Button>
              <Button
                variant="outline"
                onClick={() => setCopyNamePromptOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
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
