import {
  Check,
  ChevronRight,
  Eye,
  Layers3,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { businessKits } from "../data/mock/businessProfiles";
import type { BusinessKit } from "../types/models";
import { useAppState, type KitSectionKey } from "../state/AppState";

const kitSections: { key: KitSectionKey; label: string }[] = [
  { key: "estimateTemplates", label: "Estimate templates" },
  { key: "invoiceTemplates", label: "Invoice templates" },
  { key: "progressChangeTemplates", label: "Progress / change templates" },
  { key: "leadForms", label: "Lead forms" },
  { key: "qrStarters", label: "QR starters" },
  { key: "flyerPostTemplates", label: "Flyer / post templates" },
  { key: "businessCardTemplate", label: "Business card" },
  { key: "reviewBoosterTools", label: "Review tools" },
  { key: "customerTags", label: "Customer tags" },
  { key: "messageTemplates", label: "Message templates" },
  { key: "setupChecklist", label: "Setup checklist" },
  { key: "suggestedServices", label: "Suggested services" },
  { key: "suggestedTerms", label: "Suggested terms" },
  { key: "suggestedFolders", label: "Project folders" },
];

const sectionCount = (kit: BusinessKit, key: KitSectionKey) =>
  Array.isArray(kit[key]) ? (kit[key] as string[]).length : kit[key] ? 1 : 0;

export function BusinessKitsScreen() {
  const { currentBusiness, workspace, applyKit, setCurrentScreen } =
    useAppState();
  const [preview, setPreview] = useState<BusinessKit>();
  const [confirm, setConfirm] = useState<BusinessKit>();
  const [selectedSections, setSelectedSections] = useState<Set<KitSectionKey>>(
    new Set(kitSections.map((item) => item.key)),
  );
  const [duplicatePolicy, setDuplicatePolicy] = useState<
    "Keep Both" | "Replace Existing" | "Skip" | "Rename New Item"
  >("Keep Both");
  const isApplied = (kit: BusinessKit) =>
    currentBusiness.appliedKitIds.includes(kit.id) ||
    workspace.templates.some((item) => item.sourceKitId === kit.id);
  const recommendedKit =
    businessKits.find((kit) =>
      currentBusiness.industry
        .toLowerCase()
        .includes(kit.industry.toLowerCase().split(" ")[0]),
    ) ?? businessKits.find((kit) => kit.id === "general-kit")!;
  const openPreview = (kit: BusinessKit) => {
    setSelectedSections(
      new Set(
        kitSections
          .filter((item) => sectionCount(kit, item.key) > 0)
          .map((item) => item.key),
      ),
    );
    setPreview(kit);
  };
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Business Kits" backTo="create" />
      <div className="section">
        <h1 className="page-title">Start with a blueprint</h1>
        <p className="page-subtitle">
          We added common tools for this type of business. You can keep, delete,
          rename, or change anything.
        </p>
      </div>
      <section className="card panel section stack">
        <strong>{recommendedKit.name} is recommended for this profile.</strong>
        <div className="contract-actions">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedSections(
                new Set(
                  kitSections
                    .filter(
                      (item) => sectionCount(recommendedKit, item.key) > 0,
                    )
                    .map((item) => item.key),
                ),
              );
              setConfirm(recommendedKit);
            }}
          >
            Apply Full Kit
          </Button>
          <Button variant="outline" onClick={() => openPreview(recommendedKit)}>
            Pick What I Want
          </Button>
          <Button
            variant="neutral"
            onClick={() => setCurrentScreen("my-business-kit")}
          >
            Start Blank
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentScreen("global-library")}
          >
            Search All Options
          </Button>
        </div>
      </section>
      <div className="alert alert--info section">
        <Layers3 size={22} />
        <div>
          <strong>Made for {currentBusiness.name}</strong>
          <div className="small" style={{ marginTop: 4 }}>
            You can rename, remove, disable, or customize anything after
            applying.
          </div>
        </div>
      </div>
      <div className="kit-list section">
        {businessKits.map((kit) => (
          <article className="card kit-card" key={kit.id}>
            <div
              className="kit-card__accent"
              style={{ background: kit.accent }}
            />
            <div className="kit-card__body">
              <div className="between">
                <span className="icon-box">
                  <Sparkles size={21} />
                </span>
                {isApplied(kit) && (
                  <StatusBadge tone="success">
                    <Check size={13} /> Applied
                  </StatusBadge>
                )}
              </div>
              <h2>{kit.name}</h2>
              <p>{kit.description}</p>
              <p className="small">
                <strong>
                  {kit.estimateTemplates.length +
                    kit.invoiceTemplates.length +
                    kit.leadForms.length +
                    kit.qrStarters.length +
                    kit.flyerPostTemplates.length +
                    kit.customerTags.length +
                    kit.messageTemplates.length}
                </strong>{" "}
                editable starter items
              </p>
              <div className="kit-card__actions">
                <Button
                  variant="neutral"
                  icon={<Eye size={17} />}
                  onClick={() => openPreview(kit)}
                >
                  Preview
                </Button>
                <Button
                  variant="primary"
                  disabled={isApplied(kit)}
                  icon={<Plus size={17} />}
                  onClick={() => {
                    openPreview(kit);
                  }}
                >
                  {isApplied(kit) ? "Added" : "Choose Parts"}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <button
        className="card panel between section"
        style={{ width: "100%", textAlign: "left" }}
        onClick={() => setCurrentScreen("help")}
      >
        <span>
          <strong>Need a custom kit?</strong>
          <small className="muted" style={{ display: "block", marginTop: 4 }}>
            Request Basic, Pro, or Full Business Workshop setup.
          </small>
        </span>
        <ChevronRight size={20} />
      </button>
      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(undefined)}>
          <p>{preview.description}</p>
          <p className="small">
            <strong>Recommended for:</strong>{" "}
            {preview.recommendedFor.join(", ")}
          </p>
          <h3>Choose what to add</h3>
          <div className="kit-selector">
            {kitSections
              .filter((item) => sectionCount(preview, item.key) > 0)
              .map((section) => (
                <label key={section.key}>
                  <input
                    type="checkbox"
                    checked={selectedSections.has(section.key)}
                    onChange={(event) =>
                      setSelectedSections((current) => {
                        const next = new Set(current);
                        event.target.checked
                          ? next.add(section.key)
                          : next.delete(section.key);
                        return next;
                      })
                    }
                  />
                  <span className="grow">{section.label}</span>
                  <strong>{sectionCount(preview, section.key)}</strong>
                </label>
              ))}
          </div>
          <div className="alert alert--success section">
            <ShieldCheck size={21} />
            <div>
              <strong>Adds, never overwrites</strong>
              <div className="small" style={{ marginTop: 4 }}>
                Matching names are skipped in this mock build. Existing
                customers, invoices, files, and active templates stay untouched.
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              disabled={selectedSections.size === 0}
              onClick={() => {
                setPreview(undefined);
                setConfirm(preview);
              }}
            >
              Review &amp; Apply
            </Button>
            <Button variant="ghost" onClick={() => setPreview(undefined)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
      {confirm && (
        <Modal
          title={`Apply ${confirm.name}?`}
          onClose={() => setConfirm(undefined)}
        >
          <p>
            This will add the {selectedSections.size} selected groups to this
            business. Customers, estimates, invoices, and files remain separate.
          </p>
          <div className="field">
            <label>If a duplicate item is found</label>
            <div className="operation-choice-grid">
              {(
                [
                  "Keep Both",
                  "Replace Existing",
                  "Skip",
                  "Rename New Item",
                ] as const
              ).map((option) => (
                <button
                  className={duplicatePolicy === option ? "active" : ""}
                  key={option}
                  onClick={() => setDuplicatePolicy(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <small>Safe default: Keep Both adds “Copy” to the new item.</small>
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                applyKit(confirm, [...selectedSections], duplicatePolicy);
                setConfirm(undefined);
              }}
            >
              Apply Kit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPreview(confirm);
                setConfirm(undefined);
              }}
            >
              Change Selection
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(undefined)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
