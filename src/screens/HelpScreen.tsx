import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Brush,
  FileText,
  HandHeart,
  HelpingHand,
  Image,
  LockKeyhole,
  Printer,
  QrCode,
  Sparkles,
  UserRoundCog,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { StatusBadge, statusTone } from "../components/common/StatusBadge";
import { guideResources, helpServices } from "../config/helpCatalog";
import { useAppState } from "../state/AppState";

const featuredKeys = [
  "fix_flyer",
  "business_card_setup",
  "qr_code_setup",
  "canva_help",
  "vistaprint_setup",
  "logo_cleanup",
  "custom_business_kit",
  "document_template_setup",
];
const serviceIcons = {
  fix_flyer: Brush,
  business_card_setup: BriefcaseBusiness,
  qr_code_setup: QrCode,
  canva_help: Image,
  vistaprint_setup: Printer,
  logo_cleanup: Sparkles,
  custom_business_kit: UserRoundCog,
  document_template_setup: FileText,
} as const;

export function HelpScreen() {
  const {
    workspace,
    openHelpRequest,
    openHelpRequestDetail,
    openHelpGuide,
    setCurrentScreen,
  } = useAppState();
  const featured = helpServices.filter((service) =>
    featuredKeys.includes(service.serviceKey),
  );
  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <section className="screen">
      <h1 className="page-title">Help</h1>
      <p className="page-subtitle">
        Start Here support, active projects, quotes, files, and practical
        guides.
      </p>
      <section className="help-hero section">
        <span className="icon-box">
          <HandHeart size={25} />
        </span>
        <h2>Need Start Here Help?</h2>
        <p>
          Choose the kind of help you need. The request will ask the right
          questions and attach your files without asking for passwords.
        </p>
        <div className="help-hero__actions">
          <Button variant="primary" onClick={() => openHelpRequest("general")}>
            Start a Help Request
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollTo("current-requests")}
          >
            View My Requests
          </Button>
          <Button variant="neutral" onClick={() => scrollTo("help-guides")}>
            View Guides
          </Button>
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">Start Here services</h2>
        <p className="section-copy">
          Each service has its own questions, uploads, and next steps.
        </p>
        <div className="help-service-grid">
          {featured.map((service) => {
            const Icon =
              serviceIcons[service.serviceKey as keyof typeof serviceIcons] ??
              HelpingHand;
            return (
              <button
                key={service.serviceKey}
                onClick={() => openHelpRequest(service.serviceKey)}
              >
                <span className="icon-box">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{service.title}</strong>
                  <small>{service.startingPriceText}</small>
                </span>
                <ArrowRight size={17} />
              </button>
            );
          })}
        </div>
      </section>
      <section className="section" id="current-requests">
        <div className="between">
          <div>
            <h2 className="section-heading">Current requests</h2>
            <p className="section-copy">
              Open a request to see its quote, files, timeline, and next action.
            </p>
          </div>
        </div>
        <div className="request-card-list">
          {workspace.helpRequests.slice(0, 4).map((request) => (
            <button
              className="request-card"
              key={request.id}
              onClick={() => openHelpRequestDetail(request.id)}
            >
              <span className="icon-box">
                <HelpingHand size={20} />
              </span>
              <span className="grow">
                <strong>{request.type}</strong>
                <small>{request.description}</small>
                <small>
                  {request.fileNames.length} file
                  {request.fileNames.length === 1 ? "" : "s"} · Updated{" "}
                  {request.updatedAt
                    ? new Date(request.updatedAt).toLocaleDateString()
                    : "this week"}
                </small>
              </span>
              <span>
                <StatusBadge tone={statusTone(request.status)}>
                  {request.status}
                </StatusBadge>
                {request.quoteStatus && <small>{request.quoteStatus}</small>}
              </span>
            </button>
          ))}
        </div>
      </section>
      <button
        className="monthly-support section"
        onClick={() => setCurrentScreen("monthly-support")}
      >
        <div>
          <h2>Monthly support</h2>
          <p>
            Compare ongoing support for small fixes, setup questions, and
            business materials.
          </p>
        </div>
        <ArrowRight size={20} />
      </button>
      <section className="section" id="help-guides">
        <h2 className="section-heading">Guides &amp; resources</h2>
        <div className="guide-grid">
          {guideResources.map((guide) => (
            <button
              key={guide.guideKey}
              onClick={() => openHelpGuide(guide.guideKey)}
            >
              <BookOpen size={19} />
              <span>
                <strong>{guide.title}</strong>
                <small>{guide.shortDescription}</small>
              </span>
              <ArrowRight size={16} className="muted" />
            </button>
          ))}
        </div>
      </section>
      <section className="helper-access-card section">
        <LockKeyhole size={24} />
        <div>
          <h2>Helper Access</h2>
          <p>
            Use files, screenshots, share links, and project access inside Start
            Here Helper. Never share account passwords.
          </p>
        </div>
      </section>
    </section>
  );
}
