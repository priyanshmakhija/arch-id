import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the compiled JS file (dist/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in the server directory (one level up from dist/)
const dbPath = path.join(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS catalogs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  creationDate TEXT NOT NULL,
  lastModified TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  catalogId TEXT NOT NULL,
  subCatalogId TEXT,
  name TEXT NOT NULL,
  barcode TEXT NOT NULL,
  details TEXT NOT NULL,
  length TEXT,
  heightDepth TEXT,
  width TEXT,
  locationFound TEXT NOT NULL,
  dateFound TEXT NOT NULL,
  images2D TEXT NOT NULL,
  image3D TEXT,
  video TEXT,
  creationDate TEXT NOT NULL,
  lastModified TEXT NOT NULL,
  FOREIGN KEY (catalogId) REFERENCES catalogs(id)
);
`);

const artifactColumnRows = db.prepare(`PRAGMA table_info(artifacts)`).all() as Array<{ name: string }>;
const artifactColumns = artifactColumnRows.map((row) => row.name);
const dimensionColumns = [
  { name: 'length', type: 'TEXT' },
  { name: 'heightDepth', type: 'TEXT' },
  { name: 'width', type: 'TEXT' },
];

for (const column of dimensionColumns) {
  if (!artifactColumns.includes(column.name)) {
    db.exec(`ALTER TABLE artifacts ADD COLUMN ${column.name} ${column.type}`);
  }
}

const randomDimensionValue = () => `${Math.floor(Math.random() * 16) + 5} cm`;
type ArtifactDimensionRow = {
  id: string;
  length: string | null;
  heightDepth: string | null;
  width: string | null;
};
const updateDimensions = db.prepare(`
  UPDATE artifacts
  SET length = ?, heightDepth = ?, width = ?
  WHERE id = ?
`);

const artifactDimensionRows = db.prepare(`
  SELECT id, length, heightDepth, width
  FROM artifacts
`).all() as ArtifactDimensionRow[];

for (const artifact of artifactDimensionRows) {
  const currentLength = artifact.length?.toString().trim();
  const currentHeightDepth = artifact.heightDepth?.toString().trim();
  const currentWidth = artifact.width?.toString().trim();

  if (currentLength && currentHeightDepth && currentWidth) {
    continue;
  }

  const lengthValue = currentLength && currentLength.length > 0 ? currentLength : randomDimensionValue();
  const heightDepthValue =
    currentHeightDepth && currentHeightDepth.length > 0 ? currentHeightDepth : randomDimensionValue();
  const widthValue = currentWidth && currentWidth.length > 0 ? currentWidth : randomDimensionValue();

  updateDimensions.run(lengthValue, heightDepthValue, widthValue, artifact.id);
}

export default db;


