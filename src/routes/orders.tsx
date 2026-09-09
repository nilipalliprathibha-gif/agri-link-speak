import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — FarmDirect" },
      { name: "description", content: "Track your farm-direct orders and raise a problem if something is wrong." },
      { property: "og:title", content: "My orders — FarmDirect" },
      { property: "og:description", content: "Track your farm-direct orders step by step." },
    ],
  }),
  component: Orders,
});

const STEPS = ["placed", "accepted", "preparing", "out_for_delivery", "delivered"];

function Orders() {
  const { t } = useI18n();
  const { profile } = useApp();
  const queryClient = useQueryClient();
  const [complaintFor, setComplaintFor] = useState<string | null>(null);
  const [problem, setProblem] = useState("");

  const orders = useQuery({
    queryKey: ["orders", "customer", profile?.id],
    enabled: Boolean(profile),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), farmer:profiles!orders_farmer_id_fkey(name, phone)")
        .eq("customer_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const raise = useMutation({
    mutationFn: async ({ orderId, description }: { orderId: string; description: string }) => {
      const { error } = await supabase.from("complaints").insert({
        order_id: orderId,
        customer_id: profile!.id,
        problem_type: "quality",
        description: description.slice(0, 500),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("complaintSent"));
      setComplaintFor(null);
      setProblem("");
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Could not send the report."),
  });

  if (!profile) {
    return (
      <AppShell title={t("orders")}>
        <p className="rounded-3xl border bg-card p-8 text-center">{t("signInToOrder")}</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("orders")}>
      <div className="grid gap-3">
        {orders.data?.length === 0 && (
          <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
            {t("noOrders")}
          </p>
        )}
        {orders.data?.map((order) => {
          const index = STEPS.indexOf(order.status);
          return (
            <div key={order.id} className="rounded-3xl border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">#{order.order_no}</p>
                <p className="font-extrabold">{rupees(Number(order.total))}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {(order as { farmer?: { name?: string } }).farmer?.name}
              </p>
              <ul className="mt-2 text-sm">
                {(order.order_items ?? []).map((item) => (
                  <li key={item.id}>
                    {item.crop_name} — {item.quantity} {item.unit} · {rupees(Number(item.subtotal))}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-1">
                {STEPS.map((step, i) => (
                  <span
                    key={step}
                    className={`h-2 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm font-semibold capitalize">
                {order.status.replace(/_/g, " ")}
              </p>

              {complaintFor === order.id ? (
                <div className="mt-3 grid gap-2">
                  <textarea
                    className="field min-h-24"
                    maxLength={500}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={t("describeProblem")}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => raise.mutate({ orderId: order.id, description: problem })}
                      className="flex-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground"
                    >
                      {t("send")}
                    </button>
                    <button
                      onClick={() => setComplaintFor(null)}
                      className="flex-1 rounded-2xl border-2 py-3 font-bold"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setComplaintFor(order.id)}
                  className="mt-3 w-full rounded-2xl border-2 py-3 font-semibold"
                >
                  {t("reportProblem")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
