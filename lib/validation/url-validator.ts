// URL duplicate detection within shops

import { logger } from '../utils/logger';

export function detectDuplicates(urls: string[]): Set<string> {
    const duplicates = new Set<string>();
    const seen = new Set<string>();

    // Normalize URLs for comparison
    const normalizedUrls = urls.map(url => normalizeUrl(url));

    normalizedUrls.forEach((url, index) => {
        if (url && seen.has(url)) {
            duplicates.add(urls[index]); // Store original URL
            logger.warn(`Duplicate URL detected: ${urls[index]}`);
        }
        if (url) {
            seen.add(url);
        }
    });

    return duplicates;
}

function normalizeUrl(url: string): string {
    if (!url) return '';

    try {
        // Remove trailing slashes, query parameters, and fragments for comparison
        const urlObj = new URL(url);
        return urlObj.origin + urlObj.pathname.replace(/\/$/, '');
    } catch (error) {
        // If URL parsing fails, return as-is
        return url.trim().toLowerCase();
    }
}

export function isDuplicateUrl(url: string, duplicateSet: Set<string>): boolean {
    return duplicateSet.has(url);
}
