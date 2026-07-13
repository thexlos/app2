import {
  Archive,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileImage,
  FolderOpen,
  Plus,
  QrCode,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  getBuilderDefinitionForItem,
  getWorkshopItemTitle,
} from "../lib/workshopPayloads";
import { useAppState } from "../state/AppState";
import type { WorkshopItem, WorkshopItemType } from "../types/models";

const filters = [
  "All",
  "Flyers",
  "QR Codes",
  "Posts",
  "Business Cards",
  "Promotions",
  "Lead Forms",
  "Review Tools",
  "Menus / Price Sheets",
  "Print Items",
  "Event Promos",
  "Templates",
  "Drafts",
  "Archived",
] as const;
const filterTypes: Partial<
  Record<(typeof filters)[number], WorkshopItemType[]>
> = {
  Flyers: ["flyer"],
  "QR Codes": ["qr_code"],
  Posts: ["social_post"],
  "Business Cards": ["business_card"],
  Promotions: ["promotion"],
  "Lead Forms": ["lead_form"],
  "Review Tools": ["review_booster"],
  "Menus / Price Sheets": ["menu_price_sheet"],
  "Print Items": ["yard_sign", "door_hanger", "vistaprint_print_setup"],
  "Event Promos": ["event_promo"],
  Templates: ["estimate_template", "invoice_template", "custom_template"],
};

const itemTask: Partial<Record<WorkshopItemType, string>> = {
  flyer: "Make a Flyer",
  qr_code: "Create QR Code",
  social_post: "Create Post",
  business_card: "Business Cards",
  promotion: "Send Promotion",
  lead_form: "Lead Forms",
  review_booster: "Review Booster",
  menu_price_sheet: "Menu / Price Sheet",
  yard_sign: "Yard Sign",
  door_hanger: "Door Hanger",
  event_promo: "Event Promo",
  canva_help_item: "Canva Help",
  vistaprint_print_setup: "VistaPrint / Print Setup Help",
};

function actionsFor(item: WorkshopItem) {
  if (item.archived) return ["Duplicate", "Use Again", "Delete"];
  if (item.itemType === "qr_code")
    return [
      "Open",
      "Download",
      "Share / Send",
      "Edit",
      "Save Copy",
      "Archive",
      "Delete",
    ];
  if (item.itemType === "flyer")
    return [
      "Open",
      "Edit",
      "Duplicate",
      "Check Design",
      "Download",
      "Send to Customers",
      "Post to Social",
      "Save as Template",
      "Request Help",
      "Archive",
      "Delete",
    ];
  if (item.itemType === "business_card")
    return [
      "Open",
      "Edit",
      "Duplicate",
      "Check Print",
      "Download PDF Print",
      "Save as Template",
      "Request VistaPrint Setup Help",
      "Archive",
      "Delete",
    ];
  return item.status === "Draft"
    ? ["Continue Editing", "Duplicate", "Archive", "Delete"]
    : [
        "Open",
        "Edit",
        "Duplicate",
        "Use Again",
        "Download",
        "Save as Template",
        "Request Help",
        "Archive",
        "Delete",
      ];
}

function ItemIcon({ type }: { type: WorkshopItemType }) {
  if (type === "qr_code") return <QrCode size={28} />;
  if (type === "flyer" || type === "business_card")
    return <FileImage size={28} />;
  return <Sparkles size={28} />;
}

