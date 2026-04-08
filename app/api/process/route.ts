// API route for batch processing with background jobs (replaces SSE)

import { NextRequest, NextResponse } from 'next/server';
import { Shop } from '@/types';
import { BatchProcessor } from '@/lib/batch/processor';
import { generateExcelOutput } from '@/lib/excel/generator';
import { logger } from '@/lib/utils/logger';
import { jobManager } from '@/lib/jobs/job-manager';
import { SCREENSHOT_CONFIG } from '@/lib/utils/screenshot-config';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const shops: Shop[] = body.shops;

        if (!shops || shops.length === 0) {
            return NextResponse.json(
                { error: 'No shops provided' },
                { status: 400 }
            );
        }

        // Use SCREENSHOT_STORAGE_PATH from config (respects env var)
        const screenshotsDir = SCREENSHOT_CONFIG.STORAGE_PATH;
        
        // Create screenshots directory if not exists
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        // Create job and return job ID immediately
        const jobId = jobManager.createJob(shops);

        // Start background processing (don't await)
        processInBackground(jobId, shops, screenshotsDir);

        // Return job ID immediately so user can poll for status
        return NextResponse.json({ jobId });

    } catch (error) {
        logger.error('Process API error', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Process failed' },
            { status: 500 }
        );
    }
}

// Background processing function
async function processInBackground(jobId: string, shops: Shop[], screenshotsDir: string) {
    try {
        // Update job status to processing
        jobManager.updateJob(jobId, { status: 'processing' });

        // Create batch processor with progress callback
        const processor = new BatchProcessor((status) => {
            // Update job progress
            jobManager.updateProgress(jobId, status);
        });

        // Process all shops
        const results = await processor.processShops(shops);

        // Generate Excel output
        logger.info('Generating Excel output');
        const excelBuffer = await generateExcelOutput(results);

        // Save Excel file
        const timestamp = Date.now();
        const outputFilename = `results_${timestamp}.xlsx`;
        const outputPath = path.join(screenshotsDir, outputFilename);
        fs.writeFileSync(outputPath, excelBuffer);

        logger.info(`Excel file saved: ${outputFilename}`);

        // Update job as completed - use correct download URL
        const downloadUrl = `/api/download?file=${encodeURIComponent(outputFilename)}&path=${encodeURIComponent(screenshotsDir)}`;
        jobManager.updateJob(jobId, {
            status: 'completed',
            downloadUrl: downloadUrl
        });

    } catch (error) {
        logger.error('Background processing error', error);
        jobManager.updateJob(jobId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Processing failed'
        });
    }
}
