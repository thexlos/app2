import { FilePlus2 } from "lucide-react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PremiumStatCard } from "../src/components/home/premium/PremiumStatCard";
import { PremiumActionCard } from "../src/components/home/premium/PremiumActionCard";

describe("ArmaDesk exact layered premium cards", () => {
  it("renders fixed shell layers and live stat content", () => {
    const onClick = vi.fn();
    const { container } = render(
      <PremiumStatCard
        label="Estimates"
        value={12}
        trend="↑ 3 today"
        icon={FilePlus2}
        tone="cyan"
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Estimates")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(container.querySelectorAll(".premium-shell__corner")).toHaveLength(4);
    expect(container.querySelectorAll(".premium-shell__edge")).toHaveLength(3);
  });

  it("keeps Quick Action text and arrow as live elements", () => {
    const { container } = render(
      <PremiumActionCard
        label="Create Estimate"
        icon={FilePlus2}
        tone="cyan"
        onClick={() => undefined}
      />,
    );

    expect(screen.getByText("Create Estimate")).toBeTruthy();
    expect(container.querySelector(".premium-action__arrow")).toBeTruthy();
  });
});
