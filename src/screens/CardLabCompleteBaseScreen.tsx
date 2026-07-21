import approvedActionGrid from "../assets/card-lab/approved-action-grid.png";
import approvedStatRow from "../assets/card-lab/approved-stat-row.png";
import {
  CompleteBaseActionCard,
  CompleteBaseStatCard,
} from "../components/card-lab-complete-base/CompleteBaseCards";
import "./card-lab-complete-base.css";

export function CardLabCompleteBaseScreen() {
  return (
    <main className="complete-base-lab" data-complete-base-lab="v3">
      <header className="complete-base-lab__header">
        <span>ArmaDesk • Complete Blank Base Lab v3</span>
        <h1>Whole Card Artwork — Only Text and Arrows Are Live</h1>
        <p>
          Each supplied base contains the complete border, full glow, texture and
          icon. Original wording, values, trends and arrows were removed before
          packaging. Codex renders all live content separately.
        </p>
        <code>#/card-lab-complete-base</code>
      </header>

      <section className="complete-base-lab__section">
        <div className="complete-base-lab__heading">
          <h2>Stat Card — Complete Blank Base</h2>
          <span>Core 210×340 • base 270×400 • 30px gutter</span>
        </div>

        <div className="complete-base-lab__approved">
          <h3>Approved target</h3>
          <img src={approvedStatRow} alt="Approved stat target" />
        </div>

        <div className="complete-base-lab__large">
          <CompleteBaseStatCard />
        </div>

        <div className="complete-base-lab__states">
          <article><h3>Default</h3><CompleteBaseStatCard /></article>
          <article><h3>Pressed</h3><CompleteBaseStatCard state="pressed" /></article>
          <article><h3>Focus</h3><CompleteBaseStatCard state="focus" /></article>
        </div>

        <h3>Four complete stat bases</h3>
        <div className="complete-base-lab__stat-tones">
          <CompleteBaseStatCard tone="cyan" />
          <CompleteBaseStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
          <CompleteBaseStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
          <CompleteBaseStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
        </div>
      </section>

      <section className="complete-base-lab__section">
        <div className="complete-base-lab__heading">
          <h2>Quick Action — Complete Blank Base</h2>
          <span>Core 283×167 • base 343×227 • 30px gutter</span>
        </div>

        <div className="complete-base-lab__approved">
          <h3>Approved target</h3>
          <img src={approvedActionGrid} alt="Approved action target" />
        </div>

        <div className="complete-base-lab__large complete-base-lab__large--action">
          <CompleteBaseActionCard />
        </div>

        <div className="complete-base-lab__states">
          <article><h3>Default</h3><CompleteBaseActionCard /></article>
          <article><h3>Pressed</h3><CompleteBaseActionCard state="pressed" /></article>
          <article><h3>Focus</h3><CompleteBaseActionCard state="focus" /></article>
        </div>

        <h3>Six complete action bases with live labels and arrows</h3>
        <div className="complete-base-lab__action-tones">
          <CompleteBaseActionCard tone="cyan" />
          <CompleteBaseActionCard tone="green" firstLine="Create" secondLine="Invoice" />
          <CompleteBaseActionCard tone="purple" firstLine="Add" secondLine="Customer" />
          <CompleteBaseActionCard tone="orange" firstLine="Calendar" secondLine="" />
          <CompleteBaseActionCard tone="pink" firstLine="QR" secondLine="Code" />
          <CompleteBaseActionCard tone="blue" firstLine="Business" secondLine="Kit" />
        </div>
      </section>

      <section className="complete-base-lab__section">
        <div className="complete-base-lab__heading">
          <h2>Responsive Preview Frames</h2>
          <span>390px • 402px • 430px</span>
        </div>

        <div className="complete-base-lab__breakpoints">
          {[390, 402, 430].map((width) => (
            <article key={width} style={{ width }}>
              <header>{width}px</header>
              <div className="complete-base-lab__mobile-stats">
                <CompleteBaseStatCard tone="cyan" />
                <CompleteBaseStatCard tone="green" label="Invoices" value="8" trend="↑ 2 paid" />
                <CompleteBaseStatCard tone="purple" label="Customers" value="142" trend="↑ 6 this week" />
                <CompleteBaseStatCard tone="orange" label="Tasks" value="5" trend="↑ 2 due today" />
              </div>
              <div className="complete-base-lab__mobile-actions">
                <CompleteBaseActionCard tone="cyan" />
                <CompleteBaseActionCard tone="green" firstLine="Create" secondLine="Invoice" />
                <CompleteBaseActionCard tone="purple" firstLine="Add" secondLine="Customer" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="complete-base-lab__footer">
        <strong>Approval gate</strong>
        <p>
          Inspect complete borders, corners, glows and icons before any Home integration.
        </p>
      </footer>
    </main>
  );
}
