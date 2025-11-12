// Auto-seed script that runs on server startup
// Seeds the database with artifacts and images if the database is empty
import db from './db.js';

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function generateBarcodeId(index: number): string {
  const prefix = 'A';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const paddedIndex = index.toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}${paddedIndex}`;
}

// Generate a placeholder SVG image as base64
function generatePlaceholderImage(artifactName: string, index: number): string {
  const colors = [
    '#4F46E5', '#7C3AED', '#DB2777', '#EA580C', '#CA8A04',
    '#16A34A', '#0891B2', '#0284C7', '#BE185D', '#9F1239'
  ];
  const color = colors[index % colors.length];
  
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
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Test artifacts with diverse historical periods and cultures
const testArtifacts = [
  {
    name: 'Neolithic Stone Axe Head',
    details: 'A well-preserved polished stone axe head from the Neolithic period, dating approximately 4000-2500 BCE. Made from fine-grained flint with evidence of deliberate shaping and polishing. This artifact represents early agricultural technology and stone tool craftsmanship. Found with remnants of a wooden haft attached, showing advanced composite tool construction.',
    locationFound: 'Excavation Site Alpha, Grid 7B, Layer 3',
    dateFound: '2023-05-15',
    length: '18 cm',
    heightDepth: '4 cm',
    width: '6 cm',
  },
  {
    name: 'Roman Bronze Coin - Denarius',
    details: 'Silver denarius coin minted during the reign of Emperor Augustus (27 BCE - 14 CE). Obverse features portrait of Augustus with laurel wreath, reverse shows military standards. Coin shows moderate wear consistent with circulation. Important numismatic evidence for Roman trade networks and imperial iconography during the early Empire.',
    locationFound: 'Roman Settlement Site, Trench 12, Context 45',
    dateFound: '2023-06-22',
    length: '1.9 cm',
    heightDepth: '0.2 cm',
    width: '1.9 cm',
  },
  {
    name: 'Ancient Egyptian Scarab Amulet',
    details: 'Carved faience scarab beetle amulet from the New Kingdom period (c. 1550-1070 BCE). Hieroglyphic inscription on the base reads "may the heart not testify against me." Green-blue glazed surface with intricate detailing on the beetle\'s wings and legs. Scarabs were protective amulets and symbols of rebirth in ancient Egyptian religion.',
    locationFound: 'Valley of the Kings, Tomb KV-15, Burial Chamber',
    dateFound: '2023-03-10',
    length: '3.5 cm',
    heightDepth: '1.2 cm',
    width: '2.1 cm',
  },
  {
    name: 'Mesopotamian Cuneiform Tablet',
    details: 'Clay tablet inscribed with cuneiform script from the Babylonian period (c. 1900-1600 BCE). Contains administrative records detailing grain distribution. Tablet measures 8cm x 5cm, well-preserved with clear wedge-shaped impressions. Provides valuable insight into early accounting systems and economic practices in ancient Mesopotamia.',
    locationFound: 'Tell el-Amarna, Administrative Quarter, Room B',
    dateFound: '2023-07-18',
    length: '8 cm',
    heightDepth: '2 cm',
    width: '5 cm',
  },
  {
    name: 'Greek Red-Figure Pottery Fragment',
    details: 'Fragment from an Attic red-figure kylix (wine cup) dating to the late 6th century BCE. Depicts scene from Greek mythology showing a satyr and maenad. The red-figure technique involved painting figures in slip that turned red when fired, leaving the background black. This fragment demonstrates exceptional artistic skill and provides insight into Greek drinking culture and mythology.',
    locationFound: 'Athenian Agora, Building Complex A, Floor Deposit',
    dateFound: '2023-04-05',
    length: '12 cm',
    heightDepth: '0.6 cm',
    width: '8 cm',
  },
  {
    name: 'Viking Age Silver Brooch',
    details: 'Tortoise brooch (penannular brooch) made of silver with intricate zoomorphic designs. Dating to the 10th century CE, this artifact was used to fasten women\'s garments in Viking culture. Features stylized animal heads and interlace patterns typical of Norse art. Silver content suggests high status of the owner. Excellent preservation with original pin mechanism intact.',
    locationFound: 'Jorvik Viking Settlement, House 23, Woman\'s Burial',
    dateFound: '2023-08-12',
    length: '9 cm',
    heightDepth: '2.5 cm',
    width: '6.5 cm',
  },
  {
    name: 'Chinese Bronze Ritual Vessel - Ding',
    details: 'Bronze tripod cauldron (ding) from the Shang Dynasty (c. 1600-1046 BCE). Decorated with taotie (monster mask) motifs and geometric patterns characteristic of Shang bronze work. The ding was used for cooking and serving food in ritual ceremonies. Inscriptions indicate it belonged to a noble family. Demonstrates advanced bronze casting techniques and hierarchical social structure.',
    locationFound: 'Anyang Archaeological Site, Royal Cemetery M1001',
    dateFound: '2023-02-28',
    length: '36 cm',
    heightDepth: '32 cm',
    width: '28 cm',
  },
  {
    name: 'Mayan Ceramic Figurine',
    details: 'Hollow ceramic figurine depicting a seated dignitary from the Classic Maya period (c. 250-900 CE). Features detailed facial features, elaborate headdress, and ceremonial regalia. The figurine likely represents a ruler or high-ranking noble. Painted decoration includes red, black, and cream pigments. Provides insight into Maya social hierarchy, religious beliefs, and ceramic production techniques.',
    locationFound: 'Tikal Site, Temple I Complex, Offering Cache',
    dateFound: '2023-09-20',
    length: '14 cm',
    heightDepth: '18 cm',
    width: '10 cm',
  },
  {
    name: 'Medieval Illuminated Manuscript Fragment',
    details: 'Parchment fragment from a 12th-century illuminated manuscript, likely a psalter. Features Latin text in Carolingian minuscule script with decorated initial letter. The illumination shows typical Romanesque style with geometric patterns and stylized foliage. Gold leaf application indicates this was a luxury manuscript. Fragment measures 15cm x 12cm and provides evidence of monastic scriptorium practices.',
    locationFound: 'Cloister Archive, Library Deposit, Shelf 3',
    dateFound: '2023-10-08',
    length: '15 cm',
    heightDepth: '0.1 cm',
    width: '12 cm',
  },
  {
    name: 'Indus Valley Seal',
    details: 'Square steatite seal with unicorn motif from the Harappan Civilization (c. 2600-1900 BCE). Carved in negative relief, designed to make impressions in clay. Reverse features a short inscription in Indus script (undeciphered). The unicorn is the most common motif on Indus seals. This artifact was likely used for trade, ownership marking, or administrative purposes in one of the world\'s earliest urban civilizations.',
    locationFound: 'Mohenjo-daro Site, Lower Town, Street 9, House 15',
    dateFound: '2023-11-15',
    length: '4 cm',
    heightDepth: '1.2 cm',
    width: '4 cm',
  },
];

export async function autoSeedDatabase(): Promise<void> {
  try {
    console.log('🔍 Checking if database needs seeding...');
    
    // Check if artifacts exist
    const artifactCount = db.prepare('SELECT COUNT(*) as count FROM artifacts').get() as { count: number };
    
    // If artifacts already exist, skip seeding (database is not empty)
    if (artifactCount.count > 0) {
      const catalogCount = db.prepare('SELECT COUNT(*) as count FROM catalogs').get() as { count: number };
      console.log(`✅ Database already has data: ${catalogCount.count} catalogs, ${artifactCount.count} artifacts`);
      return;
    }
    
    console.log('🌱 Database is empty, starting auto-seed...');
    
    // Create default catalog if it doesn't exist
    let catalogId: string;
    const existingCatalogs = db.prepare('SELECT * FROM catalogs LIMIT 1').all() as Array<{ id: string; name: string }>;
    
    if (existingCatalogs.length > 0) {
      catalogId = existingCatalogs[0].id;
      console.log(`✅ Using existing catalog: ${existingCatalogs[0].name}`);
    } else {
      const now = new Date().toISOString();
      catalogId = generateUniqueId();
      db.prepare(`
        INSERT INTO catalogs (id, name, description, creationDate, lastModified)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        catalogId,
        'Historical Artifacts Collection',
        'A collection of archaeological artifacts from human history',
        now,
        now
      );
      console.log(`✅ Created catalog: Historical Artifacts Collection`);
    }
    
    // Create artifacts with images
    console.log(`📦 Creating ${testArtifacts.length} artifacts with images...`);
    const insertArtifact = db.prepare(`
      INSERT INTO artifacts (
        id, catalogId, subCatalogId, name, barcode, details,
        length, heightDepth, width,
        locationFound, dateFound, images2D, image3D, video,
        creationDate, lastModified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let successCount = 0;
    for (let i = 0; i < testArtifacts.length; i++) {
      const artifactData = testArtifacts[i];
      const now = new Date().toISOString();
      const artifactId = generateUniqueId();
      const barcode = generateBarcodeId(i + 1);
      
      // Generate placeholder image for each artifact
      const placeholderImage = generatePlaceholderImage(artifactData.name, i);
      
      try {
        insertArtifact.run(
          artifactId,
          catalogId,
          null,
          artifactData.name,
          barcode,
          artifactData.details,
          artifactData.length || null,
          artifactData.heightDepth || null,
          artifactData.width || null,
          artifactData.locationFound,
          artifactData.dateFound,
          JSON.stringify([placeholderImage]),
          null,
          null,
          now,
          now
        );
        successCount++;
        console.log(`  ✅ ${i + 1}. ${artifactData.name} (${barcode}) - Created with image`);
      } catch (error: any) {
        console.error(`  ❌ ${i + 1}. ${artifactData.name} - Error: ${error.message}`);
      }
    }
    
    console.log(`\n✨ Auto-seed complete!`);
    console.log(`   ✅ Successfully created: ${successCount} artifacts with images`);
    const finalCatalogCount = db.prepare('SELECT COUNT(*) as count FROM catalogs').get() as { count: number };
    const finalArtifactCount = db.prepare('SELECT COUNT(*) as count FROM artifacts').get() as { count: number };
    console.log(`   📦 Database now has: ${finalCatalogCount.count} catalog(s), ${finalArtifactCount.count} artifact(s)`);
  } catch (error: any) {
    console.error('❌ Error during auto-seed:', error.message);
    // Don't throw - allow server to start even if seeding fails
  }
}

