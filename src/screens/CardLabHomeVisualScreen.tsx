import { useState } from "react";

import approvedCardGrid from "../assets/card-home-visual-v2/reference/approved_card_grid_reference.png";
import contactSheet from "../assets/card-home-visual-v2/reference/transparent_asset_contact_sheet.png";
import {
  ApprovalActionCard,
  ApprovalStatCard,
  type ApprovalActionLabel,
  type ApprovalStatLabel,
} from "../components/card-lab-home-visual/HomeVisualApprovalCards";
import "./card-lab-home-visual.css";

const stats: Array<{
  label: ApprovalStatLabel;
  value: string;
  trend: string;
}> = [
  { label: "Estimates", value: "4", trend: "↑ 3 today" },
  { label: "Invoices", value: "2", trend: "↑ 2 paid" },
  { label: "Customers", value: "3", trend: "↑ 6 this week" },
  { label: "Tasks", value: "4", trend: "↑ 2 due today" },
];

const actions: ApprovalActionLabel[] = [
  "Create Estimate",
  "Create Invoice",
  "Add Customer",
  "Calendar",
  "QR Code",
  "Business Kit",
];

const previewWidths = [390, 402, 430] as const;

export function CardLabHomeVisualScreen() {
  const [previewWidth, setPreviewWidth] = useState<(typeof previewWidths)[number]>(390);
  const [lastAction, setLastAction] = useState("Nothing selected yet");

  return (
    <main className="home-visual-lab" data-home-visual-lab="v2">
      <header className="home-visual-lab__header">
        <span>ArmaDesk • Isolated Visual Approval Lab</span>
        <h1>Home Card Artwork — Not Integrated Into Home</h1>
        <p>
          This route is separate from the app shell. The supplied PNGs stay intact,
          while all labels, numbers, trends, arrows, focus states and clicks remain
          live code for visual approval.
        </p>
        <div className="home-visual-lab__header-actions">
          <code>#/card-lab-home-visual</code>
          <a href="#/">Return to app Home</a>
        </div>
      </header>

      <section className="home-visual-lab__section" aria-labelledby="approval-preview-title">
        <div className="home-visual-lab__heading">
          <div>
            <span>Working preview</span>
            <h2 id="approval-preview-title">Live phone-width card grid</h2>
          </div>
          <div className="home-visual-lab__widths" aria-label="Preview width">
            {previewWidths.map((width) => (
              <button
                key={width}
                type="button"
                className={previewWidth === width ? "is-active" : undefined}
                aria-pressed={previewWidth === width}
                onClick={() => setPreviewWidth(width)}
              >
                {width}px
              </button>
            ))}
          </div>
        </div>

        <div className="home-visual-lab__stage">
          <div
            className="home-visual-lab__phone-preview"
            style={{ width: previewWidth }}
            data-preview-width={previewWidth}
          >
            <section aria-label="Stat card approval row">
              <h3>Stats</h3>
              <div className="home-visual-lab__stat-grid">
                {stats.map((stat) => (
                  <ApprovalStatCard
                    key={stat.label}
                    {...stat}
                    onClick={() => setLastAction(`${stat.label} selected`)}
                  />
                ))}
              </div>
            </section>

            <section aria-label="Quick Action approval grid">
              <h3>Quick Actions</h3>
              <div className="home-visual-lab__action-grid">
                {actions.map((label) => (
                  <ApprovalActionCard
                    key={label}
                    label={label}
                    onClick={() => setLastAction(`${label} selected`)}
                  />
                ))}
              </div>
            </section>

            <output className="home-visual-lab__result" aria-live="polite">
              {lastAction}
            </output>
          </div>
        </div>
      </section>

      <section className="home-visual-lab__section" aria-labelledby="states-title">
        <div className="home-visual-lab__heading">
          <div>
            <span>Interaction check</span>
            <h2 id="states-title">Default, pressed, and focus states</h2>
          </div>
        </div>
        <div className="home-visual-lab__states">
          <article>
            <h3>Default</h3>
            <ApprovalActionCard label="Create Estimate" />
          </article>
          <article>
            <h3>Pressed</h3>
            <ApprovalActionCard label="Create Estimate" state="pressed" />
          </article>
          <article>
            <h3>Focus</h3>
            <ApprovalActionCard label="Create Estimate" state="focus" />
          </article>
        </div>
      </section>

      <section className="home-visual-lab__section" aria-labelledby="references-title">
        <div className="home-visual-lab__heading">
          <div>
            <span>Supplied references</span>
            <h2 id="references-title">Visual comparison only</h2>
          </div>
        </div>
        <div className="home-visual-lab__references">
          <figure>
            <img src={approvedCardGrid} alt="Approved ArmaDesk card grid reference" />
            <figcaption>Approved grid reference</figcaption>
          </figure>
          <figure>
            <img src={contactSheet} alt="Transparent ArmaDesk card asset contact sheet" />
            <figcaption>Transparent individual asset contact sheet</figcaption>
          </figure>
        </div>
      </section>

      <footer className="home-visual-lab__footer">
        <strong>Approval gate</strong>
        <p>No artwork from this page is connected to the real Home screen.</p>
      </footer>
    </main>
  );
}
