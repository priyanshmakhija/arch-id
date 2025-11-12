import express from 'express';
import cors from 'cors';
import db from './db.js';
import { z } from 'zod';

const app = express();

// CORS configuration - allow frontend origin
const corsOrigin = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsOrigin === '*' 
  ? true 
  : corsOrigin.split(',').map(origin => origin.trim()).filter(origin => origin);

console.log('CORS Origin configured:', corsOrigin);
console.log('Allowed origins:', allowedOrigins);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role']
}));
app.use(express.json({ limit: '5mb' }));

// Root route - API information
app.get('/', (_req, res) => {
  res.json({
    message: 'Archaeology Catalog API',
    version: '1.0.0',
    endpoints: {
      login: 'POST /api/login',
      catalogs: 'GET /api/catalogs',
      artifacts: 'GET /api/artifacts',
      stats: 'GET /api/stats'
    },
    status: 'running'
  });
});

type UserRole = 'admin' | 'archaeologist' | 'researcher' | 'user';
const allowedRoles: UserRole[] = ['admin', 'archaeologist', 'researcher', 'user'];

type AuthUser = {
  username: string;
  password: string;
  role: UserRole;
  name: string;
};

const users: Record<string, AuthUser> = {
  admin: { username: 'admin', password: 'admin', role: 'admin', name: 'Admin' },
  archaeologist: { username: 'archaeologist', password: 'archaeologist', role: 'archaeologist', name: 'Archaeologist' },
  researcher: { username: 'researcher', password: 'researcher', role: 'researcher', name: 'Researcher' },
  user: { username: 'user', password: 'user', role: 'user', name: 'User' },
};

const getRequestRole = (req: express.Request): UserRole | null => {
  const headerRole = req.header('x-user-role');
  if (!headerRole) return null;
  const normalized = headerRole.toLowerCase() as UserRole;
  return allowedRoles.includes(normalized) ? normalized : null;
};

const ensureRole = (req: express.Request, res: express.Response, permittedRoles: UserRole[]) => {
  const role = getRequestRole(req);
  if (!role || !permittedRoles.includes(role)) {
    res.status(403).json({ error: 'Forbidden: insufficient role permissions' });
    return null;
  }
  return role;
};

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

app.post('/api/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  const { username, password } = parse.data;
  const userKey = username.toLowerCase();
  const authUser = users[userKey];

  if (!authUser || authUser.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({ name: authUser.name, role: authUser.role });
});

// Catalog routes
app.get('/api/catalogs', (_req, res) => {
  const rows = db.prepare('SELECT * FROM catalogs').all();
  res.json(rows);
});

app.get('/api/catalogs/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM catalogs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

const catalogSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().default(''),
  creationDate: z.string(),
  lastModified: z.string(),
});

app.post('/api/catalogs', (req, res) => {
  const parse = catalogSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const c = parse.data;
  const stmt = db.prepare(
    'INSERT INTO catalogs (id, name, description, creationDate, lastModified) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(c.id, c.name, c.description, c.creationDate, c.lastModified);
  res.status(201).json(c);
});

const catalogUpdateSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  lastModified: z.string(),
});

app.put('/api/catalogs/:id', (req, res) => {
  const parse = catalogUpdateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const c = parse.data;
  const stmt = db.prepare('UPDATE catalogs SET name = ?, description = ?, lastModified = ? WHERE id = ?');
  const result = stmt.run(c.name, c.description, c.lastModified, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  const updated = db.prepare('SELECT * FROM catalogs WHERE id = ?').get(req.params.id);
  res.json(updated);
});

app.delete('/api/catalogs/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM catalogs WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Artifact routes
app.get('/api/artifacts', (_req, res) => {
  const rows = db.prepare('SELECT * FROM artifacts').all();
  const artifacts = rows.map((r: any) => ({
    ...r,
    images2D: JSON.parse(r.images2D ?? '[]'),
    comments: [], // Comments are stored separately if needed, default to empty array
  }));
  res.json(artifacts);
});

app.get('/api/artifacts/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM artifacts WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Not found' });
  const artifact = { 
    ...row, 
    images2D: JSON.parse(row.images2D ?? '[]'),
    comments: [], // Comments are stored separately if needed, default to empty array
  };
  res.json(artifact);
});

const artifactSchema = z.object({
  id: z.string(),
  catalogId: z.string(),
  subCatalogId: z.string().optional(),
  name: z.string().min(1),
  barcode: z.string().min(1),
  details: z.string(),
  length: z.string().optional(),
  heightDepth: z.string().optional(),
  width: z.string().optional(),
  locationFound: z.string(),
  dateFound: z.string(),
  images2D: z.array(z.string()),
  image3D: z.string().optional(),
  video: z.string().optional(),
  creationDate: z.string(),
  lastModified: z.string(),
});

