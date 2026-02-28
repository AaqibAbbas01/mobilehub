-- ============================================
-- Migration 013: Multi-Profile / Category Isolation
-- Every data row is tagged to a business_config profile.
-- Existing data is back-filled to the first profile.
-- ============================================

-- 1. Add a human-readable display_name to business_config
ALTER TABLE business_config
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Default the display_name from product_name_plural
UPDATE business_config
SET display_name = product_name_plural || ' Business'
WHERE display_name IS NULL;

-- 2. Add profile_id to all data tables
ALTER TABLE phones
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE CASCADE;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;

ALTER TABLE sellers
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;

ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;

-- Leads (if the table exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leads') THEN
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;
  END IF;
END $$;

-- WhatsApp conversations (if the table exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'whatsapp_conversations') THEN
    ALTER TABLE whatsapp_conversations ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Scope custom fields and field config to profiles
ALTER TABLE custom_fields
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE CASCADE;

ALTER TABLE field_config
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE CASCADE;

-- 4. Associate admin users with a profile (NULL = super admin, access all)
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE SET NULL;

-- 5. Add profile_id to settings table (if it exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'settings') THEN
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES business_config(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Back-fill: tag all existing rows with the first/only business_config row
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  first_profile_id UUID;
BEGIN
  SELECT id INTO first_profile_id
  FROM business_config
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_profile_id IS NOT NULL THEN
    UPDATE phones           SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE orders           SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE customers        SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE sellers          SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE inquiries        SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE custom_fields    SET profile_id = first_profile_id WHERE profile_id IS NULL;
    UPDATE field_config     SET profile_id = first_profile_id WHERE profile_id IS NULL;
    -- admin_users intentionally left NULL (super admin access)

    -- Update display_name for the first profile using settings store_name if available
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'settings') THEN
      UPDATE business_config bc
      SET display_name = (
        SELECT store_name FROM settings s
        WHERE s.profile_id IS NULL OR s.profile_id = first_profile_id
        LIMIT 1
      )
      WHERE bc.id = first_profile_id
        AND bc.display_name IS NOT NULL;
    END IF;

    -- Back-fill leads if column was added
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'profile_id') THEN
      UPDATE leads SET profile_id = first_profile_id WHERE profile_id IS NULL;
    END IF;

    -- Back-fill whatsapp_conversations if column was added
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'whatsapp_conversations' AND column_name = 'profile_id') THEN
      UPDATE whatsapp_conversations SET profile_id = first_profile_id WHERE profile_id IS NULL;
    END IF;

    -- Back-fill settings if column was added
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'profile_id') THEN
      UPDATE settings SET profile_id = first_profile_id WHERE profile_id IS NULL;
    END IF;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Indexes for fast profile-scoped queries
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_phones_profile_id            ON phones(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_profile_id            ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_customers_profile_id         ON customers(profile_id);
CREATE INDEX IF NOT EXISTS idx_sellers_profile_id           ON sellers(profile_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_profile_id         ON inquiries(profile_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_profile_id     ON custom_fields(profile_id);
CREATE INDEX IF NOT EXISTS idx_field_config_profile_id      ON field_config(profile_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_profile_id       ON admin_users(profile_id);

-- Drop the old UNIQUE constraint on custom_fields (table_name, field_name) 
-- since the same field_name can exist in multiple profiles now
ALTER TABLE custom_fields DROP CONSTRAINT IF EXISTS custom_fields_table_name_field_name_key;
CREATE UNIQUE INDEX IF NOT EXISTS custom_fields_profile_table_field_unique
  ON custom_fields(profile_id, table_name, field_name);

-- Same for field_config
ALTER TABLE field_config DROP CONSTRAINT IF EXISTS field_config_table_name_field_name_key;
CREATE UNIQUE INDEX IF NOT EXISTS field_config_profile_table_field_unique
  ON field_config(profile_id, table_name, field_name);