export function WorkshopLibraryScreen() {
  const {
    workspace,
    setCurrentScreen,
    openCreateTask,
    openHelpRequest,
    duplicateWorkshopItem,
    archiveWorkshopItem,
    moveQrToTrash,
    moveWorkshopItemToTrash,
    saveWorkshopItemAsTemplate,
    exportWorkshopItem,
    recordWorkshopAction,
    openQrDetail,
    openQrEditor,
    downloadQrToDevice,
    createQrFileVaultCopy,
    recoveryDrafts,
    currentBusinessId,
    continueRecoveryDraft,
    saveRecoveryDraftAsCreation,
    discardRecoveryDraft,
    selectedWorkshopItemId,
  } = useAppState();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recently updated");
  const [message, setMessage] = useState("");
  const [pendingExport, setPendingExport] = useState<{
    itemId: string;
    title: string;
    action: string;
  }>();
  const [pendingDeleteItem, setPendingDeleteItem] = useState<WorkshopItem>();
  const activeRecoveryDrafts = useMemo(
    () =>
      recoveryDrafts
        .filter((draft) => draft.businessProfileId === currentBusinessId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [currentBusinessId, recoveryDrafts],
  );
  useEffect(() => {
    if (!selectedWorkshopItemId) return;
    const selected = workspace.workshopItems.find(
      (item) => item.id === selectedWorkshopItemId,
    );
    if (selected) {
      setFilter("All");
      setMessage(`Opened “${selected.title}” from its related activity.`);
    }
  }, [selectedWorkshopItemId, workspace.workshopItems]);

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = workspace.workshopItems.filter((item) => {
      if (item.trashed) return false;
      if (filter === "Archived" ? !item.archived : item.archived) return false;
      if (filter === "Drafts" && item.status !== "Draft") return false;
      if (filterTypes[filter] && !filterTypes[filter]!.includes(item.itemType))
        return false;
      if (!normalized) return true;
      return [
        item.title,
        item.description,
        item.itemType,
        item.status,
        ...item.tags,
        ...Object.values(item.builderData ?? {}).flat().map(String),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
    return [...filtered].sort((a, b) =>
      sort === "A to Z"
        ? a.title.localeCompare(b.title)
        : sort === "Type"
          ? a.itemType.localeCompare(b.itemType)
          : sort === "Status"
            ? a.status.localeCompare(b.status)
            : sort === "Recently created"
              ? b.createdAt.localeCompare(a.createdAt)
              : b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [workspace.workshopItems, filter, query, sort]);

  const openItem = (item: WorkshopItem) => {
    if (item.itemType === "qr_code" && item.qrCodeIds[0]) {
      openQrDetail(item.qrCodeIds[0], item.id);
      return;
    }
    const definition = getBuilderDefinitionForItem(item);
    const task = definition?.createTask ?? itemTask[item.itemType];
    if (!task) {
      setMessage(
        "This creation cannot be restored yet because it does not have a builder assigned.",
      );
      return;
    }
    openCreateTask(task, {
      workshopItemId: item.id,
      qrCodeId: item.qrCodeIds[0],
    });
    setCurrentScreen("create-builder");
  };

  const runAction = (item: WorkshopItem, action: string) => {
    if (item.itemType === "qr_code") {
      const qrCodeId = item.qrCodeIds[0];
      if (!qrCodeId) {
        setMessage("This QR creation does not have a linked QR record yet.");
        return;
      }
      if (action === "Open") {
        openQrDetail(qrCodeId, item.id);
        return;
      }
      if (action === "Edit") {
        openQrEditor(qrCodeId, item.id);
        return;
      }
      if (action === "Download") {
        void downloadQrToDevice(qrCodeId, "png").then((result) => {
          setMessage(result.message);
        });
        return;
      }
      if (action === "Save Copy") {
        void createQrFileVaultCopy(qrCodeId, "png").then((result) =>
          setMessage(result.message),
        );
        return;
      }
      if (action === "Share / Send") {
        openQrDetail(qrCodeId, item.id);
        return;
      }
      if (action === "Delete") {
        setPendingDeleteItem(item);
        return;
      }
    }
    if (["Open", "Edit", "Continue Editing"].includes(action)) {
      openItem(item);
      return;
    }
    if (action === "Duplicate") {
      duplicateWorkshopItem(item.id);
      setMessage(`Duplicated “${item.title}” as a new draft.`);
      return;
    }
    if (action === "Use Again") {
      duplicateWorkshopItem(item.id, true);
      return;
    }
    if (action === "Archive") {
      archiveWorkshopItem(item.id);
      return;
    }
    if (action === "Delete") {
      setPendingDeleteItem(item);
      return;
    }
    if (action === "Save as Template") {
      saveWorkshopItemAsTemplate(item.id);
      return;
    }
    if (/Request/.test(action)) {
      openHelpRequest(item.title);
      return;
    }
    if (action === "Add to Flyer") {
      openCreateTask("Make a Flyer", { qrCodeId: item.qrCodeIds[0] });
      return;
    }
    if (action === "Add to Business Card") {
      openCreateTask("Business Cards", { qrCodeId: item.qrCodeIds[0] });
      return;
    }
    if (/Download/.test(action)) {
      setPendingExport({ itemId: item.id, title: item.title, action });
      setMessage(
        `${action} is prepared in mock mode. No File Vault copy was saved.`,
      );
      return;
    }
    if (action === "Post to Social") {
      recordWorkshopAction(item.id, action);
      setCurrentScreen("integrations");
      return;
    }
    recordWorkshopAction(item.id, action);
    setMessage(
      `${action} is prepared as the next mock workflow for “${item.title}.”`,
    );
  };

  return (
    <section className="screen screen--detail">
      <DetailHeader title="My Creations" backTo="create" />
      <div className="section">
        <h1 className="page-title">My Creations</h1>
        <p className="page-subtitle">
          Find, reuse, edit, send, post, or download anything you made.
        </p>
      </div>
      <div className="library-toolbar section">
        <div className="search-wrap">
          <Search size={20} />
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creations"
            aria-label="Search creations"
          />
        </div>
        <select
          className="select"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort creations"
        >
          <option>Recently updated</option>
          <option>Recently created</option>
          <option>Last used</option>
          <option>Type</option>
          <option>Status</option>
          <option>A to Z</option>
        </select>
        <Button
          variant="outline"
          icon={<Trash2 size={18} />}
          onClick={() => setCurrentScreen("trash")}
        >
          Trash
        </Button>
      </div>
      <div className="library-filters" aria-label="Creation filters">
        {filters.map((value) => (
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
      {message && (
        <div className="alert alert--info section">
          <ExternalLink size={19} />
          <strong>{message}</strong>
        </div>
      )}
      {pendingExport && (
        <section className="card panel section stack" aria-live="polite">
          <div>
            <h2 className="section-heading">Save this export to File Vault?</h2>
            <p className="section-copy">
              {"My Creations keeps “"}
              {pendingExport.title}
              {"” editable. File Vault only keeps a chosen file or export reference."}
            </p>
          </div>
          <div className="row wrap">
            <button
              className="btn btn--primary"
              onClick={() => {
                exportWorkshopItem(pendingExport.itemId, pendingExport.action);
                setPendingExport(undefined);
                setMessage("Saved a copy to File Vault.");
              }}
            >
              Save Copy to File Vault
            </button>
            <button
              className="btn btn--outline"
              onClick={() => {
                setPendingExport(undefined);
                setMessage("No File Vault copy was saved.");
              }}
            >
              No thanks
            </button>
          </div>
        </section>
      )}
      {activeRecoveryDrafts.length > 0 && (
        <section className="section">
          <div>
            <h2 className="section-heading">Recovered Drafts</h2>
            <p className="section-copy">
              These are auto-saved recovery drafts. They are not File Vault
              files and they are not official exports.
            </p>
          </div>
          <div className="creation-card-grid">
            {activeRecoveryDrafts.map((draft) => (
              <article className="creation-card" key={draft.id}>
                <div className="creation-card__preview">
                  <Sparkles size={28} />
                  <StatusBadge tone="warning">Recoverable Draft</StatusBadge>
                </div>
                <div className="creation-card__body">
                  <h2>
                    {getWorkshopItemTitle(
                      draft.builderId,
                      draft.builderData,
                      draft.sourceTool,
                    ) || `Untitled ${draft.sourceTool} Draft`}
                  </h2>
                  <p>{draft.sourceTool}</p>
                  <div className="creation-meta">
                    <span>
                      Last edited {new Date(draft.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="creation-quick-actions">
                    <button onClick={() => continueRecoveryDraft(draft.id)}>
                      <ExternalLink size={16} />
                      Continue
                    </button>
                    <button
                      onClick={() => {
                        saveRecoveryDraftAsCreation(draft.id);
                        setMessage("Draft saved to My Creations.");
                      }}
                    >
                      <Download size={16} />
                      Save as My Creation
                    </button>
                    <button onClick={() => discardRecoveryDraft(draft.id)}>
                      <Archive size={16} />
                      Discard
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {items.length === 0 ? (
        <div className="library-empty section">
          <FolderOpen size={42} />
          <h2>No creations yet</h2>
          <p>
            Anything you make in the Workshop will be saved here so you can
            reuse it later.
          </p>
          <div className="modal-actions">
            <button
              className="btn btn--primary"
              onClick={() => setCurrentScreen("create")}
            >
              Create Something
            </button>
            <button
              className="btn btn--outline"
              onClick={() => setCurrentScreen("business-kits")}
            >
              Apply Business Kit
            </button>
            <button
              className="btn"
              onClick={() => setCurrentScreen("file-vault")}
            >
              Upload File
            </button>
          </div>
        </div>
      ) : (
        <div className="creation-card-grid section">
          {items.map((item) => {
            const actions = actionsFor(item);
            return (
              <article
                className={`creation-card${selectedWorkshopItemId === item.id ? " creation-card--selected" : ""}`}
                key={item.id}
              >
                <div className="creation-card__preview">
                  <ItemIcon type={item.itemType} />
                  <StatusBadge
                    tone={
                      item.status === "Ready" || item.status === "Approved"
                        ? "success"
                        : item.status === "Needs Review"
                          ? "warning"
                          : item.status === "Archived"
                            ? "neutral"
                            : "info"
                    }
                  >
                    {item.status}
                  </StatusBadge>
                </div>
                <div className="creation-card__body">
                  <h2>{item.title}</h2>
                  <p>
                    {item.itemType.replaceAll("_", " ")} · {item.description}
                  </p>
                  <div className="creation-meta">
                    <span>
                      Created {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>Last used {item.lastUsedAt ?? "Not yet"}</span>
                  </div>
                  <div className="creation-tags">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="creation-quick-actions">
                    {actions.slice(0, 3).map((action) => (
                      <button
                        key={action}
                        onClick={() => runAction(item, action)}
                      >
                        {action === "Duplicate" ? (
                          <Copy size={16} />
                        ) : action.includes("Download") ? (
                          <Download size={16} />
                        ) : action.includes("Send") ? (
                          <Send size={16} />
                        ) : action === "Archive" ? (
                          <Archive size={16} />
                        ) : action === "Delete" ? (
                          <Trash2 size={16} />
                        ) : action === "Edit" ||
                          action === "Continue Editing" ? (
                          <Edit3 size={16} />
                        ) : (
                          <ExternalLink size={16} />
                        )}
                        {action}
                      </button>
                    ))}
                  </div>
                  {actions.length > 3 && (
                    <details className="creation-more">
                      <summary>More actions</summary>
                      <div>
                        {actions.slice(3).map((action) => (
                          <button
                            key={action}
                            onClick={() => runAction(item, action)}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <button
        className="library-create-fab"
        onClick={() => setCurrentScreen("create")}
      >
        <Plus size={20} /> Create New
      </button>
      {pendingDeleteItem && (
        <Modal
          title={
            pendingDeleteItem.itemType === "qr_code"
              ? "Delete this QR?"
              : "Delete this creation?"
          }
          onClose={() => setPendingDeleteItem(undefined)}
        >
          {(() => {
            const qrId = pendingDeleteItem.qrCodeIds[0] ?? "";
            const linkedFiles = workspace.files.filter((file) => {
              if (file.trashed) return false;
              if (pendingDeleteItem.itemType === "qr_code") {
                return file.qrCodeId === qrId;
              }
              return (
                pendingDeleteItem.fileAssetIds.includes(file.id) ||
                file.workshopItemId === pendingDeleteItem.id
              );
            });
            const hasLinkedFiles = linkedFiles.length > 0;
            return (
              <div className="stack">
                <p className="section-copy">
                  {pendingDeleteItem.itemType === "qr_code"
                    ? hasLinkedFiles
                      ? "This QR also has File Vault copies. Choose what should move to Trash."
                      : "This will move the QR to Trash. You can restore it later."
                    : hasLinkedFiles
                      ? "This creation also has File Vault copies. Choose what should move to Trash."
                      : "This will move the creation to Trash. You can restore it later."}
                </p>
                <div className="modal-actions">
                  {pendingDeleteItem.itemType === "qr_code" ? (
                    hasLinkedFiles ? (
                      <>
                        <Button
                          variant="danger"
                          icon={<Trash2 size={18} />}
                          onClick={() => {
                            moveQrToTrash(qrId, {
                              includeFileVaultCopies: false,
                              from: "My Creations",
                            });
                            setPendingDeleteItem(undefined);
                          }}
                        >
                          Move QR to Trash only
                        </Button>
                        <Button
                          variant="danger"
                          icon={<Trash2 size={18} />}
                          onClick={() => {
                            moveQrToTrash(qrId, {
                              includeFileVaultCopies: true,
                              from: "My Creations",
                            });
                            setPendingDeleteItem(undefined);
                          }}
                        >
                          Move QR and File Vault copies to Trash
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="danger"
                        icon={<Trash2 size={18} />}
                        onClick={() => {
                          moveQrToTrash(qrId, {
                            includeFileVaultCopies: false,
                            from: "My Creations",
                          });
                          setPendingDeleteItem(undefined);
                        }}
                      >
                        Move to Trash
                      </Button>
                    )
                  ) : hasLinkedFiles ? (
                    <>
                      <Button
                        variant="danger"
                        icon={<Trash2 size={18} />}
                        onClick={() => {
                          moveWorkshopItemToTrash(pendingDeleteItem.id, {
                            includeFileVaultCopies: false,
                            from: "My Creations",
                          });
                          setPendingDeleteItem(undefined);
                        }}
                      >
                        Move Creation to Trash only
                      </Button>
                      <Button
                        variant="danger"
                        icon={<Trash2 size={18} />}
                        onClick={() => {
                          moveWorkshopItemToTrash(pendingDeleteItem.id, {
                            includeFileVaultCopies: true,
                            from: "My Creations",
                          });
                          setPendingDeleteItem(undefined);
                        }}
                      >
                        Move Creation and File Vault copies to Trash
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="danger"
                      icon={<Trash2 size={18} />}
                      onClick={() => {
                        moveWorkshopItemToTrash(pendingDeleteItem.id, {
                          includeFileVaultCopies: false,
                          from: "My Creations",
                        });
                        setPendingDeleteItem(undefined);
                      }}
                    >
                      Move to Trash
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setPendingDeleteItem(undefined)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </section>
  );
}
