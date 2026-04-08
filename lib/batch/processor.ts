// Batch processor with parallel processing and memory optimization

import { Shop, ProcessingResult, BatchStatus, ValidationResult, ValidationStatus, ErrorType } from '@/types';
import { captureScreenshot, getPostContent, closeBrowser } from '../puppeteer/screenshot-engine';
import { generateUniqueFilename } from '../utils/filename-generator';
import { getStoragePath, getPublicUrl } from '../utils/screenshot-config';
import { validateHashtags, getHashtagStatus } from '../validation/hashtag-validator';
import { detectDuplicates, isDuplicateUrl } from '../validation/url-validator';
import { logger } from '../utils/logger';
import path from 'path';

// Process screenshots in batches to avoid overwhelming the system
// Reduced from 12 to 6 to prevent Facebook rate limiting
const BATCH_SIZE = 6; // Increased for higher success rate
const MAX_RETRIES = 5; // Increased for higher success rate

export class BatchProcessor {
    private status: BatchStatus;
    private onProgress?: (status: BatchStatus) => void;

    constructor(onProgress?: (status: BatchStatus) => void) {
        this.status = {
            totalShops: 0,
            processedShops: 0,
            successfulScreenshots: 0,
            failedScreenshots: 0,
            progress: 0,
            startTime: Date.now()
        };
        this.onProgress = onProgress;
    }

    async processShops(shops: Shop[]): Promise<ProcessingResult[]> {
        this.status.totalShops = shops.length;
        this.status.startTime = Date.now();

        logger.info(`Starting batch processing for ${shops.length} shops`);

        const results: ProcessingResult[] = [];

        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            this.status.currentShop = `${shop.maNPP}`;

            logger.info(`Processing shop ${i + 1}/${shops.length}: ${this.status.currentShop}`);

            const result = await this.processShop(shop);
            results.push(result);

            this.status.processedShops++;
            this.status.progress = Math.round((this.status.processedShops / this.status.totalShops) * 100);

            // Calculate estimated time remaining
            const elapsed = Date.now() - (this.status.startTime || 0);
            const avgTimePerShop = elapsed / this.status.processedShops;
            const remaining = this.status.totalShops - this.status.processedShops;
            this.status.estimatedTimeRemaining = Math.round((avgTimePerShop * remaining) / 1000); // in seconds

            this.updateProgress();
        }

        // Close browser after all processing
        await closeBrowser();

        logger.info(`Batch processing completed. Success rate: ${this.getSuccessRate()}%`);

        return results;
    }

    private async processShop(shop: Shop): Promise<ProcessingResult> {
        const startTime = Date.now();
        const screenshots: (string | null)[] = [];
        const validationResults: ValidationResult[] = [];
        const errors: any[] = [];

        // Detect duplicates within this shop's URLs
        const duplicateUrls = detectDuplicates(shop.postUrls);

        // Process URLs in batches of BATCH_SIZE
        for (let i = 0; i < shop.postUrls.length; i += BATCH_SIZE) {
            const batch = shop.postUrls.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map((url, index) => this.processPost(url, i + index, duplicateUrls))
            );

            batchResults.forEach((result) => {
                screenshots.push(result.screenshotUrl);
                validationResults.push(result.validation);
                if (result.error) {
                    errors.push(result.error);
                }
            });
        }

        const processingTime = Date.now() - startTime;

        // DEBUG: Log screenshot URLs
        logger.info(`[DEBUG] Shop ${shop.maNPP} - Screenshots collected: ${JSON.stringify(screenshots)}`);

        return {
            shop,
            screenshots,
            validationResults,
            errors,
            processingTime
        };
    }

    private async processPost(
        url: string,
        index: number,
        duplicateUrls: Set<string>
    ): Promise<{
        screenshotUrl: string | null;
        validation: ValidationResult;
        error?: any;
    }> {
        // Check if URL is empty
        if (!url || url.trim() === '') {
            return {
                screenshotUrl: null,
                validation: {
                    isValid: false,
                    missingHashtags: [],
                    isDuplicate: false,
                    isPrivate: false,
                    status: ValidationStatus.ERROR
                }
            };
        }

        const isDuplicate = isDuplicateUrl(url, duplicateUrls);

        // If duplicate, skip screenshot
        if (isDuplicate) {
            logger.warn(`Skipping duplicate URL: ${url}`);
            this.status.failedScreenshots++;
            return {
                screenshotUrl: null,
                validation: {
                    isValid: false,
                    missingHashtags: [],
                    isDuplicate: true,
                    isPrivate: false,
                    status: ValidationStatus.DUPLICATE
                }
            };
        }

        // Generate unique filename
        const filename = generateUniqueFilename(`post_${index + 1}`);
        const fullPath = getStoragePath(filename);
        const publicPath = getPublicUrl(filename);

        // Capture screenshot with retry
        const screenshotResult = await captureScreenshot(url, fullPath, MAX_RETRIES);

        let validation: ValidationResult = {
            isValid: false,
            missingHashtags: [],
            isDuplicate: false,
            isPrivate: false,
            status: ValidationStatus.ERROR
        };

        if (screenshotResult.success) {
            this.status.successfulScreenshots++;

            // Get post content for hashtag validation
            const content = await getPostContent(url);

            if (content) {
                const hashtagValidation = validateHashtags(content);
                validation = {
                    ...hashtagValidation,
                    isDuplicate: false,
                    isPrivate: false,
                    status: getHashtagStatus(hashtagValidation.isValid, false, false, false)
                };
            } else {
                validation.status = ValidationStatus.ERROR;
            }

            return {
                screenshotUrl: publicPath,
                validation
            };
        } else {
            this.status.failedScreenshots++;

            // Check if it's a privacy error
            const isPrivate = screenshotResult.error?.type === ErrorType.PRIVACY;

            validation = {
                isValid: false,
                missingHashtags: [],
                isDuplicate: false,
                isPrivate,
                status: getHashtagStatus(false, isPrivate, false, true)
            };

            return {
                screenshotUrl: null,
                validation,
                error: screenshotResult.error
            };
        }
    }

    private updateProgress(): void {
        if (this.onProgress) {
            this.onProgress({ ...this.status });
        }
    }

    private getSuccessRate(): number {
        const total = this.status.successfulScreenshots + this.status.failedScreenshots;
        if (total === 0) return 0;
        return Math.round((this.status.successfulScreenshots / total) * 100);
    }

    getStatus(): BatchStatus {
        return { ...this.status };
    }
}
