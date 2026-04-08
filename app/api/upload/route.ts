// API route for Excel file upload and parsing

import { NextRequest, NextResponse } from 'next/server';
import { parseExcelFile } from '@/lib/excel/parser';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload an Excel file (.xlsx)' },
                { status: 400 }
            );
        }

        logger.info(`Processing uploaded file: ${file.name}`);

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse Excel file
        const shops = await parseExcelFile(buffer);

        if (shops.length === 0) {
            return NextResponse.json(
                { error: 'No valid shop data found in Excel file' },
                { status: 400 }
            );
        }

        if (shops.length > 200) {
            return NextResponse.json(
                { error: 'Maximum 200 shops per batch. Please reduce the number of shops.' },
                { status: 400 }
            );
        }

        logger.info(`Successfully parsed ${shops.length} shops`);

        return NextResponse.json({
            success: true,
            shopCount: shops.length,
            shops
        });

    } catch (error) {
        logger.error('Upload error', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}
