import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../state/AppState";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function BusinessSwitcher() {
  const {
    currentBusiness,
    profiles,
    switchBusiness,
    unsavedWorkLabel,
    clearUnsavedWork,
    saveUnsavedWork,
  } = useAppState();
  const [open, setOpen] = useState(false);
  const [pendingBusinessId, setPendingBusinessId] = useState<string>();
  const choose = (businessId: string) => {
    if (businessId === currentBusiness.id) {
      setOpen(false);
      return;
    }
    if (unsavedWorkLabel) {
      setPendingBusinessId(businessId);
      setOpen(false);
      return;
    }
    switchBusiness(businessId);
    setOpen(false);
  };
  const completeSwitch = (save: boolean) => {
    if (save) saveUnsavedWork();
    else clearUnsavedWork();
    if (pendingBusinessId) switchBusiness(pendingBusinessId);
    setPendingBusinessId(undefined);
  };
  return (
    <>
      <button
        className="card between"
        style={{
          width: "100%",
          padding: "13px 14px",
          marginTop: 14,
          color: "var(--color-text)",
        }}
        onClick={() => setOpen(true)}
      >
        <span className="row">
          <span className="icon-box">
            <Building2 size={21} />
          </span>
          <span style={{ textAlign: "left" }}>
            <strong style={{ display: "block" }}>{currentBusiness.name}</strong>
            <span className="muted small">{currentBusiness.industry}</span>
          </span>
        </span>
        <ChevronDown size={20} />
      </button>
      {open && (
        <Modal title="Switch business" onClose={() => setOpen(false)}>
          <p>
            Each business keeps its own customers, money records, files, tools,
            and connections.
          </p>
          <div className="stack">
            {profiles.map((profile) => (
              <Button
                key={profile.id}
                variant={
                  profile.id === currentBusiness.id ? "primary" : "neutral"
                }
                wide
                onClick={() => choose(profile.id)}
              >
                {profile.name}
              </Button>
            ))}
          </div>
        </Modal>
      )}
      {pendingBusinessId && (
        <Modal
          title="Switch business?"
          onClose={() => setPendingBusinessId(undefined)}
        >
          <p>
            You have unsaved work for this business. Save before switching so
            nothing gets lost.
          </p>
          <div className="alert alert--warning">
            <strong>{unsavedWorkLabel}</strong>
          </div>
          <div className="modal-actions">
            <Button variant="primary" onClick={() => completeSwitch(true)}>
              Save &amp; Switch
            </Button>
            <Button variant="outline" onClick={() => completeSwitch(false)}>
              Switch Without Saving
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPendingBusinessId(undefined)}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
