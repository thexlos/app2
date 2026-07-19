import type { ReactNode } from "react";
import type { PremiumTone } from "./premiumTypes";
import "./premiumCardSystem.css";

export function PremiumShellLayers() {
  return (
    <span className="premium-shell__layers" aria-hidden="true">
      <span className="premium-shell__surface" />
      <span className="premium-shell__sheen" />
      <span className="premium-shell__edge premium-shell__edge--top" />
      <span className="premium-shell__edge premium-shell__edge--right" />
      <span className="premium-shell__edge premium-shell__edge--bottom" />
      <span className="premium-shell__corner premium-shell__corner--tl" />
      <span className="premium-shell__corner premium-shell__corner--tr" />
      <span className="premium-shell__corner premium-shell__corner--bl" />
      <span className="premium-shell__corner premium-shell__corner--br" />
      <span className="premium-shell__glow" />
    </span>
  );
}

export function PremiumIconWell({
  tone,
  className = "",
  children,
}: {
  tone: PremiumTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`premium-icon-well premium-tone-${tone} ${className}`.trim()}>
      <span className="premium-icon-well__surface" aria-hidden="true" />
      <span className="premium-icon-well__ring" aria-hidden="true" />
      <span className="premium-icon-well__content">{children}</span>
    </span>
  );
}
