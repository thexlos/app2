import {
  ArrowRight,
  BookOpenCheck,
  Brush,
  ClipboardList,
  DoorOpen,
  Flag,
  Hammer,
  ImagePlus,
  Library,
  Link2,
  MailPlus,
  MapPinned,
  MessageSquarePlus,
  Printer,
  QrCode,
  Share2,
  Sparkles,
  Star,
  UserRoundCheck,
  Vault,
} from "lucide-react";
import { useAppState } from "../state/AppState";

export const workshopTools = [
  {
    label: "Make a Flyer",
    icon: Brush,
    detail: "Build a flyer for social, print, email, or text.",
  },
  {
    label: "Create QR Code",
    icon: QrCode,
    detail: "Create a reusable QR code and test the destination.",
  },
  {
    label: "Business Cards",
    icon: UserRoundCheck,
    detail: "Prepare front and back with print-safe guidance.",
  },
  {
    label: "Send Promotion",
    icon: MailPlus,
    detail: "Choose customers, prepare a message, and preview it.",
  },
  {
    label: "Review Booster",
    icon: Star,
    detail: "Create a review link, QR card, and follow-up message.",
  },
  {
    label: "Lead Forms",
    icon: MessageSquarePlus,
    detail: "Create a public form, link, and matching QR code.",
  },
  {
    label: "Menu / Price Sheet",
    icon: ClipboardList,
    detail: "Prepare a clear menu or service price sheet.",
  },
  {
    label: "Yard Sign",
    icon: MapPinned,
    detail: "Use a print-safe sign layout with a tested QR code.",
  },
  {
    label: "Door Hanger",
    icon: DoorOpen,
    detail: "Create a door hanger with safe areas and a clear offer.",
  },
  {
    label: "Event Promo",
    icon: Flag,
    detail: "Coordinate event details across posts, flyers, and messages.",
  },
  {
    label: "Fix Something",
    icon: Hammer,
    detail: "Upload an existing design and diagnose what needs attention.",
  },
  {
    label: "Canva Help",
    icon: ImagePlus,
    detail: "Prepare content, save a share link, or upload a screenshot.",
  },
  {
    label: "VistaPrint / Print Setup Help",
    icon: Printer,
    detail: "Check sizing, bleed, safe area, and print export.",
  },
];

export function CreateScreen() {
  const { openCreateTask, setCurrentScreen } = useAppState();
  return (
    <section className="screen">
      <h1 className="page-title">What are you making?</h1>
      <p className="page-subtitle">
        Choose a tool first. Then decide whether to build it yourself, use a
        guided walkthrough, or request Start Here help.
      </p>
      <section className="creation-hub-card section">
        <div className="row">
          <span className="icon-box">
            <Library size={23} />
          </span>
          <div>
            <h2>My Creations</h2>
            <p>Find, reuse, edit, send, post, or download anything you made.</p>
          </div>
        </div>
        <div className="creation-hub-actions">
          <button onClick={() => setCurrentScreen("workshop-library")}>
            View My Creations
          </button>
          <button onClick={() => setCurrentScreen("workshop-library")}>
            Recent Creations
          </button>
        </div>
      </section>
      <button
        className="create-feature section"
        onClick={() => openCreateTask("Create Post")}
      >
        <span className="icon-box">
          <Share2 size={23} />
        </span>
        <span className="grow">
          <strong>Create Post</strong>
          <small>Start a Facebook, Instagram, or Google Business post.</small>
        </span>
        <ArrowRight size={20} />
      </button>
      <section className="section">
        <div>
          <h2 className="section-heading">Workshop tools</h2>
          <p className="section-copy">Every tool starts in Simple Mode.</p>
        </div>
        <div className="workshop-list">
          {workshopTools.map(({ label, icon: Icon, detail }) => (
            <button
              className="workshop-card"
              key={label}
              onClick={() => openCreateTask(label)}
            >
              <span className="icon-box">
                <Icon size={21} />
              </span>
              <span className="grow">
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-heading">More tools</h2>
        <div className="utility-links" style={{ marginTop: 10 }}>
          <button onClick={() => setCurrentScreen("my-business-kit")}>
            <span className="row">
              <BookOpenCheck size={21} />
              <span>
                <strong>My Business Kit</strong>
                <small>
                  Your saved brand, items, templates, and print files
                </small>
              </span>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={() => setCurrentScreen("business-kits")}>
            <span className="row">
              <Sparkles size={21} />
              <span>
                <strong>Business Kits</strong>
                <small>Starter setups and templates</small>
              </span>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={() => setCurrentScreen("file-vault")}>
            <span className="row">
              <Vault size={21} />
              <span>
                <strong>File Vault</strong>
                <small>Files, exports, and uploads</small>
              </span>
            </span>
            <ArrowRight size={19} />
          </button>
          <button onClick={() => setCurrentScreen("integrations")}>
            <span className="row">
              <Link2 size={21} />
              Connected Accounts
            </span>
            <ArrowRight size={19} />
          </button>
        </div>
      </section>
    </section>
  );
}
