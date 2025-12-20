"use client";

import { getFeatureFlag } from "@/lib/featureFlags";
import Link from "next/link";
import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  url: string;
  key: string;
  lastModified?: Date;
  size?: number;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400",
];

// Helper function to format relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return diffInYears === 1 ? "last 1 year" : `last ${diffInYears} years`;
  } else if (diffInMonths > 0) {
    return diffInMonths === 1 ? "last 1 month" : `last ${diffInMonths} months`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? "last 1 day" : `last ${diffInDays} days`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? "last 1 hour" : `last ${diffInHours} hours`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? "last 1 minute"
      : `last ${diffInMinutes} minutes`;
  } else {
    return "just now";
  }
}

export default function ImageGallery() {
  const [isEnabledUI, setIsEnabledUI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabledUI(getFeatureFlag("features_enabled"));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* <BetaToggle /> */}
      {isEnabledUI ? <UploadFeature /> : <ComingSoon />}
    </>
  );
}

function UploadFeature() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customFileName, setCustomFileName] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll state
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Download modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<
    "downloading" | "success" | "error"
  >("downloading");
  const [downloadingImage, setDownloadingImage] = useState<ImageData | null>(
    null
  );

  // Preview panel states
  const [previewImage, setPreviewImage] = useState<ImageData | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/images");
      const data = await res.json();

      if (data.images && data.images.length > 0) {
        setImages(data.images);
      } else {
        setImages(
          FALLBACK_IMAGES.map((url, index) => ({
            url,
            key: `fallback-${index}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages(
        FALLBACK_IMAGES.map((url, index) => ({
          url,
          key: `fallback-${index}`,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      // Generate a clean filename without extension for editing
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setCustomFileName(nameWithoutExt);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        // Auto-focus the filename input after a short delay
        setTimeout(() => {
          filenameInputRef.current?.focus();
          filenameInputRef.current?.select();
        }, 100);
      };
      reader.readAsDataURL(file);
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

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setNotification(null);

    try {
      const formData = new FormData();

      // Create a new file with the custom name if it was changed
      const fileExtension = selectedFile.name.split('.').pop() || 'jpg';
      const finalFileName = customFileName.trim()
        ? `${customFileName.trim()}.${fileExtension}`
        : selectedFile.name;

      // Create a new File object with the custom name
      const renamedFile = new File([selectedFile], finalFileName, {
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });

      formData.append("file", renamedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({
          type: "success",
          message: "Image uploaded successfully!",
        });

        await fetchImages();

        setTimeout(() => {
          setSelectedFile(null);
          setPreviewUrl("");
          setCustomFileName("");
          setNotification(null);
          setShowUploadModal(false);
        }, 2000);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"
          }`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCustomFileName("");
    setNotification(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Security: Helper function to sanitize filename and prevent XSS attacks
  // This prevents malicious filenames from executing scripts or causing DOM manipulation
  const sanitizeFilename = (filename: string): string => {
    // Remove any potentially dangerous characters and limit length
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace unsafe chars with underscore
      .substring(0, 100) // Limit length to prevent issues
      .replace(/^\.+/, '') // Remove leading dots
      .replace(/\.+$/, '') || 'download'; // Remove trailing dots, fallback if empty
  };

  // Helper function to generate safe filename from image data
  const generateSafeFilename = (image: ImageData, index: number): string => {
    // Extract filename from URL or key, fallback to generic name
    let baseName = 'image';

    try {
      // Try to extract filename from image key first
      if (image.key && typeof image.key === 'string') {
        const keyParts = image.key.split('/').pop()?.split('.')[0];
        if (keyParts) {
          baseName = keyParts;
        }
      } else {
        // Fallback to URL-based extraction
        const urlPath = new URL(image.url).pathname;
        const urlFilename = urlPath.split('/').pop()?.split('.')[0];
        if (urlFilename) {
          baseName = urlFilename;
        }
      }
    } catch {
      // If URL parsing fails, use fallback
      baseName = 'image';
    }

    // Sanitize the base name and add safe index
    const sanitizedBase = sanitizeFilename(baseName);
    const safeIndex = Math.max(1, Math.min(9999, Math.floor(Math.abs(Number(index))) + 1));

    return `${sanitizedBase}_${safeIndex}.jpg`;
  };

  const handleDownload = async (image: ImageData, index: number) => {
    setDownloadingImage(image);
    setShowDownloadModal(true);
    setDownloadProgress(0);
    setDownloadStatus("downloading");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(image.url)}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();

      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Generate safe filename to prevent XSS
      const safeFilename = generateSafeFilename(image, index);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Use sanitized filename to prevent XSS attacks
      a.download = safeFilename;

      // Use more secure DOM manipulation
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Clean up immediately
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadStatus("success");

      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadingImage(null);
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Download failed:", error);
      setDownloadStatus("error");

      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadingImage(null);
      }, 3000);
    }
  };

  // Extract unique categories from image keys (e.g., "nature-forest-1.jpg" -> "nature")
  const extractCategory = (key: string): string => {
    // Remove file extension
    const nameWithoutExt = key.replace(/\.[^/.]+$/, '');
    // Extract category (text before first hyphen or slash)
    const match = nameWithoutExt.match(/^([^-\/]+)/);
    return match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : 'Other';
  };

  const categories = ['All', ...Array.from(new Set(images.map(img => extractCategory(img.key)))).sort()];

  const filteredImages = images.filter((image) => {
    const matchesSearch = image.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || extractCategory(image.key) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Infinite scroll - load more images
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMoreImages = () => {
    if (isLoadingMore || displayedCount >= filteredImages.length) return;

    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 6, filteredImages.length));
      setIsLoadingMore(false);
    }, 1000);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, filteredImages.length, isLoadingMore, loadMoreImages]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(12);
  }, [searchQuery, selectedCategory]);

  // Calculate progress towards goal
  const TARGET_IMAGES = 2050;
  const progressPercentage = Math.min((images.length / TARGET_IMAGES) * 100, 100);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background text-foreground">
      <div
        className={`max-w-7xl mx-auto mb-8 transition-all duration-300 ${previewImage ? "lg:mr-[420px]" : ""
          }`}
      >
        <div className="flex flex-col gap-4">
          {/* Title and Action Buttons Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-accent-yellow mb-2">
                Stock Image
              </h1>
              <p className="text-foreground/70 text-sm md:text-base">
                Free stock photos and share your image{" "}
                <span className="font-semibold text-sm md:text-base text-accent-yellow">
                  OPEN SOURCE
                </span>
              </p>

              {/* Progress Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="relative group">
                    <span className="cursor-help border-b border-dotted border-foreground/40 hover:border-accent-yellow transition-colors">
                      Mission Complete
                    </span>
                    {/* Tooltip */}
                    {progressPercentage < 100 && (
                      <div className="absolute bottom-full left-0 mb-2 w-180 bg-card-bg border-2 border-accent-yellow/50 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl dark:shadow-accent-yellow/10">
                        <div className="flex items-start gap-2">
                          <div className="text-xs">
                            <p className="text-accent-yellow font-bold mb-1">🌟 Help Us Grow!</p>
                            <p className="text-foreground/80 leading-relaxed">
                              We need <span className="text-accent-yellow font-semibold">{(TARGET_IMAGES - images.length).toLocaleString()} more images</span> to reach {TARGET_IMAGES.toLocaleString()}!
                              Your contributions make this a rich, free resource for everyone.
                            </p>
                          </div>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent-yellow/50"></div>
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-accent-yellow">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-foreground/10 dark:bg-foreground/20 rounded-full overflow-hidden border border-foreground/20 max-w-md">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${progressPercentage >= 50 ? 'bg-green-500' : 'bg-accent-yellow'
                      }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
              <Link
                href="/manage-images"
                className="group relative flex-1 sm:flex-none justify-center bg-gradient-to-br from-[#FFD300] to-[#FFC700] text-[#10162F] px-4 sm:px-6 py-2.5 font-black uppercase tracking-wider border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap flex items-center gap-2 text-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg
                  className="w-4 h-4 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="relative z-10">Manage</span>
              </Link>
              <button
                onClick={() => setShowUploadModal(true)}
                className="group relative flex-1 sm:flex-none justify-center bg-gradient-to-br from-[#FFD300] to-[#FFC700] text-[#10162F] px-4 sm:px-6 py-2.5 font-black uppercase tracking-wider border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap flex items-center gap-2 text-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg
                  className="w-4 h-4 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="relative z-10">Upload</span>
              </button>
            </div>
          </div>

          <hr className="my-2 border-foreground/20" />

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto w-full">
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-bg border-2 border-foreground/20 rounded-lg px-4 py-2.5 pl-10 text-foreground placeholder:text-foreground/50 focus:border-accent-yellow focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Carousel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCategories('left')}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-accent-yellow/10 hover:text-accent-yellow text-foreground/60 transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 overflow-hidden">
              <div
                ref={categoryScrollRef}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <span className="text-sm text-foreground/60 font-semibold flex-shrink-0">Categories:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex-shrink-0 ${selectedCategory === category
                      ? 'bg-accent-yellow text-background shadow-md'
                      : 'bg-card-bg border border-foreground/20 text-foreground/70 hover:border-accent-yellow/50 hover:text-accent-yellow hover:bg-accent-yellow/5'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollCategories('right')}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-accent-yellow/10 hover:text-accent-yellow text-foreground/60 transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className={`max-w-7xl mx-auto transition-all duration-300 ${previewImage ? "lg:mr-[420px]" : ""
            }`}
        >
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {[...Array(12)].map((_, i) => {
              const heights = [250, 300, 350, 280, 320, 270];
              const height = heights[i % heights.length];
              return (
                <div
                  key={i}
                  className="break-inside-avoid bg-card-bg rounded-xl overflow-hidden animate-pulse border border-foreground/5"
                  style={{ height: `${height}px` }}
                >
                  <div className="w-full h-full bg-foreground/10" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={`max-w-6xl container mx-auto transition-all duration-300 ${previewImage ? "lg:mr-[420px]" : ""
            }`}
        >
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 space-y-3">
            {filteredImages.slice(0, displayedCount).map((image, index) => (
              <div
                key={image.key}
                className="break-inside-avoid group relative bg-card-bg rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg dark:hover:shadow-accent-yellow/10 border border-foreground/5 hover:border-accent-yellow/20"
              >
                <Image
                  width={800}
                  height={800}
                  src={image.url}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  unoptimized
                />

                <div className="absolute top-2 right-2 bg-accent-yellow text-background px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                  Free
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-auto">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image, index);
                          }}
                          className="bg-accent-yellow/20 backdrop-blur-sm text-accent-yellow px-3 py-2 rounded-md text-sm font-bold hover:bg-accent-yellow/30 transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow/30 active:scale-95 border border-accent-yellow/30"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(image);
                            setPreviewIndex(index);
                          }}
                          className="bg-accent-mint/20 backdrop-blur-sm text-accent-mint px-3 py-2 rounded-md text-sm font-bold hover:bg-accent-mint/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/30 active:scale-95 border border-accent-mint/30"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading More Skeleton */}
          {isLoadingMore && (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 space-y-3 mt-3">
              {[...Array(6)].map((_, i) => {
                const heights = [250, 300, 350, 280, 320, 270];
                const height = heights[i % heights.length];
                return (
                  <div
                    key={`skeleton-${i}`}
                    className="break-inside-avoid bg-card-bg rounded-lg overflow-hidden animate-pulse border border-foreground/5"
                    style={{ height: `${height}px` }}
                  >
                    <div className="w-full h-full bg-foreground/10" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Intersection Observer Target */}
          {displayedCount < filteredImages.length && (
            <div ref={loadMoreRef} className="h-10 w-full" />
          )}

          {/* End Message */}
          {displayedCount >= filteredImages.length && filteredImages.length > 0 && (
            <div className="text-center py-8 text-foreground/60">
              <p className="text-sm">You&apos;ve reached the end! 🎉</p>
            </div>
          )}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-card-bg rounded-2xl max-w-xl w-full max-h-[85vh] overflow-hidden border-2 border-accent-yellow/20 shadow-2xl shadow-accent-yellow/10 animate-[fade-in-up_0.3s_ease-out] flex flex-col">
            {/* Header with accent border */}
            <div className="bg-gradient-to-r from-card-bg to-card-bg border-b-2 border-accent-yellow/30 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-accent-yellow mb-1">
                  Upload Public Image
                </h2>
                <p className="text-foreground/70 text-sm">
                  Share your images with the community
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  handleReset();
                }}
                className="text-foreground/60 hover:text-accent-yellow hover:bg-accent-yellow/10 p-2 rounded-lg transition-all duration-200"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">

              <form onSubmit={uploadImage} className="p-5">
                {/* Warning Message */}
                <div className="mb-5 bg-white text-background px-4 sm:px-6 py-3 sm:py-2 font-black uppercase tracking-wider border-2 border-foreground/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-normal sm:whitespace-nowrap flex items-center gap-2 rounded-lg animate-[fade-in_0.3s_ease-out]">
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-accent-yellow font-bold text-xs sm:text-sm mb-1 leading-tight break-words">
                        ↘️ Public Upload Warning
                      </h3>
                      <p className="text-accent-yellow text-xs leading-relaxed break-words">
                        <strong>
                          Do not upload{" "}
                          <span className="bg-background/20 px-1 sm:px-2 py-0.5 inline-block text-xs sm:text-sm break-words rounded">
                            sensitive or private data!
                          </span>
                        </strong>
                      </p>

                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                                    relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                                    transition-all duration-300 ease-out
                                    ${isDragging
                      ? "border-accent-mint bg-accent-mint/10 scale-[1.02] shadow-lg shadow-accent-mint/20"
                      : "border-foreground/30 hover:border-accent-yellow hover:bg-accent-yellow/5 hover:shadow-lg"
                    }
                                `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <div className="space-y-4">
                      {/* Icon with glow effect */}
                      <div className="flex justify-center">
                        <div
                          className={`p-3 rounded-xl ${isDragging ? "bg-accent-mint/20" : "bg-foreground/10"
                            } transition-all duration-300`}
                        >
                          <svg
                            className={`w-12 h-12 transition-all duration-300 ${isDragging
                              ? "text-accent-mint scale-110"
                              : "text-accent-yellow"
                              }`}
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
                          {isDragging ? "Drop your image here!" : "Drag & Drop"}
                        </p>

                        <div className="flex items-center justify-center gap-2 text-sm text-foreground/50">

                          <span className="text-accent-yellow font-semibold">Supports: JPG, PNG, GIF, WebP</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button className="bg-accent-yellow text-background px-8 py-4 font-black uppercase tracking-wider border-2 border-foreground/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                          Browse Files
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Preview with enhanced styling - Full width/height */}
                      <div className="relative w-full">
                        <div className="absolute -inset-1 bg-linear-to-r from-accent-yellow via-accent-mint to-accent-blue rounded-2xl blur opacity-30"></div>
                        <Image
                          height={800}
                          width={800}
                          src={previewUrl}
                          alt="Preview"
                          className="relative w-full h-auto max-h-[400px] object-contain rounded-xl shadow-2xl border-2 border-accent-mint/50"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-xl"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* File info card with editable filename */}
                      <div className="text-left bg-gradient-to-br from-card-bg/80 to-card-bg/50 rounded-lg p-4 border border-accent-yellow/20 space-y-4">


                        {/* Editable filename input */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                            Filename
                          </label>
                          <div className="relative">
                            <input
                              ref={filenameInputRef}
                              type="text"
                              value={customFileName}
                              onChange={(e) => {
                                // Remove invalid filename characters
                                const sanitized = e.target.value.replace(/[<>:"/\\|?*]/g, '');
                                setCustomFileName(sanitized);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Enter filename..."
                              className="w-full bg-card-bg border-2 border-foreground/20 rounded-lg px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-accent-yellow focus:outline-none transition-colors text-sm font-medium"
                              maxLength={50}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/50">
                              .{selectedFile?.name.split('.').pop() || 'jpg'}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="flex justify-between w-full items-center">
                              <p className="text-xs text-accent-yellow font-semibold">
                                READY TO UPLOAD
                              </p>
                              <p className="text-xs text-foreground/60">
                                {selectedFile &&
                                  `${(selectedFile.size / 1024).toFixed(2)} KB`}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>



                {/* Notification */}
                {notification && (
                  <div
                    className={`mt-5 p-4 rounded-lg border-2 animate-[fade-in_0.3s_ease-out] ${notification.type === "success"
                      ? "bg-green-500/10 border-green-500 text-green-400"
                      : "bg-red-500/10 border-red-500 text-red-400"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.type === "success" ? (
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg
                            className="w-5 h-5 flex-shrink-0"
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
                        </div>
                      ) : (
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <svg
                            className="w-5 h-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-base mb-1">
                          {notification.type === "success" ? "Success!" : "Error"}
                        </p>
                        <p className="text-sm">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={!selectedFile || isUploading || !customFileName.trim()}
                    className={`
                    flex-1 py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 ease-out
                    ${selectedFile && !isUploading && customFileName.trim()
                        ? "bg-[#FFD300] text-[#10162F] border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                      }
                  `}
                  >

                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 font-black uppercase tracking-wider">
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Now
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>


          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && downloadingImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-card-bg rounded-2xl max-w-md w-full border-2 border-accent-yellow/20 shadow-2xl shadow-accent-yellow/10 animate-[fade-in-up_0.3s_ease-out] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-yellow/10 to-accent-mint/10 border-b-2 border-accent-yellow/30 p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-yellow/20 rounded-xl">
                  <svg
                    className="w-6 h-6 text-accent-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {downloadStatus === "downloading" && "Downloading Image"}
                    {downloadStatus === "success" && "Download Complete!"}
                    {downloadStatus === "error" && "Download Failed"}
                  </h3>
                  <p className="text-sm text-foreground/60">
                    {downloadStatus === "downloading" && "Please wait..."}
                    {downloadStatus === "success" && "Image saved successfully"}
                    {downloadStatus === "error" && "Something went wrong"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Image Preview */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-yellow via-accent-mint to-accent-blue rounded-xl blur opacity-20"></div>
                <div className="relative bg-card-bg/50 rounded-xl p-3 border border-accent-yellow/20">
                  <Image
                    width={400}
                    height={300}
                    src={downloadingImage.url}
                    alt="Downloading"
                    className="w-full h-48 object-cover rounded-lg"
                    unoptimized
                  />
                </div>
              </div>

              {/* Progress Section */}
              {downloadStatus === "downloading" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/80 font-semibold text-sm">
                      Progress
                    </span>
                    <span className="text-accent-yellow font-bold text-lg">
                      {downloadProgress}%
                    </span>
                  </div>
                  <div className="h-3 bg-foreground/10 rounded-full overflow-hidden border border-foreground/20">
                    <div
                      className="h-full bg-accent-yellow transition-all duration-300 ease-out shadow-lg"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-foreground/60 text-sm">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Downloading...</span>
                  </div>
                </div>
              )}

              {/* Success State */}
              {downloadStatus === "success" && (
                <div className="bg-green-500/10 border-2 border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <svg
                        className="w-6 h-6 text-green-400"
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
                    <div>
                      <p className="text-green-400 font-bold">Success!</p>
                      <p className="text-green-300/80 text-sm">
                        Your image has been downloaded
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {downloadStatus === "error" && (
                <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <svg
                        className="w-6 h-6 text-red-400"
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
                    </div>
                    <div>
                      <p className="text-red-400 font-bold">Download Failed</p>
                      <p className="text-red-300/80 text-sm">
                        Please try again later
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              {downloadStatus !== "downloading" && (
                <button
                  onClick={() => {
                    setShowDownloadModal(false);
                    setDownloadingImage(null);
                  }}
                  className="w-full py-3 px-6 rounded-lg font-bold text-base bg-accent-yellow text-background hover:bg-accent-yellow/90 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel - Slides in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] sm:max-w-[400px] bg-card-bg border-l-2 border-accent-yellow/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${previewImage ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {previewImage && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-yellow/10 to-accent-mint/10 border-b-2 border-accent-yellow/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-mint/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-accent-mint"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    IMAGE PREVIEW
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-foreground/60 hover:text-accent-yellow hover:bg-accent-yellow/10 p-2 rounded-lg transition-all duration-200"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image Display - Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-yellow via-accent-mint to-accent-blue rounded-xl blur opacity-20"></div>
                <div className="relative bg-card-bg/50 rounded-xl p-2 border border-accent-yellow/20">
                  <Image
                    width={800}
                    height={800}
                    src={previewImage.url}
                    alt="Preview"
                    className="w-full h-auto max-h-[45vh] sm:max-h-none rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              </div>

              {/* Image Info */}
              <div className="bg-card-bg/50 rounded-lg p-4 border border-accent-yellow/20 space-y-3">
                <h4 className="text-accent-yellow font-bold text-sm uppercase tracking-wider">
                  Image Details
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/60">Status:</span>
                    <span className="text-background px-2 py-0.5 rounded-xl font-semibold bg-accent-yellow">
                      Free
                    </span>
                  </div>

                  {previewImage.size && (
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/60">Size:</span>
                      <span className="text-foreground font-semibold">
                        {(previewImage.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}

                  {previewImage.lastModified && (
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/60">Last Modified:</span>
                      <span className="text-foreground font-semibold">
                        {getRelativeTime(new Date(previewImage.lastModified))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="border-t-2 border-accent-yellow/20 bg-card-bg p-4 space-y-2">
              {/* Download Button */}
              <button
                onClick={() => handleDownload(previewImage, previewIndex)}
                className="bg-[#FFD300] w-full flex justify-center text-[#10162F] px-4 sm:px-6 py-3 sm:py-2 text-sm sm:text-base font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap items-center gap-2"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Image
              </button>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newIndex =
                      previewIndex > 0 ? previewIndex - 1 : images.length - 1;
                    setPreviewIndex(newIndex);
                    setPreviewImage(images[newIndex]);
                  }}
                  className="bg-[#FFD300] text-[#10162F] px-4 sm:px-6 py-3 sm:py-2 w-full justify-center font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => {
                    const newIndex =
                      previewIndex < images.length - 1 ? previewIndex + 1 : 0;
                    setPreviewIndex(newIndex);
                    setPreviewImage(images[newIndex]);
                  }}
                  className="bg-[#FFD300] w-full justify-center text-[#10162F] px-4 sm:px-6 py-3 sm:py-2 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                >
                  Next
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay when preview is open */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/60 sm:bg-black/20 sm:dark:bg-black/20 z-30 transition-opacity duration-300"
          onClick={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#3B00B9 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-3xl text-center space-y-4 relative z-10">
        {/* Icon */}
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1F2937] mx-auto -rotate-6 border-4 border-accent-mint shadow-[8px_8px_0px_0px_#FFD300] flex items-center justify-center transition-transform hover:rotate-0 duration-300">
            <span className="text-4xl md:text-5xl">🚀</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
          COMING SOON
        </h1>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-accent-yellow text-[#10162F] font-black text-lg uppercase tracking-widest hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#FFFFFF] transition-all border-2 border-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
