import { Artifact, AuthUser, Catalog } from '../types';
import { AUTH_STORAGE_KEY } from '../context/AuthContext';

// Get API URL from environment variable, window variable, or use default
// Priority:
// 1. REACT_APP_API_URL (build-time environment variable)
// 2. window.ARCHAEOLOGY_API_URL (runtime configuration from index.html)
// 3. Runtime detection based on hostname
const getApiUrl = (): string => {
  // Check if REACT_APP_API_URL is set (build-time variable)
  // In compiled code, this will be replaced with the actual value or undefined
  const envApiUrl = typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : null;
  
  // If environment variable is set and not empty, use it
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') {
    const url = envApiUrl.trim();
    // Ensure URL is complete (has protocol)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Add https:// if missing
    return `https://${url}`;
  }
  
  // Check for runtime configuration from window (set in index.html)
  if (typeof window !== 'undefined' && (window as any).ARCHAEOLOGY_API_URL) {
    const windowApiUrl = (window as any).ARCHAEOLOGY_API_URL;
    if (windowApiUrl && typeof windowApiUrl === 'string' && windowApiUrl.trim() !== '') {
      const url = windowApiUrl.trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    }
  }
  
  // Fallback: Use localhost for development, backend URL for production
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Production fallback - ALWAYS use backend URL on Render
  // This ensures the frontend always connects to the backend in production
  return 'https://archaeology-api.onrender.com';
};

const API_URL = getApiUrl();

// Log API URL for debugging (always log in production to help troubleshoot)
if (typeof window !== 'undefined') {
  console.log('API URL configured:', API_URL);
  console.log('Window location:', window.location.href);
  console.log('Window hostname:', window.location.hostname);
  console.log('Environment REACT_APP_API_URL:', (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'not set');
  
  // Validate API_URL is a full URL
  if (!API_URL || API_URL.trim() === '') {
    console.error('ERROR: API_URL is empty!');
  } else if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
    console.error('ERROR: API_URL is not a full URL:', API_URL);
  }
}

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
    // Ensure API_URL is set and is a full URL
    if (!API_URL || API_URL.trim() === '') {
      console.error('API_URL is not set!');
      throw new Error('API URL is not configured');
    }
    
    // Ensure API_URL is a full URL (starts with http:// or https://)
    const apiUrl = API_URL.startsWith('http://') || API_URL.startsWith('https://') 
      ? API_URL 
      : `https://${API_URL}`;
    
    const fullUrl = `${apiUrl}/api/artifacts`;
    console.log('Fetching artifacts from:', fullUrl);
    console.log('API_URL value:', API_URL);
    
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Artifacts response status:', res.status, res.statusText);
    console.log('Artifacts response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to fetch artifacts:', res.status, errorText);
      console.error('Request URL was:', fullUrl);
      return handleApiError(res, 'Failed to load artifacts');
    }
    const artifacts = await res.json();
    console.log('Fetched artifacts:', artifacts.length);
    return artifacts;
  } catch (error) {
    console.error('Fetch artifacts error:', error);
    console.error('API_URL was:', API_URL);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`Cannot connect to backend API at ${API_URL}. Please check if the backend is running.`);
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


