import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Calendar, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import type { CropRow } from "@/components/CropCard";
import { supabase } from "@/integrations/supabase/client";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/crop/$id")({
  head: () => ({
    meta: [
      { title: "Crop details — FarmDirect" },
      { name: "description", content: "See the farmer, price, quantity, harvest date and recent price trend." },
      { property: "og:title", content: "Crop details — FarmDirect" },
      { property: "og:description", content: "Transparent farm-direct pricing with a 7-day price trend." },
    ],
  }),
  component: CropDetail,
});

function CropDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { t, speechLocale } = useI18n();
  const { addToCart, settings } = useApp();
  const [qty, setQty] = useState(1);

  const crop = useQuery({
    queryKey: ["crop", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crops")
        .select("*, profiles!crops_farmer_id_fkey(id, name, trust_score, badges, location_name)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as (CropRow & { profiles: { id: string; name: string; trust_score: number; badges: string[] } }) | null;
    },
  });

  const trend = useQuery({
    queryKey: ["trend", crop.data?.name],
    enabled: Boolean(crop.data?.name),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_history")
        .select("price, recorded_at")
        .ilike("crop_name", crop.data!.name)
        .order("recorded_at");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        day: row.recorded_at.slice(5),
        price: Number(row.price),
      }));
    },
  });

  if (crop.isLoading) return <AppShell>…</AppShell>;
  if (!crop.data) return <AppShell>{t("noResults")}</AppShell>;

  const c = crop.data;
  const average = trend.data?.length
    ? Math.round(trend.data.reduce((s, p) => s + p.price, 0) / trend.data.length)
    : null;

  const add = () => {
    if (qty > c.quantity) {
      toast.error(`Only ${c.quantity} ${c.unit} available`);
      return;
    }
    addToCart({
      cropId: c.id,
      cropName: c.name,
      farmerId: c.profiles.id,
      farmerName: c.profiles.name,
      unit: c.unit,
      unitPrice: Number(c.price),
      quantity: qty,
    });
    toast.success(t("addedToCart"));
    if (settings.voice) {
      speak(
        `${qty} ${c.unit} of ${c.name} from ${c.profiles.name} costs ${Math.round(qty * Number(c.price))} rupees. Added to your cart.`,
        speechLocale,
      );
    }
  };

  return (
    <AppShell title={c.name}>
      <div className="rounded-3xl border bg-card p-5 shadow-soft">
        <h2 className="text-3xl font-extrabold">{c.name}</h2>
        <p className="mt-1 text-2xl font-extrabold text-primary">
          {rupees(Number(c.price))}/{c.unit}
          {average ? (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {t("areaAverage")} {rupees(average)}
            </span>
          ) : null}
        </p>

        <div className="mt-4 grid gap-2 text-sm">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> {c.profiles.name} · {t("trustScore")}{" "}
            {c.profiles.trust_score}/100
          </p>
          {c.profiles.badges?.length > 0 && (
            <p className="flex flex-wrap gap-2">
              {c.profiles.badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  <BadgeCheck className="size-3.5" /> {badge}
                </span>
              ))}
            </p>
          )}
          <p className="flex items-center gap-2">
            <MapPin className="size-4" /> {c.location_name}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="size-4" /> {c.harvest_period} · {t("availableFrom")}{" "}
            {c.available_from}
          </p>
          <p className="text-muted-foreground">{c.description}</p>
          <p className="font-semibold">
            {t("quantity")}: {c.quantity} {c.unit}
          </p>
          {c.is_damaged && (
            <p className="rounded-2xl bg-accent/25 p-3 text-xs font-semibold">
              Post-harvest lot — {c.condition}. Intended use: {c.intended_use}. Not for human
              consumption; inspect before buying.
            </p>
          )}
        </div>
      </div>

      {trend.data && trend.data.length > 1 && (
        <div className="mt-4 rounded-3xl border bg-card p-4 shadow-soft">
          <h3 className="font-bold">{t("priceTrend")}</h3>
          <div className="mt-2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis width={32} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-3xl border bg-card p-4 shadow-soft">
        <p className="font-semibold">{t("quantity")}</p>
        <div className="mt-2 flex items-center gap-4">
          <button
            aria-label="less"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            className="flex size-14 items-center justify-center rounded-2xl border-2"
          >
            <Minus />
          </button>
          <span className="min-w-16 text-center text-3xl font-extrabold">{qty}</span>
          <button
            aria-label="more"
            onClick={() => setQty((v) => v + 1)}
            className="flex size-14 items-center justify-center rounded-2xl border-2"
          >
            <Plus />
          </button>
          <span className="ml-auto text-xl font-bold">{rupees(qty * Number(c.price))}</span>
        </div>
        <div className="mt-4 grid gap-3">
          <button
            onClick={add}
            className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground active:scale-95"
          >
            {t("addToCart")}
          </button>
          <button
            onClick={() => {
              add();
              navigate({ to: "/cart" });
            }}
            className="rounded-2xl border-2 py-4 text-lg font-bold active:scale-95"
          >
            {t("buyNow")}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
