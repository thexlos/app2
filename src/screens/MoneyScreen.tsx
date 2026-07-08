import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Eye,
  FileClock,
  FilePlus2,
  FileText,
  LockKeyhole,
  Mail,
  MoreHorizontal,
  PencilLine,
  Plus,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { Modal } from "../components/common/Modal";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { canEditEstimateInPlace } from "../lib/protectedRecords";
import { calculateApprovedBillingSummary } from "../lib/acceptedEstimateBilling";
import { useAppState } from "../state/AppState";

type MoneyView =
  "Estimates" | "Invoices" | "Progress" | "Changes" | "Payments" | "Templates";

export function MoneyScreen() {
  const {
    workspace,
    selectedInvoiceId: requestedInvoiceId,
    openEstimate,
    openEstimateBuilder,
    openInvoiceBuilder,
    setCurrentScreen,
    recordPayment,
    showNotice,
  } = useAppState();
  const [view, setView] = useState<MoneyView>("Estimates");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Zelle");
  const selectedInvoice = workspace.invoices.find(
    (invoice) => invoice.id === selectedInvoiceId,
  );
  useEffect(() => {
    if (!requestedInvoiceId) return;
    setView("Invoices");
    setSelectedInvoiceId(requestedInvoiceId);
  }, [requestedInvoiceId]);
  return (
    <section className="screen">
      <h1 className="page-title">Money</h1>
      <p className="page-subtitle">
        Create, approve, invoice, and track payment without losing the history.
      </p>
      <div className="money-summary section">
        <div>
          <span>Open invoices</span>
          <strong>
            $
            {workspace.invoices
              .filter((item) => item.status !== "Paid")
              .reduce((sum, item) => sum + item.total - item.amountPaid, 0)
              .toLocaleString()}
          </strong>
        </div>
        <div>
          <span>Paid</span>
          <strong className="success-text">
            $
            {workspace.invoices
              .filter((item) => item.status === "Paid")
              .reduce((sum, item) => sum + item.amountPaid, 0)
              .toLocaleString()}
          </strong>
        </div>
        <div>
          <span>Accepted estimates</span>
          <strong>
            {
              workspace.estimates.filter((item) => item.status === "Accepted")
                .length
            }
          </strong>
        </div>
      </div>
      <div className="segmented section" aria-label="Money record type">
        {(
          [
            "Estimates",
            "Invoices",
            "Progress",
            "Changes",
            "Payments",
            "Templates",
          ] as MoneyView[]
        ).map((item) => (
          <button
            key={item}
            className={`segment${view === item ? " segment--active" : ""}`}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="between section">
        <div>
          <h2 className="section-heading">{view}</h2>
          <p className="section-copy">
            Simple view. Advanced controls stay under More Options.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => {
            if (view === "Estimates") return openEstimateBuilder();
            if (view === "Invoices") return openInvoiceBuilder();
            if (view === "Templates") return setCurrentScreen("template-library");
            if (view === "Progress" || view === "Changes") {
              const accepted = workspace.estimates.find(
                (estimate) => estimate.status === "Accepted",
              );
              if (accepted) {
                openEstimate(accepted.id);
                showNotice(
                  `${view === "Progress" ? "Progress billing" : "Change orders"} start from an accepted estimate so approved scope stays protected.`,
                );
              } else
                showNotice(
                  `Accept an estimate before creating ${view.toLowerCase()}.`,
                );
              return;
            }
            showNotice(
              "Open an invoice to record a mock payment. No payment provider will be charged.",
            );
          }}
        >
          Create
        </Button>
      </div>

      {view === "Estimates" && (
        <div className="money-card-list">
          {workspace.estimates.map((estimate) => (
            <button
              className="money-card"
              key={estimate.id}
              onClick={() => openEstimate(estimate.id)}
            >
              <div className="between">
                <span
                  className={`icon-box icon-box--${statusTone(estimate.status)}`}
                >
                  <FileClock size={21} />
                </span>
                <StatusBadge tone={statusTone(estimate.status)}>
                  {estimate.status}
                </StatusBadge>
              </div>
              <div>
                <strong>Estimate {estimate.number}</strong>
                <p>{estimate.projectName}</p>
              </div>
              <div className="between">
                <strong className="money-card__amount">
                  ${estimate.total.toLocaleString()}
                </strong>
                <span className="money-card__action">
                  {estimate.status === "Accepted"
                    ? "View Accepted Version"
                    : estimate.status === "Sent"
                      ? "Send Follow-Up"
                      : estimate.status === "Rejected" ||
                          estimate.status === "Changes Requested"
                        ? "Create Revision"
                        : "Continue Editing"}{" "}
                  <ChevronRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      {view === "Invoices" && (
        <div className="money-card-list">
          {workspace.invoices.map((invoice) => (
            <button
              className="money-card"
              key={invoice.id}
              onClick={() => {
                setSelectedInvoiceId(invoice.id);
                setPaymentAmount(String(invoice.total - invoice.amountPaid));
              }}
            >
              <div className="between">
                <span
                  className={`icon-box icon-box--${statusTone(invoice.status)}`}
                >
                  <ReceiptText size={21} />
                </span>
                <StatusBadge tone={statusTone(invoice.status)}>
                  {invoice.status}
                </StatusBadge>
              </div>
              <div>
                <strong>Invoice {invoice.number}</strong>
                <p>
                  ${(invoice.total - invoice.amountPaid).toLocaleString()}{" "}
                  remaining
                </p>
              </div>
              <div className="between">
                <strong className="money-card__amount">
                  ${invoice.total.toLocaleString()}
                </strong>
                <span className="money-card__action">
                  {invoice.status === "Paid"
                    ? "View Paid Version"
                    : "Record Payment"}{" "}
                  <ChevronRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      {view === "Progress" && (
        <div className="money-card-list">
          {workspace.progressInvoices.map((invoice) => (
            <article className="money-card" key={invoice.id}>
              <div className="between">
                <span className="icon-box">
                  <CircleDollarSign size={21} />
                </span>
                <StatusBadge tone={statusTone(invoice.status)}>
                  {invoice.status}
                </StatusBadge>
              </div>
              <div>
                <strong>{invoice.number}</strong>
                <p>
                  {invoice.label} · {invoice.percent}%
                </p>
              </div>
              <strong className="money-card__amount">
                ${invoice.amount.toLocaleString()}
              </strong>
            </article>
          ))}
        </div>
      )}
      {view === "Changes" && (
        <div className="money-card-list">
          {workspace.changeOrders.map((change) => (
            <article className="money-card" key={change.id}>
              <div className="between">
                <span className="icon-box icon-box--warning">
                  <RefreshCcw size={21} />
                </span>
                <StatusBadge tone={statusTone(change.status)}>
                  {change.status}
                </StatusBadge>
              </div>
              <div>
                <strong>{change.number}</strong>
                <p>{change.reason}</p>
              </div>
              <strong className="money-card__amount">
                +${change.amount.toLocaleString()}
              </strong>
            </article>
          ))}
        </div>
      )}
      {view === "Payments" && (
        <div className="money-card-list">
          {workspace.invoices.flatMap((invoice) =>
            invoice.payments.map((payment) => (
              <article className="money-card" key={payment.id}>
                <div className="between">
                  <span className="icon-box icon-box--success">
                    <CircleDollarSign size={21} />
                  </span>
                  <StatusBadge tone="success">Recorded</StatusBadge>
                </div>
                <div>
                  <strong>Invoice {invoice.number}</strong>
                  <p>
                    {payment.method} · {payment.date}
                  </p>
                </div>
                <strong className="money-card__amount">
                  ${payment.amount.toLocaleString()}
                </strong>
              </article>
            )),
          )}
        </div>
      )}
      {view === "Templates" && (
        <div className="money-card-list">
          {workspace.templates
            .filter((template) => template.type !== "Kit marker")
            .map((template) => (
              <article className="money-card" key={template.id}>
                <div className="between">
                  <span className="icon-box">
                    <FilePlus2 size={21} />
                  </span>
                  <StatusBadge tone="info">Editable</StatusBadge>
                </div>
                <div>
                  <strong>{template.name}</strong>
                  <p>{template.type}</p>
                </div>
              </article>
            ))}
        </div>
      )}

      <button
        className="card panel between section"
        style={{ width: "100%", textAlign: "left" }}
        onClick={() => setCurrentScreen("integrations")}
      >
        <span className="row">
          <span className="icon-box">
            <WalletCards size={21} />
          </span>
          <span>
            <strong>QuickBooks sync center</strong>
            <small className="muted" style={{ display: "block", marginTop: 4 }}>
              Placeholder only — no live accounting connection
            </small>
          </span>
        </span>
        <ArrowRight size={19} />
      </button>
      {selectedInvoice && (
        <Modal
          title={`Invoice ${selectedInvoice.number}`}
          onClose={() => setSelectedInvoiceId(undefined)}
        >
          <div className="between">
            <span>Total</span>
            <strong>${selectedInvoice.total.toLocaleString()}</strong>
          </div>
          <div className="between section">
            <span>Paid</span>
            <strong>${selectedInvoice.amountPaid.toLocaleString()}</strong>
          </div>
          <div className="between section">
            <span>Balance</span>
            <strong>
              $
              {(
                selectedInvoice.total - selectedInvoice.amountPaid
              ).toLocaleString()}
            </strong>
          </div>
          {selectedInvoice.status === "Paid" ? (
            <div className="alert alert--success section">
              <LockKeyhole size={21} />
              <div>
                <strong>This invoice has payment history.</strong>
                <div className="small" style={{ marginTop: 4 }}>
                  Create an adjustment or duplicate instead of changing the paid
                  version.
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="field section">
                <label>Payment amount</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max={selectedInvoice.total - selectedInvoice.amountPaid}
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                />
              </div>
              <div className="field section">
                <label>Payment method</label>
                <select
                  className="select"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                >
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
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="modal-actions">
            {selectedInvoice.status === "Paid" ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedInvoiceId(undefined);
                    openInvoiceBuilder(selectedInvoice.customerId);
                    showNotice(
                      "Started a separate adjustment draft. The paid invoice remains unchanged.",
                    );
                  }}
                >
                  Create Adjustment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInvoiceId(undefined);
                    openInvoiceBuilder(selectedInvoice.customerId);
                    showNotice(
                      "Started a new invoice draft. The paid version remains protected.",
                    );
                  }}
                >
                  Duplicate as New
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    showNotice(
                      "You are viewing the paid version and its mock payment history.",
                    )
                  }
                >
                  View Paid Version
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  recordPayment(
                    selectedInvoice.id,
                    Number(paymentAmount),
                    paymentMethod,
                  );
                  setSelectedInvoiceId(undefined);
                }}
              >
                Record Payment
              </Button>
            )}
            <Button
              variant="neutral"
              onClick={() =>
                showNotice(
                  "Invoice PDF preparation is a prototype placeholder. No file was downloaded.",
                )
              }
            >
              Download PDF
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedInvoiceId(undefined)}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function EstimateDetailScreen() {
  const {
    workspace,
    selectedEstimateId,
    currentBusiness,
    createProtectedFollowUp,
    createInvoiceFromAcceptedEstimate,
    setCurrentScreen,
    openEstimateBuilder,
    showNotice,
  } = useAppState();
  const [showLockModal, setShowLockModal] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [billingMethod, setBillingMethod] = useState("Full Invoice");
  const [billingAmount, setBillingAmount] = useState("");
  const [billingPercent, setBillingPercent] = useState(30);
  const [selectedBillingSections, setSelectedBillingSections] = useState<
    string[]
  >([]);
  const [selectedBillingItems, setSelectedBillingItems] = useState<string[]>(
    [],
  );
  const [billingError, setBillingError] = useState("");
  const estimate =
    workspace.estimates.find((item) => item.id === selectedEstimateId) ??
    workspace.estimates[0];
  const customer = workspace.customers.find(
    (item) => item.id === estimate.customerId,
  );
  const locked = !canEditEstimateInPlace(estimate);
  const billingSummary = calculateApprovedBillingSummary(
    estimate,
    workspace.changeOrders,
    workspace.invoices,
  );
  const sectionItems = (sectionId: string) =>
    estimate.lineItems.filter((item) => item.sectionId === sectionId);
  const billingSourceItemIds =
    billingMethod === "Section / Category Invoice"
      ? selectedBillingSections.flatMap((id) =>
          sectionItems(id).map((item) => item.id),
        )
      : billingMethod === "Selected Items Invoice"
        ? selectedBillingItems
        : [];
  const selectedScopeAmount = estimate.lineItems
    .filter((item) => billingSourceItemIds.includes(item.id))
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const proposedInvoiceAmount =
    billingMethod === "Full Invoice" ||
    billingMethod === "Final Balance Invoice"
      ? billingSummary.remainingToInvoice
      : billingMethod === "Percentage Invoice"
        ? Math.min(
            billingSummary.remainingToInvoice,
            (billingSummary.approvedScopeValue * billingPercent) / 100,
          )
        : billingMethod === "Section / Category Invoice" ||
            billingMethod === "Selected Items Invoice"
          ? Math.min(billingSummary.remainingToInvoice, selectedScopeAmount)
          : Number(billingAmount);
  const openCustomerView = () => {
    window.location.hash = `/approve/${estimate.approvalToken}`;
  };
  return (
    <section className="screen screen--detail">
      <DetailHeader title={`Estimate ${estimate.number}`} backTo="money" />
      <div className="between estimate-context">
        <div>
          <span className="view-label">Builder View</span>
          <h1 className="page-title">{currentBusiness.name}</h1>
          <p className="page-subtitle">
            For {customer?.name} · Internal controls and protected history
          </p>
        </div>
        <Button
          variant="ghost"
          aria-label="More estimate actions"
          onClick={() => setShowMore(!showMore)}
        >
          <MoreHorizontal />
        </Button>
      </div>
      {estimate.status === "Accepted" && (
        <div className="alert alert--success section">
          <CheckCircle2 size={24} />
          <div>
            <strong>Accepted · Approved version locked</strong>
            <div className="small" style={{ marginTop: 4 }}>
              The approved version and history are protected.
            </div>
          </div>
        </div>
      )}
      {estimate.status === "Changes Requested" && (
        <div className="alert alert--warning section">
          <FileClock size={24} />
          <div>
            <strong>Changes requested</strong>
            <div className="small" style={{ marginTop: 4 }}>
              {estimate.versions[0]?.customerNote}
            </div>
          </div>
        </div>
      )}
      {estimate.status === "Rejected" && (
        <div className="alert alert--danger section">
          <FileClock size={24} />
          <div>
            <strong>Rejected · Customer note preserved</strong>
            <div className="small" style={{ marginTop: 4 }}>
              {estimate.versions[0]?.customerNote}
            </div>
          </div>
        </div>
      )}
      {locked && (
        <div className="protected-note">
          <span className="icon-box icon-box--success">
            <LockKeyhole size={21} />
          </span>
          <span>
            {estimate.status === "Accepted"
              ? "This approved version is protected. To make changes, create a revision, change order, or duplicate."
              : "This rejected version and customer note are protected. Create a revision or duplicate instead of overwriting it."}
          </span>
        </div>
      )}
      <section className="card panel section">
        <span className="muted">Total</span>
        <div className="estimate-total">
          $
          {estimate.total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </div>
        <div className="line-items">
          {estimate.lineItems
            .filter((item) => item.visibleToCustomer)
            .map((item) => (
              <div className="between" key={item.id}>
                <span>{item.name}</span>
                <strong>
                  $
                  {(item.quantity * item.unitPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>
            ))}
        </div>
      </section>
      {estimate.status === "Accepted" ? (
        <div className="stack section">
          <Button
            variant="primary"
            wide
            icon={<ReceiptText size={20} />}
            onClick={() => {
              setBillingMethod("Full Invoice");
              setBillingAmount(String(billingSummary.remainingToInvoice));
              setShowInvoiceBuilder(true);
            }}
          >
            Create Invoice from Accepted Estimate
          </Button>
          <Button
            variant="outline"
            wide
            icon={<FilePlus2 size={20} />}
            onClick={() => createProtectedFollowUp("change-order")}
          >
            Create Change Order
          </Button>
          <div className="action-pair">
            <Button
              variant="outline"
              wide
              icon={<RefreshCcw size={18} />}
              onClick={() => createProtectedFollowUp("revision")}
            >
              Create Revision
            </Button>
            <Button
              variant="outline"
              wide
              icon={<Copy size={18} />}
              onClick={() => createProtectedFollowUp("duplicate")}
            >
              Duplicate
            </Button>
          </div>
          <Button
            variant="neutral"
            wide
            onClick={() => {
              setBillingMethod("Percentage Invoice");
              setShowInvoiceBuilder(true);
            }}
          >
            Create Progress / Partial Invoice
          </Button>
          <Button
            variant="neutral"
            wide
            onClick={() => {
              setCurrentScreen("integrations");
              showNotice(
                "QuickBooks connection required. The accepted estimate was not sent.",
              );
            }}
          >
            Send to QuickBooks
          </Button>
          <Button
            variant="ghost"
            wide
            icon={<PencilLine size={18} />}
            onClick={() => setShowLockModal(true)}
          >
            Try to Edit
          </Button>
        </div>
      ) : ["Rejected", "Changes Requested"].includes(estimate.status) ? (
        <div className="stack section">
          <Button
            variant="primary"
            wide
            icon={<RefreshCcw size={18} />}
            onClick={() => createProtectedFollowUp("revision")}
          >
            Create Revision
          </Button>
          <Button
            variant="outline"
            wide
            icon={<Copy size={18} />}
            onClick={() => createProtectedFollowUp("duplicate")}
          >
            Duplicate as New
          </Button>
          {estimate.status === "Rejected" && (
            <Button
              variant="ghost"
              wide
              onClick={() =>
                showNotice(
                  "Archive is planned for the record-management phase. This rejected estimate remains in protected history.",
                )
              }
            >
              Archive
            </Button>
          )}
        </div>
      ) : (
        <Button
          className="section"
          variant="primary"
          wide
          icon={<PencilLine size={18} />}
          onClick={() => openEstimateBuilder(estimate.customerId, estimate.id)}
        >
          Edit Estimate
        </Button>
      )}
      <section className="section">
        <h2 className="section-heading">Delivery views</h2>
        <p className="section-copy">
          The builder, customer approval page, email message, and official
          document are separate.
        </p>
        <div className="delivery-view-grid">
          <article className="delivery-view-card delivery-view-card--active">
            <span className="icon-box">
              <PencilLine size={20} />
            </span>
            <div>
              <strong>Builder View</strong>
              <small>
                Internal fields, costs, notes, visibility, and admin controls.
              </small>
            </div>
            <StatusBadge tone="info">Current</StatusBadge>
          </article>
          <button className="delivery-view-card" onClick={openCustomerView}>
            <span className="icon-box">
              <Eye size={20} />
            </span>
            <div>
              <strong>Client Approval View</strong>
              <small>
                Clean summary, full-document link, download, and response
                actions.
              </small>
            </div>
            <ChevronRight size={18} />
          </button>
          <button
            className="delivery-view-card"
            onClick={() => setCurrentScreen("official-document")}
          >
            <span className="icon-box">
              <FileText size={20} />
            </span>
            <div>
              <strong>Official Document</strong>
              <small>
                Full itemized version for PDF, print, download, and history.
              </small>
            </div>
            <ChevronRight size={18} />
          </button>
          <button
            className="delivery-view-card"
            onClick={() => setShowEmailPreview(true)}
          >
            <span className="icon-box">
              <Mail size={20} />
            </span>
            <div>
              <strong>Email Message</strong>
              <small>
                Short delivery message with review and download buttons.
              </small>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">Version history</h2>
        <p className="section-copy">Every version stays saved.</p>
        <div className="version-list">
          {estimate.versions.map((version) => (
            <div className="version-row" key={version.id}>
              <span
                className={`version-dot version-dot--${statusTone(version.status)}`}
              >
                <ShieldCheck size={17} />
              </span>
              <span className="grow">
                <strong>
                  Version {version.version} · {version.status}
                </strong>
                <small
                  className="muted"
                  style={{ display: "block", marginTop: 3 }}
                >
                  {new Date(version.createdAt).toLocaleString()}
                </small>
                <small className="muted">{version.changeSummary}</small>
              </span>
              <ChevronRight size={18} className="muted" />
            </div>
          ))}
        </div>
      </section>
      {estimate.internalNote && (
        <div className="internal-note section">
          <LockKeyhole size={20} />
          <div>
            <strong>Internal Only</strong>
            <p>{estimate.internalNote}</p>
          </div>
        </div>
      )}
      <section className="section">
        <button
          className="more-options"
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
        >
          <span className="row">
            <MoreHorizontal size={20} />
            <strong>More Options</strong>
          </span>
          <ChevronDown size={19} />
        </button>
        {showMore && (
          <div className="card panel stack">
            <p className="muted" style={{ margin: 0 }}>
              Advanced settings are intentionally hidden in Simple Mode.
            </p>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <StatusBadge>Visibility controls</StatusBadge>
              <StatusBadge>Progress billing</StatusBadge>
              <StatusBadge>Tax &amp; discount</StatusBadge>
              <StatusBadge>Sync rules</StatusBadge>
            </div>
          </div>
        )}
      </section>
      {showInvoiceBuilder && (
        <Modal
          title="Invoice Approved Work"
          onClose={() => setShowInvoiceBuilder(false)}
        >
          <div className="approved-scope-summary">
            <div>
              <span>Accepted estimate</span>
              <strong>
                ${billingSummary.acceptedEstimateValue.toLocaleString()}
              </strong>
            </div>
            <div>
              <span>Approved changes</span>
              <strong>
                ${billingSummary.approvedChangeOrderValue.toLocaleString()}
              </strong>
            </div>
            <div>
              <span>Already invoiced</span>
              <strong>${billingSummary.invoicedValue.toLocaleString()}</strong>
            </div>
            <div>
              <span>Remaining approved balance</span>
              <strong>
                ${billingSummary.remainingToInvoice.toLocaleString()}
              </strong>
            </div>
          </div>
          <div className="field section">
            <label>How do you want to bill this approved work?</label>
            <select
              className="select"
              value={billingMethod}
              onChange={(event) => {
                setBillingMethod(event.target.value);
                setBillingError("");
              }}
            >
              {[
                "Full Invoice",
                "Deposit Invoice",
                "Percentage Invoice",
                "Section / Category Invoice",
                "Selected Items Invoice",
                "Custom Amount Invoice",
                "Final Balance Invoice",
              ].map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </div>
          {billingMethod === "Percentage Invoice" && (
            <div className="field">
              <label>Percentage</label>
              <select
                className="select"
                value={billingPercent}
                onChange={(event) =>
                  setBillingPercent(Number(event.target.value))
                }
              >
                {[10, 25, 30, 50].map((percent) => (
                  <option key={percent} value={percent}>
                    {percent}%
                  </option>
                ))}
                <option value={75}>75%</option>
              </select>
            </div>
          )}
          {(billingMethod === "Deposit Invoice" ||
            billingMethod === "Custom Amount Invoice") && (
            <div className="field">
              <label>
                {billingMethod === "Deposit Invoice"
                  ? "Deposit amount"
                  : "Custom amount"}
              </label>
              <input
                className="input"
                type="number"
                min="0"
                max={billingSummary.remainingToInvoice}
                value={billingAmount}
                onChange={(event) => {
                  setBillingAmount(event.target.value);
                  setBillingError("");
                }}
              />
            </div>
          )}
          {billingMethod === "Section / Category Invoice" && (
            <div className="approved-scope-picker">
              <strong>Approved sections</strong>
              {(estimate.sections ?? []).map((section) => (
                <label key={section.id}>
                  <input
                    type="checkbox"
                    checked={selectedBillingSections.includes(section.id)}
                    onChange={(event) =>
                      setSelectedBillingSections((current) =>
                        event.target.checked
                          ? [...current, section.id]
                          : current.filter((id) => id !== section.id),
                      )
                    }
                  />
                  {section.title}
                  <span>${section.subtotal.toLocaleString()}</span>
                </label>
              ))}
            </div>
          )}
          {billingMethod === "Selected Items Invoice" && (
            <div className="approved-scope-picker">
              <strong>Approved items</strong>
              {estimate.lineItems.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedBillingItems.includes(item.id)}
                    onChange={(event) =>
                      setSelectedBillingItems((current) =>
                        event.target.checked
                          ? [...current, item.id]
                          : current.filter((id) => id !== item.id),
                      )
                    }
                  />
                  {item.name}
                  <span>
                    ${(item.quantity * item.unitPrice).toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="invoice-proposed-total">
            <span>Invoice amount</span>
            <strong>
              $
              {proposedInvoiceAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>
          {billingError && (
            <div className="alert alert--danger" role="alert">
              <LockKeyhole size={20} />
              <strong>{billingError}</strong>
            </div>
          )}
          <div className="alert alert--info">
            <ShieldCheck size={20} />
            <span>
              The accepted estimate stays locked. Billing above the remaining
              balance or outside approved items requires an accepted change
              order.
            </span>
          </div>
          <div className="modal-actions">
            <Button
              variant="primary"
              disabled={!(proposedInvoiceAmount > 0)}
              onClick={() => {
                if (
                  createInvoiceFromAcceptedEstimate(
                    estimate.id,
                    billingMethod,
                    proposedInvoiceAmount,
                    billingSourceItemIds,
                  )
                ) {
                  setShowInvoiceBuilder(false);
                  setCurrentScreen("money");
                } else {
                  setBillingError(
                    "This was not part of the remaining accepted estimate scope. Create a change order and get customer approval before invoicing it.",
                  );
                }
              }}
            >
              Create Draft Invoice
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                createProtectedFollowUp("change-order");
                setShowInvoiceBuilder(false);
              }}
            >
              Create Change Order
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowInvoiceBuilder(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      {showLockModal && (
        <Modal
          title="This estimate was already accepted."
          onClose={() => setShowLockModal(false)}
        >
          <p>
            To protect both sides, the accepted version will stay locked. Choose
            how you want to handle the change.
          </p>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                createProtectedFollowUp("revision");
                setShowLockModal(false);
              }}
            >
              Create Revision
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                createProtectedFollowUp("change-order");
                setShowLockModal(false);
              }}
            >
              Create Change Order
            </Button>
            <Button
              variant="neutral"
              onClick={() => {
                createProtectedFollowUp("duplicate");
                setShowLockModal(false);
              }}
            >
              Duplicate as New
            </Button>
            <Button variant="ghost" onClick={() => setShowLockModal(false)}>
              View Accepted Version
            </Button>
            <Button variant="ghost" onClick={() => setShowLockModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      {showEmailPreview && (
        <Modal
          title={`Email preview · Estimate ${estimate.number}`}
          onClose={() => setShowEmailPreview(false)}
        >
          <div className="email-preview">
            <div className="row">
              <div className="official-logo">{currentBusiness.initials}</div>
              <div>
                <strong>{currentBusiness.name}</strong>
                <small className="muted" style={{ display: "block" }}>
                  Estimate for {customer?.name}
                </small>
              </div>
            </div>
            <h2>
              $
              {estimate.total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <p>{estimate.deliverySettings?.emailMessage}</p>
            <Button variant="primary" wide onClick={openCustomerView}>
              {estimate.deliverySettings?.reviewButtonLabel ??
                "Review and Approve"}
            </Button>
            <Button
              variant="outline"
              wide
              onClick={() => {
                setShowEmailPreview(false);
                setCurrentScreen("official-document");
              }}
            >
              {estimate.deliverySettings?.downloadButtonLabel ?? "Download PDF"}
            </Button>
            <p className="muted small">
              Reply to {currentBusiness.email} or call {currentBusiness.phone}.
            </p>
          </div>
          <details className="section">
            <summary>Customize email/client preview</summary>
            <div className="stack" style={{ marginTop: 12 }}>
              <label className="field">
                Greeting/message
                <textarea
                  className="textarea"
                  defaultValue={estimate.deliverySettings?.emailMessage}
                />
              </label>
              <label className="row">
                <input
                  type="checkbox"
                  defaultChecked={estimate.deliverySettings?.allowPdfDownload}
                />{" "}
                Allow PDF download
              </label>
              <label className="row">
                <input
                  type="checkbox"
                  defaultChecked={estimate.deliverySettings?.allowChanges}
                />{" "}
                Allow change requests
              </label>
              <label className="row">
                <input
                  type="checkbox"
                  defaultChecked={estimate.deliverySettings?.allowReject}
                />{" "}
                Allow rejection
              </label>
              <label className="row">
                <input
                  type="checkbox"
                  defaultChecked={
                    estimate.deliverySettings?.requireApprovalCheckbox
                  }
                />{" "}
                Require approval checkbox
              </label>
            </div>
          </details>
        </Modal>
      )}
    </section>
  );
}
