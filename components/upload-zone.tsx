'use client';

import { useState, useCallback } from 'react';

interface UploadZoneProps {
    onUpload: (file: File) => void;
    isProcessing: boolean;
}

export default function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setError('');

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            validateAndUpload(file);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndUpload(files[0]);
        }
    }, []);

    const validateAndUpload = (file: File) => {
        // Validate file type
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setError('Chỉ hỗ trợ file Excel (.xlsx)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('File quá lớn. Kích thước tối đa 10MB');
            return;
        }

        onUpload(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    disabled={isProcessing}
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>

                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                Click vào đây để chọn file Excel
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Hỗ trợ file .xlsx (tối đa 100 shops, 10MB)
                            </p>
                        </div>
                    </div>
                </label>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {error}
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                <a
                    href="/api/template"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                    📥 Tải file Excel mẫu
                </a>
            </div>
        </div>
    );
}
