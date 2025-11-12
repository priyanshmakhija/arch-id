# QR Code Scanning Guide

## How QR Code Scanning Works

The Archaeology Catalog system is **already fully configured** for QR code scanning from mobile devices! Here's how it works:

## Current Setup

### 1. QR Code Generation
When you create an artifact, a QR code is automatically generated with the following URL format:
```
http://localhost:3000/artifact/{artifact-id}?barcode={barcode}
```

### 2. QR Code Display
QR codes are displayed in:
- **Add Artifact page**: After creating a new artifact
- **All Artifacts page**: Each artifact card shows its QR code
- **Artifact Detail page**: Can be accessed from the detail view

### 3. Artifact Lookup
The ArtifactDetailPage is already configured to handle QR code scanning:
- First tries to find artifact by ID
- Falls back to finding by barcode
- Supports both API and local storage lookup

## How to Scan QR Codes on Mobile

### Option 1: Build for Mobile Access
The application currently uses `localhost:3000` which only works on the development machine. To scan from a mobile device, you have two options:

#### A. Deploy to a Server (Production)
1. Build the production version
2. Deploy to a web server
3. QR codes will contain the deployed URL
4. Mobile devices can scan and access the artifact pages

#### B. Use Local Network IP (Development)
To test QR code scanning on mobile devices during development:

1. **Find your computer's local IP address:**
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" - e.g., 192.168.1.100
   
   # Mac/Linux
   ifconfig
   # Look for "inet" - e.g., 192.168.1.100
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access from mobile device:**
   - Make sure your phone is on the same WiFi network
   - Navigate to: `http://192.168.1.100:3000`
   - The QR codes will need to be regenerated to use this IP

4. **Update QR Code Generation** (optional modification):
   You can temporarily modify the QR code generation to use your local IP:
   ```typescript
   // In AddArtifactPage.tsx and AllArtifactsPage.tsx
   const qrCodeUrl = `${process.env.REACT_APP_BASE_URL || 'http://192.168.1.100:3000'}/artifact/${artifact.id}?barcode=${artifact.barcode}`;
   ```

### Option 2: Mobile Camera App Scanning
Most modern smartphones can scan QR codes using their built-in camera apps:
1. Open your phone's camera app
2. Point it at the QR code
3. A notification will appear
4. Tap to open the link in the browser

### Option 3: QR Code Scanner App
Download a QR code scanner app:
- **iOS**: QR Reader by TapMedia (or built-in camera)
- **Android**: QR Code Scanner by Kaspersky (or built-in camera)

## Testing the Flow

### On Your Development Computer:
1. Open http://localhost:3000
2. Navigate to "All Artifacts"
3. You'll see QR codes for each artifact
4. Print or display the QR code

### On Mobile Device:
1. Open your phone's camera or QR scanner app
2. Point at the QR code
3. The browser opens to the artifact detail page
4. You can view all artifact details, images, and information

## QR Code URL Format

The QR codes encode URLs like:
```
http://localhost:3000/artifact/a1b2c3d4e5f6?barcode=A12345678
```

The ArtifactDetailPage handles this by:
1. Extracting the artifact ID from the URL path
2. Checking if a barcode parameter exists
3. Looking up the artifact by ID first, then by barcode if not found
4. Displaying the artifact details

## Troubleshooting

### "Artifact not found" error
- Make sure the server is running
- Ensure artifacts exist in the database
- Check that the QR code URL is correct

### QR code doesn't scan
- Ensure good lighting
- QR code should be clearly visible
- Try increasing QR code size if too small

### Cannot access from mobile
- Ensure phone and computer are on same WiFi
- Use your computer's local IP instead of localhost
- Check firewall settings on your computer

## Future Enhancements

Potential improvements for mobile QR scanning:
1. Add camera-based QR scanner component to the app
2. Implement offline QR code scanning (cache artifact data)
3. Add NFC tag support for physical artifacts
4. Generate printable QR code labels
5. Add share functionality to generate new QR codes

