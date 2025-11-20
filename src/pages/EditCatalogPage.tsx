import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchCatalog, updateCatalog } from '../utils/api';
import { loadCatalogs, saveCatalogs } from '../utils/storageUtils';

const EditCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const catalog = await fetchCatalog(id);
        if (!cancelled) {
          setName(catalog.name);
          setDescription(catalog.description);
        }
      } catch {
        const catalogs = loadCatalogs();
        const catalog = catalogs.find(c => c.id === id);
        if (!cancelled && catalog) {
          setName(catalog.name);
          setDescription(catalog.description);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !id) return;
    setIsSubmitting(true);
    try {
      try {
        await updateCatalog(id, {
          name: name.trim(),
          description: description.trim(),
          lastModified: new Date().toISOString(),
        });
      } catch {
        const catalogs = loadCatalogs();
        const updated = catalogs.map(c => 
          c.id === id 
            ? { ...c, name: name.trim(), description: description.trim(), lastModified: new Date().toISOString() }
            : c
        );
        saveCatalogs(updated);
      }
      alert('Catalog updated successfully!');
      navigate(`/catalog/${id}`);
    } catch (error) {
      console.error('Error updating catalog:', error);
      alert('Error updating catalog. Please try again.');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Edit Catalog</h1>
          <p className="text-gray-600 mt-1">Update catalog details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Catalog Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input 
                className="input-field" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea 
                className="input-field" 
                rows={4} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>
        </div>
        <div className="card">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCatalogPage;

