import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk demand board — FarmDirect" },
      {
        name: "description",
        content: "Bulk buyers post what they need; farmers see real demand before they sow and harvest.",
      },
      { property: "og:title", content: "Bulk demand board — FarmDirect" },
      { property: "og:description", content: "See live bulk crop demand from mills, hotels and traders." },
    ],
  }),
  component: Bulk,
});

const schema = z.object({
  crop_name: z.string().trim().min(2).max(40),
  quantity: z.number().positive().max(1000000),
  location_name: z.string().trim().max(80),
  purpose: z.string().trim().max(120),
});

function Bulk() {
  const { t } = useI18n();
  const { profile } = useApp();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ crop_name: "", quantity: "", location_name: "", purpose: "" });

  const list = useQuery({
    queryKey: ["bulk"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_requirements")
        .select("*, buyer:profiles!bulk_requirements_buyer_id_fkey(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const post = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse({ ...form, quantity: Number(form.quantity) });
      const { error } = await supabase
        .from("bulk_requirements")
        .insert({ ...parsed, buyer_id: profile!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("requirementPosted"));
      setForm({ crop_name: "", quantity: "", location_name: "", purpose: "" });
      void queryClient.invalidateQueries({ queryKey: ["bulk"] });
    },
    onError: () => toast.error("Please check the details and try again."),
  });

  return (
    <AppShell title={t("bulkRequirement")}>
      <div className="grid gap-3">
        {list.data?.map((row) => (
          <div key={row.id} className="rounded-3xl border bg-card p-4 shadow-soft">
            <p className="text-lg font-bold">
              {row.crop_name} — {row.quantity} {row.unit}
            </p>
            <p className="text-sm text-muted-foreground">
              {(row as { buyer?: { name?: string } }).buyer?.name} · {row.location_name}
            </p>
            <p className="text-sm">{row.purpose}</p>
            {row.required_by && (
              <p className="mt-1 text-xs text-muted-foreground">Needed by {row.required_by}</p>
            )}
          </div>
        ))}
      </div>

      {profile && (
        <section className="mt-6 grid gap-3 rounded-3xl border bg-card p-4">
          <h2 className="font-bold">{t("postRequirement")}</h2>
          <input
            className="field"
            placeholder="Maize"
            value={form.crop_name}
            onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
          />
          <input
            className="field"
            inputMode="numeric"
            placeholder="2000 (kg)"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value.replace(/[^\d.]/g, "") })}
          />
          <input
            className="field"
            placeholder="Warangal"
            value={form.location_name}
            onChange={(e) => setForm({ ...form, location_name: e.target.value })}
          />
          <input
            className="field"
            placeholder="Poultry feed"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <button
            onClick={() => post.mutate()}
            className="rounded-2xl bg-primary py-4 font-bold text-primary-foreground"
          >
            {t("postRequirement")}
          </button>
        </section>
      )}
    </AppShell>
  );
}
