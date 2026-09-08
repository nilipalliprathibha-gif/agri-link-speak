import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CropCard, type CropRow } from "@/components/CropCard";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/secondary")({
  head: () => ({
    meta: [
      { title: "Post-harvest market — FarmDirect" },
      {
        name: "description",
        content:
          "Post-harvest and downgraded crops offered to feed mills, poultry farms and livestock buyers, with condition clearly stated.",
      },
      { property: "og:title", content: "Post-harvest market — FarmDirect" },
      {
        property: "og:description",
        content: "Reduce waste: buy inspected post-harvest crop lots for animal feed.",
      },
    ],
  }),
  component: Secondary,
});

function Secondary() {
  const { t } = useI18n();
  const crops = useQuery({
    queryKey: ["crops", "damaged"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crops")
        .select("*, profiles!crops_farmer_id_fkey(id, name, trust_score, badges)")
        .eq("is_damaged", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CropRow[];
    },
  });

  return (
    <AppShell title={t("secondaryMarket")}>
      <div className="flex items-start gap-3 rounded-3xl border-2 border-accent bg-accent/15 p-4">
        <AlertTriangle className="size-6 shrink-0 text-accent-foreground" />
        <p className="text-sm">
          These lots are not for human consumption. Condition is declared by the farmer and every lot
          must be inspected before purchase.
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {crops.data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-6 text-center text-muted-foreground">
            {t("noResults")}
          </p>
        )}
        {crops.data?.map((crop) => <CropCard key={crop.id} crop={crop} />)}
      </div>
    </AppShell>
  );
}
