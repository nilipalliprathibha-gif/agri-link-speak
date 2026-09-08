import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlaceOrderInput = z.object({
  deliveryAddress: z.string().trim().max(200).optional(),
  lines: z
    .array(
      z.object({
        cropId: z.string().uuid(),
        quantity: z.number().positive().max(100000),
      }),
    )
    .min(1)
    .max(30),
});

/**
 * Backend is authoritative for inventory and pricing: prices and stock are read
 * from the database, never trusted from the browser.
 */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlaceOrderInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("user_id", userId)
      .maybeSingle();
    if (profileError) throw new Error("Could not load your account.");
    if (!profile) throw new Error("Please complete your account first.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const cropIds = data.lines.map((l) => l.cropId);
    const { data: crops, error: cropError } = await supabaseAdmin
      .from("crops")
      .select("id, name, unit, price, quantity, farmer_id, status")
      .in("id", cropIds);
    if (cropError || !crops) throw new Error("Could not load these crops.");

    for (const line of data.lines) {
      const crop = crops.find((c) => c.id === line.cropId);
      if (!crop || crop.status !== "active") throw new Error("A crop is no longer available.");
      if (Number(crop.quantity) < line.quantity) {
        throw new Error(`Only ${crop.quantity} ${crop.unit} of ${crop.name} is available.`);
      }
    }

    const byFarmer = new Map<string, typeof data.lines>();
    for (const line of data.lines) {
      const crop = crops.find((c) => c.id === line.cropId)!;
      byFarmer.set(crop.farmer_id, [...(byFarmer.get(crop.farmer_id) ?? []), line]);
    }

    const created: { id: string; order_no: number; total: number }[] = [];

    for (const [farmerId, lines] of byFarmer) {
      const total = lines.reduce((sum, line) => {
        const crop = crops.find((c) => c.id === line.cropId)!;
        return sum + Number(crop.price) * line.quantity;
      }, 0);

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          customer_id: profile.id,
          farmer_id: farmerId,
          total,
          status: "placed",
          delivery_address: data.deliveryAddress ?? null,
        })
        .select("id, order_no, total")
        .single();
      if (orderError || !order) throw new Error("Could not place the order. Please try again.");

      const items = lines.map((line) => {
        const crop = crops.find((c) => c.id === line.cropId)!;
        return {
          order_id: order.id,
          crop_id: crop.id,
          crop_name: crop.name,
          quantity: line.quantity,
          unit: crop.unit,
          unit_price: Number(crop.price),
          subtotal: Number(crop.price) * line.quantity,
        };
      });
      const { error: itemError } = await supabaseAdmin.from("order_items").insert(items);
      if (itemError) throw new Error("Could not save the order items.");

      for (const line of lines) {
        const crop = crops.find((c) => c.id === line.cropId)!;
        const remaining = Number(crop.quantity) - line.quantity;
        await supabaseAdmin
          .from("crops")
          .update({ quantity: remaining, status: remaining <= 0 ? "sold_out" : "active" })
          .eq("id", crop.id);
      }

      await supabaseAdmin.from("notifications").insert([
        {
          profile_id: farmerId,
          title: `New order #${order.order_no}`,
          body: `${profile.name} ordered ${items.map((i) => `${i.quantity} ${i.unit} ${i.crop_name}`).join(", ")}.`,
        },
        {
          profile_id: profile.id,
          title: `Order #${order.order_no} placed`,
          body: "The farmer has been notified and will accept it shortly.",
        },
      ]);

      created.push({ id: order.id, order_no: Number(order.order_no), total: Number(order.total) });
    }

    return { orders: created };
  });

const StatusInput = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["accepted", "rejected", "preparing", "out_for_delivery", "delivered", "cancelled"]),
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => StatusInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.orderId)
      .select("id, order_no, customer_id, farmer_id")
      .maybeSingle();
    if (error || !order) throw new Error("Could not update this order.");

    await supabase.from("notifications").insert({
      profile_id: order.customer_id,
      title: `Order #${order.order_no} ${data.status.replace(/_/g, " ")}`,
      body: "Open your orders to see the latest status.",
    });
    return { ok: true };
  });
