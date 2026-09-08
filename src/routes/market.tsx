import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CropCard, type CropRow } from "@/components/CropCard";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/market")({
  validateSearch: (search: Record<string, unknown>) => ({ q: String(search["q"] ?? "") }),
  head: () => ({
    meta: [
      { title: "Fresh crops near you — FarmDirect" },
      {
        name: "description",
        content: "Browse crops listed directly by farmers: price, quantity, harvest date and distance.",
      },
      { property: "og:title", content: "Fresh crops near you — FarmDirect" },
      { property: "og:description", content: "Buy directly from farmers at transparent prices." },
    ],
  }),
  component: Market,
});

export function useAveragePrices() {
  return useQuery({
    queryKey: ["price-averages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("price_history").select("crop_name, price");
      if (error) throw error;
      const totals = new Map<string, { sum: number; count: number }>();
      for (const row of data ?? []) {
        const key = row.crop_name.toLowerCase();
        const entry = totals.get(key) ?? { sum: 0, count: 0 };
        entry.sum += Number(row.price);
        entry.count += 1;
        totals.set(key, entry);
      }
      return Object.fromEntries(
        [...totals.entries()].map(([k, v]) => [k, Math.round(v.sum / v.count)]),
      ) as Record<string, number>;
    },
  });
}

function Market() {
  const { q } = Route.useSearch();
  const { t } = useI18n();
  const [query, setQuery] = useState(q);
  const [sort, setSort] = useState<"recent" | "price" | "quantity">("recent");
  const averages = useAveragePrices();

  const crops = useQuery({
    queryKey: ["crops", "fresh"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crops")
        .select("*, profiles!crops_farmer_id_fkey(id, name, trust_score, badges)")
        .eq("is_damaged", false)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CropRow[];
    },
  });

  const visible = useMemo(() => {
    const term = (query || q).trim().toLowerCase();
    let rows = crops.data ?? [];
    if (term) rows = rows.filter((c) => c.name.toLowerCase().includes(term));
    if (sort === "price") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "quantity") rows = [...rows].sort((a, b) => b.quantity - a.quantity);
    return rows;
  }, [crops.data, query, q, sort]);

  return (
    <AppShell title={t("availableCrops")}>
      <input
        className="field"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`${t("search")}: tomato, maize…`}
      />

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(["recent", "price", "quantity"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSort(option)}
            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold ${
              sort === option ? "border-primary bg-secondary text-secondary-foreground" : ""
            }`}
          >
            {option === "recent" ? "Newest" : option === "price" ? "Lowest price" : "Most available"}
          </button>
        ))}
        <Link
          to="/secondary"
          className="shrink-0 rounded-full border-2 border-accent px-4 py-2 text-sm font-semibold"
        >
          {t("secondaryMarket")}
        </Link>
        <Link to="/bulk" className="shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold">
          {t("bulkRequirement")}
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {crops.isLoading && <p className="text-muted-foreground">…</p>}
        {!crops.isLoading && visible.length === 0 && (
          <p className="rounded-3xl border bg-card p-6 text-center text-muted-foreground">
            {t("noResults")}
          </p>
        )}
        {visible.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            areaAverage={averages.data?.[crop.name.toLowerCase()] ?? null}
          />
        ))}
      </div>
    </AppShell>
  );
}
