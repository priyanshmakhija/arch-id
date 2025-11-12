// Quick script to verify artifacts were created in the database
const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';

async function verifyArtifacts() {
  try {
    console.log('🔍 Verifying artifacts in database...\n');
    console.log('📍 API URL:', API_URL);
    console.log('');
    
    // Check artifacts
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (!artifactsRes.ok) {
      throw new Error(`Failed to fetch artifacts: ${artifactsRes.status}`);
    }
    const artifacts = await artifactsRes.json();
    
    console.log(`✅ Found ${artifacts.length} artifacts in database`);
    
    if (artifacts.length === 0) {
      console.log('⚠️  No artifacts found. You need to run the seed script:');
      console.log('   npm run seed');
    } else {
      console.log('\n📦 Artifacts:');
      artifacts.forEach((artifact, index) => {
        console.log(`   ${index + 1}. ${artifact.name} (${artifact.barcode})`);
      });
      console.log('\n✅ Database is seeded!');
      console.log('🌐 You can view artifacts at: https://archaeology-frontend.onrender.com/artifacts');
    }
    
    // Check catalogs
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (catalogsRes.ok) {
      const catalogs = await catalogsRes.json();
      console.log(`\n✅ Found ${catalogs.length} catalogs`);
    }
    
    // Check stats
    const statsRes = await fetch(`${API_URL}/api/stats`);
    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log('\n📊 Statistics:');
      console.log(`   Catalogs: ${stats.catalogCount || 0}`);
      console.log(`   Artifacts: ${stats.artifactCount || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend is running at:', API_URL);
  }
}

verifyArtifacts();

