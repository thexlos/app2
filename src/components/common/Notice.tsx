import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { useAppState } from "../../state/AppState";

export function Notice() {
  const { notice, clearNotice } = useAppState();
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(clearNotice, 5000);
    return () => window.clearTimeout(timer);
  }, [notice, clearNotice]);
  if (!notice) return null;
  return (
    <div className="notice" role="status">
      <CheckCircle2 size={19} />
      {notice}
      <button aria-label="Dismiss" onClick={clearNotice}>
        <X size={18} />
      </button>
    </div>
  );
}
