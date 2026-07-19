import approvedActionGrid from "../assets/card-lab/approved-action-grid.png";
import approvedStatRow from "../assets/card-lab/approved-stat-row.png";
import {
  CardLabActionCard,
  CardLabStatCard,
} from "../components/card-lab/CardLabPrototypes";
import "./card-lab.css";

export function CardLabScreen() {
  return (
    <main className="card-lab-screen">
      <header className="card-lab-header">
        <span>ArmaDesk</span>
        <h1>Isolated Premium Card Lab</h1>
        <p>
          Review these components before any Home-screen integration. Home and
          the Hero are untouched.
        </p>
        <code>#/card-lab</code>
      </header>

      <section className="card-lab-section">
        <div className="card-lab-section__heading">
          <div>
            <span>01</span>
            <h2>Stat Card — Working Prototype</h2>
          </div>
          <p>Inline SVG frame • non-scaling strokes • live content</p>
        </div>

        <div className="card-lab-reference">
          <h3>Approved target</h3>
          <img src={approvedStatRow} alt="Approved premium stat-card reference" />
        </div>

        <div className="card-lab-large-preview">
          <CardLabStatCard />
        </div>

        <div className="card-lab-state-grid">
          <article>
            <h3>Default</h3>
            <CardLabStatCard compact />
          </article>
          <article>
            <h3>Pressed</h3>
            <CardLabStatCard state="pressed" compact />
          </article>
          <article>
            <h3>Focus</h3>
            <CardLabStatCard state="focus" compact />
          </article>
        </div>

        <h3 className="card-lab-subheading">Tone variations</h3>
        <div className="card-lab-tone-grid card-lab-tone-grid--stats">
          <CardLabStatCard tone="cyan" compact />
          <CardLabStatCard tone="green" compact />
          <CardLabStatCard tone="purple" compact />
          <CardLabStatCard tone="orange" compact />
        </div>
      </section>

      <section className="card-lab-section">
        <div className="card-lab-section__heading">
          <div>
            <span>02</span>
            <h2>Quick Action — Working Prototype</h2>
          </div>
          <p>Live icon • live label • live arrow</p>
        </div>

        <div className="card-lab-reference">
          <h3>Approved target</h3>
          <img
            src={approvedActionGrid}
            alt="Approved premium Quick Action reference"
          />
        </div>

        <div className="card-lab-large-preview card-lab-large-preview--action">
          <CardLabActionCard />
        </div>

        <div className="card-lab-state-grid">
          <article>
            <h3>Default</h3>
            <CardLabActionCard />
          </article>
          <article>
            <h3>Pressed</h3>
            <CardLabActionCard state="pressed" />
          </article>
          <article>
            <h3>Focus</h3>
            <CardLabActionCard state="focus" />
          </article>
        </div>

        <h3 className="card-lab-subheading">Tone variations</h3>
        <div className="card-lab-tone-grid card-lab-tone-grid--actions">
          <CardLabActionCard tone="cyan" />
          <CardLabActionCard tone="green" />
          <CardLabActionCard tone="purple" />
          <CardLabActionCard tone="orange" />
        </div>
      </section>

      <section className="card-lab-section card-lab-section--breakpoints">
        <div className="card-lab-section__heading">
          <div>
            <span>03</span>
            <h2>Responsive Preview Frames</h2>
          </div>
          <p>390px • 402px • 430px</p>
        </div>

        <div className="card-lab-breakpoint-grid">
          {[390, 402, 430].map((width) => (
            <article key={width} style={{ width }}>
              <header>{width}px</header>
              <div className="card-lab-mobile-row">
                <CardLabStatCard tone="cyan" compact />
                <CardLabStatCard tone="green" compact />
                <CardLabStatCard tone="purple" compact />
                <CardLabStatCard tone="orange" compact />
              </div>
              <div className="card-lab-mobile-actions">
                <CardLabActionCard tone="cyan" />
                <CardLabActionCard tone="green" />
                <CardLabActionCard tone="purple" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="card-lab-footer">
        <strong>Approval gate</strong>
        <p>
          Do not integrate these into Home until the shape, rim lighting, icon
          well, typography, spacing and states are approved.
        </p>
      </footer>
    </main>
  );
}
