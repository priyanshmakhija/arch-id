import { Artifact, AuthUser, Catalog } from '../types';
import { AUTH_STORAGE_KEY } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

type StoredUser = { role: string };

const getAuthHeaders = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as StoredUser;
    if (parsed?.role) {
      return { 'x-user-role': parsed.role };
    }
  } catch (error) {
    console.warn('Unable to read auth headers from storage:', error);
  }
  return {};
};

export async function fetchCatalogs(): Promise<Catalog[]> {
  const res = await fetch(`${API_URL}/api/catalogs`);
  if (!res.ok) throw new Error('Failed to load catalogs');
  const rows = await res.json();
  // Map DB catalogs to app Catalog shape (add artifacts array for compatibility)
  return rows.map((c: any) => ({ ...c, artifacts: c.artifacts ?? [] }));
}

export async function fetchCatalog(id: string): Promise<Catalog> {
  const res = await fetch(`${API_URL}/api/catalogs/${id}`);
  if (!res.ok) throw new Error('Failed to load catalog');
  const c = await res.json();
  return { ...c, artifacts: c.artifacts ?? [] } as Catalog;
}

export async function createCatalog(catalog: Catalog): Promise<Catalog> {
  const res = await fetch(`${API_URL}/api/catalogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog),
  });
  if (!res.ok) throw new Error('Failed to create catalog');
  return res.json();
}

export async function fetchArtifacts(): Promise<Artifact[]> {
  const res = await fetch(`${API_URL}/api/artifacts`);
  if (!res.ok) throw new Error('Failed to load artifacts');
  return res.json();
}

export async function fetchArtifact(id: string): Promise<Artifact> {
  const res = await fetch(`${API_URL}/api/artifacts/${id}`);
  if (!res.ok) throw new Error('Failed to load artifact');
  return res.json();
}

export async function loginUser(username: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to authenticate');
  }

  return res.json();
}

export async function createArtifact(artifact: Artifact): Promise<Artifact> {
  const res = await fetch(`${API_URL}/api/artifacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(artifact),
  });
  if (!res.ok) throw new Error('Failed to create artifact');
  return res.json();
}

export async function updateCatalog(id: string, catalog: Partial<Catalog>): Promise<Catalog> {
  const res = await fetch(`${API_URL}/api/catalogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog),
  });
  if (!res.ok) throw new Error('Failed to update catalog');
  const c = await res.json();
  return { ...c, artifacts: c.artifacts ?? [] } as Catalog;
}

export async function deleteCatalog(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/catalogs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete catalog');
}

export async function updateArtifact(id: string, artifact: Partial<Artifact>): Promise<Artifact> {
  const res = await fetch(`${API_URL}/api/artifacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(artifact),
  });
  if (!res.ok) throw new Error('Failed to update artifact');
  return res.json();
}

export async function deleteArtifact(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/artifacts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete artifact');
}

export interface Stats {
  totalCatalogs: number;
  totalArtifacts: number;
  recentAdditions: number;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}


