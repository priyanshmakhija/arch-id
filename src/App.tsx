import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CatalogsPage from './pages/CatalogsPage';
import CatalogDetailPage from './pages/CatalogDetailPage';
import ArtifactDetailPage from './pages/ArtifactDetailPage';
import SearchPage from './pages/SearchPage';
import AddArtifactPage from './pages/AddArtifactPage';
import AddCatalogPage from './pages/AddCatalogPage';
import EditCatalogPage from './pages/EditCatalogPage';
import EditArtifactPage from './pages/EditArtifactPage';
import AllArtifactsPage from './pages/AllArtifactsPage';
import LoginPage from './pages/LoginPage';
import RequireRole from './components/RequireRole';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogs" element={<CatalogsPage />} />
            <Route path="/catalog/:id" element={<CatalogDetailPage />} />
            <Route path="/artifacts" element={<AllArtifactsPage />} />
            <Route path="/artifact/:id" element={<ArtifactDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/add-artifact"
              element={
                <RequireRole allowedRoles={['admin', 'archaeologist']}>
                  <AddArtifactPage />
                </RequireRole>
              }
            />
            <Route path="/add-catalog" element={<AddCatalogPage />} />
            <Route path="/edit-catalog/:id" element={<EditCatalogPage />} />
            <Route
              path="/edit-artifact/:id"
              element={
                <RequireRole allowedRoles={['admin', 'archaeologist']}>
                  <EditArtifactPage />
                </RequireRole>
              }
            />
            <Route
              path="/subcatalog/:id"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Sub-catalog - Coming Soon</h2>
                </div>
              }
            />
            <Route
              path="/add-subcatalog"
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Add Sub-catalog - Coming Soon</h2>
                </div>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;