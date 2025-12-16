"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";


export default function RemoveBackgroundPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
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
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-accent-yellow mb-2">
                Background Remover
              </h1>
              <p className="text-gray-400 dark:text-gray-300 text-sm md:text-base">
                Remove image backgrounds instantly with{" "}
                <span className="font-semibold text-accent-yellow/75">IMGLY Background Removal</span> technology
              </p>
            </div>
           
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-card-bg rounded-xl p-6 border-2 border-accent-yellow">
            <h2 className="text-xl text-accent-yellow font-bold mb-4">Upload Image</h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-0 rounded-xl p-8 text-center cursor-pointer
                transition-all duration-300
                ${isDragging
                  ? "border-accent-mint bg-accent-mint/10 scale-[1.02]"
                  : "border-gray-600 dark:border-gray-500 hover:border-accent-yellow hover:border-accent-yellow border-1 border-dashed border-gray-400"
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
                    <div className="p-3 rounded-xl dark:bg-gray-600/50">
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
                    <p className="text-xl font-bold text-foreground mb-2">
                      {isDragging ? "Drop it here!" : "Drag & Drop"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 text-sm">
                      or click to browse
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full">
                    <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden border-2 border-accent-mint/50 shadow-xl">
                      <Image
                        fill
                        src={previewUrl}
                        alt="Preview"
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-lg z-10"
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
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-foreground font-bold text-sm truncate text-center">
                      {selectedFile?.name}
                    </p>
                  </div>
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

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500 rounded-lg text-red-400 dark:text-red-300">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-card-bg rounded-xl p-6 border-2 border-accent-yellow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-accent-yellow">Result</h2>
                
              </div>
              
            
            </div>

            <div className={`relative border-0 border-gray-600 dark:border-gray-500 rounded-xl p-8 min-h-[400px] flex items-center justify-center transition-all duration-300 ${
              previewMode === 'light' 
                ? 'bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-white'
                : 'bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-gray-900'
            }`}>
              {isProcessing ? (
                /* Loading State */
                <div className="text-center space-y-6">
                  <div className="relative">
                    {/* Animated Processing Icon */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-accent-yellow/20 rounded-full"></div>
                      <div className="absolute w-20 h-20 border-4 border-transparent border-t-accent-yellow rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-accent-yellow"
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
                    </div>
                  </div>
                  
                  {/* Processing Text with Animation */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-accent-yellow">
                      Processing Image
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Removing background
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>

                  
                </div>
              ) : !processedUrl ? (
                <div className="text-center">
                  <div className="p-4 rounded-xl inline-block mb-4">
                    <svg
                      className="w-16 h-16 text-accent-yellow dark:text-accent-yellow"
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
                  <p className="text-gray-500 dark:text-gray-400">
                    Your result will appear here
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
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg text-green-400 dark:text-green-300">
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
                
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
