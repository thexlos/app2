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
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { getBuilderContract } from "../config/builderContracts";
import { businessSavedLinks } from "../data/mock/businessLinks";
import { useAppState } from "../state/AppState";

const qrTypes = [
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
type QRType = (typeof qrTypes)[number] | "";

const savedLinkKeys: Partial<
  Record<Exclude<QRType, "">, keyof (typeof businessSavedLinks)[string]>
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
  { label: "Download PDF Sign", icon: FileText },
  { label: "Add to Flyer", icon: Plus },
  { label: "Add to Business Card", icon: WalletCards },
  { label: "Add to Lead Form", icon: Plus },
  { label: "Add to Estimate/Invoice", icon: FileText },
  { label: "Send to Customers", icon: Send },
  { label: "Request Start Here Help", icon: CircleHelp },
];

function isValidWebLink(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function QRCodeBuilderScreen() {
  const {
    currentBusiness,
    currentBusinessId,
    workspace,
    createQrCode,
    openCreateTask,
    openHelpRequest,
    setCurrentScreen,
    exportWorkshopItem,
    recordWorkshopAction,
    guidedDraft,
    clearGuidedDraft,
  } = useAppState();
  const contract = getBuilderContract("Create QR Code")!;
  const savedLinks = businessSavedLinks[currentBusinessId];
  const guided =
    guidedDraft?.builderId === "qr-code-builder"
      ? guidedDraft.answers
      : undefined;
  const [qrType, setQrType] = useState<QRType>(
    (guided?.qrType as QRType) ?? "",
  );
  const [destination, setDestination] = useState(
    String(guided?.destination ?? ""),
  );
  const [leadFormId, setLeadFormId] = useState("");
  const [qrName, setQrName] = useState(String(guided?.qrName ?? ""));
  const [shortLabel, setShortLabel] = useState(
    String(guided?.shortLabel ?? ""),
  );
  const [contact, setContact] = useState({
    name: "",
    businessName: currentBusiness.name,
    phone: currentBusiness.phone,
    email: currentBusiness.email,
    website: savedLinks.website,
    address: "",
  });
  const [tested, setTested] = useState<"idle" | "valid" | "invalid">("idle");
  const [created, setCreated] = useState(false);
  const [savedItemId, setSavedItemId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [advanced, setAdvanced] = useState({
    qrColor: "#101c3b",
    backgroundColor: "#ffffff",
    addLogo: false,
    saveToVault: true,
    exportSize: "1024 × 1024 PNG",
  });

  const isContact = qrType === "Contact Card";
  const hasContactIdentity = Boolean(
    contact.name.trim() || contact.businessName.trim(),
  );
  const hasContactMethod = Boolean(
    contact.phone.trim() || contact.email.trim() || contact.website.trim(),
  );
  const canCreate = Boolean(
    qrType &&
    qrName.trim() &&
    (isContact ? hasContactIdentity && hasContactMethod : destination.trim()),
  );
  const savedLinkKey = qrType ? savedLinkKeys[qrType] : undefined;
  const encodedContact = useMemo(
    () =>
      `Contact card: ${[contact.name, contact.businessName, contact.phone, contact.email, contact.website, contact.address].filter(Boolean).join(" • ")}`,
    [contact],
  );
  const previewDestination = isContact ? encodedContact : destination;

  const validationStatus = created
    ? "Created and saved"
    : !qrType
      ? "Choose a QR code type"
      : !qrName.trim()
        ? contract.validationMessages.qrName
        : isContact && !hasContactMethod
          ? contract.validationMessages.contact
          : !isContact && !destination.trim()
            ? contract.validationMessages.destination
            : tested === "invalid"
              ? "Check the destination link format"
              : tested === "valid"
                ? "Link looks good"
                : "Ready to create";
  const statusTone =
    created || tested === "valid" ? "success" : canCreate ? "info" : "warning";

  const chooseType = (value: QRType) => {
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
    const valid = !isContact && isValidWebLink(destination);
    setTested(valid ? "valid" : "invalid");
    setActionMessage(
      valid
        ? "The destination link is formatted correctly."
        : "Use a complete link starting with http:// or https://.",
    );
  };

  const save = (status: "Draft" | "Created") => {
    if (status === "Created" && !canCreate) return;
    const workshopItemId = createQrCode({
      name: qrName.trim() || "Untitled QR Draft",
      type: qrType || "Not selected",
      url: previewDestination,
      label: shortLabel.trim() || undefined,
      status,
      createdFrom: guided ? "Guided Wizard" : "Manual Builder",
    });
    if (guided) clearGuidedDraft();
    setSavedItemId(workshopItemId);
    if (status === "Created") {
      setCreated(true);
      setActionMessage(
        "Your QR code was created and saved to this business profile.",
      );
    } else
      setActionMessage(
        "Draft saved. You can finish the destination and name later.",
      );
  };

  const runNextAction = (label: string) => {
    if (label === "Open in My Creations") {
      setCurrentScreen("workshop-library");
      return;
    }
    if (label === "Request Start Here Help") {
      openHelpRequest(contract.helpHandoffType);
      return;
    }
    if (/Download/.test(label) && savedItemId) {
      exportWorkshopItem(savedItemId, label);
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
                    value={contact.name}
                    onChange={(event) =>
                      setContact({ ...contact, name: event.target.value })
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
            <QrCode size={132} strokeWidth={1.7} />
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
          onClick={() => save("Created")}
        >
          Create QR Code
        </Button>
        <Button
          variant="neutral"
          icon={<Save size={18} />}
          onClick={() => save("Draft")}
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
                onClick={() => runNextAction(label)}
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
