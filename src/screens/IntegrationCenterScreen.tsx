import {
  BookOpenCheck,
  ExternalLink,
  Link2,
  LockKeyhole,
  PlugZap,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";
import { useState } from "react";

export function IntegrationCenterScreen() {
  const { currentBusiness, workspace, setCurrentScreen, recordIntegrationAction } =
    useAppState();
  const [message, setMessage] = useState("");
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Connected Accounts" backTo="create" />
      <div className="section">
        <h1 className="page-title">Integration Center</h1>
        <p className="page-subtitle">
          Account connections are planned here. This build does not connect to
          live services.
        </p>
      </div>
      <div className="alert alert--warning section">
        <PlugZap size={22} />
        <div>
          <strong>Mock mode</strong>
          <div className="small" style={{ marginTop: 4 }}>
            No records are posted, imported, synced, or sent. Real setup
            requires provider credentials and approved account connection flows.
          </div>
        </div>
      </div>
      <div className="integration-list section">
        {workspace.integrations.map((integration) => (
          <article className="card panel" key={integration.id}>
            <div className="between">
              <span className="row">
                <span className="icon-box">
                  <Link2 size={20} />
                </span>
                <strong>{integration.provider}</strong>
              </span>
              <StatusBadge tone={statusTone(integration.status)}>
                {integration.status}
              </StatusBadge>
            </div>
            <p className="muted small" style={{ lineHeight: 1.45 }}>
              {integration.detail}
            </p>
            <div className="integration-actions">
              {integration.provider === "Excel / CSV" && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentScreen("import-wizard")}
                  >
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentScreen("export-center")}
                  >
                    Export
                  </Button>
                </>
              )}
              {integration.provider === "QuickBooks" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    recordIntegrationAction("QuickBooks", "Review Sync Queue");
                    setCurrentScreen("sync-center");
                  }}
                >
                  Review Sync Queue
                </Button>
              )}
              {!["Excel / CSV", "QuickBooks"].includes(
                integration.provider,
              ) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const action =
                      integration.status === "Mock Connected"
                        ? "Manage Demo Status"
                        : "Review Connection Requirements";
                    recordIntegrationAction(integration.provider, action);
                    setMessage(
                      `${integration.provider} needs approved credentials and provider setup. No live account was connected.`,
                    );
                  }}
                >
                  {integration.status === "Mock Connected"
                    ? "Manage Demo Status"
                    : "Connection Details"}
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
      {message && (
        <div className="alert alert--info section" aria-live="polite">
          <strong>{message}</strong>
        </div>
      )}
      <section className="card panel section">
        <div className="row">
          <LockKeyhole color="var(--color-success)" />
          <div>
            <strong>Use account connections, never passwords</strong>
            <p className="muted small" style={{ margin: "4px 0 0" }}>
              Use files, screenshots, share links, and project access inside
              ArmaDesk. Never share account passwords.
            </p>
          </div>
        </div>
      </section>
      <section className="card panel section">
        <div className="row">
          <BookOpenCheck color="var(--color-primary)" />
          <div>
            <strong>QuickBooks boundary</strong>
            <p className="muted small" style={{ margin: "4px 0 0" }}>
              ArmaDesk controls workflow and approvals. QuickBooks
              remains the accounting record.
            </p>
          </div>
        </div>
        <Button
          className="section"
          variant="neutral"
          wide
          icon={<ExternalLink size={17} />}
          onClick={() =>
            setMessage(
              `Integration plan: ${currentBusiness.name} keeps provider connections business-specific. Credentials, consent, field mapping, and sync rules are required before live use.`,
            )
          }
        >
          Read integration plan
        </Button>
      </section>
    </section>
  );
}
