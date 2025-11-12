import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Image as ImageIcon, QrCode } from 'lucide-react';
import { Artifact } from '../types';
import { fetchArtifacts, createArtifact } from '../utils/api';
import { loadArtifacts } from '../utils/storageUtils';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { useAuth, hasRole } from '../context/AuthContext';

const AllArtifactsPage: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canManageArtifacts = hasRole(user?.role, ['admin', 'archaeologist']);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apiArtifacts = await fetchArtifacts();
        if (!cancelled) {
          // If API returns empty but localStorage has data, use localStorage and migrate
          if (apiArtifacts.length === 0) {
            const storedArtifacts = loadArtifacts();
            if (storedArtifacts.length > 0) {
              // Show localStorage artifacts immediately
              setArtifacts(storedArtifacts);
              // Migrate localStorage artifacts to API in the background
              for (const artifact of storedArtifacts) {
                try {
                  await createArtifact(artifact);
                } catch {
                  // Ignore errors during migration - API might not be ready
                }
              }
            } else {
              setArtifacts(apiArtifacts);
            }
          } else {
            setArtifacts(apiArtifacts);
          }
        }
      } catch {
        const storedArtifacts = loadArtifacts();
        if (!cancelled) setArtifacts(storedArtifacts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Artifacts</h1>
        <p className="mt-2 text-gray-600">
          View all artifacts in the catalog ({artifacts.length} total)
        </p>
      </div>

      {/* Artifacts Grid */}
      {artifacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No artifacts found</h3>
          <p className="mt-2 text-gray-600">
            {canManageArtifacts
              ? 'Start by adding your first artifact.'
              : 'Artifacts added by archaeologists and administrators will appear here.'}
          </p>
          {canManageArtifacts && (
            <Link
              to="/add-artifact"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add First Artifact
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                {artifact.images2D && artifact.images2D.length > 0 ? (
                  <img
                    src={artifact.images2D[0]}
                    alt={artifact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${artifact.images2D && artifact.images2D.length > 0 ? 'hidden' : ''} flex flex-col items-center justify-center text-gray-400`}>
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm">No Image</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link
                      to={`/artifact/${artifact.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {artifact.name}
                    </Link>
                    <p className="text-xs font-mono text-gray-500 mt-1">{artifact.id}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {artifact.details}
                </p>

                {/* QR Code Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <QrCode className="h-4 w-4 mr-2" />
                      <span>QR Code</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <QRCodeGenerator
                      value={`${window.location.origin}/artifact/${artifact.id}?barcode=${artifact.barcode}`}
                      size={120}
                      showText={false}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2 font-mono break-all">
                    {artifact.barcode}
                  </p>
                </div>

                {/* Link to Detail */}
                <Link
                  to={`/artifact/${artifact.id}`}
                  className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllArtifactsPage;

