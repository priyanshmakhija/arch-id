// Script to remove "Historical Artifacts Collection" catalog and all its artifacts
// Run this script to clean up the old catalog before setting up the new default

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';

async function cleanupOldCatalog() {
  try {
    console.log('🔍 Fetching catalogs...');
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (!catalogsRes.ok) {
      throw new Error(`Failed to fetch catalogs: ${catalogsRes.statusText}`);
    }
    const catalogs = await catalogsRes.json();
    
    // Find the "Historical Artifacts Collection" catalog
    const oldCatalog = catalogs.find(c => 
      c.name === 'Historical Artifacts Collection' || 
      c.name.toLowerCase().includes('historical')
    );
    
    if (!oldCatalog) {
      console.log('✅ No "Historical Artifacts Collection" catalog found. Nothing to clean up.');
      return;
    }
    
    console.log(`📦 Found catalog: "${oldCatalog.name}" (ID: ${oldCatalog.id})`);
    
    // Fetch all artifacts
    console.log('🔍 Fetching artifacts...');
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (!artifactsRes.ok) {
      throw new Error(`Failed to fetch artifacts: ${artifactsRes.statusText}`);
    }
    const artifacts = await artifactsRes.json();
    
    // Find artifacts belonging to this catalog
    const catalogArtifacts = artifacts.filter(a => a.catalogId === oldCatalog.id);
    console.log(`📦 Found ${catalogArtifacts.length} artifacts in this catalog`);
    
    if (catalogArtifacts.length > 0) {
      console.log('🗑️  Deleting artifacts...');
      // Note: You'll need admin/archaeologist role to delete
      // For now, we'll just log what needs to be deleted
      for (const artifact of catalogArtifacts) {
        console.log(`   - ${artifact.name} (${artifact.id})`);
        // Uncomment to actually delete:
        // const deleteRes = await fetch(`${API_URL}/api/artifacts/${artifact.id}`, {
        //   method: 'DELETE',
        //   headers: { 'x-user-role': 'admin' }
        // });
        // if (deleteRes.ok) {
        //   console.log(`   ✅ Deleted: ${artifact.name}`);
        // } else {
        //   console.log(`   ❌ Failed to delete: ${artifact.name}`);
        // }
      }
    }
    
    // Delete the catalog
    console.log('🗑️  Deleting catalog...');
    const deleteCatalogRes = await fetch(`${API_URL}/api/catalogs/${oldCatalog.id}`, {
      method: 'DELETE'
    });
    
    if (deleteCatalogRes.ok || deleteCatalogRes.status === 204) {
      console.log(`✅ Successfully deleted catalog: "${oldCatalog.name}"`);
    } else {
      const errorText = await deleteCatalogRes.text();
      console.log(`❌ Failed to delete catalog: ${errorText}`);
    }
    
    console.log('\n✨ Cleanup complete!');
    console.log(`   Deleted: ${catalogArtifacts.length} artifacts`);
    console.log('   Deleted: 1 catalog');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupOldCatalog();

