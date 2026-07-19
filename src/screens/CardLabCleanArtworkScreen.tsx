import approvedActionGrid from "../assets/card-lab/approved-action-grid.png";
import approvedStatRow from "../assets/card-lab/approved-stat-row.png";
import {
  CleanArtworkActionCard,
  CleanArtworkStatCard,
} from "../components/card-lab-artwork/CleanArtworkCards";
import "./card-lab-artwork.css";

export function CardLabCleanArtworkScreen() {
  return (
    <main className="clean-art-lab" data-clean-art-lab="v2.2">
      <header className="clean-art-lab__header">
        <span>ArmaDesk • Clean Artwork Lab v2.2</span>
        <h1>Padded Artwork Only — Codex Owns All Live Content</h1>
        <p>
          Border/reflection, texture/lighting, and icon artwork are supplied as
          padded transparent layers. Codex owns every word, number, trend,
          arrow, state, and interaction.
        </p>
        <code>#/card-lab-artwork</code>
      </header>

      <section className="clean-art-lab__section">
        <div className="clean-art-lab__heading">
          <h2>Stat Card — 20px Transparent Safety Gutter</h2>
          <span>Core 210×340 • artwork 250×380</span>
        </div>

        <div className="clean-art-lab__approved">
          <h3>Approved target</h3>
          <img src={approvedStatRow} alt="Approved stat target" />
        </div>

        <div className="clean-art-lab__large">
          <CleanArtworkStatCard />
        </div>

        <div className="clean-art-lab__states">
          <article><h3>Default</h3><CleanArtworkStatCard /></article>
          <article><h3>Pressed</h3><CleanArtworkStatCard state="pressed" /></article>
          <article><h3>Focus</h3><CleanArtworkStatCard state="focus" /></article>
        </div>

        <h3>Four approved tone sets</h3>
        <div className="clean-art-lab__stat-tones">
          <CleanArtworkStatCard tone="cyan" />
          <CleanArtworkStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
          <CleanArtworkStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
          <CleanArtworkStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
        </div>
      </section>

      <section className="clean-art-lab__section">
        <div className="clean-art-lab__heading">
          <h2>Quick Action — 22px Transparent Safety Gutter</h2>
          <span>Core 283×167 • artwork 327×211</span>
        </div>

        <div className="clean-art-lab__approved">
          <h3>Approved target</h3>
          <img src={approvedActionGrid} alt="Approved action target" />
        </div>

        <div className="clean-art-lab__large clean-art-lab__large--action">
          <CleanArtworkActionCard />
        </div>

        <div className="clean-art-lab__states">
          <article><h3>Default</h3><CleanArtworkActionCard /></article>
          <article><h3>Pressed</h3><CleanArtworkActionCard state="pressed" /></article>
          <article><h3>Focus</h3><CleanArtworkActionCard state="focus" /></article>
        </div>

        <h3>Six approved icon-artwork sets with live Codex labels/arrows</h3>
        <div className="clean-art-lab__action-tones">
          <CleanArtworkActionCard tone="cyan" />
          <CleanArtworkActionCard tone="green" firstLine="Create" secondLine="Invoice" />
          <CleanArtworkActionCard tone="purple" firstLine="Add" secondLine="Customer" />
          <CleanArtworkActionCard tone="orange" firstLine="Calendar" secondLine="" />
          <CleanArtworkActionCard tone="pink" firstLine="QR" secondLine="Code" />
          <CleanArtworkActionCard tone="blue" firstLine="Business" secondLine="Kit" />
        </div>
      </section>

      <section className="clean-art-lab__section">
        <div className="clean-art-lab__heading">
          <h2>Responsive Preview Frames</h2>
          <span>390px • 402px • 430px</span>
        </div>

        <div className="clean-art-lab__breakpoints">
          {[390, 402, 430].map((width) => (
            <article key={width} style={{ width }}>
              <header>{width}px</header>
              <div className="clean-art-lab__mobile-stats">
                <CleanArtworkStatCard tone="cyan" />
                <CleanArtworkStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
                <CleanArtworkStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
                <CleanArtworkStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
              </div>
              <div className="clean-art-lab__mobile-actions">
                <CleanArtworkActionCard tone="cyan" />
                <CleanArtworkActionCard tone="green" firstLine="Create" secondLine="Invoice" />
                <CleanArtworkActionCard tone="purple" firstLine="Add" secondLine="Customer" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="clean-art-lab__footer">
        <strong>Approval gate</strong>
        <p>
          Artwork edges are padded and transparent. All live UI content is
          rendered separately by Codex.
        </p>
      </footer>
    </main>
  );
}
