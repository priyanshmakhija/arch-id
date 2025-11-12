import { Catalog, Artifact, SubCatalog } from '../types';

const STORAGE_KEYS = {
  CATALOGS: 'archaeology_catalogs',
  ARTIFACTS: 'archaeology_artifacts',
  SUBCATALOGS: 'archaeology_subcatalogs'
};

export const loadCatalogs = (): Catalog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATALOGS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading catalogs:', error);
    return [];
  }
};

export const saveCatalogs = (catalogs: Catalog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATALOGS, JSON.stringify(catalogs));
  } catch (error) {
    console.error('Error saving catalogs:', error);
  }
};

export const loadArtifacts = (): Artifact[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTIFACTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading artifacts:', error);
    return [];
  }
};

export const saveArtifacts = (artifacts: Artifact[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTIFACTS, JSON.stringify(artifacts));
  } catch (error) {
    console.error('Error saving artifacts:', error);
  }
};

export const loadSubCatalogs = (): SubCatalog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBCATALOGS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading subcatalogs:', error);
    return [];
  }
};

export const saveSubCatalogs = (subCatalogs: SubCatalog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBCATALOGS, JSON.stringify(subCatalogs));
  } catch (error) {
    console.error('Error saving subcatalogs:', error);
  }
};
