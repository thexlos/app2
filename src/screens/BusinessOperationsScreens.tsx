import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Upload,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { useAppState } from "../state/AppState";
import type { CalendarEvent } from "../types/models";

const importTypes = [
  "Customers",
  "Leads",
  "Projects",
  "Items / Services",
  "Prices",
  "Appointments",
  "Mixed spreadsheet",
];

export function ImportWizardScreen() {
  const { currentBusiness, completeMockImport, setCurrentScreen } =
    useAppState();
  const [step, setStep] = useState(1);
  const [recordType, setRecordType] = useState("Customers");
  const [fileName, setFileName] = useState("");
  const [complete, setComplete] = useState(false);
  const columns =
    recordType === "Items / Services"
      ? [
          ["Item", "Item name"],
          ["Description", "Customer description"],
          ["Category", "Item category"],
          ["Price", "Default rate"],
        ]
      : [
          ["Name", recordType === "Leads" ? "Lead name" : "Customer name"],
          ["Company", "Business name"],
          ["Phone", "Phone"],
          ["Email", "Email"],
          ["Address", "Billing address"],
        ];
  const finish = () => {
    completeMockImport(recordType, fileName || "sample-import.csv");
    setComplete(true);
  };
  if (complete)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Import complete" backTo="customers" />
        <div className="guided-step section">
          <span>Import summary</span>
          <div className="icon-box icon-box--success">
            <CheckCircle2 />
          </div>
          <h1>3 records imported</h1>
          <p>
            One possible duplicate was kept in review. No external account was
            changed.
          </p>
          <Button
            variant="primary"
            wide
            onClick={() => setCurrentScreen("sync-center")}
          >
            Review Duplicates
          </Button>
          <Button
            variant="outline"
            wide
            onClick={() => setCurrentScreen("customers")}
          >
            View {recordType}
          </Button>
          <Button
            variant="ghost"
            wide
            onClick={() => setCurrentScreen("export-center")}
          >
            Export Updated List
          </Button>
        </div>
      </section>
    );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Import Data" backTo="customers" />
      <div className="section">
        <h1 className="page-title">Import Wizard</h1>
        <p className="page-subtitle">
          Bring existing business information into {currentBusiness.name}{" "}
          without creating duplicates.
        </p>
      </div>
      <div className="wizard-progress section">
        <div style={{ width: `${(step / 6) * 100}%` }} />
      </div>
      <section className="card panel section stack">
        {step === 1 && (
          <>
            <h2>1. What are you importing?</h2>
            <div className="operation-choice-grid">
              {importTypes.map((type) => (
                <button
                  key={type}
                  className={recordType === type ? "active" : ""}
                  onClick={() => setRecordType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>2. Upload your file</h2>
            <p className="muted">
              Supported: Excel .xlsx and CSV .csv. Google Sheets and pasted
              tables remain clear placeholders.
            </p>
            <label className="builder-upload">
              <span>{fileName || "Choose an Excel or CSV file"}</span>
              <strong>Browse</strong>
              <input
                className="visually-hidden"
                type="file"
                accept=".csv,.xlsx"
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? "")
                }
              />
            </label>
            <div className="operation-choice-grid">
              <button disabled>Google Sheets — placeholder</button>
              <button disabled>Paste table — placeholder</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2>3. Preview detected columns</h2>
            <div className="import-preview-table">
              <strong>Detected column</strong>
              <strong>Sample value</strong>
              {columns.map(([column], index) => (
                <>
                  <span key={`${column}-name`}>{column}</span>
                  <span key={`${column}-sample`}>
                    {
                      [
                        "Sample Customer",
                        "Sample Company",
                        "(401) 555-0100",
                        "sample@example.com",
                        "100 Main Street",
                      ][index]
                    }
                  </span>
                </>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2>4. Map columns</h2>
            <p className="muted">
              Confirm where each spreadsheet column belongs.
            </p>
            {columns.map(([source, target]) => (
              <div className="import-map-row" key={source}>
                <strong>{source}</strong>
                <ChevronRight />
                <select className="select" defaultValue={target}>
                  <option>{target}</option>
                  <option>Do not import</option>
                </select>
              </div>
            ))}
          </>
        )}
        {step === 5 && (
          <>
            <h2>5. Review duplicates</h2>
            <div className="alert alert--warning">
              <AlertTriangle />
              <div>
                <strong>1 possible duplicate</strong>
                <div className="small">
                  The email and phone match an existing record. Default action:
                  Link to Existing.
                </div>
              </div>
            </div>
            <div className="operation-choice-grid">
              <button className="active">Link to Existing</button>
              <button>Update Existing</button>
              <button>Keep Separate</button>
              <button>Skip</button>
            </div>
          </>
        )}
        {step === 6 && (
          <>
            <h2>6. Import summary</h2>
            <dl className="operation-summary">
              <div>
                <dt>Ready to import</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Possible duplicate</dt>
                <dd>1</dd>
              </div>
              <div>
                <dt>Business</dt>
                <dd>{currentBusiness.name}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{fileName || "sample-import.csv"}</dd>
              </div>
            </dl>
          </>
        )}
        <div className="modal-actions">
          {step > 1 && (
            <Button variant="neutral" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 6 ? (
            <Button
              variant="primary"
              disabled={step === 2 && !fileName}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={<Upload size={17} />}
              onClick={finish}
            >
              Import Selected Records
            </Button>
          )}
          <Button variant="ghost" onClick={() => setCurrentScreen("customers")}>
            Cancel
          </Button>
        </div>
      </section>
    </section>
  );
}

export function SyncCenterScreen() {
  const { currentBusiness, workspace, setCurrentScreen } = useAppState();
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<"duplicate" | "conflict">();
  const queue = [
    {
      name: workspace.customers[0]?.name,
      type: "Updated customer",
      source: "Start Here Helper",
      target: "QuickBooks",
      status: "Needs Sync",
    },
    {
      name: workspace.itemBank[0]?.name,
      type: "New item bank item",
      source: "Start Here Helper",
      target: "QuickBooks",
      status: "Ready to Sync",
    },
    {
      name: workspace.leads[0]?.name,
      type: "Lead converted to customer",
      source: "Lead Form",
      target: "QuickBooks",
      status: "Possible Duplicate",
    },
    {
      name: workspace.customers[1]?.name,
      type: "Customer contact",
      source: "QuickBooks",
      target: "Start Here Helper",
      status: "Conflict",
    },
  ];
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Ready to Sync" backTo="integrations" />
      <div className="section">
        <h1 className="page-title">Ready to Sync</h1>
        <p className="page-subtitle">
          Review accounting-ready changes for {currentBusiness.name}. No live
          sync runs in this build.
        </p>
      </div>
      <div className="alert alert--warning section">
        <RefreshCw />
        <div>
          <strong>QuickBooks placeholder</strong>
          <div className="small">
            Review, duplicate protection, and conflict choices are modeled. Real
            credentials are not connected.
          </div>
        </div>
      </div>
      {message && (
        <div className="alert alert--success section">
          <strong>{message}</strong>
        </div>
      )}
      <div className="sync-queue section">
        {queue.map((item) => (
          <article className="card panel" key={`${item.type}-${item.name}`}>
            <div className="between">
              <div>
                <strong>{item.name}</strong>
                <p>{item.type}</p>
              </div>
              <StatusBadge tone={statusTone(item.status)}>
                {item.status}
              </StatusBadge>
            </div>
            <small>
              {item.source} → {item.target}
            </small>
            {item.status === "Possible Duplicate" && (
              <Button
                variant="outline"
                wide
                onClick={() => setReview("duplicate")}
              >
                Review Duplicate
              </Button>
            )}
            {item.status === "Conflict" && (
              <Button
                variant="outline"
                wide
                onClick={() => setReview("conflict")}
              >
                Review Conflict
              </Button>
            )}
          </article>
        ))}
      </div>
      <div className="contract-actions section">
        <Button
          variant="primary"
          onClick={() =>
            setMessage(
              "Safe records marked synced in mock history. No external records changed.",
            )
          }
        >
          Sync Everything Safe
        </Button>
        <Button
          variant="outline"
          onClick={() => setMessage("Selected records reviewed and queued.")}
        >
          Sync Selected
        </Button>
        <Button
          variant="neutral"
          onClick={() => setCurrentScreen("export-center")}
        >
          Export to Excel/CSV
        </Button>
      </div>
      {review === "duplicate" && (
        <Modal
          title="Possible duplicate found"
          onClose={() => setReview(undefined)}
        >
          <p>This may already exist in QuickBooks. What do you want to do?</p>
          <div className="stack">
            <Button
              variant="primary"
              onClick={() => {
                setMessage(
                  "Linked to the existing record. No duplicate was created.",
                );
                setReview(undefined);
              }}
            >
              Link to Existing
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMessage("Existing record queued for review before update.");
                setReview(undefined);
              }}
            >
              Update Existing
            </Button>
            <Button variant="neutral" onClick={() => setReview(undefined)}>
              Keep Separate
            </Button>
            <Button variant="ghost" onClick={() => setReview(undefined)}>
              Skip
            </Button>
          </div>
        </Modal>
      )}
      {review === "conflict" && (
        <Modal title="Sync conflict" onClose={() => setReview(undefined)}>
          <p>
            This record changed in Start Here Helper and QuickBooks. Choose
            which version to keep.
          </p>
          <div className="conflict-values">
            <div>
              <strong>Start Here</strong>
              <p>(401) 555-0111</p>
            </div>
            <div>
              <strong>QuickBooks</strong>
              <p>(401) 555-0222</p>
            </div>
          </div>
          <div className="stack">
            <Button
              variant="primary"
              onClick={() => {
                setMessage("Start Here version selected for review.");
                setReview(undefined);
              }}
            >
              Keep Start Here Version
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMessage("QuickBooks version selected for review.");
                setReview(undefined);
              }}
            >
              Use QuickBooks Version
            </Button>
            <Button
              variant="neutral"
              onClick={() => {
                setMessage("Manual field merge opened in mock mode.");
                setReview(undefined);
              }}
            >
              Merge Manually
            </Button>
            <Button variant="ghost" onClick={() => setReview(undefined)}>
              Decide Later
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function ExportCenterScreen() {
  const { workspace, recordExport, setCurrentScreen } = useAppState();
  const [exportType, setExportType] = useState("Full customer list");
  const [format, setFormat] = useState<"CSV" | "Excel">("CSV");
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const options = [
    "Full customer list",
    "Changes since last import",
    "New customers",
    "Updated customers",
    "New leads",
    "Converted leads",
    "Projects / jobs",
    "Item & Service Bank",
    "Appointments",
    "Invoice summary",
    "Estimate summary",
  ];
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Export Updates" backTo="integrations" />
      <div className="section">
        <h1 className="page-title">Export Updates</h1>
        <p className="page-subtitle">
          Download business data with app record IDs, source, status, and
          last-updated details.
        </p>
      </div>
      {done && (
        <div className="alert alert--success section">
          <CheckCircle2 />
          <strong>Export added to this business’s export history.</strong>
        </div>
      )}
      <section className="card panel section stack">
        <div className="field">
          <label>What do you want to export?</label>
          <select
            className="select"
            value={exportType}
            onChange={(event) => setExportType(event.target.value)}
          >
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <fieldset className="help-question">
          <legend>File type</legend>
          <div className="help-choice-grid">
            {(["CSV", "Excel"] as const).map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="format"
                  checked={format === type}
                  onChange={() => setFormat(type)}
                />{" "}
                {type === "CSV" ? "CSV .csv" : "Excel .xlsx"}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="alert alert--info">
          <FileSpreadsheet />
          <div>
            <strong>{exportType}</strong>
            <div className="small">
              {exportType.includes("Item")
                ? workspace.itemBank.length
                : workspace.customers.length}{" "}
              current records ready.
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          wide
          icon={<Download size={17} />}
          onClick={() => setConfirm(true)}
        >
          Prepare Export
        </Button>
      </section>
      <section className="section">
        <h2 className="section-heading">Export history</h2>
        <div className="list">
          {workspace.exportHistory.map((item) => (
            <div className="list-row" key={item.id}>
              <FileSpreadsheet />
              <span className="grow">
                <strong>{item.exportType}</strong>
                <small>
                  {item.format} · {item.recordCount} records
                </small>
              </span>
              <StatusBadge
                tone={item.status === "Exported" ? "success" : "warning"}
              >
                {item.status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>
      {confirm && (
        <Modal
          title="Mark these records as exported?"
          onClose={() => setConfirm(false)}
        >
          <p>
            The export can be prepared without clearing the Needs Export status.
          </p>
          <div className="stack">
            <Button
              variant="primary"
              onClick={() => {
                recordExport(exportType, format, true);
                setDone(true);
                setConfirm(false);
              }}
            >
              Mark as Exported
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                recordExport(exportType, format, false);
                setDone(true);
                setConfirm(false);
              }}
            >
              Keep as Needs Export
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function CalendarScreen() {
  const { workspace, scheduleContext, scheduleEvent, setCurrentScreen } =
    useAppState();
  const [view, setView] = useState("Today");
  const [showForm, setShowForm] = useState(
    Boolean(Object.keys(scheduleContext ?? {}).length),
  );
  const relatedCustomer = workspace.customers.find(
    (item) => item.id === scheduleContext?.customerId,
  );
  const relatedLead = workspace.leads.find(
    (item) => item.id === scheduleContext?.leadId,
  );
  const [form, setForm] = useState({
    title: relatedCustomer
      ? `${relatedCustomer.name} appointment`
      : relatedLead
        ? `${relatedLead.name} follow-up`
        : "",
    eventType: relatedLead ? "Follow-Up" : "Appointment",
    startDate: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    location: relatedCustomer?.jobSiteAddress ?? relatedLead?.address ?? "",
    notes: "",
    reminder: "1 hour before",
  });
  const events = useMemo(
    () => workspace.calendarEvents.filter((event) => !event.archived),
    [workspace.calendarEvents],
  );
  const save = () => {
    if (!form.title.trim()) return;
    scheduleEvent({
      title: form.title,
      eventType: form.eventType as CalendarEvent["eventType"],
      startDate: form.startDate,
      startTime: form.startTime,
      allDay: false,
      location: form.location,
      notes: form.notes,
      status: "Scheduled",
      relatedCustomerId: scheduleContext?.customerId,
      relatedLeadId: scheduleContext?.leadId,
      relatedProjectId: scheduleContext?.projectId,
      relatedEstimateId: scheduleContext?.estimateId,
      relatedInvoiceId: scheduleContext?.invoiceId,
      createdFrom: relatedLead
        ? "Lead"
        : relatedCustomer
          ? "Customer"
          : "Manual",
      reminders: [form.reminder],
    });
    setShowForm(false);
  };
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Calendar" backTo="home" />
      <div className="between section">
        <div>
          <h1 className="page-title">Calendar &amp; Schedule</h1>
          <p className="page-subtitle">
            Appointments, site visits, follow-ups, jobs, reminders, and events.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<CalendarDays size={17} />}
          onClick={() => setShowForm(true)}
        >
          Add
        </Button>
      </div>
      <div className="customer-filters section" aria-label="Calendar view">
        {["Today", "Week", "Month", "List"].map((item) => (
          <button
            key={item}
            className={view === item ? "active" : ""}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="calendar-list section">
        {events.map((event) => (
          <article className="card panel" key={event.id}>
            <div className="calendar-date">
              <strong>
                {new Date(`${event.startDate}T12:00:00`).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                )}
              </strong>
              <span>{event.startTime ?? "All day"}</span>
            </div>
            <div className="grow">
              <h2>{event.title}</h2>
              <p>
                {event.eventType}
                {event.location ? ` · ${event.location}` : ""}
              </p>
              <small>{event.reminders.join(", ")}</small>
            </div>
            <StatusBadge tone={statusTone(event.status)}>
              {event.status}
            </StatusBadge>
          </article>
        ))}
      </div>
      {showForm && (
        <Modal title="Schedule Appointment" onClose={() => setShowForm(false)}>
          <div className="stack">
            <div className="field">
              <label>Appointment title *</label>
              <input
                className="input"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </div>
            <div className="estimate-field-grid">
              <div className="field">
                <label>Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm({ ...form, startDate: event.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  className="input"
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm({ ...form, startTime: event.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Type</label>
                <select
                  className="select"
                  value={form.eventType}
                  onChange={(event) =>
                    setForm({ ...form, eventType: event.target.value })
                  }
                >
                  {[
                    "Appointment",
                    "Site Visit",
                    "Estimate Call",
                    "Job / Project",
                    "Follow-Up",
                    "Payment Reminder",
                    "Review Request",
                    "Class / Event",
                    "Delivery / Pickup",
                    "Custom",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Reminder</label>
                <select
                  className="select"
                  value={form.reminder}
                  onChange={(event) =>
                    setForm({ ...form, reminder: event.target.value })
                  }
                >
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                  <option>1 day before</option>
                  <option>No reminder</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Location</label>
              <input
                className="input"
                value={form.location}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <textarea
                className="textarea"
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
              />
            </div>
            <Button
              variant="primary"
              wide
              disabled={!form.title.trim()}
              onClick={save}
            >
              Save Appointment
            </Button>
            <Button variant="ghost" wide onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      <Button
        className="section"
        variant="ghost"
        onClick={() => setCurrentScreen("home")}
      >
        Back to Home
      </Button>
    </section>
  );
}

export function LeadDetailScreen() {
  const {
    workspace,
    selectedLeadId,
    convertLeadToCustomer,
    openEstimateBuilder,
    openSchedule,
    openCustomer,
  } = useAppState();
  const lead = workspace.leads.find((item) => item.id === selectedLeadId);
  if (!lead)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Lead" backTo="customers" />
        <p className="section">Lead not found in this business.</p>
      </section>
    );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Lead details" backTo="customers" />
      <div className="customer-hero">
        <div className="customer-avatar customer-avatar--large">
          {lead.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <h1 className="page-title">{lead.name}</h1>
          <StatusBadge tone="info">{lead.status}</StatusBadge>
        </div>
      </div>
      <section className="card panel section stack">
        <p>
          <strong>Interested service:</strong>{" "}
          {lead.interestedService ?? lead.serviceNeeded}
        </p>
        <p>
          <strong>Source:</strong> {lead.source}
        </p>
        <p>
          <strong>Phone:</strong> {lead.phone || "Not added"}
        </p>
        <p>
          <strong>Email:</strong> {lead.email || "Not added"}
        </p>
        <p>
          <strong>Request:</strong> {lead.message || "No message"}
        </p>
      </section>
      <div className="action-grid section">
        <button
          className="action-card"
          onClick={() => openSchedule({ leadId: lead.id })}
        >
          <CalendarDays />
          <span>Schedule Appointment</span>
        </button>
        <button
          className="action-card"
          onClick={() => openEstimateBuilder(undefined)}
        >
          <FileSpreadsheet />
          <span>Create Estimate</span>
        </button>
        <button
          className="action-card"
          onClick={() => {
            const id = convertLeadToCustomer(lead.id);
            if (id) openCustomer(id);
          }}
        >
          <UserRoundCheck />
          <span>Convert to Customer</span>
        </button>
      </div>
    </section>
  );
}
