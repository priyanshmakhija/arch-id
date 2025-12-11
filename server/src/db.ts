// Database abstraction layer supporting both SQLite (local) and PostgreSQL (production)
import Database from 'better-sqlite3';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Early debug logging - check environment variable immediately
console.log('🔍 Environment check:');
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   DATABASE_URL value:', process.env.DATABASE_URL ? 
  (process.env.DATABASE_URL.substring(0, 30) + '...' + process.env.DATABASE_URL.substring(Math.max(0, process.env.DATABASE_URL.length - 20))) : 
  'NOT SET');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database interface to abstract SQLite and PostgreSQL
interface DatabaseAdapter {
  prepare(query: string): {
    run(...params: any[]): Promise<{ changes: number; lastInsertRowid?: number }> | { changes: number; lastInsertRowid?: number };
    get(...params: any[]): Promise<any> | any;
    all(...params: any[]): Promise<any[]> | any[];
  };
  exec(query: string): Promise<void> | void;
  isAsync: boolean;
}

// SQLite adapter (synchronous)
class SQLiteAdapter implements DatabaseAdapter {
  private db: Database.Database;
  isAsync = false;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  prepare(query: string) {
    const stmt = this.db.prepare(query);
    return {
      run: (...params: any[]) => stmt.run(...params) as { changes: number; lastInsertRowid?: number },
      get: (...params: any[]) => stmt.get(...params),
      all: (...params: any[]) => stmt.all(...params) as any[],
    };
  }

  exec(query: string) {
    this.db.exec(query);
  }

  get native() {
    return this.db;
  }
}

// PostgreSQL adapter (asynchronous)
class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: Pool;
  isAsync = true;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  prepare(query: string) {
    // Convert SQLite-style queries to PostgreSQL
    // Handle column names that need quoting (camelCase -> "camelCase")
    // Don't replace if already quoted (avoid ""heightDepth"" issues)
    const pgQuery = query
      .replace(/\b(catalogId|subCatalogId|creationDate|lastModified|heightDepth|locationFound|dateFound|images2D|image3D)\b/gi, (match, p1, offset, string) => {
        // Check if this identifier is already quoted
        const before = string.substring(Math.max(0, offset - 1), offset);
        const after = string.substring(offset + match.length, offset + match.length + 1);
        if (before === '"' || after === '"') {
          // Already quoted, don't quote again
          return match;
        }
        return `"${match}"`;
      })
      .replace(/\?/g, (match, offset, string) => {
        // Count ? before this position to determine parameter number
        const before = string.substring(0, offset);
        const paramNum = (before.match(/\?/g) || []).length + 1;
        return `$${paramNum}`;
      });

    return {
      run: async (...params: any[]) => {
        const result = await this.pool.query(pgQuery, params);
        return { 
          changes: result.rowCount || 0,
          lastInsertRowid: result.rows[0]?.id 
        };
      },
      get: async (...params: any[]) => {
        const result = await this.pool.query(pgQuery, params);
        return result.rows[0] || null;
      },
      all: async (...params: any[]) => {
        const result = await this.pool.query(pgQuery, params);
        return result.rows;
      },
    };
  }

  async exec(query: string) {
    // PostgreSQL doesn't support multiple statements in one query easily
    // Split by semicolon and execute each statement separately
    const statements = query.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const statement of statements) {
      try {
        await this.pool.query(statement);
      } catch (error: any) {
        // Ignore "already exists" errors for CREATE TABLE IF NOT EXISTS
        if (error.message && error.message.includes('already exists')) {
          continue;
        }
        throw error;
      }
    }
  }

  get native(): Pool {
    return this.pool;
  }
}

// Initialize database based on environment
let db: DatabaseAdapter;
const databaseUrl = process.env.DATABASE_URL;

// Debug logging to help troubleshoot
if (databaseUrl) {
  console.log('🔍 DATABASE_URL is set:', databaseUrl.substring(0, 20) + '...' + databaseUrl.substring(databaseUrl.length - 20));
} else {
  console.log('⚠️  DATABASE_URL is NOT set - using SQLite');
  console.log('   To use PostgreSQL, set DATABASE_URL environment variable');
}

