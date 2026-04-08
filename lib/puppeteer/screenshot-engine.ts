// Core screenshot engine with Puppeteer

import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { ScreenshotResult, ErrorType, ScreenshotError, PuppeteerConfig } from '@/types';
import { logger } from '../utils/logger';
import { removePopups, expandContent } from './popup-handler';
import { detectPrivacy, getPageContent } from './privacy-detector';
import { SCREENSHOT_CONFIG, validateScreenshot } from '../utils/screenshot-config';

const PUPPETEER_CONFIG: PuppeteerConfig = {
    viewport: {
        width: 375,   // iPhone 12 width
        height: 812   // iPhone 12 height
    },
    timeout: 120000, // 120 seconds - Increased for difficult pages
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'  // Mobile Safari
};

let browserInstance: Browser | null = null;
let screenshotCount = 0;
const MAX_SCREENSHOTS_BEFORE_RESTART = 800; // Restart browser every 100 shops (100 × 8 posts)

export async function getBrowser(): Promise<Browser> {
    // Restart browser if screenshot count exceeds limit (prevent memory leaks)
    if (browserInstance && screenshotCount >= MAX_SCREENSHOTS_BEFORE_RESTART) {
        logger.info(`Restarting browser after ${screenshotCount} screenshots to prevent memory leaks`);
        await closeBrowser();
        screenshotCount = 0;
    }

    if (!browserInstance || !browserInstance.connected) {
        logger.info('Launching new browser instance');
        browserInstance = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=375,812'  // iPhone 12 window size
            ]
        });
    }
    return browserInstance;
}

export async function closeBrowser(): Promise<void> {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
        logger.info('Browser closed');
    }
}

// Load Facebook cookies for authentication (bypass login popup)
async function loadCookies(page: Page): Promise<void> {
    try {
        const cookiePath = path.join(process.cwd(), 'fb-cookies.json');
        if (fs.existsSync(cookiePath)) {
            const cookiesString = await fs.promises.readFile(cookiePath, 'utf8');
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
            logger.info('✓ Facebook cookies loaded successfully');
        } else {
            logger.warn('⚠ No fb-cookies.json found - may encounter login popups');
            logger.warn('  To fix: Save Facebook cookies to fb-cookies.json in project root');
        }
    } catch (e) {
        logger.warn('⚠ Failed to load cookies:', e);
    }
}

// Verify page has actual content before screenshot (prevent blank screenshots)
async function verifyPageContent(page: Page): Promise<void> {
    try {
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.length < 200) {
            logger.warn(`Page content too short: ${bodyText.length} chars`);
            throw new Error('Empty page detected (content < 200 chars)');
        }
        logger.debug(`✓ Page content verified (${bodyText.length} chars)`);
    } catch (e) {
        logger.error('Failed to verify page content:', e);
        throw e;
    }
}


