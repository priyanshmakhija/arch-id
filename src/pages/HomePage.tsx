import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, List } from 'lucide-react';
import { fetchStats } from '../utils/api';
import { loadCatalogs, loadArtifacts } from '../utils/storageUtils';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({ totalCatalogs: 0, totalArtifacts: 0, recentAdditions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apiStats = await fetchStats();
        if (!cancelled) setStats(apiStats);
      } catch {
        const catalogs = loadCatalogs();
        const artifacts = loadArtifacts();
        const recent = artifacts.filter(a => {
          const created = new Date(a.creationDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return created > weekAgo;
        }).length;
        if (!cancelled) {
          setStats({
            totalCatalogs: catalogs.length,
            totalArtifacts: artifacts.length,
            recentAdditions: recent,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const features = [
    {
      icon: List,
      title: 'All Artifacts',
      description: 'View all artifacts with artifact ID, name, details, images, and QR codes',
      link: '/artifacts',
      color: 'bg-blue-500'
    },
    {
      icon: Search,
      title: 'Search Artifacts',
      description: 'Find specific artifacts using advanced search filters',
      link: '/search',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          ARCH-ID
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 md:text-xl">
          Smart QR-Based Archaeological Artifact Digitization &amp; Cataloging
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-base text-blue-50 md:text-lg">
          Transform archaeological documentation with intelligent QR code tagging, comprehensive digital cataloging, and seamless mobile access.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 ${feature.color} p-4 rounded-2xl shadow-md`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                <span>Explore</span>
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Catalog Statistics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {loading ? '...' : stats.totalArtifacts}
            </div>
            <div className="text-sm font-medium text-gray-600">Total Artifacts</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {loading ? '...' : stats.recentAdditions}
            </div>
            <div className="text-sm font-medium text-gray-600">Added This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
