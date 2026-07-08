import {
  File,
  FileImage,
  FolderOpen,
  Link2,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";
import { useEffect, useState } from "react";

export function FileVaultScreen() {
  const {
    workspace,
    currentBusiness,
    selectedFileId,
    openFile,
    addFileMetadata,
    archiveFile,
    pinFileToBusinessKit,
    openCreateTask,
    openHelpRequest,
    openSchedule,
    showNotice,
  } = useAppState();
  const [activeFileId, setActiveFileId] = useState(selectedFileId);
  useEffect(() => setActiveFileId(selectedFileId), [selectedFileId]);
  const activeFile = workspace.files.find((file) => file.id === activeFileId);
  const files = workspace.files.filter((file) => !file.archived);
  return (
    <section className="screen screen--detail">
      <DetailHeader title="File Vault" backTo="create" />
      <div className="section">
        <h1 className="page-title">Files for {currentBusiness.shortName}</h1>
        <p className="page-subtitle">
          Logos, flyers, PDFs, approvals, Canva links, and project files stay
          with this business.
        </p>
      </div>
      <div className="between section">
        <div>
          <h2 className="section-heading">Saved files</h2>
          <p className="section-copy">Customer visibility is explicit.</p>
        </div>
        <label className="btn btn--primary">
          <Plus size={18} /> Upload
          <input
            hidden
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const id = addFileMetadata({ name: file.name, type: file.type });
              setActiveFileId(id);
            }}
          />
        </label>
      </div>
      <div className="list">
        {files.map((file) => (
          <button
            className="list-row"
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
              <span
                className="muted small"
                style={{ display: "block", marginTop: 4 }}
              >
                {file.type}
              </span>
            </span>
            <StatusBadge tone="neutral">
              <LockKeyhole size={12} /> {file.visibility}
            </StatusBadge>
          </button>
        ))}
      </div>
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
          <p>
            <strong>Type:</strong> {activeFile.type}
          </p>
          <p>
            <strong>Visibility:</strong> {activeFile.visibility}
          </p>
          <div className="alert alert--info section">
            This prototype stores file metadata only unless a real URL is shown.
            Live file storage is not connected.
          </div>
          <div className="stack">
            <Button
              variant="primary"
              wide
              onClick={() =>
                showNotice(
                  "Download prepared in prototype mode. A storage provider is required for real file bytes.",
                )
              }
            >
              Download
            </Button>
            {activeFile.url && (
              <Button
                variant="outline"
                wide
                onClick={() => {
                  void navigator.clipboard?.writeText(activeFile.url!);
                  showNotice("File link copied.");
                }}
              >
                Copy Link
              </Button>
            )}
            <Button
              variant="outline"
              wide
              onClick={() => openCreateTask("Fix Something")}
            >
              Use in Create
            </Button>
            <Button
              variant="outline"
              wide
              onClick={() => openHelpRequest("general")}
            >
              Attach to Help Request
            </Button>
            <Button
              variant="neutral"
              wide
              onClick={() => pinFileToBusinessKit(activeFile.id)}
            >
              Pin to My Business Kit
            </Button>
            <Button
              variant="ghost"
              wide
              onClick={() => {
                archiveFile(activeFile.id);
                setActiveFileId(undefined);
              }}
            >
              Archive
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
