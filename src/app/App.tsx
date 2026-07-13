import { useEffect, useState } from "react";
import "../components/navigation/navigation.css";
import { useAppState } from "../state/AppState";
import { AppShell } from "./AppShell";
import { HomeScreen } from "../screens/HomeScreen";
import {
  CustomersScreen,
  CustomerDetailScreen,
} from "../screens/CustomersScreen";
import { MoneyScreen, EstimateDetailScreen } from "../screens/MoneyScreen";
import { CreateScreen } from "../screens/CreateScreen";
import { HelpScreen } from "../screens/HelpScreen";
import { BusinessKitsScreen } from "../screens/BusinessKitsScreen";
import { IntegrationCenterScreen } from "../screens/IntegrationCenterScreen";
import { SetupScreen } from "../screens/SetupScreen";
import { FileVaultScreen } from "../screens/FileVaultScreen";
import { PublicApprovalPage } from "../screens/PublicApprovalPage";
import {
  CreateModeScreen,
  CreateBuilderScreen,
  CreateWizardScreen,
} from "../screens/CreateFlowScreens";
import { HelpRequestScreen } from "../screens/HelpRequestScreen";
import {
  OfficialDocumentScreen,
  PublicOfficialDocumentPage,
} from "../screens/OfficialDocumentScreen";
import { WorkshopLibraryScreen } from "../screens/WorkshopLibraryScreen";
import { EstimateBuilderScreen } from "../screens/EstimateBuilderScreen";
import { MyBusinessKitScreen } from "../screens/MyBusinessKitScreen";
import { QRCodeDetailScreen } from "../screens/QRCodeDetailScreen";
import { TrashScreen } from "../screens/TrashScreen";
import {
  HelpGuideScreen,
  HelpRequestDetailScreen,
  MonthlySupportScreen,
} from "../screens/HelpSupportScreens";
import {
  AddCustomerScreen,
  AddLeadScreen,
} from "../screens/CustomerFormsScreen";
import { InvoiceBuilderScreen } from "../screens/InvoiceBuilderScreen";
import { GlobalLibraryScreen } from "../screens/GlobalLibraryScreen";
import {
  CalendarScreen,
  ExportCenterScreen,
  ImportWizardScreen,
  LeadDetailScreen,
  SyncCenterScreen,
} from "../screens/BusinessOperationsScreens";
import {
  AssetDetailScreen,
  DocumentStyleEditorScreen,
  TemplateDetailScreen,
  TemplateLibraryScreen,
} from "../screens/TemplateAndAssetScreens";
import "../screens/home.css";
import "../screens/customers.css";
import "../screens/money.css";
import "../screens/public.css";
import "../screens/create.css";
import "../screens/create-flow.css";
import "../screens/help.css";
import "../screens/kits.css";
import "../screens/integrations.css";
import "../screens/setup.css";
import "../screens/document.css";
import "../screens/library.css";
import "../screens/estimate-builder.css";
import "../screens/business-home-kit.css";
import "../screens/global-library.css";
import "../screens/operations.css";
import "../screens/template-assets.css";

const screens = {
  home: HomeScreen,
  customers: CustomersScreen,
  money: MoneyScreen,
  create: CreateScreen,
  help: HelpScreen,
  "business-kits": BusinessKitsScreen,
  "my-business-kit": MyBusinessKitScreen,
  "global-library": GlobalLibraryScreen,
  integrations: IntegrationCenterScreen,
  "estimate-detail": EstimateDetailScreen,
  "estimate-builder": EstimateBuilderScreen,
  "invoice-builder": InvoiceBuilderScreen,
  "customer-detail": CustomerDetailScreen,
  "add-customer": AddCustomerScreen,
  "add-lead": AddLeadScreen,
  "lead-detail": LeadDetailScreen,
  "import-wizard": ImportWizardScreen,
  "sync-center": SyncCenterScreen,
  "export-center": ExportCenterScreen,
  calendar: CalendarScreen,
  "template-library": TemplateLibraryScreen,
  "template-detail": TemplateDetailScreen,
  "document-style-editor": DocumentStyleEditorScreen,
  "asset-detail": AssetDetailScreen,
  setup: SetupScreen,
  "file-vault": FileVaultScreen,
  "workshop-library": WorkshopLibraryScreen,
  "qr-detail": QRCodeDetailScreen,
  trash: TrashScreen,
  "create-mode": CreateModeScreen,
  "create-builder": CreateBuilderScreen,
  "create-wizard": CreateWizardScreen,
  "help-request": HelpRequestScreen,
  "help-request-detail": HelpRequestDetailScreen,
  "monthly-support": MonthlySupportScreen,
  "help-guide": HelpGuideScreen,
  "official-document": OfficialDocumentScreen,
};

export function App() {
  const { currentScreen } = useAppState();
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentScreen]);
  if (hash.startsWith("#/approve/"))
    return <PublicApprovalPage token={hash.replace("#/approve/", "")} />;
  if (hash.startsWith("#/document/"))
    return (
      <PublicOfficialDocumentPage token={hash.replace("#/document/", "")} />
    );
  const ScreenComponent = screens[currentScreen];
  return (
    <AppShell screen={currentScreen}>
      <ScreenComponent />
    </AppShell>
  );
}
