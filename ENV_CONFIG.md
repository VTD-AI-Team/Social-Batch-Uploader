# Environment Configuration

## Screenshot Storage Configuration

This file contains environment variables for configuring the screenshot storage location.

### For Local Development

Create a `.env.local` file in the root directory:

```env
# Local storage (default)
SCREENSHOT_STORAGE_PATH=public/screenshots
SCREENSHOT_PUBLIC_URL=/screenshots
```

### For Shared Drive / Network Storage

Update `.env.local` or `.env.production`:

```env
# Windows Network Drive (UNC Path)
SCREENSHOT_STORAGE_PATH=\\\\SERVER\\ShareFolder\\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\SERVER\\ShareFolder\\Screenshots

# Or mapped drive
SCREENSHOT_STORAGE_PATH=Z:\\Screenshots
SCREENSHOT_PUBLIC_URL=Z:\\Screenshots
```

### For Cloud Storage (Future)

```env
# Azure Blob Storage
SCREENSHOT_STORAGE_PATH=/mnt/azure/screenshots
SCREENSHOT_PUBLIC_URL=https://youraccount.blob.core.windows.net/screenshots

# AWS S3
SCREENSHOT_STORAGE_PATH=/mnt/s3/screenshots
SCREENSHOT_PUBLIC_URL=https://your-bucket.s3.amazonaws.com/screenshots
```

## Setup Instructions

### 1. For Shared Network Drive

**Step 1**: Create shared folder on network server
```
\\\\YOUR-SERVER\\ShareFolder\\Screenshots
```

**Step 2**: Grant permissions
- Read/Write access for the application service account
- Read access for all users who need to view screenshots

**Step 3**: Update `.env.local`
```env
SCREENSHOT_STORAGE_PATH=\\\\YOUR-SERVER\\ShareFolder\\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\YOUR-SERVER\\ShareFolder\\Screenshots
```

**Step 4**: Restart the application
```bash
npm run dev
# or for production
pm2 restart all
```

### 2. For Mapped Network Drive

**Step 1**: Map network drive (e.g., Z:)
```cmd
net use Z: \\\\YOUR-SERVER\\ShareFolder /persistent:yes
```

**Step 2**: Create Screenshots folder
```cmd
mkdir Z:\\Screenshots
```

**Step 3**: Update `.env.local`
```env
SCREENSHOT_STORAGE_PATH=Z:\\Screenshots
SCREENSHOT_PUBLIC_URL=Z:\\Screenshots
```

**Step 4**: Restart the application

## Testing

### Test Screenshot Storage

1. Run the application
2. Upload a test Excel file with 1-2 URLs
3. Process the batch
4. Check if screenshots are saved to the configured path
5. Verify Excel file contains correct screenshot URLs
6. Test opening screenshot URLs from Excel

### Verify Shared Access

1. Open Excel file on another computer
2. Click screenshot URLs
3. Verify images open correctly
4. If using UNC path, ensure network access is available

## Troubleshooting

### Issue: "Access Denied" when saving screenshots

**Solution**:
- Check folder permissions
- Ensure service account has write access
- Try running application as administrator (temporarily)

### Issue: Screenshots saved but URLs don't work

**Solution**:
- Verify `SCREENSHOT_PUBLIC_URL` matches actual path
- Check if network drive is accessible from other computers
- Test UNC path manually: `\\\\SERVER\\ShareFolder\\Screenshots`

### Issue: "Path not found"

**Solution**:
- Verify network drive is connected
- Check if server is online
- Test path in File Explorer first
- Use UNC path instead of mapped drive for better reliability

## Current Configuration

Default settings (if no .env file):
- **Storage Path**: `public/screenshots` (local)
- **Public URL**: `/screenshots` (HTTP)
- **Image Format**: PNG
- **Image Quality**: 100
- **Min File Size**: 1KB

## Best Practices

1. **Use UNC paths** for network drives (more reliable than mapped drives)
2. **Test permissions** before production deployment
3. **Backup screenshots** regularly
4. **Monitor disk space** on shared drive
5. **Use descriptive folder names** (e.g., `Screenshots_2024`)
6. **Set up automatic cleanup** for old screenshots if needed

## Example Configurations

### Small Team (Local Network)
```env
SCREENSHOT_STORAGE_PATH=\\\\OFFICE-SERVER\\Shared\\FB-TikTok-Screenshots
SCREENSHOT_PUBLIC_URL=\\\\OFFICE-SERVER\\Shared\\FB-TikTok-Screenshots
```

### Enterprise (Dedicated File Server)
```env
SCREENSHOT_STORAGE_PATH=\\\\FILESERVER01\\Marketing\\SocialMedia\\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\FILESERVER01\\Marketing\\SocialMedia\\Screenshots
```

### Development (Local)
```env
SCREENSHOT_STORAGE_PATH=public/screenshots
SCREENSHOT_PUBLIC_URL=/screenshots
```
