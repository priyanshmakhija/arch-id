import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, QrCode } from 'lucide-react';
import { Artifact, Catalog } from '../types';
import { loadCatalogs, loadArtifacts, saveArtifacts } from '../utils/storageUtils';
import { fetchArtifact, fetchCatalogs, updateArtifact } from '../utils/api';
import MediaUpload from '../components/MediaUpload';
import QRCodeGenerator from '../components/QRCodeGenerator';

const EditArtifactPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    catalogId: '',
    subCatalogId: '',
    details: '',
    length: '',
    heightDepth: '',
    width: '',
    locationFound: '',
    dateFound: '',
    barcode: ''
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingImages2D, setExistingImages2D] = useState<string[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [artifact, apiCatalogs] = await Promise.all([
          fetchArtifact(id).catch(() => {
            const artifacts = loadArtifacts();
            return artifacts.find(a => a.id === id) || null;
          }),
          fetchCatalogs().catch(() => loadCatalogs())
        ]);
        if (cancelled || !artifact) return;
        setCatalogs(apiCatalogs);
        setExistingImages2D(artifact.images2D || []);
        setFormData({
          name: artifact.name,
          catalogId: artifact.catalogId,
          subCatalogId: artifact.subCatalogId || '',
          details: artifact.details,
          length: artifact.length || '',
          heightDepth: artifact.heightDepth || '',
          width: artifact.width || '',
          locationFound: artifact.locationFound,
          dateFound: artifact.dateFound,
          barcode: artifact.barcode
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

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
    if (!id) return;
    setIsSubmitting(true);
    try {
      // Process uploaded media files
      const media = await processMediaFiles(mediaFiles);
      
      // Merge existing images with new ones, or use existing if no new files uploaded
      const finalImages2D = media.images2D.length > 0 
        ? [...existingImages2D, ...media.images2D]
        : existingImages2D;
      
      const updateData = {
        catalogId: formData.catalogId,
        subCatalogId: formData.subCatalogId || undefined,
        name: formData.name,
        barcode: formData.barcode,
        details: formData.details,
        length: formData.length || undefined,
        heightDepth: formData.heightDepth || undefined,
        width: formData.width || undefined,
        locationFound: formData.locationFound,
        dateFound: formData.dateFound,
        images2D: finalImages2D.length > 0 ? finalImages2D : [],
        image3D: media.image3D,
        video: media.video,
        lastModified: new Date().toISOString()
      };
      try {
        await updateArtifact(id, updateData);
      } catch {
        const artifacts = loadArtifacts();
        const updated = artifacts.map(a => 
          a.id === id 
            ? { ...a, ...updateData, lastModified: updateData.lastModified }
            : a
        );
        saveArtifacts(updated);
      }
      alert('Artifact updated successfully!');
      navigate(`/artifact/${id}`);
    } catch (error) {
      console.error('Error updating artifact:', error);
      alert('Error updating artifact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedCatalog = catalogs.find(c => c.id === formData.catalogId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Edit Artifact</h1>
          <p className="text-gray-600 mt-1">Update artifact information</p>
        </div>
        <button
          onClick={() => setShowQRCode(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <QrCode size={16} />
          <span>Preview QR</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                  />
                </div>
                <div>
                  <label className="label">Catalog *</label>
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
                </div>
                <div>
                  <label className="label">Sub-catalog (Optional)</label>
                  <select
                    name="subCatalogId"
                    value={formData.subCatalogId}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">No sub-catalog</option>
                    {selectedCatalog?.subCatalogs?.map(subId => (
                      <option key={subId} value={subId}>
                        Sub-catalog {subId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

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
                />
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
              <p className="text-sm text-gray-500 mb-4">
                Provide measurements with units (e.g., &quot;24 cm&quot;). Leave blank if unknown.
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
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Media Files</h2>
              <MediaUpload
                onFilesSelected={setMediaFiles}
                maxFiles={10}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-gray-900">{formData.name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Barcode:</label>
                  <p className="font-mono text-gray-900">{formData.barcode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Catalog:</label>
                  <p className="text-gray-900">{selectedCatalog?.name || 'Not selected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-gray-900">{formData.locationFound || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Dimensions:</label>
                  <p className="text-gray-900">
                    {formData.length || formData.heightDepth || formData.width
                      ? [
                          formData.length ? `L: ${formData.length}` : null,
                          formData.heightDepth ? `H/D: ${formData.heightDepth}` : null,
                          formData.width ? `W: ${formData.width}` : null,
                        ]
                          .filter(Boolean)
                          .join(' • ')
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showQRCode && formData.barcode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">QR Code Preview</h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <QRCodeGenerator
                value={`${window.location.origin}/artifact/preview-${formData.barcode}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditArtifactPage;

