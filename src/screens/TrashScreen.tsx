import { File, FolderOpen, QrCode, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState, type TrashItemKind } from "../state/AppState";

const trashFilters = [
  "All",
  "QR Codes",
  "Creations",
  "File Vault Files",
] as const;

type TrashFilter = (typeof trashFilters)[number];

interface TrashCard {
  id: string;
  kind: TrashItemKind;
  title: string;
  typeLabel: string;
  source: string;
  deletedAt?: string;
  linkedInfo: string;
}

function formatDeletedDate(value?: string) {
  return value ? new Date(value).toLocaleString() : "No deleted date saved";
}

export function TrashScreen() {
  const {
    workspace,
    currentBusiness,
    setCurrentScreen,
    restoreTrashItem,
    permanentlyDeleteTrashItem,
  } = useAppState();
  const [filter, setFilter] = useState<TrashFilter>("All");
  const [pendingPermanentDelete, setPendingPermanentDelete] =
    useState<TrashCard>();

  const trashItems = useMemo<TrashCard[]>(() => {
    const qrCards: TrashCard[] = workspace.qrCodes
      .filter((qr) => qr.trashed)
      .map((qr) => {
        const linkedCreation = qr.workshopItemId
          ? workspace.workshopItems.find((item) => item.id === qr.workshopItemId)
          : undefined;
        const linkedFileCount = workspace.files.filter(
          (file) => file.qrCodeId === qr.id && file.trashed,
        ).length;
        return {
          id: qr.id,
          kind: "qr",
          title: qr.name,
          typeLabel: "QR Code",
          source: qr.trashedFrom ?? "QR Detail",
          deletedAt: qr.trashedAt,
          linkedInfo: [
            linkedCreation ? `Creation: ${linkedCreation.title}` : "",
            linkedFileCount ? `${linkedFileCount} trashed File Vault file(s)` : "",
          ]
            .filter(Boolean)
            .join(" · ") || "No linked deleted records",
        };
      });

    const creationCards: TrashCard[] = workspace.workshopItems
      .filter((item) => item.trashed)
      .map((item) => ({
        id: item.id,
        kind: "workshop",
        title: item.title,
        typeLabel: "Creation",
        source: item.trashedFrom ?? "My Creations",
        deletedAt: item.trashedAt,
        linkedInfo: [
          item.qrCodeIds.length ? `${item.qrCodeIds.length} linked QR code(s)` : "",
          item.fileAssetIds.length
            ? `${item.fileAssetIds.length} linked File Vault file(s)`
            : "",
        ]
          .filter(Boolean)
          .join(" · ") || item.itemType.replaceAll("_", " "),
      }));

    const fileCards: TrashCard[] = workspace.files
      .filter((file) => file.trashed)
      .map((file) => {
        const linkedQr = file.qrCodeId
          ? workspace.qrCodes.find((qr) => qr.id === file.qrCodeId)
          : undefined;
        const linkedCreation = file.workshopItemId
          ? workspace.workshopItems.find((item) => item.id === file.workshopItemId)
          : undefined;
        return {
          id: file.id,
          kind: "file",
          title: file.name,
          typeLabel: "File Vault File",
          source: file.trashedFrom ?? "File Vault",
          deletedAt: file.trashedAt,
          linkedInfo: [
            linkedQr ? `QR: ${linkedQr.name}` : "",
            linkedCreation ? `Creation: ${linkedCreation.title}` : "",
            file.source ? `Source: ${file.source}` : "",
          ]
            .filter(Boolean)
            .join(" · ") || file.type,
        };
      });

    return [...qrCards, ...creationCards, ...fileCards].sort((a, b) =>
      (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""),
    );
  }, [workspace]);

  const filteredItems = trashItems.filter((item) => {
    if (filter === "QR Codes") return item.kind === "qr";
    if (filter === "Creations") return item.kind === "workshop";
    if (filter === "File Vault Files") return item.kind === "file";
    return true;
  });

  return (
    <section className="screen screen--detail">
      <DetailHeader title="Trash" backTo="create" />
      <div className="section">
        <h1 className="page-title">Trash</h1>
        <p className="page-subtitle">
          Restore deleted items or permanently delete them.
        </p>
        <p className="section-copy">
          Showing deleted items for {currentBusiness.shortName}. Permanent
          delete is only available here and requires confirmation.
        </p>
      </div>

      <div className="library-filters section" aria-label="Trash filters">
        {trashFilters.map((value) => (
          <button
            key={value}
            className={
              filter === value
                ? "filter-chip filter-chip--active"
                : "filter-chip"
            }
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="library-empty section">
          <FolderOpen size={42} />
          <h2>Trash is empty</h2>
          <p>Deleted QR codes, creations, and File Vault files will appear here.</p>
          <Button variant="primary" onClick={() => setCurrentScreen("create")}>
            Back to Create
          </Button>
        </div>
      ) : (
        <div className="creation-card-grid section">
          {filteredItems.map((item) => (
            <article className="creation-card" key={`${item.kind}-${item.id}`}>
              <div className="creation-card__preview">
                {item.kind === "qr" ? (
                  <QrCode size={28} />
                ) : item.kind === "file" ? (
                  <File size={28} />
                ) : (
                  <FolderOpen size={28} />
                )}
                <StatusBadge tone="warning">{item.typeLabel}</StatusBadge>
              </div>
              <div className="creation-card__body">
                <h2>{item.title}</h2>
                <p>{item.linkedInfo}</p>
                <div className="creation-meta">
                  <span>Deleted {formatDeletedDate(item.deletedAt)}</span>
                  <span>Source: {item.source}</span>
                </div>
                <div className="creation-quick-actions">
                  <button onClick={() => restoreTrashItem(item.kind, item.id)}>
                    <RotateCcw size={16} />
                    Restore
                  </button>
                  <button onClick={() => setPendingPermanentDelete(item)}>
                    <Trash2 size={16} />
                    Permanently Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pendingPermanentDelete && (
        <Modal
          title="Permanently delete this?"
          onClose={() => setPendingPermanentDelete(undefined)}
        >
          <div className="stack">
            <p className="section-copy">This cannot be undone.</p>
            <div className="modal-actions">
              <Button
                variant="danger"
                icon={<Trash2 size={18} />}
                onClick={() => {
                  permanentlyDeleteTrashItem(
                    pendingPermanentDelete.kind,
                    pendingPermanentDelete.id,
                  );
                  setPendingPermanentDelete(undefined);
                }}
              >
                Permanently Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setPendingPermanentDelete(undefined)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
