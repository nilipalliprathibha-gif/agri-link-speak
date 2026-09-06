DROP POLICY "crops_insert_own" ON public.crops;
DROP POLICY "crops_update_own" ON public.crops;
DROP POLICY "crops_delete_own" ON public.crops;
DROP POLICY "orders_read_party" ON public.orders;
DROP POLICY "orders_insert_own" ON public.orders;
DROP POLICY "orders_update_party" ON public.orders;
DROP POLICY "order_items_read_party" ON public.order_items;
DROP POLICY "order_items_insert_own" ON public.order_items;
DROP POLICY "notifications_read_own" ON public.notifications;
DROP POLICY "notifications_update_own" ON public.notifications;
DROP POLICY "complaints_read_party" ON public.complaints;
DROP POLICY "complaints_insert_own" ON public.complaints;
DROP POLICY "bulk_insert_own" ON public.bulk_requirements;
DROP POLICY "bulk_update_own" ON public.bulk_requirements;
DROP FUNCTION IF EXISTS public.my_profile_id();

CREATE POLICY "crops_insert_own" ON public.crops FOR INSERT TO authenticated
  WITH CHECK (farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "crops_update_own" ON public.crops FOR UPDATE TO authenticated
  USING (farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()))
  WITH CHECK (farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "crops_delete_own" ON public.crops FOR DELETE TO authenticated
  USING (farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "orders_read_party" ON public.orders FOR SELECT TO authenticated
  USING (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
      OR farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "orders_update_party" ON public.orders FOR UPDATE TO authenticated
  USING (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
      OR farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
      OR farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "order_items_read_party" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
    AND (o.customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
      OR o.farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()))));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
    AND o.customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())));

CREATE POLICY "notifications_read_own" ON public.notifications FOR SELECT TO authenticated
  USING (profile_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (profile_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "complaints_read_party" ON public.complaints FOR SELECT TO authenticated
  USING (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
      AND o.farmer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())));
CREATE POLICY "complaints_insert_own" ON public.complaints FOR INSERT TO authenticated
  WITH CHECK (customer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "bulk_insert_own" ON public.bulk_requirements FOR INSERT TO authenticated
  WITH CHECK (buyer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));
CREATE POLICY "bulk_update_own" ON public.bulk_requirements FOR UPDATE TO authenticated
  USING (buyer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()))
  WITH CHECK (buyer_id IN (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()));