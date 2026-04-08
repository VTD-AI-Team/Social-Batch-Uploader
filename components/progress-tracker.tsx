'use client';

import { BatchStatus } from '@/types';

interface ProgressTrackerProps {
    status: BatchStatus | null;
    isProcessing: boolean;
}

export default function ProgressTracker({ status, isProcessing }: ProgressTrackerProps) {
    if (!isProcessing || !status) return null;

    const formatTime = (seconds: number | undefined): string => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const successRate = status.successfulScreenshots + status.failedScreenshots > 0
        ? Math.round((status.successfulScreenshots / (status.successfulScreenshots + status.failedScreenshots)) * 100)
        : 0;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                🚀 Đang xử lý...
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Tiến độ: {status.processedShops}/{status.totalShops} shops
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                        {status.progress}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
                        style={{ width: `${status.progress}%` }}
                    >
                        {status.progress > 10 && (
                            <span className="text-xs text-white font-bold">
                                {status.progress}%
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Shop */}
            {status.currentShop && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Đang xử lý:</p>
                    <p className="font-semibold text-blue-700">{status.currentShop}</p>
                </div>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Screenshots thành công</p>
                    <p className="text-3xl font-bold text-green-600">
                        {status.successfulScreenshots}
                    </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Screenshots thất bại</p>
                    <p className="text-3xl font-bold text-red-600">
                        {status.failedScreenshots}
                    </p>
                </div>
            </div>

            {/* Success Rate */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Tỷ lệ thành công:
                    </span>
                    <span className={`text-2xl font-bold ${successRate >= 95 ? 'text-green-600' : successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {successRate}%
                    </span>
                </div>
                <div className="mt-2 w-full bg-gray-300 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${successRate >= 95 ? 'bg-green-500' : successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${successRate}%` }}
                    />
                </div>
            </div>

            {/* Estimated Time */}
            {status.estimatedTimeRemaining !== undefined && status.estimatedTimeRemaining > 0 && (
                <div className="text-center text-sm text-gray-600">
                    ⏱️ Thời gian ước tính: ~{formatTime(status.estimatedTimeRemaining)}
                </div>
            )}

            {/* Processing Note */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                💡 <strong>Lưu ý:</strong> Quá trình xử lý có thể mất vài phút. Vui lòng không đóng trang này.
            </div>
        </div>
    );
}