app.post('/api/artifacts', (req, res) => {
  if (!ensureRole(req, res, ['admin', 'archaeologist'])) return;
  const parse = artifactSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const a = parse.data;
  
  try {
    // Verify catalog exists
    const catalog = db.prepare('SELECT id FROM catalogs WHERE id = ?').get(a.catalogId);
    if (!catalog) {
      return res.status(400).json({ error: `Catalog with id "${a.catalogId}" does not exist` });
    }
    
    // Check if barcode already exists
    const existingBarcode = db.prepare('SELECT id FROM artifacts WHERE barcode = ?').get(a.barcode);
    if (existingBarcode) {
      return res.status(400).json({ error: `Artifact with barcode "${a.barcode}" already exists` });
    }
    
    // Check if artifact ID already exists
    const existingId = db.prepare('SELECT id FROM artifacts WHERE id = ?').get(a.id);
    if (existingId) {
      return res.status(400).json({ error: `Artifact with id "${a.id}" already exists` });
    }
    
    const stmt = db.prepare(`
      INSERT INTO artifacts (
        id, catalogId, subCatalogId, name, barcode, details,
        length, heightDepth, width,
        locationFound, dateFound, images2D, image3D, video,
        creationDate, lastModified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      a.id,
      a.catalogId,
      a.subCatalogId ?? null,
      a.name,
      a.barcode,
      a.details,
      a.length ?? null,
      a.heightDepth ?? null,
      a.width ?? null,
      a.locationFound,
      a.dateFound,
      JSON.stringify(a.images2D ?? []),
      a.image3D ?? null,
      a.video ?? null,
      a.creationDate,
      a.lastModified
    );
    
    res.status(201).json(a);
  } catch (error: any) {
    console.error('Error creating artifact:', error);
    // Check for SQLite constraint errors
    if (error.code === 'SQLITE_CONSTRAINT') {
      if (error.message.includes('FOREIGN KEY')) {
        return res.status(400).json({ error: `Catalog with id "${a.catalogId}" does not exist` });
      }
      if (error.message.includes('UNIQUE')) {
        if (error.message.includes('barcode')) {
          return res.status(400).json({ error: `Artifact with barcode "${a.barcode}" already exists` });
        }
        if (error.message.includes('id')) {
          return res.status(400).json({ error: `Artifact with id "${a.id}" already exists` });
        }
      }
      return res.status(400).json({ error: 'Database constraint violation', details: error.message });
    }
    // Generic error
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

const artifactUpdateSchema = z.object({
  catalogId: z.string(),
  subCatalogId: z.string().optional(),
  name: z.string().min(1),
  barcode: z.string().min(1),
  details: z.string(),
  length: z.string().optional(),
  heightDepth: z.string().optional(),
  width: z.string().optional(),
  locationFound: z.string(),
  dateFound: z.string(),
  images2D: z.array(z.string()),
  image3D: z.string().optional(),
  video: z.string().optional(),
  lastModified: z.string(),
});

app.put('/api/artifacts/:id', (req, res) => {
  if (!ensureRole(req, res, ['admin', 'archaeologist'])) return;
  const parse = artifactUpdateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const a = parse.data;
  const stmt = db.prepare(`
    UPDATE artifacts SET
      catalogId = ?, subCatalogId = ?, name = ?, barcode = ?, details = ?,
      length = ?, heightDepth = ?, width = ?,
      locationFound = ?, dateFound = ?, images2D = ?, image3D = ?, video = ?,
      lastModified = ?
    WHERE id = ?
  `);
  const result = stmt.run(
    a.catalogId,
    a.subCatalogId ?? null,
    a.name,
    a.barcode,
    a.details,
    a.length ?? null,
    a.heightDepth ?? null,
    a.width ?? null,
    a.locationFound,
    a.dateFound,
    JSON.stringify(a.images2D ?? []),
    a.image3D ?? null,
    a.video ?? null,
    a.lastModified,
    req.params.id
  );
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  const updated = db.prepare('SELECT * FROM artifacts WHERE id = ?').get(req.params.id) as any;
  const artifact = { 
    ...updated, 
    images2D: JSON.parse(updated.images2D ?? '[]'),
    comments: [], // Comments are stored separately if needed, default to empty array
  };
  res.json(artifact);
});

app.delete('/api/artifacts/:id', (req, res) => {
  if (!ensureRole(req, res, ['admin', 'archaeologist'])) return;
  const stmt = db.prepare('DELETE FROM artifacts WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Stats endpoint
app.get('/api/stats', (_req, res) => {
  const catalogCount = db.prepare('SELECT COUNT(*) as count FROM catalogs').get() as any;
  const artifactCount = db.prepare('SELECT COUNT(*) as count FROM artifacts').get() as any;
  const recentCount = db.prepare(`
    SELECT COUNT(*) as count FROM artifacts 
    WHERE creationDate > datetime('now', '-7 days')
  `).get() as any;
  res.json({
    totalCatalogs: catalogCount?.count ?? 0,
    totalArtifacts: artifactCount?.count ?? 0,
    recentAdditions: recentCount?.count ?? 0,
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://0.0.0.0:${port}`);
  console.log(`Accessible from your local network at http://192.168.4.29:${port}`);
});


