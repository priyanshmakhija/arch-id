# Archaeology Artifact Catalog

A comprehensive digital catalog system for archaeological artifacts with QR code scanning, image management, and database integration.

## Features

- 🏺 **Artifact Management**: Create, edit, delete, and search artifacts
- 📸 **Image Support**: Upload and display images for each artifact
- 🔍 **QR Code Scanning**: Generate QR codes and scan from mobile devices
- 🗄️ **Database Integration**: SQLite backend with Express.js API
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful interface built with React and Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ and npm installed
- Git (optional, for cloning)

### Installation

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. **Seed the database with test data** (optional)
   ```bash
   npm run seed
   ```

### Running the Application

#### For Local Development (Same Computer Only)

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

Open http://localhost:3000 in your browser.

#### For Mobile Access (Local Network)

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend with Network Access:**
```bash
set REACT_APP_API_URL=http://192.168.4.29:4000
npm start
```

**Note:** Replace `192.168.4.29` with your computer's IP address if different.

Find your IP on Windows: `ipconfig | findstr IPv4`
Find your IP on Mac/Linux: `ifconfig` or `ip addr`

Then access from your phone: `http://192.168.4.29:3000`

### Creating a .env File (Recommended)

Create a `.env` file in the project root to avoid typing the command each time:

**Windows:**
```cmd
echo REACT_APP_API_URL=http://YOUR_IP:4000 > .env
```

**Mac/Linux:**
```bash
echo 'REACT_APP_API_URL=http://YOUR_IP:4000' > .env
```

Replace `YOUR_IP` with your actual IP address.

## Project Structure

```
archaeology-catalog/
├── src/                      # React frontend source code
│   ├── components/           # Reusable React components
│   ├── pages/                # Page components
│   ├── utils/                # Utility functions (API, storage, etc.)
│   └── types/                # TypeScript type definitions
├── server/                   # Express backend
│   ├── src/                  # Server source code
│   │   ├── index.ts         # API routes
│   │   └── db.ts            # Database setup
│   └── data.sqlite          # SQLite database
├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   ├── seed-artifacts.js           # Seed database
│   ├── seed-artifacts-with-images.js # Seed with images
│   └── add-images-to-artifacts.js  # Add images to artifacts
└── package.json             # Dependencies and scripts
```

## Available Scripts

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend Scripts

- `npm run server:build` - Build backend TypeScript
- `npm run server:start` - Start backend server
- `npm run server` - Build and start backend

### Database Scripts

- `npm run seed` - Seed database with test artifacts
- `npm run seed:with-images` - Seed database with artifacts and images
- `npm run add-images` - Add images to existing artifacts

## Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with better-sqlite3
- **QR Codes**: qrcode.react, html5-qrcode
- **Image Handling**: react-dropzone, File API

## Deployment

For production deployment, see:
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Fast deployment guide
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive deployment options

Recommended platforms:
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Render, Railway, or DigitalOcean

## QR Code Usage

QR codes are automatically generated for each artifact. To scan:

1. Open your phone's camera app (or a QR scanner app)
2. Point at the QR code
3. The artifact detail page opens automatically

**Note:** For mobile scanning to work, you need to either:
- Deploy the application to a public URL
- Be on the same local network as the development server

See [QR_CODE_SCANNING_GUIDE.md](QR_CODE_SCANNING_GUIDE.md) for detailed information.

## Mobile Access Troubleshooting

If artifacts don't appear on mobile:

1. **Check backend is accessible**
   - Open `http://YOUR_IP:4000/api/artifacts` on your phone
   - Should show JSON data

2. **Verify environment variable**
   - Make sure `REACT_APP_API_URL` is set correctly
   - Must use your computer's IP, not localhost

3. **Windows Firewall**
   - Allow Node.js through Windows Firewall
   - Settings → Firewall → Allow an app

4. **Same WiFi network**
   - Phone and computer must be on same network

See [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md) for more help.

## Documentation

- [Architecture & Design](ARCHAEOLOGY_CATALOG_DOCUMENTATION.md)
- [How to Run](HOW_TO_RUN.md)
- [QR Code Scanning](QR_CODE_SCANNING_GUIDE.md)
- [Mobile Access](MOBILE_ACCESS_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Quick Deploy](QUICK_DEPLOY.md)

## Features in Detail

### Artifact Management
- Add artifacts with detailed descriptions
- Upload multiple images per artifact
- Track discovery location and date
- Unique barcode generation
- Automatic QR code creation

### Catalog Organization
- Organize artifacts into catalogs
- Browse and search collections
- View statistics and counts

### Image Support
- Base64 encoding for storage
- Multiple images per artifact
- Responsive image galleries
- Fallback placeholders

### Search & Discovery
- Search by name, details, or location
- Filter by catalog
- Quick navigation

## Development

### API Endpoints

- `GET /api/catalogs` - List all catalogs
- `POST /api/catalogs` - Create catalog
- `GET /api/catalogs/:id` - Get catalog details
- `PUT /api/catalogs/:id` - Update catalog
- `DELETE /api/catalogs/:id` - Delete catalog

- `GET /api/artifacts` - List all artifacts
- `POST /api/artifacts` - Create artifact
- `GET /api/artifacts/:id` - Get artifact details
- `PUT /api/artifacts/:id` - Update artifact
- `DELETE /api/artifacts/:id` - Delete artifact

- `GET /api/stats` - Get statistics

### Database Schema

**Catalogs Table**
- id, name, description, creationDate, lastModified

**Artifacts Table**
- id, catalogId, subCatalogId, name, barcode, details
- locationFound, dateFound, images2D, image3D, video
- creationDate, lastModified

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the documentation files
2. Review troubleshooting guides
3. Open an issue on GitHub

---

Built with ❤️ for archaeologists and artifact enthusiasts

