import {
  BookOpen,
  Boxes,
  Copy,
  ExternalLink,
  FileText,
  Library,
  Link2,
  MessageSquareText,
  PackageCheck,
  Palette,
  Pin,
  Printer,
  QrCode,
  Search,
  Sparkles,
  Vault,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { useAppState } from "../state/AppState";
import type { BusinessAsset, ItemServiceBankItem } from "../types/models";

export function MyBusinessKitScreen() {
  const {
    currentBusiness,
    workspace,
    setCurrentScreen,
    openCreateTask,
    openTemplate,
    openAsset,
    saveItemBankItem,
    deleteItemBankItem,
    updateBusinessKitCategories,
    showNotice,
  } = useAppState();
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<BusinessAsset>();
  const [message, setMessage] = useState("");
  const [selectedBankItem, setSelectedBankItem] =
    useState<ItemServiceBankItem>();
  const [categoryDraft, setCategoryDraft] = useState<string[]>();
  const kit = workspace.businessHomeKit;
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return [
      ...workspace.businessAssets.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.assetType.replaceAll("_", " "),
        where: "My Business Kit",
        action: () => setSelectedAsset(item),
      })),
      ...workspace.itemBank.map((item) => ({
        id: item.id,
        title: item.name,
        type: item.category,
        where: "Item & Service Bank",
        action: () =>
          setMessage(
            `${item.name} is ready to add from the Estimate or Invoice Builder.`,
          ),
      })),
      ...workspace.documentTemplates.map((item) => ({
        id: item.templateId,
        title: item.templateName,
        type: `${item.documentType} template`,
        where: "Template Library",
        action: () => openTemplate(item.templateId),
      })),
      ...workspace.templates
        .filter((item) => item.type !== "Kit marker")
        .map((item) => ({
          id: item.id,
          title: item.name,
          type: item.type,
          where: "Starter / Template Library",
          action: () =>
            item.type.toLowerCase().includes("invoice")
              ? setCurrentScreen("invoice-builder")
              : setCurrentScreen("estimate-builder"),
        })),
      ...workspace.messageTemplates.map((item) => ({
        id: item.id,
        title: item.name,
        type: "message template",
        where: "Messages",
        action: () => setMessage(item.message),
      })),
      ...workspace.qrCodes.map((item) => ({
        id: item.id,
        title: item.name,
        type: "QR code",
        where: "QR Codes",
        action: () => openCreateTask("Create QR Code"),
      })),
    ].filter((item) =>
      `${item.title} ${item.type} ${item.where}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, workspace]);
  const copyLink = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setMessage("Link copied.");
  };
  return (
    <section className="screen screen--detail business-home-kit">
      <DetailHeader title="My Business Kit" backTo="create" />
      <div className="business-kit-hero section">
        <div className="icon-box">
          <PackageCheck size={25} />
        </div>
        <div>
          <h1>My Business Kit</h1>
          <p>
            Your saved setup for {currentBusiness.name}. Reuse logos, links, QR
            codes, templates, files, and business tools anytime.
          </p>
        </div>
      </div>
      <div className="business-kit-search section">
        <Search size={20} />
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your business kit"
          aria-label="Search your business kit"
        />
      </div>
      <div className="section">
        <Button
          variant="outline"
          wide
          icon={<Sparkles size={18} />}
          onClick={() => setCurrentScreen("global-library")}
        >
          Search All Starter Options
        </Button>
      </div>
      {message && (
        <div className="alert alert--info section">
          <strong>{message}</strong>
        </div>
      )}
      {query && (
        <section className="business-kit-card section">
          <h2>Search results</h2>
          {results.length ? (
            results.map((item) => (
              <button
                className="kit-search-result"
                key={item.id}
                onClick={item.action}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.type} · {item.where}
                  </small>
                </span>
                <ExternalLink size={17} />
              </button>
            ))
          ) : (
            <p className="muted">No saved business tools match “{query}.”</p>
          )}
        </section>
      )}
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <Pin size={21} />
          </span>
          <div>
            <h2>Pinned for quick access</h2>
            <p>The links and assets this business reuses most.</p>
          </div>
        </header>
        <div className="pinned-asset-grid">
          {workspace.businessAssets
            .filter((asset) => asset.pinned)
            .map((asset) => (
              <button key={asset.id} onClick={() => setSelectedAsset(asset)}>
                <strong>{asset.title}</strong>
                <span>{asset.assetType.replaceAll("_", " ")}</span>
              </button>
            ))}
        </div>
      </section>
      <div className="business-kit-stats section">
        <div>
          <strong>{workspace.itemBank.length}</strong>
          <span>Items &amp; services</span>
        </div>
        <div>
          <strong>{workspace.documentTemplates.length}</strong>
          <span>Document templates</span>
        </div>
        <div>
          <strong>{workspace.workshopItems.length}</strong>
          <span>Workshop creations</span>
        </div>
        <div>
          <strong>{workspace.printReorderItems.length}</strong>
          <span>Print items</span>
        </div>
      </div>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <Palette size={21} />
          </span>
          <div>
            <h2>Brand Kit</h2>
            <p>Business identity and contact information used by builders.</p>
          </div>
        </header>
        <dl className="brand-values">
          <div>
            <dt>Business</dt>
            <dd>{currentBusiness.name}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{currentBusiness.phone}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{currentBusiness.email}</dd>
          </div>
          <div>
            <dt>Primary</dt>
            <dd>
              <i
                style={{ background: currentBusiness.brandKit.primaryColor }}
              />
              {currentBusiness.brandKit.primaryColor}
            </dd>
          </div>
          <div>
            <dt>Accent</dt>
            <dd>
              <i style={{ background: currentBusiness.brandKit.accentColor }} />
              {currentBusiness.brandKit.accentColor}
            </dd>
          </div>
          <div>
            <dt>Font</dt>
            <dd>{currentBusiness.brandKit.preferredFont}</dd>
          </div>
        </dl>
      </section>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <Link2 size={21} />
          </span>
          <div>
            <h2>Quick Links</h2>
            <p>Copy, test, edit, or turn saved business links into QR codes.</p>
          </div>
        </header>
        <div className="quick-link-list">
          {workspace.businessAssets
            .filter((asset) => asset.url)
            .map((asset) => (
              <article key={asset.id}>
                <div>
                  <strong>{asset.title}</strong>
                  <span>{asset.url}</span>
                </div>
                <button onClick={() => copyLink(asset.url)}>
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={() => {
                    window.open(asset.url, "_blank", "noopener,noreferrer");
                    setMessage("Opened the saved link in a new tab.");
                  }}
                >
                  <ExternalLink size={16} />
                  Test
                </button>
                <button onClick={() => openCreateTask("Create QR Code")}>
                  <QrCode size={16} />
                  Create QR
                </button>
                <button
                  onClick={() =>
                    setMessage(
                      "Link editing is planned for Phase 2. Copy or test the current saved link now.",
                    )
                  }
                >
                  Edit
                </button>
              </article>
            ))}
        </div>
      </section>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <QrCode size={21} />
          </span>
          <div>
            <h2>QR Codes</h2>
            <p>Saved destinations and reusable QR files for this business.</p>
          </div>
        </header>
        <div className="kit-qr-list">
          {workspace.qrCodes.map((qr) => (
            <article key={qr.id}>
              <div>
                <strong>{qr.name}</strong>
                <p>
                  {qr.type} · {qr.scans} scans
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const asset = workspace.businessAssets.find(
                    (item) => item.qrCodeId === qr.id,
                  );
                  asset
                    ? openAsset(asset.id)
                    : openCreateTask("Create QR Code");
                }}
              >
                Open
              </Button>
            </article>
          ))}
        </div>
      </section>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <FileText size={21} />
          </span>
          <div>
            <h2>Templates &amp; Document Styles</h2>
            <p>
              Estimate and invoice templates stay separate, with reusable
              official-document styles.
            </p>
          </div>
        </header>
        {workspace.documentTemplates.map((template) => (
          <article className="document-template-row" key={template.templateId}>
            <div>
              <strong>{template.templateName}</strong>
              <p>
                {template.documentType} · {template.layoutStyle} ·{" "}
                {
                  template.columnSettings.filter((column) => column.visible)
                    .length
                }{" "}
                visible columns
              </p>
            </div>
            <button onClick={() => openTemplate(template.templateId)}>
              Open Template
            </button>
          </article>
        ))}
        {workspace.templates
          .filter((item) => item.type !== "Kit marker")
          .slice(0, 6)
          .map((template) => (
            <article className="document-template-row" key={template.id}>
              <div>
                <strong>{template.name}</strong>
                <p>{template.type} · Editable starter blueprint</p>
              </div>
              <button
                onClick={() =>
                  template.type.toLowerCase().includes("invoice")
                    ? setCurrentScreen("invoice-builder")
                    : setCurrentScreen("estimate-builder")
                }
              >
                Use
              </button>
            </article>
          ))}
        <div className="business-kit-chips">
          {workspace.documentStyles.map((style) => (
            <span key={style.id}>{style.templateName}</span>
          ))}
        </div>
      </section>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <Boxes size={21} />
          </span>
          <div>
            <h2>Item &amp; Service Bank</h2>
            <p>
              Saved items are copied as snapshots into estimates and invoices.
            </p>
          </div>
        </header>
        <div className="business-kit-chips">
          {kit.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
        <div className="row wrap">
          <Button
            variant="outline"
            onClick={() => setCategoryDraft([...kit.categories])}
          >
            Manage Categories
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentScreen("import-wizard")}
          >
            Import Items
          </Button>
        </div>
        <div className="bank-list">
          {workspace.itemBank.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.customerDescription}</p>
                <small>
                  {item.category} · {item.unit} · {item.source}
                </small>
              </div>
              <b>
                {item.defaultRate.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </b>
              <span className="bank-item-actions">
                <button onClick={() => setSelectedBankItem({ ...item })}>
                  Edit
                </button>
                <button onClick={() => deleteItemBankItem(item.id)}>
                  Delete
                </button>
              </span>
            </article>
          ))}
        </div>
      </section>
      <div className="business-kit-grid section">
        <button onClick={() => setCurrentScreen("workshop-library")}>
          <Library />
          <strong>Workshop Library</strong>
          <span>Reusable creations and drafts</span>
        </button>
        <button onClick={() => setCurrentScreen("file-vault")}>
          <Vault />
          <strong>File Vault</strong>
          <span>Uploads, exports, and approved files</span>
        </button>
        <button onClick={() => setCurrentScreen("business-kits")}>
          <Sparkles />
          <strong>Starter Blueprints</strong>
          <span>Add optional starter tools safely</span>
        </button>
        <button onClick={() => setCurrentScreen("template-library")}>
          <FileText />
          <strong>Template Library</strong>
          <span>Estimate, invoice, and document templates</span>
        </button>
        <button onClick={() => setCurrentScreen("document-style-editor")}>
          <Palette />
          <strong>Document Styles</strong>
          <span>Fonts, tables, totals, notes, and footer styles</span>
        </button>
        <button onClick={() => setCurrentScreen("workshop-library")}>
          <Printer />
          <strong>Business Cards &amp; Print</strong>
          <span>
            {workspace.printReorderItems[0]?.name ?? "No print items yet"}
          </span>
        </button>
        <button onClick={() => setCurrentScreen("integrations")}>
          <Link2 />
          <strong>Connected Accounts</strong>
          <span>Business-specific connections and placeholders</span>
        </button>
        <button onClick={() => setCurrentScreen("file-vault")}>
          <BookOpen />
          <strong>Saved Files</strong>
          <span>Find the actual PDF, PNG, or upload</span>
        </button>
      </div>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <MessageSquareText size={21} />
          </span>
          <div>
            <h2>Messages / Terms / Footers</h2>
            <p>Reusable customer wording for this business only.</p>
          </div>
        </header>
        {workspace.messageTemplates.map((message) => (
          <article className="message-template-row" key={message.id}>
            <strong>{message.name}</strong>
            <p>{message.message}</p>
          </article>
        ))}
      </section>
      <section className="business-kit-card section">
        <header>
          <span className="icon-box">
            <BookOpen size={21} />
          </span>
          <div>
            <h2>Recent Kit Activity</h2>
            <p>Recent saves and reusable business-tool updates.</p>
          </div>
        </header>
        {workspace.activity.slice(0, 4).map((activity) => (
          <div className="message-template-row" key={activity.id}>
            <strong>{activity.label}</strong>
            <p>{activity.occurredAt}</p>
          </div>
        ))}
      </section>
      {selectedAsset && (
        <Modal
          title={selectedAsset.title}
          onClose={() => setSelectedAsset(undefined)}
        >
          <div className="asset-detail-preview">
            <span className="icon-box">
              {selectedAsset.assetType === "logo" ? (
                currentBusiness.initials
              ) : (
                <FileText size={24} />
              )}
            </span>
            <div>
              <strong>{selectedAsset.assetType.replaceAll("_", " ")}</strong>
              <p>
                {selectedAsset.description ??
                  selectedAsset.url ??
                  selectedAsset.status}
              </p>
            </div>
          </div>
          <dl className="help-detail-list">
            <div>
              <dt>Status</dt>
              <dd>{selectedAsset.status}</dd>
            </div>
            <div>
              <dt>Last used</dt>
              <dd>{selectedAsset.lastUsedAt ?? "Not yet"}</dd>
            </div>
            <div>
              <dt>Files</dt>
              <dd>{selectedAsset.fileIds.length}</dd>
            </div>
          </dl>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                const id = selectedAsset.id;
                setSelectedAsset(undefined);
                openAsset(id);
              }}
            >
              View Details
            </Button>
            {selectedAsset.url && (
              <Button
                variant="outline"
                onClick={() => copyLink(selectedAsset.url)}
              >
                Copy Link
              </Button>
            )}
            <Button
              variant="neutral"
              onClick={() =>
                showNotice(
                  "Download prepared in prototype mode. Live file storage is required for real file bytes.",
                )
              }
            >
              Download
            </Button>
            <Button variant="ghost" onClick={() => setSelectedAsset(undefined)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
      {selectedBankItem && (
        <Modal
          title="Edit Item / Service"
          onClose={() => setSelectedBankItem(undefined)}
        >
          <div className="stack">
            <div className="field">
              <label>Item name</label>
              <input
                className="input"
                value={selectedBankItem.name}
                onChange={(event) =>
                  setSelectedBankItem({
                    ...selectedBankItem,
                    name: event.target.value,
                  })
                }
              />
            </div>
            <div className="field">
              <label>Customer description</label>
              <textarea
                className="textarea"
                value={selectedBankItem.customerDescription}
                onChange={(event) =>
                  setSelectedBankItem({
                    ...selectedBankItem,
                    customerDescription: event.target.value,
                  })
                }
              />
            </div>
            <div className="estimate-field-grid">
              <div className="field">
                <label>Category</label>
                <input
                  className="input"
                  value={selectedBankItem.category}
                  onChange={(event) =>
                    setSelectedBankItem({
                      ...selectedBankItem,
                      category: event.target.value,
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Unit</label>
                <input
                  className="input"
                  value={selectedBankItem.unit}
                  onChange={(event) =>
                    setSelectedBankItem({
                      ...selectedBankItem,
                      unit: event.target.value,
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Default rate</label>
                <input
                  className="input"
                  type="number"
                  value={selectedBankItem.defaultRate}
                  onChange={(event) =>
                    setSelectedBankItem({
                      ...selectedBankItem,
                      defaultRate: Number(event.target.value),
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Internal cost</label>
                <input
                  className="input"
                  type="number"
                  value={selectedBankItem.internalCost ?? 0}
                  onChange={(event) =>
                    setSelectedBankItem({
                      ...selectedBankItem,
                      internalCost: Number(event.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button
                variant="primary"
                onClick={() => {
                  saveItemBankItem(selectedBankItem);
                  setSelectedBankItem(undefined);
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedBankItem(undefined)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {categoryDraft && (
        <Modal
          title="Manage Categories"
          onClose={() => setCategoryDraft(undefined)}
        >
          <p>Rename, reorder, remove, or add categories for this business.</p>
          <div className="category-editor-list">
            {categoryDraft.map((category, index) => (
              <div key={`${category}-${index}`}>
                <input
                  className="input"
                  value={category}
                  onChange={(event) =>
                    setCategoryDraft((current) =>
                      current?.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                />
                <button
                  disabled={index === 0}
                  onClick={() =>
                    setCategoryDraft((current) => {
                      if (!current) return current;
                      const next = [...current];
                      [next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ];
                      return next;
                    })
                  }
                >
                  ↑
                </button>
                <button
                  disabled={index === categoryDraft.length - 1}
                  onClick={() =>
                    setCategoryDraft((current) => {
                      if (!current) return current;
                      const next = [...current];
                      [next[index + 1], next[index]] = [
                        next[index],
                        next[index + 1],
                      ];
                      return next;
                    })
                  }
                >
                  ↓
                </button>
                <button
                  onClick={() =>
                    setCategoryDraft((current) =>
                      current?.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setCategoryDraft((current) => [
                ...(current ?? []),
                "New Category",
              ])
            }
          >
            Add Category
          </Button>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                updateBusinessKitCategories(categoryDraft.filter(Boolean));
                setCategoryDraft(undefined);
              }}
            >
              Save Categories
            </Button>
            <Button variant="ghost" onClick={() => setCategoryDraft(undefined)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
