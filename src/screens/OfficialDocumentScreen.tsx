import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { Button } from "../components/common/Button";
import { DetailHeader } from "../components/common/ScreenHeader";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { downloadEstimatePdf } from "../services/export/officialDocumentPdf";
import { useAppState } from "../state/AppState";
import type { BusinessProfile, Customer, Estimate } from "../types/models";

function OfficialDocument({
  estimate,
  business,
  customer,
  publicToken,
}: {
  estimate: Estimate;
  business: BusinessProfile;
  customer?: Customer;
  publicToken?: string;
}) {
  const visibleSections = (estimate.sections ?? []).filter(
    (section) => section.pdfVisible && !section.internalOnly,
  );
  return (
    <>
      <div className="document-actions no-print">
        <Button
          variant="outline"
          icon={<Download size={18} />}
          onClick={() => downloadEstimatePdf(estimate, business, customer)}
        >
          Download PDF
        </Button>
        {publicToken && (
          <Button
            variant="ghost"
            icon={<ArrowLeft size={18} />}
            onClick={() => {
              window.location.hash = `/approve/${publicToken}`;
            }}
          >
            Back to Approval
          </Button>
        )}
      </div>
      <article className="official-document">
        <header className="official-document__header">
          <div>
            <div className="official-logo">{business.initials}</div>
            <h1>{business.name}</h1>
            <p>
              {business.phone}
              <br />
              {business.email}
            </p>
          </div>
          <div className="official-document__title">
            <span>
              {estimate.title ??
                estimate.deliverySettings?.documentTitle ??
                "ESTIMATE"}
            </span>
            <strong>{estimate.number}</strong>
            <small>
              {estimate.estimateDate
                ? new Date(
                    `${estimate.estimateDate}T12:00:00`,
                  ).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </small>
          </div>
        </header>
        <section className="official-party-grid">
          <div>
            <span>Prepared for</span>
            <strong>{customer?.name ?? "Customer"}</strong>
            <p>{customer?.address}</p>
          </div>
          <div>
            <span>Project</span>
            <strong>{estimate.projectName}</strong>
            <p>
              Version {estimate.versions[0]?.version ?? 1} · {estimate.status}
            </p>
          </div>
        </section>
        <section className="official-items">
          <div className="official-items__head">
            <span>Description</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Total</span>
          </div>
          {visibleSections.length
            ? visibleSections.map((section) => (
                <div key={section.id}>
                  <h2 className="official-section-title">{section.title}</h2>
                  {estimate.lineItems
                    .filter(
                      (item) =>
                        item.sectionId === section.id &&
                        item.visibleToCustomer &&
                        item.pdfVisible !== false &&
                        !item.internalOnly,
                    )
                    .map((item) => (
                      <div className="official-item" key={item.id}>
                        <span>
                          <strong>{item.name}</strong>
                          {item.description && (
                            <small>{item.description}</small>
                          )}
                        </span>
                        <span>{item.quantity}</span>
                        <span>${item.unitPrice.toLocaleString()}</span>
                        <strong>
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                </div>
              ))
            : estimate.lineItems
                .filter((item) => item.visibleToCustomer)
                .map((item) => (
                  <div className="official-item" key={item.id}>
                    <span>
                      <strong>{item.name}</strong>
                      {item.description && <small>{item.description}</small>}
                    </span>
                    <span>{item.quantity}</span>
                    <span>${item.unitPrice.toLocaleString()}</span>
                    <strong>
                      ${(item.quantity * item.unitPrice).toLocaleString()}
                    </strong>
                  </div>
                ))}
        </section>
        <div className="official-total">
          <span>Estimate total</span>
          <strong>
            $
            {estimate.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
        <section className="official-terms">
          <h2>Terms &amp; notes</h2>
          {estimate.numberedNotes?.map((note, index) => (
            <p key={`${note}-${index}`}>
              {index + 1}. {note}
            </p>
          ))}
          <p>
            {estimate.termsData
              ? `${estimate.termsData.paymentTerms}. ${estimate.termsData.changeOrderPolicy}`
              : estimate.deliverySettings?.terms}
          </p>
        </section>
        <section className="official-signature">
          <div />
          <span>Customer approval / signature</span>
        </section>
        <footer>
          <ShieldCheck size={18} />
          <span>{estimate.deliverySettings?.documentFooter}</span>
          <StatusBadge tone={statusTone(estimate.status)}>
            {estimate.status}
          </StatusBadge>
        </footer>
      </article>
    </>
  );
}

export function OfficialDocumentScreen() {
  const { workspace, selectedEstimateId, currentBusiness } = useAppState();
  const estimate =
    workspace.estimates.find((item) => item.id === selectedEstimateId) ??
    workspace.estimates[0];
  const customer = workspace.customers.find(
    (item) => item.id === estimate.customerId,
  );
  return (
    <section className="screen screen--detail document-screen">
      <DetailHeader title="Official Document" backTo="estimate-detail" />
      <div className="section">
        <h1 className="page-title">Official downloadable document</h1>
        <p className="page-subtitle">
          This full version is designed for download, printing, saving, and
          protected version history.
        </p>
      </div>
      <OfficialDocument
        estimate={estimate}
        business={currentBusiness}
        customer={customer}
      />
    </section>
  );
}

export function PublicOfficialDocumentPage({ token }: { token: string }) {
  const { workspace, currentBusiness } = useAppState();
  const estimate = workspace.estimates.find(
    (item) => item.approvalToken === token,
  );
  if (!estimate)
    return (
      <main className="public-page">
        <section className="public-card">
          <h1>Document not available</h1>
          <p>Ask the business for a new secure link.</p>
        </section>
      </main>
    );
  const customer = workspace.customers.find(
    (item) => item.id === estimate.customerId,
  );
  return (
    <main className="public-document-page">
      <OfficialDocument
        estimate={estimate}
        business={currentBusiness}
        customer={customer}
        publicToken={token}
      />
    </main>
  );
}
