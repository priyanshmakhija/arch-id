export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateBarcodeId = (type: 'catalog' | 'artifact' | 'subcatalog', index: number): string => {
  const prefix = type.charAt(0).toUpperCase();
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const paddedIndex = index.toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}${paddedIndex}`;
};

export const generateUniqueBarcode = (type: 'catalog' | 'artifact' | 'subcatalog'): string => {
  const prefix = type.charAt(0).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const validateBarcode = (barcode: string): boolean => {
  // Basic validation - should be alphanumeric and at least 8 characters
  return /^[A-Za-z0-9]{8,}$/.test(barcode);
};
