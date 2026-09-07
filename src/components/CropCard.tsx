import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Sprout } from "lucide-react";
import { rupees } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export type CropRow = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  harvest_period: string | null;
  available_from: string | null;
  is_damaged: boolean;
  condition: string | null;
  intended_use: string | null;
  labels: string[];
  location_name: string | null;
  profiles?: { id: string; name: string; trust_score: number; badges: string[] } | null;
};

export function CropCard({
  crop,
  areaAverage,
  distance,
}: {
  crop: CropRow;
  areaAverage?: number | null;
  distance?: number | null;
}) {
  const { t } = useI18n();
  const farmer = crop.profiles;

  return (
    <Link
      to="/crop/$id"
      params={{ id: crop.id }}
      className="block rounded-3xl border bg-card p-4 shadow-soft active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <Sprout className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold">{crop.name}</h3>
            {farmer?.badges?.includes("Verified Farmer") && (
              <BadgeCheck className="size-5 shrink-0 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {farmer?.name} · {crop.quantity} {crop.unit}
          </p>
          <p className="mt-1 text-xl font-extrabold text-primary">
            {rupees(crop.price)}/{crop.unit}
            {areaAverage ? (
              <span className="ml-2 align-middle text-xs font-medium text-muted-foreground">
                {t("areaAverage")} {rupees(areaAverage)}
              </span>
            ) : null}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {crop.location_name ?? "—"}
            {distance != null ? ` · ${distance} ${t("km")}` : ""}
          </p>
          {crop.is_damaged && (
            <p className="mt-2 rounded-xl bg-accent/25 px-2 py-1 text-xs font-semibold text-accent-foreground">
              {crop.condition} · {crop.intended_use} · inspect before purchase
            </p>
          )}
          {crop.labels?.length > 0 && !crop.is_damaged && (
            <p className="mt-2 text-xs text-muted-foreground">{crop.labels.join(" · ")}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
