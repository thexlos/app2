import {
  CalendarDays,
  CirclePlus,
  Home,
  MoreHorizontal,
  UsersRound,
} from "lucide-react";
import createOrbit from "../home/premium/assets/decor/create-orbit.svg";
import { PremiumShellLayers } from "../home/premium/PremiumShellLayers";
import type { Screen } from "../../state/AppState";
import { useAppState } from "../../state/AppState";
import "../home/premium/premiumCardSystem.css";

type NavItem = {
  id: "home" | "customers" | "create" | "calendar" | "more";
  label: string;
  icon: typeof Home;
  target: Screen;
  center?: boolean;
};

const items: NavItem[] = [
  { id: "home", label: "Home", icon: Home, target: "home" },
  { id: "customers", label: "Customers", icon: UsersRound, target: "customers" },
  { id: "create", label: "Create", icon: CirclePlus, target: "create", center: true },
  { id: "calendar", label: "Calendar", icon: CalendarDays, target: "calendar" },
  { id: "more", label: "More", icon: MoreHorizontal, target: "help" },
];

function isActive(currentScreen: string, item: NavItem) {
  if (currentScreen === item.target) return true;
  if (item.id === "home" && currentScreen === "setup") return true;

  if (
    item.id === "customers" &&
    [
      "customer-detail",
      "add-customer",
      "add-lead",
      "lead-detail",
      "import-wizard",
      "sync-center",
      "export-center",
    ].includes(currentScreen)
  )
    return true;

  if (
    item.id === "create" &&
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
    item.id === "more" &&
    [
      "help",
      "help-request",
      "help-request-detail",
      "monthly-support",
      "help-guide",
    ].includes(currentScreen)
  )
    return true;

  return false;
}

export function PremiumBottomNavigation() {
  const { currentScreen, setCurrentScreen } = useAppState();

  return (
    <nav className="premium-bottom-nav" aria-label="Main navigation">
      <PremiumShellLayers />
      {items.map((item) => {
        const { id, label, icon: Icon, target, center } = item;
        const active = isActive(currentScreen, item);

        return (
          <button
            key={id}
            type="button"
            className={`premium-bottom-nav__item${active ? " is-active" : ""}${
              center ? " is-center" : ""
            }`}
            onClick={() => setCurrentScreen(target)}
          >
            {center ? (
              <span className="premium-bottom-nav__create">
                <img src={createOrbit} alt="" aria-hidden="true" />
                <Icon aria-hidden="true" />
              </span>
            ) : (
              <span className="premium-bottom-nav__icon">
                <Icon aria-hidden="true" />
              </span>
            )}
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
