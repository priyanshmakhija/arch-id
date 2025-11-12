// Script to generate QR code images for artifacts
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

function generateBarcodeId(index) {
  const prefix = 'A';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const paddedIndex = index.toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}${paddedIndex}`;
}

async function generateQRCodes() {
  console.log('🔲 Generating 10 QR codes...\n');

  // Create qr-codes directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'qr-codes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const barcodes = [];
  const baseUrl = 'http://localhost:3000'; // Default frontend URL

  for (let i = 1; i <= 10; i++) {
    const barcode = generateBarcodeId(i);
    barcodes.push(barcode);

    // Generate QR code with artifact URL format
    // The URL format matches what the system uses: /artifact/:id?barcode=:barcode
    // For now, we'll use just the barcode, and when artifacts are created, they'll link to it
    const qrData = barcode; // Just the barcode ID - can be scanned to search/link artifacts

    try {
      const filePath = path.join(outputDir, `qr-code-${i}-${barcode}.png`);
      
      await QRCode.toFile(filePath, qrData, {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      console.log(`✅ Generated QR code ${i}: ${barcode}`);
      console.log(`   File: qr-codes/qr-code-${i}-${barcode}.png`);
    } catch (error) {
      console.error(`❌ Error generating QR code ${i}:`, error.message);
    }
  }

  // Create a text file with all barcode IDs for reference
  const barcodesFile = path.join(outputDir, 'barcodes.txt');
  fs.writeFileSync(
    barcodesFile,
    `Generated QR Code Barcodes\n` +
    `==========================\n\n` +
    barcodes.map((barcode, index) => `${index + 1}. ${barcode}`).join('\n') +
    `\n\nUse these barcode IDs when creating artifacts in the system.\n` +
    `The QR codes are saved as PNG images in the qr-codes directory.\n`
  );

  console.log(`\n✨ QR code generation complete!`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📝 Barcode list saved to: qr-codes/barcodes.txt`);
  console.log(`\n💡 You can now use these barcode IDs when creating artifacts.`);
}

generateQRCodes().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


