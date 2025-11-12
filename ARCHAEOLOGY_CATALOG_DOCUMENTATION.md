# Archaeology Artifact Catalog - User Guide & Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Navigation Guide](#navigation-guide)
4. [Feature Documentation](#feature-documentation)
5. [Workflows](#workflows)
6. [Technical Details](#technical-details)

## Overview

The Archaeology Artifact Catalog is a comprehensive web application designed for archaeologists and researchers to organize, catalog, and manage archaeological discoveries. The application provides a modern, responsive interface with advanced features for artifact management.

### Key Features
- **Digital Catalog Management**: Create and organize multiple catalogs
- **Artifact Documentation**: Detailed artifact records with metadata
- **QR Code Generation**: Generate QR codes for quick artifact access
- **Media Upload**: Support for images, videos, and 3D models
- **Advanced Search**: Find artifacts by various criteria
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup
1. Navigate to the project directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open browser to `http://localhost:3000`

## Navigation Guide

### Main Navigation Bar
The application features a clean, modern navigation bar with the following sections:

#### 1. **Home** 🏠
- **Purpose**: Welcome page and feature overview
- **Features**:
  - Application introduction
  - Feature highlights with icons
  - Quick access buttons
  - Statistics dashboard (shows catalog and artifact counts)

#### 2. **Catalogs** 📚
- **Purpose**: Browse and manage archaeological catalogs
- **Features**:
  - View all existing catalogs
  - Create new catalogs (placeholder for future implementation)
  - Catalog details including:
    - Creation date
    - Number of artifacts
    - Description
  - Direct links to catalog details

#### 3. **Search** 🔍
- **Purpose**: Find specific artifacts across all catalogs
- **Features**:
  - Text search across artifact names, details, and locations
  - Filter by catalog
  - Real-time search results
  - Barcode search capability
  - Results display with artifact cards

#### 4. **Add Artifact** ➕
- **Purpose**: Create new artifact entries
- **Features**:
  - Comprehensive artifact form
  - Media upload capabilities
  - QR code generation
  - Barcode assignment
  - Catalog association

## Feature Documentation

### 1. Home Page Features

#### Welcome Section
- **Title**: "Archaeology Artifact Catalog"
- **Subtitle**: Descriptive text about the application's purpose
- **Action Buttons**:
  - "Browse Catalogs" (primary button)
  - "Add Artifact" (secondary button)

#### Feature Grid
Six feature cards highlighting key capabilities:

1. **Browse Catalogs** (Blue)
   - Icon: BookOpen
   - Description: "Explore organized collections of archaeological artifacts"
   - Link: /catalogs

2. **Search Artifacts** (Green)
   - Icon: Search
   - Description: "Find specific artifacts using advanced search filters"
   - Link: /search

3. **Add Artifacts** (Purple)
   - Icon: Plus
   - Description: "Catalog new discoveries with detailed information"
   - Link: /add-artifact

4. **QR Code Scanning** (Orange)
   - Icon: QrCode
   - Description: "Quick access to artifact details via QR codes"
   - Link: /search

5. **Media Upload** (Pink)
   - Icon: Camera
   - Description: "Upload photos, 3D models, and videos of artifacts"
   - Link: /add-artifact

6. **Detailed Records** (Indigo)
   - Icon: FileText
   - Description: "Comprehensive documentation of archaeological finds"
   - Link: /catalogs

#### Quick Stats Section
- **Total Catalogs**: Shows current number of catalogs
- **Total Artifacts**: Shows current number of artifacts
- **Recent Additions**: Shows recently added items

### 2. Catalogs Page Features

#### Header Section
- **Title**: "Catalogs"
- **Subtitle**: "Browse and manage your archaeological catalogs"
- **Add Catalog Button**: Creates new catalogs (placeholder implementation)

#### Catalog Grid
Each catalog is displayed as a card with:
- **Icon**: BookOpen icon
- **Name**: Catalog title
- **Description**: Catalog description
- **Metadata**:
  - Creation date with calendar icon
  - Number of artifacts
- **Action**: "View Details" link

#### Empty State
When no catalogs exist:
- **Icon**: BookOpen (grayed out)
- **Message**: "No catalogs"
- **Subtitle**: "Get started by creating your first catalog"
- **Action Button**: "Add Catalog"

### 3. Catalog Detail Page Features

#### Header Section
- **Back Navigation**: Link to return to catalogs list
- **Add Artifact Button**: Quick access to add artifacts to this catalog

#### Catalog Information Card
- **Title**: Catalog name
- **Description**: Full catalog description
- **Metadata**:
  - Creation date
  - Number of artifacts
  - QR code icon indicator

#### Artifacts Section
- **Title**: "Artifacts"
- **Artifact Grid**: Cards showing artifacts in this catalog
- **Empty State**: When no artifacts exist
  - Message: "No artifacts yet"
  - Action: "Add First Artifact" button

#### Artifact Cards
Each artifact card displays:
- **Name**: Artifact title
- **Description**: Truncated details
- **Location**: Where it was found (with map pin icon)
- **Date Found**: Discovery date
- **Link**: Click to view full artifact details

### 4. Artifact Detail Page Features

#### Header Section
- **Back Navigation**: Return to catalog or catalogs list
- **Edit Button**: Edit artifact details (placeholder)

#### Artifact Information
- **Title**: Artifact name
- **Barcode**: QR code identifier with icon
- **Details Section**:
  - Full artifact description
  - Location found (with map pin icon)
  - Date found (with calendar icon)
  - Cataloged date

#### Media Section
- **2D Images**: Grid of uploaded images
- **3D Models**: 3D model display area
- **Videos**: Video player area
- **Empty State**: "No media files uploaded" when none exist

#### Comments Section
- **Header**: Comments with message square icon
- **Comment List**: Chronological list of comments
- **Empty State**: "No comments yet" when none exist

### 5. Search Page Features

#### Header Section
- **Title**: "Search Artifacts"
- **Subtitle**: "Find artifacts by name, details, location, or barcode"

#### Search and Filter Controls
- **Search Input**:
  - Placeholder: "Search artifacts..."
  - Search icon
  - Real-time search functionality
- **Catalog Filter**:
  - Dropdown to filter by specific catalog
  - "All Catalogs" option
  - Filter icon

#### Results Section
- **Results Header**: Shows number of matching artifacts
- **Artifact Grid**: Cards displaying search results
- **Empty State**: When no results found
  - Search icon
  - "No artifacts found" message
  - Suggestion to adjust search terms

#### Search Result Cards
Each result card shows:
- **Name**: Artifact title
- **Barcode**: QR code identifier
- **Description**: Truncated details
- **Location**: Found location (with map pin)
- **Date Found**: Discovery date
- **Catalog**: Parent catalog name (in blue)
- **Link**: Click to view full details

### 6. Add Artifact Page Features

#### Header Section
- **Back Navigation**: Return to previous page
- **Title**: "Add New Artifact"
- **Subtitle**: "Document a new archaeological discovery"

#### Form Sections

##### Basic Information
- **Artifact Name**: Required text input
- **Catalog Selection**: Dropdown of available catalogs
- **Sub-catalog**: Optional sub-catalog selection
- **Details**: Multi-line text area for description
- **Location Found**: Text input for discovery location
- **Date Found**: Date picker for discovery date
- **Barcode**: Auto-generated or manual entry

##### Media Upload Section
- **Drag & Drop Area**: Visual dropzone for file uploads
- **Accepted File Types**:
  - Images: JPG, PNG, GIF, WebP
  - Videos: MP4, WebM, MOV
  - 3D Models: GLB, GLTF
- **File Preview**: Shows uploaded files with:
  - File type icons
  - File names
  - File sizes
  - Remove buttons

##### QR Code Preview
- **Toggle Button**: Show/hide QR code
- **QR Code Display**: Generated QR code for artifact
- **URL**: Preview URL for the artifact

#### Action Buttons
- **Save Artifact**: Primary action button
- **Cancel**: Secondary action to discard changes

## Workflows

### Workflow 1: Creating Your First Catalog

1. **Navigate to Catalogs**
   - Click "Catalogs" in the main navigation
   - You'll see the empty state message

2. **Add Catalog** (Placeholder Implementation)
   - Click "Add Catalog" button
   - Currently shows "Coming Soon" message
   - Future implementation will include catalog creation form

### Workflow 2: Adding Your First Artifact

1. **Access Add Artifact Page**
   - Click "Add Artifact" from navigation or home page
   - Or click "Add Artifact" from any catalog page

2. **Fill Basic Information**
   - Enter artifact name (required)
   - Select catalog (if available)
   - Add detailed description
   - Specify location found
   - Set discovery date
   - Barcode is auto-generated

3. **Upload Media** (Optional)
   - Drag and drop files into the upload area
   - Or click to browse and select files
   - Preview uploaded files
   - Remove unwanted files

4. **Generate QR Code** (Optional)
   - Click "Show QR Code" to preview
   - QR code contains link to artifact details

5. **Save Artifact**
   - Click "Save Artifact" button
   - Success message appears
   - Redirected to artifact detail page

### Workflow 3: Searching for Artifacts

1. **Access Search Page**
   - Click "Search" in main navigation

2. **Perform Search**
   - Type search terms in the search box
   - Optionally filter by catalog
   - Results update in real-time

3. **Review Results**
   - Browse through artifact cards
   - Each card shows key information
   - Click any card to view full details

4. **View Artifact Details**
   - Click on any search result
   - Navigate to full artifact detail page
   - View all information and media

### Workflow 4: Browsing Catalogs

1. **View Catalog List**
   - Navigate to "Catalogs" page
   - See all available catalogs in grid layout

2. **Explore Catalog Details**
   - Click "View Details" on any catalog
   - See catalog information and description
   - View all artifacts in that catalog

3. **Add Artifacts to Catalog**
   - Click "Add Artifact" from catalog detail page
   - Form pre-populates with selected catalog
   - Complete artifact creation process

### Workflow 5: Using QR Codes

1. **Generate QR Code**
   - When adding or editing artifacts
   - Click "Show QR Code" button
   - QR code displays with artifact URL

2. **QR Code Information**
   - Contains direct link to artifact details
   - Can be printed and attached to physical artifacts
   - Enables quick digital access to artifact information

## Technical Details

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **File Upload**: react-dropzone
- **Storage**: Local Storage (browser-based)

### Data Structure

#### Catalog Object
```typescript
interface Catalog {
  id: string;
  name: string;
  description: string;
  artifacts: string[];
  subCatalogs?: string[];
  creationDate: string;
  lastModified: string;
}
```

#### Artifact Object
```typescript
interface Artifact {
  id: string;
  catalogId: string;
  subCatalogId?: string;
  name: string;
  barcode: string;
  details: string;
  locationFound: string;
  dateFound: string;
  comments: Comment[];
  images2D: string[];
  image3D?: string;
  video?: string;
  creationDate: string;
  lastModified: string;
}
```

### File Storage
- **Current Implementation**: Local browser storage
- **Data Persistence**: Survives browser sessions
- **Limitations**: Data is browser-specific
- **Future Enhancement**: Backend database integration

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Navigation**: Collapsible mobile menu
- **Grid Layouts**: Responsive grid systems

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Features Used**: ES6+, CSS Grid, Flexbox
- **Fallbacks**: Graceful degradation for older browsers

## Future Enhancements

### Planned Features
1. **Backend Integration**: Database and API
2. **User Authentication**: Login and user management
3. **Collaborative Features**: Multi-user access
4. **Advanced Search**: Filters, sorting, pagination
5. **Export Functionality**: PDF reports, CSV exports
6. **Mobile App**: Native mobile application
7. **Offline Support**: Progressive Web App features
8. **Image Processing**: Automatic image optimization
9. **3D Viewer**: Built-in 3D model viewer
10. **Barcode Scanning**: Camera-based QR code scanning

### Technical Improvements
1. **Performance**: Code splitting and lazy loading
2. **Testing**: Unit and integration tests
3. **Accessibility**: WCAG compliance
4. **Internationalization**: Multi-language support
5. **Analytics**: Usage tracking and insights

## Troubleshooting

### Common Issues

#### App Won't Start
- **Check Node.js version**: Ensure v14 or higher
- **Clear cache**: Run `npm cache clean --force`
- **Reinstall dependencies**: Delete `node_modules` and run `npm install`

#### Data Not Persisting
- **Check browser storage**: Ensure local storage is enabled
- **Clear browser data**: May need to clear storage if corrupted
- **Browser compatibility**: Ensure modern browser support

#### Upload Issues
- **File size limits**: Check browser and system limits
- **File type support**: Ensure file types are supported
- **Browser permissions**: Check file access permissions

### Support
For technical support or feature requests, please refer to the project documentation or contact the development team.

---

*This documentation was generated for the Archaeology Artifact Catalog application. Last updated: [Current Date]*
