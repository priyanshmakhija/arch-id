import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Catalog } from '../types';
import { loadCatalogs } from '../utils/storageUtils';
import { fetchCatalogs } from '../utils/api';

const CatalogsPage: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apiCatalogs = await fetchCatalogs();
        if (!cancelled) setCatalogs(apiCatalogs);
      } catch (_err) {
        const storedCatalogs = loadCatalogs();
        if (!cancelled) setCatalogs(storedCatalogs);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogs</h1>
          <p className="mt-2 text-gray-600">
            Browse and manage your archaeological catalogs
          </p>
        </div>
        <Link
          to="/add-catalog"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Catalog
        </Link>
      </div>

      {/* Catalogs Grid */}
      {catalogs.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No catalogs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first catalog.
          </p>
          <div className="mt-6">
            <Link
              to="/add-catalog"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {catalog.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {catalog.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {new Date(catalog.creationDate).toLocaleDateString()}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {catalog.artifacts.length} artifacts
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex justify-end">
                  <Link
                    to={`/catalog/${catalog.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogsPage;
