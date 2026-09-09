import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Updates — FarmDirect" },
      { name: "description", content: "Order updates, demand alerts and price news from FarmDirect." },
      { property: "og:title", content: "Updates — FarmDirect" },
      { property: "og:description", content: "Order updates and demand alerts in one place." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const { t } = useI18n();
  const { profile } = useApp();

  const items = useQuery({
    queryKey: ["notifications", profile?.id],
    enabled: Boolean(profile),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("profile_id", profile!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell title={t("notifications")}>
      {!profile && <p className="rounded-3xl border bg-card p-8 text-center">{t("signInToOrder")}</p>}
      <div className="grid gap-3">
        {items.data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
            {t("noNotifications")}
          </p>
        )}
        {items.data?.map((n) => (
          <div key={n.id} className="rounded-3xl border bg-card p-4">
            <p className="font-bold">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