// Check for both postgres:// and postgresql:// connection strings
if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
  // Use PostgreSQL in production (Render)
  console.log('🗄️  Using PostgreSQL database');
  // Normalize to postgres:// for pg library (it accepts both, but normalize for consistency)
  const normalizedUrl = databaseUrl.startsWith('postgresql://') 
    ? databaseUrl.replace('postgresql://', 'postgres://')
    : databaseUrl;
  db = new PostgreSQLAdapter(normalizedUrl);
} else {
  // Use SQLite for local development
  console.log('🗄️  Using SQLite database (local development)');
  const dbPath = path.join(__dirname, '..', 'data.sqlite');
  db = new SQLiteAdapter(dbPath);
}

// Initialize schema
async function initializeSchema() {
  const isPostgres = databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'));
  
  if (isPostgres) {
    // PostgreSQL schema - execute statements separately to avoid parsing issues
    try {
      await (db as PostgreSQLAdapter).native.query(`
        CREATE TABLE IF NOT EXISTS catalogs (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          "creationDate" TEXT NOT NULL,
          "lastModified" TEXT NOT NULL
        )
      `);
      
      await (db as PostgreSQLAdapter).native.query(`
        CREATE TABLE IF NOT EXISTS artifacts (
          id TEXT PRIMARY KEY,
          "catalogId" TEXT NOT NULL,
          "subCatalogId" TEXT,
          name TEXT NOT NULL,
          barcode TEXT NOT NULL UNIQUE,
          details TEXT NOT NULL,
          length TEXT,
          "heightDepth" TEXT,
          width TEXT,
          "locationFound" TEXT NOT NULL,
          "dateFound" TEXT NOT NULL,
          "images2D" TEXT NOT NULL,
          "image3D" TEXT,
          video TEXT,
          "creationDate" TEXT NOT NULL,
          "lastModified" TEXT NOT NULL,
          FOREIGN KEY ("catalogId") REFERENCES catalogs(id)
        )
      `);
      console.log('✅ PostgreSQL schema initialized successfully');
    } catch (error: any) {
      // Ignore "already exists" errors
      if (error.message && error.message.includes('already exists')) {
        console.log('✅ PostgreSQL tables already exist');
      } else {
        console.error('❌ Failed to initialize PostgreSQL schema:', error.message);
        throw error;
      }
    }
  } else {
    // SQLite schema
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
        barcode TEXT NOT NULL UNIQUE,
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
  }

  // Add dimension columns if they don't exist (SQLite only - PostgreSQL uses schema above)
  if (!isPostgres) {
    try {
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
    } catch (error) {
      // Columns might already exist, ignore error
    }
  }

  // Fill in missing dimensions (for both databases)
  // Only run if artifacts table exists and has data
  try {
    const randomDimensionValue = () => `${Math.floor(Math.random() * 16) + 5} cm`;
    type ArtifactDimensionRow = {
      id: string;
      length: string | null;
      heightDepth: string | null;
      width: string | null;
    };
    
    let artifactDimensionRows: ArtifactDimensionRow[];
    if (isPostgres) {
      // Use native query for PostgreSQL to avoid column name replacement issues
      const result = await (db as PostgreSQLAdapter).native.query('SELECT id, length, "heightDepth", width FROM artifacts');
      artifactDimensionRows = result.rows as ArtifactDimensionRow[];
    } else {
      artifactDimensionRows = db.prepare(`SELECT id, length, heightDepth, width FROM artifacts`).all() as ArtifactDimensionRow[];
    }

    // Only update if there are artifacts
    if (artifactDimensionRows.length > 0) {
      const updateDimensions = db.prepare(`
        UPDATE artifacts
        SET length = ?, heightDepth = ?, width = ?
        WHERE id = ?
      `);

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

        if (isPostgres) {
          await updateDimensions.run(lengthValue, heightDepthValue, widthValue, artifact.id);
        } else {
          (updateDimensions.run as any)(lengthValue, heightDepthValue, widthValue, artifact.id);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors in dimension update - not critical for schema initialization
    // This might fail if table doesn't exist yet or is empty, which is fine
    if (error.message && !error.message.includes('does not exist') && !error.message.includes('relation')) {
      console.warn('⚠️  Dimension update failed (non-critical):', error.message);
    }
  }
}

// Initialize schema on module load
if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
  // For PostgreSQL, we need to await
  initializeSchema().catch((error) => {
    console.error('Failed to initialize PostgreSQL schema:', error);
  });
} else {
  // For SQLite, synchronous is fine
  initializeSchema();
}

export default db;
