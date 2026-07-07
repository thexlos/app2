import type { ReactNode } from "react";
import { BrandHeader } from "../components/common/ScreenHeader";
import { Notice } from "../components/common/Notice";
import { BottomNavigation } from "../components/navigation/Navigation";
import type { Screen } from "../state/AppState";

const topLevelScreens: Screen[] = [
  "home",
  "customers",
  "money",
  "create",
  "help",
];

export function AppShell({
  screen,
  children,
}: {
  screen: Screen;
  children: ReactNode;
}) {
  const showAppHeader = topLevelScreens.includes(screen);
  return (
    <div className="app-shell">
      {showAppHeader && (
        <div className="app-header">
          <BrandHeader />
        </div>
      )}
      <main>{children}</main>
      <BottomNavigation />
      <Notice />
    </div>
  );
}
