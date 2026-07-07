import { Check, Circle, Link2, SkipForward, Sparkles } from "lucide-react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { useAppState } from "../state/AppState";

export function SetupScreen() {
  const { currentBusiness, workspace, setCurrentScreen } = useAppState();
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Business setup" backTo="home" />
      <div className="section">
        <h1 className="page-title">
          Your business is {currentBusiness.setupPercent}% ready.
        </h1>
        <p className="page-subtitle">
          Set this up once so invoices, flyers, QR codes, and posts can fill in
          automatically. Skip anything and come back later.
        </p>
      </div>
      <div className="setup-progress section">
        <div style={{ width: `${currentBusiness.setupPercent}%` }} />
      </div>
      <div className="setup-list section">
        {workspace.setupTasks.map((task) => (
          <button key={task.id} className="list-row">
            <span
              className={
                task.complete ? "setup-check setup-check--done" : "setup-check"
              }
            >
              {task.complete ? <Check size={18} /> : <Circle size={18} />}
            </span>
            <span className="grow">
              <strong>{task.label}</strong>
              {task.optional && (
                <small
                  className="muted"
                  style={{ display: "block", marginTop: 4 }}
                >
                  Optional
                </small>
              )}
            </span>
            <span className="muted">{task.complete ? "Done" : "Set up"}</span>
          </button>
        ))}
      </div>
      <div className="stack section">
        <Button
          variant="primary"
          wide
          icon={<Sparkles size={19} />}
          onClick={() => setCurrentScreen("business-kits")}
        >
          Choose a Business Kit
        </Button>
        <Button
          variant="outline"
          wide
          icon={<Link2 size={19} />}
          onClick={() => setCurrentScreen("integrations")}
        >
          Connected Accounts
        </Button>
        <Button
          variant="ghost"
          wide
          icon={<SkipForward size={18} />}
          onClick={() => setCurrentScreen("home")}
        >
          Skip for now
        </Button>
      </div>
    </section>
  );
}
