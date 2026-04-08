// API route for checking job status

import { NextRequest, NextResponse } from 'next/server';
import { jobManager } from '@/lib/jobs/job-manager';

export async function GET(request: NextRequest) {
    try {
        const jobId = request.nextUrl.searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json(
                { error: 'No jobId provided' },
                { status: 400 }
            );
        }

        const job = jobManager.getJob(jobId);

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(job);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Status check failed' },
            { status: 500 }
        );
    }
}
