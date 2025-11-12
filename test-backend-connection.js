// Quick test to verify backend connection and check if artifacts exist
const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';

async function testBackend() {
  console.log('Testing backend connection...');
  console.log('API URL:', API_URL);
  
  try {
    // Test root endpoint
    console.log('\n1. Testing root endpoint...');
    const rootRes = await fetch(`${API_URL}/`);
    const rootData = await rootRes.json();
    console.log('✅ Root endpoint:', rootData.message);
    
    // Test artifacts endpoint
    console.log('\n2. Testing artifacts endpoint...');
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    const artifacts = await artifactsRes.json();
    console.log(`✅ Artifacts endpoint: Found ${artifacts.length} artifacts`);
    
    // Test catalogs endpoint
    console.log('\n3. Testing catalogs endpoint...');
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    const catalogs = await catalogsRes.json();
    console.log(`✅ Catalogs endpoint: Found ${catalogs.length} catalogs`);
    
    // Test stats endpoint
    console.log('\n4. Testing stats endpoint...');
    const statsRes = await fetch(`${API_URL}/api/stats`);
    const stats = await statsRes.json();
    console.log('✅ Stats endpoint:', stats);
    
    if (artifacts.length === 0) {
      console.log('\n⚠️  No artifacts found. You need to seed the database.');
    } else {
      console.log('\n✅ Database has artifacts!');
      console.log('First artifact:', artifacts[0].name);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend is accessible at:', API_URL);
  }
}

testBackend();

