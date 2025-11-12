export interface Catalog {
  id: string;
  name: string;
  description: string;
  artifacts: string[];
  subCatalogs?: string[];
  creationDate: string;
  lastModified: string;
}

export interface Artifact {
  id: string;
  catalogId: string;
  subCatalogId?: string;
  name: string;
  barcode: string;
  details: string;
  length?: string | null;
  heightDepth?: string | null;
  width?: string | null;
  locationFound: string;
  dateFound: string;
  comments: Comment[];
  images2D: string[];
  image3D?: string;
  video?: string;
  creationDate: string;
  lastModified: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

export interface SubCatalog {
  id: string;
  catalogId: string;
  name: string;
  description: string;
  artifacts: string[];
  creationDate: string;
  lastModified: string;
}

export type UserRole = 'admin' | 'researcher' | 'archaeologist' | 'user';

export interface AuthUser {
  name: string;
  role: UserRole;
}
