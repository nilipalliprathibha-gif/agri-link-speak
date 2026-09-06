CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  role text NOT NULL DEFAULT 'customer',
  name text NOT NULL DEFAULT '',
  phone text,
  language text NOT NULL DEFAULT 'en',
  location_name text,
  lat double precision,
  lng double precision,
  avatar_url text,
  trust_score integer NOT NULL DEFAULT 70,
  badges text[] NOT NULL DEFAULT '{}',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'vegetable',
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'kg',
  price numeric NOT NULL DEFAULT 0,
  harvest_period text,
  available_from date,
  image_url text,
  description text,
  is_damaged boolean NOT NULL DEFAULT false,
  condition text,
  intended_use text,
  labels text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  location_name text,
  lat double precision,
  lng double precision,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no bigserial,
  customer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'placed',
  delivery_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  crop_id uuid REFERENCES public.crops(id) ON DELETE SET NULL,
  crop_name text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_type text NOT NULL,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  price numeric NOT NULL,
  region text,
  recorded_at date NOT NULL DEFAULT current_date
);

CREATE TABLE public.bulk_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  required_by date,
  location_name text,
  purpose text,
  status text NOT NULL DEFAULT 'posted',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crops TO authenticated;
GRANT SELECT ON public.crops TO anon;
GRANT ALL ON public.crops TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
GRANT SELECT ON public.price_history TO anon;
GRANT SELECT ON public.price_history TO authenticated;
GRANT ALL ON public.price_history TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bulk_requirements TO authenticated;
GRANT SELECT ON public.bulk_requirements TO anon;
GRANT ALL ON public.bulk_requirements TO service_role;

CREATE OR REPLACE FUNCTION public.my_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "crops_public_read" ON public.crops FOR SELECT USING (true);
CREATE POLICY "crops_insert_own" ON public.crops FOR INSERT TO authenticated WITH CHECK (farmer_id = public.my_profile_id());
CREATE POLICY "crops_update_own" ON public.crops FOR UPDATE TO authenticated USING (farmer_id = public.my_profile_id()) WITH CHECK (farmer_id = public.my_profile_id());
CREATE POLICY "crops_delete_own" ON public.crops FOR DELETE TO authenticated USING (farmer_id = public.my_profile_id());

CREATE POLICY "orders_read_party" ON public.orders FOR SELECT TO authenticated USING (customer_id = public.my_profile_id() OR farmer_id = public.my_profile_id());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = public.my_profile_id());
CREATE POLICY "orders_update_party" ON public.orders FOR UPDATE TO authenticated USING (customer_id = public.my_profile_id() OR farmer_id = public.my_profile_id()) WITH CHECK (customer_id = public.my_profile_id() OR farmer_id = public.my_profile_id());

CREATE POLICY "order_items_read_party" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.customer_id = public.my_profile_id() OR o.farmer_id = public.my_profile_id())));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = public.my_profile_id()));

CREATE POLICY "notifications_read_own" ON public.notifications FOR SELECT TO authenticated USING (profile_id = public.my_profile_id());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (profile_id = public.my_profile_id()) WITH CHECK (profile_id = public.my_profile_id());
CREATE POLICY "notifications_insert_any_auth" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "complaints_read_party" ON public.complaints FOR SELECT TO authenticated USING (customer_id = public.my_profile_id() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.farmer_id = public.my_profile_id()));
CREATE POLICY "complaints_insert_own" ON public.complaints FOR INSERT TO authenticated WITH CHECK (customer_id = public.my_profile_id());

CREATE POLICY "price_history_public_read" ON public.price_history FOR SELECT USING (true);

CREATE POLICY "bulk_public_read" ON public.bulk_requirements FOR SELECT USING (true);
CREATE POLICY "bulk_insert_own" ON public.bulk_requirements FOR INSERT TO authenticated WITH CHECK (buyer_id = public.my_profile_id());
CREATE POLICY "bulk_update_own" ON public.bulk_requirements FOR UPDATE TO authenticated USING (buyer_id = public.my_profile_id()) WITH CHECK (buyer_id = public.my_profile_id());

