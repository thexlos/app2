import { Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { globalStarterLibrary } from "../data/mock/globalStarterLibrary";
import { useAppState } from "../state/AppState";

export function GlobalLibraryScreen() {
  const { currentBusiness, saveGlobalLibraryItem } = useAppState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const results = useMemo(
    () =>
      globalStarterLibrary.filter(
        (item) =>
          (filter === "All" || item.libraryType === filter) &&
          `${item.title} ${item.description} ${item.category} ${item.industryTags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, filter],
  );
  const add = (item: (typeof globalStarterLibrary)[number], save: boolean) => {
    if (save) saveGlobalLibraryItem(item);
    setMessage(
      save
        ? `${item.title} saved to ${currentBusiness.name} My Business Kit.`
        : `${item.title} will be used only this time.`,
    );
  };
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Search All Options" backTo="my-business-kit" />
      <div className="section">
        <h1 className="page-title">Search All Options</h1>
        <p className="page-subtitle">
          Find common business items, templates, terms, and forms from any
          industry.
        </p>
      </div>
      <div className="library-toolbar section">
        <div className="search-wrap">
          <Search size={20} />
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services, products, fees, categories, or templates"
          />
        </div>
        <select
          className="select"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All</option>
          {[
            ...new Set(globalStarterLibrary.map((entry) => entry.libraryType)),
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {message && (
        <div className="alert alert--success section">
          <strong>{message}</strong>
        </div>
      )}
      <div className="global-library-list section">
        {results.map((item) => (
          <article key={item.id}>
            <div className="global-library-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <small>
                {item.libraryType} · {item.category} ·{" "}
                {item.industryTags.join(", ")}
              </small>
            </div>
            <div>
              <strong>
                {item.defaultRate
                  ? item.defaultRate.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })
                  : "Reusable text"}
              </strong>
              <Button
                variant="primary"
                icon={<Plus size={15} />}
                onClick={() => add(item, true)}
              >
                Save to My Business Kit
              </Button>
              <Button variant="ghost" onClick={() => add(item, false)}>
                Use Only This Time
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
