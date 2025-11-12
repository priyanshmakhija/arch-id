// Script to add real images to existing artifacts via API
const API_URL = process.env.API_URL || 'http://localhost:4000';

// Fetch a real image from Wikimedia Commons (public domain archaeological images)
async function fetchRealImage(artifactName, index) {
  // Using Wikimedia Commons direct URLs - these are public domain archaeological artifacts
  const imageUrls = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Neolithic_stone_axe.jpg/800px-Neolithic_stone_axe.jpg', // Neolithic axe
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Roman_coin_head.jpg/800px-Roman_coin_head.jpg', // Roman coin
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/AncientEgyptian_Scarab.jpg/800px-AncientEgyptian_Scarab.jpg', // Egyptian scarab
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cuneiform_tablet.jpg/800px-Cuneiform_tablet.jpg', // Cuneiform tablet
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Greek_pottery.jpg/800px-Greek_pottery.jpg', // Greek pottery
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Viking_brooch.jpg/800px-Viking_brooch.jpg', // Viking brooch
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Chinese_bronze_vessel.jpg/800px-Chinese_bronze_vessel.jpg', // Chinese bronze
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Maya_ceramic.jpg/800px-Maya_ceramic.jpg', // Maya ceramic
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Medieval_manuscript.jpg/800px-Medieval_manuscript.jpg', // Medieval manuscript
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Indus_seal.jpg/800px-Indus_seal.jpg', // Indus seal
  ];
  
  const imageUrl = imageUrls[index] || imageUrls[0];
  
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    // Determine MIME type from response
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`  ⚠️  Warning: Could not fetch image for ${artifactName}: ${error.message}`);
    // Fallback to placeholder if fetch fails
    return null;
  }
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

