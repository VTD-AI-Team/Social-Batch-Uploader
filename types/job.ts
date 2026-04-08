// Job types for background processing

export interface Job {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: {
        totalShops: number;
        processedShops: number;
        successfulScreenshots: number;
        failedScreenshots: number;
        currentShop?: string;
    };
    downloadUrl?: string;
    error?: string;
    createdAt: number;
    updatedAt: number;
}

export interface JobCreateRequest {
    shops: any[];
}

export interface JobCreateResponse {
    jobId: string;
}

export interface JobStatusResponse extends Job { }
