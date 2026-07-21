import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import addCustomerArtwork from "../../assets/home/card-bases/v2/action/add_customer_card_base.png";
import businessKitArtwork from "../../assets/home/card-bases/v2/action/business_kit_card_base.png";
import calendarArtwork from "../../assets/home/card-bases/v2/action/calendar_card_base.png";
import createEstimateArtwork from "../../assets/home/card-bases/v2/action/create_estimate_card_base.png";
import createInvoiceArtwork from "../../assets/home/card-bases/v2/action/create_invoice_card_base.png";
import qrCodeArtwork from "../../assets/home/card-bases/v2/action/qr_code_card_base.png";
import customersArtwork from "../../assets/home/card-bases/v2/stat/customers_card_base.png";
import estimatesArtwork from "../../assets/home/card-bases/v2/stat/estimates_card_base.png";
import invoicesArtwork from "../../assets/home/card-bases/v2/stat/invoices_card_base.png";
import tasksArtwork from "../../assets/home/card-bases/v2/stat/tasks_card_base.png";

type ArtworkRegistration = {
  src: string;
  assetKey: string;
  accent: string;
  registration: {
    leftPercent: number;
    topPercent: number;
    widthPercent: number;
    heightPercent: number;
  };
};

export type HomeStatArtworkLabel =
  | "Estimates"
  | "Invoices"
  | "Customers"
  | "Tasks";

export type HomeQuickActionArtworkLabel =
  | "Create Estimate"
  | "Create Invoice"
  | "Add Customer"
  | "Calendar"
  | "QR Code"
  | "Business Kit";

export const homeStatArtworkMap: Record<
  HomeStatArtworkLabel,
  ArtworkRegistration
> = {
  Estimates: {
    src: estimatesArtwork,
    assetKey: "estimates",
    accent: "#168bff",
    registration: {
      leftPercent: -18.344828,
      topPercent: -15.202703,
      widthPercent: 136,
      heightPercent: 134.797297,
    },
  },
  Invoices: {
    src: invoicesArtwork,
    assetKey: "invoices",
    accent: "#23e987",
    registration: {
      leftPercent: -15.909091,
      topPercent: -9.191759,
      widthPercent: 131.818182,
      heightPercent: 126.465927,
    },
  },
  Customers: {
    src: customersArtwork,
    assetKey: "customers",
    accent: "#a95cff",
    registration: {
      leftPercent: -14.678899,
      topPercent: -11.353033,
      widthPercent: 129.226737,
      heightPercent: 124.105754,
    },
  },
  Tasks: {
    src: tasksArtwork,
    assetKey: "tasks",
    accent: "#ff8a18",
    registration: {
      leftPercent: -14.732725,
      topPercent: -9.345048,
      widthPercent: 128.552803,
      heightPercent: 127.476038,
    },
  },
};

export const homeQuickActionArtworkMap: Record<
  HomeQuickActionArtworkLabel,
  ArtworkRegistration
> = {
  "Create Estimate": {
    src: createEstimateArtwork,
    assetKey: "create-estimate",
    accent: "#168bff",
    registration: {
      leftPercent: -16.517494,
      topPercent: -41.954023,
      widthPercent: 132.790887,
      heightPercent: 184.482759,
    },
  },
  "Create Invoice": {
    src: createInvoiceArtwork,
    assetKey: "create-invoice",
    accent: "#23e987",
    registration: {
      leftPercent: -7.545839,
      topPercent: -27.3021,
      widthPercent: 115.091678,
      heightPercent: 155.573506,
    },
  },
  "Add Customer": {
    src: addCustomerArtwork,
    assetKey: "add-customer",
    accent: "#a95cff",
    registration: {
      leftPercent: -18.357083,
      topPercent: -42.80303,
      widthPercent: 136.797988,
      heightPercent: 182.386364,
    },
  },
  Calendar: {
    src: calendarArtwork,
    assetKey: "calendar",
    accent: "#ff8a18",
    registration: {
      leftPercent: -10.436714,
      topPercent: -37.272727,
      widthPercent: 120.799408,
      heightPercent: 175.090909,
    },
  },
  "QR Code": {
    src: qrCodeArtwork,
    assetKey: "qr-code",
    accent: "#ff4fb2",
    registration: {
      leftPercent: -7.303371,
      topPercent: -26.740506,
      widthPercent: 114.606742,
      heightPercent: 152.373418,
    },
  },
  "Business Kit": {
    src: businessKitArtwork,
    assetKey: "business-kit",
    accent: "#168bff",
    registration: {
      leftPercent: -11.617312,
      topPercent: -38.541667,
      widthPercent: 123.917995,
      heightPercent: 167.1875,
    },
  },
};

function artworkStyle(registration: ArtworkRegistration["registration"]): CSSProperties {
  return {
    left: `${registration.leftPercent}%`,
    top: `${registration.topPercent}%`,
    width: `${registration.widthPercent}%`,
    height: `${registration.heightPercent}%`,
  };
}

type CardButtonStyle = CSSProperties & {
  "--home-card-accent": string;
};

export function HomeStatArtworkCard({
  label,
  value,
  trend,
  tone,
  onClick,
}: {
  label: HomeStatArtworkLabel;
  value: number;
  trend: string;
  tone: string;
  onClick: () => void;
}) {
  const artwork = homeStatArtworkMap[label];
  const compactValue = String(value).length >= 3;

  return (
    <button
      className={`home-stat-card home-stat-card--artwork home-tone-${tone}${compactValue ? " home-stat-card--compact-value" : ""}`}
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      data-home-artwork-card="stat"
      data-artwork-key={artwork.assetKey}
      style={{ "--home-card-accent": artwork.accent } as CardButtonStyle}
    >
      <img
        className="home-card-artwork"
        src={artwork.src}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={artworkStyle(artwork.registration)}
      />
      <span className="home-stat-card__label">{label}</span>
      <strong>{value}</strong>
      <span className="home-stat-card__trend">{trend}</span>
    </button>
  );
}

export function HomeQuickActionArtworkCard({
  label,
  tone,
  onClick,
}: {
  label: HomeQuickActionArtworkLabel;
  tone: string;
  onClick: () => void;
}) {
  const artwork = homeQuickActionArtworkMap[label];
  const labelWords = label.split(" ");

  return (
    <button
      className={`home-action-card home-action-card--artwork home-tone-${tone}`}
      onClick={onClick}
      aria-label={label}
      data-home-artwork-card="quick-action"
      data-artwork-key={artwork.assetKey}
      style={{ "--home-card-accent": artwork.accent } as CardButtonStyle}
    >
      <img
        className="home-card-artwork"
        src={artwork.src}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={artworkStyle(artwork.registration)}
      />
      <span className="home-action-card__copy">
        <strong>
          {label === "Calendar" ? (
            label
          ) : (
            <>
              <span>{labelWords[0]}</span>{" "}
              <span>{labelWords.slice(1).join(" ")}</span>
            </>
          )}
        </strong>
      </span>
      <ArrowRight className="home-action-card__arrow" size={15} />
    </button>
  );
}
