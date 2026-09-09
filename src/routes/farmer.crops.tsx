import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/farmer/crops")({
  head: () => ({
    meta: [
      { title: "My crops — FarmDirect" },
      { name: "description", content: "Your listed crops with stock, price and status." },
      { property: "og:title", content: "My crops — FarmDirect" },
      { property: "og:description", content: "Manage the crops you have listed for sale." },
    ],
  }),
  component: FarmerCrops,
});

function FarmerCrops() {
  const { t } = useI18n();
  const { profile } = useApp();
  const queryClient = useQueryClient();

  const crops = useQuery({
    queryKey: ["farmer-crops", profile?.id],
    enabled: Boolean(profile),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crops")
        .select("*")
        .eq("farmer_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crops").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("removed"));
      void queryClient.invalidateQueries({ queryKey: ["farmer-crops"] });
    },
    onError: () => toast.error("Could not remove this listing."),
  });

  return (
    <AppShell title={t("myCrops")}>
      <Link
        to="/farmer/add-crop"
        className="block rounded-2xl bg-primary py-4 text-center text-lg font-bold text-primary-foreground"
      >
        + {t("addCrop")}
      </Link>
      <div className="mt-4 grid gap-3">
        {crops.data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
            {t("noResults")}
          </p>
        )}
        {crops.data?.map((crop) => (
          <div key={crop.id} className="rounded-3xl border bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">{crop.name}</p>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {crop.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {crop.quantity} {crop.unit} · {rupees(Number(crop.price))}/{crop.unit}
              {crop.is_damaged ? " · post-harvest lot" : ""}
            </p>
            <button
              onClick={() => remove.mutate(crop.id)}
              className="mt-3 w-full rounded-2xl border-2 py-3 font-semibold"
            >
              {t("remove")}
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
