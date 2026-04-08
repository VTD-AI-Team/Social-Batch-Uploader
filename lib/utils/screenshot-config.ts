// Configuration for screenshot storage

export const SCREENSHOT_CONFIG = {
    // Shared drive path - Update this to your network drive
    // Example: '\\\\SERVER\\ShareFolder\\Screenshots'
    // For local testing: 'public/screenshots'
    STORAGE_PATH: process.env.SCREENSHOT_STORAGE_PATH || 'public/screenshots',

    // Public URL base for accessing screenshots
    // Example: 'https://yourserver.com/screenshots' or '\\\\SERVER\\ShareFolder\\Screenshots'
    // For local development: Use full URL so Excel hyperlinks work
    PUBLIC_URL_BASE: process.env.SCREENSHOT_PUBLIC_URL || 'http://localhost:3000/screenshots',

    // Image format - Changed to JPEG for 5x faster processing
    IMAGE_FORMAT: 'jpeg' as const,
    JPEG_QUALITY: 85,       // JPEG quality (85 = good balance: sharp text, small file)
    IMAGE_QUALITY: 100,     // PNG quality (kept for reference)

    // File validation
    MIN_FILE_SIZE: 1024,    // 1KB minimum

    // Filename pattern
    FILENAME_PREFIX: 'screenshot',
    FILENAME_SUFFIX_LENGTH: 6,
};

/**
 * Get the full storage path for a screenshot
 * @param filename Screenshot filename
 * @returns Full path where screenshot will be saved
 */
export function getStoragePath(filename: string): string {
    return `${SCREENSHOT_CONFIG.STORAGE_PATH}/${filename}`;
}

/**
 * Get the public URL for a screenshot
 * @param filename Screenshot filename  
 * @returns Public URL that can be shared
 */
export function getPublicUrl(filename: string): string {
    // DEBUG: Log configuration
    console.log('[DEBUG] getPublicUrl called');
    console.log('[DEBUG] - filename:', filename);
    console.log('[DEBUG] - PUBLIC_URL_BASE:', SCREENSHOT_CONFIG.PUBLIC_URL_BASE);

    // If using SharePoint HTTPS URL, return direct SharePoint link
    if (SCREENSHOT_CONFIG.PUBLIC_URL_BASE.startsWith('https://')) {
        const url = `${SCREENSHOT_CONFIG.PUBLIC_URL_BASE}/${filename}`;
        console.log('[DEBUG] - SharePoint URL:', url);
        return url;
    }

    // If using UNC path (\\server\share), convert to file:// protocol for Excel compatibility
    if (SCREENSHOT_CONFIG.PUBLIC_URL_BASE.startsWith('\\\\')) {
        // Convert UNC path to file:// protocol
        // From: \\192.168.14.204\Screenshots
        // To: file://192.168.14.204/Screenshots
        const uncPath = SCREENSHOT_CONFIG.PUBLIC_URL_BASE.replace(/\\/g, '/').substring(2);
        const url = `file://${uncPath}/${filename}`;
        console.log('[DEBUG] - file:// URL:', url);
        return url;
    }

    // Otherwise return HTTP URL
    const url = `${SCREENSHOT_CONFIG.PUBLIC_URL_BASE}/${filename}`;
    console.log('[DEBUG] - HTTP URL:', url);
    return url;
}

/**
 * Validate screenshot file
 * @param filePath Path to screenshot file
 * @param fileSize Size of file in bytes
 * @returns true if valid
 */
export function validateScreenshot(filePath: string, fileSize: number): boolean {
    // Check file size
    if (fileSize < SCREENSHOT_CONFIG.MIN_FILE_SIZE) {
        return false;
    }

    // Check file extension
    if (!filePath.toLowerCase().endsWith(`.${SCREENSHOT_CONFIG.IMAGE_FORMAT}`)) {
        return false;
    }

    return true;
}
