// Privacy detection for Facebook and TikTok posts

import { Page } from 'puppeteer';
import { logger } from '../utils/logger';

export async function detectPrivacy(page: Page): Promise<boolean> {
    try {
        const isPrivate = await page.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();

            // Check for privacy indicators
            const privacyKeywords = [
                'only you',
                'friends only',
                'private',
                'chỉ mình bạn',
                'bạn bè',
                'riêng tư',
                'this content isn\'t available',
                'nội dung này không khả dụng',
                'this page isn\'t available',
                'trang này không khả dụng',
                'you can\'t see this content',
                'bạn không thể xem nội dung này'
            ];

            return privacyKeywords.some(keyword => bodyText.includes(keyword));
        });

        if (isPrivate) {
            logger.info('Privacy detected on page');
        }

        return isPrivate;
    } catch (error) {
        logger.warn('Error during privacy detection', error);
        return false;
    }
}

export async function getPageContent(page: Page): Promise<string> {
    try {
        const content = await page.evaluate(() => {
            return document.body.innerText || '';
        });
        return content;
    } catch (error) {
        logger.error('Error getting page content', error);
        return '';
    }
}
