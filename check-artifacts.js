// Check if artifacts exist in the database
const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';

let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  if (typeof globalThis.fetch === 'undefined') {
    console.error('❌ Error: fetch is not available. Please install node-fetch: npm install node-fetch@2');
    process.exit(1);
  }
  fetch = globalThis.fetch;
}

async function checkArtifacts() {
  console.log('🔍 Checking artifacts in database...\n');
  console.log('📍 API URL:', API_URL);
  console.log('');

  try {
    // Check artifacts
    console.log('1. Checking artifacts...');
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (!artifactsRes.ok) {
      throw new Error(`Failed to fetch artifacts: ${artifactsRes.status}`);
    }
    const artifacts = await artifactsRes.json();
    console.log(`   ✅ Found ${artifacts.length} artifacts`);
    
    if (artifacts.length === 0) {
      console.log('   ⚠️  No artifacts found in database!');
      console.log('   💡 Run the seed script to create artifacts: npm run seed');
    } else {
      console.log('\n📦 Artifacts:');
      artifacts.forEach((artifact, index) => {
        console.log(`   ${index + 1}. ${artifact.name} (${artifact.barcode})`);
      });
    }
    
    // Check catalogs
    console.log('\n2. Checking catalogs...');
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (catalogsRes.ok) {
      const catalogs = await catalogsRes.json();
      console.log(`   ✅ Found ${catalogs.length} catalogs`);
      catalogs.forEach((catalog, index) => {
        console.log(`   ${index + 1}. ${catalog.name} (${catalog.id})`);
      });
    }
    
    // Check stats
    console.log('\n3. Checking stats...');
    const statsRes = await fetch(`${API_URL}/api/stats`);
    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log('   📊 Statistics:');
      console.log(`      Catalogs: ${stats.catalogCount || 0}`);
      console.log(`      Artifacts: ${stats.artifactCount || 0}`);
    }
    
    // Test frontend API URL
    console.log('\n4. Frontend should connect to:');
    console.log(`   ${API_URL}`);
    console.log('\n5. Check frontend browser console:');
    console.log('   Open: https://archaeology-frontend.onrender.com/artifacts');
    console.log('   Press F12 to open browser console');
    console.log('   Look for: "API URL configured: ${API_URL}"');
    console.log('   Check Network tab for API requests');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend is running at:', API_URL);
  }
}

checkArtifacts();

