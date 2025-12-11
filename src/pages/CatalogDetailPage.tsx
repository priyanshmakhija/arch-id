import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, QrCode, Edit, Trash2 } from 'lucide-react';
import { Catalog, Artifact } from '../types';
import { loadCatalogs, loadArtifacts, saveCatalogs } from '../utils/storageUtils';
import { fetchCatalog, fetchArtifacts, deleteCatalog } from '../utils/api';
import { useAuth, hasRole } from '../context/AuthContext';
import QRCodeGenerator from '../components/QRCodeGenerator';

const CatalogDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const c = await fetchCatalog(id);
        if (cancelled) return;
        setCatalog(c);
        try {
          const all = await fetchArtifacts();
          if (cancelled) return;
          const filtered = all.filter(a => a.catalogId === id);
          setArtifacts(filtered);
        } catch {
          const all = loadArtifacts();
          const filtered = all.filter(a => a.catalogId === id);
          setArtifacts(filtered);
        }
      } catch {
        const catalogs = loadCatalogs();
        const foundCatalog = catalogs.find(c => c.id === id) || null;
        setCatalog(foundCatalog);
        const allArtifacts = loadArtifacts();
        const filtered = allArtifacts.filter(a => a.catalogId === id);
        setArtifacts(filtered);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Catalog not found</h2>
        <p className="mt-2 text-gray-600">The catalog you're looking for doesn't exist.</p>
        <Link
          to="/catalogs"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Catalogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/catalogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Catalogs
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/edit-catalog/${catalog.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={async () => {
              if (!window.confirm(`Are you sure you want to delete "${catalog.name}"? This cannot be undone.`)) return;
              setIsDeleting(true);
              try {
                try {
                  await deleteCatalog(catalog.id);
                } catch {
                  const catalogs = loadCatalogs();
                  const updated = catalogs.filter(c => c.id !== catalog.id);
                  saveCatalogs(updated);
                }
                alert('Catalog deleted successfully!');
                navigate('/catalogs');
              } catch (error) {
                console.error('Error deleting catalog:', error);
                alert('Error deleting catalog. Please try again.');
              } finally {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          {hasRole(user?.role, ['admin', 'archaeologist']) && (
            <Link
              to={`/add-artifact?catalogId=${catalog.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Artifact
            </Link>
          )}
        </div>
      </div>

      {/* Catalog Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{catalog.name}</h1>
            <p className="mt-2 text-gray-600">{catalog.description}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {new Date(catalog.creationDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <QrCode className="h-4 w-4 mr-1" />
                {artifacts.length} artifacts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Artifacts</h2>
        {artifacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">No artifacts yet</h3>
            <p className="mt-2 text-gray-600">
              {hasRole(user?.role, ['admin', 'archaeologist'])
                ? 'Start adding artifacts to this catalog.'
                : 'Artifacts added by archaeologists and administrators will appear here.'}
            </p>
            {hasRole(user?.role, ['admin', 'archaeologist']) && (
              <Link
                to={`/add-artifact?catalogId=${catalog.id}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Artifact
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((artifact) => {
              const artifactUrl = `${window.location.origin}/artifact/${artifact.id}?barcode=${artifact.barcode}`;
              return (
                <div
                  key={artifact.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        to={`/artifact/${artifact.id}`}
                        className="flex-1 hover:text-blue-600 transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {artifact.name}
                        </h3>
                      </Link>
                      <div className="ml-4 flex-shrink-0">
                        <QRCodeGenerator
                          value={artifactUrl}
                          size={80}
                          showText={false}
                          className="border border-gray-200 rounded p-1 bg-white"
                        />
                      </div>
                    </div>
                    <Link
                      to={`/artifact/${artifact.id}`}
                      className="block"
                    >
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {artifact.details}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artifact.locationFound}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Found: {artifact.dateFound}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 font-mono">
                        <QrCode className="h-3 w-3 mr-1" />
                        {artifact.barcode}
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogDetailPage;
