// API route for downloading Excel template

import { NextResponse } from 'next/server';
import { generateTemplate } from '@/lib/excel/template';
import { logger } from '@/lib/utils/logger';

export async function GET() {
    try {
        logger.info('Generating Excel template');

        const buffer = await generateTemplate();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="template.xlsx"'
            }
        });

    } catch (error) {
        logger.error('Template generation error', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Template generation failed' },
            { status: 500 }
        );
    }
}
