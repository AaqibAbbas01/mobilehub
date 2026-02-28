-- ============================================
-- Migration 014: Fix identifier columns for non-phone businesses
-- imei_1 was VARCHAR(15) NOT NULL — too narrow for serial numbers / SKUs
-- ============================================

-- Make imei_1 nullable (non-phone products won't have an IMEI)
ALTER TABLE phones ALTER COLUMN imei_1 DROP NOT NULL;

-- Widen imei_1 to 100 chars to accommodate serial numbers / SKUs
ALTER TABLE phones ALTER COLUMN imei_1 TYPE VARCHAR(100);

-- Widen imei_2 similarly
ALTER TABLE phones ALTER COLUMN imei_2 TYPE VARCHAR(100);

-- Widen serial_number
ALTER TABLE phones ALTER COLUMN serial_number TYPE VARCHAR(200);
