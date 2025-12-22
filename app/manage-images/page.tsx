"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ImageData {
    url: string;
    key: string;
    lastModified?: string;
    size?: number;
}


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
        return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
    } else if (diffInMonths > 0) {
        return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    } else if (diffInDays > 0) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
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

export default function ManageImages() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    // Dashboard states
    const [images, setImages] = useState<ImageData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ImageData | null>(null);

    // Rename modal state
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [imageToRename, setImageToRename] = useState<ImageData | null>(null);
    const [newFilename, setNewFilename] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Helper function to extract filename from key
    const getDisplayFilename = (key: string): string => {
        // Remove the "uploads/" prefix and return just the filename
        return key.replace(/^uploads\//, '');
    };

    const filteredImages = images.filter((img) =>
        getDisplayFilename(img.key).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Check if user is authorized
    useEffect(() => {
        if (user?.email) {
            checkAuthorization(user.email);
        } else if (!loading && !user) {
            setIsAuthorized(false);
        }
    }, [user, loading]);

    // Fetch images when user is authenticated and authorized
    useEffect(() => {
        if (user && isAuthorized) {
            fetchImages();
        }
    }, [user, isAuthorized]);

    // Handle redirect for unauthenticated users
    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
        }
    }, [user, loading, router]);

    const checkAuthorization = async (email: string) => {
        try {
            const response = await fetch('/api/check-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, page: 'manage-images' }),
            });

            const data = await response.json();
            setIsAuthorized(data.authorized);
        } catch (error) {
            console.error('Error checking authorization:', error);
            setIsAuthorized(false);
        }
    };

    const fetchImages = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("/api/images");
            const data = await res.json();
            if (data.images) {
                setImages(data.images);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (image: ImageData) => {
        setImageToDelete(image);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        const key = imageToDelete.key;
        setShowDeleteModal(false);
        setDeletingKey(key);

        try {
            const res = await fetch("/api/images", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            if (res.ok) {
                setImages((prev) => prev.filter((img) => img.key !== key));
            } else {
                alert("Failed to delete image");
            }
        } catch (error) {
            alert("Error deleting image");
        } finally {
            setDeletingKey(null);
            setImageToDelete(null);
        }
    };

    const handleRenameClick = (image: ImageData) => {
        setImageToRename(image);
        // Set the filename without the "uploads/" prefix for editing
        setNewFilename(getDisplayFilename(image.key));
        setShowRenameModal(true);
    };

    const confirmRename = async () => {
        if (!imageToRename || !newFilename || newFilename === getDisplayFilename(imageToRename.key)) return;

        setIsRenaming(true);
        try {
            // Add the "uploads/" prefix back when sending to API
            const newKey = `uploads/${newFilename}`;

            const res = await fetch("/api/images", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldKey: imageToRename.key,
                    newKey: newKey
                }),
            });

            if (res.ok) {
                // Refetch all images to get the correct URLs
                await fetchImages();
                setShowRenameModal(false);
                setImageToRename(null);
                setNewFilename("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to rename image");
            }
        } catch (error) {
            alert("Error renaming image");
        } finally {
            setIsRenaming(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-yellow mx-auto mb-4"></div>
                    <p className="text-foreground/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl pb-8 font-bold text-foreground mb-2">Access Denied</h1>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-accent-yellow text-background px-6 py-3 font-black uppercase tracking-wider border-2 border-foreground shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none transition-all"
                            >
                                Go Home
                            </button>
                            <button
                                onClick={signOut}
                                className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 font-semibold rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-accent-yellow">Image Management</h1>
                        <p className="text-foreground/60 mt-1">Manage your cloud storage</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search images..."
                                className="bg-card-bg border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-foreground/50 focus:outline-none transition-all w-64"
                            />
                            <svg
                                className="w-5 h-5 text-foreground/50 absolute left-3 top-1/2 -translate-y-1/2"
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
                        <button
                            onClick={signOut}
                            className="bg-accent-yellow text-background px-6 py-2 font-black uppercase tracking-wider border-2 border-foreground shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-card-bg rounded-2xl border border-foreground/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-foreground/5 border-b border-foreground/10">
                                <tr>
                                    <th className="p-4 font-semibold text-foreground/70">Preview</th>
                                    <th className="p-4 font-semibold text-foreground/70">Filename / Key</th>
                                    <th className="p-4 font-semibold text-foreground/70">Size</th>
                                    <th className="p-4 font-semibold text-foreground/70">Uploaded</th>
                                    <th className="p-4 font-semibold text-foreground/70 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/10">
                                {isFetching ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-foreground/60">
                                            Loading images...
                                        </td>
                                    </tr>
                                ) : filteredImages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-foreground/60">
                                            {searchQuery ? "No matching images found" : "No images found"}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedImages.map((img) => (
                                        <tr key={img.key} className="hover:bg-foreground/5 transition-colors">
                                            <td className="p-4">
                                                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-background border border-foreground/20">
                                                    <Image
                                                        src={img.url}
                                                        alt={img.key}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono text-sm text-accent-yellow truncate max-w-[200px]" title={getDisplayFilename(img.key)}>
                                                    {getDisplayFilename(img.key)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-foreground/60">
                                                {img.size ? (img.size / 1024).toFixed(2) + " KB" : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-foreground/60">
                                                {img.lastModified ? getRelativeTime(new Date(img.lastModified)) : "-"}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRenameClick(img)}
                                                        className="bg-accent-yellow text-background px-6 py-2 font-black uppercase tracking-wider border-2 border-foreground shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(img)}
                                                        disabled={deletingKey === img.key}
                                                        className="bg-accent-yellow text-background px-6 py-2 font-black uppercase tracking-wider border-2 border-foreground shadow-[4px_4px_0px_0px_theme(colors.foreground)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                                                    >
                                                        {deletingKey === img.key ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredImages.length > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-foreground/5 border-t border-foreground/10">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-foreground/60">
                                    Showing <span className="text-accent-yellow font-semibold">{startIndex + 1}</span> to{" "}
                                    <span className="text-accent-yellow font-semibold">{Math.min(endIndex, filteredImages.length)}</span> of{" "}
                                    <span className="text-accent-yellow font-semibold">{filteredImages.length}</span> images
                                </span>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="itemsPerPage" className="text-sm text-foreground/60">
                                        Per page:
                                    </label>
                                    <select
                                        id="itemsPerPage"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg px-3 py-1 text-foreground focus:outline-none transition-all"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            // Show first page, last page, current page, and pages around current
                                            return (
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                            );
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis between non-consecutive pages
                                            const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                            return (
                                                <div key={page} className="flex items-center gap-1">
                                                    {showEllipsisBefore && (
                                                        <span className="px-2 text-foreground/50">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${currentPage === page
                                                            ? "bg-accent-yellow text-background"
                                                            : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRight />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rename Modal */}
            {showRenameModal && imageToRename && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card-bg rounded-2xl max-w-md w-full border-2 border-accent-yellow/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 text-accent-yellow">
                                <div className="p-3 bg-accent-yellow/10 rounded-xl">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Rename Image</h3>
                                    <p className="text-sm text-foreground/60">Enter a new filename</p>
                                </div>
                            </div>

                            <div className="relative aspect-video bg-background rounded-xl overflow-hidden border border-foreground/20">
                                <Image
                                    src={imageToRename.url}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/60 mb-2">Filename</label>
                                <input
                                    type="text"
                                    value={newFilename}
                                    onChange={(e) => setNewFilename(e.target.value)}
                                    className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none transition-all"
                                    placeholder="image.jpg"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowRenameModal(false)}
                                    className="flex-1 px-4 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRename}
                                    disabled={isRenaming || !newFilename || newFilename === getDisplayFilename(imageToRename.key)}
                                    className="flex-1 px-4 py-3 bg-accent-yellow hover:bg-accent-yellow/90 text-background rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRenaming ? "Renaming..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && imageToDelete && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card-bg rounded-2xl max-w-md w-full border-2 border-red-500/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 text-red-400">
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Delete Image?</h3>
                                    <p className="text-sm text-foreground/60">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="relative aspect-video bg-background rounded-xl overflow-hidden border border-foreground/20">
                                <Image
                                    src={imageToDelete.url}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-red-300 text-sm font-medium">
                                    Are you sure you want to permanently delete <span className="text-foreground font-mono">{getDisplayFilename(imageToDelete.key)}</span>?
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
