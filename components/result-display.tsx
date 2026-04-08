'use client';

import { useEffect } from 'react';

interface ResultDisplayProps {
    downloadUrl: string | null;
    onReset: () => void;
}

export default function ResultDisplay({ downloadUrl, onReset }: ResultDisplayProps) {
    useEffect(() => {
        // Auto-download when URL becomes available
        if (downloadUrl) {
            // Small delay to ensure UI updates first
            const timer = setTimeout(() => {
                handleDownload();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [downloadUrl]);

    if (!downloadUrl) return null;

    const handleDownload = () => {
        try {
            // Use window.location to trigger server-side download
            window.location.href = downloadUrl;
        } catch (error) {
            console.error('Download error:', error);
            // Fallback: open in new window
            window.open(downloadUrl, '_blank');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border-2 border-green-200">
            <div className="text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        ✅ Hoàn thành!
                    </h2>
                    <p className="text-gray-600">
                        File kết quả đã được tạo thành công
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleDownload}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Tải xuống file Excel kết quả
                    </button>

                    <button
                        onClick={onReset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        🔄 Xử lý batch mới
                    </button>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 text-left">
                    <h3 className="font-semibold text-gray-700 mb-2">📋 Thông tin file:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• File chứa 18 cột: Mã NPP, Mã NV, 8 POST URLs, 8 Screenshot URLs, và Ghi chú</li>
                        <li>• Screenshots được lưu trong thư mục <code className="bg-gray-100 px-1 rounded">public/screenshots/</code></li>
                        <li>• Cột Ghi chú hiển thị trạng thái: ✅ Đầy đủ, ❌ Thiếu hashtag, 🔒 Riêng tư, 🚫 Link trùng</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
