DROP TABLE IF EXISTS passport.qrcode_scans;

ALTER TABLE events.events DROP COLUMN IF EXISTS stamp_id;

DROP TABLE IF EXISTS passport.stamps;

DROP SCHEMA IF EXISTS passport;
