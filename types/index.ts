// Type definitions for the batch upload system

export interface Shop {
    maNPP: string;
    postUrls: string[]; // 8 URLs
}

export interface ScreenshotResult {
    success: boolean;
    filePath?: string;
    fileSize?: number;
    error?: ScreenshotError;
    attempts: number;
    duration?: number;
}

export interface ScreenshotError {
    type: ErrorType;
    message: string;
    url: string;
}

export enum ErrorType {
    TIMEOUT = 'timeout',
    NETWORK = 'network',
    INVALID_LINK = 'invalid',
    SCREENSHOT_FAILURE = 'screenshot',
    PRIVACY = 'privacy'
}

export interface ValidationResult {
    isValid: boolean;
    missingHashtags: string[];
    isDuplicate: boolean;
    isPrivate: boolean;
    status: ValidationStatus;
}

export enum ValidationStatus {
    COMPLETE = '✅ Đầy đủ',
    MISSING_HASHTAGS = '❌ Thiếu hashtag',
    PRIVATE = '🔒 Riêng tư',
    DUPLICATE = '🚫 Link trùng',
    ERROR = '⚠️ Lỗi'
}

export interface ProcessingResult {
    shop: Shop;
    screenshots: (string | null)[]; // 8 screenshot URLs or null
    validationResults: ValidationResult[];
    errors: ScreenshotError[];
    processingTime: number;
}

export interface BatchStatus {
    totalShops: number;
    processedShops: number;
    successfulScreenshots: number;
    failedScreenshots: number;
    currentShop?: string;
    progress: number; // 0-100
    startTime?: number;
    estimatedTimeRemaining?: number;
}

export interface ExcelRow {
    maNPP: string;
    post1?: string;
    post2?: string;
    post3?: string;
    post4?: string;
    post5?: string;
    post6?: string;
    post7?: string;
    post8?: string;
    screenshot1?: string;
    screenshot2?: string;
    screenshot3?: string;
    screenshot4?: string;
    screenshot5?: string;
    screenshot6?: string;
    screenshot7?: string;
    screenshot8?: string;
    notes?: string;
}

export const MANDATORY_HASHTAGS = [
    '#ColosBabyGoldcaitien',
    '#DHA',
    '#DamwheyMCT',
    '#Vithanhnhat'
] as const;

export interface RetryConfig {
    maxRetries: number;
    delays: number[]; // [2000, 4000, 8000] for exponential backoff
}

export interface PuppeteerConfig {
    viewport: {
        width: number;
        height: number;
    };
    timeout: number;
    userAgent: string;
}
