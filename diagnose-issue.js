// Diagnostic script to check why artifacts aren't showing
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

async function diagnose() {
  console.log('🔍 Diagnosing Issue: No Artifacts Showing on Frontend\n');
  console.log('📍 API URL:', API_URL);
  console.log('');

  try {
    // 1. Check backend is accessible
    console.log('1. Checking backend accessibility...');
    const rootRes = await fetch(`${API_URL}/`);
    if (rootRes.ok) {
      const rootData = await rootRes.json();
      console.log('   ✅ Backend is accessible');
      console.log(`   Message: ${rootData.message}`);
    } else {
      console.log('   ❌ Backend is not accessible');
      return;
    }

    // 2. Check artifacts endpoint
    console.log('\n2. Checking artifacts endpoint...');
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (artifactsRes.ok) {
      const artifacts = await artifactsRes.json();
      console.log(`   ✅ Found ${artifacts.length} artifacts in database`);
      
      if (artifacts.length === 0) {
        console.log('   ⚠️  Database is empty!');
        console.log('   💡 Run seed script: npm run seed');
      } else {
        console.log('\n   📦 Artifacts:');
        artifacts.slice(0, 5).forEach((artifact, index) => {
          console.log(`      ${index + 1}. ${artifact.name} (${artifact.barcode})`);
        });
        if (artifacts.length > 5) {
          console.log(`      ... and ${artifacts.length - 5} more`);
        }
      }
    } else {
      console.log(`   ❌ Failed to fetch artifacts: ${artifactsRes.status}`);
    }

    // 3. Check catalogs
    console.log('\n3. Checking catalogs...');
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (catalogsRes.ok) {
      const catalogs = await catalogsRes.json();
      console.log(`   ✅ Found ${catalogs.length} catalogs`);
      catalogs.forEach((catalog, index) => {
        console.log(`      ${index + 1}. ${catalog.name} (${catalog.id})`);
      });
    }

    // 4. Check stats
    console.log('\n4. Checking stats...');
    const statsRes = await fetch(`${API_URL}/api/stats`);
    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log('   📊 Statistics:');
      console.log(`      Catalogs: ${stats.catalogCount || 0}`);
      console.log(`      Artifacts: ${stats.artifactCount || 0}`);
    }

    // 5. Test artifact creation
    console.log('\n5. Testing artifact creation...');
    const testArtifact = {
      id: 'test-' + Date.now(),
      catalogId: 'test-catalog-id',
      name: 'Test Artifact',
      barcode: 'TEST' + Date.now(),
      details: 'Test',
      locationFound: 'Test Site',
      dateFound: '2024-01-01',
      images2D: [],
      creationDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    // First check if catalog exists
    const catalogs = await fetch(`${API_URL}/api/catalogs`).then(r => r.json());
    if (catalogs.length > 0) {
      testArtifact.catalogId = catalogs[0].id;
      const createRes = await fetch(`${API_URL}/api/artifacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify(testArtifact),
      });
      
      if (createRes.ok) {
        console.log('   ✅ Artifact creation works!');
        // Delete test artifact
        await fetch(`${API_URL}/api/artifacts/${testArtifact.id}`, {
          method: 'DELETE',
          headers: { 'x-user-role': 'admin' },
        });
      } else {
        const error = await createRes.text();
        console.log(`   ❌ Artifact creation failed: ${createRes.status}`);
        console.log(`   Error: ${error}`);
      }
    } else {
      console.log('   ⚠️  No catalogs found - cannot test artifact creation');
    }

    // 6. Check frontend API URL
    console.log('\n6. Frontend API URL:');
    console.log('   Open: https://archaeology-frontend.onrender.com/artifacts');
    console.log('   Press F12 to open browser console');
    console.log('   Look for: "API URL configured: ${API_URL}"');
    console.log('   Check Network tab for API requests to: ${API_URL}/api/artifacts');

    // 7. Recommendations
    console.log('\n7. Recommendations:');
    if (artifacts.length === 0) {
      console.log('   ✅ Run seed script: npm run seed');
      console.log('   ✅ Verify seed script output shows "Successfully created: X artifacts"');
    } else {
      console.log('   ✅ Artifacts exist in backend');
      console.log('   ✅ Check frontend is using correct API URL');
      console.log('   ✅ Check browser console for errors');
      console.log('   ✅ Check Network tab for API requests');
    }

    console.log('\n✨ Diagnosis complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend is running at:', API_URL);
  }
}

diagnose();

