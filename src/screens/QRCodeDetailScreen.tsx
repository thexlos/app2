import {
  Archive,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileImage,
  QrCode,
  Send,
  Vault,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";

type QrDownloadFormat = "png" | "svg" | "pdf";

function formatQrPayload(value?: string) {
  if (!value) return "No destination payload saved yet.";
  if (value.startsWith("BEGIN:VCARD")) return value.split("\n").join(" · ");
  return value;
}

export function QRCodeDetailScreen() {
  const {
    workspace,
    selectedQrId,
    selectedWorkshopItemId,
    openQrEditor,
    downloadQrToDevice,
    createQrFileVaultCopy,
    setCurrentScreen,
    archiveWorkshopItem,
    showNotice,
  } = useAppState();
  const [actionMessage, setActionMessage] = useState("");
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [pendingVaultCopy, setPendingVaultCopy] = useState<{
    format: QrDownloadFormat;
  }>();

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

  const copyPayload = async () => {
    if (!destination) {
      setActionMessage("This QR does not have a destination to copy yet.");
      return;
    }
    await navigator.clipboard?.writeText(destination);
    setActionMessage(isContactCard ? "vCard copied." : "Link copied.");
  };

  const downloadQr = async (format: QrDownloadFormat) => {
    const result = await downloadQrToDevice(qr.id, format);
    setActionMessage(result.message);
    if (result.fileName) setPendingVaultCopy({ format });
  };

  const saveCopy = async (format: QrDownloadFormat = "png") => {
    const result = await createQrFileVaultCopy(qr.id, format);
    setPendingVaultCopy(undefined);
    setActionMessage(result.message);
  };

  const shareQr = async () => {
    const url = !isContactCard ? qr.url ?? qr.payload : undefined;
    if (url && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: qr.name,
          text: qr.label ?? `QR code for ${qr.type}`,
          url,
        });
        setActionMessage("Share sheet opened. Nothing was sent by the app.");
        return;
      } catch {
        setActionMessage("Share was canceled. Nothing was sent.");
        return;
      }
    }
    setShareOptionsVisible(true);
    setActionMessage(
      "Share options are shown below. Nothing was sent automatically.",
    );
  };

  return (
    <section className="screen screen--detail qr-builder-screen">
      <DetailHeader title="QR Detail" backTo="workshop-library" />
      <div className="section qr-builder-intro">
        <div className="icon-box">
          <QrCode size={23} />
        </div>
        <div>
          <h1 className="page-title">{qr.name}</h1>
          <p className="page-subtitle">
            Saved QR codes open in view mode first. Use Edit only when you want
            to change the QR.
          </p>
        </div>
      </div>

      <div className="qr-builder-layout section">
        <aside className="qr-preview-card" aria-label="Saved QR preview">
          <div className="qr-preview-top">
            <span>QR Viewer</span>
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
          {!hasDownloadablePayload && (
            <div className="qr-status qr-status--warning">
              <QrCode size={19} />
              <span>This QR is missing a payload or destination.</span>
            </div>
          )}
        </aside>

        <div className="stack qr-builder-form">
          <section className="card panel stack">
            <div className="between">
              <div>
                <h2 className="section-heading">Saved QR details</h2>
                <p className="section-copy">
                  View, download, share, or copy this QR without opening the
                  editor.
                </p>
              </div>
              <StatusBadge tone="info">{qr.payloadType ?? "url"}</StatusBadge>
            </div>
            <dl className="help-detail-list">
              <div>
                <dt>QR type</dt>
                <dd>{qr.type}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{qr.status ?? "Ready"}</dd>
              </div>
              <div>
                <dt>Destination</dt>
                <dd>{formatQrPayload(destination)}</dd>
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
                <dt>Updated</dt>
                <dd>
                  {qr.updatedAt
                    ? new Date(qr.updatedAt).toLocaleString()
                    : "No date saved"}
                </dd>
              </div>
              <div>
                <dt>Linked File Vault copies</dt>
                <dd>{linkedFiles.length}</dd>
              </div>
            </dl>
          </section>

          <section className="card panel stack">
            <h2 className="section-heading">Primary actions</h2>
            <div className="row wrap">
              <Button
                variant="primary"
                icon={<Download size={18} />}
                disabled={!hasDownloadablePayload}
                onClick={() => void downloadQr("png")}
              >
                Download to Device
              </Button>
              <Button
                variant="outline"
                icon={<Send size={18} />}
                onClick={() => void shareQr()}
              >
                Share / Send
              </Button>
              <Button
                variant="neutral"
                icon={<Edit3 size={18} />}
                onClick={() => openQrEditor(qr.id, qr.workshopItemId)}
              >
                Edit
              </Button>
            </div>
          </section>

          <section className="card panel stack">
            <h2 className="section-heading">More actions</h2>
            <div className="row wrap">
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
                icon={<Vault size={18} />}
                disabled={!hasDownloadablePayload}
                onClick={() => void saveCopy("png")}
              >
                Save Copy to File Vault
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
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert--info section" aria-live="polite">
          <strong>{actionMessage}</strong>
        </div>
      )}

      {pendingVaultCopy && (
        <section className="card panel section stack" aria-live="polite">
          <div>
            <h2 className="section-heading">
              Save this downloaded file to File Vault?
            </h2>
            <p className="section-copy">
              File Vault keeps a copy or reference inside this app.
            </p>
          </div>
          <div className="row wrap">
            <Button
              variant="primary"
              onClick={() => void saveCopy(pendingVaultCopy.format)}
            >
              Save Copy to File Vault
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPendingVaultCopy(undefined);
                setActionMessage("No File Vault copy was saved.");
              }}
            >
              No thanks
            </Button>
          </div>
        </section>
      )}

      {shareOptionsVisible && (
        <section className="card panel section stack" aria-live="polite">
          <div>
            <h2 className="section-heading">Share options</h2>
            <p className="section-copy">
              These actions prepare the next step. They do not send SMS, email,
              or social posts without a connected service.
            </p>
          </div>
          <div className="row wrap">
            <Button
              variant="outline"
              icon={<Copy size={18} />}
              onClick={() => void copyPayload()}
            >
              {isContactCard ? "Copy vCard" : "Copy Link"}
            </Button>
            <Button
              variant="outline"
              icon={<Send size={18} />}
              onClick={() => {
                showNotice(
                  "Send to Customers is prepared in mock mode. No SMS or email was sent.",
                );
                setCurrentScreen("customers");
              }}
            >
              Send to Customers
            </Button>
          </div>
        </section>
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
    </section>
  );
}
