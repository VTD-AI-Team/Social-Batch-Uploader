// Job Manager for background processing
import { Job } from '@/types/job';
import { Shop, BatchStatus } from '@/types';

class JobManager {
    private jobs: Map<string, Job> = new Map();

    createJob(shops: Shop[]): string {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const job: Job = {
            id: jobId,
            status: 'pending',
            progress: {
                totalShops: shops.length,
                processedShops: 0,
                successfulScreenshots: 0,
                failedScreenshots: 0
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.jobs.set(jobId, job);
        return jobId;
    }

    getJob(jobId: string): Job | null {
        return this.jobs.get(jobId) || null;
    }

    updateJob(jobId: string, updates: Partial<Job>) {
        const job = this.jobs.get(jobId);
        if (job) {
            Object.assign(job, updates, { updatedAt: Date.now() });
        }
    }

    updateProgress(jobId: string, batchStatus: BatchStatus) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.progress = {
                totalShops: batchStatus.totalShops,
                processedShops: batchStatus.processedShops,
                successfulScreenshots: batchStatus.successfulScreenshots,
                failedScreenshots: batchStatus.failedScreenshots,
                currentShop: batchStatus.currentShop
            };
            job.updatedAt = Date.now();
        }
    }

    // Clean up old jobs (older than 24 hours)
    cleanup() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        for (const [jobId, job] of this.jobs.entries()) {
            if (job.createdAt < oneDayAgo) {
                this.jobs.delete(jobId);
            }
        }
    }
}

// Singleton instance
export const jobManager = new JobManager();

// Cleanup old jobs every hour
setInterval(() => {
    jobManager.cleanup();
}, 60 * 60 * 1000);
