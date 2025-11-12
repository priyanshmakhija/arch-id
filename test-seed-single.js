// Test script to create a single artifact and see the exact error
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

async function testSingleArtifact() {
  console.log('🧪 Testing single artifact creation...\n');
  console.log('📍 API URL:', API_URL);
  console.log('');

  // First, get or create a catalog
  let catalogId;
  try {
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (catalogsRes.ok) {
      const catalogs = await catalogsRes.json();
      if (catalogs.length > 0) {
        catalogId = catalogs[0].id;
        console.log(`✅ Using existing catalog: ${catalogs[0].name} (${catalogId})`);
      } else {
        // Create a default catalog
        const now = new Date().toISOString();
        const newCatalog = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          name: 'Historical Artifacts Collection',
          description: 'A collection of archaeological artifacts from human history',
          creationDate: now,
          lastModified: now,
        };
        const createCatalogRes = await fetch(`${API_URL}/api/catalogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCatalog),
        });
        if (createCatalogRes.ok) {
          catalogId = newCatalog.id;
          console.log(`✅ Created new catalog: ${newCatalog.name} (${catalogId})`);
        } else {
          const error = await createCatalogRes.text();
          console.error(`❌ Failed to create catalog: ${error}`);
          process.exit(1);
        }
      }
    } else {
      const error = await catalogsRes.text();
      console.error(`❌ Failed to fetch catalogs: ${error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error setting up catalog:', error.message);
    process.exit(1);
  }

  // Create a test artifact
  const now = new Date().toISOString();
  const testArtifact = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    catalogId: catalogId,
    name: 'Test Artifact',
    barcode: 'TEST' + Date.now(),
    details: 'This is a test artifact',
    length: '10 cm',
    heightDepth: '5 cm',
    width: '3 cm',
    locationFound: 'Test Site',
    dateFound: '2024-01-01',
    images2D: [],
    creationDate: now,
    lastModified: now,
  };

  console.log('\n📦 Creating test artifact...');
  console.log('Artifact data:', JSON.stringify(testArtifact, null, 2));
  console.log('');

  try {
    const res = await fetch(`${API_URL}/api/artifacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
      },
      body: JSON.stringify(testArtifact),
    });

    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log(`Response headers:`, Object.fromEntries(res.headers.entries()));

    // Read response body only once
    const responseText = await res.text();
    
    if (res.ok) {
      try {
        const created = JSON.parse(responseText);
        console.log('\n✅ Artifact created successfully!');
        console.log('Created artifact:', JSON.stringify(created, null, 2));
      } catch (e) {
        console.log('\n✅ Artifact created successfully!');
        console.log('Response:', responseText);
      }
    } else {
      console.log('\n❌ Failed to create artifact');
      console.log(`Status: ${res.status} ${res.statusText}`);
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error response:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Error response (text):', responseText);
      }
    }
  } catch (error) {
    console.error('\n❌ Network error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

testSingleArtifact();

