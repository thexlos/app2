import { ArrowLeft, Bell, UserRound } from "lucide-react";
import { useAppState } from "../../state/AppState";

export function BrandHeader() {
  return (
    <header className="between" style={{ minHeight: 48 }}>
      <div className="row">
        <div
          className="icon-box"
          style={{
            borderRadius: 14,
            color: "white",
            background: "var(--color-primary)",
            fontWeight: 850,
          }}
        >
          SH
        </div>
        <strong>Start Here Helper</strong>
      </div>
      <div className="row" aria-label="Account controls">
        <Bell size={21} />
        <UserRound size={23} />
      </div>
    </header>
  );
}

export function DetailHeader({
  title,
  backTo,
}: {
  title: string;
  backTo: Parameters<ReturnType<typeof useAppState>["setCurrentScreen"]>[0];
}) {
  const { setCurrentScreen } = useAppState();
  return (
    <header className="row" style={{ minHeight: 54 }}>
      <button
        className="btn btn--ghost"
        aria-label="Go back"
        onClick={() => setCurrentScreen(backTo)}
      >
        <ArrowLeft />
      </button>
      <strong style={{ fontSize: "1.04rem" }}>{title}</strong>
    </header>
  );
}
