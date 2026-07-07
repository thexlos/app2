import {
  ArrowLeft,
  ArrowRight,
  Download,
  Eye,
  FileText,
  LockKeyhole,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { formatDocumentNumber } from "../lib/documentNumbering";
import { useAppState } from "../state/AppState";
import type {
  DocumentStyleTemplate,
  DocumentTemplate,
  EstimateLineItem,
  Invoice,
} from "../types/models";

const steps = [
  "Customer",
  "Invoice Info / Project",
  "Items",
  "Payment",
  "Preview & Send",
] as const;
const money = (value: number) =>
  value.toLocaleString(undefined, { style: "currency", currency: "USD" });
const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function InvoiceBuilderScreen() {
  const {
    currentBusiness,
    currentBusinessId,
    workspace,
    selectedCustomerId,
    selectedEstimateId,
    setCurrentScreen,
    saveInvoiceFromBuilder,
    saveDocumentTemplate,
    saveDocumentStyle,
    saveItemBankItem,
    markUnsavedWork,
    clearUnsavedWork,
    openDocumentStyleEditor,
    openGuidedBuilder,
    guidedDraft,
  } = useAppState();
  const sourceEstimate = selectedEstimateId
    ? workspace.estimates.find(
        (item) => item.id === selectedEstimateId && item.status === "Accepted",
      )
    : undefined;
  const autoNumber = formatDocumentNumber(
    workspace.documentNumberSettings,
    "invoice",
  );
  const [step, setStep] = useState<(typeof steps)[number]>("Customer");
  const [customerId, setCustomerId] = useState(
    selectedCustomerId ??
      (guidedDraft?.builderId === "invoice-builder"
        ? String(guidedDraft.answers.customerId ?? "")
        : undefined) ??
      sourceEstimate?.customerId ??
      "",
  );
  const [projectId, setProjectId] = useState(sourceEstimate?.projectId ?? "");
  const [title, setTitle] = useState(
    sourceEstimate ? `Invoice for ${sourceEstimate.projectName}` : "Invoice",
  );
  const [number, setNumber] = useState(autoNumber);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>(
    sourceEstimate?.lineItems.map((item) => ({
      ...item,
      id: id("invoice-item"),
      sourceItemSnapshot: { ...item },
    })) ?? [],
  );
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState(
    guidedDraft?.builderId === "invoice-builder"
      ? String(guidedDraft.answers.paymentTerms ?? "Due in 14 days")
      : "Due in 14 days",
  );
  const [customPaymentTerms, setCustomPaymentTerms] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    guidedDraft?.builderId === "invoice-builder" &&
      Array.isArray(guidedDraft.answers.paymentMethods)
      ? guidedDraft.answers.paymentMethods
      : ["Check"],
  );
  const [paymentInstructions, setPaymentInstructions] = useState(
    "Please contact us if you need another payment option.",
  );
  const [notes, setNotes] = useState("");
  const [footer, setFooter] = useState(
    "Thank you for your business. Balance is due by the listed due date.",
  );
  const [showBank, setShowBank] = useState(false);
  const [preview, setPreview] = useState<"customer" | "document">();
  const [message, setMessage] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateName, setTemplateName] = useState(
    "Professional Invoice Template",
  );
  const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplate>(
    () =>
      structuredClone(
        workspace.documentTemplates.find(
          (item) => item.documentType === "Invoice",
        )!,
      ),
  );
  const [documentStyle, setDocumentStyle] = useState<DocumentStyleTemplate>(
    () =>
      structuredClone(
        workspace.documentStyles.find(
          (item) => item.documentType === "invoice" && item.isDefault,
        ) ??
          workspace.documentStyles.find(
            (item) => item.documentType === "invoice",
          )!,
      ),
  );
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const total = Math.max(0, subtotal - discount + tax);
  const balance = Math.max(0, total - amountPaid);
  const internalCost = lineItems.reduce(
    (sum, item) => sum + (item.internalCost ?? 0) * item.quantity,
    0,
  );
  const estimatedProfit = total - internalCost;
  const customer = workspace.customers.find((item) => item.id === customerId);
  const projects = workspace.projects.filter(
    (item) => item.customerId === customerId,
  );
  const invoice = useMemo<Invoice>(
    () => ({
      id: `${currentBusinessId}-invoice-builder-${number}`,
      businessId: currentBusinessId,
      number,
      customerId,
      projectId: projectId || undefined,
      sourceEstimateId: sourceEstimate?.id,
      estimateId: sourceEstimate?.id,
      title,
      status: "Draft",
      invoiceType: sourceEstimate ? "progress" : "standard",
      billingMethod: sourceEstimate
        ? "accepted_estimate_selected_items"
        : "manual",
      invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      discount,
      tax,
      total,
      amountPaid,
      balanceDue: balance,
      payments: [],
      paymentTerms:
        paymentTerms === "Custom terms" ? customPaymentTerms : paymentTerms,
      paymentMethods,
      paymentInstructions,
      notes,
      footer,
    }),
    [
      number,
      customerId,
      projectId,
      sourceEstimate,
      title,
      invoiceDate,
      dueDate,
      lineItems,
      subtotal,
      discount,
      tax,
      total,
      amountPaid,
      balance,
      paymentTerms,
      customPaymentTerms,
      paymentMethods,
      paymentInstructions,
      notes,
      footer,
    ],
  );
  const save = (status: "Draft" | "Sent") => {
    if (!customerId) {
      setMessage("Choose a customer before saving or sending this invoice.");
      setStep("Customer");
      return;
    }
    if (!lineItems.length || total <= 0) {
      setMessage("Add at least one billable item before saving or sending.");
      setStep("Items");
      return;
    }
    saveInvoiceFromBuilder({ ...invoice, status });
    clearUnsavedWork();
    setMessage(
      status === "Sent" ? "Invoice sent in mock mode." : "Draft saved.",
    );
  };
  useEffect(() => {
    markUnsavedWork(`Unsaved invoice ${number}`, () => save("Draft"));
    return () => undefined;
  }, [invoice]);
  const addBlank = () =>
    setLineItems((current) => [
      ...current,
      {
        id: id("invoice-item"),
        name: "New item",
        quantity: 1,
        unitPrice: 0,
        visibleToCustomer: true,
        pdfVisible: true,
        internalOnly: false,
      },
    ]);
  const addBank = (bankId: string) => {
    const item = workspace.itemBank.find((entry) => entry.id === bankId);
    if (!item) return;
    setLineItems((current) => [
      ...current,
      {
        id: id("invoice-item"),
        name: item.customerDescription || item.name,
        description: item.description,
        quantity: item.defaultQuantity,
        unitPrice: item.defaultRate,
        unit: item.unit,
        category: item.category,
        taxable: item.taxable,
        internalCost: item.internalCost,
        visibleToCustomer: true,
        pdfVisible: true,
        internalOnly: false,
        sourceBankItemId: item.id,
        sourceItemSnapshot: structuredClone(item) as unknown as Record<
          string,
          unknown
        >,
      },
    ]);
    setShowBank(false);
  };
  const invoicePreviewColumns = documentStyle.columnStyles.filter(
    (column) =>
      column.visibleOnPdf &&
      !column.internalOnly &&
      ["description", "quantity", "rate", "total"].includes(column.columnKey),
  );
  const invoicePreviewGrid = invoicePreviewColumns
    .map((column) => column.width ?? "minmax(70px, auto)")
    .join(" ");
  const previewValue = (item: EstimateLineItem, key: string) =>
    key === "description"
      ? item.name
      : key === "quantity"
        ? item.quantity
        : key === "rate"
          ? money(item.unitPrice)
          : money(item.quantity * item.unitPrice);
  const index = steps.indexOf(step);
  return (
    <section className="screen estimate-builder-screen">
      <header className="estimate-builder-header">
        <button
          className="btn btn--ghost"
          onClick={() => setCurrentScreen("money")}
          aria-label="Back to Money"
        >
          <ArrowLeft />
        </button>
        <div className="grow">
          <h1>Create Invoice</h1>
          <StatusBadge tone="info">Draft</StatusBadge>
        </div>
        <Button
          variant="ghost"
          icon={<Save size={18} />}
          onClick={() => save("Draft")}
        >
          Save
        </Button>
      </header>
      <section className="estimate-business-context">
        <div className="official-logo">{currentBusiness.initials}</div>
        <div>
          <strong>{currentBusiness.name}</strong>
          <p>
            This invoice uses the active profile’s brand kit, item bank,
            numbering, payment settings, and templates.
          </p>
        </div>
      </section>
      <Button
        className="section"
        variant="ghost"
        onClick={() => openGuidedBuilder("Create Invoice")}
      >
        Walk Me Through It
      </Button>
      <nav className="estimate-steps">
        {steps.map((value, stepIndex) => (
          <button
            key={value}
            className={
              step === value
                ? "estimate-step estimate-step--active"
                : "estimate-step"
            }
            onClick={() => setStep(value)}
          >
            <span>{stepIndex + 1}</span>
            {value}
          </button>
        ))}
      </nav>
      {message && (
        <div className="alert alert--info section">
          <strong>{message}</strong>
        </div>
      )}
      <div className="estimate-builder-layout section">
        <div className="estimate-builder-main">
          {step === "Customer" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <ReceiptText size={21} />
                </div>
                <div>
                  <h2>Who is being billed?</h2>
                  <p>Select a customer from the active business profile.</p>
                </div>
              </div>
              <div className="field">
                <label>Customer</label>
                <select
                  className="select"
                  value={customerId}
                  onChange={(event) => {
                    setCustomerId(event.target.value);
                    setProjectId("");
                  }}
                >
                  <option value="">Choose customer</option>
                  {workspace.customers.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {customer && (
                <div className="card panel">
                  <strong>{customer.name}</strong>
                  <p className="muted">
                    {customer.email} ·{" "}
                    {customer.billingAddress ?? customer.address}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setCurrentScreen("add-customer")}
              >
                Add New Customer
              </Button>
            </section>
          )}
          {step === "Invoice Info / Project" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <FileText size={21} />
                </div>
                <div>
                  <h2>Invoice information</h2>
                  <p>Use the auto-generated number or edit it if needed.</p>
                </div>
              </div>
              <div className="estimate-field-grid">
                <div className="field">
                  <label>Invoice title</label>
                  <input
                    className="input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Invoice number</label>
                  <input
                    className="input"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                  />
                  <small>Auto-generated from this business profile.</small>
                </div>
                <div className="field">
                  <label>Invoice date</label>
                  <input
                    className="input"
                    type="date"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Due date</label>
                  <input
                    className="input"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Project, optional</label>
                <select
                  className="select"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                >
                  <option value="">No project selected</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} · {project.status}
                    </option>
                  ))}
                </select>
              </div>
              {sourceEstimate && (
                <div className="alert alert--success">
                  <LockKeyhole size={19} />
                  <span>
                    Created from accepted estimate {sourceEstimate.number}.
                    Approved scope stays locked.
                  </span>
                </div>
              )}
            </section>
          )}
          {step === "Items" && (
            <section className="estimate-items-step">
              <div className="between">
                <div>
                  <h2 className="section-heading">Invoice items</h2>
                  <p className="section-copy">
                    Simple mode shows description, quantity, rate, and total.
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={<Plus size={17} />}
                  onClick={addBlank}
                >
                  Add Blank
                </Button>
              </div>
              {lineItems.map((item) => (
                <article className="estimate-item-card" key={item.id}>
                  <div className="field">
                    <label>Description</label>
                    <input
                      className="input"
                      value={item.name}
                      onChange={(event) =>
                        setLineItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, name: event.target.value }
                              : entry,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="estimate-item-numbers">
                    <div className="field">
                      <label>Qty</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(event) =>
                          setLineItems((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? {
                                    ...entry,
                                    quantity: Number(event.target.value),
                                  }
                                : entry,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Rate</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(event) =>
                          setLineItems((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? {
                                    ...entry,
                                    unitPrice: Number(event.target.value),
                                  }
                                : entry,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{money(item.quantity * item.unitPrice)}</strong>
                    </div>
                  </div>
                  <div className="estimate-item-actions">
                    <button
                      onClick={() =>
                        saveItemBankItem({
                          id: `${currentBusinessId}-invoice-item-${Date.now()}`,
                          businessProfileId: currentBusinessId,
                          name: item.name || "New item",
                          description: item.description ?? item.name,
                          customerDescription: item.description ?? item.name,
                          category: item.category ?? "Services",
                          unit: item.unit ?? "each",
                          defaultQuantity: item.quantity || 1,
                          defaultRate: item.unitPrice,
                          internalCost: item.internalCost,
                          taxable: item.taxable ?? false,
                          lastUsed: "Just now",
                          source: "Manual",
                        })
                      }
                    >
                      <Save size={15} />
                      Save to Item Bank
                    </button>
                    <button
                      onClick={() =>
                        setLineItems((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                  <details>
                    <summary>More Options</summary>
                    <div className="estimate-item-advanced">
                      <div className="field">
                        <label>Unit</label>
                        <input
                          className="input"
                          value={item.unit ?? ""}
                          onChange={(event) =>
                            setLineItems((current) =>
                              current.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, unit: event.target.value }
                                  : entry,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Category / section</label>
                        <select
                          className="select"
                          value={item.category ?? ""}
                          onChange={(event) =>
                            setLineItems((current) =>
                              current.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, category: event.target.value }
                                  : entry,
                              ),
                            )
                          }
                        >
                          <option value="">No category</option>
                          {workspace.businessHomeKit.categories.map(
                            (category) => (
                              <option key={category}>{category}</option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="field">
                        <label>Internal cost</label>
                        <input
                          className="input"
                          type="number"
                          value={item.internalCost ?? ""}
                          onChange={(event) =>
                            setLineItems((current) =>
                              current.map((entry) =>
                                entry.id === item.id
                                  ? {
                                      ...entry,
                                      internalCost: Number(event.target.value),
                                    }
                                  : entry,
                              ),
                            )
                          }
                        />
                      </div>
                      <label>
                        <input
                          type="checkbox"
                          checked={item.visibleToCustomer}
                          onChange={(event) =>
                            setLineItems((current) =>
                              current.map((entry) =>
                                entry.id === item.id
                                  ? {
                                      ...entry,
                                      visibleToCustomer: event.target.checked,
                                    }
                                  : entry,
                              ),
                            )
                          }
                        />
                        Visible to customer
                      </label>
                    </div>
                  </details>
                </article>
              ))}
              <div className="row">
                <Button variant="outline" onClick={() => setShowBank(true)}>
                  Add from Item Bank
                </Button>
                <Button variant="neutral" onClick={() => setShowBank(true)}>
                  Add Recent Item
                </Button>
                <Button
                  variant="neutral"
                  onClick={() => setCurrentScreen("global-library")}
                >
                  Search More Items
                </Button>
                <Button
                  variant="neutral"
                  onClick={() => setCurrentScreen("sync-center")}
                >
                  QuickBooks Items — Placeholder
                </Button>
              </div>
              <section className="estimate-adjustments">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <label>
                  <span>Discount</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(event) =>
                      setDiscount(Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  <span>Tax</span>
                  <input
                    type="number"
                    value={tax}
                    onChange={(event) => setTax(Number(event.target.value))}
                  />
                </label>
                <div className="estimate-adjustments__total">
                  <span>Invoice total</span>
                  <strong>{money(total)}</strong>
                </div>
              </section>
              <details className="internal-summary">
                <summary>
                  <LockKeyhole size={17} /> Internal Summary{" "}
                  <span>Business only</span>
                </summary>
                <div>
                  <div>
                    <span>Customer total</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <div>
                    <span>Internal cost</span>
                    <strong>{money(internalCost)}</strong>
                  </div>
                  <div>
                    <span>Estimated profit</span>
                    <strong>{money(estimatedProfit)}</strong>
                  </div>
                  <div>
                    <span>Margin</span>
                    <strong>
                      {total
                        ? `${((estimatedProfit / total) * 100).toFixed(1)}%`
                        : "0%"}
                    </strong>
                  </div>
                </div>
                <p>Never shown on the customer invoice or official document.</p>
              </details>
            </section>
          )}
          {step === "Payment" && (
            <section className="estimate-step-panel">
              <div className="estimate-panel-title">
                <div className="icon-box">
                  <ReceiptText size={21} />
                </div>
                <div>
                  <h2>Payment</h2>
                  <p>
                    Choose the terms and instructions shown to the customer.
                  </p>
                </div>
              </div>
              <div className="estimate-field-grid">
                <div className="field">
                  <label>Payment terms</label>
                  <select
                    className="select"
                    value={paymentTerms}
                    onChange={(event) => setPaymentTerms(event.target.value)}
                  >
                    {[
                      "Due on receipt",
                      "Due in 7 days",
                      "Due in 14 days",
                      "Due in 30 days",
                      "Custom terms",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {paymentTerms === "Custom terms" && (
                  <div className="field">
                    <label>Custom payment terms</label>
                    <textarea
                      className="textarea textarea--small"
                      value={customPaymentTerms}
                      onChange={(event) =>
                        setCustomPaymentTerms(event.target.value)
                      }
                      placeholder="Example: 50% due now. Remaining balance due after delivery."
                    />
                  </div>
                )}
                <div className="field">
                  <label>Amount already paid</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    max={total}
                    value={amountPaid}
                    onChange={(event) =>
                      setAmountPaid(Number(event.target.value))
                    }
                  />
                </div>
              </div>
              <fieldset className="help-question">
                <legend>Payment methods</legend>
                <div className="help-choice-grid">
                  {[
                    "Cash",
                    "Check",
                    "Zelle",
                    "Cash App",
                    "Venmo",
                    "PayPal",
                    "Bank transfer",
                    "Other",
                  ].map((method) => (
                    <label key={method}>
                      <input
                        type="checkbox"
                        checked={paymentMethods.includes(method)}
                        onChange={(event) =>
                          setPaymentMethods((current) =>
                            event.target.checked
                              ? [...current, method]
                              : current.filter((item) => item !== method),
                          )
                        }
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label>Payment instructions</label>
                <textarea
                  className="textarea"
                  value={paymentInstructions}
                  onChange={(event) =>
                    setPaymentInstructions(event.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>Customer notes</label>
                <textarea
                  className="textarea"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
              <div className="field">
                <label>Document footer</label>
                <textarea
                  className="textarea textarea--small"
                  value={footer}
                  onChange={(event) => setFooter(event.target.value)}
                />
              </div>
            </section>
          )}
          {step === "Preview & Send" && (
            <section className="estimate-preview-step">
              <div className="estimate-preview-summary">
                <h2>Builder Summary</h2>
                <dl>
                  <div>
                    <dt>Customer</dt>
                    <dd>{customer?.name ?? "Not selected"}</dd>
                  </div>
                  <div>
                    <dt>Project</dt>
                    <dd>
                      {projects.find((item) => item.id === projectId)?.name ??
                        "None"}
                    </dd>
                  </div>
                  <div>
                    <dt>Invoice total</dt>
                    <dd>{money(total)}</dd>
                  </div>
                  <div>
                    <dt>Paid</dt>
                    <dd>{money(amountPaid)}</dd>
                  </div>
                  <div>
                    <dt>Balance due</dt>
                    <dd>{money(balance)}</dd>
                  </div>
                  <div>
                    <dt>Items</dt>
                    <dd>{lineItems.length}</dd>
                  </div>
                </dl>
              </div>
              <details className="document-template-settings">
                <summary>Document Settings</summary>
                <div className="document-template-settings__body">
                  <div className="field">
                    <label>Invoice template</label>
                    <select
                      className="select"
                      value={documentTemplate.templateId}
                      onChange={(event) => {
                        const selected = workspace.documentTemplates.find(
                          (item) => item.templateId === event.target.value,
                        );
                        if (selected) {
                          setDocumentTemplate(structuredClone(selected));
                          const style = workspace.documentStyles.find(
                            (item) => item.id === selected.documentStyleId,
                          );
                          if (style) setDocumentStyle(structuredClone(style));
                        }
                      }}
                    >
                      {workspace.documentTemplates
                        .filter(
                          (item) =>
                            item.documentType === "Invoice" && !item.archived,
                        )
                        .map((item) => (
                          <option key={item.templateId} value={item.templateId}>
                            {item.templateName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="document-style-presets">
                    <strong>Simple Style</strong>
                    <div>
                      {workspace.documentStyles
                        .filter(
                          (style) =>
                            style.documentType === "invoice" && !style.archived,
                        )
                        .map((style) => (
                          <button
                            key={style.id}
                            className={
                              documentStyle.id === style.id
                                ? "document-style-preset document-style-preset--active"
                                : "document-style-preset"
                            }
                            onClick={() => {
                              setDocumentStyle(structuredClone(style));
                              setDocumentTemplate((current) => ({
                                ...current,
                                documentStyleId: style.id,
                              }));
                            }}
                          >
                            <span
                              style={{
                                background: style.headerStyle.backgroundColor,
                              }}
                            />
                            <strong>{style.templateName}</strong>
                            <small>{style.basePreset}</small>
                          </button>
                        ))}
                    </div>
                  </div>
                  <div className="document-column-list">
                    <div className="between">
                      <strong>Official document columns</strong>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setDocumentTemplate((current) => ({
                            ...current,
                            columnSettings: [
                              ...current.columnSettings,
                              {
                                key: `custom-${Date.now()}`,
                                label: "Custom Column",
                                visible: true,
                                visibleToCustomer: true,
                                internalOnly: false,
                                columnType: "text",
                                sortOrder: current.columnSettings.length,
                              },
                            ],
                          }))
                        }
                      >
                        Add Custom Column
                      </Button>
                    </div>
                    {documentTemplate.columnSettings.map((column) => (
                      <div key={column.key}>
                        <label>
                          <input
                            type="checkbox"
                            checked={column.visible}
                            disabled={
                              column.internalOnly ||
                              ["internalCost", "profit"].includes(column.key)
                            }
                            onChange={(event) =>
                              setDocumentTemplate((current) => ({
                                ...current,
                                columnSettings: current.columnSettings.map(
                                  (item) =>
                                    item.key === column.key
                                      ? {
                                          ...item,
                                          visible: event.target.checked,
                                        }
                                      : item,
                                ),
                              }))
                            }
                          />
                          <input
                            className="input"
                            value={column.label}
                            onChange={(event) =>
                              setDocumentTemplate((current) => ({
                                ...current,
                                columnSettings: current.columnSettings.map(
                                  (item) =>
                                    item.key === column.key
                                      ? { ...item, label: event.target.value }
                                      : item,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={Boolean(column.internalOnly)}
                            onChange={(event) =>
                              setDocumentTemplate((current) => ({
                                ...current,
                                columnSettings: current.columnSettings.map(
                                  (item) =>
                                    item.key === column.key
                                      ? {
                                          ...item,
                                          internalOnly: event.target.checked,
                                          visible: event.target.checked
                                            ? false
                                            : item.visible,
                                          visibleToCustomer: event.target
                                            .checked
                                            ? false
                                            : item.visibleToCustomer,
                                        }
                                      : item,
                                ),
                              }))
                            }
                          />
                          Internal only
                        </label>
                        {column.key.startsWith("custom-") && (
                          <button
                            onClick={() =>
                              setDocumentTemplate((current) => ({
                                ...current,
                                columnSettings: current.columnSettings.filter(
                                  (item) => item.key !== column.key,
                                ),
                              }))
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <Button
                      variant="outline"
                      onClick={() => {
                        saveDocumentStyle(documentStyle);
                        saveDocumentTemplate(documentTemplate);
                      }}
                    >
                      Save Document Settings
                    </Button>
                    <Button
                      variant="neutral"
                      onClick={() =>
                        openDocumentStyleEditor(documentTemplate.templateId)
                      }
                    >
                      Advanced Style Editor
                    </Button>
                  </div>
                  <div className="alert alert--info">
                    <LockKeyhole size={18} />
                    <span>
                      Internal cost, profit, supplier notes, and internal
                      columns stay hidden by default.
                    </span>
                  </div>
                </div>
              </details>
              <div className="estimate-preview-options">
                <article>
                  <div className="icon-box">
                    <Eye />
                  </div>
                  <h2>Customer Invoice View</h2>
                  <p>Clean balance, due date, PDF, and payment instructions.</p>
                  <Button
                    variant="primary"
                    wide
                    onClick={() => setPreview("customer")}
                  >
                    Preview Customer View
                  </Button>
                </article>
                <article>
                  <div className="icon-box">
                    <FileText />
                  </div>
                  <h2>Official Invoice Document</h2>
                  <p>Full downloadable invoice with visible fields only.</p>
                  <Button
                    variant="outline"
                    wide
                    onClick={() => setPreview("document")}
                  >
                    Preview Official Document
                  </Button>
                </article>
              </div>
              <section className="estimate-send-options">
                <h2>Send options</h2>
                <div>
                  <Button variant="neutral" onClick={() => save("Draft")}>
                    Save Draft
                  </Button>
                  <Button variant="primary" onClick={() => save("Sent")}>
                    Send Invoice
                  </Button>
                  <Button variant="outline" icon={<Download size={17} />}>
                    Download PDF
                  </Button>
                  <Button variant="neutral">Copy Invoice Link</Button>
                  <Button variant="neutral">Record Payment</Button>
                  <Button
                    variant="neutral"
                    onClick={() => setShowTemplate(true)}
                  >
                    Save as Template
                  </Button>
                </div>
              </section>
            </section>
          )}
          <div className="estimate-step-footer">
            <Button
              variant="neutral"
              disabled={index === 0}
              onClick={() => setStep(steps[index - 1])}
            >
              <ArrowLeft size={17} />
              Back
            </Button>
            {index < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setStep(steps[index + 1])}
              >
                Continue
                <ArrowRight size={17} />
              </Button>
            ) : (
              <Button variant="primary" onClick={() => save("Sent")}>
                <Send size={17} />
                Send Invoice
              </Button>
            )}
          </div>
        </div>
        <aside className="estimate-total-summary">
          <span>Invoice total</span>
          <strong>{money(total)}</strong>
          <dl>
            <div>
              <dt>Paid</dt>
              <dd>{money(amountPaid)}</dd>
            </div>
            <div>
              <dt>Balance due</dt>
              <dd>{money(balance)}</dd>
            </div>
          </dl>
          <Button
            variant="primary"
            wide
            onClick={() => setStep("Preview & Send")}
          >
            Preview &amp; Send
          </Button>
          <small>{lineItems.length} items</small>
        </aside>
      </div>
      {showTemplate && (
        <Modal
          title="Save as Invoice Template"
          onClose={() => setShowTemplate(false)}
        >
          <p>
            Reusable invoice settings are selected. Customer, project, number,
            dates, payment history, status history, and one-time files are
            excluded.
          </p>
          <div className="field">
            <label>Template name</label>
            <input
              className="input"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
            />
          </div>
          <div className="template-parts-list">
            {[
              "Items and sections",
              "Custom columns",
              "Visibility settings",
              "Payment settings",
              "Tax/discount settings",
              "Internal cost settings",
              "Customer view layout",
              "Official PDF layout",
              "Document style",
              "Footer",
            ].map((item) => (
              <label key={item}>
                <input type="checkbox" defaultChecked />
                {item}
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                saveDocumentTemplate({
                  ...documentTemplate,
                  templateId: `${currentBusinessId}-invoice-template-${Date.now()}`,
                  templateName,
                  documentType: "Invoice",
                  documentStyleId: documentStyle.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  isDefault: false,
                  useCount: 0,
                });
                setShowTemplate(false);
              }}
            >
              Save Template
            </Button>
            <Button variant="ghost" onClick={() => setShowTemplate(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      {showBank && (
        <Modal
          title="Add from Item & Service Bank"
          onClose={() => setShowBank(false)}
        >
          <p>
            Choose an item saved for {currentBusiness.name}. A snapshot will be
            copied into this invoice.
          </p>
          <div className="item-bank-picker">
            {workspace.itemBank.map((item) => (
              <button key={item.id} onClick={() => addBank(item.id)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.category} · {item.unit}
                  </small>
                </span>
                <b>{money(item.defaultRate)}</b>
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setShowBank(false)}>
            Cancel
          </Button>
        </Modal>
      )}
      {preview && (
        <Modal
          title={
            preview === "customer"
              ? "Customer Invoice View"
              : "Official Invoice Document"
          }
          onClose={() => setPreview(undefined)}
        >
          <div
            className={
              preview === "document"
                ? "invoice-document-preview"
                : "invoice-customer-preview"
            }
            style={
              preview === "document"
                ? {
                    width: documentStyle.pageStyle.documentWidth,
                    maxWidth: "100%",
                    color: documentStyle.pageStyle.textColor,
                    backgroundColor: documentStyle.pageStyle.backgroundColor,
                    fontFamily: documentStyle.pageStyle.fontFamily,
                    fontSize: documentStyle.pageStyle.fontSize,
                    padding: documentStyle.pageStyle.padding,
                    borderColor: documentStyle.pageStyle.borderColor,
                    borderWidth: documentStyle.pageStyle.borderWidth,
                    borderStyle: "solid",
                  }
                : undefined
            }
          >
            <header
              style={
                preview === "document"
                  ? {
                      color: documentStyle.headerStyle.textColor,
                      backgroundColor:
                        documentStyle.headerStyle.backgroundColor,
                      padding: documentStyle.headerStyle.padding,
                      borderColor: documentStyle.headerStyle.borderColor,
                      borderWidth: documentStyle.headerStyle.borderWidth,
                      borderStyle: "solid",
                      textAlign: documentStyle.headerStyle.alignment,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexDirection:
                        documentStyle.headerStyle.logoPosition === "right"
                          ? "row-reverse"
                          : documentStyle.headerStyle.logoPosition === "center"
                            ? "column"
                            : "row",
                    }
                  : undefined
              }
            >
              {preview === "document" && (
                <span
                  className="estimate-paper__logo"
                  style={{
                    width: documentStyle.headerStyle.logoSize,
                    height: documentStyle.headerStyle.logoSize,
                  }}
                >
                  {currentBusiness.initials}
                </span>
              )}
              <strong
                style={
                  preview === "document"
                    ? {
                        color: documentStyle.headerStyle.businessNameColor,
                        fontSize:
                          documentStyle.headerStyle.businessNameFontSize,
                      }
                    : undefined
                }
              >
                {currentBusiness.name}
              </strong>
              <h2
                style={
                  preview === "document"
                    ? {
                        color: documentStyle.headerStyle.documentTitleColor,
                        fontSize:
                          documentStyle.headerStyle.documentTitleFontSize,
                      }
                    : undefined
                }
              >
                Invoice {number}
              </h2>
            </header>
            <div
              className="invoice-preview-info"
              style={
                preview === "document"
                  ? {
                      color: documentStyle.customerInfoStyle.bodyTextColor,
                      backgroundColor:
                        documentStyle.customerInfoStyle.backgroundColor,
                      borderColor: documentStyle.customerInfoStyle.borderColor,
                      borderWidth: documentStyle.customerInfoStyle.borderWidth,
                      padding: documentStyle.customerInfoStyle.padding,
                      textAlign: documentStyle.customerInfoStyle.alignment,
                    }
                  : undefined
              }
            >
              <strong
                style={
                  preview === "document"
                    ? {
                        color: documentStyle.customerInfoStyle.titleTextColor,
                        fontSize: documentStyle.customerInfoStyle.titleFontSize,
                      }
                    : undefined
                }
              >
                Bill to
              </strong>
              <span
                style={
                  preview === "document"
                    ? {
                        fontSize: documentStyle.customerInfoStyle.bodyFontSize,
                      }
                    : undefined
                }
              >
                {customer?.name} · Due {dueDate}
              </span>
            </div>
            <div
              className="approval-total"
              style={
                preview === "document"
                  ? {
                      color: documentStyle.totalsBoxStyle.labelColor,
                      backgroundColor:
                        documentStyle.totalsBoxStyle.backgroundColor,
                      borderColor: documentStyle.totalsBoxStyle.borderColor,
                      borderWidth: documentStyle.totalsBoxStyle.borderWidth,
                      borderStyle: "solid",
                      padding: documentStyle.totalsBoxStyle.padding,
                      textAlign: documentStyle.totalsBoxStyle.alignment,
                    }
                  : undefined
              }
            >
              <span>Balance due</span>
              <strong
                style={
                  preview === "document"
                    ? {
                        color: documentStyle.totalsBoxStyle.balanceDueColor,
                        fontSize:
                          documentStyle.totalsBoxStyle.finalTotalFontSize,
                        fontWeight:
                          documentStyle.totalsBoxStyle.finalTotalFontWeight ===
                          "medium"
                            ? 500
                            : documentStyle.totalsBoxStyle.finalTotalFontWeight,
                      }
                    : undefined
                }
              >
                {money(balance)}
              </strong>
            </div>
            {preview === "document" && (
              <div
                className="invoice-style-table"
                style={{
                  borderColor: documentStyle.tableStyle.tableBorderColor,
                  borderWidth: documentStyle.tableStyle.tableBorderWidth,
                }}
              >
                <div
                  className="invoice-style-table__row"
                  style={{ gridTemplateColumns: invoicePreviewGrid }}
                >
                  {invoicePreviewColumns.map((column) => (
                    <span
                      key={column.columnKey}
                      style={{
                        color: column.headerTextColor,
                        backgroundColor: column.headerBackgroundColor,
                        borderColor: column.borderColor,
                        fontFamily: column.fontFamily,
                        fontSize: column.fontSize,
                        fontWeight:
                          column.fontWeight === "medium"
                            ? 500
                            : column.fontWeight,
                        textAlign: column.alignment,
                      }}
                    >
                      {column.columnLabel}
                    </span>
                  ))}
                </div>
                {lineItems
                  .filter((item) => item.visibleToCustomer)
                  .map((item, index) => (
                    <div
                      className="invoice-style-table__row"
                      key={item.id}
                      style={{
                        gridTemplateColumns: invoicePreviewGrid,
                        color: documentStyle.rowStyle.rowTextColor,
                        backgroundColor:
                          index % 2 && documentStyle.rowStyle.useAlternatingRows
                            ? documentStyle.rowStyle
                                .alternatingRowBackgroundColor
                            : documentStyle.rowStyle.standardRowBackgroundColor,
                        borderColor: documentStyle.rowStyle.rowLineColor,
                      }}
                    >
                      {invoicePreviewColumns.map((column) => (
                        <span
                          key={column.columnKey}
                          style={{
                            color: column.bodyTextColor,
                            borderColor: column.borderColor,
                            fontFamily: column.fontFamily,
                            fontSize: column.fontSize,
                            fontWeight:
                              column.fontWeight === "medium"
                                ? 500
                                : column.fontWeight,
                            textAlign: column.alignment,
                            padding: documentStyle.rowStyle.rowPadding,
                          }}
                        >
                          {previewValue(item, column.columnKey)}
                        </span>
                      ))}
                    </div>
                  ))}
              </div>
            )}
            <p
              className="invoice-preview-payment"
              style={
                preview === "document"
                  ? {
                      color:
                        documentStyle.paymentInstructionsStyle.bodyTextColor,
                      backgroundColor:
                        documentStyle.paymentInstructionsStyle.backgroundColor,
                      borderColor:
                        documentStyle.paymentInstructionsStyle.borderColor,
                      borderWidth:
                        documentStyle.paymentInstructionsStyle.borderWidth,
                      padding: documentStyle.paymentInstructionsStyle.padding,
                      fontSize:
                        documentStyle.paymentInstructionsStyle.bodyFontSize,
                    }
                  : undefined
              }
            >
              {paymentInstructions}
            </p>
            {preview === "document" && notes && (
              <div
                className="invoice-preview-payment"
                style={{
                  color: documentStyle.notesStyle.bodyTextColor,
                  backgroundColor: documentStyle.notesStyle.backgroundColor,
                  borderColor: documentStyle.notesStyle.borderColor,
                  borderWidth: documentStyle.notesStyle.borderWidth,
                  padding: documentStyle.notesStyle.padding,
                  fontSize: documentStyle.notesStyle.bodyFontSize,
                }}
              >
                <strong
                  style={{
                    color: documentStyle.notesStyle.headingColor,
                    fontSize: documentStyle.notesStyle.headingFontSize,
                  }}
                >
                  Notes
                </strong>
                {notes}
              </div>
            )}
            {preview === "document" && (
              <div className="estimate-paper__approval-blocks">
                {documentTemplate.qrCodeSettings.showQrCode && (
                  <div
                    style={{
                      color: documentStyle.qrBlockStyle.labelColor,
                      backgroundColor:
                        documentStyle.qrBlockStyle.backgroundColor,
                      borderColor: documentStyle.qrBlockStyle.borderColor,
                      borderWidth: documentStyle.qrBlockStyle.borderWidth,
                      borderStyle: "solid",
                      padding: documentStyle.qrBlockStyle.padding,
                      fontSize: documentStyle.qrBlockStyle.labelFontSize,
                    }}
                  >
                    <QrCode size={documentStyle.qrBlockStyle.qrSize ?? 84} />
                    Scan for payment details
                  </div>
                )}
                {documentTemplate.signatureSettings.showApprovalArea && (
                  <div
                    style={{
                      color: documentStyle.signatureStyle.labelColor,
                      backgroundColor:
                        documentStyle.signatureStyle.backgroundColor,
                      borderColor: documentStyle.signatureStyle.borderColor,
                      borderWidth: documentStyle.signatureStyle.borderWidth,
                      borderStyle: "solid",
                      padding: documentStyle.signatureStyle.padding,
                      fontSize: documentStyle.signatureStyle.signatureFontSize,
                    }}
                  >
                    <span
                      className="estimate-paper__signature-line"
                      style={{
                        borderColor: documentStyle.signatureStyle.lineColor,
                      }}
                    />
                    Customer signature
                  </div>
                )}
              </div>
            )}
            {preview === "document" && (
              <footer
                style={{
                  color: documentStyle.footerStyle.textColor,
                  backgroundColor: documentStyle.footerStyle.backgroundColor,
                  borderColor: documentStyle.footerStyle.borderColor,
                  borderWidth: documentStyle.footerStyle.borderWidth,
                  borderStyle: "solid",
                  padding: documentStyle.footerStyle.padding,
                  textAlign: documentStyle.footerStyle.alignment,
                  fontFamily: documentStyle.footerStyle.fontFamily,
                  fontSize: documentStyle.footerStyle.fontSize,
                }}
              >
                {footer}
              </footer>
            )}
            <Button variant="primary" wide>
              {preview === "customer" ? "View Full Invoice" : "Download PDF"}
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
