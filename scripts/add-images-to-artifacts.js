// Script to add real images to existing artifacts via API
// Use node-fetch if available, otherwise use global fetch (Node.js 18+)
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  // Node.js 18+ has fetch globally
  if (typeof globalThis.fetch === 'undefined') {
    console.error('❌ Error: fetch is not available. Please install node-fetch: npm install node-fetch@2');
    process.exit(1);
  }
  fetch = globalThis.fetch;
}

const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';

// Generate a placeholder SVG image as base64
function generatePlaceholderImage(artifactName, index) {
  // Create a simple SVG placeholder with artifact name
  const colors = [
    '#4F46E5', '#7C3AED', '#DB2777', '#EA580C', '#CA8A04',
    '#16A34A', '#0891B2', '#0284C7', '#BE185D', '#9F1239'
  ];
  const color = colors[index % colors.length];
  
  // Create SVG with artifact name
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" opacity="0.1"/>
      <rect width="100%" height="100%" fill="url(#pattern)"/>
      <defs>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="${color}" opacity="0.2"/>
        </pattern>
      </defs>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="${color}" text-anchor="middle" dominant-baseline="middle">
        ${artifactName.split(' ').slice(0, 2).join(' ')}
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" 
            fill="${color}" opacity="0.7" text-anchor="middle" dominant-baseline="middle">
        Archaeological Artifact
      </text>
    </svg>
  `.trim();
  
  // Convert SVG to base64
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Fetch a real image from a reliable source or use placeholder
async function fetchRealImage(artifactName, index) {
  // Try using placeholder.com first (reliable and fast)
  const placeholderUrls = [
    `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(artifactName.split(' ').slice(0, 2).join('+'))}`,
    `https://picsum.photos/800/600?random=${index + 1}`,
  ];
  
  // Try placeholder.com first
  try {
    // Create a timeout promise for fetch
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });
    
    const fetchPromise = fetch(placeholderUrls[0], {
      redirect: 'follow',
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (response && response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const contentType = response.headers.get('content-type') || 'image/png';
      return `data:${contentType};base64,${base64}`;
    }
  } catch (error) {
    console.log(`  ⚠️  Could not fetch from placeholder.com: ${error.message}`);
  }
  
  // Fallback to generated SVG placeholder (always works)
  console.log(`  📝 Using SVG placeholder for: ${artifactName}`);
  return generatePlaceholderImage(artifactName, index);
}

async function addImagesToArtifacts() {
  console.log('🖼️  Starting to add images to artifacts...\n');

  try {
    // Fetch all artifacts
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (!artifactsRes.ok) {
      throw new Error('Failed to fetch artifacts');
    }
    
    const artifacts = await artifactsRes.json();
    console.log(`📦 Found ${artifacts.length} artifacts\n`);

    if (artifacts.length === 0) {
      console.log('⚠️  No artifacts found. Please run seed-artifacts.js first.');
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (let i = 0; i < artifacts.length; i++) {
      const artifact = artifacts[i];
      
      // Check if artifact already has real images (not placeholders)
      // We'll replace images anyway to update them
      const hasImages = artifact.images2D && artifact.images2D.length > 0;
      if (hasImages) {
        console.log(`  🔄 ${i + 1}. ${artifact.name} - Replacing existing image(s)...`);
      }

      // Fetch real image
      console.log(`  📸 Fetching image for: ${artifact.name}...`);
      const realImage = await fetchRealImage(artifact.name, i);
      
      // Skip if image fetch failed
      if (!realImage) {
        console.log(`  ⏭️  ${i + 1}. ${artifact.name} - Skipping due to image fetch failure`);
        skipCount++;
        continue;
      }
      
      // Update artifact with image (include all required fields for PUT request)
      const updatedArtifact = {
        catalogId: artifact.catalogId,
        name: artifact.name,
        barcode: artifact.barcode,
        details: artifact.details,
        locationFound: artifact.locationFound,
        dateFound: artifact.dateFound,
        images2D: [realImage],
        lastModified: new Date().toISOString()
      };
      
      // Include dimension fields if they exist
      if (artifact.length) {
        updatedArtifact.length = artifact.length;
      }
      if (artifact.heightDepth) {
        updatedArtifact.heightDepth = artifact.heightDepth;
      }
      if (artifact.width) {
        updatedArtifact.width = artifact.width;
      }
      
      // Only include optional fields if they exist
      if (artifact.subCatalogId) {
        updatedArtifact.subCatalogId = artifact.subCatalogId;
      }
      if (artifact.image3D) {
        updatedArtifact.image3D = artifact.image3D;
      }
      if (artifact.video) {
        updatedArtifact.video = artifact.video;
      }

      try {
        const updateRes = await fetch(`${API_URL}/api/artifacts/${artifact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': 'admin',
          },
          body: JSON.stringify(updatedArtifact),
        });

        if (updateRes.ok) {
          successCount++;
          console.log(`  ✅ ${i + 1}. ${artifact.name} - Image added successfully`);
        } else {
          failCount++;
          const error = await updateRes.text();
          console.log(`  ❌ ${i + 1}. ${artifact.name} - Failed: ${error}`);
        }
      } catch (error) {
        failCount++;
        console.log(`  ❌ ${i + 1}. ${artifact.name} - Error: ${error.message}`);
      }
    }

    console.log(`\n✨ Image addition complete!`);
    console.log(`   ✅ Successfully updated: ${successCount} artifacts`);
    if (skipCount > 0) {
      console.log(`   ⏭️  Skipped (already has images): ${skipCount} artifacts`);
    }
    if (failCount > 0) {
      console.log(`   ❌ Failed: ${failCount} artifacts`);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.log('Make sure the server is running at', API_URL);
    process.exit(1);
  }
}

addImagesToArtifacts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

