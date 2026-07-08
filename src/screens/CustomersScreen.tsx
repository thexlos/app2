import {
  BellRing,
  ChevronRight,
  FilePlus2,
  FolderPlus,
  HelpingHand,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Plus,
  Search,
  Send,
  Star,
  StickyNote,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";

export function CustomersScreen() {
  const { workspace, openCustomer, openLead, setCurrentScreen } = useAppState();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const customers = useMemo(
    () =>
      workspace.customers.filter((customer) => {
        const matchesSearch = `${customer.name} ${customer.businessName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const tagText = customer.tags
          .map((tag) => tag.label)
          .join(" ")
          .toLowerCase();
        const matchesFilter =
          filter === "All" ||
          (filter === "Leads" &&
            (customer.status === "Lead" || tagText.includes("lead"))) ||
          (filter === "Active" && customer.status !== "Lead") ||
          (filter === "Waiting Approval" &&
            tagText.includes("waiting approval")) ||
          (filter === "Needs Follow-Up" && tagText.includes("follow")) ||
          (filter === "Unpaid" &&
            (tagText.includes("unpaid") || tagText.includes("due")));
        return matchesSearch && matchesFilter;
      }),
    [workspace.customers, search, filter],
  );
  return (
    <section className="screen">
      <h1 className="page-title">Customers</h1>
      <p className="page-subtitle">
        One customer record can be used across estimates, invoices, promos,
        files, and projects.
      </p>
      <div className="section stack">
        <div className="search-wrap">
          <Search size={20} />
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers"
            aria-label="Search customers"
          />
        </div>
        <div className="customer-filters" aria-label="Customer filter">
          {[
            "All",
            "Leads",
            "Active",
            "Waiting Approval",
            "Needs Follow-Up",
            "Unpaid",
          ].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <Button
        className="section"
        variant="primary"
        wide
        icon={<Plus size={18} />}
        onClick={() => setShowAdd(true)}
      >
        Add or Import
      </Button>
      <div className="between section">
        <div>
          <h2 className="section-heading">{customers.length} customers</h2>
          <p className="section-copy">Showing this business only.</p>
        </div>
      </div>
      {filter === "Leads" ? (
        <div className="customer-card-list">
          {workspace.leads
            .filter((lead) =>
              `${lead.name} ${lead.businessName ?? ""} ${lead.interestedService ?? lead.serviceNeeded}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((lead) => (
              <article className="customer-card" key={lead.id}>
                <span className="customer-avatar">
                  {lead.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="grow">
                  <strong className="customer-card__name">{lead.name}</strong>
                  <span className="customer-card__tags">
                    <StatusBadge tone="info">{lead.status}</StatusBadge>
                  </span>
                  <span className="muted small">
                    {lead.interestedService ?? lead.serviceNeeded} ·{" "}
                    {lead.source}
                  </span>
                </span>
                <Button variant="ghost" onClick={() => openLead(lead.id)}>
                  Open Lead
                </Button>
              </article>
            ))}
        </div>
      ) : (
        <div className="customer-card-list">
          {customers.map((customer) => (
            <button
              className="customer-card"
              key={customer.id}
              onClick={() => openCustomer(customer.id)}
            >
              <span className="customer-avatar">
                {customer.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="grow">
                <strong className="customer-card__name">{customer.name}</strong>
                <span className="customer-card__tags">
                  {customer.tags.slice(0, 2).map((tag) => (
                    <StatusBadge tone={tag.tone} key={tag.id}>
                      {tag.label}
                    </StatusBadge>
                  ))}
                </span>
                <span className="muted small">
                  Last activity {customer.lastActivity}
                </span>
              </span>
              <span className="customer-card__side">
                {customer.balanceDue ? (
                  <strong>${customer.balanceDue.toLocaleString()} due</strong>
                ) : (
                  <span>{customer.status}</span>
                )}
                <ChevronRight size={20} />
              </span>
            </button>
          ))}
        </div>
      )}
      {customers.length === 0 && (
        <div
          className="card panel"
          style={{ marginTop: 18, textAlign: "center" }}
        >
          <UserRound className="muted" />
          <h2>No customers found</h2>
          <p className="muted">
            Try a different search or add the first customer for this business.
          </p>
        </div>
      )}
      {showAdd && (
        <Modal title="Add or import" onClose={() => setShowAdd(false)}>
          <p>Choose what you want to add to this business.</p>
          <div className="stack">
            <Button
              variant="primary"
              wide
              onClick={() => setCurrentScreen("add-customer")}
            >
              Add Customer
            </Button>
            <Button
              variant="outline"
              wide
              onClick={() => setCurrentScreen("add-lead")}
            >
              Add Lead
            </Button>
            <Button
              variant="neutral"
              wide
              onClick={() => setCurrentScreen("import-wizard")}
            >
              Import Customers
            </Button>
            <Button
              variant="neutral"
              wide
              onClick={() => setCurrentScreen("sync-center")}
            >
              Sync Customers
            </Button>
            <Button variant="ghost" wide onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function CustomerDetailScreen() {
  const {
    workspace,
    selectedCustomerId,
    setCurrentScreen,
    openEstimateBuilder,
    openInvoiceBuilder,
    openSchedule,
    openEstimate,
    openInvoice,
    openCreateTask,
    openHelpRequest,
    addCustomerNote,
    addFileMetadata,
    saveProject,
    showNotice,
  } = useAppState();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const customer = workspace.customers.find(
    (item) => item.id === selectedCustomerId,
  );
  if (!customer)
    return (
      <section className="screen">
        <DetailHeader title="Customer" backTo="customers" />
        <p>Customer not found in this business.</p>
      </section>
    );
  const relatedEstimates = workspace.estimates.filter(
    (item) => item.customerId === customer.id,
  );
  const relatedInvoices = workspace.invoices.filter(
    (item) => item.customerId === customer.id,
  );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Customer details" backTo="customers" />
      <div className="customer-hero">
        <div className="customer-avatar customer-avatar--large">
          {customer.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <h1 className="page-title" style={{ marginTop: 0 }}>
            {customer.name}
          </h1>
          <div className="row">
            {customer.tags.map((tag) => (
              <StatusBadge key={tag.id} tone={tag.tone}>
                {tag.label}
              </StatusBadge>
            ))}
          </div>
        </div>
      </div>
      <div className="customer-actions section">
        {[
          { label: "Call", icon: Phone },
          { label: "Text", icon: MessageSquareText },
          { label: "Email", icon: Mail },
          { label: "Add Note", icon: StickyNote },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              if (label === "Add Note") return setShowNote(true);
              const destination =
                label === "Call"
                  ? customer.phone
                    ? `tel:${customer.phone}`
                    : ""
                  : label === "Text"
                    ? customer.phone
                      ? `sms:${customer.phone}`
                      : ""
                    : customer.email
                      ? `mailto:${customer.email}`
                      : "";
              if (!destination)
                return showNotice(`${label} needs contact information first.`);
              window.location.href = destination;
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <section className="section">
        <h2 className="section-heading">Next actions</h2>
        <p className="section-copy">Reuse this customer anywhere.</p>
        <div className="action-grid" style={{ marginTop: 12 }}>
          {[
            {
              label: "New Estimate",
              icon: FilePlus2,
              screen: "money" as const,
            },
            {
              label: "New Invoice",
              icon: WalletCards,
              screen: "money" as const,
            },
            { label: "Send Promo", icon: Send, screen: "create" as const },
            {
              label: "Send Review Request",
              icon: Star,
              screen: "create" as const,
            },
            { label: "Add File", icon: Plus, screen: "file-vault" as const },
            {
              label: "Schedule Appointment",
              icon: BellRing,
              screen: "calendar" as const,
            },
            {
              label: "Create Job / Project",
              icon: FolderPlus,
              screen: "file-vault" as const,
            },
            {
              label: "Request Start Here Help",
              icon: HelpingHand,
              screen: "help" as const,
            },
            {
              label: "Sync Customer",
              icon: Send,
              screen: "sync-center" as const,
            },
            {
              label: "Export Customer",
              icon: WalletCards,
              screen: "export-center" as const,
            },
          ].map(({ label, icon: Icon, screen }) => (
            <button
              className="action-card"
              key={label}
              onClick={() =>
                label === "New Estimate"
                  ? openEstimateBuilder(customer.id)
                  : label === "New Invoice"
                    ? openInvoiceBuilder(customer.id)
                    : label === "Send Promo"
                      ? openCreateTask("Send Promotion")
                      : label === "Send Review Request"
                        ? openCreateTask("Review Booster")
                        : label === "Add File"
                          ? (addFileMetadata({
                              name: `${customer.name}-file-placeholder.mock`,
                              customerId: customer.id,
                            }),
                            setCurrentScreen("file-vault"))
                      : label === "Schedule Appointment"
                        ? openSchedule({ customerId: customer.id })
                        : label === "Create Job / Project"
                          ? setShowProject(true)
                          : label === "Request Start Here Help"
                            ? openHelpRequest("general")
                      : setCurrentScreen(screen)
              }
            >
              <span className="icon-box">
                <Icon size={20} />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="section card panel stack">
        <div className="row">
          <Phone size={18} className="muted" />
          <span>{customer.phone}</span>
        </div>
        <div className="row">
          <Mail size={18} className="muted" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="row">
          <MapPin size={18} className="muted" />
          <span>{customer.address}</span>
        </div>
      </section>
      <div className="two-column">
        <section className="section">
          <h2 className="section-heading">Money history</h2>
          <p className="section-copy">
            Estimates and invoices connected to this customer.
          </p>
          <div className="list">
            {relatedEstimates.map((estimate) => (
              <button
                className="list-row"
                key={estimate.id}
                onClick={() => openEstimate(estimate.id)}
              >
                <span className="icon-box">$</span>
                <span className="grow">
                  <strong>Estimate {estimate.number}</strong>
                  <span className="muted small" style={{ display: "block" }}>
                    {estimate.projectName}
                  </span>
                </span>
                <StatusBadge
                  tone={estimate.status === "Accepted" ? "success" : "warning"}
                >
                  {estimate.status}
                </StatusBadge>
              </button>
            ))}
            {relatedInvoices.map((invoice) => (
              <button
                className="list-row"
                key={invoice.id}
                onClick={() => openInvoice(invoice.id)}
              >
                <span className="icon-box">$</span>
                <span className="grow">
                  <strong>Invoice {invoice.number}</strong>
                  <span className="muted small" style={{ display: "block" }}>
                    ${invoice.total.toLocaleString()}
                  </span>
                </span>
                <StatusBadge
                  tone={invoice.status === "Paid" ? "success" : "danger"}
                >
                  {invoice.status}
                </StatusBadge>
              </button>
            ))}
          </div>
        </section>
        <section className="section">
          <h2 className="section-heading">Notes</h2>
          <div className="card panel stack" style={{ marginTop: 12 }}>
            {customer.notes.length ? (
              customer.notes.map((note) => (
                <div className="row" key={note}>
                  <StickyNote size={17} className="muted" />
                  <span>{note}</span>
                </div>
              ))
            ) : (
              <p className="muted">No internal notes yet.</p>
            )}
            <Button variant="outline" onClick={() => setShowNote(true)}>
              Add Note
            </Button>
          </div>
        </section>
      </div>
      <section className="section">
        <h2 className="section-heading">Projects &amp; appointments</h2>
        <div className="list">
          {workspace.projects
            .filter((item) => item.customerId === customer.id)
            .map((project) => (
              <button
                className="list-row"
                key={project.id}
                onClick={() => openSchedule({
                  customerId: customer.id,
                  projectId: project.id,
                })}
              >
                <FolderPlus />
                <span className="grow">
                  <strong>{project.name}</strong>
                  <small>{project.status}</small>
                </span>
              </button>
            ))}
          {workspace.calendarEvents
            .filter((item) => item.relatedCustomerId === customer.id)
            .map((event) => (
              <button
                className="list-row"
                key={event.id}
                onClick={() => openSchedule({ customerId: customer.id })}
              >
                <BellRing />
                <span className="grow">
                  <strong>{event.title}</strong>
                  <small>
                    {event.startDate} · {event.startTime}
                  </small>
                </span>
              </button>
            ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">Files, help &amp; activity</h2>
        <div className="customer-record-grid">
          <article className="card panel">
            <strong>Files</strong>
            <p>
              {workspace.files.filter((file) => file.customerId === customer.id)
                .length} linked files
            </p>
            <Button
              variant="outline"
              onClick={() => setCurrentScreen("file-vault")}
            >
              Open File Vault
            </Button>
          </article>
          <article className="card panel">
            <strong>Help requests</strong>
            <p>
              {
                workspace.helpRequests.filter(
                  (item) => item.attachedCustomerId === customer.id,
                ).length
              }{" "}
              linked requests
            </p>
            <Button variant="outline" onClick={() => setCurrentScreen("help")}>
              Open Help
            </Button>
          </article>
          <article className="card panel">
            <strong>Activity</strong>
            <p>
              {
                workspace.activity.filter(
                  (item) => item.relatedRecordId === customer.id,
                ).length
              }{" "}
              recent actions
            </p>
            <Button variant="outline" onClick={() => setCurrentScreen("home")}>
              View Recent Activity
            </Button>
          </article>
        </div>
      </section>
      {showNote && (
        <Modal title="Add customer note" onClose={() => setShowNote(false)}>
          <textarea
            className="textarea"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a useful customer note"
          />
          <div className="modal-actions">
            <Button
              variant="primary"
              disabled={!note.trim()}
              onClick={() => {
                addCustomerNote(customer.id, note);
                setNote("");
                setShowNote(false);
              }}
            >
              Save Note
            </Button>
            <Button variant="ghost" onClick={() => setShowNote(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      {showProject && (
        <Modal title="Add project" onClose={() => setShowProject(false)}>
          <input
            className="input"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project or job name"
          />
          <div className="modal-actions">
            <Button
              variant="primary"
              disabled={!projectName.trim()}
              onClick={() => {
                saveProject({
                  customerId: customer.id,
                  name: projectName.trim(),
                  status: "Planning",
                });
                setProjectName("");
                setShowProject(false);
              }}
            >
              Save Project
            </Button>
            <Button variant="ghost" onClick={() => setShowProject(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
