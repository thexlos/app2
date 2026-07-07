import {
  CalendarPlus,
  CheckCircle2,
  FilePlus2,
  FolderPlus,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { useAppState } from "../state/AppState";

export function AddCustomerScreen() {
  const {
    createCustomer,
    openCustomer,
    openEstimateBuilder,
    openInvoiceBuilder,
    openSchedule,
    setCurrentScreen,
  } = useAppState();
  const [form, setForm] = useState({
    customerType: "Person" as "Person" | "Business",
    name: "",
    businessName: "",
    primaryContactName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    billingAddress: "",
    jobSiteAddress: "",
    preferredContactMethod: "No preference" as
      "Call" | "Text" | "Email" | "No preference",
    status: "New",
    notes: "",
    internalNotes: "",
    tags: "",
    leadSource: "",
    paymentTerms: "Due on receipt",
    taxable: false,
    addToExport: false,
    syncQuickBooks: false,
  });
  const [savedId, setSavedId] = useState<string>();
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name.trim()) {
      setError("Add a customer name.");
      return;
    }
    const id = createCustomer({
      customerType: form.customerType,
      name: form.name,
      businessName: form.businessName,
      primaryContactName: form.primaryContactName,
      phone: form.phone,
      alternatePhone: form.alternatePhone,
      email: form.email,
      website: form.website,
      billingAddress: form.billingAddress,
      jobSiteAddress: form.jobSiteAddress,
      preferredContactMethod: form.preferredContactMethod,
      status: form.status,
      leadSource: form.leadSource,
      taxable: form.taxable,
      paymentTerms: form.paymentTerms,
      notes: form.notes ? [form.notes] : [],
      internalNotes: form.internalNotes ? [form.internalNotes] : [],
    });
    setSavedId(id);
  };
  if (savedId)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Customer saved" backTo="customers" />
        <div className="guided-step section">
          <span>Customer saved</span>
          <div className="icon-box icon-box--success">
            <CheckCircle2 />
          </div>
          <h1>{form.name}</h1>
          <p>
            This customer is saved under the active business and can be reused
            across estimates, invoices, projects, files, appointments, and help
            requests.
          </p>
          <Button variant="primary" wide onClick={() => openCustomer(savedId)}>
            Open Customer
          </Button>
          <Button
            variant="outline"
            wide
            onClick={() => openEstimateBuilder(savedId)}
          >
            Create Estimate
          </Button>
          <Button
            variant="outline"
            wide
            onClick={() => openInvoiceBuilder(savedId)}
          >
            Create Invoice
          </Button>
          <Button
            variant="neutral"
            wide
            onClick={() => openSchedule({ customerId: savedId })}
          >
            Schedule Appointment
          </Button>
          <Button
            variant="neutral"
            wide
            onClick={() => setCurrentScreen("sync-center")}
          >
            Sync to QuickBooks
          </Button>
          <Button
            variant="neutral"
            wide
            onClick={() => setCurrentScreen("export-center")}
          >
            Add to Export List
          </Button>
          <Button variant="ghost" wide onClick={() => setSavedId(undefined)}>
            Add Another Customer
          </Button>
        </div>
      </section>
    );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Add Customer" backTo="customers" />
      <div className="section">
        <h1 className="page-title">Add a customer</h1>
        <p className="page-subtitle">
          Enter information once, then reuse it across the app.
        </p>
      </div>
      <section className="card panel section customer-entry-form">
        <div className="estimate-field-grid">
          <div className="field">
            <label>Customer type</label>
            <select
              className="select"
              value={form.customerType}
              onChange={(event) => update("customerType", event.target.value)}
            >
              <option>Person</option>
              <option>Business</option>
            </select>
          </div>
          <div className="field">
            <label>Customer name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Business name</label>
            <input
              className="input"
              value={form.businessName}
              onChange={(event) => update("businessName", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Primary contact</label>
            <input
              className="input"
              value={form.primaryContactName}
              onChange={(event) =>
                update("primaryContactName", event.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Alternate phone</label>
            <input
              className="input"
              value={form.alternatePhone}
              onChange={(event) => update("alternatePhone", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Website</label>
            <input
              className="input"
              type="url"
              value={form.website}
              onChange={(event) => update("website", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              className="select"
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              {[
                "New",
                "Active",
                "Past",
                "Needs Follow-Up",
                "Waiting Approval",
                "Invoice Unpaid",
                "Review Needed",
                "Archived",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Preferred contact</label>
            <select
              className="select"
              value={form.preferredContactMethod}
              onChange={(event) =>
                update("preferredContactMethod", event.target.value)
              }
            >
              {["Call", "Text", "Email", "No preference"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Billing address</label>
          <textarea
            className="textarea textarea--small"
            value={form.billingAddress}
            onChange={(event) => update("billingAddress", event.target.value)}
          />
        </div>
        <div className="field">
          <label>Job site address</label>
          <textarea
            className="textarea textarea--small"
            value={form.jobSiteAddress}
            onChange={(event) => update("jobSiteAddress", event.target.value)}
          />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea
            className="textarea"
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </div>
        <details>
          <summary>More Options</summary>
          <div className="customer-form-more">
            <div className="field">
              <label>Tags</label>
              <input
                className="input"
                value={form.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="VIP, recurring, follow-up"
              />
            </div>
            <div className="field">
              <label>Lead source</label>
              <input
                className="input"
                value={form.leadSource}
                onChange={(event) => update("leadSource", event.target.value)}
              />
            </div>
            <div className="field">
              <label>Payment terms</label>
              <select
                className="select"
                value={form.paymentTerms}
                onChange={(event) => update("paymentTerms", event.target.value)}
              >
                {["Due on receipt", "Net 7", "Net 14", "Net 30", "Custom"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </div>
            <div className="field">
              <label>Internal notes</label>
              <textarea
                className="textarea textarea--small"
                value={form.internalNotes}
                onChange={(event) =>
                  update("internalNotes", event.target.value)
                }
              />
            </div>
            <label>
              <input
                type="checkbox"
                checked={form.taxable}
                onChange={(event) => update("taxable", event.target.checked)}
              />{" "}
              Taxable customer
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.addToExport}
                onChange={(event) =>
                  update("addToExport", event.target.checked)
                }
              />{" "}
              Add to Excel/CSV export list
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.syncQuickBooks}
                onChange={(event) =>
                  update("syncQuickBooks", event.target.checked)
                }
              />{" "}
              Sync to QuickBooks after review — placeholder
            </label>
          </div>
        </details>
        {error && (
          <div className="alert alert--danger" role="alert">
            <strong>{error}</strong>
          </div>
        )}
        <Button
          variant="primary"
          wide
          icon={<UserPlus size={18} />}
          onClick={save}
        >
          Save Customer
        </Button>
      </section>
    </section>
  );
}

export function AddLeadScreen() {
  const {
    createLead,
    convertLeadToCustomer,
    openEstimateBuilder,
    openSchedule,
    openCustomer,
    setCurrentScreen,
  } = useAppState();
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    address: "",
    interestedService: "",
    source: "Manual",
    preferredContactMethod: "No preference",
    status: "New" as const,
    message: "",
    budget: "",
    dateNeeded: "",
    tags: "",
    notes: "",
    internalNotes: "",
  });
  const [savedId, setSavedId] = useState<string>();
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }) as typeof form);
  const save = () => {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError("Add the lead name and either a phone number or email.");
      return;
    }
    const id = createLead({
      ...form,
      budget: form.budget ? Number(form.budget) : undefined,
      tags: form.tags
        ? form.tags.split(",").map((label, index) => ({
            id: `lead-tag-${index}`,
            label: label.trim(),
            tone: "info" as const,
          }))
        : [],
      notes: form.notes ? [form.notes] : [],
      internalNotes: form.internalNotes ? [form.internalNotes] : [],
    });
    setSavedId(id);
  };
  if (savedId)
    return (
      <section className="screen screen--detail">
        <DetailHeader title="Lead saved" backTo="customers" />
        <div className="guided-step section">
          <span>Lead saved</span>
          <div className="icon-box icon-box--success">
            <CheckCircle2 />
          </div>
          <h1>{form.name}</h1>
          <p>
            This lead can be followed up, scheduled, estimated, or converted
            without retyping their information.
          </p>
          <Button variant="primary" wide onClick={() => openEstimateBuilder()}>
            Create Estimate
          </Button>
          <Button
            variant="outline"
            wide
            icon={<CalendarPlus size={18} />}
            onClick={() => openSchedule({ leadId: savedId })}
          >
            Schedule Appointment
          </Button>
          <Button
            variant="outline"
            wide
            icon={<FolderPlus size={18} />}
            onClick={() => {
              const id = convertLeadToCustomer(savedId);
              if (id) openCustomer(id);
            }}
          >
            Convert to Customer
          </Button>
          <Button
            variant="ghost"
            wide
            onClick={() => setCurrentScreen("customers")}
          >
            Back to Customers
          </Button>
        </div>
      </section>
    );
  return (
    <section className="screen screen--detail">
      <DetailHeader title="Add Lead" backTo="customers" />
      <div className="section">
        <h1 className="page-title">Add a lead</h1>
        <p className="page-subtitle">
          Save the request now and convert it to a customer later.
        </p>
      </div>
      <section className="card panel section customer-entry-form">
        <div className="estimate-field-grid">
          <div className="field">
            <label>Lead name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Business name</label>
            <input
              className="input"
              value={form.businessName}
              onChange={(event) => update("businessName", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Interested service</label>
            <input
              className="input"
              value={form.interestedService}
              onChange={(event) =>
                update("interestedService", event.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Budget, optional</label>
            <input
              className="input"
              type="number"
              value={form.budget}
              onChange={(event) => update("budget", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Date needed, optional</label>
            <input
              className="input"
              type="date"
              value={form.dateNeeded}
              onChange={(event) => update("dateNeeded", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Lead source</label>
            <select
              className="select"
              value={form.source}
              onChange={(event) => update("source", event.target.value)}
            >
              {[
                "Manual",
                "Lead Form",
                "QR Code",
                "Facebook",
                "Instagram",
                "Google Business",
                "Website",
                "Phone Call",
                "Walk-In",
                "Referral",
                "Imported",
                "Other",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select
              className="select"
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              {[
                "New",
                "Contacted",
                "Appointment Scheduled",
                "Estimate Needed",
                "Estimate Sent",
                "Won",
                "Lost",
                "Follow Up Later",
                "Archived",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Preferred contact</label>
            <select
              className="select"
              value={form.preferredContactMethod}
              onChange={(event) =>
                update("preferredContactMethod", event.target.value)
              }
            >
              {["Call", "Text", "Email", "No preference"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <textarea
            className="textarea textarea--small"
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </div>
        <div className="field">
          <label>Message or request</label>
          <textarea
            className="textarea"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </div>
        <details>
          <summary>More Options</summary>
          <div className="customer-form-more">
            <div className="field">
              <label>Tags</label>
              <input
                className="input"
                value={form.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="new inquiry, priority"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <textarea
                className="textarea textarea--small"
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </div>
            <div className="field">
              <label>Internal notes</label>
              <textarea
                className="textarea textarea--small"
                value={form.internalNotes}
                onChange={(event) =>
                  update("internalNotes", event.target.value)
                }
              />
            </div>
          </div>
        </details>
        {error && (
          <div className="alert alert--danger" role="alert">
            <strong>{error}</strong>
          </div>
        )}
        <Button
          variant="primary"
          wide
          icon={<FilePlus2 size={18} />}
          onClick={save}
        >
          Save Lead
        </Button>
      </section>
    </section>
  );
}
