# Guide: Adding Artifacts with Persistent URLs and QR Codes

## Overview

With PostgreSQL set up, your artifacts are now **permanently stored** in the database. This guide explains how to add artifacts and ensure consistent QR codes and URLs.

## How Artifacts Are Stored

### Database Persistence
- ✅ **Artifacts** are stored in PostgreSQL (permanent)
- ✅ **Images** are stored as base64 in the database
- ✅ **Descriptions** are stored as text
- ✅ **IDs and barcodes** remain stable once created

### URL Structure
Artifacts are accessed via:
```
/artifact/{artifact-id}?barcode={barcode}
```

Where:
- `artifact-id`: Unique identifier (generated once, never changes)
- `barcode`: Human-readable barcode (also unique, never changes)

## Adding Artifacts

### Step 1: Access Add Artifact Page

1. **Log in** with appropriate role:
   - `admin` or `archaeologist` role required
   - Go to `/login` if not logged in

2. **Navigate to Add Artifact**:
   - Click **"Add Artifact"** in navigation
   - Or go to: `/add-artifact`
   - Or from a catalog page: Click **"Add Artifact"** button

### Step 2: Fill Out Artifact Form

**Required Fields:**
- **Artifact Name**: Name of the artifact
- **Catalog**: Select which catalog it belongs to
- **Details**: Description of the artifact
- **Location Found**: Where it was discovered
- **Date Found**: Discovery date

**Optional Fields:**
- **Sub-catalog**: If applicable
- **Dimensions**: Length, Height/Depth, Width
- **Barcode**: Auto-generated if left empty

**Media (Optional):**
- **Images**: Upload 2D images (JPG, PNG, GIF, WebP)
- **3D Model**: Upload GLB/GLTF files
- **Video**: Upload video files (MP4, WebM, MOV)

### Step 3: Save Artifact

1. Click **"Save Artifact"** button
2. Artifact is saved to PostgreSQL database
3. **Artifact ID is generated** and stored permanently
4. **Barcode is generated** (if not provided) and stored permanently
5. QR code modal appears automatically

### Step 4: QR Code Generation

After saving, you'll see:
- **QR Code** with the artifact URL
- **URL format**: `https://your-site.com/artifact/{id}?barcode={barcode}`
- **Barcode** displayed below artifact name

**QR Code URL Structure:**
```
https://arch-id.onrender.com/artifact/{artifact-id}?barcode={barcode}
```

Example:
```
https://arch-id.onrender.com/artifact/mi6tyw2od9uieip8jug?barcode=A926092035QWD0001
```

## URL Consistency

### Why URLs Stay Consistent

1. **Artifact ID**: Generated once when artifact is created, stored in database, **never changes**
2. **Barcode**: Generated once (or provided), stored in database, **never changes**
3. **Database Persistence**: PostgreSQL stores data permanently, survives restarts

### URL Components

**Primary Identifier**: `artifact-id`
- Used in URL path: `/artifact/{id}`
- Unique per artifact
- Never changes after creation

**Secondary Identifier**: `barcode`
- Used as query parameter: `?barcode={barcode}`
- Human-readable identifier
- Can be used for QR code scanning
- Never changes after creation

## QR Code Usage

### Generating QR Codes

1. **After Creating Artifact**:
   - QR code is automatically shown in modal
   - Contains full URL with both ID and barcode
   - Can be printed or saved

2. **From Artifact Detail Page**:
   - View artifact details
   - QR code can be generated/displayed there

### QR Code Content

The QR code contains:
```
https://arch-id.onrender.com/artifact/{artifact-id}?barcode={barcode}
```

**Benefits:**
- ✅ **Direct link** to artifact details
- ✅ **Redundant identifiers** (ID + barcode) for reliability
- ✅ **Works offline** (if artifact is cached)
- ✅ **Printable** - attach to physical artifacts

### Scanning QR Codes

1. **Use Search Page**:
   - Click "Scan QR Code" button
   - Allow camera access
   - Point camera at QR code
   - Automatically navigates to artifact

2. **Mobile Access**:
   - Open camera app
   - Scan QR code
   - Opens artifact page in browser

## Best Practices

### 1. Consistent Barcode Format

**Recommended**: Use the auto-generated barcode format:
- Format: `A{timestamp}{random}{index}`
- Example: `A926092035QWD0001`
- Unique and readable

**Or provide your own**:
- Must be unique
- Alphanumeric
- At least 8 characters

### 2. Complete Artifact Information

Fill out all fields for better organization:
- ✅ Name and description
- ✅ Location and date found
- ✅ Dimensions (if applicable)
- ✅ Images (highly recommended)
- ✅ Catalog assignment

### 3. Verify Before Printing QR Codes

1. **Create artifact**
2. **Check QR code** in modal
3. **Test the URL** by clicking "View Artifact"
4. **Verify all information** is correct
5. **Then print** the QR code

### 4. Keep Artifact IDs Stable

**Don't:**
- ❌ Delete and recreate artifacts (creates new IDs)
- ❌ Modify artifact IDs manually
- ❌ Use temporary/test data for production

**Do:**
- ✅ Create artifacts once with correct information
- ✅ Edit existing artifacts if needed (keeps same ID)
- ✅ Use barcode for physical labeling

## Troubleshooting

### QR Code Not Working

**Problem**: QR code doesn't navigate to artifact

**Solutions**:
1. Verify artifact was saved successfully
2. Check that artifact ID exists in database
3. Try accessing URL directly in browser
4. Verify frontend URL matches QR code URL

### URL Changes After Restart

**Problem**: Artifact URL changes after service restart

**This shouldn't happen with PostgreSQL!** If it does:
1. Verify `DATABASE_URL` is set correctly
2. Check logs show "Using PostgreSQL database"
3. Verify artifact is in database (not just local storage)
4. Check artifact ID is the same in database

### Artifact Not Found

**Problem**: QR code scans but artifact not found

**Solutions**:
1. Verify artifact exists in database
2. Check artifact ID matches URL
3. Try accessing by barcode: `/artifact/by-barcode/{barcode}`
4. Check database connection is working

### Images Not Showing

**Problem**: Artifact saved but images missing

**Solutions**:
1. Verify images were uploaded before saving
2. Check image size (very large images might fail)
3. Verify database has `images2D` field populated
4. Re-upload images if needed

## Example Workflow

### Complete Artifact Creation

1. **Login** as admin/archaeologist
2. **Navigate** to `/add-artifact`
3. **Fill form**:
   - Name: "Ancient Pottery Fragment"
   - Catalog: Select existing catalog
   - Details: "Well-preserved fragment from Bronze Age"
   - Location: "Excavation Site Alpha"
   - Date: "2024-01-15"
   - Upload 2-3 images
4. **Save** artifact
5. **QR Code appears** automatically
6. **Copy/Print** QR code
7. **Test** by scanning QR code
8. **Verify** artifact persists after restart

## API Endpoints

Artifacts are created via:
```
POST /api/artifacts
```

With authentication headers:
```
x-user-role: admin (or archaeologist)
```

Artifacts are retrieved via:
```
GET /api/artifacts/{id}
GET /api/artifacts/by-barcode/{barcode}
```

## Summary

✅ **Artifacts are persistent** - stored in PostgreSQL
✅ **URLs are stable** - artifact ID never changes
✅ **QR codes work** - contain permanent URLs
✅ **Barcodes are unique** - can be used for physical labeling
✅ **Images are stored** - as base64 in database
✅ **Data survives restarts** - PostgreSQL is persistent

Your artifacts, images, and descriptions are now permanently stored and accessible via consistent URLs and QR codes!

