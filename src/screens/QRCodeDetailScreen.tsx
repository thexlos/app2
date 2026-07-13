import {
  Archive,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileImage,
  Mail,
  MessageSquareText,
  QrCode,
  Send,
  UserRound,
  Vault,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";

type QrDownloadFormat = "png" | "svg" | "pdf";

function formatQrPayload(value?: string) {
  if (!value) return "No destination payload saved yet.";
  if (value.startsWith("BEGIN:VCARD")) return value.split("\n").join(" · ");
  return value;
}

function buildShareMessage(name: string, destination?: string) {
  return destination
    ? `${name}: ${destination}`
    : `${name}: QR code is ready to share from Start Here Helper.`;
}

export function QRCodeDetailScreen() {
  const {
    workspace,
    selectedQrId,
    selectedWorkshopItemId,
    selectedFileId,
    openQrEditor,
    downloadQrToDevice,
    createQrFileVaultCopy,
    openCreateTask,
    setCurrentScreen,
    archiveWorkshopItem,
    showNotice,
  } = useAppState();
  const [actionMessage, setActionMessage] = useState("");
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customRecipient, setCustomRecipient] = useState("");

  const selectedWorkshopItem = selectedWorkshopItemId
    ? workspace.workshopItems.find((item) => item.id === selectedWorkshopItemId)
    : undefined;
  const qr =
    (selectedQrId
      ? workspace.qrCodes.find((item) => item.id === selectedQrId)
      : undefined) ??
    (selectedWorkshopItem?.qrCodeIds[0]
      ? workspace.qrCodes.find((item) => item.id === selectedWorkshopItem.qrCodeIds[0])
      : undefined);
  const linkedFiles = useMemo(
    () =>
      qr
        ? workspace.files.filter(
            (file) => !file.archived && file.qrCodeId === qr.id,
          )
        : [],
    [qr, workspace.files],
  );

  if (!qr) {
    return (
      <section className="screen screen--detail">
        <DetailHeader title="QR Detail" backTo="workshop-library" />
        <div className="library-empty section">
          <QrCode size={42} />
          <h1>QR code not found</h1>
          <p>This saved QR may have been archived or reset from demo data.</p>
          <Button
            variant="primary"
            onClick={() => setCurrentScreen("workshop-library")}
          >
            Back to My Creations
          </Button>
        </div>
      </section>
    );
  }

  const destination = qr.payload ?? qr.url;
  const isContactCard = qr.payloadType === "vcard";
  const canTestLink = !isContactCard && Boolean(qr.url ?? qr.payload);
  const hasDownloadablePayload = Boolean(destination);
  const sourceFile = selectedFileId
    ? workspace.files.find(
        (file) => file.id === selectedFileId && file.qrCodeId === qr.id,
      )
    : undefined;
  const shareMessage = buildShareMessage(qr.name, destination);

  const copyPayload = async () => {
    if (!destination) {
      setActionMessage("This QR does not have a destination to copy yet.");
      return;
    }
    await navigator.clipboard?.writeText(destination);
    setActionMessage(isContactCard ? "vCard copied." : "Link copied.");
  };

  const copyShareMessage = async () => {
    await navigator.clipboard?.writeText(shareMessage);
    setActionMessage("Message copied. Nothing was sent by the app.");
  };

  const downloadQr = async (format: QrDownloadFormat) => {
    const result = await downloadQrToDevice(qr.id, format);
    setActionMessage(result.message);
  };

  const saveCopy = async (format: QrDownloadFormat = "png") => {
    const result = await createQrFileVaultCopy(qr.id, format);
    setActionMessage(result.message);
  };

  const openTextFromDevice = async () => {
    if (!hasDownloadablePayload) {
      setActionMessage("This QR needs a destination before it can be shared.");
      return;
    }
    if (typeof navigator.share === "function" && !isContactCard) {
      try {
        await navigator.share({
          title: qr.name,
          text: shareMessage,
          url: qr.url ?? qr.payload,
        });
        setActionMessage("Device share sheet opened. Nothing was sent by the app.");
        return;
      } catch {
        setActionMessage("Share was canceled. Nothing was sent.");
        return;
      }
    }
    const result = await downloadQrToDevice(qr.id, "png");
    setActionMessage(
      `${result.message} Attach it from your device’s photo/files app to a text message.`,
    );
  };

  const openEmailFromDevice = () => {
    const subject = encodeURIComponent(qr.name);
    const body = encodeURIComponent(
      `${shareMessage}\n\nAttachments through email links are not reliable. Download the QR image and attach it manually if needed.`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setActionMessage("Email app opened with a prepared message. No email was sent by Start Here Helper.");
  };

  const prepareCustomerSend = () => {
    if (!selectedCustomerId) {
      setActionMessage("Choose a saved customer first.");
      return;
    }
    setActionMessage(
      "Customer send is prepared in mock mode. No SMS or email was sent.",
    );
  };

  const prepareCustomRecipient = async () => {
    if (!customRecipient.trim()) {
      setActionMessage("Enter an email or phone number first.");
      return;
    }
    await navigator.clipboard?.writeText(shareMessage);
    setActionMessage(
      "Custom recipient message copied. No SMS or email was sent.",
    );
  };

  return (
    <section className="screen screen--detail qr-detail-screen">
      <DetailHeader title="QR Detail" backTo="workshop-library" />
      <div className="section qr-detail-heading">
        <div className="icon-box">
          <QrCode size={23} />
        </div>
        <div>
          <p className="eyebrow">Saved QR code</p>
          <h1 className="page-title">{qr.name}</h1>
          <p className="page-subtitle">
            View, download, share, or copy this QR. Use Edit only when you want
            to change the saved QR.
          </p>
        </div>
      </div>

      <div className="section qr-detail-layout">
        <article className="qr-detail-preview-card" aria-label="Saved QR preview">
          <div className="qr-preview-top">
            <span>QR Code</span>
            <StatusBadge tone={qr.status === "Draft" ? "warning" : "success"}>
              {qr.status ?? "Ready"}
            </StatusBadge>
          </div>
          <div className="qr-placeholder">
            {qr.svg ? (
              <span
                className="qr-generated-preview"
                dangerouslySetInnerHTML={{ __html: qr.svg }}
              />
            ) : qr.dataUrl ? (
              <img alt={qr.name} src={qr.dataUrl} />
            ) : (
              <QrCode size={132} strokeWidth={1.7} />
            )}
          </div>
          <div className="qr-preview-copy">
            <h2>{qr.name}</h2>
            <strong>{qr.type}</strong>
            <p>{formatQrPayload(destination)}</p>
            {qr.label && <div className="qr-short-label">{qr.label}</div>}
          </div>
        </article>

        <div className="qr-detail-side stack">
          <section className="card panel stack">
            <h2 className="section-heading">Primary actions</h2>
            <div className="qr-detail-primary-actions">
              <Button
                variant="primary"
                icon={<Download size={18} />}
                disabled={!hasDownloadablePayload}
                onClick={() => void downloadQr("png")}
              >
                Download
              </Button>
              <Button
                variant="outline"
                icon={<Send size={18} />}
                onClick={() => setShareSheetOpen(true)}
              >
                Share / Send
              </Button>
              <Button
                variant="neutral"
                icon={<Edit3 size={18} />}
                onClick={() =>
                  openQrEditor(qr.id, qr.workshopItemId, sourceFile?.id)
                }
              >
                Edit
              </Button>
            </div>
          </section>

          <section className="card panel stack">
            <h2 className="section-heading">Info</h2>
            <dl className="qr-detail-info-list">
              <div>
                <dt>Status</dt>
                <dd>{qr.status ?? "Ready"}</dd>
              </div>
              <div>
                <dt>Vault Copy</dt>
                <dd>{linkedFiles.length > 0 ? "Saved" : "Not saved"}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>
                  {qr.updatedAt
                    ? new Date(qr.updatedAt).toLocaleString()
                    : "No date saved"}
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>
                  {qr.createdAt
                    ? new Date(qr.createdAt).toLocaleString()
                    : "No date saved"}
                </dd>
              </div>
              <div>
                <dt>Linked File Vault copies</dt>
                <dd>{linkedFiles.length}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section className="card panel section stack">
        <h2 className="section-heading">More actions</h2>
        <div className="qr-detail-actions-grid">
          <Button
            variant="outline"
            icon={<Copy size={18} />}
            onClick={() => void copyPayload()}
          >
            {isContactCard ? "Copy vCard" : "Copy Link"}
          </Button>
          {canTestLink && (
            <Button
              variant="outline"
              icon={<ExternalLink size={18} />}
              onClick={() => {
                window.open(
                  qr.url ?? qr.payload,
                  "_blank",
                  "noopener,noreferrer",
                );
                setActionMessage("The destination link opened in a new tab.");
              }}
            >
              Test Link
            </Button>
          )}
          <Button
            variant="outline"
            icon={<Vault size={18} />}
            disabled={!hasDownloadablePayload}
            onClick={() => void saveCopy("png")}
          >
            Save Copy to File Vault
          </Button>
          <Button
            variant="outline"
            icon={<FileImage size={18} />}
            disabled={!hasDownloadablePayload}
            onClick={() => void downloadQr("svg")}
          >
            Download SVG
          </Button>
          <Button
            variant="outline"
            icon={<FileImage size={18} />}
            disabled={!hasDownloadablePayload}
            onClick={() => void downloadQr("pdf")}
          >
            Download PDF Sign
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentScreen("workshop-library")}
          >
            Open in My Creations
          </Button>
          {qr.workshopItemId && (
            <Button
              variant="ghost"
              icon={<Archive size={18} />}
              onClick={() => {
                archiveWorkshopItem(qr.workshopItemId!);
                setCurrentScreen("workshop-library");
              }}
            >
              Archive
            </Button>
          )}
        </div>
      </section>

      {actionMessage && (
        <div className="alert alert--info section" aria-live="polite">
          <strong>{actionMessage}</strong>
        </div>
      )}

      {linkedFiles.length > 0 && (
        <section className="card panel section stack">
          <h2 className="section-heading">Linked File Vault copies</h2>
          {linkedFiles.map((file) => (
            <div className="message-template-row" key={file.id}>
              <strong>{file.name}</strong>
              <p>{file.type}</p>
            </div>
          ))}
        </section>
      )}

      {shareSheetOpen && (
        <Modal title="Share or send this QR" onClose={() => setShareSheetOpen(false)}>
          <div className="stack">
            <p className="section-copy">
              Choose how you want to share this QR. Messages are sent from your
              device or prepared for you unless a real integration is connected.
            </p>
            <div className="qr-share-options-grid">
              <button type="button" onClick={() => void openTextFromDevice()}>
                <MessageSquareText size={19} />
                <span>
                  <strong>Text from my device</strong>
                  <small>
                    Text message, data, and carrier charges may apply. Messages
                    are sent from your device, not from Start Here Helper.
                  </small>
                </span>
              </button>
              <button type="button" onClick={openEmailFromDevice}>
                <Mail size={19} />
                <span>
                  <strong>Email from my device</strong>
                  <small>
                    Opens your email app with prepared text. Attachments may
                    need to be added manually.
                  </small>
                </span>
              </button>
              <button type="button" onClick={prepareCustomerSend}>
                <UserRound size={19} />
                <span>
                  <strong>Send to saved customer</strong>
                  <small>
                    Prepare customer workflow. No SMS or email is sent in this
                    prototype.
                  </small>
                </span>
              </button>
              <button type="button" onClick={() => void prepareCustomRecipient()}>
                <Send size={19} />
                <span>
                  <strong>Custom recipient</strong>
                  <small>Prepare and copy a message for any phone or email.</small>
                </span>
              </button>
              <button type="button" onClick={() => void copyPayload()}>
                <Copy size={19} />
                <span>
                  <strong>{isContactCard ? "Copy vCard" : "Copy link"}</strong>
                  <small>Copy the QR destination to your clipboard.</small>
                </span>
              </button>
              <button type="button" onClick={() => void downloadQr("png")}>
                <Download size={19} />
                <span>
                  <strong>Download QR image</strong>
                  <small>Download to device only. No File Vault copy is saved.</small>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShareSheetOpen(false);
                  openCreateTask("Send Promotion", {
                    qrCodeId: qr.id,
                    workshopItemId: qr.workshopItemId,
                  });
                }}
              >
                <QrCode size={19} />
                <span>
                  <strong>Create promo with this QR</strong>
                  <small>Open Create with this QR attached to the workflow.</small>
                </span>
              </button>
            </div>
            <div className="field">
              <label htmlFor="share-customer">Saved customer</label>
              <select
                id="share-customer"
                className="select"
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
              >
                <option value="">Choose a customer</option>
                {workspace.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="custom-recipient">Custom recipient</label>
              <input
                id="custom-recipient"
                className="input"
                value={customRecipient}
                onChange={(event) => setCustomRecipient(event.target.value)}
                placeholder="Phone or email"
              />
            </div>
            <div className="field">
              <label htmlFor="prepared-message">Prepared message</label>
              <textarea
                id="prepared-message"
                className="textarea"
                readOnly
                value={shareMessage}
              />
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
