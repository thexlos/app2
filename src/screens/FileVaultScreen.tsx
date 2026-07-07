import {
  File,
  FileImage,
  FolderOpen,
  Link2,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";

export function FileVaultScreen() {
  const { workspace, currentBusiness } = useAppState();
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
        <Button variant="primary" icon={<Plus size={18} />}>
          Upload
        </Button>
      </div>
      <div className="list">
        {workspace.files.map((file) => (
          <div className="list-row" key={file.id}>
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
          </div>
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
          <div className="list-row" key={project.id}>
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
          </div>
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
    </section>
  );
}
