import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";
import { listenOnce, speak } from "@/lib/voice";

export const Route = createFileRoute("/farmer/add-crop")({
  head: () => ({
    meta: [
      { title: "Add a crop — FarmDirect" },
      { name: "description", content: "List a crop in a few taps, or speak the details out loud." },
      { property: "og:title", content: "Add a crop — FarmDirect" },
      { property: "og:description", content: "List a crop in a few taps, or speak the details." },
    ],
  }),
  component: AddCrop,
});

const schema = z.object({
  name: z.string().trim().min(2).max(40),
  quantity: z.number().positive().max(100000),
  price: z.number().positive().max(100000),
  location_name: z.string().trim().max(80),
  harvest_period: z.string().trim().max(60),
  description: z.string().trim().max(300),
});

function AddCrop() {
  const navigate = useNavigate();
  const { t, speechLocale } = useI18n();
  const { profile, settings } = useApp();
  const [busy, setBusy] = useState(false);
  const [damaged, setDamaged] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    unit: "kg",
    location_name: profile?.location_name ?? "",
    harvest_period: "",
    description: "",
    condition: "",
    intended_use: "",
  });

  const dictate = async (field: "name" | "quantity" | "price" | "location_name") => {
    if (settings.voice) speak(t("listening"), speechLocale);
    const heard = await listenOnce(speechLocale);
    if (!heard) return;
    const numeric = heard.replace(/[^\d.]/g, "");
    setForm((prev) => ({
      ...prev,
      [field]: field === "quantity" || field === "price" ? numeric : heard,
    }));
  };

  const save = async () => {
    if (!profile) {
      navigate({ to: "/auth" });
      return;
    }
    const parsed = schema.safeParse({
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
      location_name: form.location_name,
      harvest_period: form.harvest_period,
      description: form.description,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("crops").insert({
      farmer_id: profile.id,
      name: parsed.data.name,
      quantity: parsed.data.quantity,
      unit: form.unit,
      price: parsed.data.price,
      location_name: parsed.data.location_name,
      harvest_period: parsed.data.harvest_period,
      description: parsed.data.description,
      lat: profile.lat,
      lng: profile.lng,
      is_damaged: damaged,
      condition: damaged ? form.condition.slice(0, 80) : null,
      intended_use: damaged ? form.intended_use.slice(0, 80) : null,
      category: damaged ? "post_harvest" : "vegetable",
    });
    setBusy(false);
    if (error) {
      toast.error("Could not save this crop.");
      return;
    }
    toast.success(t("cropAdded"));
    if (settings.voice) speak(t("cropAdded"), speechLocale);
    navigate({ to: "/farmer/crops" });
  };

  const field = (
    key: keyof typeof form,
    label: string,
    opts: { numeric?: boolean; dictate?: boolean } = {},
  ) => (
    <label className="grid gap-2">
      <span className="font-semibold">{label}</span>
      <div className="flex gap-2">
        <input
          className="field flex-1"
          inputMode={opts.numeric ? "numeric" : "text"}
          value={form[key]}
          maxLength={120}
          onChange={(e) =>
            setForm({
              ...form,
              [key]: opts.numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value,
            })
          }
        />
        {opts.dictate && (
          <button
            type="button"
            aria-label={`${t("speak")} ${label}`}
            onClick={() => dictate(key as "name")}
            className="flex size-14 items-center justify-center rounded-2xl border-2"
          >
            <Mic className="size-6" />
          </button>
        )}
      </div>
    </label>
  );

  return (
    <AppShell title={t("addCrop")}>
      <div className="grid gap-4">
        {field("name", t("cropName"), { dictate: true })}
        {field("quantity", `${t("quantity")} (${form.unit})`, { numeric: true, dictate: true })}
        {field("price", `${t("price")} / ${form.unit}`, { numeric: true, dictate: true })}
        {field("harvest_period", t("harvestPeriod"))}
        {field("location_name", t("location"), { dictate: true })}
        {field("description", t("description"))}

        <label className="flex items-center justify-between gap-3 rounded-3xl border bg-card p-4">
          <span className="font-semibold">{t("damagedCrop")}</span>
          <input
            type="checkbox"
            className="size-6"
            checked={damaged}
            onChange={(e) => setDamaged(e.target.checked)}
          />
        </label>

        {damaged && (
          <>
            {field("condition", t("condition"))}
            {field("intended_use", t("intendedUse"))}
            <p className="rounded-2xl bg-accent/25 p-3 text-xs">
              Post-harvest lots are shown separately and marked as not for human consumption.
            </p>
          </>
        )}

        <button
          onClick={save}
          disabled={busy}
          className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground active:scale-95 disabled:opacity-60"
        >
          {busy ? "…" : t("save")}
        </button>
      </div>
    </AppShell>
  );
}
