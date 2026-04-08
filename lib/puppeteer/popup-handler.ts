// Popup handler for aggressive popup removal

import { Page } from 'puppeteer';
import { logger } from '../utils/logger';

export async function removePopups(page: Page): Promise<void> {
    try {
        // Press ESC key to close any modal dialogs
        await page.keyboard.press('Escape');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Hide common popup/overlay selectors with surgical removal
        await page.evaluate(() => {
            // Mobile-optimized selectors
            const blockers = [
                '[role="dialog"]',
                '[aria-modal="true"]',
                'div[id*="login_popup"]',
                'div[data-sigil="m_login_upsell"]',  // Mobile FB login upsell
                '#mobile_login_bar',                  // Mobile login bar
                '.yi40',                              // FB mobile class
                'div[class*="upsell"]',
                '.fb-modal',
                '.modal',
                '.popup',
                '[class*="overlay"]',
                '[class*="Modal"]',
                '[class*="dialog"]'
            ];

            blockers.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    const text = (el as HTMLElement).innerText?.toLowerCase() || '';
                    // Only remove if contains login-related text (surgical removal)
                    if (text.includes('log in') ||
                        text.includes('get the full experience') ||
                        text.includes('đăng nhập') ||
                        text.includes('create new account') ||
                        text.includes('tạo tài khoản') ||
                        selector.includes('login') ||
                        selector.includes('upsell')) {
                        (el as HTMLElement).remove();
                        console.log('[POPUP] Removed:', selector);
                    } else {
                        // Hide non-login popups
                        (el as HTMLElement).style.display = 'none';
                    }
                });
            });

            // CRITICAL: Unlock scroll (popup often locks page)
            document.body.style.overflow = 'auto !important';
            document.body.style.position = 'static !important';
            document.documentElement.style.overflow = 'auto !important';
        });

        // Click close buttons if any
        const closeButtonSelectors = [
            '[aria-label="Close"]',
            '[aria-label="Đóng"]',
            'button[class*="close"]',
            'button[class*="Close"]'
        ];

        for (const selector of closeButtonSelectors) {
            try {
                const closeBtn = await page.$(selector);
                if (closeBtn) {
                    await closeBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            } catch (e) {
                // Ignore if click fails
            }
        }

        logger.debug('Popup removal completed');
    } catch (error) {
        logger.warn('Error during popup removal', error);
    }
}

export async function expandContent(page: Page): Promise<void> {
    try {
        logger.debug('Starting content expansion...');

        // Step 1: Click "See more" / "Xem thêm" buttons using multiple strategies

        // Strategy 1: Direct selector-based clicks
        const seeMoreSelectors = [
            'div[role="button"]',  // All role=button divs
            '[class*="see-more"]',
            '[class*="SeeMore"]',
            '[class*="seemore"]'
        ];

        for (const selector of seeMoreSelectors) {
            try {
                await page.evaluate((sel) => {
                    const elements = Array.from(document.querySelectorAll(sel));
                    elements.forEach(el => {
                        const text = el.textContent?.toLowerCase() || '';
                        // Check if element contains "see more" or "xem thêm"
                        if (text.includes('see more') || text.includes('xem thêm')) {
                            if (el && el instanceof HTMLElement) {
                                el.click();
                                console.log('[EXPAND] Clicked See More button via selector:', sel);
                            }
                        }
                    });
                }, selector);
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (e) {
                // Continue if selector not found
            }
        }

        // Strategy 2: Text content walker (more reliable)
        logger.debug('Using text walker to find See More...');
        await page.evaluate(() => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );

            const textNodes: Node[] = [];
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent?.trim().toLowerCase() || '';
                if (text === 'see more' || text === 'xem thêm') {
                    textNodes.push(node);
                }
            }

            console.log('[EXPAND] Found', textNodes.length, 'See More text nodes');

            textNodes.forEach(textNode => {
                // Traverse up to find clickable parent
                let parent = textNode.parentElement;
                let depth = 0;
                while (parent && parent !== document.body && depth < 5) {
                    if (parent.getAttribute('role') === 'button' ||
                        parent.tagName === 'BUTTON' ||
                        parent.onclick !== null ||
                        parent.getAttribute('tabindex') === '0') {
                        parent.click();
                        console.log('[EXPAND] Clicked See More via text walker');
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
            });
        });

        // Wait longer for content to expand
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Strategy 3: Try clicking again in case content loaded dynamically
        logger.debug('Second pass for See More buttons...');
        await page.evaluate(() => {
            const allButtons = Array.from(document.querySelectorAll('div[role="button"]'));
            allButtons.forEach(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                if (text.includes('see more') || text.includes('xem thêm')) {
                    (btn as HTMLElement).click();
                    console.log('[EXPAND] Clicked See More in second pass');
                }
            });
        });

        // Final wait for all content to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        logger.debug('Content expansion completed');
    } catch (error) {
        logger.warn('Error during content expansion', error);
    }
}
