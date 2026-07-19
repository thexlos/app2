import approvedActionGrid from "../assets/card-lab/approved-action-grid.png";
import approvedStatRow from "../assets/card-lab/approved-stat-row.png";
import {
  ReferenceDerivedActionCard,
  ReferenceDerivedStatCard,
} from "../components/card-lab-reference/ReferenceDerivedCards";
import "./card-lab-reference.css";

export function CardLabReferenceLayersScreen() {
  return (
    <main className="reference-lab-screen" data-reference-layer-lab="v2">
      <header className="reference-lab-header">
        <span>ArmaDesk • Reference-Derived Layer Lab</span>
        <h1>Actual Mockup Layers, Not Recreated SVG Artwork</h1>
        <p>
          Borders, highlights, textures, and icon/glow clusters are extracted
          directly from the approved mockup. Only the center surface and live
          text/values/arrows are code-built.
        </p>
        <code>#/card-lab-reference</code>
      </header>

      <section className="reference-lab-section">
        <div className="reference-lab-heading">
          <h2>Stat Card — Exact Reference Ratio</h2>
          <span>210 × 340 source • 0.617647 ratio</span>
        </div>

        <div className="reference-lab-approved">
          <h3>Approved target</h3>
          <img src={approvedStatRow} alt="Approved stat-card target" />
        </div>

        <div className="reference-lab-large">
          <ReferenceDerivedStatCard />
        </div>

        <div className="reference-lab-states">
          <article>
            <h3>Default</h3>
            <ReferenceDerivedStatCard />
          </article>
          <article>
            <h3>Pressed</h3>
            <ReferenceDerivedStatCard state="pressed" />
          </article>
          <article>
            <h3>Focus</h3>
            <ReferenceDerivedStatCard state="focus" />
          </article>
        </div>

        <h3>Tone layers extracted from all four approved stat cards</h3>
        <div className="reference-lab-stat-tones">
          <ReferenceDerivedStatCard tone="cyan" />
          <ReferenceDerivedStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
          <ReferenceDerivedStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
          <ReferenceDerivedStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
        </div>
      </section>

      <section className="reference-lab-section">
        <div className="reference-lab-heading">
          <h2>Quick Action — Exact Reference Ratio</h2>
          <span>283 × 167 source • 1.694611 ratio</span>
        </div>

        <div className="reference-lab-approved">
          <h3>Approved target</h3>
          <img src={approvedActionGrid} alt="Approved Quick Action target" />
        </div>

        <div className="reference-lab-large reference-lab-large--action">
          <ReferenceDerivedActionCard />
        </div>

        <div className="reference-lab-states">
          <article>
            <h3>Default</h3>
            <ReferenceDerivedActionCard />
          </article>
          <article>
            <h3>Pressed</h3>
            <ReferenceDerivedActionCard state="pressed" />
          </article>
          <article>
            <h3>Focus</h3>
            <ReferenceDerivedActionCard state="focus" />
          </article>
        </div>

        <h3>Exact icon and border layers extracted from the approved action cards</h3>
        <div className="reference-lab-action-tones">
          <ReferenceDerivedActionCard tone="cyan" />
          <ReferenceDerivedActionCard tone="green" firstLine="Create" secondLine="Invoice" />
          <ReferenceDerivedActionCard tone="purple" firstLine="Add" secondLine="Customer" />
          <ReferenceDerivedActionCard tone="orange" firstLine="Calendar" secondLine="" />
          <ReferenceDerivedActionCard tone="pink" firstLine="QR" secondLine="Code" />
          <ReferenceDerivedActionCard tone="blue" firstLine="Business" secondLine="Kit" />
        </div>
      </section>

      <section className="reference-lab-section">
        <div className="reference-lab-heading">
          <h2>Responsive Preview Frames</h2>
          <span>390px • 402px • 430px</span>
        </div>

        <div className="reference-lab-breakpoints">
          {[390, 402, 430].map((width) => (
            <article key={width} style={{ width }}>
              <header>{width}px</header>
              <div className="reference-lab-mobile-stats">
                <ReferenceDerivedStatCard tone="cyan" />
                <ReferenceDerivedStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
                <ReferenceDerivedStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
                <ReferenceDerivedStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
              </div>
              <div className="reference-lab-mobile-actions">
                <ReferenceDerivedActionCard tone="cyan" />
                <ReferenceDerivedActionCard tone="green" firstLine="Create" secondLine="Invoice" />
                <ReferenceDerivedActionCard tone="purple" firstLine="Add" secondLine="Customer" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="reference-lab-footer">
        <strong>Approval gate</strong>
        <p>
          This is the first lab using the approved mockup’s actual border,
          texture, and icon pixels as independent layers.
        </p>
      </footer>
    </main>
  );
}
