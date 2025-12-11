import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Save, Plus } from 'lucide-react';
import { Artifact, Catalog } from '../types';
import { loadCatalogs, loadArtifacts, saveArtifacts, saveCatalogs } from '../utils/storageUtils';
import { createArtifact, fetchArtifacts, fetchCatalogs, createCatalog } from '../utils/api';
import { generateUniqueId, generateBarcodeId } from '../utils/barcodeUtils';
import MediaUpload from '../components/MediaUpload';
import QRCodeGenerator from '../components/QRCodeGenerator';

const AddArtifactPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catalogId = searchParams.get('catalogId');
  
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    catalogId: catalogId || '',
    details: '',
    length: '',
    heightDepth: '',
    width: '',
    locationFound: '',
    dateFound: '',
    barcode: ''
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdArtifact, setCreatedArtifact] = useState<Artifact | null>(null);

  useEffect(() => {
    // Load catalogs from API (database)
    const loadCatalogsFromAPI = async () => {
      try {
        const apiCatalogs = await fetchCatalogs();
        if (apiCatalogs.length === 0) {
          // Auto-create a default catalog if none exists
          const defaultCatalog: Catalog = {
            id: generateUniqueId(),
            name: 'Default Catalog',
            description: 'Default catalog for artifacts',
            artifacts: [],
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          };
          try {
            await createCatalog(defaultCatalog);
            setCatalogs([defaultCatalog]);
            setFormData(prev => ({ ...prev, catalogId: defaultCatalog.id }));
          } catch (error) {
            console.warn('Could not create default catalog:', error);
            setCatalogs([]);
          }
        } else {
          setCatalogs(apiCatalogs);
          // Auto-select first catalog if none selected
          if (!formData.catalogId && apiCatalogs.length > 0) {
            setFormData(prev => ({ ...prev, catalogId: apiCatalogs[0].id }));
          }
        }
      } catch (error) {
        // Fallback to local storage if API fails
        const storedCatalogs = loadCatalogs();
        setCatalogs(storedCatalogs);
        if (storedCatalogs.length > 0 && !formData.catalogId) {
          setFormData(prev => ({ ...prev, catalogId: storedCatalogs[0].id }));
        }
      }
    };
    loadCatalogsFromAPI();
    
    // Generate unique barcode if not provided
    if (!formData.barcode) {
      const generateBarcode = async () => {
        try {
          // Check database for existing artifacts to ensure uniqueness
          const artifacts = await fetchArtifacts();
          const newBarcode = generateBarcodeId('artifact', artifacts.length + 1);
          // Verify it's unique
          const existingBarcodes = artifacts.map(a => a.barcode);
          let uniqueBarcode = newBarcode;
          let attempts = 0;
          while (existingBarcodes.includes(uniqueBarcode) && attempts < 10) {
            uniqueBarcode = generateBarcodeId('artifact', artifacts.length + 1 + attempts);
            attempts++;
          }
          setFormData(prev => ({ ...prev, barcode: uniqueBarcode }));
        } catch (error) {
          // Fallback to local storage if API fails
          const artifacts = loadArtifacts();
          const newBarcode = generateBarcodeId('artifact', artifacts.length + 1);
          setFormData(prev => ({ ...prev, barcode: newBarcode }));
        }
      };
      generateBarcode();
    }
  }, [formData.barcode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processMediaFiles = async (files: File[]): Promise<{ images2D: string[], image3D?: string, video?: string }> => {
    const images2D: string[] = [];
    let image3D: string | undefined;
    let video: string | undefined;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const base64 = await convertFileToBase64(file);
        images2D.push(base64);
      } else if (file.type.startsWith('video/')) {
        const base64 = await convertFileToBase64(file);
        video = base64;
      } else if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        const base64 = await convertFileToBase64(file);
        image3D = base64;
      }
    }

    return { images2D, image3D, video };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check database for barcode uniqueness (primary source)
      let uniqueBarcode = formData.barcode;
      try {
        const artifacts = await fetchArtifacts();
        const existingBarcodes = artifacts.map(a => a.barcode);
        if (existingBarcodes.includes(uniqueBarcode)) {
          // Generate a new unique barcode
          uniqueBarcode = generateBarcodeId('artifact', artifacts.length + 1);
          // Keep regenerating until unique
          let attempts = 0;
          while (existingBarcodes.includes(uniqueBarcode) && attempts < 10) {
            uniqueBarcode = generateBarcodeId('artifact', artifacts.length + 1 + attempts);
            attempts++;
          }
        }
      } catch (apiError) {
        // Fallback to local storage check if API fails
        const artifacts = loadArtifacts();
        const existingBarcodes = artifacts.map(a => a.barcode);
        if (existingBarcodes.includes(uniqueBarcode)) {
          uniqueBarcode = generateBarcodeId('artifact', artifacts.length + 1);
          let attempts = 0;
          while (existingBarcodes.includes(uniqueBarcode) && attempts < 10) {
            uniqueBarcode = generateBarcodeId('artifact', artifacts.length + 1 + attempts);
            attempts++;
          }
        }
      }
      
      // Process uploaded media files
      const media = await processMediaFiles(mediaFiles);
      
      const artifactId = generateUniqueId();
      const newArtifact: Artifact = {
        id: artifactId,
        catalogId: formData.catalogId,
        name: formData.name,
        barcode: uniqueBarcode,
        details: formData.details,
        length: formData.length || null,
        heightDepth: formData.heightDepth || null,
        width: formData.width || null,
        locationFound: formData.locationFound,
        dateFound: formData.dateFound,
        comments: [],
        images2D: media.images2D,
        image3D: media.image3D,
        video: media.video,
        creationDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Persist to database API
      try {
        await createArtifact(newArtifact);
        console.log('✅ Artifact saved to database:', newArtifact.id);
      } catch (apiErr) {
        console.error('❌ Failed to save artifact to database:', apiErr);
        // With PostgreSQL, we should always use the API
        // Fallback to local storage only if absolutely necessary
        try {
          const localArtifacts = loadArtifacts();
          const updatedArtifacts = [...localArtifacts, newArtifact];
          saveArtifacts(updatedArtifacts);
          console.warn('⚠️  Saved to local storage as fallback');
        } catch (localErr) {
          console.error('❌ Failed to save to local storage:', localErr);
          throw new Error('Failed to save artifact. Please try again.');
        }
      }

      // Update catalog to include new artifact
      const updatedCatalogs = catalogs.map(catalog => {
        if (catalog.id === formData.catalogId) {
          return {
            ...catalog,
            artifacts: [...catalog.artifacts, newArtifact.id]
          };
        }
        return catalog;
      });
      saveCatalogs(updatedCatalogs);

      // Store created artifact and show QR code
      setCreatedArtifact(newArtifact);
      setShowQRCode(true);
      alert('Artifact added successfully! QR code generated.');
    } catch (error) {
      console.error('Error adding artifact:', error);
      alert('Error adding artifact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Add New Artifact</h1>
        <p className="text-blue-100">
          Create a comprehensive digital record with images and QR code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Form */}
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Artifact Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter artifact name"
                  />
                </div>
                
                <div>
                  <label className="label">Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="input-field font-mono"
                    placeholder="Auto-generated"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label">Catalog *</label>
                    <Link
                      to="/add-catalog"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Create New</span>
                    </Link>
                  </div>
                  <select
                    name="catalogId"
                    value={formData.catalogId}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a catalog</option>
                    {catalogs.map(catalog => (
                      <option key={catalog.id} value={catalog.id}>
                        {catalog.name}
                      </option>
                    ))}
                  </select>
                  {catalogs.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No catalogs available. <Link to="/add-catalog" className="text-blue-600 hover:underline">Create one</Link> or a default catalog will be created automatically.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Discovery Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Discovery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Location Found *</label>
                  <input
                    type="text"
                    name="locationFound"
                    value={formData.locationFound}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="e.g., Excavation Site Alpha, Grid 7B"
                  />
                </div>
                
                <div>
                  <label className="label">Date Found *</label>
                  <input
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div>
                <label className="label">Description *</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Describe the artifact, its condition, materials, significance, etc."
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
              <p className="text-sm text-gray-500 mb-4">
                Provide as freeform text including units (e.g., &quot;24 cm&quot;). Leave blank if unknown.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Length</label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 24 cm"
                  />
                </div>
                <div>
                  <label className="label">Height / Depth</label>
                  <input
                    type="text"
                    name="heightDepth"
                    value={formData.heightDepth}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 10 cm"
                  />
                </div>
                <div>
                  <label className="label">Width</label>
                  <input
                    type="text"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 8 cm"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Media Files</h2>
              <MediaUpload
                onFilesSelected={setMediaFiles}
                maxFiles={10}
              />
            </div>
          </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto btn-secondary min-w-[150px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto btn-primary min-w-[200px] flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <Save size={20} />
              <span>{isSubmitting ? 'Saving Artifact...' : 'Save Artifact'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* QR Code Modal - Auto-shown after artifact creation */}
      {showQRCode && createdArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Artifact QR Code</h3>
                <button
                  onClick={() => {
                    setShowQRCode(false);
                    navigate(`/artifact/${createdArtifact.id}`);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">QR Code for:</p>
                <p className="font-semibold text-gray-900">{createdArtifact.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">{createdArtifact.barcode}</p>
              </div>
              <QRCodeGenerator
                value={`${window.location.origin}/artifact/${createdArtifact.id}?barcode=${createdArtifact.barcode}`}
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setShowQRCode(false);
                    navigate(`/artifact/${createdArtifact.id}`);
                  }}
                  className="flex-1 btn-primary"
                >
                  View Artifact
                </button>
                <button
                  onClick={() => {
                    setShowQRCode(false);
                    setCreatedArtifact(null);
                    // Reset form and generate unique barcode
                    const artifacts = loadArtifacts();
                    const existingBarcodes = artifacts.map(a => a.barcode);
                    let newBarcode = generateBarcodeId('artifact', artifacts.length + 1);
                    // Ensure uniqueness
                    let attempts = 0;
                    while (existingBarcodes.includes(newBarcode) && attempts < 10) {
                      newBarcode = generateBarcodeId('artifact', artifacts.length + 1 + attempts);
                      attempts++;
                    }
                    setFormData({
                      name: '',
                      catalogId: catalogId || '',
                      details: '',
                      length: '',
                      heightDepth: '',
                      width: '',
                      locationFound: '',
                      dateFound: '',
                      barcode: newBarcode
                    });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Add Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddArtifactPage;
