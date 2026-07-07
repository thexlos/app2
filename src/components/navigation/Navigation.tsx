import {
  CircleHelp,
  Hammer,
  Home,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type { MainTab } from "../../state/AppState";
import { useAppState } from "../../state/AppState";

const items: { id: MainTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "customers", label: "Customers", icon: UsersRound },
  { id: "money", label: "Money", icon: WalletCards },
  { id: "create", label: "Create", icon: Hammer },
  { id: "help", label: "Help", icon: CircleHelp },
];

function isTabActive(currentScreen: string, tab: MainTab) {
  if (currentScreen === tab) return true;
  if (
    tab === "customers" &&
    [
      "customer-detail",
      "add-customer",
      "add-lead",
      "lead-detail",
      "import-wizard",
      "sync-center",
      "export-center",
      "calendar",
    ].includes(currentScreen)
  )
    return true;
  if (tab === "money" && currentScreen === "estimate-detail") return true;
  if (
    tab === "money" &&
    ["estimate-builder", "invoice-builder"].includes(currentScreen)
  )
    return true;
  if (tab === "money" && currentScreen === "official-document") return true;
  if (
    tab === "create" &&
    [
      "business-kits",
      "my-business-kit",
      "global-library",
      "integrations",
      "file-vault",
      "workshop-library",
      "template-library",
      "template-detail",
      "document-style-editor",
      "asset-detail",
      "create-mode",
      "create-builder",
      "create-wizard",
    ].includes(currentScreen)
  )
    return true;
  if (
    tab === "help" &&
    [
      "help-request",
      "help-request-detail",
      "monthly-support",
      "help-guide",
    ].includes(currentScreen)
  )
    return true;
  if (tab === "home" && currentScreen === "setup") return true;
  return false;
}

export function BottomNavigation() {
  const { currentScreen, setCurrentScreen } = useAppState();
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`bottom-nav__item${isTabActive(currentScreen, id) ? " bottom-nav__item--active" : ""}`}
          onClick={() => setCurrentScreen(id)}
        >
          <Icon size={22} strokeWidth={2.1} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
