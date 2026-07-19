import { ArrowRight, MapPin } from "lucide-react";
import locationRings from "./assets/decor/location-rings.svg";
import { PremiumShellLayers } from "./PremiumShellLayers";
import type { PremiumScheduleItem } from "./premiumTypes";

export function PremiumScheduleCard({
  month,
  day,
  weekday,
  title,
  detail,
  status,
  extra,
  onClick,
}: PremiumScheduleItem) {
  return (
    <button
      type="button"
      className="premium-card premium-card--schedule premium-tone-cyan"
      onClick={onClick}
      aria-label={`Open calendar for ${title}`}
    >
      <PremiumShellLayers />
      <span className="premium-card__content premium-schedule__content">
        <span className="premium-schedule__date">
          <span>{month}</span>
          <strong>{day}</strong>
          <span>{weekday}</span>
        </span>
        <span className="premium-schedule__divider" aria-hidden="true" />
        <span className="premium-schedule__main">
          <strong>{title}</strong>
          <span>{detail}</span>
          <small>{status}</small>
        </span>
        <span className="premium-schedule__location" aria-hidden="true">
          <img src={locationRings} alt="" />
          <MapPin />
        </span>
        {extra ? <span className="premium-schedule__extra">{extra}</span> : null}
        <ArrowRight className="premium-schedule__arrow" aria-hidden="true" />
      </span>
    </button>
  );
}
