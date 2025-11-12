import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Catalog } from '../types';
import { createCatalog } from '../utils/api';
import { saveCatalogs, loadCatalogs } from '../utils/storageUtils';
import { generateUniqueId } from '../utils/barcodeUtils';

const AddCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    const now = new Date().toISOString();
    const catalog: Catalog = {
      id: generateUniqueId(),
      name: name.trim(),
      description: description.trim(),
      artifacts: [],
      creationDate: now,
      lastModified: now,
    };
    try {
      try {
        await createCatalog(catalog);
      } catch {
        const existing = loadCatalogs();
        saveCatalogs([...existing, catalog]);
      }
      alert('Catalog created');
      navigate('/catalogs');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Add Catalog</h1>
          <p className="text-gray-600 mt-1">Create a new catalog</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Catalog Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input-field" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="card">
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center space-x-2">
            <Save size={16} />
            <span>{isSubmitting ? 'Saving...' : 'Save Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCatalogPage;