export async function captureScreenshot(
    url: string,
    outputPath: string,
    maxRetries: number = 5
): Promise<ScreenshotResult> {
    const delays = [3000, 6000, 12000, 24000, 48000]; // Exponential backoff - More aggressive
    let lastError: ScreenshotError | undefined;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.info(`Screenshot attempt ${attempt}/${maxRetries} for ${url}`);

            const result = await takeScreenshot(url, outputPath);

            if (result.success) {
                return {
                    ...result,
                    attempts: attempt,
                    duration: Date.now() - startTime
                };
            }

            lastError = result.error;

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = delays[attempt - 1];
                logger.info(`Waiting ${delay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            lastError = {
                type: ErrorType.SCREENSHOT_FAILURE,
                message: error instanceof Error ? error.message : 'Unknown error',
                url
            };
            logger.error(`Screenshot attempt ${attempt} failed`, error);
        }
    }

    return {
        success: false,
        error: lastError,
        attempts: maxRetries,
        duration: Date.now() - startTime
    };
}

async function takeScreenshot(url: string, outputPath: string): Promise<ScreenshotResult> {
    let page: Page | null = null;

    try {
        const browser = await getBrowser();
        page = await browser.newPage();

        // Set viewport to iPhone 12
        await page.setViewport(PUPPETEER_CONFIG.viewport);

        // Set user agent
        await page.setUserAgent(PUPPETEER_CONFIG.userAgent);

        // Load cookies for authentication (bypass Facebook login popup)
        await loadCookies(page);

        // Set timeout
        page.setDefaultTimeout(PUPPETEER_CONFIG.timeout);
        page.setDefaultNavigationTimeout(PUPPETEER_CONFIG.timeout);

        // Navigate to URL
        logger.debug(`Navigating to ${url}`);
        const response = await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: PUPPETEER_CONFIG.timeout
        });

        // ========== ENHANCED: Wait for content to fully load ==========
        logger.debug('Waiting for page content to fully load...');

        // Wait for loading spinner to disappear
        try {
            await page.waitForFunction(() => {
                const spinners = document.querySelectorAll(
                    '[role="progressbar"], ' +
                    '[aria-busy="true"], ' +
                    '.spinner, ' +
                    '.loading'
                );
                return spinners.length === 0;
            }, { timeout: 10000 });
            logger.debug('✓ Loading indicators cleared');
        } catch (e) {
            logger.warn('⚠ Timeout waiting for loading indicators (continuing...)');
        }

        // Wait for article content to appear
        try {
            await page.waitForSelector('article, [role="article"], [data-pagelet]', {
                timeout: 5000,
                visible: true
            });
            logger.debug('✓ Article content found');
        } catch (e) {
            logger.warn('⚠ Article selector not found (may be different page structure)');
        }

        // Wait for text content to load
        try {
            await page.waitForFunction(() => {
                const body = document.body;
                return body && body.textContent && body.textContent.trim().length > 200;
            }, { timeout: 5000 });
            logger.debug('✓ Text content loaded');
        } catch (e) {
            logger.warn('⚠ Minimal text content detected');
        }

        logger.debug('Content loading checks complete');
        // ========== END CRITICAL SECTION ==========

        // Wait a bit for dynamic content
        await new Promise(resolve => setTimeout(resolve, 2000));

        // DISABLED: Privacy check - User wants all screenshots regardless
        // const isPrivate = await detectPrivacy(page);
        // if (isPrivate) {
        //     logger.info('Private post detected');
        //     return {
        //         success: false,
        //         error: {
        //             type: ErrorType.PRIVACY,
        //             message: 'Post is private or unavailable',
        //             url
        //         },
        //         attempts: 1
        //     };
        // }

        // Remove popups
        await removePopups(page);

        // Expand content
        await expandContent(page);

        // Wait longer after expansion for content to fully load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Take screenshot - ALWAYS use full page for consistency
        logger.debug('Taking full page screenshot');

        // Step 1: Scroll to bottom to trigger lazy-loaded images and ensure all content is loaded
        logger.debug('Scrolling to bottom to load all content...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for images to load

        // Step 2: Scroll back to top for clean screenshot
        logger.debug('Scrolling back to top...');
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 3: Final verification before screenshot
        logger.debug('Verifying page content before screenshot...');
        try {
            await verifyPageContent(page);
        } catch (e) {
            logger.error('Page content verification failed:', e);
            throw e;
        }

        // Step 4: Take full page screenshot to capture ALL content
        await page.screenshot({
            path: outputPath,
            type: SCREENSHOT_CONFIG.IMAGE_FORMAT,
            quality: SCREENSHOT_CONFIG.JPEG_QUALITY,  // JPEG quality (85 = good balance)
            fullPage: true,
            omitBackground: false
        });
        logger.debug('Full page screenshot captured successfully');

        // Increment screenshot counter for browser restart tracking
        screenshotCount++;
        logger.debug(`Screenshot count: ${screenshotCount}/${MAX_SCREENSHOTS_BEFORE_RESTART}`);

        // Validate screenshot file
        const stats = fs.statSync(outputPath);
        const fileSize = stats.size;

        // DISABLED: File size validation - Accept all screenshots
        // if (!validateScreenshot(outputPath, fileSize)) {
        //     logger.warn(`Screenshot validation failed: ${fileSize} bytes`);
        //     return {
        //         success: false,
        //         error: {
        //             type: ErrorType.SCREENSHOT_FAILURE,
        //             message: `Screenshot corrupted or invalid format (${fileSize} bytes)`,
        //             url
        //         },
        //         attempts: 1
        //     };
        // }

        logger.info(`Screenshot saved successfully: ${outputPath} (${fileSize} bytes)`);

        return {
            success: true,
            filePath: outputPath,
            fileSize,
            attempts: 1
        };

    } catch (error) {
        logger.error('Screenshot error', error);

        // Categorize error
        let errorType = ErrorType.SCREENSHOT_FAILURE;
        let errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
            errorType = ErrorType.TIMEOUT;
            errorMessage = 'Navigation timeout (>60s)';
        } else if (errorMessage.includes('net::') || errorMessage.includes('Network')) {
            errorType = ErrorType.NETWORK;
            errorMessage = 'Network error';
        }

        return {
            success: false,
            error: {
                type: errorType,
                message: errorMessage,
                url
            },
            attempts: 1
        };
    } finally {
        if (page) {
            await page.close();
        }
    }
}

// Get page content for hashtag validation
export async function getPostContent(url: string): Promise<string | null> {
    let page: Page | null = null;

    try {
        const browser = await getBrowser();
        page = await browser.newPage();

        await page.setViewport(PUPPETEER_CONFIG.viewport);
        await page.setUserAgent(PUPPETEER_CONFIG.userAgent);
        page.setDefaultTimeout(PUPPETEER_CONFIG.timeout);

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: PUPPETEER_CONFIG.timeout
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        await removePopups(page);
        await expandContent(page);

        const content = await getPageContent(page);
        return content;

    } catch (error) {
        logger.error('Error getting post content', error);
        return null;
    } finally {
        if (page) {
            await page.close();
        }
    }
}