INSERT INTO public.profiles (id, role, name, phone, language, location_name, lat, lng, trust_score, badges, is_demo) VALUES
 ('11111111-1111-4111-8111-111111111111','farmer','Ramesh','9000000001','te','Shamirpet, Hyderabad',17.6100,78.5600,92,ARRAY['Verified Farmer','Fast Responder'],true),
 ('22222222-2222-4222-8222-222222222222','farmer','Suresh','9000000002','te','Medchal, Hyderabad',17.6300,78.4800,85,ARRAY['Verified Farmer'],true),
 ('33333333-3333-4333-8333-333333333333','farmer','Lakshmi','9000000003','te','Vikarabad',17.3400,77.9000,96,ARRAY['Verified Farmer','Top Rated','5+ Successful Bulk Orders'],true),
 ('44444444-4444-4444-8444-444444444444','bulk_buyer','ABC Poultry Farm','9000000004','en','Hyderabad',17.3850,78.4867,80,ARRAY['Verified Buyer'],true);

INSERT INTO public.crops (farmer_id, name, category, quantity, unit, price, harvest_period, available_from, description, is_damaged, condition, intended_use, labels, location_name, lat, lng, is_demo) VALUES
 ('11111111-1111-4111-8111-111111111111','Maize','grain',500,'kg',20,'September 2026','2026-09-20','Freshly harvested yellow maize, sun dried.',false,null,null,ARRAY['No pesticide (self-declared)'],'Shamirpet, Hyderabad',17.6100,78.5600,true),
 ('22222222-2222-4222-8222-222222222222','Tomato','vegetable',180,'kg',40,'September 2026','2026-09-10','Farm fresh tomatoes picked this morning.',false,null,null,ARRAY['Organic (self-declared)'],'Medchal, Hyderabad',17.6300,78.4800,true),
 ('33333333-3333-4333-8333-333333333333','Rice','grain',1200,'kg',52,'August 2026','2026-09-01','Sona Masoori raw rice, single polished.',false,null,null,ARRAY['Traditional method'],'Vikarabad',17.3400,77.9000,true),
 ('22222222-2222-4222-8222-222222222222','Onion','vegetable',300,'kg',28,'September 2026','2026-09-12','Medium sized red onions.',false,null,null,'{}','Medchal, Hyderabad',17.6300,78.4800,true),
 ('11111111-1111-4111-8111-111111111111','Maize','grain',1000,'kg',8,'September 2026','2026-09-20','Post-harvest broken grain, suitable for animal feed after inspection.',true,'Broken grains','Animal feed','{}','Shamirpet, Hyderabad',17.6100,78.5600,true);

INSERT INTO public.price_history (crop_name, price, region, recorded_at) VALUES
 ('Tomato',46,'Hyderabad',current_date - 6),('Tomato',44,'Hyderabad',current_date - 5),('Tomato',43,'Hyderabad',current_date - 4),('Tomato',41,'Hyderabad',current_date - 3),('Tomato',42,'Hyderabad',current_date - 2),('Tomato',40,'Hyderabad',current_date - 1),('Tomato',39,'Hyderabad',current_date),
 ('Maize',19,'Hyderabad',current_date - 6),('Maize',20,'Hyderabad',current_date - 5),('Maize',20,'Hyderabad',current_date - 4),('Maize',21,'Hyderabad',current_date - 3),('Maize',21,'Hyderabad',current_date - 2),('Maize',22,'Hyderabad',current_date - 1),('Maize',21,'Hyderabad',current_date),
 ('Rice',50,'Hyderabad',current_date - 6),('Rice',51,'Hyderabad',current_date - 5),('Rice',51,'Hyderabad',current_date - 4),('Rice',53,'Hyderabad',current_date - 3),('Rice',52,'Hyderabad',current_date - 2),('Rice',52,'Hyderabad',current_date - 1),('Rice',53,'Hyderabad',current_date),
 ('Onion',30,'Hyderabad',current_date - 6),('Onion',29,'Hyderabad',current_date - 5),('Onion',29,'Hyderabad',current_date - 4),('Onion',28,'Hyderabad',current_date - 3),('Onion',27,'Hyderabad',current_date - 2),('Onion',28,'Hyderabad',current_date - 1),('Onion',28,'Hyderabad',current_date);

INSERT INTO public.bulk_requirements (buyer_id, crop_name, quantity, unit, required_by, location_name, purpose) VALUES
 ('44444444-4444-4444-8444-444444444444','Maize',2000,'kg',current_date + 30,'Hyderabad','Poultry feed');