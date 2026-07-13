import {
  Archive,
  Copy,
  Download,
  ExternalLink,
  Eye,
  File,
  FileImage,
  FolderOpen,
  Link2,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  canDownloadFileAsset,
  fileVaultFilters,
  getFileVaultCategories,
  getFileVaultStatus,
  getLinkedRecordSummary,
  hasGeneratedFileContent,
  type FileVaultFilter,
} from "../lib/fileVault";
import { useAppState } from "../state/AppState";
import type { FileAsset } from "../types/models";

function createGeneratedHref(file: FileAsset) {
  if (file.dataUrl) return { href: file.dataUrl };
  if (!file.generatedContent) return undefined;
  const href = URL.createObjectURL(
    new Blob([file.generatedContent], { type: file.type }),
  );
  return { href, revoke: true };
}

function downloadFileAsset(file: FileAsset) {
  const generated = createGeneratedHref(file);
  if (!generated) return false;
  const anchor = document.createElement("a");
  anchor.href = generated.href;
  anchor.download = file.name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  if (generated.revoke) URL.revokeObjectURL(generated.href);
  return true;
}

export function FileVaultScreen() {
  const {
    workspace,
    currentBusiness,
    selectedFileId,
    openFile,
    addFileMetadata,
    archiveFile,
    pinFileToBusinessKit,
    toggleFileVisibility,
    openCreateTask,
    openWorkshopItem,
    openHelpRequest,
    openSchedule,
    showNotice,
  } = useAppState();
  const [activeFileId, setActiveFileId] = useState(selectedFileId);
  const [activeFilter, setActiveFilter] = useState<FileVaultFilter>("All");

  useEffect(() => setActiveFileId(selectedFileId), [selectedFileId]);

  const activeFile = workspace.files.find((file) => file.id === activeFileId);
  const summary = useMemo(
    () => ({
      total: workspace.files.filter((file) => !file.archived).length,
      generated: workspace.files.filter(
        (file) => !file.archived && hasGeneratedFileContent(file),
      ).length,
      metadataOnly: workspace.files.filter(
        (file) => !file.archived && file.metadataOnly && !hasGeneratedFileContent(file),
      ).length,
      customerVisible: workspace.files.filter(
        (file) => !file.archived && file.visibility === "Customer",
      ).length,
      archived: workspace.files.filter((file) => file.archived).length,
    }),
    [workspace.files],
  );
  const files = useMemo(
    () =>
      workspace.files.filter((file) => {
        if (activeFilter === "Archived") {
          return getFileVaultCategories(file, workspace).includes("Archived");
        }
        if (file.archived) return false;
        return getFileVaultCategories(file, workspace).includes(activeFilter);
      }),
    [activeFilter, workspace],
  );

  const handleDownload = (file: FileAsset) => {
    if (!downloadFileAsset(file)) {
      showNotice(
        "This File Vault record is metadata-only. A storage provider is required before it can download real file bytes.",
      );
      return;
    }
    showNotice(`${file.name} downloaded to your device.`);
  };

  const handleUseInCreate = (file: FileAsset) => {
    setActiveFileId(undefined);
    if (file.qrCodeId) {
      openCreateTask("Create QR Code", {
        qrCodeId: file.qrCodeId,
        workshopItemId: file.workshopItemId,
      });
      return;
    }
    if (file.workshopItemId) {
      openWorkshopItem(file.workshopItemId);
      return;
    }
    if (/business card|card/i.test(file.name)) {
      openCreateTask("Business Cards");
      return;
    }
    openCreateTask("Fix Something");
  };

  return (
    <section className="screen screen--detail file-vault-screen">
      <DetailHeader title="File Vault" backTo="create" />
      <div className="section">
        <h1 className="page-title">Files for {currentBusiness.shortName}</h1>
        <p className="page-subtitle">
          Downloads, generated QR files, uploads, links, and help-request files
          stay tied to this business profile.
        </p>
      </div>

      <div className="vault-summary-grid section">
        <article>
          <strong>{summary.total}</strong>
          <span>Active files</span>
        </article>
        <article>
          <strong>{summary.generated}</strong>
          <span>Generated exports</span>
        </article>
        <article>
          <strong>{summary.metadataOnly}</strong>
          <span>Metadata only</span>
        </article>
        <article>
          <strong>{summary.customerVisible}</strong>
          <span>Customer visible</span>
        </article>
        <article>
          <strong>{summary.archived}</strong>
          <span>Archived</span>
        </article>
      </div>

      <div className="between section">
        <div>
          <h2 className="section-heading">Saved files</h2>
          <p className="section-copy">
            Status labels show whether a file can download now or is only a
            stored reference.
          </p>
        </div>
        <label className="btn btn--primary">
          <Plus size={18} /> Upload
          <input
            hidden
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const id = addFileMetadata({
                name: file.name,
                type: file.type,
                source: "Upload",
              });
              setActiveFileId(id);
            }}
          />
        </label>
      </div>

      <div className="library-filters section" aria-label="File Vault filters">
        {fileVaultFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={
              activeFilter === filter
                ? "filter-chip filter-chip--active"
                : "filter-chip"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {files.length ? (
        <div className="vault-file-grid section">
          {files.map((file) => {
            const status = getFileVaultStatus(file);
            const linked = getLinkedRecordSummary(file, workspace);
            return (
              <button
                className="vault-file-card"
                key={file.id}
                onClick={() => {
                  setActiveFileId(file.id);
                  openFile(file.id);
                }}
              >
                <span className="icon-box">
                  {file.type.startsWith("image") ? (
                    <FileImage size={21} />
                  ) : (
                    <File size={21} />
                  )}
                </span>
                <span className="grow">
                  <strong>{file.name}</strong>
                  <small>{file.type}</small>
                  <small>{linked}</small>
                  <small>{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "No date saved"}</small>
                </span>
                <span className="vault-card-badges">
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  <StatusBadge tone="neutral">
                    <LockKeyhole size={12} /> {file.visibility}
                  </StatusBadge>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="library-empty section">
          <FolderOpen size={28} />
          <h2>Nothing here yet.</h2>
          <p>
            Files appear here when you upload, download a QR, export a creation,
            or attach files to help requests.
          </p>
        </div>
      )}

      <div className="card panel section">
        <div className="row">
          <FolderOpen color="var(--color-primary)" />
          <div>
            <strong>Project folders</strong>
            <p className="muted small" style={{ margin: "4px 0 0" }}>
              Customer info, approvals, change orders, payments, photos, notes,
              and sync history belong together.
            </p>
          </div>
        </div>
      </div>
      <div className="list">
        {workspace.projects.map((project) => (
          <button
            className="list-row"
            key={project.id}
            onClick={() => openSchedule({ projectId: project.id })}
          >
            <span className="icon-box">
              <FolderOpen size={21} />
            </span>
            <span className="grow">
              <strong>{project.name}</strong>
              <span
                className="muted small"
                style={{ display: "block", marginTop: 4 }}
              >
                {project.status} · {project.fileIds.length} protected files
              </span>
            </span>
            <StatusBadge tone="info">Project</StatusBadge>
          </button>
        ))}
      </div>
      <div className="card panel section">
        <div className="row">
          <Link2 color="var(--color-primary)" />
          <div>
            <strong>External design links</strong>
            <p className="muted small" style={{ margin: "4px 0 0" }}>
              Store Canva share links and VistaPrint notes here. Never store
              account passwords.
            </p>
          </div>
        </div>
      </div>

      {activeFile && (
        <Modal title={activeFile.name} onClose={() => setActiveFileId(undefined)}>
          <div className="vault-detail-stack">
            <div className="vault-detail-status">
              <StatusBadge tone={getFileVaultStatus(activeFile).tone}>
                {getFileVaultStatus(activeFile).label}
              </StatusBadge>
              <StatusBadge tone="neutral">{activeFile.visibility}</StatusBadge>
            </div>
            <p className="muted small">{getFileVaultStatus(activeFile).description}</p>
            <dl className="help-detail-list">
              <div>
                <dt>Type</dt>
                <dd>{activeFile.type}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{activeFile.source ?? "Upload"}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>
                  {activeFile.createdAt
                    ? new Date(activeFile.createdAt).toLocaleString()
                    : "No date saved"}
                </dd>
              </div>
              <div>
                <dt>Linked records</dt>
                <dd>{getLinkedRecordSummary(activeFile, workspace)}</dd>
              </div>
            </dl>
            <div className="alert alert--info">
              {canDownloadFileAsset(activeFile)
                ? "Generated content is available in this browser and can download to this device."
                : activeFile.url
                  ? "This is an external design or file link. Open or copy the link instead of downloading stored bytes."
                  : "This record is metadata-only. Live cloud file storage is not connected yet."}
            </div>

            {activeFile.dataUrl && activeFile.type.startsWith("image/") && (
              <img
                alt={activeFile.name}
                src={activeFile.dataUrl}
                className="vault-preview-image"
              />
            )}
            {activeFile.generatedContent && activeFile.type === "image/svg+xml" && (
              <div
                className="qr-placeholder vault-preview-svg"
                dangerouslySetInnerHTML={{ __html: activeFile.generatedContent }}
              />
            )}
            {activeFile.dataUrl && activeFile.type === "application/pdf" && (
              <a
                className="btn btn--outline"
                href={activeFile.dataUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Eye size={18} /> Open PDF Preview
              </a>
            )}
            {activeFile.url && (
              <a
                className="btn btn--outline"
                href={activeFile.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={18} /> Open External Link
              </a>
            )}

            <div className="modal-actions">
              <Button
                variant="primary"
                icon={<Download size={18} />}
                onClick={() => handleDownload(activeFile)}
              >
                Download to Device
              </Button>
              {activeFile.url && (
                <Button
                  variant="outline"
                  icon={<Copy size={18} />}
                  onClick={() => {
                    void navigator.clipboard?.writeText(activeFile.url!);
                    showNotice("File link copied.");
                  }}
                >
                  Copy Link
                </Button>
              )}
              {activeFile.url && (
                <Button
                  variant="outline"
                  icon={<ExternalLink size={18} />}
                  onClick={() =>
                    window.open(activeFile.url, "_blank", "noopener,noreferrer")
                  }
                >
                  Open Link
                </Button>
              )}
              <Button
                variant="outline"
                icon={<FileImage size={18} />}
                onClick={() => handleUseInCreate(activeFile)}
              >
                Use in Create
              </Button>
              <Button
                variant="outline"
                icon={<Plus size={18} />}
                onClick={() => {
                  setActiveFileId(undefined);
                  openHelpRequest("general");
                  showNotice("Attach this File Vault item in the help request notes.");
                }}
              >
                Attach to Help Request
              </Button>
              <Button
                variant="neutral"
                icon={<FolderOpen size={18} />}
                onClick={() => pinFileToBusinessKit(activeFile.id)}
              >
                Pin to My Business Kit
              </Button>
              <Button
                variant="neutral"
                icon={<LockKeyhole size={18} />}
                onClick={() => toggleFileVisibility(activeFile.id)}
              >
                Change Visibility
              </Button>
              <Button
                variant="ghost"
                icon={<Archive size={18} />}
                onClick={() => {
                  archiveFile(activeFile.id);
                  setActiveFileId(undefined);
                }}
              >
                Archive
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
