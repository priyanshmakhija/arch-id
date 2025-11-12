import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, QrCode, MapPin, Calendar, MessageSquare, Trash2, Ruler, ShieldAlert } from 'lucide-react';
import { Artifact, Catalog } from '../types';
import { loadArtifacts, loadCatalogs, saveArtifacts } from '../utils/storageUtils';
import { fetchArtifact, fetchArtifacts, deleteArtifact } from '../utils/api';
import { useAuth, hasRole } from '../context/AuthContext';

const ArtifactDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const canModifyArtifact = hasRole(user?.role, ['admin', 'archaeologist']);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        // Try to fetch by ID first
        const apiArtifact = await fetchArtifact(id);
        if (cancelled) return;
        setArtifact(apiArtifact);
        const catalogs = loadCatalogs();
        const foundCatalog = catalogs.find(c => c.id === apiArtifact.catalogId);
        setCatalog(foundCatalog || null);
      } catch (_err) {
        // If not found by ID, try to find by barcode (for QR code support)
        try {
          const artifacts = await fetchArtifacts();
          let foundArtifact = artifacts.find(a => a.id === id) || null;
          
          // If not found by ID, try by barcode
          if (!foundArtifact) {
            foundArtifact = artifacts.find(a => a.barcode === id) || null;
          }
          
          if (!foundArtifact) {
            const localArtifacts = loadArtifacts();
            foundArtifact = localArtifacts.find(a => a.id === id || a.barcode === id) || null;
          }
          
          if (cancelled) return;
          setArtifact(foundArtifact);
          if (foundArtifact) {
            const catalogs = loadCatalogs();
            const foundCatalog = catalogs.find(c => c.id === foundArtifact?.catalogId) || null;
            setCatalog(foundCatalog);
          }
        } catch {
          const artifacts = loadArtifacts();
          const foundArtifact = artifacts.find(a => a.id === id || a.barcode === id) || null;
          if (cancelled) return;
          setArtifact(foundArtifact);
          if (foundArtifact) {
            const catalogs = loadCatalogs();
            const foundCatalog = catalogs.find(c => c.id === foundArtifact.catalogId) || null;
            setCatalog(foundCatalog);
          }
        }
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

  if (!artifact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Artifact not found</h2>
        <p className="mt-2 text-gray-600">The artifact you're looking for doesn't exist.</p>
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
            to={catalog ? `/catalog/${catalog.id}` : '/catalogs'}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {catalog ? catalog.name : 'Catalogs'}
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {canModifyArtifact ? (
            <>
              <Link
                to={`/edit-artifact/${artifact.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={async () => {
                  if (!window.confirm(`Are you sure you want to delete "${artifact.name}"? This cannot be undone.`)) return;
                  setIsDeleting(true);
                  try {
                    try {
                      await deleteArtifact(artifact.id);
                    } catch {
                      const artifacts = loadArtifacts();
                      const updated = artifacts.filter(a => a.id !== artifact.id);
                      saveArtifacts(updated);
                    }
                    alert('Artifact deleted successfully!');
                    navigate(catalog ? `/catalog/${catalog.id}` : '/catalogs');
                  } catch (error) {
                    console.error('Error deleting artifact:', error);
                    alert('Error deleting artifact. Please try again.');
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
            </>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
              <ShieldAlert className="h-4 w-4 text-gray-400" />
              <span>Only archaeologists or admins can modify artifacts.</span>
            </div>
          )}
        </div>
      </div>

      {/* Artifact Info */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{artifact.name}</h1>
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500 font-mono">{artifact.barcode}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
                <p className="text-gray-600">{artifact.details}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location Found</p>
                    <p className="text-sm text-gray-600">{artifact.locationFound}</p>
                  </div>
                </div>

                {(artifact.length || artifact.heightDepth || artifact.width) && (
                  <div className="flex items-start">
                    <Ruler className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dimensions</p>
                      <p className="text-sm text-gray-600">
                        {[
                          artifact.length ? `Length: ${artifact.length}` : null,
                          artifact.heightDepth ? `Height/Depth: ${artifact.heightDepth}` : null,
                          artifact.width ? `Width: ${artifact.width}` : null,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date Found</p>
                    <p className="text-sm text-gray-600">{artifact.dateFound}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cataloged</p>
                    <p className="text-sm text-gray-600">
                      {new Date(artifact.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Media</h3>
                {(!artifact.images2D || artifact.images2D.length === 0) && !artifact.image3D && !artifact.video ? (
                  <p className="text-gray-500 italic">No media files uploaded</p>
                ) : (
                  <div className="space-y-4">
                    {artifact.images2D && artifact.images2D.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">2D Images ({artifact.images2D.length})</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {artifact.images2D.map((image, index) => (
                            <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                              <img
                                src={image}
                                alt={`${artifact.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const placeholder = e.currentTarget.parentElement?.querySelector('.error-placeholder');
                                  if (placeholder) {
                                    (placeholder as HTMLElement).classList.remove('hidden');
                                  }
                                }}
                              />
                              <div className="hidden error-placeholder absolute inset-0 flex items-center justify-center text-gray-400">
                                <p className="text-sm">Image {index + 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {artifact.image3D && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">3D Model</p>
                        <div className="bg-gray-100 rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-500">3D Model File Available</p>
                          <p className="text-xs text-gray-400 mt-1">Download to view</p>
                        </div>
                      </div>
                    )}
                    
                    {artifact.video && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Video</p>
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                          <video
                            src={artifact.video}
                            controls
                            className="w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const placeholder = e.currentTarget.parentElement?.querySelector('.video-error');
                              if (placeholder) {
                                (placeholder as HTMLElement).classList.remove('hidden');
                              }
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                          <div className="hidden video-error p-4 text-center">
                            <p className="text-sm text-gray-500">Video File</p>
                            <p className="text-xs text-gray-400 mt-1">Unable to display video</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Comments</h3>
          </div>
        </div>
        <div className="px-6 py-6">
          {!artifact.comments || artifact.comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {artifact.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetailPage;
