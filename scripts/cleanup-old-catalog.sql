-- SQL script to remove "Historical Artifacts Collection" and all its artifacts
-- Run this in your PostgreSQL database (via Render dashboard or psql)

-- Step 1: Find the catalog ID
SELECT id, name FROM catalogs WHERE name LIKE '%Historical%' OR name LIKE '%historical%';

-- Step 2: Delete all artifacts from that catalog
-- Replace '{catalog-id}' with the actual ID from Step 1
DELETE FROM artifacts WHERE "catalogId" = (
  SELECT id FROM catalogs WHERE name LIKE '%Historical%' OR name LIKE '%historical%' LIMIT 1
);

-- Step 3: Delete the catalog
DELETE FROM catalogs WHERE name LIKE '%Historical%' OR name LIKE '%historical%';

-- Step 4: Verify cleanup
SELECT COUNT(*) as remaining_catalogs FROM catalogs;
SELECT COUNT(*) as remaining_artifacts FROM artifacts;

-- Optional: Create the new default catalog if it doesn't exist
INSERT INTO catalogs (id, name, description, "creationDate", "lastModified")
SELECT 
  gen_random_uuid()::text,
  'Archaeology Artifacts Collection',
  'Default catalog for archaeological artifacts',
  NOW()::text,
  NOW()::text
WHERE NOT EXISTS (
  SELECT 1 FROM catalogs WHERE name = 'Archaeology Artifacts Collection'
);

