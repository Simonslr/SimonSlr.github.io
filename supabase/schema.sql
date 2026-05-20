-- ============================================================
-- EuroCompare — Supabase schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, product_slug)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON favorites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_slug       text NOT NULL,
  product_name       text NOT NULL,
  target_price       numeric NOT NULL,
  best_country       text NOT NULL,
  current_best_price numeric NOT NULL,
  triggered          boolean DEFAULT false,
  triggered_at       timestamptz,
  created_at         timestamptz DEFAULT now()
);
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON alerts
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Price history (written by cron with service role key — no RLS needed for inserts)
CREATE TABLE IF NOT EXISTS price_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  country      text NOT NULL,
  price        numeric NOT NULL,
  recorded_at  timestamptz DEFAULT now()
);
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read price history" ON price_history FOR SELECT USING (true);

-- Index for fast alert queries
CREATE INDEX IF NOT EXISTS alerts_triggered_idx ON alerts(triggered) WHERE triggered = false;
CREATE INDEX IF NOT EXISTS price_history_slug_idx ON price_history(product_slug, recorded_at DESC);
