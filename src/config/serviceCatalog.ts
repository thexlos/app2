export interface ServiceCatalogItem {
  id: string;
  name: string;
  startingPrice: number;
  size:
    | "Quick Fix"
    | "Setup Help"
    | "Clean It Up"
    | "Full Redesign"
    | "Custom Quote Needed";
}

// Mock settings only. Replace with admin-managed database settings later.
export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: "flyer-refresh",
    name: "Flyer Refresh",
    startingPrice: 25,
    size: "Quick Fix",
  },
  {
    id: "promo-graphic",
    name: "Simple Promo Graphic",
    startingPrice: 35,
    size: "Quick Fix",
  },
  {
    id: "custom-flyer",
    name: "Custom Flyer / Event Graphic",
    startingPrice: 65,
    size: "Clean It Up",
  },
  {
    id: "business-card-files",
    name: "Business Card Design Files",
    startingPrice: 45,
    size: "Setup Help",
  },
  {
    id: "business-card",
    name: "Business Card Setup for Print",
    startingPrice: 45,
    size: "Setup Help",
  },
  {
    id: "qr-code",
    name: "QR Code Setup",
    startingPrice: 25,
    size: "Quick Fix",
  },
  {
    id: "vistaprint",
    name: "VistaPrint Setup Help",
    startingPrice: 35,
    size: "Setup Help",
  },
  {
    id: "canva-help",
    name: "Canva Help",
    startingPrice: 35,
    size: "Setup Help",
  },
  {
    id: "logo-cleanup",
    name: "Logo Cleanup",
    startingPrice: 75,
    size: "Clean It Up",
  },
  {
    id: "starter-logo",
    name: "Starter Logo",
    startingPrice: 100,
    size: "Full Redesign",
  },
  {
    id: "menu-cleanup",
    name: "Menu / Price Sheet Cleanup",
    startingPrice: 75,
    size: "Clean It Up",
  },
  {
    id: "event-pack",
    name: "Event Mini Pack",
    startingPrice: 95,
    size: "Full Redesign",
  },
  {
    id: "booking-link",
    name: "Booking / Payment Link Setup",
    startingPrice: 35,
    size: "Setup Help",
  },
  {
    id: "business-profile",
    name: "Business Profile Setup",
    startingPrice: 65,
    size: "Setup Help",
  },
  {
    id: "website-refresh",
    name: "Website Refresh",
    startingPrice: 150,
    size: "Custom Quote Needed",
  },
  {
    id: "basic-kit",
    name: "Basic Kit Setup",
    startingPrice: 99,
    size: "Setup Help",
  },
  {
    id: "pro-kit",
    name: "Pro Kit Setup",
    startingPrice: 199,
    size: "Clean It Up",
  },
  {
    id: "full-workshop",
    name: "Full Business Workshop Setup",
    startingPrice: 399,
    size: "Custom Quote Needed",
  },
];
