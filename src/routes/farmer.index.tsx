import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ListOrdered, PlusCircle, Sprout, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/farmer/")({
  head: () => ({
    meta: [
      { title: "Farmer home — FarmDirect" },
      { name: "description", content: "List crops, see orders and track your earnings in one simple screen." },
      { property: "og:title", content: "Farmer home — FarmDirect" },
      { property: "og:description", content: "List crops, see orders and track earnings." },
    ],
  }),
  component: FarmerHome,
});

function FarmerHome() {
  const { t } = useI18n();
  const { profile } = useApp();

  const stats = useQuery({
    queryKey: ["farmer-stats", profile?.id],
    enabled: Boolean(profile),
    queryFn: async () => {
      const [crops, orders] = await Promise.all([
        supabase.from("crops").select("id").eq("farmer_id", profile!.id).eq("status", "active"),
        supabase.from("orders").select("total, status").eq("farmer_id", profile!.id),
      ]);
      const earnings = (orders.data ?? [])
        .filter((o) => o.status !== "rejected" && o.status !== "cancelled")
        .reduce((sum, o) => sum + Number(o.total), 0);
      return {
        activeCrops: crops.data?.length ?? 0,
        orders: orders.data?.length ?? 0,
        earnings,
      };
    },
  });

  return (
    <AppShell title={`${t("hello")} ${profile?.name ?? ""}`}>
      {!profile && (
        <p className="rounded-3xl border bg-card p-6 text-center">
          {t("signInToOrder")}{" "}
          <Link to="/auth" className="font-bold text-primary">
            {t("signIn")}
          </Link>
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Stat label={t("myCrops")} value={String(stats.data?.activeCrops ?? 0)} />
        <Stat label={t("orders")} value={String(stats.data?.orders ?? 0)} />
        <Stat label={t("earnings")} value={rupees(stats.data?.earnings ?? 0)} />
      </div>

      <div className="mt-5 grid gap-4">
        <Link to="/farmer/add-crop" className="tile !min-h-36 !text-xl">
          <PlusCircle className="size-10 text-primary" />
          {t("addCrop")}
        </Link>
        <Link to="/farmer/crops" className="tile !min-h-32 !text-lg">
          <Sprout className="size-9 text-primary" />
          {t("myCrops")}
        </Link>
        <Link to="/farmer/orders" className="tile !min-h-32 !text-lg">
          <ListOrdered className="size-9 text-primary" />
          {t("orders")}
        </Link>
        <Link to="/bulk" className="tile !min-h-32 !text-lg">
          <TrendingUp className="size-9 text-primary" />
          {t("demand")}
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-card p-3 text-center shadow-soft">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
