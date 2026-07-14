import {
  CalendarDays,
  CirclePlus,
  Home,
  MoreHorizontal,
  UsersRound,
} from "lucide-react";
import type { Screen } from "../../state/AppState";
import { useAppState } from "../../state/AppState";

type NavItem = {
  id: "home" | "customers" | "create" | "calendar" | "more";
  label: string;
  icon: typeof Home;
  target: Screen;
  isCenter?: boolean;
};

const items: NavItem[] = [
  { id: "home", label: "Home", icon: Home, target: "home" },
  { id: "customers", label: "Customers", icon: UsersRound, target: "customers" },
  { id: "create", label: "Create", icon: CirclePlus, target: "create", isCenter: true },
  { id: "calendar", label: "Calendar", icon: CalendarDays, target: "calendar" },
  { id: "more", label: "More", icon: MoreHorizontal, target: "help" },
];

function isTabActive(currentScreen: string, item: NavItem) {
  if (currentScreen === item.target) return true;
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
  if (item.id === "calendar" && currentScreen === "calendar") return true;
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
  if (item.id === "home" && currentScreen === "setup") return true;
  return false;
}

export function BottomNavigation() {
  const { currentScreen, setCurrentScreen } = useAppState();
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => {
        const { id, label, icon: Icon, target, isCenter } = item;
        const active = isTabActive(currentScreen, item);
        return (
          <button
            key={id}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}${isCenter ? " bottom-nav__item--create" : ""}`}
            onClick={() => setCurrentScreen(target)}
          >
            <span className="bottom-nav__icon-wrap">
              <Icon
                size={isCenter ? 34 : 23}
                strokeWidth={isCenter ? 2.2 : 2.05}
              />
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
