import {
  CalendarDays,
  FilePlus2,
  ReceiptText,
  Star,
  UserRoundPlus,
} from "lucide-react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PremiumHomeCardSections } from "../src/components/home/premium/PremiumHomeCardSections";

describe("PremiumHomeCardSections", () => {
  it("renders the locked component counts", () => {
    const { container } = render(
      <PremiumHomeCardSections
        stats={[
          { label: "Estimates", value: 4, trend: "↑ 3 today", icon: FilePlus2, tone: "cyan", onClick: () => undefined },
          { label: "Invoices", value: 2, trend: "↑ 2 paid", icon: ReceiptText, tone: "green", onClick: () => undefined },
          { label: "Customers", value: 3, trend: "↑ 6 this week", icon: UserRoundPlus, tone: "purple", onClick: () => undefined },
          { label: "Tasks", value: 4, trend: "↑ 2 due today", icon: CalendarDays, tone: "orange", onClick: () => undefined },
        ]}
        actions={Array.from({ length: 6 }, (_, index) => ({
          label: `Action ${index + 1}`,
          icon: FilePlus2,
          tone: "cyan" as const,
          onClick: () => undefined,
        }))}
        schedule={{
          month: "JUL",
          day: "13",
          weekday: "MON",
          title: "Site Visit",
          detail: "10:00 AM • 123 Main St",
          status: "Upcoming",
          extra: "1 more event",
          onClick: () => undefined,
        }}
        suggestions={[
          { id: "one", title: "Send 2 pending estimates", subtitle: "Worth $4,250", icon: Star, tone: "cyan", onClick: () => undefined },
          { id: "two", title: "Follow up with 3 recent leads", subtitle: "High opportunity", icon: UserRoundPlus, tone: "purple", onClick: () => undefined },
        ]}
        onSeeAllActions={() => undefined}
        onViewCalendar={() => undefined}
      />,
    );

    expect(container.querySelectorAll(".premium-card--stat")).toHaveLength(4);
    expect(container.querySelectorAll(".premium-card--action")).toHaveLength(6);
    expect(container.querySelectorAll(".premium-card--schedule")).toHaveLength(1);
    expect(container.querySelectorAll(".premium-card--suggestion")).toHaveLength(2);
  });
});
