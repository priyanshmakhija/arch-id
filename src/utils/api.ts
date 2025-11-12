import { Artifact, AuthUser, Catalog } from '../types';
import { AUTH_STORAGE_KEY } from '../context/AuthContext';

// Get API URL from environment variable or use default
// In production, this should be set during build time via REACT_APP_API_URL
const getApiUrl = (): string => {
  // Check if REACT_APP_API_URL is set (build-time variable)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback: Use localhost for development, backend URL for production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Production fallback - use backend URL on Render
  return 'https://archaeology-api.onrender.com';
};

const API_URL = getApiUrl();

// Log API URL for debugging (always log in production to help troubleshoot)
console.log('API URL configured:', API_URL);

// Helper function to handle API errors
const handleApiError = async (response: Response, defaultMessage: string): Promise<never> => {
  let errorMessage = defaultMessage;
  try {
    const text = await response.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        errorMessage = json.error || json.message || text;
      } catch {
        errorMessage = text;
      }
    }
  } catch {
    // Use default message
  }
  console.error(`API Error (${response.status}):`, errorMessage);
  throw new Error(errorMessage);
};

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
  try {
    const res = await fetch(`${API_URL}/api/artifacts`);
    if (!res.ok) {
      return handleApiError(res, 'Failed to load artifacts');
    }
    return res.json();
  } catch (error) {
    console.error('Fetch artifacts error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_URL}. Please check if the backend is running.`);
    }
    throw error;
  }
}

export async function fetchArtifact(id: string): Promise<Artifact> {
  const res = await fetch(`${API_URL}/api/artifacts/${id}`);
  if (!res.ok) throw new Error('Failed to load artifact');
  return res.json();
}

export async function loginUser(username: string, password: string): Promise<AuthUser> {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      return handleApiError(res, 'Failed to authenticate. Please check your username and password.');
    }

    return res.json();
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_URL}. Please check if the backend is running.`);
    }
    throw error;
  }
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


