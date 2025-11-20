import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, QrCode, MapPin, Calendar, Filter } from 'lucide-react';
import { Artifact, Catalog } from '../types';
import { loadArtifacts, loadCatalogs } from '../utils/storageUtils';
import { fetchArtifacts, fetchCatalogs } from '../utils/api';
import QRCodeScanner from '../components/QRCodeScanner';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [arts, cats] = await Promise.all([
          fetchArtifacts().catch(() => loadArtifacts()),
          fetchCatalogs().catch(() => loadCatalogs())
        ]);
        if (cancelled) return;
        setArtifacts(arts);
        setCatalogs(cats);
        setFilteredArtifacts(arts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let filtered = artifacts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artifact =>
        artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.locationFound.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by catalog
    if (selectedCatalog) {
      filtered = filtered.filter(artifact => artifact.catalogId === selectedCatalog);
    }

    setFilteredArtifacts(filtered);
  }, [searchTerm, selectedCatalog, artifacts]);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      // Parse the QR code content
      // QR codes contain URLs like: /artifact/{id}?barcode={barcode}
      // Or just the barcode itself
      
      let artifactId: string | null = null;
      let barcode: string | null = null;

      // Try to parse as URL (absolute or relative)
      let url: URL | null = null;
      try {
        // Try as absolute URL first
        url = new URL(decodedText);
      } catch {
        // If that fails, try as relative URL by prepending current origin
        try {
          url = new URL(decodedText, window.location.origin);
        } catch {
          // Not a URL at all
        }
      }

      if (url) {
        // Extract artifact ID from path
        const pathParts = url.pathname.split('/').filter(p => p);
        const artifactIndex = pathParts.indexOf('artifact');
        if (artifactIndex !== -1 && pathParts[artifactIndex + 1]) {
          artifactId = pathParts[artifactIndex + 1];
        }
        // Extract barcode from query params
        barcode = url.searchParams.get('barcode');
      } else {
        // Not a URL, try to match as relative path or barcode
        const artifactMatch = decodedText.match(/\/artifact\/([^?\/]+)/);
        if (artifactMatch) {
          artifactId = artifactMatch[1];
          // Also check for barcode in query string
          const barcodeMatch = decodedText.match(/[?&]barcode=([^&]+)/);
          if (barcodeMatch) {
            barcode = barcodeMatch[1];
          }
        } else {
          // Check if it's just a barcode
          if (decodedText.length > 0) {
            // Check if decodedText matches a barcode pattern
            const foundArtifact = artifacts.find(a => a.barcode === decodedText);
            if (foundArtifact) {
              artifactId = foundArtifact.id;
            } else {
              barcode = decodedText;
            }
          }
        }
      }

      // If we have an artifact ID, navigate directly
      if (artifactId && artifactId !== 'preview-') {
        // Remove 'preview-' prefix if present
        const cleanId = artifactId.replace(/^preview-/, '');
        navigate(`/artifact/${cleanId}`);
        setShowScanner(false);
        return;
      }

      // If we have a barcode, find the artifact
      if (barcode) {
        const foundArtifact = artifacts.find(a => a.barcode === barcode);
        if (foundArtifact) {
          navigate(`/artifact/${foundArtifact.id}`);
          setShowScanner(false);
          return;
        }
      }

      // If we couldn't find the artifact, try searching in all artifacts
      if (barcode || artifactId) {
        try {
          const allArtifacts = await fetchArtifacts();
          const found = allArtifacts.find(
            a => a.id === artifactId || a.barcode === barcode || a.barcode === decodedText
          );
          if (found) {
            navigate(`/artifact/${found.id}`);
            setShowScanner(false);
            return;
          }
        } catch {
          // Fallback to local storage
          const localArtifacts = loadArtifacts();
          const found = localArtifacts.find(
            a => a.id === artifactId || a.barcode === barcode || a.barcode === decodedText
          );
          if (found) {
            navigate(`/artifact/${found.id}`);
            setShowScanner(false);
            return;
          }
        }
      }

      // If we still couldn't find it, show an error
      alert(`Artifact not found for scanned code: ${decodedText}`);
      setShowScanner(false);
    } catch (error) {
      console.error('Error processing scanned QR code:', error);
      alert('Error processing scanned QR code. Please try again.');
      setShowScanner(false);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Artifacts</h1>
        <p className="mt-2 text-gray-600">
          Find artifacts by name, details, location, or barcode
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search artifacts..."
              />
            </div>
          </div>

          {/* Catalog Filter */}
          <div>
            <label htmlFor="catalog" className="block text-sm font-medium text-gray-700">
              Filter by Catalog
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="catalog"
                value={selectedCatalog}
                onChange={(e) => setSelectedCatalog(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Catalogs</option>
                {catalogs.map((catalog) => (
                  <option key={catalog.id} value={catalog.id}>
                    {catalog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* QR Code Scanner Button */}
        <div className="mt-4">
          <button
            onClick={() => setShowScanner(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR Code
          </button>
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      {showScanner && (
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Results ({filteredArtifacts.length})
          </h2>
        </div>

        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No artifacts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArtifacts.map((artifact) => {
              const catalog = catalogs.find(c => c.id === artifact.catalogId);
              return (
                <Link
                  key={artifact.id}
                  to={`/artifact/${artifact.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {artifact.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <QrCode className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 font-mono">
                          {artifact.barcode}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {artifact.details}
                    </p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artifact.locationFound}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Found: {artifact.dateFound}
                      </div>
                      {catalog && (
                        <div className="text-sm text-blue-600">
                          {catalog.name}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
