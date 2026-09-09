import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { rupees, useApp } from "@/lib/app";
import { useI18n } from "@/lib/i18n";
import { placeOrder } from "@/lib/orders.functions";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your basket — FarmDirect" },
      { name: "description", content: "Review your farm-direct basket and place the order." },
      { property: "og:title", content: "Your basket — FarmDirect" },
      { property: "og:description", content: "Review your farm-direct basket and place the order." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const navigate = useNavigate();
  const { t, speechLocale } = useI18n();
  const { cart, removeFromCart, clearCart, profile, settings } = useApp();
  const submit = useServerFn(placeOrder);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  const total = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  const confirm = async () => {
    if (!profile) {
      toast.error(t("signInToOrder"));
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    try {
      const result = await submit({
        data: {
          deliveryAddress: address.trim() || undefined,
          lines: cart.map((l) => ({ cropId: l.cropId, quantity: l.quantity })),
        },
      });
      clearCart();
      toast.success(t("orderPlaced"));
      if (settings.voice) speak(t("orderPlaced"), speechLocale);
      void result;
      navigate({ to: "/orders" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title={t("cart")}>
      {cart.length === 0 ? (
        <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">
          {t("emptyCart")}
        </p>
      ) : (
        <div className="grid gap-3">
          {cart.map((line) => (
            <div key={line.cropId} className="flex items-center gap-3 rounded-3xl border bg-card p-4">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold">{line.cropName}</p>
                <p className="text-sm text-muted-foreground">
                  {line.quantity} {line.unit} × {rupees(line.unitPrice)} · {line.farmerName}
                </p>
              </div>
              <p className="font-extrabold">{rupees(line.quantity * line.unitPrice)}</p>
              <button
                aria-label={t("remove")}
                onClick={() => removeFromCart(line.cropId)}
                className="rounded-2xl border-2 p-3"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ))}

          <label className="mt-2 grid gap-2">
            <span className="font-semibold">{t("deliveryAddress")}</span>
            <input
              className="field"
              maxLength={200}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no, village, district"
            />
          </label>

          <div className="mt-2 flex items-center justify-between rounded-3xl border bg-card p-4 text-xl font-extrabold">
            <span>{t("total")}</span>
            <span>{rupees(total)}</span>
          </div>

          <button
            onClick={confirm}
            disabled={busy}
            className="rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground active:scale-95 disabled:opacity-60"
          >
            {busy ? "…" : t("placeOrder")}
          </button>
        </div>
      )}
    </AppShell>
  );
}
