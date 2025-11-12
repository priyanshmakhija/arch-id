// Script to seed test artifacts with real images and details via API
const API_URL = process.env.API_URL || 'http://localhost:4000';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateBarcodeId(index) {
  const prefix = 'A';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const paddedIndex = index.toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}${paddedIndex}`;
}

// Fetch a real image from Wikimedia Commons (public domain archaeological images)
async function fetchRealImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`  ⚠️  Warning: Could not fetch image: ${error.message}`);
    return null;
  }
}

// Test artifacts with real images from Wikimedia Commons and verified details
const testArtifacts = [
  {
    name: 'Neolithic Stone Axe Head',
    barcode: generateBarcodeId(1),
    details: 'A well-preserved polished stone axe head from the Neolithic period, dating approximately 4000-2500 BCE. Made from fine-grained flint with evidence of deliberate shaping and polishing. This artifact represents early agricultural technology and stone tool craftsmanship. Found with remnants of a wooden haft attached, showing advanced composite tool construction.',
    locationFound: 'Excavation Site Alpha, Grid 7B, Layer 3',
    dateFound: '2023-05-15',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Paleolith_axe.jpg/800px-Paleolith_axe.jpg'
  },
  {
    name: 'Roman Bronze Coin - Denarius',
    barcode: generateBarcodeId(2),
    details: 'Silver denarius coin minted during the reign of Emperor Augustus (27 BCE - 14 CE). Obverse features portrait of Augustus with laurel wreath, reverse shows military standards. Coin shows moderate wear consistent with circulation. Important numismatic evidence for Roman trade networks and imperial iconography during the early Empire.',
    locationFound: 'Roman Settlement Site, Trench 12, Context 45',
    dateFound: '2023-06-22',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Roman_coin_Augustus.jpg/800px-Roman_coin_Augustus.jpg'
  },
  {
    name: 'Ancient Egyptian Scarab Amulet',
    barcode: generateBarcodeId(3),
    details: 'Carved faience scarab beetle amulet from the New Kingdom period (c. 1550-1070 BCE). Hieroglyphic inscription on the base reads "may the heart not testify against me." Green-blue glazed surface with intricate detailing on the beetle\'s wings and legs. Scarabs were protective amulets and symbols of rebirth in ancient Egyptian religion.',
    locationFound: 'Valley of the Kings, Tomb KV-15, Burial Chamber',
    dateFound: '2023-03-10',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Egyptian_scarab.jpg/800px-Egyptian_scarab.jpg'
  },
  {
    name: 'Mesopotamian Cuneiform Tablet',
    barcode: generateBarcodeId(4),
    details: 'Clay tablet inscribed with cuneiform script from the Babylonian period (c. 1900-1600 BCE). Contains administrative records detailing grain distribution. Tablet measures 8cm x 5cm, well-preserved with clear wedge-shaped impressions. Provides valuable insight into early accounting systems and economic practices in ancient Mesopotamia.',
    locationFound: 'Tell el-Amarna, Administrative Quarter, Room B',
    dateFound: '2023-07-18',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Clay_cuneiform.jpg/800px-Clay_cuneiform.jpg'
  },
  {
    name: 'Greek Red-Figure Pottery Fragment',
    barcode: generateBarcodeId(5),
    details: 'Fragment from an Attic red-figure kylix (wine cup) dating to the late 6th century BCE. Depicts scene from Greek mythology showing a satyr and maenad. The red-figure technique involved painting figures in slip that turned red when fired, leaving the background black. This fragment demonstrates exceptional artistic skill and provides insight into Greek drinking culture and mythology.',
    locationFound: 'Athenian Agora, Building Complex A, Floor Deposit',
    dateFound: '2023-04-05',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Greek_vase_red-figure.jpg/800px-Greek_vase_red-figure.jpg'
  },
  {
    name: 'Viking Age Silver Brooch',
    barcode: generateBarcodeId(6),
    details: 'Tortoise brooch (penannular brooch) made of silver with intricate zoomorphic designs. Dating to the 10th century CE, this artifact was used to fasten women\'s garments in Viking culture. Features stylized animal heads and interlace patterns typical of Norse art. Silver content suggests high status of the owner. Excellent preservation with original pin mechanism intact.',
    locationFound: 'Jorvik Viking Settlement, House 23, Woman\'s Burial',
    dateFound: '2023-08-12',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Viking_brooch.jpg/800px-Viking_brooch.jpg'
  },
  {
    name: 'Chinese Bronze Ritual Vessel - Ding',
    barcode: generateBarcodeId(7),
    details: 'Bronze tripod cauldron (ding) from the Shang Dynasty (c. 1600-1046 BCE). Decorated with taotie (monster mask) motifs and geometric patterns characteristic of Shang bronze work. The ding was used for cooking and serving food in ritual ceremonies. Inscriptions indicate it belonged to a noble family. Demonstrates advanced bronze casting techniques and hierarchical social structure.',
    locationFound: 'Anyang Archaeological Site, Royal Cemetery M1001',
    dateFound: '2023-02-28',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Chinese_bronze_ding.jpg/800px-Chinese_bronze_ding.jpg'
  },
  {
    name: 'Mayan Ceramic Figurine',
    barcode: generateBarcodeId(8),
    details: 'Hollow ceramic figurine depicting a seated dignitary from the Classic Maya period (c. 250-900 CE). Features detailed facial features, elaborate headdress, and ceremonial regalia. The figurine likely represents a ruler or high-ranking noble. Painted decoration includes red, black, and cream pigments. Provides insight into Maya social hierarchy, religious beliefs, and ceramic production techniques.',
    locationFound: 'Tikal Site, Temple I Complex, Offering Cache',
    dateFound: '2023-09-20',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Maya_ceramic_figurine.jpg/800px-Maya_ceramic_figurine.jpg'
  },
  {
    name: 'Medieval Illuminated Manuscript Fragment',
    barcode: generateBarcodeId(9),
    details: 'Parchment fragment from a 12th-century illuminated manuscript, likely a psalter. Features Latin text in Carolingian minuscule script with decorated initial letter. The illumination shows typical Romanesque style with geometric patterns and stylized foliage. Gold leaf application indicates this was a luxury manuscript. Fragment measures 15cm x 12cm and provides evidence of monastic scriptorium practices.',
    locationFound: 'Cloister Archive, Library Deposit, Shelf 3',
    dateFound: '2023-10-08',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Medieval_manuscript.jpg/800px-Medieval_manuscript.jpg'
  },
  {
    name: 'Indus Valley Seal',
    barcode: generateBarcodeId(10),
    details: 'Square steatite seal with unicorn motif from the Harappan Civilization (c. 2600-1900 BCE). Carved in negative relief, designed to make impressions in clay. Reverse features a short inscription in Indus script (undeciphered). The unicorn is the most common motif on Indus seals. This artifact was likely used for trade, ownership marking, or administrative purposes in one of the world\'s earliest urban civilizations.',
    locationFound: 'Mohenjo-daro Site, Lower Town, Street 9, House 15',
    dateFound: '2023-11-15',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Indus_seal.jpg/800px-Indus_seal.jpg'
  },
];

async function seedArtifactsWithImages() {
  console.log('🌱 Starting artifact seeding with images...\n');

  // First, clear existing artifacts
  console.log('🗑️  Clearing existing artifacts...');
  try {
    const artifactsRes = await fetch(`${API_URL}/api/artifacts`);
    if (artifactsRes.ok) {
      const artifacts = await artifactsRes.json();
      for (const artifact of artifacts) {
        await fetch(`${API_URL}/api/artifacts/${artifact.id}`, {
          method: 'DELETE',
          headers: { 'x-user-role': 'admin' },
        });
      }
      console.log(`✅ Cleared ${artifacts.length} existing artifacts\n`);
    }
  } catch (error) {
    console.log('⚠️  Could not clear existing artifacts (this is okay if none exist)\n');
  }

  // Get or create a catalog
  let catalogId;
  try {
    const catalogsRes = await fetch(`${API_URL}/api/catalogs`);
    if (catalogsRes.ok) {
      const catalogs = await catalogsRes.json();
      if (catalogs.length > 0) {
        catalogId = catalogs[0].id;
        console.log(`✅ Using existing catalog: ${catalogs[0].name}\n`);
      } else {
        // Create a default catalog
        const now = new Date().toISOString();
        const newCatalog = {
          id: generateUniqueId(),
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
          console.log(`✅ Created new catalog: ${newCatalog.name}\n`);
        } else {
          throw new Error('Failed to create catalog');
        }
      }
    } else {
      throw new Error('Failed to fetch catalogs');
    }
  } catch (error) {
    console.error('❌ Error setting up catalog:', error.message);
    console.log('Make sure the server is running at', API_URL);
    process.exit(1);
  }

  // Create artifacts with images
  console.log(`📦 Creating ${testArtifacts.length} artifacts with images...\n`);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < testArtifacts.length; i++) {
    const artifactData = testArtifacts[i];
    const now = new Date().toISOString();
    
    // Fetch the image first
    console.log(`  📸 Fetching image for: ${artifactData.name}...`);
    const imageData = await fetchRealImage(artifactData.imageUrl);
    
    const artifact = {
      id: generateUniqueId(),
      catalogId: catalogId,
      name: artifactData.name,
      barcode: artifactData.barcode,
      details: artifactData.details,
      locationFound: artifactData.locationFound,
      dateFound: artifactData.dateFound,
      images2D: imageData ? [imageData] : [],
      creationDate: now,
      lastModified: now,
    };

    try {
      const res = await fetch(`${API_URL}/api/artifacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify(artifact),
      });

      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${i + 1}. ${artifact.name} (${artifact.barcode}) - ${imageData ? 'with image' : 'without image'}`);
      } else {
        failCount++;
        const error = await res.text();
        console.log(`  ❌ ${i + 1}. ${artifact.name} - Failed: ${error}`);
      }
    } catch (error) {
      failCount++;
      console.log(`  ❌ ${i + 1}. ${artifact.name} - Error: ${error.message}`);
    }
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`   ✅ Successfully created: ${successCount} artifacts`);
  if (failCount > 0) {
    console.log(`   ❌ Failed: ${failCount} artifacts`);
  }
}

seedArtifactsWithImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

