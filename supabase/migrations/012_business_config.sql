-- ============================================
-- Migration 012: Business Configuration
-- Adds white-label multi-business support
-- ============================================

-- Business configuration table (one row per install)
CREATE TABLE IF NOT EXISTS business_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Business identity
  business_type VARCHAR(50) NOT NULL DEFAULT 'mobile_phones',
  -- e.g. mobile_phones, laptops, clothing, jewelry, books, electronics, cars, furniture, custom

  -- Product terminology (replaces hardcoded "phone" references)
  product_name_singular VARCHAR(50) NOT NULL DEFAULT 'Phone',
  product_name_plural   VARCHAR(50) NOT NULL DEFAULT 'Phones',

  -- Unique identifier label (replaces "IMEI")
  identifier_label      VARCHAR(50) NOT NULL DEFAULT 'IMEI',
  identifier_2_label    VARCHAR(50) NOT NULL DEFAULT 'IMEI 2',
  identifier_required   BOOLEAN NOT NULL DEFAULT true,
  identifier_unique     BOOLEAN NOT NULL DEFAULT true,

  -- Condition/quality grade labels (JSON map: grade_key -> display_label)
  condition_labels JSONB NOT NULL DEFAULT '{
    "A+": "Like New",
    "A":  "Excellent",
    "B+": "Very Good",
    "B":  "Good",
    "C":  "Fair",
    "D":  "Acceptable"
  }'::jsonb,

  -- Whether to show condition grades at all
  use_condition_grades  BOOLEAN NOT NULL DEFAULT true,

  -- Whether to show battery health field
  use_battery_health    BOOLEAN NOT NULL DEFAULT true,

  -- Whether to show the 15-point functional test checklist
  use_functional_tests  BOOLEAN NOT NULL DEFAULT true,

  -- Order / invoice number prefix (replaces 'MH')
  order_prefix          VARCHAR(10) NOT NULL DEFAULT 'MH',

  -- Currency config
  currency_symbol       VARCHAR(5) NOT NULL DEFAULT '₹',
  currency_code         VARCHAR(5) NOT NULL DEFAULT 'INR',
  currency_locale       VARCHAR(20) NOT NULL DEFAULT 'en-IN',

  -- Primary categories / brands (JSON array of strings)
  primary_categories    JSONB NOT NULL DEFAULT '["Apple","Samsung","OnePlus","Xiaomi","Vivo","Oppo","Realme","Google","Nothing","Motorola","iQOO","Poco"]'::jsonb,
  category_label        VARCHAR(50) NOT NULL DEFAULT 'Brand',
  -- e.g. "Brand" for phones, "Category" for clothing, "Make" for cars

  -- Secondary category label (replaces "Model")
  subcategory_label     VARCHAR(50) NOT NULL DEFAULT 'Model',

  -- Variant label (replaces "Storage/RAM")
  variant_label         VARCHAR(50) NOT NULL DEFAULT 'Storage / RAM',

  -- Seller terminology
  seller_label          VARCHAR(50) NOT NULL DEFAULT 'Seller',
  -- e.g. "Supplier", "Vendor", "Consignor"

  -- Inventory status options (JSON array)
  inventory_statuses    JSONB NOT NULL DEFAULT '["Available","Reserved","Sold","Under Repair","Quality Check","Listed Online"]'::jsonb,

  -- Inquiry sources (JSON array)
  inquiry_sources       JSONB NOT NULL DEFAULT '["WhatsApp","Website","Walk-in","OLX","Phone Call"]'::jsonb,

  -- WhatsApp / contact labels
  whatsapp_cta_label    VARCHAR(100) NOT NULL DEFAULT 'Inquire on WhatsApp',
  whatsapp_inquiry_template TEXT NOT NULL DEFAULT 'Hi! I''m interested in the {{category}} {{subcategory}} ({{variant}}) listed at {{price}}. Is it still available?',

  -- Public site hero content (replaces hardcoded stats)
  hero_stat_1_value     VARCHAR(50) NOT NULL DEFAULT '15,000+',
  hero_stat_1_label     VARCHAR(50) NOT NULL DEFAULT 'Phones Sold',
  hero_stat_2_value     VARCHAR(50) NOT NULL DEFAULT '12,500+',
  hero_stat_2_label     VARCHAR(50) NOT NULL DEFAULT 'Happy Customers',
  hero_stat_3_value     VARCHAR(50) NOT NULL DEFAULT '8+',
  hero_stat_3_label     VARCHAR(50) NOT NULL DEFAULT 'Years Experience',
  hero_stat_4_value     VARCHAR(50) NOT NULL DEFAULT '< 2%',
  hero_stat_4_label     VARCHAR(50) NOT NULL DEFAULT 'Warranty Claims',

  -- About page content
  about_story           TEXT,
  about_founding_year   VARCHAR(10),
  about_location        VARCHAR(100),

  -- FAQ (JSON array of {question, answer})
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- GST / Tax settings
  gst_enabled           BOOLEAN NOT NULL DEFAULT true,
  gst_rate              NUMERIC(5,2) NOT NULL DEFAULT 18.0,
  gst_label             VARCHAR(20) NOT NULL DEFAULT 'GST',

  -- Feature flags
  enable_whatsapp_ai    BOOLEAN NOT NULL DEFAULT true,
  enable_leads_module   BOOLEAN NOT NULL DEFAULT true,
  enable_marketing_module BOOLEAN NOT NULL DEFAULT true,
  enable_seller_tracking BOOLEAN NOT NULL DEFAULT true,
  enable_imei_check     BOOLEAN NOT NULL DEFAULT true,

  -- Setup status
  setup_completed       BOOLEAN NOT NULL DEFAULT false,
  setup_completed_at    TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast single-row fetch
CREATE INDEX IF NOT EXISTS idx_business_config_type ON business_config(business_type);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_business_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_config_updated_at
  BEFORE UPDATE ON business_config
  FOR EACH ROW
  EXECUTE PROCEDURE update_business_config_timestamp();

-- Insert the default row (matches current MobileHub Delhi setup)
INSERT INTO business_config (
  business_type,
  product_name_singular,
  product_name_plural,
  identifier_label,
  identifier_2_label,
  identifier_required,
  identifier_unique,
  order_prefix,
  category_label,
  subcategory_label,
  variant_label,
  seller_label,
  hero_stat_1_value, hero_stat_1_label,
  hero_stat_2_value, hero_stat_2_label,
  hero_stat_3_value, hero_stat_3_label,
  hero_stat_4_value, hero_stat_4_label,
  about_founding_year,
  about_location,
  setup_completed
) VALUES (
  'mobile_phones',
  'Phone',
  'Phones',
  'IMEI',
  'IMEI 2',
  true,
  true,
  'MH',
  'Brand',
  'Model',
  'Storage / RAM',
  'Seller',
  '15,000+', 'Phones Sold',
  '12,500+', 'Happy Customers',
  '8+',      'Years Experience',
  '< 2%',    'Warranty Claims',
  '2016',
  'Delhi, India',
  true
) ON CONFLICT DO NOTHING;
