'use client';

import { useState, useEffect } from 'react';
import UploadZone from '@/components/upload-zone';
import ProgressTracker from '@/components/progress-tracker';
import ResultDisplay from '@/components/result-display';
import { Shop, BatchStatus } from '@/types';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<BatchStatus | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleUpload = async (file: File) => {
    try {
      setError('');
      setIsProcessing(true);
      setDownloadUrl(null);
      setStatus(null);

      // Step 1: Upload and parse Excel file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      const shops: Shop[] = uploadData.shops;

      // Step 2: Start background processing and get job ID
      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shops })
      });

      if (!processResponse.ok) {
        throw new Error('Processing failed');
      }

      const { jobId } = await processResponse.json();

      // Step 3: Poll for status updates every 2 seconds
      const pollInterval = setInterval(async () => {

        try {
          const statusResponse = await fetch(`/api/status?jobId=${jobId}`);

          if (!statusResponse.ok) {
            throw new Error('Status check failed');
          }

          const job = await statusResponse.json();

          // Update progress
          if (job.progress) {
            setStatus({
              totalShops: job.progress.totalShops,
              processedShops: job.progress.processedShops,
              successfulScreenshots: job.progress.successfulScreenshots,
              failedScreenshots: job.progress.failedScreenshots,
              currentShop: job.progress.currentShop,
              progress: job.progress.processedShops / job.progress.totalShops
            });
          }

          // Check if completed
          if (job.status === 'completed') {
            clearInterval(pollInterval);
            setDownloadUrl(job.downloadUrl);
            setIsProcessing(false);
          } else if (job.status === 'failed') {
            clearInterval(pollInterval);
            setError(job.error || 'Processing failed');
            setIsProcessing(false);
          }
        } catch (err) {
          console.error('Polling error:', err);
          // Continue polling even if one request fails
        }
      }, 2000); // Poll every 2 seconds

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  // Warn user if they switch tabs during processing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isProcessing) {
        // Show non-blocking warning
        console.warn('⚠️ Tab inactive - connection may be affected');
        // Optional: Could show toast notification here
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isProcessing]);

  const handleReset = () => {
    setIsProcessing(false);
    setStatus(null);
    setDownloadUrl(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Facebook/TikTok Batch Uploader
          </h1>
          <p className="text-gray-600 text-lg">
            Hệ thống xử lý hàng loạt screenshot và kiểm tra hashtag tự động
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Lên đến 200 shops/batch
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              8 posts/shop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              95-99% success rate
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Lỗi</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Active Warning */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-800">⚠️ Quan trọng!</h3>
                <p className="text-yellow-700 text-sm">
                  Giữ tab này luôn hiển thị trong lúc xử lý. Hệ thống đang gửi heartbeat mỗi 5 giây để duy trì kết nối.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        {!downloadUrl && (
          <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />
        )}

        {/* Progress Tracker */}
        <ProgressTracker status={status} isProcessing={isProcessing} />

        {/* Result Display */}
        <ResultDisplay downloadUrl={downloadUrl} onReset={handleReset} />

        {/* Features Section */}
        {!isProcessing && !downloadUrl && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              ✨ Tính năng
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Screenshot tự động</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• iPhone mobile viewport (375x812)</li>
                  <li>• Timeout 60 giây</li>
                  <li>• Retry 3 lần với exponential backoff</li>
                  <li>• Xóa popup và mở rộng nội dung</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Kiểm tra hashtag</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• #ColosBabyGoldcaitien</li>
                  <li>• #DHA</li>
                  <li>• #DamwheyMCT</li>
                  <li>• #Vithanhnhat</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Phát hiện lỗi</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Phát hiện link trùng</li>
                  <li>• Phát hiện bài riêng tư</li>
                  <li>• Phân loại lỗi: timeout, network, invalid</li>
                  <li>• Kiểm tra file screenshot &gt;1KB</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Excel output</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 18 cột với đầy đủ thông tin</li>
                  <li>• Hyperlink đến screenshots</li>
                  <li>• Trạng thái validation chi tiết</li>
                  <li>• Tự động download khi hoàn thành</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Truong Thanh Tung - AI Team</p>
        </div>
      </div>
    </main>
  );
}
