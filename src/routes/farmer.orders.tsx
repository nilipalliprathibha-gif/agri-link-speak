import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";
import { updateOrderStatus } from "@/lib/orders.functions";

export const Route = createFileRoute("/farmer/orders")({
  head: () => ({
    meta: [
      { title: "Orders received — FarmDirect" },
      { name: "description", content: "Accept, prepare and deliver the orders customers placed with you." },
      { property: "og:title", content: "Orders received — FarmDirect" },
      { property: "og:description", content: "Accept and fulfil customer orders." },
    ],
  }),
  component: FarmerOrders,
});

const NEXT: Record<string, { status: "accepted" | "preparing" | "out_for_delivery" | "delivered"; label: string }> = {
  placed: { status: "accepted", label: "Accept order" },
  accepted: { status: "preparing", label: "Start preparing" },
  preparing: { status: "out_for_delivery", label: "Out for delivery" },
  out_for_delivery: { status: "delivered", label: "Mark delivered" },
};

function FarmerOrders() {
  const { t } = useI18n();
  const { profile } = useApp();
  const queryClient = useQueryClient();
  const setStatus = useServerFn(updateOrderStatus);

  const orders = useQuery({
    queryKey: ["farmer-orders", profile?.id],
    enabled: Boolean(profile),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), customer:profiles!orders_customer_id_fkey(name, phone)")
        .eq("farmer_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const advance = useMutation({
    mutationFn: async (input: { orderId: string; status: "accepted" | "preparing" | "out_for_delivery" | "delivered" | "rejected" }) =>
      setStatus({ data: input }),
    onSuccess: () => {
      toast.success(t("orderUpdated"));
      void queryClient.invalidateQueries({ queryKey: ["farmer-orders"] });
    },
    onError: () => toast.error("Could not update the order."),
  });

  return (
    <AppShell title={t("orders")}>
      <div className="grid gap-3">
        {orders.data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
            {t("noOrders")}
          </p>
        )}
        {orders.data?.map((order) => {
          const next = NEXT[order.status];
          return (
            <div key={order.id} className="rounded-3xl border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">#{order.order_no}</p>
                <p className="font-extrabold">{rupees(Number(order.total))}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {(order as { customer?: { name?: string; phone?: string } }).customer?.name} ·{" "}
                {(order as { customer?: { phone?: string } }).customer?.phone}
              </p>
              <ul className="mt-2 text-sm">
                {(order.order_items ?? []).map((item) => (
                  <li key={item.id}>
                    {item.crop_name} — {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-semibold capitalize">
                {order.status.replace(/_/g, " ")}
              </p>
              {next && (
                <div className="mt-3 grid gap-2">
                  <button
                    onClick={() => advance.mutate({ orderId: order.id, status: next.status })}
                    className="rounded-2xl bg-primary py-3 font-bold text-primary-foreground"
                  >
                    {next.label}
                  </button>
                  {order.status === "placed" && (
                    <button
                      onClick={() => advance.mutate({ orderId: order.id, status: "rejected" })}
                      className="rounded-2xl border-2 py-3 font-semibold"
                    >
                      {t("reject")}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
