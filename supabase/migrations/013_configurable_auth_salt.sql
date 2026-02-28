-- ============================================
-- Migration 013: Configurable password salt +
--                dynamic order number prefix
-- ============================================

-- ── Auth config ──────────────────────────────
-- Store the auth salt in a separate protected table
CREATE TABLE IF NOT EXISTS auth_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password_salt TEXT NOT NULL DEFAULT 'platform_salt_v1',
  -- NOTE: existing installs that used 'mobilehub_salt_2026' should update
  -- this row via the Supabase SQL editor:
  --   UPDATE auth_config SET password_salt = 'mobilehub_salt_2026';
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row (only if none exists)
INSERT INTO auth_config (password_salt)
SELECT 'platform_salt_v1'
WHERE NOT EXISTS (SELECT 1 FROM auth_config);

-- Update hash_password to use the auth_config salt row
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
DECLARE
  v_salt TEXT;
BEGIN
  SELECT password_salt INTO v_salt FROM auth_config LIMIT 1;
  IF v_salt IS NULL THEN
    v_salt := 'platform_salt_v1';
  END IF;
  RETURN encode(digest(password || v_salt, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- verify_password stays the same (calls updated hash_password)
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash_password(password) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: only service role can update auth_config
ALTER TABLE auth_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON auth_config;
CREATE POLICY "Service role only" ON auth_config
  USING (auth.role() = 'service_role');

-- ── Order number prefix ───────────────────────
-- Update generate_order_number() to read prefix from business_config
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  v_prefix TEXT;
BEGIN
  -- Try to get the order prefix from business_config
  SELECT order_prefix INTO v_prefix FROM business_config LIMIT 1;
  IF v_prefix IS NULL OR v_prefix = '' THEN
    v_prefix := 'ORD';
  END IF;
  NEW.order_number := v_prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger (idempotent)
DROP TRIGGER IF EXISTS trigger_generate_order_number ON orders;
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION generate_order_number();

