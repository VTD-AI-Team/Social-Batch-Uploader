// API route for downloading Excel result files
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('file');

        if (!filename) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // Security: prevent path traversal
        const safeFilename = path.basename(filename);
        const filePath = path.join(process.cwd(), 'public', 'screenshots', safeFilename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Read file asynchronously (non-blocking)
        const fileBuffer = await fs.promises.readFile(filePath);

        // Return file with proper headers
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${safeFilename}"`,
                'Content-Length': fileBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Download failed' },
            { status: 500 }
        );
    }
}
