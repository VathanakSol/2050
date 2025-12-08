"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RemoveBackgroundPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");
      setProcessedUrl("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Validate file size
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 10MB");
      }

      // Simulate initial progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            return 30;
          }
          return prev + 10;
        });
      }, 500);

      console.log("Loading background removal library...");

      // Dynamic import to avoid SSR issues
      const { removeBackground: removeBg } = await import("@imgly/background-removal");

      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      console.log("Processing image...");

      // Remove background with progress tracking
      const blob = await removeBg(selectedFile, {
        progress: (key, current, total) => {
          const percentage = Math.round((current / total) * 100);
          console.log(`${key}: ${percentage}%`);
          setProgress(percentage);
        },
      });

      console.log("Background removed successfully");
      setProgress(100);

      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      console.error("Background removal failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove background. Please try again."
      );
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;

    const a = document.createElement("a");
    a.href = processedUrl;
    a.download = `${selectedFile?.name.split(".")[0]}-no-bg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setProcessedUrl("");
    setProgress(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-accent-yellow mb-2">
                Background Remover
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Remove image backgrounds instantly with{" "}
                <span className="font-semibold text-accent-mint">AI-powered</span> technology
              </p>
            </div>
            <Link
              href="/"
              className="bg-gray-700 text-white px-6 py-2 font-bold uppercase tracking-wider border-2 border-gray-600 hover:bg-gray-600 transition-all"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-card-bg rounded-xl p-6 border-2 border-accent-yellow/20">
            <h2 className="text-xl font-bold text-white mb-4">Upload Image</h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-300
                ${isDragging
                  ? "border-accent-mint bg-accent-mint/10 scale-[1.02]"
                  : "border-gray-600 hover:border-accent-yellow hover:bg-accent-yellow/5"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              {!previewUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-xl bg-gray-700/50">
                      <svg
                        className="w-12 h-12 text-accent-yellow"
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
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white mb-2">
                      {isDragging ? "Drop it here!" : "Drag & Drop"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      or click to browse
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <Image
                      height={300}
                      width={300}
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded-xl shadow-xl border-2 border-accent-mint/50"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-white font-bold truncate">
                    {selectedFile?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={removeBackground}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-[#FFD300] text-[#10162F] px-6 py-3 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? "Processing..." : "Remove Background"}
              </button>

              {processedUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-accent-mint text-[#10162F] px-6 py-3 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Download Result
                </button>
              )}
            </div>

            {/* Loading State */}
            {isProcessing && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-accent-yellow/10 border-2 border-accent-yellow rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-yellow border-t-transparent" />
                <span className="text-accent-yellow text-sm font-semibold">Processing your image...</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500 rounded-lg text-red-400">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-card-bg rounded-xl p-6 border-2 border-accent-mint/20">
            <h2 className="text-xl font-bold text-white mb-4">Result</h2>

            <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 min-h-[400px] flex items-center justify-center bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
              {!processedUrl ? (
                <div className="text-center">
                  <div className="p-4 rounded-xl bg-gray-700/30 inline-block mb-4">
                    <svg
                      className="w-16 h-16 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    {isProcessing
                      ? "Processing your image..."
                      : "Your result will appear here"}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    height={400}
                    width={400}
                    src={processedUrl}
                    alt="Processed"
                    className="max-h-[500px] rounded-xl shadow-2xl"
                  />
                </div>
              )}
            </div>

            {processedUrl && (
              <div className="mt-4 p-4 bg-green-500/10 border-2 border-green-500 rounded-lg text-green-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-bold">Background removed successfully!</p>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
